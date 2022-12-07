const mongodb = require('./services/mongodb.js');
const couchFolders = require('./inc/folders-defaultv2.js');
var count = 0;
var temp = [];
// couchFolders.getFoldersDocuments().then((data) => {
//     if (data.length > 0) {
//         for (var i = data.length - 1; i >= 0; i--) {
//             count++;
//             couchFolders.getFoldersDocumentsChilds(data[i]._id).then((data) => {
//                 console.log(data)
//                 if (data.length > 0) {
//                     for (var i = data.length - 1; i >= 0; i--) {
//                         count++;
//                         couchFolders.getFoldersDocumentsChilds(data[i]._id).then((data) => {
//                             console.log(data)
//                             if (data.length > 0) {
//                                 for (var i = data.length - 1; i >= 0; i--) {
//                                     count++;
//                                     couchFolders.getFoldersDocumentsChilds(data[i]._id).then((data) => {
//                                         console.log(data)
//                                         if (data.length > 0) {
//                                             for (var i = data.length - 1; i >= 0; i--) {
//                                                 count++;
//                                                 couchFolders.getFoldersDocumentsChilds(data[i]._id).then((data) => {
//                                                     console.log(data)
//                                                     if (data.length > 0) {
//                                                         for (var i = data.length - 1; i >= 0; i--) {
//                                                             count++;
//                                                             couchFolders.getFoldersDocumentsChilds(data[i]._id).then((data) => {
//                                                                 console.log(data)
//                                                                 if (data.length > 0) {
//                                                                     for (var i = data.length - 1; i >= 0; i--) {
//                                                                         count++;
//                                                                         couchFolders.getFoldersDocumentsChilds(data[i]._id).then((data) => {
//                                                                             console.log(data)
//                                                                         })
//                                                                     }
//                                                                 }
//                                                             })
//                                                         }
//                                                     }
//                                                 })
//                                             }
//                                         }
//                                     })
//                                 }
//                             }
//                         })
//                     }
//                 }
//             })
//         }
//     }
// })
// return;
setTimeout(() => {
    console.log(count)
}, 7000)
mongodb.connectToServer(function(err) {
    if (err) {
        console.error(err);
        process.exit();
    }
    const lineReader = require('line-reader');
    const foldersDocuments = require('./core/resources/folders-documents.js');
    couchFolders.getFoldersDocuments().then((data) => {
        console.log(data)
        if (data.length > 0) {
            for (var i = data.length - 1; i >= 0; i--) {
                count++;
                foldersDocuments.create({
                    text: data[i].data.text,
                    parent: null,
                    nodes: []
                }).then((insert) => {
                    couchFolders.getFoldersDocumentsChilds(data[i]._id).then((data) => {
                        if (data.length > 0) {
                            for (var i = data.length - 1; i >= 0; i--) {
                                count++;
                                foldersDocuments.create({
                                    text: data[i].data.text,
                                    parent: insert.insertedId,
                                    nodes: []
                                }).then((insert) => {
                                    couchFolders.getFoldersDocumentsChilds(data[i]._id).then((data) => {
                                        console.log(data)
                                        if (data.length > 0) {
                                            for (var i = data.length - 1; i >= 0; i--) {
                                                count++;
                                                foldersDocuments.create({
                                                    text: data[i].data.text,
                                                    parent: insert.insertedId,
                                                    nodes: []
                                                }).then((insert) => {
                                                    couchFolders.getFoldersDocumentsChilds(data[i]._id).then((data) => {
                                                        console.log(data)
                                                        if (data.length > 0) {
                                                            for (var i = data.length - 1; i >= 0; i--) {
                                                                count++;
                                                                foldersDocuments.create({
                                                                    text: data[i].data.text,
                                                                    parent: insert.insertedId,
                                                                    nodes: []
                                                                }).then((insert) => {
                                                                    console.log(insert)
                                                                })
                                                            }
                                                        }
                                                    })
                                                })
                                            }
                                        }
                                    })
                                })
                            }
                        }
                    })
                }).catch((err) => { 
                });
            }
        }
    })
})