const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const mongodb = require('./services/mongodb.js');
const {
    v4: uuidv4
} = require('uuid');


const fs = require('fs');
const https = require('https');
const http = require('http');


mongodb.connectToServer(function(err) {
    if (err) {
        console.error(err);
        process.exit();
    }
    const app = express();
    const fileUpload = require('express-fileupload');


    
app.all('*', function(req, res, next){ 
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.get('host')}${req.url}`);
    }
     next();
});




// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://webulegal.com");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });



    // Middleware
    app.use(morgan('tiny'));
    app.use(cors({
        origin: '*'
    }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    // enable files upload
    app.use(fileUpload({
        createParentPath: true
    }));
    //app.use(express.static(path.join(__dirname, 'public')));
    // Rutas
    app.get('/', function(req, res) {
        // res.send('Hello World!');
        res.sendFile(path.join(__dirname, 'public') + "/index.html");
    });
     
    require('./core/routes/comunity.js')(app).start();
    require('./core/routes/library.js')(app).start();
    require('./core/routes/folders-default.js')(app).start();
    require('./core/routes/tags.js')(app).start();
    require('./core/routes/writings.js')(app).start();
    require('./core/routes/users.js')(app).start();
    require('./core/routes/requests.js')(app).start();
    require('./core/routes/uploads.js')(app).start(); 
    const history = require('connect-history-api-fallback');
    app.use(history());
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('puerto', process.env.PORT || 4000);
    // app.listen(app.get('puerto'), function() {
    //     console.log('Example app listening on port' + app.get('puerto'));
    // });

    
https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/webulegal.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/webulegal.com/cert.pem', 'utf8'),
    ca: fs.readFileSync('/etc/letsencrypt/live/webulegal.com/chain.pem', 'utf8')
}, app).listen(443, () => console.log('HTTPS Server Started'));
// http server
http.createServer(app).listen(80, () => console.log('HTTP Server Started'));


})