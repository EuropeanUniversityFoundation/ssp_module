var bodyParser = require('body-parser');
const xml2js = require("xml2js")

const RequestVerification = require("../security/requestVerification")

const StudentServiceService = require("../services/studentServiceService")

module.exports = function (app) {
    var options = {
        inflate: true,
        limit: '100kb',
        type: 'application/xml'
    };

    app.use(bodyParser.raw(options));

    app.post("/service", RequestVerification.verifyAuthentication, function (req, res, _) {
        var result = req.body;

        StudentServiceService.getInstitution(result, function (institution) {
            console.log(institution.data);

            StudentServiceService.getServiceType({ name: result.service.type[0] }, function (service) {
                console.log(service.data);

                StudentServiceService.addService(institution.data._id, service.data._id, result.service.data, function (response) {
                    console.log(response.data);
                    res.json(response.toJSON());

                })
            })
        })


    });


    app.get("/service", RequestVerification.verifyAuthentication, function (req, res, _) {

        StudentServiceService.getServicesOfInstitution(req.query.institution, "", function (resp) {
            res.json(resp.toJSON());
        })

    });

    app.delete("/service", RequestVerification.verifyAuthentication, function (req, res, _) {

        StudentServiceService.serviceDelete(req.query.id, function (resp) {
            res.json(resp.toJSON());
        })

    });

    app.post("/serviceType", RequestVerification.verifyAuthentication, function (req, res, _) {

        StudentServiceService.addServiceType(req.body.name, function (resp) {
            res.json(resp.toJSON());
        })

    });

    app.get("/serviceType", RequestVerification.verifyAuthentication, function (req, res, _) {

        StudentServiceService.getServiceTypes(function (resp) {
            res.json(resp.toJSON());
        })

    });
}
