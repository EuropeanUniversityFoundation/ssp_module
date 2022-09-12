module.exports = class InstitutionDTO {

    constructor(name, type, country) {
        this._name = name;
        this._type = type;
        this._country = country;
    }

    get name() {
        return this._name
    }

    get type() {
        return this._type;
    }

    get country() {
        return this._country;
    }

    toJSON() {
        return {
            type: this.type,
            name: this.name,
            country: this.country
        }
    }

}

