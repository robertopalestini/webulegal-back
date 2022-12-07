const database = require("../../services/mongodb.js");
const db = database.getDb();

const mercadopago = require("mercadopago");
const jwt = require("jsonwebtoken");
const config = require("../../settings.js");

const users = require("../resources/users.js");

const paymentCodes = require("../resources/promotional-codes.js");

mercadopago.configure({
  access_token: config.secure.mercadopago.access_token,
});

const collectionName = "payments-secure";
const collectionNamePaymentConfig = "payments-settings";

let getConfiguration = (id) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionNamePaymentConfig)
      .find({
        active: "true",
      })
      .sort({ _id: -1 })
      .limit(500)
      .toArray(function (err, result) {
        if (err) {
          resolve(err);
        } else {
          resolve(result);
        }
      });
  });
};

let createPaymentSecure = (token, userData, paymentData) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).insertOne(
      {
        token: token,
        user: userData,
        payment: paymentData,
      },
      function (err, result) {
        if (err) {
          resolve(reject);
        } else {
          resolve(result);
        }
      }
    );
  });
};

let createPreference = (idConfigPayment, idUser, code = false) => {
  return new Promise((resolve, reject) => {
    getConfiguration(idConfigPayment).then((configPayment) => {
      var configPayment = configPayment[0];
      // console.log('config' , configPayment)
      users.getById(idUser).then((userData) => {
        // console.log('getById' , userData)

        let settigns = {
          time: Date(),
          userid: userData._id,
        };
        const token = jwt.sign(settigns, config.secure.jwtSecret);

        createPaymentSecure(token, userData).then((inserSecure) => {
          if (code) {
            paymentCodes
              .getAllByCode(code)
              .then((dataCode) => {
                var preference = {
                  items: [
                    {
                      id: token,
                      title: dataCode.title,
                      quantity: 1,
                      currency_id: "ARG",
                      unit_price: parseInt(dataCode.unit_price),
                    },
                  ],
                  // back_urls: {
                  //   success: "https://webulegal.com",
                  //   error:
                  //   "https://webulegal.com" +
                  //     "?payment=mercadopago&error=true&token=" +
                  //     token,
                  // },
                  // metadata: {
                  //   webuToken: token,
                  // },
                  // notification_url:
                  //   config.secure.mercadopago.back_urls.success +
                  //   "?payment=mercadopago&token=" +
                  //   token,
                };

                console.log('preferencias',preference)
                mercadopago.preferences
                  .create(preference)
                  .then(function (response) {
                    resolve(response);
                  })
                  .catch(function (error) {
                    reject(error);
                  });
              })
              .catch((errDataCode) => {
                var preference = {
                  items: [
                    {
                      id: token,
                      title: configPayment.title,
                      quantity: 1,
                      currency_id: "ARG",
                      unit_price: parseInt(configPayment.unit_price),
                    },
                  ],
                  // back_urls: {
                  //   success: "https://webulegal.com",
                  //   error:
                  //   "https://webulegal.com" +
                  //     "?payment=mercadopago&error=true&token=" +
                  //     token,
                  // },
                  // metadata: {
                  //   webuToken: token,
                  // },
                  // notification_url:
                  //   config.secure.mercadopago.back_urls.success +
                  //   "?payment=mercadopago&token=" +
                  //   token,
                };
                console.log('preferencias',preference)
                mercadopago.preferences
                  .create(preference)
                  .then(function (response) {
                    resolve(response);
                  })
                  .catch(function (error) {
                    reject(error);
                  });
              });
          } else {
            var preference = {
              items: [
                {
                  id: token,
                  title: configPayment.title,
                  quantity: 1,
                  currency_id: "ARG",
                  unit_price: parseInt(configPayment.unit_price),
                },
              ],
              // back_urls: {
              //   success: "https://webulegal.com",
              //   error:
              //   "https://webulegal.com" +
              //     "?payment=mercadopago&error=true&token=" +
              //     token,
              // },
              // metadata: {
              //   webuToken: token,
              // },
              // notification_url:
              //   config.secure.mercadopago.back_urls.success +
              //   "?payment=mercadopago&token=" +
              //   token,
            };
            console.log('preferencias',preference)
            mercadopago.preferences
              .create(preference)
              .then(function (response) {
                resolve(response);
              })
              .catch(function (error) {
                reject(error);
              });
          }
        });
      });
    });
  });
};

module.exports = createPreference;
