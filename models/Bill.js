const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = new Schema(
  {
    BD_id: [{ type: Schema.Types.ObjectId, ref: "bill", require: true }],
    C_id: { type: Schema.Types.ObjectId, ref: "customer", require: true },
    B_total: { type: Number, require: true },
    B_status: { type: String, default: "Draft" },
    note: { type: String, require: true },
    B_create_at: { type: Date }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("bill", BillSchema, "bills");
