var mongodb = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
var DatabaseVariables = require("../model/constants/database")

module.exports = {

    async InsertService(data, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            console.log(data);
            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_INSTITUTION_OWN_INFORMATION).insertOne(data, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
                return callback(res);
            });
        });
    },

    async GetService(provider_id, service_id, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);
            var query = {};

            if (service_id == "") {
                query = { provider_id: provider_id }
            } else {
                query = { provider_id: provider_id, service_id: service_id }
            }


            dbo.collection(DatabaseVariables.TABLE_INSTITUTION_OWN_INFORMATION).find(query).toArray(function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },

    async GetServiceOfSSP(service_id) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
                if (err) throw err;

                var dbo = db.db(DatabaseVariables.DBNAME);
                var query = { _id: service_id };

                dbo.collection(DatabaseVariables.TABLE_INSTITUTION_OWN_INFORMATION).find(query).toArray(function (err, res) {
                    if (err) throw err;
                    console.log("1 document fetched");
                    db.close();
                    return resolve(res);
                });
            });
        });
    },

    async GetClientOfSSP(provider_id, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);
            var query = { ssp: new mongodb.ObjectId(provider_id) };

            dbo.collection(DatabaseVariables.TABLE_INSTITUTION_OWN_INFORMATION).find(query).toArray(function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },

    async DeleteService(id) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);
            var query = { _id: new mongodb.ObjectId(id) };

            dbo.collection(DatabaseVariables.TABLE_INSTITUTION_OWN_INFORMATION).deleteOne(query, function (err, res) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
            });
        });
    },

    async UpdatePermissions(id, permissions, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);
            var query = { _id: new mongodb.ObjectId(id) };
            var newvalues = { $set: { permissions: permissions } };

            dbo.collection(DatabaseVariables.TABLE_INSTITUTION_OWN_INFORMATION).updateOne(query, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
                return callback(res);

            });
        });
    },

}