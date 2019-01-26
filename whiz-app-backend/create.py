from flask import Flask,jsonify,request
import boto3
import uuid
app = Flask(__name__)
@app.route("/create_bathroom", methods=['GET'])
def create_bathroom():
	latitude 	= float(request.args.get('latitude'))
	longitude 	= float(request.args.get('longitude'))
	user_id 	= request.args.get('user_id')
	rating 		= float(request.args.get('rating'))
	precision 	= 12
	geo_hash 	= calculate_geo_hash(longitude,latitude,precision,"deciaml")
	#geo_hash is decimal 
	#create geo_hash_key (first 4 number in hash)
	#hash//10^(lenght-4) will get the first 4 numbers in geo_hash
	geo_hash_len= len(str(abs(geo_hash)))
	geo_hash_key= geo_hash//(10**(geo_hash_len-4))

	dynamodb = boto3.client('dynamodb')
	bathroom_entry = {}
	bathroom_entry["User_Id"] 		= {"S":user_id}
	bathroom_entry["Bathroom_Id"] 	= {"S":str(uuid.uuid4())}
	bathroom_entry["Latitude"]		= {"N":str(latitude)}
	bathroom_entry["Longitude"] 	= {"N":str(longitude)}
	bathroom_entry["Rating"]		= {"N":str(rating)}
	bathroom_entry["Rating_Weight"]	= {"N":str(1)}
	bathroom_entry["Geo_Hash_Key"]	= {"N":str(geo_hash_key)}
	bathroom_entry["Geo_Hash"]		= {"N":str(geo_hash)}	
	dynamodb.put_item(TableName='Whiz-Bathroom-Table', Item=bathroom_entry)
	
	return jsonify(bathroom_entry)

def calculate_geo_hash(latidue,longitude,precession,result_type):
    #validate input
    geo_hash = ""
    max_lat = 90.0
    min_lat = -90.0
    max_long = 180.0
    min_long = -180.0
    base32 = '0123456789bcdefghjkmnpqrstuvwxyz'
    evenBit = True
    bits = 0
    index = 0
    result = False
    geo_bits = ""
    while len(geo_hash)<precession:
        if evenBit:
            #bisect E-W longitude
            mid_long = (min_long+max_long)/2
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
            mid_lat = (min_lat+max_lat)/2
            if latidue >= mid_lat:
                index = index*2+1
                min_lat = mid_lat
                geo_bits += "1"
            else:
                index = index*2
                max_lat = mid_lat
                geo_bits += "0"
        evenBit = not evenBit
        
        
        bits += 1
        if bits == 5:
            geo_hash += base32[index]
            bits = 0
            index = 0
    if result_type == "deciaml":
        result = int(geo_bits,2)
    elif result_type == "binary":
        result = geo_bits
    elif result_type == "hash":
        result = geo_hash
    return result




if __name__=="__main__":
	app.run()