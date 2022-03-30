const Cryptography = require("../security/cryptography")

module.exports = class ResponseDTO {

    constructor(status, auth, devMessage, message) {
        this._status = status
        this._auth = auth
        this._data = null
        // this._devMessage = Cryptography.encrypt(devMessage)
        // this._userMessage = Cryptography.encrypt(message)
        this._devMessage = devMessage
        this._userMessage = message
    }

    get statusCode() {
        return this._status
    }

    get auth() {
        return this._auth;
    }

    get data() {
        return this._data;
    }

    set data(d) {
        // this._data = Cryptography.encrypt(d);
        this._data = d;
    }


    get devMessage() {
        return this._devMessage
    }

    get userMessage() {
        return this._userMessage
    }

    set userMessage(msg) {
        this._userMessage = msg
    }

    toJSON() {
        // if (this.data != null) {
        //     console.log(Cryptography.decrypt(JSON.stringify(this.data, null, 3)));

        // }
        // console.log(Cryptography.decrypt(this.devMessage));
        // console.log(Cryptography.decrypt(this.userMessage));
        return {
            statusCode: this._status,
            auth: this._auth,
            data: this._data,
            devMessage: this._devMessage,
            userMessage: this._userMessage
        }
    }
}