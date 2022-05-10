var mongodb = require('mongodb');

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
            await InstitutionsAndProvidersPersistence.GetInstitution({ name: body.name }, async function (inst) {

                console.log(inst);
                if (inst != null) {
                    console.log("Found Stored Institution", inst.name);

                    var response = new ResponseDTO(http.StatusOK, true, "", "");
                    response.data = inst;
                    return callback(response);

                } else {

                    //  cert_pass = Cryptography.encrypt(cert_pass);

                    var inst = new InstitutionsDTO(body.name, "institution");

                    await InstitutionsAndProvidersPersistence.InsertInstitution(inst.toJSON(), async function (res) {

                        await InstitutionsAndProvidersPersistence.GetInstitution({ _id: mongodb.ObjectId(res.insertedId) }, async function (inst) {

                            console.log(inst);

                            if (inst != null) {
                                console.log("Found Stored Institution", inst.name);

                                var response = new ResponseDTO(http.StatusOK, true, "", "");
                                response.data = inst;
                                return callback(response);

                            }else{
                                var response = new ResponseDTO(http.StatusOK, true, "", "");
                                response.data = inst;
                                return callback(response);
                            }
                        });
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

    async getServicesOfInstitution(instName, serviceName, callback) {

        try {
            await InstitutionsAndProvidersPersistence.GetInstitution({ name: instName }, async function (inst) {

                if (inst != null) {
                    console.log("Found Stored Institution", inst._id);

                    await InstitutionOwnServicePersistence.GetService(inst._id, serviceName, async function (res) {

                        processServices(serviceName, res, function (map) {
                            var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was fetched");

                            var ssp_response = { ssp_response: [] }
                            map.forEach((value, key) => {
                                var elem = { provider: key, services: value }
                                ssp_response.ssp_response.push(elem)
                            })

                            console.log(JSON.stringify(ssp_response));

                            response.data = ssp_response;
                            return callback(response);
                        })

                    })
                } else {
                    var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Institution does not have services");
                    var ssp_response = { ssp_response: [] }

                    response.data = ssp_response;
                    return callback(response);
                }
            })

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to insert Provider", "An error has occurred. Please login again."));

        }
    },

    async serviceDelete(id, callback) {
        try {
            await InstitutionOwnServicePersistence.DeleteService(id)
        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, true, "Failed to Delete Service", "An error has occurred. Please try again or, if the problem persists, please contact the developers."));
        }
        return callback(new ResponseDTO(http.StatusOK, true, "", "Operation was successful"));
    },

    async addServiceType(type, callback) {

        try {
            await ServiceTypePersistence.GetService({ name: type }, async function (inst) {

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
    },

    async getServiceTypes(callback) {

        try {
            await ServiceTypePersistence.GetServices(async function (services) {
                console.log(services);

                let listOfServices = [];

                for (const service of services) {
                    console.log(service);
                    listOfServices.push(service.name)
                }

                var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was fetched");
                response.data = listOfServices;
                return callback(response);
            });

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Service does not exist", ""));
        }
    },

    async serviceDelete(id, callback) {
        try {
            await InstitutionOwnServicePersistence.DeleteService(id)
        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, true, "Failed to Delete Service", "An error has occurred. Please try again or, if the problem persists, please contact the developers."));
        }
        return callback(new ResponseDTO(http.StatusOK, true, "", "Operation was successful"));
    },

}

async function processServices(serviceName, services, callback) {
    let map = new Map();

    // array = Array.from(map, ([name, value]) => ({ name, value }));

    for (const currentS of services) {
        var fetched_service_name = "";
        if (serviceName != "") {
            fetched_service_name = serviceName;
        } else {

            await ServiceTypePersistence.GetServiceNoCallback({ _id: currentS.service_id })
                .then(async (serviceN) => {
                    fetched_service_name = serviceN.name;
                    var service = {};
                    service["id"] = currentS._id;
                    service["type"] = fetched_service_name;
                    service["data"] = currentS.data;

                    await InstitutionsAndProvidersPersistence.GetInstitutionNoCallback({ _id: currentS.provider_id })
                        .then(async (provider) => {
                            if (map.get(provider.name) == undefined) {
                                map.set(provider.name, new Array())
                            }
                            var list = map.get(provider.name);
                            list.push(service);
                            console.log('adding to map');
                            map.set(provider.name, list)
                        })
                })
        }
    }
    return callback(map);
}