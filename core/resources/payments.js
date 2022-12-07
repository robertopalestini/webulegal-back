const database = require('../../services/mongodb.js');
const db = database.getDb();
const collectionName = 'payments-settings';
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
            title : data.title,
            active : data.active,
            unit_price : data.unit_price
        }, function(err, result) {
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
        db.collection(collectionName).find({}).limit(10000).toArray(function(err, result) {
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
                title:data.title,
                unit_price:data.unit_price,
                active:data.active
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
    deleteById
}