const database = require('../../services/mongodb.js');
const db = database.getDb();
const collectionName = 'writings';
const collectionNameFolder = 'writings-folders';
const dedupe = require('dedupe')
const byKey = require('natural-sort-by-key');
//
//
//
//
//
//
//
//
let insert = (id, data) => {
    return new Promise((resolve, reject) => {
        db.collection('shared-with-me').insert({
			"id" : 1,
			"file_id" : "",
            "shared-with": ""
		}, function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(data)
            }
        });
    })
}



 


let updateContent = (id, user, data) => {
    return new Promise((resolve, reject) => {
        getById(user, id).then((updateData) => {
            updateData.data.content = data.content; 
            console.log('edit', data);
            db.collection(collectionName).updateOne({
                _id: database.ObjectID(id)
            }, {
                $set: {
                    "data": updateData.data
                }
            }, function(err, result) {
                if (err) {
                    resolve(reject)
                } else {
                    resolve(data)
                }
            });
        })
    })
}

let updateTitleDescription = (id, user, data) => {
    return new Promise((resolve, reject) => {
        getById(user, id).then((updateData) => {
            updateData.data.title = data.title;
            updateData.data.description = data.description;
            console.log('edit', data);
            db.collection(collectionName).updateOne({
                _id: database.ObjectID(id)
            }, {
                $set: {
                    "data": updateData.data
                }
            }, function(err, result) {
                if (err) {
                    resolve(reject)
                } else {
                    resolve(data)
                }
            });
        })
    })
}

let createCustom = (user, data) => {
     data.idUser = user;
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            data: data
        }, function(err, result) {
    	console.log('createCustom result',result)
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}

let create = (user, data) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            data: {
                idUser: user,
                type: 'document',
                content: data.content,
                fields: data.fields,
                title: 'Documento sin titulo',
                description: 'Documento sin descripcion',
                categories: [],
                tags: [],
                attachment: [],
                validate: data.validate, 
                cout_validate: data.cout_validate,
                share: data.share,
                complete : data.validate, 
                form_complete : data.form_complete,
                version : data.version,
            } 
        }, function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllByTags = (user, tags) => {
    return new Promise((resolve, reject) => {
        var tmp = [];
        for (var i = tags.length - 1; i >= 0; i--) {
            tmp.push({
                "data.tags._id": tags[i].id
            })
        }
        db.collection(collectionName).find({
            "data.idUser": user,
            "$or": tmp
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllDocuments = (user) => {
    console.log('all', {
        "data.idUser": user
    })
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.idUser": user
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}

module.exports = {
    create,
    createCustom,
    getAllDocuments,
    getAllByTags,
    insert,
    updateTitleDescription,
    updateContent,
}