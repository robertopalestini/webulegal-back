const database = require('../../services/mongodb.js');
const db = database.getDb();
const collectionName = 'library';
const collectionNameFolder = 'library-folders';
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
                shared_with: []
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
let getAllDocumentsSharedWithMe = (user) => {
    return new Promise((resolve, reject) => {
        console.log(user)

        db.collection(collectionName).find({
            "data.shared_with": user
        }).sort({"_id": -1}).limit(500).toArray(function(err, result) {
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllDocumentsByObject = (user) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.idUser": user
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            console.log('result', result)
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}
let getById = (user, id, shared = false) => {
    return new Promise((resolve, reject) => {
        const where = {
            _id: database.ObjectID(id),
        }
        if (!shared) {
            where['data.idUser'] = user
        } else {
            where['data.shared_with'] = user
        }
        db.collection(collectionName).findOne(where).then(function(doc) {
            if (doc) {
                resolve(doc)
            } else {
                resolve(doc)
            }
        });
    })
}
const tags = (user) => {
    console.log('tags', user)
    return new Promise((resolve, reject) => {
        getAllDocuments(user).then((data) => {
            console.log('docs', data)
            var temp = [];
            for (var i = data.length - 1; i >= 0; i--) {
                for (var e = data[i].data.tags.length - 1; e >= 0; e--) {
                    data[i].data.tags[e].test = true;
                    temp.push(data[i].data.tags[e])
                }
            }
            var temp = dedupe(temp, value => value._id);
            temp.sort(byKey('data.title'))
            resolve(temp);
        }).catch((err) => {
            reject(err);
        })
    })
}
//
//
//
//
let createFolder = (user, data) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionNameFolder).insertOne({
            data: {
                idUser: user,
                id: data.id,
                nodes: data.nodes,
                parent: data.parent,
                state: {
                    checked: data.checked,
                    selected: data.selected,
                    expanded: data.expanded,
                },
                text: data.text,
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
let getAllFoldersRoot = (user) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionNameFolder).find({
            // "data.idUser": database.ObjectID(user).toString(),
            "data.idUser": database.ObjectID(user),
            "data.parent": null
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            console.log('allfolderrot--', err, result)
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}
let getAllFoldersChild = (user, parent) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionNameFolder).find({
            // "data.idUser": database.ObjectID(user).toString(),
            "data.idUser": database.ObjectID(user),
            "data.parent": parent
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
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
            }, function(err, result) {
                if (err) {
                    resolve(err)
                } else {
                    resolve(result)
                }
            });
        })
    })
}
let getAllDocumentsByFolder = (user, folder) => {
    console.log('all', {
        "data.idUser": user,
        "data.categories.id": folder,
    })
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.idUser": user,
            "data.categories.id": folder,
        }).sort({ "_id": -1 }).limit(500).toArray(function(err, result) {
            console.log('GETALLL', result)
            if (err) {
                resolve(err)
            } else {
                resolve(result)
            }
        });
    })
}
//
let checkDocumentCopyComunity = (user, id) => {
    console.log('check',{
            "data.idUser": user,
            "data.share": 1,
            "data.id_share_comuniy": id,
        })
    return new Promise((resolve, reject) => {
        db.collection(collectionName).findOne({
            "data.idUser": user,
            "data.share": 1,
            "data.id_share_comuniy": id,
        }).then(function(doc,err) {

            console.log('check2',doc)
            if(doc == null) {
                resolve(false)
            }
            resolve(true)
        });
    })
}
// let createFolder = (user, parent = null) => {
//     return new Promise((resolve, reject) => {
//         db.collection(collectionNameFolder).find({
//             "data.idUser": user,
//             "data.parent": parent
//         }).limit(500).toArray(function(err, result) {
//             if (err) {
//                 resolve(reject)
//             } else {
//                 resolve(result)
//             }
//         });
//     })
// }
let searchText = (user, target) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName).find({
            "data.idUser": user,
            $text: {
                $search: target
            }
        }).sort({ "_id": -1 }).toArray(function(err, result) {
            if (err) {
                resolve(err)
            } else {
                resolve(result)
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



let deleteByIdFolder = (id) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionNameFolder).deleteOne({
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
    getAllDocuments,
    getAllDocuments,
    getById,
    searchText,
    tags,
    update,
    getAllByTags,
    updateTitleDescription,
    createFolder,
    getAllFoldersRoot,
    getAllFoldersChild,
    saveFolderOrganization,
    getAllDocumentsSharedWithMe,
    getAllDocumentsByFolder,
    getAllDocumentsByObject,
    checkDocumentCopyComunity,
    deleteById,
    deleteByIdFolder,
    createCustom
}