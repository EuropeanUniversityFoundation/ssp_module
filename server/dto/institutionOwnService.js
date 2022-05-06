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

    toJSON() {
        return {
            provider_id: this.provider_id,
            service_id: this.service_id,
            data: this.data,
        }
    }

}

