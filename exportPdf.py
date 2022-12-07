import pdfkit
import sys
 

html = sys.argv[1]
name = sys.argv[2]

pdfkit.from_string(html,name)

print("OK");




 