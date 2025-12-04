const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    specific: {
      flavor: { type: String },
      color: { type: String },
      weight: { type: String },
      volume: { type: String },
    },
  },
  { timestamps: true }
);

const purchaseSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    purchaseDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 }, //in percent
    mrp: { type: Number, required: true },
    expiryDate: { type: Date },
    remainingQty: { type: Number, required: true },
  },
  { timestamps: true }
);
const returnSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    returnedQty: { type: Number, required: true },
    expectedRefund: { type: Number, required: true },
    actualRefund: { type: Number, required: true },
    returnDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
