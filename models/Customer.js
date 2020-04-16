const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = mongoose.model("customer", customerSchema, "customers");
