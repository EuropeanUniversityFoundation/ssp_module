const https = require('follow-redirects').https;

module.exports = {

    async buildRequest(hostname, port, path, parameters, method, callback) {
        var params = "";
        if (parameters != null) {
            params = parameters;
        }

        const optionsWithoutCert = {
            hostname: hostname,
            port: port,
            path: path + params,
            method: method,
            rejectUnauthorized: false,
        }

        const reqWithoutCert = https.request(optionsWithoutCert, res => {
            
            var resBody = '';


            res.on('data', function (chunk) {
                resBody += chunk
            });

            res.on('end', function () {
                // Now that the response is done streaming, parse resBody           
                return callback({ statusCode: res.statusCode, data: resBody });

            });
            reqWithoutCert.end()
        })


        reqWithoutCert.on('error', error => {
            console.error(error)
            return callback({ statusCode: 500, data: "error" });

        })

        reqWithoutCert.end()
    }


}
