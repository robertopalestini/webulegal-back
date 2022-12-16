
const documentsShared = require('../resources/documents-shared.js')
const users = require('../resources/users.js');
const foldersShared = require('../resources/folders-shared.js')
const writingsShared = require('../resources/writings.js')

class Endpoint {
  constructor(app) {
    this.app = app;
  }
  formate(val) {
    return this.group + val;
  }
  shared() {
    this.app.post('/api/shared/search', function (req, res) {
      users.getByAuth(req.body.auth).then((dataAuth) => {
        documentsShared.searchText(dataAuth._id, req.body.target).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/shared/get/documents', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        documentsShared.getAllDocumentsShared(data._id).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/shared/get/writings', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        writingsShared.getAllDocumentsSharedWithMe(data._id).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/shared/get/document', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        documentsShared.getById(data._id, req.body.id).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/shared/get/writing', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        writingsShared.getById(data._id, req.body.id).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/shared/get/tags', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        documentsShared.getAllDocumentsTags(data._id).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/shared/get/tags/documents', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        documentsShared.getAllDocumentsByTags(data._id, req.body.tags).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/shared/get/folders', function (req, res) {
      foldersShared.getAllRoot().then((data) => {
        res.send(data);
      }).catch((err) => {
        res.send(err);
      });
    });
    this.app.post('/api/shared/delete/folders', function (req, res) {
      foldersShared.deleteById(req.body.id).then((data) => {
        res.send(data);
      }).catch((err) => {
        res.send(err);
      });
    });
    this.app.post('/api/shared/get/folders/childs', function (req, res) {
      foldersShared.getAllChild(req.body.parent).then((data) => {
        res.send(data);
      }).catch((err) => {
        res.send(err);
      });
    });
    this.app.post('/api/shared/get/folders/documents', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        documentsShared.getAllDocumentsByFolder(data._id, req.body.folders).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      }).catch((err) => {
        res.send(err);
      });
    });
    this.app.post('/api/shared/save/folders', function (req, res) {
      foldersShared.create({
        text: req.body.data.text,
        parent: null,
        nodes: []
      }).then((data) => {
        res.send(data);
      }).catch((err) => {
        res.send(err);
      });
    });
    this.app.post('/api/shared/save/folders/childs', function (req, res) {
      foldersShared.create({
        text: req.body.data.text,
        parent: req.body.data.parent,
        nodes: []
      }).then((data) => {
        res.send(data);
      }).catch((err) => {
        res.send(err);
      });
    });
    this.app.post('/api/shared/save/folders/organize', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        documentsShared.saveFolderOrganization(req.body.id, data._id, req.body.folders).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      }).catch((err) => {
        res.send(err);
      });
    });
    this.app.post('/api/shared/delete/documents', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        documentsShared.deleteSharedDocuments(data._id, req.body.id).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      }).catch((err) => {
        res.send(err);
      });
    });
  }
  start() {
    this.shared()
  }
}
module.exports = function (params) {
  return new Endpoint(params);
};