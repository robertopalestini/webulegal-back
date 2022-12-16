const database = require('../../services/mongodb.js');
const dedupe = require('dedupe')
const byKey = require('natural-sort-by-key');
const db = database.getDb();
const collectionName = 'writings';

let getAllDocumentsShared = (user) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).find({
      "data.shared_with": user
    }).toArray(function (err, result) {
      if (err) {
        resolve(err)
      } else {
        resolve(result)
      }
    })
  })
}

let getById = (user, id) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).findOne({
      _id: database.ObjectID(id),
      "data.shared_with": user
    }).then(function (doc) {
      if (doc) {
        resolve(doc)
      } else {
        db.collection('library').findOne({
          _id: database.ObjectID(id),
          "data.shared_with": user
        }).then(function (doc) {
          if (doc) {
            resolve(doc)
          } else {
            resolve(doc)
          }
        });
      }
    });
  })
}

const getAllDocumentsTags = (user) => {
  return new Promise((resolve, reject) => {
    getAllDocumentsShared(user).then((data) => {
      const temp = [];
      for (let i = data.length - 1; i >= 0; i--) {
        for (let e = data[i].data.tags.length - 1; e >= 0; e--) {
          data[i].data.tags[e].test = true;
          temp.push(data[i].data.tags[e])
        }
      }
      const result = dedupe(temp, value => value._id);
      result.sort(byKey('data.title'))
      resolve(result);
    }).catch((err) => {
      reject(err);
    })
  })
}

const getAllDocumentsByTags = (user, tags) => {
  return new Promise((resolve, reject) => {
    var tmp = [];
    for (var i = tags.length - 1; i >= 0; i--) {
      tmp.push({
        "data.tags._id": tags[i].id
      })
    }
    db.collection(collectionName).find({
      "data.shared_with": user,
      "$or": tmp
    }).sort({ "_id": -1 }).limit(500).toArray(function (err, result) {
      if (err) {
        resolve(err)
      } else {
        resolve(result)
      }
    });
  })
}

let getAllDocumentsByFolder = (user, folder) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).find({
      "data.shared_with": user,
      "data.categories.id": folder,
    }).sort({ "_id": -1 }).limit(500).toArray(function (err, result) {
      console.log('GETALLL', result)
      if (err) {
        resolve(err)
      } else {
        resolve(result)
      }
    });
  })
}

let searchText = (user, target) => {
  console.log({
    "data.shared_with": user,
    $text: {
      $search: target
    }
  })
  return new Promise((resolve, reject) => {
    db.collection(collectionName).find({
      "data.idUser": user,
      $text: {
        $search: target
      }
    }).sort({
      score: {
        $meta: "textScore"
      }
    }).toArray(function (err, result) {
      if (err) {
        resolve(err)
      } else {
        resolve(result)
      }
    });
  })
}

let saveFolderOrganization = (id, user, data) => {
  return new Promise((resolve, reject) => {
    getById(user, id).then((updateData) => {
      updateData.data.categories = data;
      db.collection(collectionName).updateOne({
        _id: database.ObjectID(id)
      }, {
        $set: {
          "data": updateData.data
        }
      }, function (err, result) {
        if (err) {
          resolve(err)
        } else {
          resolve(result)
        }
      });
    })
  })
}

let deleteSharedDocuments = (user, id) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).updateOne({
      _id: database.ObjectID(id)
    }, { $pull: { 'data.shared_with': user } }, function (err, result) {
      if (err) {
        resolve(reject)
      } else {
        resolve(result)
      }
    });
  })
}

module.exports = {
  getAllDocumentsShared,
  getById,
  getAllDocumentsByFolder,
  getAllDocumentsTags,
  getAllDocumentsByTags,
  saveFolderOrganization,
  deleteSharedDocuments,
  searchText
}
