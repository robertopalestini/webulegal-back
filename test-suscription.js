const mongodb = require("./services/mongodb.js");

mongodb.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  const auth =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVHVlIFNlcCAxMyAyMDIyIDIwOjI2OjIzIEdNVCswMDAwIChDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZSkiLCJ1c2VyaWQiOiI2MmY1NWEzNWFkZmFmNmRlZjAwNDQ5NDgiLCJpYXQiOjE2NjMxMDA3ODN9.TP4gGLuFqNItyfUlG8_oQO_E_UUSdLLiipvQE-wdi98";

  const paymentMercadopago = require("./core/resources/payment-mercadopago.js");
  const users = require("./core/resources/users.js");

  const mercadopago = require("mercadopago");

  var test = {
    action: "created",
    application_id: 4429557015917371,
    data: { id: "2c938084833669ff018338a4e1f400f6" },
    date: "2022-09-13T20:57:53Z",
    entity: "preapproval",
    id: 103184250304,
    type: "subscription_preapproval",
    version: 0,
  };

  mercadopago.preapproval
    .findById(test.data.id)
    .then(function (data) {
      const securePayment = data.response.external_reference;

      if (data.response.status == "pending") {
         console.log('pendiente de pago')
      }
      if (data.response.status == "authorized") {
        console.log('pago autorizado')
        console.log(data.response);

      }
      if (data.response.status == "cancelled") {
        console.log('pago cancelado') 
      } 
    })
    .catch(function (error) {
      console.log("err", error);
    });

  return;

  const userdata = {
    _id: "62f55a35adfaf6def0044948",
    data: {
      email: "go.high.design@gmail.com",
      password: "mg",
      profile: {
        firstname: "Manuel",
        lastname: "Gomez",
      },
      points: 30,
      role: "user",
      auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVHVlIFNlcCAxMyAyMDIyIDIwOjI2OjIzIEdNVCswMDAwIChDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZSkiLCJ1c2VyaWQiOiI2MmY1NWEzNWFkZmFmNmRlZjAwNDQ5NDgiLCJpYXQiOjE2NjMxMDA3ODN9.TP4gGLuFqNItyfUlG8_oQO_E_UUSdLLiipvQE-wdi98",
      validations: [],
      trial_days: 30,
      date: {
        create: {
          $date: {
            $numberLong: "1657674463000",
          },
        },
      },
      sucription_pay: true,
    },
  };

  paymentMercadopago
    .createSuscription("631cf952b770f67d2d583ae1", userdata._id)
    .then((data) => {
      console.log({
        pending: true,
        payment: data,
      });
    })
    .catch((err) => {
      console.log({
        pending: true,
        err: err,
      });
    });
});
