const database = require('../../services/mongodb.js');
const db = database.getDb();
const collectionName = 'shareds-folders';

let create = (data) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).insertOne({
      data
    }, function (err, result) {
      if (err) {
        resolve(reject)
      } else {
        resolve(result)
      }
    });
  })
}

let getAllRoot = () => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).find({
      "data.parent": null
    }).sort({ "data.text": -1 }).collation({ locale: "en", caseLevel: true }).limit(500).toArray(function (err, result) {
      if (err) {
        resolve(reject)
      } else {
        resolve(result)
      }
    });
  })
}

let getAllChild = (parent) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).find({
      "data.parent": parent
    }).sort({ "data.text": -1 }).collation({ locale: "en", caseLevel: true }).limit(500).toArray(function (err, result) {
      if (err) {
        resolve(reject)
      } else {
        resolve(result)
      }
    });
  })
}

let getById = (id) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).findOne({
      _id: database.ObjectID(id)
    }).then(function (doc) {
      if (doc) {
        resolve(doc)
      } else {
        resolve(doc)
      }
    });
  })
}

let update = (id, data) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).updateOne({
      _id: database.ObjectID(id)
    }, {
      $set: {
        "data": data
      }
    }, function (err, result) {
      if (err) {
        resolve(reject)
      } else {
        resolve(data)
      }
    });
  })
}

let deleteById = (id) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).delete({
      $or: [
        {
          _id: database.ObjectID(id)
        },
        {
          parent: id
        }
      ]
    }, function (err, result) {
      if (err) {
        resolve(reject)
      } else {
        resolve(result)
      }
    });
  })
}

module.exports = {
  create,
  getAllRoot,
  getAllChild,
  getById,
  update,
  deleteById
}