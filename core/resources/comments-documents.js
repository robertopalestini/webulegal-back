const database = require('../../services/mongodb.js');
const db = database.getDb();
const collectionName = 'comunity-comments';
//
//
//
//
//
//
//
//
let create = (data) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            document : data.document,
            document_title : data.document_title,
            document_description : data.document_title,
            user : {
                id : data.id,
                email : data.email,
                lastname : data.lastname,
                firstname : data.firstname,
            },
            comment : data.comment,
            date : new Date()
        }, function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllByDocument = (id) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            document : id
        }).sort({ "_id": -1 }).limit(50).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}

let getAll = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({}).sort({ "_id": -1 }).limit(15000).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}
let search = (target) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            $text: {
                $search: target
            }
        }).sort({score:{$meta:"textScore"}}).toArray(function(err, result) {
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}
let searchRegex = (target) => {
    console.log('search regex', target)
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.title": {
                $regex: target
            }
        }).toArray(function(err, result) {
            if (err) {
                resolve(err)
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
        }).then(function(doc) {
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
        }, function(err, result) {
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
        db.collection(collectionName).deleteOne({
            _id: database.ObjectID(id)
        }, function(err, result) {
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
    getAll,
    search,
    searchRegex,
    getById,
    update,
    deleteById,
    getAllByDocument
}