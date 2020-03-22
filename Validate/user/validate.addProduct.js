const Validator = require("validator");
const isEmpty = require("../is-empty");
module.exports = function validatorProductType(data) {
  let errors = {};

  data.P_name = !isEmpty(data.P_name) ? data.P_name : "";
  data.TP_id = !isEmpty(data.TP_id) ? data.TP_id : [];
  data.P_description = !isEmpty(data.P_description) ? data.P_description : "";
  data.P_content = !isEmpty(data.P_content) ? data.P_content : "";
  data.P_unit_price = !isEmpty(data.P_unit_price) ? data.P_unit_price : "";
  data.P_unit = !isEmpty(data.P_unit) ? data.P_unit : "";
  // Check empty

  if (Validator.isEmpty(data.P_name)) {
    errors.P_name = "Product Name field is require";
  }
  console.log(data.TP_id.length < 1);
  if (data.TP_id.length < 1) {
    errors.TP_id = "Please choose Product Type for this product";
  }
  console.log(data.P_description);
  if (Validator.isEmpty(data.P_description)) {
    errors.P_description = "Product description is require";
  }
  if (Validator.isEmpty(data.P_content)) {
    errors.P_content = "Product Content field is require";
  }
  if (Validator.isEmpty(data.P_unit_price)) {
    errors.P_unit_price = "Unit Price field is require";
  }
  if (Validator.isEmpty(data.P_unit)) {
    errors.P_unit = "Amount of Storage field is require";
  }

  // Check input number
  if (!Validator.isNumeric(data.P_unit)) {
    errors.P_unit_price = "Please input number";
  }
  if (!Validator.isNumeric(data.P_unit_price)) {
    errors.P_unit_price = "Please input number";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
