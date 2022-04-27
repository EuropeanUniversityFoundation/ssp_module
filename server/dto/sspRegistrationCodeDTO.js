
module.exports = class SSPRegistrationCodeDTO {

    constructor(code, provider_email, requester_email) {
        this._code = code
        this._provider_email = provider_email;
        this._requester_email = requester_email;

        var date = new Date();
        date.setDate(date.getDate() + 7);
        this._expirationDate = date.toISOString()
    }

    get code() {
        return this._code
    }

    get provider_email() {
        return this._provider_email
    }

    get requester_email() {
        return this._requester_email
    }

    get expDate(){
        return this._expirationDate
    }


    toJSON() {
        return {
            _id: this._code,
            provider_email: this._provider_email,
            requester_email: this._requester_email,
            expirationDate: this._expirationDate    
        }
    }
}