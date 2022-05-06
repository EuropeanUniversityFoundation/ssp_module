const ResponseDTO = require("../dto/response")
const InstitutionsDTO = require("../dto/institutionsDTO")
const InstitutionOwnService = require("../dto/institutionOwnService")

const http = require("../model/constants/http")

const InstitutionsAndProvidersPersistence = require("../persistence/institutionsAndProviders")
const ServiceTypePersistence = require("../persistence/serviceType")
const InstitutionOwnServicePersistence = require("../persistence/institutionOwnService")

module.exports = {

    async getInstitution(body, callback) {

        try {
            await InstitutionsAndProvidersPersistence.GetInstitution(body.service.name[0], async function (inst) {

                console.log(inst);
                if (inst != null) {
                    console.log("Found Stored Institution", inst.name);

                    var response = new ResponseDTO(http.StatusOK, true, "", "");
                    response.data = inst;
                    return callback(response);

                } else {

                    //  cert_pass = Cryptography.encrypt(cert_pass);

                    var inst = new InstitutionsDTO(body.service.name[0], "institution");

                    await InstitutionsAndProvidersPersistence.InsertInstitution(inst.toJSON(), async function (res) {
                        var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Provider was created");
                        console.log(res);
                        response.data = res;
                        return callback(response);
                    })


                }

            });

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to insert Provider", "An error has occurred. Please login again."));

        }
    },

    async addService(provid, servid, data, callback) {

        try {

            var service = new InstitutionOwnService(provid, servid, data);

            await InstitutionOwnServicePersistence.InsertService(service.toJSON(), async function (res) {
                var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was created");
                console.log(res);
                response.data = res;
                return callback(response);
            })

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to insert Provider", "An error has occurred. Please login again."));

        }
    },

    async addServiceType(type, callback) {

        try {
            await ServiceTypePersistence.GetService(type, async function (inst) {

                console.log(inst);
                if (inst != null) {
                    console.log("Found Stored Service", inst.name);

                    var response = new ResponseDTO(http.StatusOK, true, "", "");
                    response.data = inst;
                    return callback(response);

                } else {

                    await ServiceTypePersistence.InsertService({ name: type }, async function (res) {
                        var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was created");
                        console.log(res);
                        response.data = res;
                        return callback(response);
                    })


                }

            });

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to insert Provider", "An error has occurred. Please login again."));

        }
    },

    async getServiceType(type, callback) {

        try {
            await ServiceTypePersistence.GetService(type, async function (service) {
                var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was fetched");
                response.data = service;
                return callback(response);
            });

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Service does not exist", ""));

        }

    }

}