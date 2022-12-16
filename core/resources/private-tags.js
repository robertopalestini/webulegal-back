const database = require('../../services/mongodb.js');
const db = database.getDb();
const collectionName = 'private-tags';

let create = (data) => {
  return new Promise((resolve, reject) => {
    findTag(data.createdBy, data.name, data.type).then(data => {
      if (!data) {
        db.collection(collectionName).insertOne({
          data
        }, function (err, result) {
          if (err) {
            resolve(reject)
          } else {
            resolve(result)
          }
        });
      } else {
        resolve(data)
      }
    })
  })
}

const findTags = (id, type) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).find({
      "data.createdBy": id,
      "data.type": type
    }).then((tag) => {
      if (tag) {
        resolve(tag)
      } else {
        resolve(null)
      }
    })
  })
}

const findTag = (id, name, type) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).find({
      "data.createdBy": id,
      "data.name": name,
      "data.type": type
    }).toArray(function (err, result) {
      if (err) {
        resolve(err)
      } else {
        resolve(result)
      }
    })
  })
}

const addDocuments = (id, name, type, documentId) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).updateOne(
      {
        "data.createdBy": id,
        "data.name": name,
        "data.type": type
      },
      {
        $push: {
          "data.documents": documentId
        }
      }
    ).toArray(function (err, result) {
      if (err) {
        resolve(err)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = {
  create,
  findTags,
  findTag,
  addDocuments
}