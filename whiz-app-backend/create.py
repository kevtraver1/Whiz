from flask import Flask,jsonify,request
import boto3
import uuid
import json
import os
import datetime
app = Flask(__name__)

@app.route("/create_bathroom", methods=['GET','POST'])
def create_bathroom():
    #initiate varables from incoming parameters and handle errors from input
    try:
        error_event     = json.dumps({"event":request.environ.get('lambda.event', None)})
        latitude 	    = float(request.args.get('latitude'))
        longitude 	    = float(request.args.get('longitude'))
        user_id 	    = str(request.args.get('username'))
        rating 		    = float(request.args.get('rating'))
        review          = str(request.args.get('review'))
        address         = str(request.args.get('address'))
        creation_date   = datetime.datetime.now()
        if user_id == "None" or address == "None":
            return jsonify({"Error":"Invalid Input"})
    except ValueError:
        return jsonify({"Error":"Invalid Input"})
    except Exception as e:
        return jsonify({"Error":str(e),"Dict":error_event})  
    try:
        precision 	= 12#max precsion in 37.2mm	×	18.6mm accuracy
        geo_hash 	= calculate_geo_hash(longitude,latitude,precision,"deciaml")
        #geo_hash is decimal 
        #create geo_hash_key (first 4 number in hash)
        #hash//10^(lenght-4) will get the first 4 numbers in geo_hash
        geo_hash_len= len(str(abs(geo_hash)))
        geo_hash_key= geo_hash//(10**(geo_hash_len-4))
        #create hash to send to dynomadb, format is {type:value} 
        # S for string N for number L for list M is for map
        bathroom_entry = {}
        bathroom_entry["User_Id"] 		= {"S":str(user_id)}
        bathroom_entry["Bathroom_Id"] 	= {"S":str(uuid.uuid4())}
        bathroom_entry["Latitude"]		= {"N":str(latitude)}
        bathroom_entry["Longitude"] 	= {"N":str(longitude)}
        bathroom_entry["Rating"]		= {"N":str(rating)}
        #Reviws will be map of users and thier rating and revieww maped to their user id
        bathroom_entry["Reviews"]		= {"M":{str(user_id):{"M":{"User_Review": {"S": str(review)},"User_Rating": {"N": str(rating)}}}}}#{"M":{str(user_id):{"S":str(review)}}}
        bathroom_entry["Rating_Weight"]	= {"N":str(1)}
        bathroom_entry["Geo_Hash_Key"]	= {"N":str(geo_hash_key)}
        bathroom_entry["Geo_Hash"]		= {"N":str(geo_hash)}
        bathroom_entry["Creation_Date"] = {"S":str(creation_date)}
        bathroom_entry["Address"]       = {"S":str(address)}
        #establish connection to dynamodb
        dynamodb = boto3.client('dynamodb')
        #put item into dynamdb and return https status of request
        dynamodb.put_item(TableName=os.environ['WhizBathroomTable'], Item=bathroom_entry)
    except Exception as e:
        return jsonify({"Error":str(e)})
    return jsonify(bathroom_entry)
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