const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    C_id: { type: Schema.Types.ObjectId, ref: "customer", require: true },
    cart: { type: Object, require: true },
    address: { type: String, require: true },
    O_status: { type: String, default: "Payment" },
    O_create_at: { type: Date, default: Date.now() },
    O_description: { type: String, default: "We are processing your order." },
    paymentId: { type: String, require: true },
  },
  {
    versionKey: false,
  }
);
OrderSchema.methods.generateArray = function () {
  let arr = [];
  for (let id in this.items) {
    arr.push(this.items[id]);
  }
  return arr;
};
module.exports = mongoose.model("Order", OrderSchema, "Order");
