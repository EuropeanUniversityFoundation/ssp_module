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

const Utils = require("../utils/utils")

module.exports = {

    async generateProviderCodeForRegistrationLink(body, callback) {

        var provider_email = body.provider_email;
        var requester_email = body.requester_email;

        var newCode = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 12; i++) {
            newCode += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        try {

            const pair = new SSPRegistrationCodeDTO(newCode, provider_email, requester_email).toJSON();

            await SSPRegistrationCodePersistence.InsertCodePair(pair);
            var response = new ResponseDTO(http.StatusOK, false, "", "");
            response.data = pair;
            return callback(response);

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to Insert Code", "An error has occurred. Please retry."));

        }
    },


    async validateRegistration(newCode, email, callback) {

        try {
            await SSPRegistrationCodePersistence.GetCodeAndEmails(newCode, function (doc) {
                if (doc == null) {
                    return callback(new ResponseDTO(http.StatusNotFound, false, "Failed to Find an entry", "This page does not exist."));
                }

                // Check if code has expired
                var diff = Math.abs(new Date().getDate() - doc.expirationDate);
                if (diff <= 0) {
                    return callback(new ResponseDTO(http.StatusUnauthorized, false, "Expired Code", "This page is no longer available. Please register again."));
                }

                console.log(doc.provider_email);
                console.log(doc);
                if (doc.provider_email != email || email == ""){
                    return callback(new ResponseDTO(http.StatusNotFound, false, "Failed to Find an entry", "This page does not exist."));
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
        await SSPRegistrationCodePersistence.DeleteCode(dto);
    },

    async addProvider(body, callback) {

        try {
            await SSPProviderPersistence.GetProvider(body.domain, async function (provider) {
                // if (provider != null) {
                //     console.log("Found Stored Provider", provider.name);

                //     if (provider.domain === body.domain) {
                //         return callback(new ResponseDTO(http.StatusBadRequest, false, "Duplicate Name", "This Provider already exists."));
                //     }
                // } else {

                //  cert_pass = Cryptography.encrypt(cert_pass);

                // Get Session from DB institutions_sessions
                await SSPProviderPersistence.InsertSSP(body, async function (result) {
                    var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Provider was created");
                    response.data = body;
                    return callback(response);
                });

                // }

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

    async generateCertificate(provider, callback) {

        var newCode = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 12; i++) {
            newCode += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }

        console.log(provider);
        var cert_pass = "";

        const { exec } = require('child_process');
        console.log("cd services/certificates && sh ./generate_certificate.sh '" + provider.name.replace(/ /g, "-") + "' '" + process.env.PROVIDER_KEY_PASS + "' '" + provider.country + "' '" + provider.city.replace(/ /g, "-") + "' 0 '" + newCode + "' '" + process.env.CAPASS + "'");
        exec("cd services/certificates && sh ./generate_certificate.sh '" + provider.name.replace(/ /g, "-") + "' '" + process.env.PROVIDER_KEY_PASS + "' '" + provider.country + "' '" + provider.city.replace(/ /g, "-") + "' 0 '" + newCode + "' '" + process.env.CAPASS + "'", (err, stdout, stderr) => {

            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);

            Utils.readFile(__dirname + '/certificates/' + provider.name.replace(/ /g, "-") + '_' + newCode + '.crt', function (err, b64string) {
                if (b64string == "") {
                    return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to Generate Certificates", ""));
                }
            });

            return callback(new ResponseDTO(http.StatusOK, false, newCode, ""));

        });

    },

    async calculateCertHash(name, newCode, callback) {

        console.log(__dirname + '/certificates/' + name.replace(" ", "-") + '_' + newCode + '.crt');
        Utils.readFile(__dirname + '/certificates/' + name.replace(" ", "-") + '_' + newCode + '.crt', function (err, b64string) {
            var remadePublicKey = b64string.substring(b64string.indexOf("\n") + 1)
            var remadePublicKey2 = remadePublicKey.replace("-----END CERTIFICATE-----", "")

            Utils.calculateHash(remadePublicKey2, async function (hash) {
                return callback(hash);
            })
        });

    }


}