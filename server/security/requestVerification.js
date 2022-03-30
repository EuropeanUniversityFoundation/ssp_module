const http = require("../model/constants/http")

const ResponseDTO = require("../dto/response")

module.exports = {

    verifyAuthentication(req, res, next) {

        // check for basic auth header

        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            let resp = new ResponseDTO(http.StatusUnauthorized, false, "Missing Authorization Header.", "");
            return res.json(resp.toJSON());
        }

        // verify auth credentials
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const creds = credentials.split(':');

        console.log(creds);
        console.log(process.env.SSP_USERNAME);

        if (creds[0] != process.env.SSP_USERNAME || creds[1] != process.env.SSP_PASS) {
            let resp = new ResponseDTO(http.StatusUnauthorized, false, "Invalid Authorization Header.", "");
            return res.json(resp.toJSON());
        }

        next();
    }

}