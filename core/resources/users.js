const database = require("../../services/mongodb.js");
const db = database.getDb();
const jwt = require("jsonwebtoken");
const config = require("../../settings.js");
const collectionName = "users";
const nodemailer = require("nodemailer");

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
    db.collection(collectionName).updateOne(
      {
        _id: database.ObjectID(id),
      },
      {
        $set: {
          data: data,
        },
      },
      function (err, result) {
        if (err) {
          resolve(reject);
        } else {
          resolve(data);
        }
      }
    );
  });
};

let login = (email, password) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .find({
        "data.password": password,
        "data.email": email,
      })
      .limit(1)
      .toArray(function (err, result) {
        console.log("result login :", result, {
          "data.password": password,
          "data.email": email,
        });
        if (err) {
          resolve(err);
        } else {
          if (result.length == 0) {
            resolve({
              error: true,
            });
          } else {
            let settigns = {
              time: Date(),
              userid: result[0]._id,
            };
            result[0].data.auth = jwt.sign(settigns, config.secure.jwtSecret);
            update(result[0]._id, result[0].data).then((updateData) => {
              resolve(updateData);
            });
          }
        }
      });
  });
};
let register = (data) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .find({
        "data.email": data.email,
      })
      .toArray(function (err, result) {
        if (err) {
      return    resolve({
            error: true,
          });
        }
        if (result.length > 0) {
         return   resolve({
            error: true,
          });
        }

        let settigns = {
          time: Date(),
          userid: data.email,
        };

        db.collection(collectionName).insertOne(
          {
            data: {
              email: data.email,
              password: data.password,
              profile: {
                firstname: data.firstname,
                lastname: data.lastname,
              },
              code_promotional : data.code_promotional,
              points: 0,
              role: "user",
              auth: jwt.sign(settigns, config.secure.jwtSecret),
              validations: [],
              trial_days: 15,
              date: {
                create: new Date(),
              },
            },
          },
          function (err, result) {
            if (err) {
              resolve(err);
            } else {
              resolve(result);
            }
          }
        );
      });
  });
};
let getAll = () => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .find({})
      .sort({ _id: -1 })
      .limit(5000)
      .toArray(function (err, result) {
        if (err) {
          resolve(reject);
        } else {
          resolve(result);
        }
      });
  });
};
let getById = (id) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .findOne({
        _id: database.ObjectID(id),
      })
      .then(function (doc) {
        if (doc) {
          resolve(doc);
        } else {
          reject(doc);
        }
      });
  });
};
let getByAuth = (auth) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .findOne({
        "data.auth": auth,
      })
      .then(function (doc) {
        if (doc) {
          resolve(doc);
        } else {
          resolve(doc);
        }
      });
  });
};

let validateTokenLostPassword = (auth) => {
  console.log("in function", auth);
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .findOne({
        "data.lost_pw_token": auth,
      })
      .then(function (doc) {
        console.log("in then", doc);
        if (doc) {
          resolve(doc);
        } else {
          resolve(doc);
        }
      });
  });
};

let deleteById = (id) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).deleteOne(
      {
        _id: database.ObjectID(id),
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
let loginFacebook = (dataLogin, dataUser) => {
  return new Promise((resolve, reject) => {
    register({
      email: dataUser.email,
      password: dataLogin.authResponse.userID,
      firstname: dataUser.name,
      lastname: "",
    }).then((data) => {
      login(dataUser.email, dataLogin.authResponse.userID).then((loginData) => {
        resolve(loginData);
      });
    });
  });
}; 

let loginGoogle = (clientId, credential, dataUser) => {
  return new Promise((resolve, reject) => {
    register({
      email: dataUser.email,
      password: clientId,
      firstname: dataUser.given_name,
      lastname: dataUser.family_name,
    }).then((data) => {
      //  if(data.error) {
      //     resolve({error : true})
      //  }

      login(dataUser.email, clientId).then((loginData) => {
        resolve(loginData);
      });
    });
  });
};

let sendTokenLostPassword = (email) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .find({
        "data.email": email,
      })
      .limit(1)
      .toArray(function (err, result) {
        if (err) {
          resolve(err);
        } else {
          if (result.length == 0) {
            resolve({
              error: true,
            });
          } else {
            let settigns = {
              time: Date(),
              userid: result[0]._id,
            };
            const token = jwt.sign(settigns, config.secure.jwtSecret);
            result[0].data.lost_pw_token = token;
            update(result[0]._id, result[0].data).then(async (updateData) => {
              //////////////////////////// EMAIL CODE
              let transporter = nodemailer.createTransport({
                host: "smtp.hostinger.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: "soporte@webulegal.com", // generated ethereal user
                  pass: "Webu-box24", // generated ethereal password
                },
                tls: {
                  rejectUnauthorized: false,
                },
              });

              let info = await transporter.sendMail({
                from: '"Reestablecer clave" <soporte@webulegal.com>', // sender address
                to: email, // list of receivers
                subject: "Reestablecer clave", // Subject line
                // text: "Reestablecer clave", // plain text body
                html:
                  `
                        <p>Recientemente se ha solicitado cambiar la contraseña de su cuenta.<p>
                        <p>Si solicitó este cambio de contraseña, por favor haga click en el siguiente enlace para restablecer tu contraseña:</p>
                        <p><a href="https://webulegal.com/login/lost/password/step/2?token=` +
                  token +
                  `" > https://webulegal.com/login/lost/password/step/2?token=` +
                  token +
                  `</p>
                        <p>En caso de que el enlace no funcione, por favor copie y pegue el URL en su navegador.</p>

                        <br />

                        <p>Si usted no realizó ninguna solicitud, puede ignorar este mensaje y su contraseña seguirá siendo la misma.</p>
                        `, // html body
              });

              console.log(info);

              console.log("Message sent: %s", info.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

              // Preview only available when sending through an Ethereal account
              console.log(
                "Preview URL: %s",
                nodemailer.getTestMessageUrl(info)
              );
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
              ////////////////////////////////////////////////////

              resolve(info);
            });
          }
        }
      });
  });
};
// let loginFacebook = (login,  dataUser) => {

//     console.log('loginFacebook' , login,dataUser)

//     return new Promise((resolve, reject) => {
//       register({
//         email: dataUser.email,
//         password: login.authResponse.accessToken,
//         firstname: dataUser.name,
//         lastname: '',
//       }).then((data) => {
//         //  if(data.error) {
//         //     resolve({error : true})
//         //  }

//         console.log('register' , data)

//           getById(data.insertedId).then((data) => {

//             console.log('getById' , data)

//               data.data.password = login.authResponse.accessToken;
//               update(data._id,data.data).then((updateData) => {
//                 console.log('update' , data)
//                 login(dataUser.email, login.authResponse.accessToken).then((loginData) => {
//                     resolve(loginData);
//                   });
//               })
//           });

//       });
//     });
//   };

let changePassword = (token, password) => {
  return new Promise((resolve, reject) => {
    validateTokenLostPassword(token).then((data) => {
      data.data.password = password;
      data.data.lost_pw_token = null;

      update(data._id,data.data).then((update) => {
        resolve(update);
      });
    });
  });
};

module.exports = {
  login,
  register,
  getAll,
  getById,
  getByAuth,
  update,
  deleteById,
  loginGoogle,
  loginFacebook,
  sendTokenLostPassword,
  validateTokenLostPassword,
  changePassword,
};
