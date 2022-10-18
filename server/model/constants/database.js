module.exports = Object.freeze({
    DBURL: "mongodb://mongo-db:27017/",
    DBNAME: "ssps",
    DBUSER: "backend",
    DBPASS: process.env.DBPASS,

    TABLE_SSP_CODES: "ssp_codes",
    TABLE_SSP_PROVIDERS: "ssp_providers",
    TABLE_INST_AND_PROVIDERS: "institutions_and_providers",
    TABLE_SERVICE_TYPE: "service_type",
    TABLE_INSTITUTION_OWN_INFORMATION: "inst_own_information",
});