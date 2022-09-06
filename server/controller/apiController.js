var bodyParser = require('body-parser');

const RequestVerification = require("../security/requestVerification")

const ApiService = require("../services/apiService")

module.exports = function (app) {
    var options = {
        inflate: true,
        limit: '100kb',
        type: 'application/xml'
    };

    app.use(bodyParser.raw(options));

    app.get("/service/index", RequestVerification.verifyAuthentication, function (req, res, _) {

        ApiService.getServicesOfInstitutionIndex(req.query.owner, function (resp) {
            res.json(resp.toJSON());
        })

    });

    app.get("/service/get", RequestVerification.verifyAuthentication, function (req, res, _) {

        ApiService.getServicesOfInstitutionGet(req.query.owner, req.query.id, function (resp) {
            res.json(resp.toJSON());
        })

    });

    app.get("/service/owners", RequestVerification.verifyAuthentication, function (req, res, _) {

        ApiService.getOwners(function (resp) {
            res.json(resp.toJSON());
        })

    });

}

