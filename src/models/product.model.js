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
      trim: true,
      default: "",
    },

    samStock: {
      type: String,
      trim: true,
      default: "",
    },

    samStockPrice: {
      type: Number,
      default: 0,
    },

    joseStock: {
      type: String,
      trim: true,
      default: "",
    },

    joseStockPrice: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      enum: ["", "FLOWER", "PREROLE"],
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
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
