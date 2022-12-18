const database = require('../../services/mongodb.js');
const library = require('./library')
const writing = require('./writings')
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
        $addToSet: {
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

const searchDocuments = (id, name, type) => {
  return new Promise((resolve, reject) => {
    const nameFilter = name.map(el => ({
      "data.name": el
    }))
    db.collection(collectionName).find({
      "data.createdBy": id,
      "data.type": type,
      $or: nameFilter
    }, { "data.documents": 1, _id: 0 }).toArray((err, res) => {
      if(err) {
        resolve(err)
      } else {
        const data = []
        res.forEach(el => {
          data.push(
            ...el.data.documents
          )
        })
        Promise.all(data.map(docId => {
          switch (type) {
            case 'library':
              return library.getById(id, docId, false)
            case 'shared':
              return writing.getById(id, docId, true)
            default:
              return writing.getById(id, docId, false)
            }
        })).then((data) => resolve(data))
          .catch(error => resolve(error))
      }
    })
  })
}

module.exports = {
  create,
  findTags,
  findTag,
  addDocuments,
  searchDocuments
}