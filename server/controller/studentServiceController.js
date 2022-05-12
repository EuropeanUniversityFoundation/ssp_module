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

        console.log(result);
        StudentServiceService.getInstitution(result, function (institution) {
            console.log(institution.data);

            StudentServiceService.getServiceType({ name: result.type }, function (service) {
                console.log(service.data);

                if (result.data == undefined) {
                    StudentServiceService.addExternalService(institution.data._id, service.data._id, result.ssp, result.data_id, function (response) {

                        StudentServiceService.getServicesOfInstitution(institution.data.name, "", function (resp) {
                            response.data = resp.data;
                            res.json(response.toJSON());
                        })

                    })
                } else {
                    StudentServiceService.addService(institution.data._id, service.data._id, result.data, function (response) {

                        StudentServiceService.getServicesOfInstitution(institution.data.name, "", function (resp) {
                            response.data = resp.data;
                            res.json(response.toJSON());
                        })

                    })
                }

            })
        })


    });


    app.get("/service", RequestVerification.verifyAuthentication, function (req, res, _) {

        StudentServiceService.getServicesOfInstitution(req.query.institution, req.query.service, function (resp) {
            res.json(resp.toJSON());
        })

    });

    app.delete("/service", RequestVerification.verifyAuthentication, function (req, res, _) {

        StudentServiceService.serviceDelete(req.query.id, function (resp) {
            StudentServiceService.getServicesOfInstitution(institution.data.name, "", function (resp) {
                response.data = resp.data;
                res.json(response.toJSON());
            })

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
