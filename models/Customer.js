const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const customerSchema = new Schema(
  {
    full_name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: Number, require: true },
    password: { type: String, require: true },
    create_at: { type: Date, default: new Date(), require: true },
  },
  {
    versionKey: false,
  }
);

customerSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

customerSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model("customer", customerSchema, "customers");
