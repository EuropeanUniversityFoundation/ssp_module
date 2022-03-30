var postmark = require("postmark");
var fs = require("fs");

const ResponseDTO = require("../dto/response")
const SSPRegistrationCodeDTO = require("../dto/sspRegistrationCodeDTO")

const http = require("../model/constants/http")

const SSPRegistrationCodePersistence = require("../persistence/sspRegistrationCodes")

module.exports = {

    async generateProviderCodeForRegistrationLink(email, callback) {

        var newCode = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 12; i++) {
            newCode += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        try {

            const pair = new SSPRegistrationCodeDTO(newCode, email).toJSON();

            await SSPRegistrationCodePersistence.InsertCodePair(pair);
            var response = new ResponseDTO(http.StatusOK, false, "", "");
            response.data = JSON.stringify(pair);
            return callback(response);

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to Insert Code", "An error has occurred. Please retry."));

        }
    },

    async sendRegistrationEmail(data, callback) {

        // var dec = JSON.parse(Cryptography.decrypt(data))
        var dec = JSON.parse(data)

        console.log(dec);

        var newCode = dec._id;
        var email = dec.email;

        // Send an email:
        var client = new postmark.ServerClient("051ab111-0347-48b8-9085-bb522588c596");

        client.sendEmailWithTemplate({
            TemplateAlias: "registration",
            TemplateId: 27495738,
            TemplateModel: {
                newCode,
            },
            "From": "dashboard@uni-foundation.eu",
            "To": email,
        });

        return callback(true);
    },


}