const foldersDocuments = require('../resources/folders-documents.js');
const foldersWritings = require('../resources/folders-writings.js');
const foldersShared = require('../resources/folders-shared.js')
class Endpoint {
    constructor(app) {
        this.app = app;
        // this.group = '/api/cart';
    }
    formate(val) {
        return this.group + val;
    }
    routes() {




        this.app.post('/api/folders/v2/default/documents/delete', function (req, res) {
            foldersDocuments.deleteById(req.body.id).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });


        this.app.post('/api/folders/v2/default/documents', function (req, res) {
            foldersDocuments.getAllRoot().then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/documents/childs', function (req, res) {
            foldersDocuments.getAllChild(req.body.parent).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/documents/save/root', function (req, res) {
            foldersDocuments.create({
                text: req.body.text,
                parent: null,
                nodes: []
            }).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/documents/save/child', function (req, res) {
            foldersDocuments.create({
                text: req.body.text,
                parent: req.body.parent,
                nodes: []
            }).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        // this.app.post('/api/folders/v2/default/documents/delete', function(req, res) {
        //     libv2.delete(req.body.id).then((data) => {
        //         res.send(data);
        //     }).catch((err) => {
        //         res.send(err);
        //     });
        // });
        // this.app.post('/api/folders/v2/default/documents/edit', function(req, res) {
        //     libv2.getFolderDocumentSingle(req.body.id).then((data) => {
        //         data.data.text = req.body.text;
        //         libv2.updateFolderDocumentes(data._id, data._rev, data.data).then((data) => {
        //             res.send(data);
        //         }).catch((err) => {
        //             res.send(err);
        //         });
        //     }).catch((err) => {
        //         res.send(err);
        //     });
        // });
        this.app.post('/api/folders/v2/default/writings/delete', function (req, res) {
            foldersWritings.deleteById(req.body.id).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/writings', function (req, res) {
            foldersWritings.getAllRoot().then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/writings/childs', function (req, res) {
            foldersWritings.getAllChild(req.body.parent).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/writings/save/root', function (req, res) {
            foldersWritings.create({
                text: req.body.text,
                parent: null,
                nodes: []
            }).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/writings/save/child', function (req, res) {
            foldersWritings.create({
                text: req.body.text,
                parent: req.body.parent,
                nodes: []
            }).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/shared/delete', function (req, res) {
            foldersShared.deleteById(req.body.id).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/shared', function (req, res) {
            foldersShared.getAllRoot().then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/shared/childs', function (req, res) {
            foldersShared.getAllChild(req.body.parent).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/shared/save/root', function (req, res) {
            foldersShared.create({
                text: req.body.text,
                parent: null,
                nodes: []
            }).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/folders/v2/default/shared/save/child', function (req, res) {
            foldersShared.create({
                text: req.body.text,
                parent: req.body.parent,
                nodes: []
            }).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        // this.app.post('/api/folders/v2/default/writings/delete', function(req, res) {
        //     libv2_W.delete(req.body.id).then((data) => {
        //         res.send(data);
        //     }).catch((err) => {
        //         res.send(err);
        //     });
        // });
        // this.app.post('/api/folders/v2/default/writings/edit', function(req, res) {
        //     libv2_W.getFolderDocumentSingle(req.body.id).then((data) => {
        //         data.data.text = req.body.text;
        //         libv2_W.updateFolderDocumentes(data._id, data._rev, data.data).then((data) => {
        //             res.send(data);
        //         }).catch((err) => {
        //             res.send(err);
        //         });
        //     }).catch((err) => {
        //         res.send(err);
        //     });
        // });
    }
    start() {
        this.routes();
    }
}
module.exports = function (params) {
    return new Endpoint(params);
};