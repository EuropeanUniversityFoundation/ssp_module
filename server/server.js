const dotenv = require("dotenv")
dotenv.config()

const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // CSRF Cookie parsing
const csrf = require('csurf')

const app = express();
const sslvalidation = express();

const port = process.env.PORT || 8553;
const sslPort = 8554;

var csrfProt = csrf({ cookie: true })
app.use(cors());
app.use(cookieParser())
app.use(bodyParser.json());
app.use((bodyParser.urlencoded({ extended: true })));


// Middlewares
app.use(csrfProt,function (req, res, next) {
    next();
});

sslvalidation.use(cors());
sslvalidation.use(bodyParser.json());
sslvalidation.use((bodyParser.urlencoded({ extended: true })));

https.createServer({
    cert: fs.readFileSync(path.join(__dirname, './services/certificates/sspfullchain.pem')),
    key: fs.readFileSync(path.join(__dirname, './services/certificates/sspprivkey.pem')),
    ca: [fs.readFileSync(path.join(__dirname, './services/certificates/sspproviderca.crt'))],
    requestCert: true,
    rejectUnauthorized: true,
}, sslvalidation
).listen(sslPort);


app.listen(port);

// ROUTES
const router = express.Router()
const sslvalidationrouter = express.Router();

const prefix = "sspBackend"
const prefixsslvalidation = "ssl"

app.use('/' + prefix, router);
sslvalidation.use('/' + prefixsslvalidation, sslvalidationrouter);


require("./controller/sspRegistrationController")(router, {});
require("./controller/studentServiceController")(router, {});
require("./controller/apiController")(router, {});
require("./controller/sslValidation")(sslvalidationrouter, {});



