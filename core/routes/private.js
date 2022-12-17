const privateTags = require('../resources/private-tags.js')
const users = require('../resources/users.js');

class Endpoint {
  constructor(app) {
    this.app = app;
  }

  formate(val) {
    return this.group + val;
  }

  private() {
    this.app.post('/api/private/get/tags', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        privateTags.findTags(data._id, req.body.data.type).then((data) => {
          if (data) {
            res.send(data);
          } else {
            res.send([])
          }
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/private/get/tag', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        privateTags.findTag(data._id, req.body.data.name, req.body.data.type).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/private/save/tags', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        privateTags.create({
          name: req.body.data.name,
          createdBy: data._id,
          documents: [],
          type: req.body.data.type
        }).then((data) => {
          res.send(data);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
    this.app.post('/api/private/save/tags/organize', function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        Promise.all(req.body.data.name.forEach(name => {
          privateTags.addDocuments(
            data._id,
            name,
            req.body.data.type,
            req.body.data.documentId
          )
        })).then(() => {
          res.send(true);
        }).catch((err) => {
          res.send(err);
        });
      })
    });
  }
  start() {
    this.private()
  }
}

module.exports = function (params) {
  return new Endpoint(params);
};
