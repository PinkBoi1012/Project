const Validator = require("validator");
const isEmpty = require("../is-empty");
module.exports = function validatorProduct(data) {
  let errors = {};

  data.P_name = !isEmpty(data.P_name) ? data.P_name : "";
  data.TP_id = !isEmpty(data.TP_id) ? data.TP_id : [];
  data.P_description = !isEmpty(data.P_description) ? data.P_description : "";
  data.P_content = !isEmpty(data.P_content) ? data.P_content : "";
  data.P_unit_price = !isEmpty(data.P_unit_price) ? data.P_unit_price : "";
  data.P_unit = !isEmpty(data.P_unit) ? data.P_unit : "";
  // Check empty
  if (!Validator.isNumeric(data.P_unit)) {
    errors.P_unit = "Please input number";
  }
  if (!Validator.isNumeric(data.P_unit_price)) {
    errors.P_unit_price = "Please input number";
  }
  if (Validator.isEmpty(data.P_name)) {
    errors.P_name = "Product Name field is require";
  }

  if (data.TP_id.length < 1) {
    errors.TP_id = "Please choose Product Type for this product";
  }

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
  if (data.P_unit_price < 0) {
    errors.P_unit_price = "Price must more than 0";
  }
  if (data.P_unit < 0) {
    errors.P_unit = "Unit Stoke must more than 0";
  }
  // Check input number

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
