const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    TP_id: [{ type: Schema.Types.ObjectId, ref: "typeProduct" }],
    P_name: { type: String, required: true },
    P_description: { type: String, required: true },
    P_content: { type: String, required: true },
    P_unit_price: { type: mongoose.Decimal128, required: true },
    P_unit: { type: Number, required: true },
    P_unit_sale: { type: Number, default: 0 },
    P_create_at: { type: Date, default: new Date() },
    P_picture: { type: String, require: true },
  },
  {
    versionKey: false,
  }
);

const decimal2JSON = (v, i, prev) => {
  if (v !== null && typeof v === "object") {
    if (v.constructor.name === "Decimal128") prev[i] = v.toString();
    else
      Object.entries(v).forEach(([key, value]) =>
        decimal2JSON(value, key, prev ? prev[i] : v)
      );
  }
};

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    decimal2JSON(ret);
    return ret;
  },
});

module.exports = mongoose.model("product", productSchema, "products");
