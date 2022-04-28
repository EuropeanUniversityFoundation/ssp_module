var MongoClient = require('mongodb').MongoClient;
var DatabaseVariables = require("../model/constants/database")

module.exports = {

    async InsertSSP(data, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_SSP_PROVIDERS).insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
                return callback(res);
            });
        });
    },

    async UpdateSSP(domain, newVal, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            var query = { domain: domain };
            var newvalues = { $set: newVal };

            dbo.collection(DatabaseVariables.TABLE_SSP_PROVIDERS).updateOne(query, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document update");
                db.close();
                return callback(res);
            });
        });
    },

    async GetProvider(domain, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            var query = { domain: domain }

            dbo.collection(DatabaseVariables.TABLE_SSP_PROVIDERS).findOne(query, function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },

    async GetProviders(callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_SSP_PROVIDERS).find({}).toArray(function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    }


}