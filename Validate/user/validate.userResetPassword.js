const Validator = require("validator");
const isEmpty = require("../is-empty");
module.exports = function validatorRegisterInput(data) {
  let errors = {};
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  // Check empty

  // chek lenght password

  if (!Validator.isLength(data.password, { min: 5, max: 30 })) {
    errors.password = "Password lenght must be between 5 to 30 characters";
  }
  if (!Validator.isLength(data.password2, { min: 5, max: 30 })) {
    errors.password2 = "Password lenght must be between 5 to 30 characters";
  }

  if (data.password != data.password2) {
    errors.password2 = "Password must match";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is require";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Password Confirm field is require";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
