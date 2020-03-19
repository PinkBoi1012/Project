const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TypeProductSchema = new Schema(
  {
    TP_name: { type: String, required: true },
    TP_description: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model(
  "typeProduct",
  TypeProductSchema,
  "typeProducts"
);
