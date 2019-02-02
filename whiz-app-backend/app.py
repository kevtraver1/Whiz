from flask import Flask, jsonify,render_template, request, redirect, Response, json

app = Flask(__name__)

@app.route("/", methods=['GET','POST'])
def home():
	return jsonify({"Response":request.args.get("test")})


if __name__=="__main__":
	#app.debug = True
	app.run()
