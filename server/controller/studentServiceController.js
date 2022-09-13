var bodyParser = require('body-parser');
const xml2js = require("xml2js")
const path = require("path");
const mime = require("mime");
var fs = require("fs");

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

        console.log(JSON.stringify(result));
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
            // StudentServiceService.getServicesOfInstitution(institution.data.name, "", function (resp) {
            //     response.data = resp.data;
            //     res.json(response.toJSON());
            // })

            res.json(resp.toJSON());
        })

    });

    // app.patch("/service", RequestVerification.verifyAuthentication, function (req, res, _) {

    //     StudentServiceService.updatePermissions(req.body, function (resp) {
    //         res.json(resp.toJSON());
    //     })

    // });


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

    app.get("/clients", RequestVerification.verifyAuthentication, function (req, res, _) {

        StudentServiceService.getClients(req.query.provider, function (resp) {
            res.json(resp.toJSON());
        })

    });

    // Get Country List of institutions in Dashboard
    app.get("/countries", RequestVerification.verifyAuthentication, function (req, res, _) {
        StudentServiceService.getCountries(function (resp) {
            res.json(resp.toJSON());
        })

    });

    // Get institutions of a Country present in the module
    app.get("/institutions/:country", RequestVerification.verifyAuthentication, function (req, res, _) {
        StudentServiceService.getInstitutionsByCountry(req.params['country'], function (resp) {
            res.json(resp.toJSON());
        })

    });

    // Validates if the Registration link is valid
    app.get("/certificate", function (req, res) {
        console.log('certificate');
        StudentServiceService.downloadCertificate(req.query.fileID, req.query.format, function (resp) {
            console.log('here');
            var filename = path.basename(resp.fileNameToDownload);
            var mimetype = mime.lookup(resp.fileToDownload);

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(resp.fileToDownload);
            filestream.pipe(res);

            // fs.unlinkSync(resp.fileToDownload);
        });
    });
}
