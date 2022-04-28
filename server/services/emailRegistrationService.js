
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const Utils = require("../utils/utils")

var transporter = nodemailer.createTransport({
    host: 'mail.auth.gr',
    port: 25,
});

module.exports = {

    async notifyRequesterEmail(email, name) {

        Utils.readFile(__dirname + '/mailHTMLs/notifyRequester.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name: name,
            };
            var htmlToSend = template(replacements);

            var mailOptions = {
                from: "no-reply@auth.gr",
                to: email,
                subject: 'Provider Successfully Enrolled',
                html: htmlToSend
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

        })
    },

    async sendRegistrationEmail(data, callback) {

        var newCode = data._id;
        var email = data.provider_email;

        Utils.readFile(__dirname + '/mailHTMLs/newRegistration.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                newCode: newCode
            };
            var htmlToSend = template(replacements);

            var mailOptions = {
                from: "no-reply@auth.gr",
                to: email,
                subject: 'New Provider Registration',
                html: htmlToSend
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return callback(true);
        })
    },

    async sendProviderCertificateEmail(fileID, email, callback) {

        Utils.readFile(__dirname + '/mailHTMLs/providerCertificate.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                fileID: fileID
            };
            var htmlToSend = template(replacements);

            var mailOptions = {
                from: "no-reply@auth.gr",
                to: email,
                subject: 'Successful registered in Dashboard SSP Module',
                html: htmlToSend
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return callback(true);
        })
    },

}