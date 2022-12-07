 const comunity = require('../resources/comunity.js');
 const library = require('../resources/library.js');
 const users = require('../resources/users.js');
 const tools = require('../../inc/tools.js');
 const exportsLib = require('../resources/export.js')();


 const historyActivity = require('../resources/history-activity.js');
 
 
 class Endpoint {
     constructor(app) {
         this.app = app;
         // this.group = '/api/cart';
     }
     formate(val) {
         return this.group + val;
     }
     documents() {
         this.app.post('/api/library/export/pdf', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataAuth) => {
                 library.getById(dataAuth._id,req.body.id).then((data) => {
                     exportsLib.createPdf(data.data.content).then((data) => {
                         res.send({
                             name: data
                         });
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
         this.app.post('/api/library/export/word', function(req, res) { //copy to library user
             users.getByAuth(req.body.auth).then((dataAuth) => {
                 library.getById(dataAuth._id,req.body.id).then((data) => {
                     exportsLib.createDocx(data.data.content).then((data) => {
                         res.send({
                             name: data
                         });
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
         this.app.post('/api/library/search', function(req, res) {
             users.getByAuth(req.body.auth).then((dataAuth) => {
                 library.searchText(dataAuth._id, req.body.target).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             })
         });
         this.app.post('/api/library/edit', function(req, res) {
             users.getByAuth(req.body.auth).then((dataAuth) => {
                 library.updateTitleDescription(req.body.id, dataAuth._id, req.body.data).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 })
             }).catch((err) => {
                 res.send(err);
             });
         });
         // this.app.post('/api/library/get/folders', function(req, res) {
         //     users.getByAuth(req.body.auth).then((data) => {
         //        console.log('datauser',data)
         //         library.getAllFoldersRoot(data._id).then((data) => {
         //            console.log('getAllFoldersRoot',data)
         //             res.send(data);
         //         }).catch((err) => {
         //             res.send(err);
         //         });
         //     }).catch((err) => {
         //         res.send(err);
         //     });
         // });
         // this.app.post('/api/library/get/folders/child', function(req, res) {
         //     users.getByAuth(req.body.auth).then((data) => {
         //         library.getAllFoldersChild(data._id,req.body.parent).then((data) => {
         //             res.send(data);
         //         }).catch((err) => {
         //             res.send(err);
         //         });
         //     }).catch((err) => {
         //         res.send(err);
         //     });
         // });
         // this.app.post('/api/library/get/folders/create', function(req, res) {
         //     users.getByAuth(req.body.auth).then((data) => {
         //         library.createFolder(data._id,req.body.parent).then((data) => {
         //             res.send(data);
         //         }).catch((err) => {
         //             res.send(err);
         //         });
         //     }).catch((err) => {
         //         res.send(err);
         //     });
         // });
         //  this.app.post('/api/library/get/folders/document/save', function(req, res) {
         //     users.getByAuth(req.body.auth).then((data) => {
         //         library.update(data._id,req.body.data).then((data) => {
         //             res.send(data);
         //         }).catch((err) => {
         //             res.send(err);
         //         });
         //     }).catch((err) => {
         //         res.send(err);
         //     });
         // });
         this.app.post('/api/library/get/folders', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 library.getAllFoldersRoot(data._id).then((data) => {
                     console.log('getAllFoldersRoot', data)
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });



         this.app.post('/api/library/delete/folders', function(req, res) { 
            library.deleteByIdFolder(req.body.id).then((data) => { 
                res.send(data);
            }).catch((err) => {
                res.send(err);
            }); 
         });



         this.app.post('/api/library/get/folders/child', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 library.getAllFoldersChild(data._id, req.body.parent).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/save/folders', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 library.createFolder(data._id, req.body.data).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/save/folders/organize', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 library.saveFolderOrganization(req.body.id, data._id, req.body.folders).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/get/folders/documents', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 library.getAllDocumentsByFolder(data._id, req.body.folders).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         //
         this.app.post('/api/documents/save', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 req.body.data.validate = 0;
                 req.body.data.cout_validate = 0;
                 req.body.data.share = 0;


                 var historyJSON = { 
                    id : data._id,
                    email : data.data.email,
                    lastname : data.data.profile.lastname,
                    firstname : data.data.profile.firstname, 
                    msg : 'Se subio un documento privado',
                    ref:  'documento-privado', 
                };
 

                 library.create(data._id, req.body.data).then((data) => {

                    historyActivity.create(historyJSON).then(HistoryData => {})


                     console.log(data, 'create')
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/get/documents', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 library.getAllDocuments(data._id).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/get/document', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 library.getById(data._id, req.body.id).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/get/documents/shared-with-me', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                console.log('soyyo' + data)
                 library.getAllDocumentsSharedWithMe(data._id).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/get/tags', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 console.log('data', data)
                 library.tags(data._id).then((data) => {
                     console.log('tags', data)
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/get/tags/documents', function(req, res) {
             users.getByAuth(req.body.auth).then((data) => {
                 console.log('data', data)
                 library.getAllByTags(data._id, req.body.tags).then((data) => {
                     res.send(data);
                 }).catch((err) => {
                     res.send(err);
                 });
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/organize', function(req, res) {
             users.getByAuth(req.body.auth).then((dataAuth) => {
                 library.getById(dataAuth._id, req.body.id_document).then((data) => {
                     console.log('library', data)
                     data.data.tags = req.body.tags;
                     data.data.title = req.body.title;
                     data.data.description = req.body.description;
                     data.data.validate = 1;
                     data.data.cout_validate = 0;
                     data.data.share = 1;
                     data.data.categories = [];
                     data.data.tags = [];
                     library.update(data._id, data.data).then((dataUpdate) => {
                         data.data.categories = req.body.categories;
                         data.data.tags = req.body.tags;
                         data.data.title = req.body.title;
                         data.data.description = req.body.description;
                         data.data.validate = 1;
                         data.data.cout_validate = 0;
                         data.data.type = "document";
                         data.data.categories_inline = tools.prepareInlineFolders(data.data.categories);
                         var temp = {
                             id: data._id,
                             data: data.data
                         }
                         comunity.create(dataAuth._id, data.data).then((data) => {
                             temp.data.id_share_comuniy = data.insertedId;
                             temp.data.categories = [];
                             library.update(temp.id, temp.data).then((dataUpdate) => {


                                var historyJSON = { 
                                    id : dataAuth._id,
                                    email : dataAuth.data.email,
                                    lastname : dataAuth.data.profile.lastname,
                                    firstname : dataAuth.data.profile.firstname, 
                                    msg : 'Se hizo publico un documento privado',
                                    ref:  'documento-privado-publico', 
                                };
                 
                                historyActivity.create(historyJSON).then(HistoryData => {})

                                 res.send(data);
                             })
                         }).catch((err) => {
                             res.send(err);
                         });
                     })
                 }).catch((err) => {
                     res.send(err);
                 })
             }).catch((err) => {
                 res.send(err);
             });
         });
         this.app.post('/api/library/delete/documents', function(req, res) {
             library.deleteById(req.body.id).then((data) => {
                 res.send(data);
             }).catch((err) => {
                 res.send(err);
             });
         });
     }
     start() {
         this.documents();
     }
 }
 module.exports = function(params) {
     return new Endpoint(params);
 };