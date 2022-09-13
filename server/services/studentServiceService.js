var fs = require("fs");
var mongodb = require('mongodb');
const xmlparser = require('xml2js');

const ResponseDTO = require("../dto/response")
const InstitutionsDTO = require("../dto/institutionsDTO")
const InstitutionOwnService = require("../dto/institutionOwnService")

const http = require("../model/constants/http")

const InstitutionsAndProvidersPersistence = require("../persistence/institutionsAndProviders")
const ServiceTypePersistence = require("../persistence/serviceType")
const InstitutionOwnServicePersistence = require("../persistence/institutionOwnService")

const URLConstants = require("../model/constants/urls")

const RequestFactory = require("../outrequest/requestFactory");
const { count } = require("console");

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

                            } else {
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

    async addExternalService(provid, servid, ssp, dataId, callback) {

        try {

            await InstitutionsAndProvidersPersistence.GetInstitution({ name: ssp }, async function (inst) {

                var service = new InstitutionOwnService(provid, servid, "");
                service.ssp = inst._id;
                service.ssp_data_id = dataId,

                    await InstitutionOwnServicePersistence.InsertService(service.toJSONSSP(), async function (res) {
                        var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was created");
                        console.log(res);
                        response.data = res;
                        return callback(response);
                    })

            })

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to insert Provider", "An error has occurred. Please login again."));

        }
    },

    // async updatePermissions(body, callback) {

    //     try {

    //         await InstitutionOwnServicePersistence.UpdatePermissions(body.id, body.permissions, async function (res) {
    //             var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was updated");
    //             console.log(res);
    //             response.data = res;
    //             return callback(response);
    //         })

    //     } catch (err) {
    //         console.log("Promise rejection error: " + err);
    //         return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to insert Provider", "An error has occurred. Please login again."));

    //     }
    // },

    async getServicesOfInstitution(instName, serviceName, callback) {

        try {
            await InstitutionsAndProvidersPersistence.GetInstitution({ name: instName }, async function (inst) {

                if (inst != null) {
                    console.log("Found Stored Institution", inst._id);

                    var serv_id = "";

                    console.log(serviceName);
                    if (serviceName != "" && serviceName != undefined) {
                        console.log('FETCH');
                        await ServiceTypePersistence.GetService({ name: serviceName }, async service => {
                            serv_id = service._id
                            await InstitutionOwnServicePersistence.GetService(inst._id, serv_id, async function (res) {

                                if (serviceName == undefined) {
                                    serviceName = "";
                                }
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
                        });
                    } else {
                        await InstitutionOwnServicePersistence.GetService(inst._id, serv_id, async function (res) {

                            if (serviceName == undefined) {
                                serviceName = "";
                            }
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
                    }


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

    async getClients(provider, callback) {
        try {
            await InstitutionsAndProvidersPersistence.GetInstitution({ name: provider }, async function (inst) {

                if (inst != null) {
                    console.log("Found Stored Institution", inst._id);

                    await InstitutionOwnServicePersistence.GetClientOfSSP(inst._id, async function (res) {

                        console.log('here');
                        console.log(res);

                        processArrayOfClientInstitutions(res, function (list) {
                            var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was fetched");

                            response.data = list;
                            return callback(response);
                        })

                    })

                } else {
                    var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Institution does not have services");

                    response.data = [];
                    return callback(response);
                }
            })

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to insert Provider", "An error has occurred. Please login again."));

        }
    },

    async getInstitutionsByCountry(country, callback) {
        try {

            let institutionList = []
            let institutionDBList = []

            await RequestFactory.buildRequest(URLConstants.HEIAPIHostname, "", URLConstants.HEIAPIPath + "/" + country + "/hei", "", "GET", async function (resp) {

                await InstitutionsAndProvidersPersistence.GetInstitution({ type: "institution" }, async function (dbInsts) {
                    console.log(dbInsts);
                    dbInsts.forEach((inst) => {
                        institutionDBList.push(inst.name)
                    })
                    console.log(institutionDBList);

                    let institutionJSON = JSON.parse(resp.data);
                    institutionJSON.data.forEach((inst) => {
                        // institutionList.push(country.attributes.label)
                    })
                    var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Countries were fetched");
                    response.data = institutionList;
                    return callback(response);
                })
            })

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to get countries.", ""));

        }
    },

    async getCountries(callback) {
        try {

            let countryList = []

            await RequestFactory.buildRequest(URLConstants.HEIAPIHostname, "", URLConstants.HEIAPIPath, "", "GET", async function (resp) {
                let countryJSON = JSON.parse(resp.data);
                countryJSON.data.forEach((country) => {
                    countryList.push({ name: country.attributes.label, id: country.id })
                })
                var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Countries were fetched");
                response.data = countryList;
                return callback(response);
            })

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to get countries.", ""));

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


    async downloadCertificate(id, format, callback) {

        var folder = "./services/certificates"
        var fileNameToDownload = "";

        fs.readdir(folder, (err, files) => {
            files.forEach(file => {
                var fileIDAndFormatA = file.split("__");
                var fileIDAndFormat;

                if (fileIDAndFormatA.length > 1) {
                    fileIDAndFormat = fileIDAndFormatA[1]

                    var ff = fileIDAndFormat.split(".");

                    var fileID = ff[0];
                    var fileFormat = ff[1];


                    if (fileID === id && format === fileFormat) {
                        fileToDownload = folder + "/" + file;
                        fileNameToDownload = fileIDAndFormatA[0] + "." + format;
                        console.log(fileNameToDownload);

                        return callback({ fileToDownload: fileToDownload, fileNameToDownload: fileNameToDownload });
                    }

                }

            });
        });
    },

}


async function processServices(serviceName, services, callback) {
    let map = new Map();

    // array = Array.from(map, ([name, value]) => ({ name, value }));

    for (const currentS of services) {
        var fetched_service_name = "";
        if (serviceName != "") {
            fetched_service_name = serviceName;
            var service = {};

            if (currentS.ssp != undefined & currentS.ssp != "") {
                var ssp = currentS.ssp;

                console.log(ssp);
                await InstitutionsAndProvidersPersistence.GetInstitutionNoCallback({ _id: ssp })
                    .then(async (provider) => {
                        console.log('p1');
                        console.log(currentS);
                        await InstitutionOwnServicePersistence.GetServiceOfSSP(currentS.data_id)
                            .then(async (res) => {
                                service["id"] = currentS._id;
                                service["permissions"] = res[0].permissions;
                                service["type"] = fetched_service_name;
                                service["data"] = res[0].data;
                                service["data_id"] = currentS.data_id;
                                if (map.get(provider.name) == undefined) {
                                    map.set(provider.name, new Array())
                                }
                                var list = map.get(provider.name);
                                list.push(service);
                                console.log('adding to map');
                                map.set(provider.name, list)
                            })
                    })
            } else {
                service["id"] = currentS._id;
                service["permissions"] = currentS.permissions;
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
            }

        } else {

            await ServiceTypePersistence.GetServiceNoCallback({ _id: currentS.service_id })
                .then(async (serviceN) => {
                    fetched_service_name = serviceN.name;
                    var service = {};
                    if (currentS.ssp != undefined & currentS.ssp != "") {
                        var ssp = currentS.ssp;

                        console.log(ssp);
                        await InstitutionsAndProvidersPersistence.GetInstitutionNoCallback({ _id: ssp })
                            .then(async (provider) => {
                                console.log('p1');
                                console.log(currentS);
                                await InstitutionOwnServicePersistence.GetServiceOfSSP(currentS.data_id)
                                    .then(async (res) => {
                                        service["id"] = currentS._id;
                                        service["permissions"] = res[0].permissions;
                                        service["type"] = fetched_service_name;
                                        service["data"] = res[0].data;
                                        service["data_id"] = currentS.data_id;
                                        if (map.get(provider.name) == undefined) {
                                            map.set(provider.name, new Array())
                                        }
                                        var list = map.get(provider.name);
                                        list.push(service);
                                        console.log('adding to map');
                                        map.set(provider.name, list)
                                    })
                            })
                    } else {
                        service["id"] = currentS._id;
                        service["permissions"] = currentS.permissions;
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
                    }
                })

        }
    }
    return callback(map);
}

async function processArrayOfClientInstitutions(services, callback) {
    let list = []

    // array = Array.from(map, ([name, value]) => ({ name, value }));

    for (const currentS of services) {
        var fetched_service_name = "";

        await ServiceTypePersistence.GetServiceNoCallback({ _id: currentS.service_id })
            .then(async (serviceN) => {
                fetched_service_name = serviceN.name;
                var service = {};

                await InstitutionsAndProvidersPersistence.GetInstitutionNoCallback({ _id: mongodb.ObjectId(currentS.provider_id) })
                    .then(async (provider) => {
                        console.log(currentS);
                        await InstitutionOwnServicePersistence.GetServiceOfSSP(currentS.data_id)
                            .then(async (res) => {
                                service["service"] = fetched_service_name;
                                if (res[0]) {
                                    service["name"] = res[0].data["service-name"]
                                }

                                service["institution"] = provider.name;

                                list.push(service);
                            })
                    })
            })


    }
    return callback(list);
}