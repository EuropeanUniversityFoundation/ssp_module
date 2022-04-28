const http = require("../model/constants/http")
const crypto = require("crypto")

const RequestVerification = require("../security/requestVerification")

const SSPService = require("../services/sspRegistrationService")
const EmailService = require("../services/emailRegistrationService")

module.exports = function (app) {

    app.post("/ssp", RequestVerification.verifyAuthentication, function (req, res, _) {

        SSPService.addProvider(req.body, function (addedProvider) {

            if (addedProvider.statusCode == http.StatusOK) {
                SSPService.validateRegistration(req.body.code, function (validCode) {

                    if (validCode.statusCode == http.StatusOK) {

                        SSPService.deleteRegistrationCode({ _id: req.body.code })

                        SSPService.generateCertificate(addedProvider.data, function (code) {

                            SSPService.calculateCertHashAndUpdate(addedProvider.data.name, addedProvider.data.domain, code, function (response) {
                                if (response.matchedCount == 1) {
                                    EmailService.sendProviderCertificateEmail(code, addedProvider.data.email, () => {
                                        EmailService.notifyRequesterEmail(code, validCode.requester_email, () => {
                                            return res.json(addedProvider.toJSON());
                                        });
                                    });
                                }
                            })
                        });
                    } else {
                        return res.json(validCode.toJSON());
                    }
                });
            } else {
                return res.json(addedProvider.toJSON());
            }

        });
    });

    app.get("/ssp", RequestVerification.verifyAuthentication, function (req, res, _) {
        SSPService.getProviderList(function (resp) {
            res.json(resp.toJSON());
        });
    });

    // Create code to send registration link to email
    app.post("/ssp/register", RequestVerification.verifyAuthentication, function (req, res) {
        console.log(req.body.provider_email);
        console.log(req.body.requester_email);

        SSPService.generateProviderCodeForRegistrationLink(req.body, function (resp) {
            if (resp.statusCode == http.StatusOK) {
                EmailService.sendRegistrationEmail(resp.data, () => {
                    res.send(resp.toJSON())
                });
            } else {
                res.send(resp.toJSON())
            }
        });
    });


    // Validates if the Registration link is valid
    app.get("/ssp/register", RequestVerification.verifyAuthentication, function (req, res) {
        SSPService.validateRegistration(req.query.code, function (resp) {
            res.send(resp)
        });
    });
}
