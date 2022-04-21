
module.exports = class SSPRegistrationCodeDTO {

    constructor(code, email) {
        this._code = code
        this._email = email

        var date = new Date();
        date.setDate(date.getDate() + 7);
        this._expirationDate = date.toISOString()
    }

    get code() {
        return this._code
    }

    get email() {
        return this._email
    }

    get expDate(){
        return this._expirationDate
    }


    toJSON() {
        return {
            _id: this._code,
            email: this._email,
            expirationDate: this._expirationDate    
        }
    }
}