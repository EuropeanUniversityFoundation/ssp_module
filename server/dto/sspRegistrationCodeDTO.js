
module.exports = class SSPRegistrationCodeDTO {

    constructor(code, email) {
        this._code = code
        this._email = email
    }
   
    get code() {
        return this._code
    }

    get email() {
        return this._email
    }


    toJSON() {
        return {
            _id: this._code,
            email: this._email,
        }
    }
}