var postmark = require("postmark");
var fs = require("fs");
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const ResponseDTO = require("../dto/response")
const SSPRegistrationCodeDTO = require("../dto/sspRegistrationCodeDTO")

const http = require("../model/constants/http")

const SSPRegistrationCodePersistence = require("../persistence/sspRegistrationCodes")
const SSPProviderPersistence = require("../persistence/ssp")
const ProviderDTO = require("../dto/providerDTO")
const ProviderDTOList = require("../dto/strucutreList")

const URLConstants = require("../model/constants/urls")

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
        var dec = JSON.parse(data)

        var newCode = dec._id;
        var email = dec.email;

        var readHTMLFile = function (path, callback) {
            console.log(path);
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                    throw err;

                }
                else {
                    
                    callback(null, html);
                }
            });
        };

        var transporter = nodemailer.createTransport({
            host: 'mail.auth.gr',
            port: 25,
        });

        readHTMLFile(__dirname + '/mailHTMLs/newRegistration.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                newCode: newCode
            };
            var htmlToSend = template(replacements);

            var mailOptions = {
                from: "no-reply@auth.gr",
                to: email,
                subject: 'New Provider Registration',
                html: htmlToSend
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return callback(true);
        })


    },

    async validateRegistration(newCode, callback) {

        try {
            await SSPRegistrationCodePersistence.GetExpiration(newCode, function (doc) {
                if (doc.length == 0) {
                    return callback(new ResponseDTO(http.StatusNotFound, false, "Failed to Find an entry with that Code", "This page does not exist."));
                }

                // Check if code has expired
                var diff = Math.abs(new Date().getDate() - doc.expirationDate);
                if (diff <= 0) {
                    return callback(new ResponseDTO(http.StatusUnauthorized, false, "Expired Code", "This page is no longer available. Please register again."));
                }

                var response = new ResponseDTO(http.StatusOK, false, "", "");
                response.data = doc;
                return callback(response);

            });


        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusNotFound, false, "Failed to Find an entry with that Code", "This page does not exist."));

        }
    },

    async deleteRegistrationCode(dto) {
        console.log(dto);
        await SSPRegistrationCodePersistence.DeleteCode(dto);
    },

    async addProvider(body, callback) {

        try {
            await SSPProviderPersistence.GetProvider(body.domain, async function (provider) {
                console.log(provider);
                if (provider != null) {
                    console.log("Found Stored Provider", provider.name);

                    if (provider.domain === body.domain) {
                        return callback(new ResponseDTO(http.StatusBadRequest, false, "Duplicate Name", "This Provider already exists."));
                    }
                } else {

                    //  cert_pass = Cryptography.encrypt(cert_pass);

                    // Get Session from DB institutions_sessions
                    await SSPProviderPersistence.InsertSSP(body, async function (result) {
                        var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Provider was created");
                        response.data = result.insertedId.toString();
                        return callback(response);
                    });

                }

            });

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to insert Provider", "An error has occurred. Please login again."));

        }
    },

    async getProviderList(callback) {

        await SSPProviderPersistence.GetProviders(function (providers) {
            try {
                console.log("Found", providers.length, "providers");
                var listOfProviders = []

                console.log(providers);

                providers.forEach(provider => {
                    //    listOfProviders.push(new ProviderDTO(provider.name, provider.schac_code, provider.contact_name, provider.email, provider.country, provider.city, provider.pos, provider.cert_pass, provider.status, (URLConstants.Hostname + "/provider/" + provider.schac_code), provider.mou_file))
                    listOfProviders.push(new ProviderDTO(provider.name, provider.contactName, provider.email, provider.domain, (URLConstants.Hostname + "/provider/" + provider.domain)))
                });


                var list = new ProviderDTOList(URLConstants.Hostname + "/provider");
                listOfProviders.forEach(elem => {
                    list.data = elem;
                })

                var response = new ResponseDTO(http.StatusOK, true, "", "");
                response.data = listOfProviders;
                return callback(response);

            } catch (err) {
                console.log("Promise rejection error: " + err);
                return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to Fetch Provider List", "An error has occurred. Please login again."));

            }
        });


    },



}