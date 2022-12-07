 const tags = require('../resources/tags.js');
 class Endpoint {
     constructor(app) {
         this.app = app;
         // this.group = '/api/cart';
     }
     formate(val) {
         return this.group + val;
     }
     routes() {
         this.app.post('/api/search/tags', function(req, res) {
             tags.search(req.body.search).then((data) => {
                 res.send(data);
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/search/regex/tags', function(req, res) {
             tags.search(req.body.search).then((data) => {
                 res.send(data);
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/admin/tags/default/get/all', function(req, res) {
             tags.getAll().then(data => {
                 res.send(data);
             })
         });
         this.app.post('/api/admin/tags/default/create', function(req, res) {
             tags.create(req.body.data).then(data => {
                 res.send(data);
             })
         });
         this.app.post('/api/tags/default/delete', function(req, res) {
             tags.deleteById(req.body.id).then((data) => {
                 res.send(data);
             }).catch((err) => {
                 res.send(err);
             });
         });
     }
     start() {
         this.routes();
     }
 }
 module.exports = function(params) {
     return new Endpoint(params);
 };