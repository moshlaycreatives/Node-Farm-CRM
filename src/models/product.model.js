import { Schema, model } from "mongoose";

// ===================================================
// 1. Counter Schema for productId auto-increment
// ===================================================
const productCounterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    counter: {
      type: Number,
      default: 1000,
    },
  },
  { timestamps: true }
);

const ProductCounter = model("ProductCounter", productCounterSchema);

// ===================================================
// 2. Product Schema
// ===================================================
const productSchema = new Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    productName: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
    },

    shyamalStock: {
      type: Number,
      required: [true, "Shyamal stock is required."],
    },

    shyamalStockPrice: {
      type: Number,
      required: [true, "Shyamal stock price is required."],
    },

    patelStock: {
      type: Number,
      required: [true, "Patel stock is required."],
    },

    patelStockPrice: {
      type: Number,
      required: [true, "Patel stock price is required."],
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ===================================================
// 3. Pre-validation hook to auto-increment productId
// ===================================================
productSchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      let counter = await ProductCounter.findOne({ name: "productId" });
      if (!counter) {
        counter = await ProductCounter.create({ name: "productId" });
      }

      const updatedCounter = await ProductCounter.findOneAndUpdate(
        { name: "productId" },
        { $inc: { counter: 1 } },
        { new: true }
      );

      this.productId = updatedCounter.counter;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const Product = model("Product", productSchema);
