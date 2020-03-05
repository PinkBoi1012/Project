const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TypeProductSchema = new Schema(
  {
    TP_name: { type: String, required: true },
    TP_description: { type: String, required: true },
    TP_image: { type: String, required: true },
    TP_create_at: { type: Date, default: new Date() },
    TP_update_at: { type: Date, default: "" }
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
