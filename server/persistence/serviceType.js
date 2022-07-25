var MongoClient = require('mongodb').MongoClient;
var DatabaseVariables = require("../model/constants/database")
var mongoose = require('mongoose')

module.exports = {

    async InsertService(data, callback) {
        console.log(DatabaseVariables.DBURL);
        mongoose.Promise = global.Promise;
        mongoose.connect(DatabaseVariables.DBURL, {
            useNewUrlParser: true,
            user: DatabaseVariables.DBUSER,
            pass: DatabaseVariables.DBPASS
        }).then(() => {
            console.log('successfully connected to the database');
        }).catch(err => {
            console.log('error connecting to the database');
            process.exit();
        });

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

    async GetService(query, callback) {
        console.log(DatabaseVariables.DBURL);

        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            console.log(query);
            dbo.collection(DatabaseVariables.TABLE_SERVICE_TYPE).findOne(query, function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },

    async GetServices(callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_SERVICE_TYPE).find({}).toArray(function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },


    async GetServiceNoCallback(query) {

        return new Promise(function (resolve, reject) {
            MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
                if (err) throw err;

                var dbo = db.db(DatabaseVariables.DBNAME);

                console.log(query);
                dbo.collection(DatabaseVariables.TABLE_SERVICE_TYPE).findOne(query, function (err, res) {
                    if (err) throw err;
                    console.log("1 document fetched");
                    db.close();
                    resolve(res);
                });
            });
        })

    },

}