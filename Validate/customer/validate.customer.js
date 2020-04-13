const Validator = require("validator");
const isEmpty = require("../is-empty");

const validate = {};
let errors = {};
validate.login = function (data) {
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Check is email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // Check password Length
  if (Validator.isLength(data.password, { min: 5, max: 30 })) {
    errors.password = "Password length must between 5 to 30 characters.";
  }

  // Check  Empty valid
  if (!Validator.isEmpty(data.email)) {
    errors.email = "Email is require";
  }
  if (!Validator.isEmpty(data.password)) {
    errors.password = "Password is require";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

validate.register = function (data) {
  // check undefined
  data.email = !isEmpty(data.email) ? data.email : "";
  data.fullname = !isEmpty(data.fullname) ? data.fullname : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // check is Email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (!Validator.isNumeric(data.phone)) {
    errors.phone = "Phone Number must have numberic format";
  }
  if (!Validator.isLength(data.phone, { min: 10, max: 10 })) {
    errors.phone = "Phone number is have 10 digits";
  }

  //Check length password
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
    isValid: isEmpty(errors),
  };
};

validate.resetPassword = function (data) {
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
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
validate.forgot = function (data) {
  data.email = !isEmpty(data.email) ? data.email : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is require";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
module.exports = validate;
