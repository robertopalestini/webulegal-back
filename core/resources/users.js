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
              console.log('updateData' + updateData)
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
          return resolve({
            error: true,
          });
        }
        if (result.length > 0) {
          return resolve({
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
              code_promotional: data.code_promotional,
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
        doc.data.email = 'robertoadrianpalestini@yahoo.com.ar'
        console.log("in then", doc);
        if (doc) {
          resolve(doc);
          sendTokenLostPassword(doc.data.email)
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
                port: 465,
                // secure: false, // true for 465, false for other ports
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



let compartirPrivado = (email, documentId, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    console.log(firstName)
    console.log(lastName)
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
                port: 465,
                // secure: false, // true for 465, false for other ports
                auth: {
                  user: "soporte@webulegal.com", // generated ethereal user
                  pass: "Webu-box24", // generated ethereal password
                },
                tls: {
                  rejectUnauthorized: false,
                },
              });

              let info = transporter.sendMail({
                from: '"WebuLegal.com" <soporte@webulegal.com>', // sender address
                to: email, // list of receivers
                subject: "Te compartieron un documento en Webu", // Subject line
                // text: "Reestablecer clave", // plain text body
                html: `<!doctype html>
              <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:o="urn:schemas-microsoft-com:office:office">
              
              <head>
                <meta http-equiv="content-type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>WebuLegal - La comunidad legal</title>
                <style>
                  body {
                    height: 100% !important;
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                  }
              
                  img {
                    border: 0;
                    outline: none;
                    text-decoration: none;
                  }
              
                  img {
                    width: auto;
                    max-width: 100%;
                    display: block;
                  }
              
                  a:hover {
                    color: #009999 !important;
                  }
              
                  a:active {
                    color: #009999 !important;
                  }
              
                  a:visited {
                    color: #009999 !important;
                  }
              
                  .ReadMsgBody {
                    width: 100%;
                  }
              
                  .ExternalClass {
                    width: 100%;
                  }
              
                  img {
                    -ms-interpolation-mode: bicubic;
                  }
              
                  body {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                  }
              
                  body {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    font-weight: normal;
                    line-height: 24px;
                    color: #4A4A4A;
                  }
              
                  body {
                    background-color: #f4f4f4;
                  }
              
                  .btn a:hover {
                    color: #fff !important;
                  }
              
                  .btn a:active {
                    color: #fff !important;
                  }
              
                  .btn a:visited {
                    color: #fff !important;
                  }
              
                  @media only screen and (max-width: 600px) {
                    body {
                      width: 100% !important;
                      min-width: 100% !important;
                      background-color: #ffffff !important;
                    }
                  }
              
                  @media only screen and (max-width: 600px) {
                    body {
                      -webkit-text-size-adjust: none !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    table {
                      -webkit-text-size-adjust: none !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    td {
                      -webkit-text-size-adjust: none !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    p {
                      -webkit-text-size-adjust: none !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    a {
                      -webkit-text-size-adjust: none !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    li {
                      -webkit-text-size-adjust: none !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    blockquote {
                      -webkit-text-size-adjust: none !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    table {
                      max-width: 580px !important;
                      width: 100% !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    #bodyTable {
                      background-color: #ffffff !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    #bodyCell {
                      padding: 0 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column {
                      display: block !important;
                      width: 100% !important;
                      padding: 0 0 15px !important;
                      box-sizing: border-box;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-22 {
                      display: block !important;
                      width: 100% !important;
                      padding: 0 0 15px !important;
                      box-sizing: border-box;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-65 {
                      display: block !important;
                      width: 100% !important;
                      padding: 0 0 15px !important;
                      box-sizing: border-box;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-78 {
                      display: block !important;
                      width: 100% !important;
                      padding: 0 0 15px !important;
                      box-sizing: border-box;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-25 {
                      display: block !important;
                      width: 100% !important;
                      padding: 0 0 15px !important;
                      box-sizing: border-box;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-50 {
                      display: block !important;
                      width: 100% !important;
                      padding: 0 0 15px !important;
                      box-sizing: border-box;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column:last-child {
                      padding-bottom: 0 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-22:last-child {
                      padding-bottom: 0 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-65:last-child {
                      padding-bottom: 0 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-78:last-child {
                      padding-bottom: 0 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-25:last-child {
                      padding-bottom: 0 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .column-50:last-child {
                      padding-bottom: 0 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .header-logo {
                      padding: 15px !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .header {
                      padding: 20px !important;
                      border-radius: 0 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .section {
                      padding: 20px !important;
                      border-radius: 0 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .header {
                      background: #3F3D55 !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .product-block {
                      background: #04158E !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .footer .icon-text {
                      display: none !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .is-fittogrid {
                      width: 100% !important;
                      height: auto !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .mobile-centered-container {
                      text-align: center !important;
                    }
              
                  }
              
                  @media only screen and (max-width: 600px) {
                    .mobile-centered-item {
                      display: inline-block !important;
                    }
                  }
                </style>
              </head>
              
              <body
                style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background: #f4f4f4; color: #4A4A4A; font-family: Arial, sans-serif; font-size: 16px; font-weight: normal; height: 100% !important; line-height: 24px; margin: 0; padding: 0; width: 100% !important"
                bgcolor="#f4f4f4">
                <center>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" id="bodyTable"
                    style="height:100% !important;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background:#f4f4f4;border-collapse:collapse;color:#4A4A4A;font-family:Arial, sans-serif;font-size:16px;font-weight:normal;line-height:24px;margin:0;mso-table-lspace:0pt;mso-table-rspace:0pt;padding:0;width:100% !important;"
                    bgcolor="#f4f4f4">
                    <tbody>
                      <tr>
                        <td align="center" valign="top" id="bodyCell"
                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;height:100% !important;margin:0;mso-table-lspace:0pt;mso-table-rspace:0pt;padding:20px;width:100% !important;">
                          <!-- // BEGIN EMAIL -->
                          <table border="0" cellpadding="0" cellspacing="0" width="560" class="main"
                            style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                            <tbody>
                              <!-- // OUTSIDE LOGO -->
                              <tr>
                                <td align="center" valign="top" class="header-logo"
                                  style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;padding:10px 50px 30px;">
                                  <!-- // Logo block // -->
                                  <a href="https://www.webulegal.com" target="_blank"
                                    style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#4DC3C9;text-decoration:none;"><img
                                      src="https://webulegal.com/assets/logo.c7722dd1.png" alt="WebuLegal" width="130px"
                                      style="-ms-interpolation-mode: bicubic; border: 0; display: block; max-width: 100%; outline: none; text-decoration: none; vertical-align: middle; width: auto"></a>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" valign="top" class="header"
                                  style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background:#2b44ff repeat-y top;background-size:560px 150px;border-radius:5px 5px 0 0;mso-table-lspace:0pt;mso-table-rspace:0pt;padding:28px 130px;"
                                  bgcolor="#2b44ff">
                                  <!-- // Header block // -->
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                    style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                    <tbody>
                                      <tr>
                                        <td align="center" valign="middle" class="mobile-centered-container"
                                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                          <h1 class="header-heading mobile-centered-item"
                                            style="color:#fff;font-size:24px;letter-spacing:-.43px;line-height:30px;margin:0;padding:0 0 20px;">
                                            Hola, ${email}
                                            </h1>
                                          <div>
                                        
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" valign="top" class="section is-top-merged"
                                  style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background:#fff;border-radius:0 0 5px 5px;mso-table-lspace:0pt;mso-table-rspace:0pt;padding:20px 50px 40px;"
                                  bgcolor="#ffffff">
                                  <!-- Content section -->
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                    style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                    <tbody>
                                      <tr>
                                        <td align="center" valign="top" class="section-heading"
                                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;padding-bottom:15px;">
                                          <h3 style="color:#9B9B9B;font-size:14px;margin:0;padding:0;text-transform:uppercase;">
                                          Buenas noticias! 
                                          </h3>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td align="left" valign="top" class="content-item"
                                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;padding-bottom:25px;">
                                          <h1
                                            style="color:#4A4A4A;font-size:24px;letter-spacing:-.7px;line-height:29px;margin:0;padding:0;">
                                            <span class="highlighted-text" style="color: #000">   ${firstName} ${lastName} te compartio un documento privado!</span>
                                          </h1>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td align="left" valign="top" class="content-item"
                                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;padding-bottom:25px;">
                                          <!-- // Example block // -->
                                          <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                            style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                            <tbody>
                                              <tr>
                                                <td align="left" valign="top"
                                                  style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                                  <img src="https://webulegal.com/assets/bibliotecacola.d44b8546.png" alt="verification changes"
                                                    class="is-fittogrid"
                                                    style="-ms-interpolation-mode: bicubic; border: 0; display: block; max-width: 100%; outline: none; text-decoration: none; width: auto">
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table border="0" cellpadding="0" cellspacing="0" align="center" class="btn"
                                    style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                    <tbody>
                                      <tr>
                                        <td align="center" valign="middle" class="btn-content"
                                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background:#4DC3C9;border:2px solid #4a4a4a;border-radius:30px;color:#fff;mso-table-lspace:0pt;mso-table-rspace:0pt;padding:4px 20px;"
                                          bgcolor="#4DC3C9">
                                          <a href="http://webulegal.com/platform/document/${documentId}" target="_blank"
                                            style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#ffffff !important;display:block;font-family:Arial, sans-serif;font-size:13px;font-weight:bold;text-decoration:none;">Abrir Documento</a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <!-- Section separator -->
                                <td align="left" valign="top" class="section-spacer"
                                  style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;padding:15px;">
                                </td>
                              </tr>
                              <tr>
                                <td align="left" valign="top" class="section"
                                  style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-radius:0 0 5px 5px;color:#4A4A4A;mso-table-lspace:0pt;mso-table-rspace:0pt;padding:40px 50px;background:#ffffff url('https://marketing-image-production.s3.amazonaws.com/uploads/3978505229776794b53cf3f883690e124e7bb6857cfeec1fc679571a5fa2bdb63fd540dc5ae7d3e63ee0391d80feb0d0494b7b6e16d987fcc9354a58e57ea6e3.png') no-repeat top;background-size:560px 4px;"
                                  bgcolor="#ffffff">
                                  <!-- Own products block -->
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                    style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                    <tbody>
                                      <tr>
                                        <!-- Footer -->
                                        <td align="center" valign="top" class="footer"
                                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;padding-top:20px;">
                                          <!-- Content block -->
                                          <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                            style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                            <tbody>
                                              <tr>
                                                <td align="center" valign="top" class="footer-heading"
                                                  style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background:url('https://gallery.mailchimp.com/bfdf3c6997809dba3c6682bcf/images/cabdbec1-8813-44da-b186-baec3b4f5bbd.png') repeat-x top;background-size:20px;mso-table-lspace:0pt;mso-table-rspace:0pt;padding-bottom:25px;">
                                                  <h2
                                                    style="background:#ffffff;color:#4A4A4A;display:inline-block;font-size:16px;letter-spacing:-.53px;line-height:20px;margin:0;padding:0 10px;">
                                                    Seguinos!</h2>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td align="center" valign="middle"
                                                  style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                                  <!-- Grid -->
                                                  <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                                    style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                                    <tbody>
                                                      <tr>
                                                        <!-- Column -->
                                                        <td align="center" valign="middle" class="social-item"
                                                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                                          <a href="https://www.facebook.com/Webu-102265205747930"
                                                            style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#4A4A4A !important;font-size:12px;font-weight:bold;letter-spacing:-.5px;line-height:14px;text-decoration:none;"
                                                            target="_blank"><img
                                                              src="https://marketing-image-production.s3.amazonaws.com/uploads/852b2e2fbd40963c0291f1bec533890a216351ecc0d249726c70327c6dc905c10067a48bef55b977ecf925267dbf3f90d7581684bc04ff15747a89de481375f8.png"
                                                              width="36" height="36" alt="Facebook Icon"
                                                              style="-ms-interpolation-mode: bicubic; border: 0; display: inline-block; max-width: 100%; outline: none; padding-right: 10px; text-decoration: none; vertical-align: middle; width: auto"><span
                                                              class="icon-text">Facebook</span></a>
                                                        </td>
                                                        <!-- Column -->
                                                        <td align="center" valign="middle" class="social-item"
                                                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                                          <a href="https://www.instagram.com/webu_ar/"
                                                            style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#4A4A4A !important;font-size:12px;font-weight:bold;letter-spacing:-.5px;line-height:14px;text-decoration:none;"
                                                            target="_blank"><img
                                                              src="https://marketing-image-production.s3.amazonaws.com/uploads/a95362838b314d3f2d265bf994034ff288b4ad533f14d369b4ce8b729aede1f0b340dc844034ba1ed758d0559fcbad36658abfddc4e0e2405c42fb719bd96973.png"
                                                              width="36" height="36" alt="Twitter Icon"
                                                              style="-ms-interpolation-mode: bicubic; border: 0; display: inline-block; max-width: 100%; outline: none; padding-right: 10px; text-decoration: none; vertical-align: middle; width: auto"><span
                                                              class="icon-text">Twitter</span></a>
                                                        </td>
                                                        <!-- Column -->
                                                        <td align="center" valign="middle" class="social-item"
                                                          style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                                                          <a href="https://www.linkedin.com/company/wearewebu/"
                                                            style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#4A4A4A !important;font-size:12px;font-weight:bold;letter-spacing:-.5px;line-height:14px;text-decoration:none;"
                                                            target="_blank"><img
                                                              src="https://marketing-image-production.s3.amazonaws.com/uploads/326bb956e1b0f02a26affd9a584119d9838c39cf04d1c28b07569c28c6532b4a94b46961b9306b80d4e68e12007f6628f8f1797379c40869ec629862dee38d9d.png"
                                                              width="36" height="36" alt="Twitter Icon"
                                                              style="-ms-interpolation-mode: bicubic; border: 0; display: inline-block; max-width: 100%; outline: none; padding-right: 10px; text-decoration: none; vertical-align: middle; width: auto"><span
                                                              class="icon-text">Linked In</span></a>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!-- END EMAIL // -->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </center>
              </body>
              
              </html>`, // html body
              });



              console.log("Message sent: %s", info.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

              // Preview only available when sending through an Ethereal account
              console.log(
                "Preview URL: %s",
                nodemailer.getTestMessageUrl(info)
              );
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
              ////////////////////////////////////////////////////

              resolve({ userId: result[0]._id, data: info });
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

      update(data._id, data.data).then((update) => {
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
  compartirPrivado,
  validateTokenLostPassword,
  changePassword,
};
