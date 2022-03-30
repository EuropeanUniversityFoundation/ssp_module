const http = require("../model/constants/http")

const RequestVerification = require("../security/requestVerification")

const SSPService = require("../services/sspService")

module.exports = function (app) {

  /*   app.post("/ssp", RequestVerification.verifyAuthentication, function (req, res, _) {

        console.log(req.body.schac_code);
        ProviderService.addProvider(req.body, function (resp) {
            if (resp.statusCode == http.StatusOK) {

                ProviderService.deleteRegistrationCode({ code: req.body.code, email: req.body.email })

                ProviderService.sendWaitEmail(req.body.email);
            }

            return res.json(resp.toJSON())

        });
    });

    app.get("/ssp", RequestVerification.verifyAuthentication, function (req, res, _) {
        ProviderService.getProviderList(function (resp) {
            res.json(resp.toJSON());
        });
    }); */

    // Create code to send registration link to email
    app.post("/ssp/register", RequestVerification.verifyAuthentication, function (req, res) {
        SSPService.generateProviderCodeForRegistrationLink(req.body.email, function (resp) {
            if (resp.statusCode == http.StatusOK) {
                SSPService.sendRegistrationEmail(resp.data, () => {
                    res.send(resp.toJSON())
                });
            } else {
                res.send(resp.toJSON())
            }
        });
    });


/*     // Validates if the Registration link is valid
    app.get("/ssp/register", RequestVerification.verifyAuthentication, function (req, res) {
        ProviderService.validateRegistration(req.query.code, function (resp) {
            res.send(resp.toJSON())
        });
    }); */
}
