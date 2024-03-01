from flask import Flask, render_template, jsonify
from pymongo import MongoClient
import json
from bson import json_util
from config import MONGO_AMIR_URL

app = Flask(__name__)

# MongoDB settings
mongo_uri = MONGO_AMIR_URL
client = MongoClient(MONGO_AMIR_URL)
db = client['opendata']
collection = db['crime']

@app.route('/')
def index():
    return render_template('rough index.html')

@app.route('/data')
def data():
    # Fetch the GeoJSON data from MongoDB
    crime_data = collection.find()  
    # Convert the MongoDB document to a JSON string
    crime_data_json = [json.dumps(doc, default=json_util.default) for doc in crime_data]
    return jsonify(crime_data_json)

if __name__ == '__main__':
    app.run(debug=True)
