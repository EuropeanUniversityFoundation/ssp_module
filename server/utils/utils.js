const fs = require("fs")
const crypto = require("crypto")

module.exports = {
    async readFile(path, callback) {
        console.log(path);
        fs.readFile(path, { encoding: 'utf-8' }, function (err, f) {
            if (err) {
                callback(err);
                throw err;

            }
            else {

                callback(null, f);
            }
        });
    },

    async calculateHash(b64string, callback){
        var buf = Buffer.from(b64string, 'base64')
        var arrByte = Uint8Array.from(buf)
        const hash = crypto.createHash('sha256').update(arrByte).digest('hex');
        callback(hash)
    }
}