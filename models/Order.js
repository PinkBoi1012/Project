const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    OD_id: [{ type: Schema.Types.ObjectId, ref: "bill", require: true }],
    C_id: { type: Schema.Types.ObjectId, ref: "customer", require: true },
    O_total: { type: Number, require: true },
    O_status: { type: String, default: "Draft" },
    note: { type: String, require: true },
    O_create_at: { type: Date }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Order", OrderSchema, "Order");
