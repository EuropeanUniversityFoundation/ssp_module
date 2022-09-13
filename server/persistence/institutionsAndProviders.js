var MongoClient = require('mongodb').MongoClient;
var DatabaseVariables = require("../model/constants/database")

module.exports = {

    async InsertInstitution(data, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_INST_AND_PROVIDERS).insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
                return callback(res);
            });
        });
    },

    async GetInstitution(query, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_INST_AND_PROVIDERS).findOne(query, function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },

    async GetInstitutions(callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_INST_AND_PROVIDERS).find({}).toArray(function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },

    async GetInstitutionsFilter(query, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_INST_AND_PROVIDERS).find(query).toArray(function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },

    async GetInstitutionNoCallback(query) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
                if (err) throw err;

                var dbo = db.db(DatabaseVariables.DBNAME);

                dbo.collection(DatabaseVariables.TABLE_INST_AND_PROVIDERS).findOne(query, function (err, res) {
                    if (err) throw err;
                    console.log("1 document fetched");
                    db.close();
                    resolve(res);
                });
            });
        })

    },

    async UpdateCountry(name, country, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);
            var query = { name: name };
            var newvalues = { $set: { country: country } };

            dbo.collection(DatabaseVariables.TABLE_INSTITUTION_OWN_INFORMATION).updateOne(query, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
                return callback(res);

            });
        });
    },


}