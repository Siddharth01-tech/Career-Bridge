const jobValidator = require("./jobvalidator");
const authValidator = require("./authvalidator");
const companyValidator = require("./companyvalidator");
const candidateValidator = require("./candidatevalidator");
const applicationValidator = require("./applicationvalidator");
const adminValidator = require("./adminvalidator");

module.exports = {
    ...jobValidator,
    ...authValidator,
    ...companyValidator,
    ...candidateValidator,
    ...applicationValidator,
    ...adminValidator
};
