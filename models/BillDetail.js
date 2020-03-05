const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillDetailSchema = new Schema(
  {
    B_id: { type: Schema.Types.ObjectId, ref: "bill", require: true },
    P_name: { type: Schema.Types.ObjectId, ref: "product", require: true },
    P_quantity: { type: Number, require: true },
    unit_price: { type: Number, require: true }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("billDetail", BillDetailSchema, "billDetails");
