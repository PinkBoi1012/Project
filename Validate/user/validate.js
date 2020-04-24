const Validator = require("validator");
const isEmpty = require("../is-empty");

const validate = {};

validate.validateChangeOrder = function (data) {
  let errors = {};
  data.description = !isEmpty(data.email) ? data.email : "";
  data.status = !isEmpty(data.password) ? data.password : "";

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
module.exports = validate;
