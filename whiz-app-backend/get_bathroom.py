from flask import Flask,jsonify,request

app = Flask(__name__)

@app.route("/",methods=['GET','POST'])
def home():
	return jsonify({"lat":"latitude","long":"longitude"})

if __name__=="__main__":
	app.run()
