const Validator = require("validator");
const isEmpty = require("../is-empty");
module.exports = function validatorProductType(data) {
  let errors = {};
  console.log(data);
  data._id = !isEmpty(data._id) ? data._id : "";
  data.TP_name = !isEmpty(data.TP_name) ? data.TP_name : "";
  data.TP_description = !isEmpty(data.TP_description)
    ? data.TP_description
    : "";
  // Check empty

  if (Validator.isEmpty(data.TP_name)) {
    errors.TP_name = "Product Type Name is require";
  }
  if (Validator.isEmpty(data.TP_description)) {
    errors.TP_description = "Product Type description is require";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
