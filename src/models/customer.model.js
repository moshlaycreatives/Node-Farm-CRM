import { Schema, model } from "mongoose";

// ===================================================
// 1. Counter schema for auto-incrementing customerId
// ===================================================
const customerCounterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    counter: {
      type: Number,
      default: 500,
    },
  },
  { timestamps: true }
);

const CustomerCounter = model("CustomerCounter", customerCounterSchema);

// ===================================================
// 2. Customer schema
// ===================================================
const customerSchema = new Schema(
  {
    customerId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: "",
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

    state: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    zipCode: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// =======================================================
// 3. Pre-validation hook to auto-increment customertId
// =======================================================
customerSchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      let counter = await CustomerCounter.findOne({ name: "customerId" });
      if (!counter) {
        counter = await CustomerCounter.create({ name: "customerId" });
      }

      const updatedCounter = await CustomerCounter.findOneAndUpdate(
        { name: "customerId" },
        { $inc: { counter: 1 } },
        { new: true }
      );

      this.customerId = updatedCounter.counter;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const Customer = model("Customer", customerSchema);
