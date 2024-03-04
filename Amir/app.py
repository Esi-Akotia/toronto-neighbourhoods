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

# Separate collections for crime, schools, and parks
crime_collection = db['crime']
school_collection = db['school']  
parks_collection = db['parks']    

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/crimedata')
def crimedata():
    # Fetch the GeoJSON data from MongoDB's crime collection
    crime_data = crime_collection.find()
    crime_data_json = [json.loads(json.dumps(doc, default=json_util.default)) for doc in crime_data] ### Added json.loads so the data on the API endpoint is more clear 
    return jsonify(crime_data_json)

@app.route('/schooldata')
def schooldata():
    # Fetch the GeoJSON data from MongoDB's school collection
    school_data = school_collection.find()
    
    # Convert MongoDB cursor to a list of dictionaries
    school_data_list = list(school_data)
    
    # Use bson.json_util.dumps to serialize the list of dictionaries to JSON format
    school_data_json = json_util.dumps(school_data_list)
    
    # Return the JSON data
    return school_data_json


@app.route('/parksdata')
def parksdata():
    # Fetch the GeoJSON data from MongoDB's school collection
    parks_data = parks_collection.find()
    #Convert MongoDB cursor to a list of dictionaries
    parks_data_list = list(parks_data)
    #Use bson.json_util.dumps to serialize the list of dictionaries to JSON format
    parks_data_json = json_util.dumps(parks_data_list)
    #Return the JSON data
    return parks_data_json


if __name__ == '__main__':
    app.run(debug=True)
