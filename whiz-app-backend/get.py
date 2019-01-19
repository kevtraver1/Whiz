from flask import Flask,jsonify,request

app = Flask(__name__)

@app.route("/")
def home():
	return "Welcome to My app"

if __name__=="__main__":
	app.run()