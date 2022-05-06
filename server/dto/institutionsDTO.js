module.exports = class InstitutionDTO {

    constructor(name, type) {
        this._name = name;
        this._type = type;
    }

    get name() {
        return this._name
    }

    get type() {
        return this._type;
    }

    toJSON() {
        return {
            type: this.type,
            name: this.name,
        }
    }

}

