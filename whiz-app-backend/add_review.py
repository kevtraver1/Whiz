from flask import Flask, jsonify,render_template, request, redirect, Response, json
import boto3
from boto3.dynamodb.conditions import Key, Attr
import simplejson as json
import os
import decimal

app = Flask(__name__)

@app.route("/add_review", methods=['GET','POST'])
def home():
	try:
		#my_context = json.dumps(request.environ.get('lambda.context', None))
		#context = request.environ.get('lambda.context', None)
		#user_id = context[]
		#context_serializable = {k:v for k, v in context.__dict__.items() if type(v) in [int, float, bool, str, list, dict]}
		#json.dumps(context_serializable)
		error_event = json.dumps({"event":request.environ.get('lambda.event', None)})#request.environ['event']
		user_rating 	= str(request.args.get('user_rating'))
		user_review 	= str(request.args.get('user_review'))
		user_id 	    = str(request.args.get('username'))
		bathroom_id 	= str(request.args.get('bathroom_id'))
	except ValueError:
		return jsonify({"Error":"Invalid Input"})
	except Exception as e:
		return jsonify({"Error":str(e),"Dict":error_event})  
	try:
		#establish connection to dynomdb table
		dynamodb = boto3.resource('dynamodb')
		table = dynamodb.Table(os.environ['WhizBathroomTable'])
		#need to get existing rating,user that created it, and rating weight
		response = table.query(KeyConditionExpression=Key('Bathroom_Id').eq(bathroom_id))
		item = response['Items'][0]
		rating = item['Rating']
		rating_weight = item['Rating_Weight']
		#calculate new rating and new weight
		new_rating = (rating*rating_weight+int(user_rating))/(rating_weight+1)
		new_weight = rating_weight+1
		create_id = item['User_Id']
		#update rating, weight, update or add review/rating for user  
		response = table.update_item(
    		Key={
        		'Bathroom_Id': bathroom_id,
				'User_Id':	   create_id
    		},
    		UpdateExpression="set Rating_Weight = :rw, Rating=:r, Reviews.{0}.User_Rating=:ur, Reviews.{0}.User_Review=:u".format(user_id),
    		ExpressionAttributeValues={
        		':rw': decimal.Decimal(new_weight),
        		':r': decimal.Decimal(new_rating),
				':ur':decimal.Decimal(user_rating),
				':u':user_review

    		},
    		ReturnValues="UPDATED_NEW"
		)
	except Exception as e:
		return jsonify({"Error":str(e)})
	return json.dumps(response)

if __name__=="__main__":
	#app.debug = True
	app.run()
