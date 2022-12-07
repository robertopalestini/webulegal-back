from pymongo import MongoClient
from bson.objectid import ObjectId


import pdfkit
import sys
import json



html_start =   "<html lang='en'><head><meta charset='UTF-8' /><title>Document</title></head><body>"
html_end = "</body></html>"

idDocument = sys.argv[1]
nameFile = sys.argv[2]

uri = "mongodb://webu:43119739Ramiro@193.43.134.180:27017/?authMechanism=DEFAULT"
client = MongoClient(uri)
 
# Access database object
db = client['webu']
 
# Access collection object
collection = db['writings']

document = collection.find_one(ObjectId(idDocument))
 

html = html_start + document["data"]["content"] + html_end

pdfkit.from_string(html,nameFile)

print("OK");




 