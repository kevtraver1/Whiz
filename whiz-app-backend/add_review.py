from flask import Flask, jsonify,render_template, request, redirect, Response, json

app = Flask(__name__)

@app.route("/", methods=['GET','POST'])
def home():
	try:
		#my_context = json.dumps(request.environ.get('lambda.context', None))
		#context = request.environ.get('lambda.context', None)
		#user_id = context[]
		#context_serializable = {k:v for k, v in context.__dict__.items() if type(v) in [int, float, bool, str, list, dict]}
		#json.dumps(context_serializable)
		my_event = json.dumps({"event":request.environ.get('lambda.event', None)})#request.environ['event']
		#event = request.environ.get('lambda.event', None)
	except Exception as e:
		return jsonify({"Error failed":str(e)})
	return jsonify({"Event":my_event})#,"Context":context})


if __name__=="__main__":
	#app.debug = True
	app.run()
