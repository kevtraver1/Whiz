from flask import Flask,jsonify,request
import boto3
from boto3.dynamodb.conditions import Key, Attr
import simplejson as json
import os
app = Flask(__name__)

@app.route("/get_bathroom",methods=['GET'])
def get_bathroom():
	#initiate varables from incoming parameters and handle errors
	try:
		bathroom_id 	= str(request.args.get('bathroom_id'))
	except ValueError:
		return jsonify({"Error":"Invalid Input"})
	except Exception as e:
		return jsonify({"Error":str(e)})
	#establish connection to dynomdb table
	dynamodb = boto3.resource('dynamodb')
	table = dynamodb.Table(os.environ['WhizBathroomTable'])
	#query table for bathroom with bathroom_id provided by parameters
	#return json, query returns list so use first element even tho Bathroom_Id is unique
	response = table.query(KeyConditionExpression=Key('Bathroom_Id').eq(bathroom_id))
	item = response['Items'][0]
	return json.dumps(item)


if __name__=="__main__":
	app.run()
