const users = require("../resources/users.js");
const payments = require("../resources/payments.js");
const paymentsSecure = require("../resources/payments-secure.js");

const paymentCodes = require("../resources/promotional-codes.js");

const paymentSuscriptionsRemove = require("../resources/payments-suscriptions-remove.js");

const date = require("date-and-time");
const moment = require("moment"); // require

const config = require("../../settings.js");
const jwt = require("jsonwebtoken");

const mercadopago = require("mercadopago");
mercadopago.configure({
  access_token: config.secure.mercadopago.access_token,
});

const paymentMercadopago = require("../resources/payment-mercadopago.js");


const historyActivity = require('../resources/history-activity.js');
 


class Endpoint {
  constructor(app) {
    this.app = app; 
  }
  formate(val) {
    return this.group + val;
  }

  start() {
     

        
    this.app.post(
      "/api/admin/activity",
      function (req, res) {
        historyActivity
          .getAll()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );


    this.app.post(
      "/api/admin/payments/suscriptions/remove",
      function (req, res) {
        paymentSuscriptionsRemove
          .getAll()
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    );

    // endpoint: window.ENDPOINT + '/users/auth',

    this.app.post("/api/users/suscription/remove", function (req, res) {
      users.getByAuth(req.body.auth).then((dataUser) => {
        dataUser.data.date.create = new Date();
        dataUser.data.trial_days = -1;
        dataUser.data.sucription_pay = false;
        dataUser.data.suscription_internal = null;
        users.update(dataUser._id, dataUser.data).then((data) => {
          mercadopago.preapproval
            .cancel(dataUser.data.suscription_id)
            .then(function (dataRemoveMP) {
              paymentSuscriptionsRemove
                .create({ 
                    id : dataUser._id,
                    email : dataUser.data.email,
                    lastname : dataUser.data.profile.lastname,
                    firstname : dataUser.data.profile.firstname, 
                    suscription_id : dataUser.data.suscription_id,
                })
                .then((data) => {
                  console.log("cancel data", dataRemoveMP);
                  res.send(dataRemoveMP);
                })
                .catch((err) => {
                  res.send(err);
                });
            })
            .catch(function (error) {
              res.send(error);
            });
        });
      });
    });

    this.app.post("/api/users/account/edit", function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        data.data.email = req.body.data.email;
        data.data.password = req.body.data.password;
        data.data.profile.lastname = req.body.data.profile.lastname;
        data.data.profile.firstname = req.body.data.profile.firstname;

        users.update(data._id, data.data).then((data) => {
          res.send(data);
        });
      });
    });

    this.app.post("/api/admin/payments/code/edit", function (req, res) {
      paymentCodes.update(req.body.id, req.body.data).then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/admin/payments/code", function (req, res) {
      paymentCodes.getAll().then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/admin/payments/code/create", function (req, res) {
      paymentCodes.create(req.body.data).then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/admin/payments/code/delete", function (req, res) {
      paymentCodes
        .deleteById(req.body.id)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    this.app.post("/api/admin/payments/code/get", function (req, res) {
      paymentCodes
        .getById(req.body.id)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    // this.app.get("/api/payments/callback", function (req, res) {
    //   console.log('CALLBACK get',req.body,req.query)
    // });

    this.app.post("/api/admin/payments/edit", function (req, res) {
      payments.update(req.body.id, req.body.data).then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/admin/payments", function (req, res) {
      payments.getAll().then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/admin/payments/create", function (req, res) {
      payments.create(req.body.data).then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/admin/payments/delete", function (req, res) {
      payments
        .deleteById(req.body.id)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    this.app.post("/api/admin/payments/get", function (req, res) {
      payments
        .getById(req.body.id)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    this.app.post("/api/payments/webhook", function (req, res) {
      mercadopago.preapproval
        .findById(req.body.data.id)
        .then(function (data) {
          const securePayment = data.response.external_reference;

          if (data.response.status == "pending") {
            console.log("pendiente de pago");
          }
          if (data.response.status == "authorized") {
            console.log("pago autorizado");
            console.log(data.response);
            paymentsSecure.getById(securePayment).then((dataInternal) => {
              console.log("data paymentsSecure", dataInternal);
              jwt.verify(
                dataInternal.token,
                config.secure.jwtSecret,
                function (err, decoded) {
                  console.log("data decode", decoded);
                  users.getById(decoded.userid).then((dataUser) => {
                    dataUser.data.date.create = new Date();
                    dataUser.data.trial_days = 30;
                    dataUser.data.sucription_pay = true;
                    dataUser.data.suscription_internal = dataInternal._id;
                    dataUser.data.suscription_id = req.body.data.id;
                    users
                      .update(dataUser._id, dataUser.data)
                      .then((dataUpdate) => {
                        console.log(dataUpdate);
                      });
                  });
                }
              );
            });
          }
          if (data.response.status == "cancelled") {
            console.log("pago cancelado");
          }
        })
        .catch(function (error) {
          console.log("err", error);
        });

      console.log("GET", req.body, "POST", req.params, "webook data");
      res.sendStatus(200);
    });

    this.app.post("/api/payments/callback", function (req, res) {
      //  console.log('CALLBACK POST',req.body,req.query);
      const internalID = req.query.internal;
      mercadopago.ipn
        .manage(req)
        .then(function (data) {
          console.log("internal ", req.query.internal);

          var paid_amount = 0;

          data.body.payments.forEach((element) => {
            if (element["status"] == "approved") {
              paid_amount += element["transaction_amount"];
            }
          });

          // If the payment's transaction amount is equal (or bigger) than the merchant_order's amount you can release your items
          if (paid_amount >= data.body.total_amount) {
            // if (count($merchant_order->shipments)>0) { // The merchant_order has shipments
            //     if($merchant_order->shipments[0]->status == "ready_to_ship") {
            //         print_r("Totally paid. Print the label and release your item.");
            //     }
            // } else { // The merchant_order don't has any shipments
            //     print_r("Totally paid. Release your item.");
            // }

            paymentsSecure.getById(internalID).then((dataInternal) => {
              console.log("data paymentsSecure", dataInternal);
              jwt.verify(
                dataInternal.token,
                config.secure.jwtSecret,
                function (err, decoded) {
                  console.log("data decode", decoded);
                  users.getById(decoded.userid).then((dataUser) => {
                    dataUser.data.date.create = new Date();
                    dataUser.data.trial_days = 30;
                    dataUser.data.sucription_pay = true;
                    users
                      .update(dataUser._id, dataUser.data)
                      .then((dataUpdate) => {
                        console.log(dataUpdate);
                      });
                  });
                }
              );
            });

            // jwt.verify(
            //   req.query.token,
            //   config.secure.jwtSecret,
            //   function (err, decoded) {
            //     users.getById(decoded.userid).then((dataUser) => {
            //       dataUser.data.date.create = new Date();
            //       dataUser.data.trial_days = 30;
            //       dataUser.data.sucription_pay = true;
            //       users
            //         .update(dataUser._id, dataUser.data)
            //         .then((dataUpdate) => {
            //           console.log(dataUpdate);
            //         });
            //     });
            //   }
            // );

            console.log("pagado", paid_amount, data.body.total_amount);
          } else {
            // jwt.verify(req.query.token, config.secure.jwtSecret, function(err, decoded) {

            //   users.getById(decoded.userid).then(dataUser => {
            //     dataUser.data.date.create =  new Date();s
            //     dataUser.data.trial_days = 30;
            //     dataUser.data.sucription_pay = true;
            //     users.update(dataUser._id,dataUser.data).then(dataUpdate => {
            //          console.log(dataUpdate)
            //     })
            //    })

            // });

            console.log("no pagado", paid_amount, data.body.total_amount);
          }

          res.sendStatus(200);
        })
        .catch(function (error) {
          res.sendStatus(500);
        });
    });

    this.app.post("/api/users/lost/password/token", function (req, res) {
      users.validateTokenLostPassword(req.body.token).then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/users/lost/password/change", function (req, res) {
      users.changePassword(req.body.token, req.body.password).then((data) => {
        res.send(data);
      });
    });

    this.app.post("/api/users/auth", function (req, res) {
      users.getByAuth(req.body.auth).then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/users/login", function (req, res) {
      users.login(req.body.email, req.body.password).then((data) => {
        res.send(data);
      });
    });


    this.app.post("/api/users/login/facebook", function (req, res) {
      users.loginFacebook(req.body.login, req.body.data).then((data) => {
        res.send(data);
      });
    });

    this.app.post("/api/users/login/google", function (req, res) {
      users
        .loginGoogle(
          req.body.login.clientId,
          req.body.login.credential,
          req.body.data
        )
        .then((data) => {
          res.send(data);
        });
    });
    this.app.post("/api/users/register", function (req, res) {
      users
        .register({
          email: req.body.email,
          password: req.body.password,
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          phone: req.body.phone,
          code_promotional: req.body.code_promotional,
        })
        .then((data) => {
          paymentCodes
            .addUserRegister(req.body.code_promotional, {
              id: data._id,
              email: req.body.email,
              lastname: req.body.lastname,
              firstname: req.body.firstname,
              phone: req.body.phone,
              code_promotional: req.body.code_promotional,
            })
            .then((dataCode) => {
              res.send(data);
            })
            .catch((err) => {
              res.send(data);
            });
        });
    });
    this.app.post("/api/admin/users", function (req, res) {
      users.getAll().then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/admin/users/get", function (req, res) {
      users.getById(req.body.id).then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/admin/users/edit", function (req, res) {
      users.update(req.body.id, req.body.data).then((data) => {
        res.send(data);
      });
    });
    this.app.post("/api/admin/users/delete", function (req, res) {
      users
        .deleteById(req.body.id)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.send(err);
        });
    });

    this.app.post("/api/users/check/suscription", function (req, res) {
      users
        .getByAuth(req.body.auth)
        .then((data) => {
          // const now = new Date('2022/07/15 03:41:41');
          // const c = new Date();

          var fechaDB = data.data.date.create;
          var trial_days = data.data.trial_days;

          var fechaActual = date.format(new Date(), "YYYY-MM-DD");
          var fechaCreacion = new Date(fechaDB);
          fechaCreacion.setDate(fechaCreacion.getDate() + trial_days);
          fechaCreacion = date.format(fechaCreacion, "YYYY-MM-DD");

          var test = moment(fechaActual).isAfter(fechaCreacion, "day");

          if (test) {
            paymentMercadopago
              .createSuscription(
                "631cf952b770f67d2d583ae1",
                data._id,
                data.data.code_promotional
              )
              .then((data) => {
                res.send({
                  pending: true,
                  payment: data,
                });
              })
              .catch((err) => {
                res.send({
                  pending: true,
                  err: err,
                });
              });

            // //tiene qe pagar
            // res.send({
            //   pending: true,
            // });
          } else {
            res.send({
              pending: false,
            });
          }
          console.log(
            test,
            "fecha actual",
            fechaActual,
            "Fecha de creacion del usuario",
            fechaCreacion
          );
        })
        .catch((err) => {
          res.send(err);
        });
    });
  }
}
module.exports = function (params) {
  return new Endpoint(params);
};
