const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    full_name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    phone: { type: Number, require: true },
    create_at: { type: Date, default: new Date() }
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema, "Users");
