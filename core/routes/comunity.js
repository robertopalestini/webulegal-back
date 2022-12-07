const comunity = require("../resources/comunity.js");
const writings = require("../resources/writings.js");
const library = require("../resources/library.js");
const users = require("../resources/users.js");
const tools = require("../../inc/tools.js");
const database = require("../../services/mongodb.js");

const historyActivity = require("../resources/history-activity.js");

const commentsDocuments = require("../resources/comments-documents.js");

class Endpoint {
  constructor(app) {
    this.app = app;
    // this.group = '/api/cart';
  }
  formate(val) {
    return this.group + val;
  }
  documents() {
    this.app.post("/api/comunity/document/validate", function (req, res) {
      users
        .getByAuth(req.body.auth)
        .then((dataFrom) => {
          console.log("teste 1", dataFrom, req.body);
          comunity
            .getById(req.body.id)
            .then((data) => {
              var historyJSON = {
                id: dataFrom._id,
                email: dataFrom.data.email,
                lastname: dataFrom.data.profile.lastname,
                firstname: dataFrom.data.profile.firstname,
                msg: "Valido un documento - " + data.data.title,
                ref: "documento-publico-validar",
              };

              console.log("teste 2", data);
              comunity
                .validate(dataFrom._id, data.data.idUser, data._id)
                .then((dataValidate) => {
                  console.log("teste 3", data);
                  data.data.cout_validate =
                    parseInt(data.data.cout_validate) + parseInt(1);
                  comunity
                    .update(database.ObjectID(data._id).toString(), data.data)
                    .then((data) => {
                      historyActivity
                        .create(historyJSON)
                        .then((HistoryData) => {});

                      res.send({
                        success: true,
                      });
                    })
                    .catch((err) => {
                      res.send({
                        success: false,
                      });
                    });
                })
                .catch((err) => {
                  res.send(err);
                });
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/comunity/documents/check/details", function (req, res) {
      // saber si fue copiado a la biblioteca y si fue validado
      users
        .getByAuth(req.body.auth)
        .then((dataUser) => {
          var returnData = {
            copy: false,
            validate: false,
            owner: false,
          };
          if (!dataUser.data.validations) {
            returnData.validate = false;
          } else {
            returnData.validate = comunity.validateCheck(
              dataUser.data.validations,
              req.body.id
            );
          }
          if (returnData.validate === undefined) {
            returnData.validate = false;
          }
          comunity.getById(req.body.id).then((dataDocument) => {
            console.log(
              "qweqw",
              database.ObjectID(dataUser._id).toString(),
              database.ObjectID(dataDocument.data.idUser).toString()
            );
            if (
              database.ObjectID(dataUser._id).toString() ===
              database.ObjectID(dataDocument.data.idUser).toString()
            ) {
              returnData.owner = true;
              console.log("OWNER TRUE");
            } else {
              console.log("OWNER FALSE");
            }
            //
            library
              .checkDocumentCopyComunity(dataUser._id, dataDocument._id)
              .then((data) => {
                returnData.copy = data;
                console.log("details", returnData);
                res.send(returnData);
              });
          });
        })
        .catch((err) => {
          res.send(err);
        });
      //
    });
    this.app.post("/api/comunity/document/copy/writing", function (req, res) {
      //copy to library user
      users
        .getByAuth(req.body.auth)
        .then((dataUser) => {
          comunity
            .getById(req.body.id)
            .then((data) => {
              data.data.complete = 0;
              data.data.form_complete = true;
              data.data.id_share_comuniy = data._id;
              data.data.categories = [];

              var historyJSON = {
                id: dataUser._id,
                email: dataUser.data.email,
                lastname: dataUser.data.profile.lastname,
                firstname: dataUser.data.profile.firstname,
                msg:
                  "Se copio un escrito a <Mis escritos> - " + data.data.title,
                ref: "escrito-privado-copiar",
              };

              // data.data.tags_inline = tools.prepareInlineTags(data.data.tags);
              writings
                .createCustom(dataUser._id, data.data)
                .then((data) => {
                  historyActivity.create(historyJSON).then((HistoryData) => {});
                  console.log(data);
                  res.send(data);
                })
                .catch((err) => {
                  res.send(err);
                });
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post(
      "/api/comunity/search/complete/writings",
      function (req, res) {
        comunity
          .searchTextCompleteWritings(
            req.body.search,
            req.body.folders,
            req.body.tags
          )
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );
    this.app.post(
      "/api/comunity/search/complete/documents",
      function (req, res) {
        comunity
          .searchTextCompleteDocuments(
            req.body.search,
            req.body.folders,
            req.body.tags
          )
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );
    this.app.post("/api/comunity/search/document", function (req, res) {
      comunity
        .searchTextDocuments(req.body.search)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/comunity/search/writing", function (req, res) {
      comunity
        .searchTextWritings(req.body.search)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/comunity/best/documents", function (req, res) {
      comunity
        .getAllBestDocuments()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/comunity/best/writings", function (req, res) {
      comunity
        .getAllBestWritings()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/comunity/documents/get", function (req, res) {
      comunity
        .getById(req.body.id)
        .then((data) => {
          users
            .getById(data.data.idUser)
            .then((user) => {
              user.data.password = null;
              user.data.auth = null;
              user.data.address = null;
              data.data.user = user;
              res.send(data);
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/comunity/document/create/writing", function (req, res) {
      //copy to library user
      users
        .getByAuth(req.body.auth)
        .then((dataAuth) => {
          comunity
            .getById(req.body.id)
            .then((data) => {
              console.log("usuario", dataAuth, "documento", data);
              // ----------------
              data.data.fields = req.body.fields;
              data.data.form_complete = true;
              data.data.complete = 1;
              data.data.share = 0;
              data.data.content = req.body.content;
              data.data.idUser = dataAuth._id;
              data.data.tags_inline = tools.prepareInlineTags(data.data.tags);
              data.data.categories = [];
              // ----------------

              var historyJSON = {
                id: dataAuth._id,
                email: dataAuth.data.email,
                lastname: dataAuth.data.profile.lastname,
                firstname: dataAuth.data.profile.firstname,
                msg: "Creo un escrito desde <Comunidad> - " + data.data.title,
                ref: "escrito-publico-crear",
              };

              writings
                .createCustom(dataAuth._id, data.data)
                .then((data) => {
                  historyActivity.create(historyJSON).then((HistoryData) => {});

                  res.send(data);
                })
                .catch((err) => {
                  res.send(err);
                });
              // ----------------
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/comunity/fields/preview", function (req, res) {
      comunity
        .getById(req.body.id)
        .then((data) => {
          var content = data.data.content;
          const fields = req.body.fields;
          for (var i = fields.length - 1; i >= 0; i--) {
            // <a class="" data-id="496987" replace="Nombre del administrado" base="">[Nombre del administrado]</a>
            var searchText =
              '<a class="testeo" data-id="' +
              fields[i].id +
              '" replace="' +
              fields[i].replace +
              '" base="' +
              fields[i].base +
              '">[' +
              fields[i].replace +
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
              '<a class="" data-id="' +
              fields[i].id +
              '" replace="' +
              fields[i].replace +
              '" base="' +
              fields[i].base +
              '">[' +
              fields[i].replace +
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
              fields[i].id +
              '" replace="' +
              fields[i].replace +
              '" base="' +
              fields[i].base +
              '">[' +
              fields[i].replace +
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
              fields[i].id +
              '" replace="' +
              fields[i].replace.replace(/&nbsp;/g, "") +
              '" base="' +
              fields[i].base.replace(/&nbsp;/g, "") +
              '">[' +
              fields[i].replace +
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


            if(fields[i].existent_fields) {
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
            content: content,
          });
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/comunity/delete/documents", function (req, res) {
      comunity
        .deleteById(req.body.id)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/comunity/document/copy/library", function (req, res) {
      //copy to library user
      users
        .getByAuth(req.body.auth)
        .then((dataUser) => {
          comunity
            .getById(req.body.id)
            .then((data) => {
              data.data.categories = [];
              data.data.id_share_comuniy = data._id;

              var historyJSON = {
                id: dataUser._id,
                email: dataUser.data.email,
                lastname: dataUser.data.profile.lastname,
                firstname: dataUser.data.profile.firstname,
                msg:
                  "Se copio un documento a <Mi biblioteca> - " +
                  data.data.title,
                ref: "documento-privado-copiar",
              };

              library
                .createCustom(dataUser._id, data.data)
                .then((data) => {
                  historyActivity.create(historyJSON).then((HistoryData) => {});
                  res.send(data);
                })
                .catch((err) => {
                  res.send(err);
                });
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    });

    this.app.post("/api/comunity/comments/create", function (req, res) {
      users
        .getByAuth(req.body.auth)
        .then((dataUser) => {


            comunity
            .getById(req.body.id)
            .then((dataDocument) => {

                commentsDocuments
                .create({
                  
                    id: dataUser._id,
                    email: dataUser.data.email,
                    firstname: dataUser.data.profile.firstname,
                    lastname: dataUser.data.profile.lastname,
                 
                  document: req.body.id,
                  document_title : dataDocument.data.title,
                  document_description : dataDocument.data.description,
                  comment: req.body.comment,
                })
                .then((data) => {
                  res.send(data);
                })
                .catch((err) => {
                  res.send(err);
                });


            }).catch((err) => {
                res.send(err);
              });
          
        })
        .catch((err) => {
          res.send(err);
        });
    });

    this.app.post("/api/comunity/comments/document", function (req, res) {
      commentsDocuments
        .getAllByDocument(req.body.id)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    this.app.post("/api/admin/comments", function (req, res) {
      commentsDocuments
        .getAll()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });
    this.app.post("/api/admin/comments/delete", function (req, res) {
      commentsDocuments
        .deleteById(req.body.id)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });
  }
  actions() {
    // this.app.post('/api/comunity/delete/documents', function(req, res) {
    //     users.getByAuth(req.body.auth).then((data) => {
    //         comunity.delete(req.body.id).then((data) => {
    //             res.send(data);
    //         }).catch((err) => {
    //             res.send(err);
    //         });
    //     }).catch((err) => {
    //         res.send(err);
    //     });
    // });
  }
  start() {
    this.documents();
    this.actions();
  }
}
module.exports = function (params) {
  return new Endpoint(params);
};
