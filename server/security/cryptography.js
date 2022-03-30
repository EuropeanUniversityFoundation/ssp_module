
const NodeRSA = require('node-rsa');

module.exports = {

    encrypt(value) {
        var buffer = Buffer.from(value);

        const key = new NodeRSA();
        key.importKey(process.env.PUBLIC_KEY, 'pkcs8-public-pem');

        const encrypted = key.encrypt(buffer, 'base64');

        return encrypted.toString("base64");
    },

    decrypt(value) {
        const buffer = Buffer.from(value, 'base64')

        const key = new NodeRSA();
        key.importKey(process.env.PRIVATE_KEY, 'pkcs8-pem');

        const decryptedString = key.decrypt(buffer, 'utf8');

        return decryptedString.toString('utf8')
    }

}