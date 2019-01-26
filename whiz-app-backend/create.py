from flask import Flask,jsonify,request

app = Flask(__name__)
@app.route("/create_bathroom", methods=['GET'])
def create_bathroom():
	longitude 	= request.args.get('longitude')
	latitude 	= request.args.get('latitude')
	precision 	= 12
	geo_hash 	= calculate_geo_hash(longitude,latitude,precision)

	return geo_hash

def geo_hash(latidue,longitide):
    #validate input
    precession = 12
    geohash = ""
    max_lat = 90.0
    min_lat = -90.0
    max_long = 180.0
    min_long = -180.0
    base32 = '0123456789bcdefghjkmnpqrstuvwxyz'
    evenBit = True
    bits = 0
    index = 0
    result = ""
    while len(geohash)<precession:
        if evenBit:
            #bisect E-W longitude
            mid_long = (min_long+max_long)/2
            if longitide >= mid_long:
                index = index*2+1
                min_long = mid_long
            else:
                index = index*2
                max_long = mid_long
        else:
            #bisect N-S latidue
            mid_lat = (min_lat+max_lat)/2
            if latidue >= mid_lat:
                index = index*2+1
                min_lat = mid_lat
            else:
                index = index*2
                max_lat = mid_lat
        evenBit = not evenBit
        
        
        bits += 1
        if bits == 5:
            result += hash_to_binary(index)
            geohash += base32[index]
            bits = 0
            index = 0
        
    return result
def hash_to_binary(value):
    bit = ""
    bits = 4
    for exp in range(bits,-1,-1):
        bit += str(value//(2**exp))
        if value//(2**exp):
            value -= 2**exp
    return bit


if __name__=="__main__":
	app.run()