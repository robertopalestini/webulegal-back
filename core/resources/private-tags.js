const database = require('../../services/mongodb.js');
const db = database.getDb();
const collectionName = 'private-tags';

let create = (data) => {
  return new Promise((resolve, reject) => {
    findTag(data.createdBy, data.name, data.type).then(tag => {
      if (!tag) {
        db.collection(collectionName).insertOne({
          data
        }, function (err, result) {
          if (err) {
            resolve(err)
          } else {
            resolve({
              _id: result.insertedId,
              data
            })
          }
        });
      } else {
        resolve(tag)
      }
    })
  })
}

const findTags = (id, type) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).find({
      "data.createdBy": id,
      "data.type": type
    }).toArray((err, result) => {
      if (err) {
        resolve(err)
      } else {
        resolve(result)
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
        resolve(result[0])
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
      },function (err, result) {
        if (err) {
          resolve(err)
        } else {
          resolve(result)
        }
      }
    )
  })
}

module.exports = {
  create,
  findTags,
  findTag,
  addDocuments
}