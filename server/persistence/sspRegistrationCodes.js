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
    }


}