from flask import Flask
app = Flask(__name__)

@app.route("/create_geo_hash",methods=['GET'])
def create_geo_hash():
    if not latidue or not longitide or not precession or precession <= 0:
        return False

if __name__ == "__main__":
    app.run()