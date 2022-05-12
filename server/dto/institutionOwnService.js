var ObjectId = require("mongodb").ObjectId
module.exports = class InstitutionOwnService {

    constructor(prov_id, serv_id, data) {
        this._provider_id = prov_id;
        this._service_id = serv_id;
        this._data = data;
    }

    get provider_id() {
        return this._provider_id
    }

    get service_id() {
        return this._service_id;
    }

    get data() {
        return this._data;
    }

    get ssp() {
        return this._ssp;
    }

    set ssp(ssp){
        this._ssp = ssp;
    }

    set ssp_data_id(id){
        this._ssp_data_id = id;
    }

    get ssp_data_id(){
        return this._ssp_data_id;
    }

    toJSON() {
        return {
            provider_id: this.provider_id,
            service_id: this.service_id,
            data: this.data,
        }
    }

    toJSONSSP() {
        return {
            provider_id: this.provider_id,
            service_id: this.service_id,
            ssp: this.ssp,
            data_id: new ObjectId(this.ssp_data_id)
        }
    }
}

