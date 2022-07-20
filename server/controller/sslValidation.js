const forge = require('node-forge')

module.exports = function (app) {

    app.get("/validate", function (req, res, _) {

        var prefix = '-----BEGIN CERTIFICATE-----\n';
        var postfix = '-----END CERTIFICATE-----';
        var pemText = prefix + req.socket.getPeerCertificate(true).raw.toString('base64').match(/.{0,64}/g).join('\n') + postfix;

        const x509 = forge.pki.certificateFromPem(pemText);

        const value = x509.subject

        var cookieString = "";

        for (let i = (value.attributes.length - 1); i >= 0; i--) {
            cookieString += value.attributes[i].shortName + "=" + value.attributes[i].value + ","
        }

        cookieString = cookieString.slice(0, -1)

        console.log(cookieString);
        res.cookie('X-Cert-DN', cookieString, { encode: String });
        res.send()
    });

}