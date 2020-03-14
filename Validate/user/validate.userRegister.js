const Validator = require("validator");
const isEmpty = require("../is-empty");
module.exports = function validatorRegisterInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.fullname = !isEmpty(data.fullname) ? data.fullname : "";
  // Check empty

  // check phone number
  if (!Validator.isLength(data.phone, { min: 10, max: 10 })) {
    errors.phone = "Phone number is have 10 digits";
  }

  // chek lenght password

  if (!Validator.isLength(data.password, { min: 5, max: 30 })) {
    errors.password = "Password lenght must be between 5 to 30 characters";
  }
  if (!Validator.isLength(data.password2, { min: 5, max: 30 })) {
    errors.password2 = "Password lenght must be between 5 to 30 characters";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
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
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is require";
  }
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone field is require";
  }
  if (Validator.isEmpty(data.fullname)) {
    errors.fullname = "Full name field is reqrire";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
