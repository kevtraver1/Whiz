from flask import Flask,jsonify,request
import boto3
from boto3.dynamodb.conditions import Key, Attr
import simplejson as json
import os
app = Flask(__name__)

@app.route("/list_bathrooms",methods=['GET'])
def list_bathrooms():
	#initiate varables from incoming parameters and handle errors
	try:
		latitude 	= float(request.args.get('latitude'))
		longitude 	= float(request.args.get('longitude'))
		radius 		= int(request.args.get('radius'))
	except ValueError:
		return jsonify({"Error":"Invalid Input"})
	except Exception as e:
		return jsonify({"Error":str(e)})
	try:
		precision 	= 12#max precsion in 37.2mm	×	18.6mm accuracy
		geo_hash 	= calculate_geo_hash(longitude,latitude,precision,"deciaml")
		geo_hash_len= len(str(abs(geo_hash)))
		geo_hash_key= geo_hash//(10**(geo_hash_len-4))
	except Exception as e:
		return jsonify({"Error":str(e)})
	#establish connection to dynomdb table
	dynamodb    = boto3.resource('dynamodb')
	table       = dynamodb.Table(os.environ['WhizBathroomTable'])
	index_name  = os.environ['GeoHashIndex']
	#query table for bathroom within radius given by user
	#return json, query returns list so use first element even tho Bathroom_Id is unique
	response    = table.query(IndexName=index_name,KeyConditionExpression=Key('Geo_Hash_Key').eq(geo_hash_key)& Key('Geo_Hash').between(geo_hash-radius, geo_hash+radius))
	return json.dumps(response['Items'])
	
#convert radius in miles to geo_hash radius
def convert_radius(radius):
	pass
#calcualte geo_hash based on users longitude,latitude,and pression
def calculate_geo_hash(latidue,longitude,precession,result_type):
    """
    https://en.wikipedia.org/wiki/Geohash alogrithm source
    Input:
        latitude(float):lattiude of postion
        longitude(float):longitude of postion
        precession(int):how long the hash is, longer the more accurate
        result_type(str):return as hash,decimal,binary
    Output:
        return based on result type but will be geohash for latitude and longitude and lenght of hash based off preccssion
    """
    #intate varibales needed for geo-hash calcualtions
    geo_hash    = "" #geo hash base 32
    base32      = '0123456789bcdefghjkmnpqrstuvwxyz'
    geo_bits    = "" #geo hash base 2
    max_lat     = 90.0
    min_lat     = -90.0
    max_long    = 180.0
    min_long    = -180.0
    latlng_flag = True #swap between longitude and latiude flag
    bits        = 0
    index       = 0
    result      = None
    #loop until geo_hash has reached desired precession
    while len(geo_hash)<precession:
        #alternate bewteen longitude bits and latitude bits, even for long and odd for lat of each bit
        if latlng_flag:
            #bisect E-W longitude
            #calcualte mid point between current min max longitude
            mid_long = (min_long+max_long)/2
            #if longitude bigger then mid then mid is new minium value,else its new maxium value
            #set bit to one if larger and zero for smaller
            if longitude >= mid_long:
                index = index*2+1
                min_long = mid_long
                geo_bits += "1"
            else:
                index = index*2
                max_long = mid_long
                geo_bits += "0"
        else:
            #bisect N-S latidue
            #calcualte mid point between current min max latidue
            mid_lat = (min_lat+max_lat)/2
            #if latidue bigger then mid then mid is new minium value,else its new maxium value
            if latidue >= mid_lat:
                index = index*2+1
                min_lat = mid_lat
                geo_bits += "1"
            else:
                index = index*2
                max_lat = mid_lat
                geo_bits += "0"
        #flip to go between longitude and latitde 
        latlng_flag = not latlng_flag
        
        #to genearte hash base 32
        bits += 1
        if bits == 5:
            #5 bits gives us a character: append it and start over
            geo_hash += base32[index]
            bits = 0
            index = 0
    #return based of type requested
    if result_type == "deciaml":
        result = int(geo_bits,2)
    elif result_type == "binary":
        result = geo_bits
    elif result_type == "hash":
        result = geo_hash
    return result

if __name__=="__main__":
    app.run()