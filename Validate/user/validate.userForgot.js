const Validator = require("validator");
const isEmpty = require("../is-empty");
module.exports = function validatorRegisterInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  // Check empty

  // chek lenght password

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is require";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
