import { Schema, model } from "mongoose";
// ============================================
// 1. Counter for auto-incrementing orderId
// ============================================
const orderCounterSchema = new Schema(
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

const OrderCounter = model("OrderCounter", orderCounterSchema);

// ============================================
// 2. Order schema
// ============================================
const orderSchema = new Schema(
  {
    orderId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    clientName: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productWeight: {
      type: String,
      trim: true,
      default: "",
    },

    productPrice: {
      type: Number,
      trim: true,
      default: 0,
    },

    shyamalStock: {
      type: Number,
      trim: true,
      default: 0,
    },

    shyamalStockPrice: {
      type: Number,
      trim: true,
      default: 0,
    },

    patelStock: {
      type: Number,
      trim: true,
      default: 0,
    },

    patelStockPrice: {
      type: Number,
      trim: true,
      default: 0,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ============================================
// 3. Auto-increment orderId
// ============================================
orderSchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      let counter = await OrderCounter.findOne({ name: "orderId" });
      if (!counter) {
        counter = await OrderCounter.create({ name: "orderId" });
      }

      const updatedCounter = await OrderCounter.findOneAndUpdate(
        { name: "orderId" },
        { $inc: { counter: 1 } },
        { new: true }
      );

      this.orderId = updatedCounter.counter;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const Order = model("Order", orderSchema);
