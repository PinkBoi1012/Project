const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSchema = new Schema(
  {
    email: { type: String, require: true },
    create_at: { type: Date, default: Date.now() },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("email", emailSchema, "emails");
