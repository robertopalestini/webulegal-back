const database = require('../../services/mongodb.js');
const db = database.getDb();
const collectionName = 'comunity';
const customers = require('./users.js');
//
//
//
//
//
//
//
let validate = (idUser, idOwnerDoc, idDocument) => {
     console.log('function  base', idUser,idOwnerDoc,idDocument)
    return new Promise((resolve, reject) => {
        customers.getById(database.ObjectID(idUser).toString()).then((data) => {
            console.log('function 1', data)
            if (data.data.validations) {
                data.data.validations.push(idDocument)
            } else {
                var validations = [];
                validations.push(idDocument)
                data.data.validations = validations;
            }
            customers.update(data._id, data.data).then((data) => {
                console.log('function 2', data)
                customers.getById(database.ObjectID(idOwnerDoc).toString()).then((data) => {
                    console.log('function 3', data)
                    if (data.data.points) {
                        data.data.points = data.data.points + 10;
                    } else {
                        data.data.points = 10;
                    }
                    customers.update(data._id, data.data).then((data) => {
                        console.log('function 4', data)
                        resolve(data);
                    }).catch((err) => {})
                }).catch((err) => {})
            }).catch((err) => {})
        }).catch((err) => {})
    })
}
let create = (user, data) => {
    data.idUser = user;
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            data: data
        }, function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
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
let getAllBestDocuments = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.type": "document"
        }).sort({
            "data.cout_validate": -1
        }).limit(5).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllBestWritings = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.type": "writing"
        }).sort({
            "data.cout_validate": -1
        }).limit(5).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllDocuments = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.type": "documents"
        }).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllWritings = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.type": "writing"
        }).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllFeatured = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            'data.featured': true
        }).limit(500).toArray(function(err, result) {
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
        }).then(function(doc) {
            if (doc) {
                resolve(doc)
            } else {
                resolve(doc)
            }
        });
    })
}
let searchTextDocuments = (target) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.type": "document",
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
let searchTextWritings = (target) => {
    console.log({
        "data.type": "writing",
        $text: {
            $search: target
        }
    })
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.type": "writing",
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
// { $text : { $search : "test" } , $or: [ { "data.categories.text": "Global writings" }  ] }
let searchTextCompleteWritings = (target = null, folders = [], tags = []) => {
    var query = {
        "data.type": "writing",
        "$or": []
    };
    if (target == null || target == undefined || target == '' || target == ' ') {} else {
        query["$or"].push({
            '$text': {
                "$search": target
            }
        });
    }
    // if (tags.length > 0 || folders.length > 0) {
    //     query['$or'] = [];
    // }
    if (tags) {
        if (tags.length > 0) {
            for (var i = tags.length - 1; i >= 0; i--) {
                query["$or"].push({
                    "data.tags.data.title": tags[i].title
                })
            }
        }
    }
    if (folders) {
        if (folders.length > 0) {
            for (var i = folders.length - 1; i >= 0; i--) {
                query["$or"].push({
                    "data.categories.text": folders[i].title
                })
            }
        }
    }
    return new Promise((resolve, reject) => {
        console.log('query search searchTextCompleteDocuments' , query)
        db.collection(collectionName).find(query).sort({score:{$meta:"textScore"}}).toArray(function(err, result) { 
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}
let searchTextCompleteDocuments = (target = null, folders = [], tags = []) => {
    var query = {
        "data.type": "document",
        "$or": []
    };
    if (target == null || target == undefined || target == '' || target == ' ') {} else {
        query["$or"].push({
            '$text': {
                "$search": target
            }
        });
    }
    // if (tags.length > 0 || folders.length > 0) {
    //     query['$or'] = [];
    // }
    if (tags) {
        if (tags.length > 0) {
            for (var i = tags.length - 1; i >= 0; i--) {
                query["$or"].push({
                    "data.tags.data.title": tags[i].title
                })
            }
        }
    }
    if (folders) {
        if (folders.length > 0) {
            for (var i = folders.length - 1; i >= 0; i--) {
                query["$or"].push({
                    "data.categories.id": folders[i].id
                })
            }
        }
    }
    return new Promise((resolve, reject) => {
        console.log('query search searchTextCompleteDocuments' , query)
        db.collection(collectionName).find(query).sort({score:{$meta:"textScore"}}).toArray(function(err, result) { 
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}
let validateCheck = (validationes, idDocument) => {
    if (validationes.length == 0) {
        return false;
    }
    for (var i = validationes.length - 1; i >= 0; i--) {
        if (validationes[i] == idDocument) {
            return true;
        }
    }
}
let comunityCheckCopy = (data, target) => {
    return new Promise((resolve, reject) => {
        for (var i = data.length - 1; i >= 0; i--) {
            // console.log('data',data[i])
            if (data[i]._id == target) {
                resolve(true)
            }
        }
        resolve(false);
    })
}
let comunityCheckValidate = (data, target) => {
    console.log('function', data)
    return new Promise((resolve, reject) => {
        for (var i = data.length - 1; i >= 0; i--) {
            console.log('data', data[i])
            if (data[i].data.idDocument == target) {
                resolve(true)
            }
        }
        resolve(false);
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
    getAllBestDocuments,
    getAllBestWritings,
    getAllDocuments,
    getAllWritings,
    getAllFeatured,
    getById,
    searchTextDocuments,
    searchTextWritings,
    create,
    searchTextCompleteWritings,
    searchTextCompleteDocuments,
    //
    validateCheck,
    comunityCheckCopy,
    comunityCheckValidate,
    deleteById,
    validate,
    update
}