
module.exports = class StrucutreList {

    constructor(link_self) {
        this._link_self = link_self
        this._data = []
    }

    get link_self (){
        return this._link_self
    } 
    set data(d) {
        this._data.push(d);
    }

    get data (){
        return this._data
    }

    set id(id) {
        this._id = id;
    }

    toJSON() {
        return {
            links: { self: this.link_self },
            data: this._data
        }
    }

    toJSONID() {
        return {
            links: { self: this.link_self },
            id: this._id,
            data: this._data
        }
    }
}