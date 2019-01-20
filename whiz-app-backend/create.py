from flask import Flask,jsonify,request

app = Flask(__name__)

@app.route("/")
def create_bathroom():
	return "Bathroom created"

if __name__=="__main__":
	app.run()