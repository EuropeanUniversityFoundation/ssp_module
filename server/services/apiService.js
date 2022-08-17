var mongodb = require('mongodb');

const ResponseDTO = require("../dto/response")

const http = require("../model/constants/http")

const InstitutionsAndProvidersPersistence = require("../persistence/institutionsAndProviders")
const ServiceTypePersistence = require("../persistence/serviceType")
const InstitutionOwnServicePersistence = require("../persistence/institutionOwnService")

module.exports = {

    async getServicesOfInstitutionIndex(instName, callback) {

        console.log(instName);
        try {
            await InstitutionsAndProvidersPersistence.GetInstitution({ name: instName }, async function (inst) {

                console.log(inst);
                if (inst != null) {
                    console.log("Found Stored Institution", inst._id);


                    await InstitutionOwnServicePersistence.GetService(inst._id, "", async function (res) {

                        processServicesIndex(res, function (list) {
                            var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was fetched");

                            var ssp_response = { ssp_response: [{ provider: instName, services: list }] }

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

    async getServicesOfInstitutionGet(instName, ids, callback) {

        console.log(instName);
        try {
            await InstitutionsAndProvidersPersistence.GetInstitution({ name: instName }, async function (inst) {

                console.log(inst);
                if (inst != null) {
                    console.log("Found Stored Institution", inst._id);


                    await InstitutionOwnServicePersistence.GetService(inst._id, "", async function (res) {

                        processServices(res, ids, function (map) {
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

    async getOwners(callback) {

        try {
            await InstitutionsAndProvidersPersistence.GetInstitutions(async function (insts) {

                console.log(insts);

                let map = new Map();

                map.set("institution", new Array())
                map.set("provider", new Array())

                for (const inst of insts) {
                    var list = map.get(inst.type);
                    list.push(inst.name);
                    console.log('adding to map');
                    map.set(inst.type, list)
                }
                console.log(map);

                var response = new ResponseDTO(http.StatusOK, false, "Operation was successful", "Service was fetched");

                var ssp_response = { ssp_response: [] }
                map.forEach((value, key) => {
                    var elem = { owner: key, members: value }
                    ssp_response.ssp_response.push(elem)
                })

                console.log(JSON.stringify(ssp_response));

                response.data = ssp_response;
                return callback(response);
            })

        } catch (err) {
            console.log("Promise rejection error: " + err);
            return callback(new ResponseDTO(http.StatusInternalServerError, false, "Failed to insert Provider", "An error has occurred. Please login again."));

        }
    },

}


async function processServicesIndex(services, callback) {
    let list = []

    for (const currentS of services) {
        list.push(currentS._id);
    }

    return callback(list);
}

async function processServices(services, ids, callback) {
    let map = new Map();

    for (const currentS of services) {

        console.log(currentS._id.toString());
        if (ids.includes(currentS._id.toString())) {

            var fetched_service_name = "";

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
                                        if (res.length > 0) {
                                            service["permissions"] = res[0].permissions;
                                            service["data"] = res[0].data;
                                        }
                                        service["type"] = fetched_service_name;
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