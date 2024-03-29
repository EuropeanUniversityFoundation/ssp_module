const http = require("../model/constants/http")

const RequestVerification = require("../security/requestVerification")

const SSPService = require("../services/sspRegistrationService")
const EmailService = require("../services/emailRegistrationService")

module.exports = function (app) {

    // app.get("/csrftoken", function (req, res, _) {
    //     var token = req.csrfToken();
    //     console.log(token);
    //     res.locals.csrfToken = token;
    //     res.send({ csrfToken: req.csrfToken() })
    // })

    app.post("/ssp", RequestVerification.verifyAuthentication, function (req, res, _) {

        SSPService.generateCertificate(req.body, function (code) {

            if (code.statusCode == http.StatusOK) {
                SSPService.calculateCertHash(req.body.name, code.devMessage, function (hash) {

                    req.body.hash = hash;
                    SSPService.addProvider(req.body, function (addedProvider) {

                        console.log(addedProvider);
                        if (addedProvider.statusCode == http.StatusOK) {
                            SSPService.validateRegistration(req.body.code, req.body.email, function (validCode) {

                                if (validCode.statusCode == http.StatusOK) {

                                    console.log(code);
                                    EmailService.sendProviderCertificateEmail(code.devMessage, addedProvider.data.email, () => {
                                        EmailService.notifyRequesterEmail(validCode.data.requester_email, req.body.name, () => {

                                            SSPService.deleteRegistrationCode({ _id: req.body.code });
                                            return res.json(addedProvider.toJSON());

                                        });
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
            } else {
                return res.json(code.toJSON());
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
        SSPService.validateRegistration(req.query.code, req.query.email, function (resp) {
            res.send(resp)
        });
    });
}
