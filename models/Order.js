const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    C_id: { type: Schema.Types.ObjectId, ref: "customer", require: true },
    cart: { type: Object, require: true },
    address: { type: String, require: true },
    O_status: { type: String, default: "Payment" },
    O_create_at: { type: Date },
    paymentId: { type: String, require: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Order", OrderSchema, "Order");
