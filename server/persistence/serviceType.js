var MongoClient = require('mongodb').MongoClient;
var DatabaseVariables = require("../model/constants/database")

module.exports = {

    async InsertService(data, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_SERVICE_TYPE).insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
                return callback(res);
            });
        });
    },

    async GetService(name, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            var query = { name: name }

            dbo.collection(DatabaseVariables.TABLE_SERVICE_TYPE).findOne(query, function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },

}