const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    fullname: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    phone: { type: Number, require: true },
    active: { type: Boolean, default: false },
    create_at: { type: Date, default: new Date() },
  },
  { versionKey: false }
);

// Bcrypt password
// userSchema =
// Compare Match password
module.exports = mongoose.model("user", userSchema, "Users");
