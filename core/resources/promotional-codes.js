const database = require("../../services/mongodb.js");
const db = database.getDb();
const collectionName = "promotional-codes";
//
//
//
//
//
//
//
//
let create = (data) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).insertOne(
      {
        title: data.title,
        unit_price: data.unit_price,
        code: data.code,
        registers: [],
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
let getAll = () => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .find({})
      .limit(10000)
      .toArray(function (err, result) {
        if (err) {
          resolve(reject);
        } else {
          resolve(result);
        }
      });
  });
};
let search = (target) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .find({
        $text: {
          $search: target,
        },
      })
      .sort({ score: { $meta: "textScore" } })
      .toArray(function (err, result) {
        if (err) {
          resolve(err);
        } else {
          resolve(result);
        }
      });
  });
};
let searchRegex = (target) => {
  console.log("search regex", target);
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .find({
        "data.title": {
          $regex: target,
        },
      })
      .toArray(function (err, result) {
        if (err) {
          resolve(err);
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
          resolve(doc);
        }
      });
  });
};
let update = (id, data) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).updateOne(
      {
        _id: database.ObjectID(id),
      },
      {
        $set: {
          title: data.title,
          unit_price: data.unit_price,
          code: data.code,
          registers: data.registers,
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

let getAllByCode = (code) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .find({
        code: code,
      })
      .limit(10000)
      .toArray(function (err, result) {
        console.log('getAll codes' , result , err)

        if (err) {
            reject([]);
        } else {
          if(result.length == 0) {
            reject([]);
          }
          resolve(result[0]);
        }
      });
  });
};

let addUserRegister = (code, userData) => {
  return new Promise((resolve, reject) => {
    getAllByCode(code)
      .then((codeData) => {
        codeData.registers.push({
          id: userData.id,
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
          phone: userData.phone,
          code_promotional: userData.code_promotional,
        });
        update(codeData._id, codeData).then((updateData) => {
            resolve(updateData);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  create,
  getAll,
  search,
  searchRegex,
  getById,
  update,
  deleteById,
  addUserRegister,
  getAllByCode
};
