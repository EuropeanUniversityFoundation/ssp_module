const dotenv = require("dotenv")
dotenv.config()

const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 8443;

app.use(cors());
app.use(bodyParser.json());
app.use((bodyParser.urlencoded({ extended: true })));

// https.createServer({
//     key: fs.readFileSync(path.join(__dirname, './certs/privkey.pem')),
//     cert: fs.readFileSync(path.join(__dirname, './certs/fullchain.pem')),
// }, app
// ).listen(port);


app.listen(port);

// ROUTES
const router = express.Router()

const prefix = "rest"

app.use('/' + prefix, router);


require("./controller/sspRegistrationController")(router, {});



