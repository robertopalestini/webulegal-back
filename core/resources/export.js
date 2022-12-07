var fs = require("fs");
var html_to_pdf = require("html-pdf-node");
var docx = require("html-to-docx");
const { v4: uuidv4 } = require("uuid");
var path = require("path");
const { PythonShell } = require("python-shell");
const config = require("../../settings.js");
class exportsDocs {
  constructor() {}
   
  createWordWriting(id) {
    // console.log('string',htmlString)
    return new Promise((resolve, reject) => { 
      const nameRandom = uuidv4() + ".docx"; //path.extname(file.name);
      var file =
        path.join(__dirname, "../../public/exports") + "/" + nameRandom;
      let options = {
        mode: "text",
        // pythonPath: 'C:/Users/Raa/AppData/Local/Programs/Python/Python310',
        pythonOptions: ["-u"], // get print results in real-time
        scriptPath: path.join(__dirname, config.secure.py.scriptPath),
        args: [id, file],
      };
      console.log('spawn opt' , options)
      
      PythonShell.run("exportWordMongo.py", options, function (err, results) {
        if (err) {
            console.log('error spawn')
            throw err
        };
        if (results[0] == "OK") {
          resolve(nameRandom);
        }
        // results is an array consisting of messages collected during execution
        console.log("results: %j", results);
      });
    });
  }
  createPdfWriting(id) {
    return new Promise((resolve, reject) => {
     
      const nameRandom = uuidv4() + ".pdf"; //path.extname(file.name);
      var file =
        path.join(__dirname, "../../public/exports") + "/" + nameRandom;
      let options = {
        mode: "text",
        // pythonPath: 'C:/Users/Raa/AppData/Local/Programs/Python/Python310',
        pythonOptions: ["-u"], // get print results in real-time
        scriptPath: path.join(__dirname, config.secure.py.scriptPath),
        args: [id, file],
      };

      console.log('spawn opt' , options)
      PythonShell.run("exportPdfMongo.py", options, function (err, results) {
        if (err) throw err;
        if (results[0] == "OK") {
          resolve(nameRandom);
        }
        // results is an array consisting of messages collected during execution
        console.log("results: %j", results);
      });
    });
  }


  createPdf(htmlString) {
    return new Promise((resolve, reject) => {
      var body =
        `
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
    </head>
    <body> 
    ` +
        htmlString +
        `
   </body>
</html>`;
      const nameRandom = uuidv4() + ".pdf"; //path.extname(file.name);
      var file =
        path.join(__dirname, "../../public/exports") + "/" + nameRandom;
      let options = {
        mode: "text",
        // pythonPath: 'C:/Users/Raa/AppData/Local/Programs/Python/Python310',
        pythonOptions: ["-u"], // get print results in real-time
        scriptPath: path.join(__dirname, config.secure.py.scriptPath),
        args: [body, file],
      };
      PythonShell.run("exportPdf.py", options, function (err, results) {
        if (err) throw err;
        if (results[0] == "OK") {
          resolve(nameRandom);
        }
        // results is an array consisting of messages collected during execution
        console.log("results: %j", results);
      });
    });
  }
  createDocx(htmlString) {
    // console.log('string',htmlString)
    return new Promise((resolve, reject) => {
      var body =
        `
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
    </head>
    <body> 
    ` +
        htmlString +
        `
   </body>
</html>`;
      const nameRandom = uuidv4() + ".docx"; //path.extname(file.name);
      var file =
        path.join(__dirname, "../../public/exports") + "/" + nameRandom;
      let options = {
        mode: "text",
        // pythonPath: 'C:/Users/Raa/AppData/Local/Programs/Python/Python310',
        pythonOptions: ["-u"], // get print results in real-time
        scriptPath: path.join(__dirname, config.secure.py.scriptPath),
        args: [body, file],
      };
      PythonShell.run("exportWord.py", options, function (err, results) {
        if (err) throw err;
        if (results[0] == "OK") {
          resolve(nameRandom);
        }
        // results is an array consisting of messages collected during execution
        console.log("results: %j", results);
      });
    });
  }
  getPath(ind) {
    return path.join(__dirname, "../../public/exports") + "/" + ind;
  }
}
module.exports = function () {
  return new exportsDocs();
};
