from flask import Flask,jsonify,request

app = Flask(__name__)
@app.route("/create_bathroom", methods=['GET'])
def create_bathroom():
	longitude 	= request.args.get('longitude')
	latitude 	= request.args.get('latitude')
	precision 	= 12
	geo_hash 	= calculate_geo_hash(longitude,latitude,precision)

	return geo_hash

def calculate_geo_hash(longitude,latitude,precision):
	#validate inputs
	#initate variables
	long_max	= 90
	long_min	= -90
	lat_max		= 180
	lat_min		= -180
	result 		= ""
	#while len(result) < precision:
	#
	return "Geo Hash calculating"


if __name__=="__main__":
	app.run()