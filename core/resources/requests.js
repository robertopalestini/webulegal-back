const database = require('../../services/mongodb.js');
const db = database.getDb();
const collectionName = 'requests';
//
//
//
//
//
//
//
//
let createPoint = (user) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            data: {
                     rol: 'points',
                     user: {
                         id: user._id,
                         email: user.data.email,
                         lastname: user.data.profile.lastname,
                         firstname: user.data.profile.firstname,
                     }
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

 
 


let createReportComment = (product, user, data) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            data: {
                rol: 'report-comment',
                message: data.message,
                type: 'comment',
                comment: product,
                user: {
                    id: user._id,
                    email: user.data.email,
                    lastname: user.data.profile.lastname,
                    firstname: user.data.profile.firstname,
                }
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


let createReport = (product, user, data) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            data: {
                rol: 'report',
                message: data.message,
                type: data.type,
                document: {
                    id: product._id,
                    title: product.data.title,
                    description: product.data.description,
                    user: product.data.idUser
                },
                user: {
                    id: user._id,
                    email: user.data.email,
                    lastname: user.data.profile.lastname,
                    firstname: user.data.profile.firstname,
                }
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
let createFeedback = (request) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            data: {
                rol: 'feedback',
                message: request.message,
                name: request.name,
                email: request.email
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
let createFolder = (data, request, type) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            data: {
                rol: 'folder',
                message: request.message,
                type: type,
                user: {
                    id: data._id,
                    email: data.data.email,
                    lastname: data.data.profile.lastname,
                    firstname: data.data.profile.firstname,
                }
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
let createTag = (data, request) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).insertOne({
            data: {
                rol: 'tag',
                message: request.message,
                user: {
                    id: data._id,
                    email: data.data.email,
                    lastname: data.data.profile.lastname,
                    firstname: data.data.profile.firstname,
                }
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
let getAllFolders = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.rol": "folder"
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllTags = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.rol": "tag"
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllReports = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.rol": "report"
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}



let getAllReportsComments = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.rol": "report-comment"
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}



let getAllFeedback = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.rol": "feedback"
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(reject)
            } else {
                resolve(result)
            }
        });
    })
}


let getAllPoints = () => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.rol": "points"
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
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
    createPoint,
    createReport,
    createFeedback,
    createFolder,
    createTag,
    getAllFolders,
    getAllTags,
    getAllReports,
    getAllFeedback,
    getById,
    getAllPoints,
    deleteById,
    createReportComment,
    getAllReportsComments

}