const Validator = require("validator");
const isEmpty = require("../is-empty");
module.exports = function validatorLoginInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  // Check empty

  if (!Validator.isLength(data.password, { min: 5, max: 30 })) {
    errors.password = "Password lenght must be between 5 to 30 characters";
  }

  // chek lenght password

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is require";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is require";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
