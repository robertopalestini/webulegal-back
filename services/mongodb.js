const {
    MongoClient,
    ObjectId
} = require("mongodb");
const config = require('../settings.js');
const connectionString = "mongodb://" + config.secure.mongodb.auth.username + ":" + config.secure.mongodb.auth.password + "@" + config.secure.mongodb.host + ":" + config.secure.mongodb.port;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let dbConnection;
module.exports = {
    connectToServer: function (callback) {
        client.connect(function (err, db) {
            if (err || !db) {
                return callback(err);
            }
            dbConnection = db.db("webu");
            console.log("Successfully connected to MongoDB.");
            return callback();
        });
    },
    getDb: function () {
        return dbConnection;
    },
    ObjectID: function (id) {
        return ObjectId(id);
    }
};