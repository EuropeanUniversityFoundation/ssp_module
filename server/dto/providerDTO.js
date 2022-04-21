module.exports = class ProviderDTO {

    constructor(name, contactName, contactEmail, domain, link_self) {
        this._name = name;
        this._contactName = contactName;
        this._contactEmail = contactEmail;
        this._domain = domain;
        this._linkself = link_self;
    }

    get name() {
        return this._name
    }

    get contactName() {
        return this._contactName;
    }

    get contactEmail() {
        return this._contactEmail;
    }

    get link_self() {
        return this._linkself;
    }

    get domain() {
        return this._domain;
    }

    set link_institutions(link) {
        this._linkInstitutions = link;
    }

    set data(data) {
        this._data = data;
    }

    toJSON() {
        return {
            links: {
                self: this.link_self
            },
            data: {
                type: "provider",
                domain: this.domain,
                attributes: {
                    contactName: this.contactName,
                    contactEmail: this.contactEmail,
                    name: this.name
                },
            },

        }
    }

    // toJSONWithInstitutions(show) {
    //     var data = {
    //         links: {
    //             self: this.link_self
    //         },
    //         data: {
    //             type: "provider",
    //             name: this.name,
    //             status: this._status,
    //             attributes: {
    //                 contactName: this.contactName,
    //                 contactEmail: this.contactEmail,
    //                 country: this.country,
    //                 city: this.city,
    //                 mou: this.mou_filename
    //             },
    //         },

    //         relationships: {
    //             links: {
    //                 self: this._linkInstitutions
    //             },
    //             data: this._data
    //         }
    //     }

    //     if (show) {
    //    //     data.data.attributes.cert_pass = this._cert_pass
    //         data.data.attributes.pos = this._pos;
    //     }

    //     return data;
    // }

}

