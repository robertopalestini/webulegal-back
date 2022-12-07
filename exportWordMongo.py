from pymongo import MongoClient
from bson.objectid import ObjectId


from docx import Document
from htmldocx import HtmlToDocx
import sys
import json



document = Document()
new_parser = HtmlToDocx()
# do stuff to document

 
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

documentTarget = collection.find_one(ObjectId(idDocument))
 

html = html_start + documentTarget["data"]["content"] + html_end
 
# html = '<html lang="en"><head><meta charset="UTF-8" /><title>Document</title></head><body><b>Lorem ipsum es el texto que se usa&nbsp;</b><div><br></div><div>habitualmente en diseño gráfico o de moda en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final. Wikipedia<div>Lorem ipsum es el texto que se usa habitualmente en diseño gráfico o de moda en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final. Wikipedia<br></div><div><br></div><div><span class="mark">teste</span class="mark"><br></div><div><br></div><div><br></div><div>Lorem ipsum es el texto que se usa habitualmente en diseño gráfico o de moda en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final. WikipediaLorem ipsum es el texto que se usa habitualmente en diseño gráfico o de moda en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final. WikipediaLorem ipsum es el texto que se usa habitualmente en diseño gráfico o de moda en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final. WikipediaLorem ipsum es el texto que se usa habitualmente en diseño gráfico o de moda en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final. WikipediaLorem ipsum es el texto que se usa habitualmente en diseño gráfico o de moda en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final. WikipediaLorem ipsum es el texto que se usa habitualmente en diseño gráfico o de moda en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final. Wikipedia<br></div><div><br></div><div><span class="mark">teste</span class="mark"><br></div><div><br></div><div>Lorem ipsum es el texto que se usa habitualmente en diseño gráfico o de moda en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final. Wikipedia<br></div></div></body></html>'
new_parser.add_html_to_document(html, document)

# do more stuff to document
document.save(nameFile)

print("OK");