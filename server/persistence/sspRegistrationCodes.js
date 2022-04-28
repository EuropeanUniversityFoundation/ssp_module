var MongoClient = require('mongodb').MongoClient;
var DatabaseVariables = require("../model/constants/database")



module.exports = {

    async InsertCodePair(emailCodePair) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_SSP_CODES).insertOne(emailCodePair, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    },

    async GetCodeAndEmails(code, callback) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            var query = { _id: code }

            dbo.collection(DatabaseVariables.TABLE_SSP_CODES).findOne(query, function (err, res) {
                if (err) throw err;
                console.log("1 document fetched");
                db.close();
                return callback(res);
            });
        });
    },

    async DeleteCode(dto) {
        MongoClient.connect(DatabaseVariables.DBURL, function (err, db) {
            if (err) throw err;

            var dbo = db.db(DatabaseVariables.DBNAME);

            dbo.collection(DatabaseVariables.TABLE_SSP_CODES).deleteOne(dto, function (err, res) {
                if (err) throw err;
                console.log("1 document deleted");
                db.close();
            });
        });
    }



}