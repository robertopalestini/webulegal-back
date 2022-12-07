  const path = require('path');
  const {
      v4: uuidv4
  } = require('uuid');
  class Endpoint {
      constructor(app) {
          this.app = app;
          // this.group = '/api/cart'; 
      }
      formate(val) {
          return this.group + val;
      }
      start() {
          this.app.post('/api/upload', async (req, res) => {
              try {
                  if (!req.files) {
                      res.send({
                          status: false,
                          message: 'No file uploaded'
                      });
                  } else {
                      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                      let file = req.files.file;
                      //Use the mv() method to place the file in upload directory (i.e. "uploads")
                      const nameRandom = uuidv4() + path.extname(file.name);
                      var test = file.mv(path.join(__dirname, '../../public/uploads')+ '/' + nameRandom).then((data) => {
                          //send response
                          console.log(path.join(__dirname, '../../public/uploads')+  '/' + nameRandom)
                          res.send({
                              status: true,
                              message: 'File is uploaded',
                              data: {
                                  name: nameRandom,
                                  // name: avatar.name,
                                  mimetype: file.mimetype,
                                  size: file.size,
                                  ext: path.extname(file.name)
                              }
                          });
                      })
                  }
              } catch (err) {
                  res.status(500).send(err);
              }
          });
      }
  }
  module.exports = function(params) {
      return new Endpoint(params);
  };