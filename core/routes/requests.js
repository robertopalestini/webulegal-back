 const requests = require('../resources/requests.js');
 const comunity = require('../resources/comunity.js');
 const users = require('../resources/users.js');


 
const commentsDocuments = require("../resources/comments-documents.js");


 class Endpoint {
     constructor(app) {
         this.app = app;
         // this.group = '/api/cart';
     }
     formate(val) {
         return this.group + val;
     }
     routes() {
         this.app.post('/api/requests/get/all/feedback', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataUser) => {
                 requests.getAllFeedback().then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/requests/new/feedback', function(req, res) { //copy to library user
             requests.createFeedback({
                 message: req.body.message,
                 name: req.body.name,
                 email: req.body.email
             }).then((data) => {
                 res.send(data);
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/requests/get/all/report', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataUser) => {
                 requests.getAllReports().then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/requests/get/all/tag', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataUser) => {
                 requests.getAllTags().then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/requests/get/all/folder', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataUser) => {
                 requests.getAllFolders().then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/requests/new/folder/writing', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataUser) => {
                 requests.createFolder(dataUser, {
                     message: req.body.message,
                 }, 'writing').then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/requests/new/folder', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataUser) => {
                 requests.createFolder(dataUser, {
                     message: req.body.message,
                 }, 'document').then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/requests/new/tag', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataUser) => {
                 requests.createTag(dataUser, {
                     message: req.body.message,
                 }, 'document').then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/requests/new/report', function(req, res) { //copy to library user
            users.getByAuth(req.body.auth).then((dataUser) => {
                comunity.getById(req.body.id).then((data) => {
                    requests.createReport(data, dataUser, {
                        message: req.body.message,
                        type: req.body.type,
                    }).then((data) => {
                        res.send(data);
                    }).catch((err) => {
                        res.send(err);
                    });
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            });
        });








        this.app.post('/api/requests/new/report/comments', function(req, res) { //copy to library user
            users.getByAuth(req.body.auth).then((dataUser) => {
                commentsDocuments.getById(req.body.id).then((data) => {
                    requests.createReportComment(data, dataUser, {
                        message: req.body.message,
                        type: 'comment',
                    }).then((data) => {
                        res.send(data);
                    }).catch((err) => {
                        res.send(err);
                    });
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            });
        });

        this.app.post('/api/requests/get/all/comments', function(req, res) { //copy to library user
            users.getByAuth(req.body.auth).then((dataUser) => {
                requests.getAllReportsComments().then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });






         this.app.post('/api/requests/points', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataUser) => {
                 requests.createPoint(dataUser).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/requests/get/all/points', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataUser) => {
                 requests.getAllPoints().then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/admin/requests/delete', function(req, res) {
            comunity.deleteById(req.body.id).then((data) => {
                requests.deleteById(req.body.id_report).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });



        this.app.post('/api/admin/requests/delete/comments', function(req, res) {
            commentsDocuments.deleteById(req.body.id).then((data) => {
                requests.deleteById(req.body.id_report).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });


       
        this.app.post('/api/admin/requests/delete/single', function(req, res) { 
                requests.deleteById(req.body.id).then((data) => {
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