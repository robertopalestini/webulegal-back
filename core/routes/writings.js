const comunity = require('../resources/comunity.js');
const writings = require('../resources/writings.js');
const users = require('../resources/users.js');
const tools = require('../../inc/tools.js');
const exportsLib = require('../resources/export.js')();



const historyActivity = require('../resources/history-activity.js');


class Endpoint {
    constructor(app) {
        this.app = app;
        // this.group = '/api/cart'; 
    }
    formate(val) {
        return this.group + val;
    }
    documents() {
        // var libFolders = require('../inc/my-writings/folders.js');
        this.app.post('/api/writings/search', function (req, res) {
            users.getByAuth(req.body.auth).then((dataAuth) => {
                writings.searchText(dataAuth._id, req.body.target).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            })
        });





        this.app.post('/api/writings/edit/auto', function (req, res) {
            users.getByAuth(req.body.auth).then((dataAuth) => {
                writings.updateContent(req.body.id, dataAuth._id, req.body.data).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            });
        });


        this.app.post('/api/writings/edit', function (req, res) {
            users.getByAuth(req.body.auth).then((dataAuth) => {
                writings.updateTitleDescription(req.body.id, dataAuth._id, req.body.data).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/get/folders', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                writings.getAllFoldersRoot(data._id).then((data) => {
                    console.log('getAllFoldersRoot', data)
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });


        this.app.post('/api/writings/delete/folders', function (req, res) {
            writings.deleteByIdFolder(req.body.id).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });






        this.app.post('/api/writings/get/folders/child', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                writings.getAllFoldersChild(data._id, req.body.parent).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/save/folders', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                writings.createFolder(data._id, req.body.data).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/save/folders/organize', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                writings.saveFolderOrganization(req.body.id, data._id, req.body.folders).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/get/folders/documents', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                writings.getAllDocumentsByFolder(data._id, req.body.folders).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        // this.app.post('/api/writings/get/folders/create', function(req, res) {
        //     users.getByAuth(req.body.auth).then((data) => {
        //         writings.createFolder(data._id, req.body.parent).then((data) => {
        //             res.send(data);
        //         }).catch((err) => {
        //             res.send(err);
        //         });
        //     }).catch((err) => {
        //         res.send(err);
        //     });
        // });
        this.app.post('/api/writings/get/folders/document/save', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                writings.update(data._id, req.body.data).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        //
        // this.app.post('/api/documents/save', function(req, res) {
        //     users.getByAuth(req.body.auth).then((data) => {
        //         req.body.data.validate = 0;
        //         req.body.data.cout_validate = 0;
        //         req.body.data.share = 0;
        //         writings.create(data._id, req.body.data).then((data) => {
        //             console.log(data, 'create')
        //             res.send(data);
        //         }).catch((err) => {
        //             res.send(err);
        //         });
        //     }).catch((err) => {
        //         res.send(err);
        //     });
        // });
        this.app.post('/api/writings/create', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                req.body.data.validate = 0;
                req.body.data.cout_validate = 0;
                req.body.data.share = 0;
                req.body.data.fields.reverse();
                req.body.data.complete = 0;
                req.body.data.form_complete = true;
                req.body.data.version = '2.00';


                var historyJSON = {
                    id: data._id,
                    email: data.data.email,
                    lastname: data.data.profile.lastname,
                    firstname: data.data.profile.firstname,
                    msg: 'Se subio un escrito privado',
                    ref: 'escrito-privado',
                };

                writings.create(data._id, req.body.data).then((data) => {

                    historyActivity.create(historyJSON).then(HistoryData => { })

                    console.log(data, 'create')
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/get/documents', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                writings.getAllDocuments(data._id).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/get/documents/shared-with-me', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                writings.getAllDocumentsSharedWithMe(data._id).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/get/document', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                writings.getById(data._id, req.body.id).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/get/tags', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                console.log('data', data)
                writings.tags(data._id).then((data) => {
                    console.log('tags', data)
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/get/tags/documents', function (req, res) {
            users.getByAuth(req.body.auth).then((data) => {
                console.log('data', data)
                writings.getAllByTags(data._id, req.body.tags).then((data) => {
                    res.send(data);
                }).catch((err) => {
                    res.send(err);
                });
            }).catch((err) => {
                res.send(err);
            });
        });
        //  IN THIS ONE WE NEED TO ADD  READ | EDITOR
        //  and This endpoint hhave to put the user id from the email, in the file, in the field from the data object
        //  "shared_with": userId fromm the email.

        this.app.post("/api/writings/share/private", function (req, res) {
            users.compartirPrivado(req.body.email, req.body.documentId, req.body.firstName, req.body.lastName).then((data) => {
                writings.updateSharedWith(req.body.documentId, data.userId).then(() => {
                    res.send(data.data);
                })
            });
        });
        this.app.post('/api/writings/organize', function (req, res) {
            users.getByAuth(req.body.auth).then((dataAuth) => {
                writings.getById(dataAuth._id, req.body.id_document).then((data) => {
                    data.data.tags = [];
                    data.data.categories = [];
                    data.data.title = req.body.title;
                    data.data.description = req.body.description;
                    data.data.validate = 1;
                    data.data.cout_validate = 0;
                    data.data.share = 1;


                    var historyJSON = {
                        id: dataAuth._id,
                        email: dataAuth.data.email,
                        lastname: dataAuth.data.profile.lastname,
                        firstname: dataAuth.data.profile.firstname,
                        msg: 'Se hizo publico un escrito privado',
                        ref: 'escrito-privado-publico',
                    };


                    writings.update(data._id, data.data).then((dataUpdate) => {
                        data.data.categories = req.body.categories;
                        data.data.tags = req.body.tags;
                        data.data.title = req.body.title;
                        data.data.description = req.body.description;
                        data.data.validate = 1;
                        data.data.cout_validate = 0;
                        data.data.type = "writing";
                        data.data.categories_inline = tools.prepareInlineFolders(data.data.categories);
                        var temp = {
                            id: data._id,
                            data: data.data
                        }
                        comunity.create(dataAuth._id, data.data).then((data) => {
                            temp.data.id_share_comuniy = data.insertedId;

                            historyActivity.create(historyJSON).then(HistoryData => { })

                            writings.update(temp.id, temp.data).then((dataUpdate) => {
                                res.send(data);
                            })
                        }).catch((err) => {
                            res.send(err);
                        });
                    })
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/fields/preview', function (req, res) {
            users.getByAuth(req.body.auth).then((dataAuth) => {
                writings.getById(dataAuth._id, req.body.id).then((data) => {
                    console.log('preview writings', data)
                    var content = data.data.content;
                    const fields = req.body.fields;
                    for (var i = fields.length - 1; i >= 0; i--) {
                        // <a class="" data-id="496987" replace="Nombre del administrado" base="">[Nombre del administrado]</a>
                        var searchText = '<a class="testeo" data-id="' + fields[i].id + '" replace="' + fields[i].replace + '" base="' + fields[i].base + '">[' + fields[i].replace + ']</a>';
                        // console.log([searchText])
                        if (fields[i].user.input) {
                            content = content.replace(searchText, '<span class="mark">' + fields[i].user.input + '</span class="mark">');
                        }
                        var searchText = '<a class="" data-id="' + fields[i].id + '" replace="' + fields[i].replace + '" base="' + fields[i].base + '">[' + fields[i].replace + ']</a>';
                        console.log([searchText])
                        if (fields[i].user.input) {
                            content = content.replace(searchText, '<span class="mark">' + fields[i].user.input + '</span class="mark">');
                        }
                        var searchText = '<a data-id="' + fields[i].id + '" replace="' + fields[i].replace + '" base="' + fields[i].base + '">[' + fields[i].replace + ']</a>';
                        // console.log([searchText])
                        if (fields[i].user.input) {
                            content = content.replace(searchText, '<span class="mark">' + fields[i].user.input + '</span class="mark">');
                        }
                        var searchText = '<a data-id="' + fields[i].id + '" replace="' + fields[i].replace.replace(/&nbsp;/g, '') + '" base="' + fields[i].base.replace(/&nbsp;/g, '') + '">[' + fields[i].replace + ']</a>';
                        // console.log([searchText])
                        if (fields[i].user.input) {
                            content = content.replace(searchText, '<span class="mark">' + fields[i].user.input + '</span class="mark">');
                        }


                        if (fields[i].existent_fields) {
                            console.log('active extend')
                            for (var u = fields[i].existent_fields.length - 1; u >= 0; u--) {
                                var existent = fields[i].existent_fields;
                                // <a class="" data-id="496987" replace="Nombre del administrado" base="">[Nombre del administrado]</a>
                                var searchText =
                                    '<a class="testeo" data-id="' +
                                    existent[u].id +
                                    '" replace="' +
                                    existent[u].replace +
                                    '" base="' +
                                    existent[u].base +
                                    '">[' +
                                    existent[u].replace +
                                    "]</a>";

                                if (fields[i].user.input) {
                                    console.log('replace active')
                                    content = content.replace(
                                        searchText,
                                        '<span class="mark">' +
                                        fields[i].user.input +
                                        '</span class="mark">'
                                    );
                                }

                                console.log([searchText])


                                var searchText =
                                    '<a class="" data-id="' +
                                    existent[u].id +
                                    '" replace="' +
                                    existent[u].replace +
                                    '" base="' +
                                    existent[u].base +
                                    '">[' +
                                    existent[u].replace +
                                    "]</a>";



                                if (fields[i].user.input) {
                                    content = content.replace(
                                        searchText,
                                        '<span class="mark">' +
                                        fields[i].user.input +
                                        '</span class="mark">'
                                    );
                                }
                                var searchText =
                                    '<a data-id="' +
                                    existent[u].id +
                                    '" replace="' +
                                    existent[u].replace +
                                    '" base="' +
                                    existent[u].base +
                                    '">[' +
                                    existent[u].replace +
                                    "]</a>";
                                // console.log([searchText])
                                if (fields[i].user.input) {
                                    content = content.replace(
                                        searchText,
                                        '<span class="mark">' +
                                        fields[i].user.input +
                                        '</span class="mark">'
                                    );
                                }
                                var searchText =
                                    '<a data-id="' +
                                    existent[u].id +
                                    '" replace="' +
                                    existent[u].replace.replace(/&nbsp;/g, "") +
                                    '" base="' +
                                    existent[u].base.replace(/&nbsp;/g, "") +
                                    '">[' +
                                    existent[u].replace +
                                    "]</a>";
                                // console.log([searchText])
                                if (existent[u].user.input) {
                                    content = content.replace(
                                        searchText,
                                        '<span class="mark">' +
                                        existent[u].user.input +
                                        '</span class="mark">'
                                    );
                                }
                            }
                        }
                        // '<a class="" data-id="852809" replace="Describa los hechos que dan sustento a su pretensión" base="(Describa los hechos que dan sustento a su pretensión) ">[Describa los hechos que dan sustento a su pretensión]</a>'
                        // <a class="testeo" data-id="852809" replace="Describa los hechos que dan sustento a su pretensión" base="(Describa los hechos que dan sustento a su pretensión) ">[Describa los hechos que dan sustento a su pretensión]</a>
                    }
                    // expected output: "The quick brown fox jumps over the lazy monkey. If the dog reacted, was it really lazy?"
                    res.send({
                        content: content
                    });
                }).catch((err) => {
                    res.send(err);
                });
            });
        });
        this.app.post('/api/writings/document/create/writing', function (req, res) { //copy to library user
            users.getByAuth(req.body.auth).then((dataAuth) => {
                writings.getById(dataAuth._id, req.body.id).then((data) => {
                    // ----------------
                    data.data.fields = req.body.fields;
                    data.data.form_complete = true;
                    data.data.complete = 1;
                    data.data.content = req.body.content;
                    data.data.idUser = dataAuth._id;
                    data.data.share = 0;
                    // ----------------

                    var historyJSON = {
                        id: dataAuth._id,
                        email: dataAuth.data.email,
                        lastname: dataAuth.data.profile.lastname,
                        firstname: dataAuth.data.profile.firstname,
                        msg: 'Se creo un escrito desde <Mis escritos>',
                        ref: 'escrito-privado-creado',
                    };

                    writings.createCustom(dataAuth._id, data.data).then((data) => {


                        historyActivity.create(historyJSON).then(HistoryData => { })



                        res.send(data);
                    }).catch((err) => {
                        res.send(err);
                    });
                    // ----------------
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/delete/documents', function (req, res) {
            writings.deleteById(req.body.id).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/export/pdf', function (req, res) { //copy to library user 
            users.getByAuth(req.body.auth).then((dataAuth) => {
                writings.getById(dataAuth._id, req.body.id).then((data) => {
                    exportsLib.createPdfWriting(req.body.id).then((data) => {
                        res.send({
                            name: data
                        });
                    }).catch((err) => {
                        res.send(err);
                    });
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            });
        });
        this.app.post('/api/writings/export/word', function (req, res) { //copy to library user
            console.log('export word endpoint writings', req.body)
            users.getByAuth(req.body.auth).then((dataAuth) => {
                writings.getById(dataAuth._id, req.body.id).then((data) => {
                    exportsLib.createWordWriting(req.body.id).then((data) => {
                        res.send({
                            name: data
                        });
                    }).catch((err) => {
                        res.send(err);
                    });
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            });
        });


        this.app.post('/api/writings/sharepublic', function (req, res) { //copy to library user
            console.log('share public ndpoint writings', req.body)
            users.getByAuth(req.body.auth).then((dataAuth) => {

                writings.getById(dataAuth._id, req.body.id_document).then((data) => {
                    data.data.tags = [];
                    data.data.categories = [];
                    data.data.title = req.body.title;
                    data.data.description = req.body.description;
                    data.data.validate = 1;
                    data.data.cout_validate = 0;
                    data.data.share = 1;


                    var historyJSON = {
                        id: dataAuth._id,
                        email: dataAuth.data.email,
                        lastname: dataAuth.data.profile.lastname,
                        firstname: dataAuth.data.profile.firstname,
                        msg: 'Se hizo publico un escrito privado',
                        ref: 'escrito-privado-publico',
                    };


                    writings.update(data._id, data.data).then((dataUpdate) => {
                        data.data.categories = req.body.categories;
                        data.data.tags = req.body.tags;
                        data.data.title = req.body.title;
                        data.data.description = req.body.description;
                        data.data.validate = 1;
                        data.data.cout_validate = 0;
                        data.data.type = "writing";
                        data.data.categories_inline = tools.prepareInlineFolders(data.data.categories);
                        var temp = {
                            id: data._id,
                            data: data.data
                        }
                        comunity.create(dataAuth._id, data.data).then((data) => {
                            temp.data.id_share_comuniy = data.insertedId;

                            historyActivity.create(historyJSON).then(HistoryData => { })

                            writings.update(temp.id, temp.data).then((dataUpdate) => {
                                res.send(data);
                            })
                        }).catch((err) => {
                            res.send(err);
                        });
                    })
                }).catch((err) => {
                    res.send(err);
                })
            }).catch((err) => {
                res.send(err);
            });
        });
    }
    start() {
        this.documents();
    }
}
module.exports = function (params) {
    return new Endpoint(params);
};