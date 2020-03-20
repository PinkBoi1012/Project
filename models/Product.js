const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    TP_id: [{ type: Schema.Types.ObjectId, ref: "typeProduct" }],
    P_name: { type: String, required: true },
    P_description: { type: String, required: true },
    P_content: { type: String, required: true },
    P_unit_price: { type: Number, required: true },
    P_unit: { type: Number, required: true },
    P_unit_sale: { type: Number, default: 0 },
    P_create_at: { type: Date, default: new Date() },
    P_picture: { type: String }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("product", productSchema, "products");
