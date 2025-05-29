import { Schema, model } from "mongoose";
// ============================================
// 1. Counter for auto-incrementing salaryId
// ============================================
const salaryCounterSchema = new Schema(
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

const SalaryCounter = model("SalaryCounter", salaryCounterSchema);

// ============================================
// 2. Salary schema
// ============================================
const salarySchema = new Schema(
  {
    salaryId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    staffName: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      default: "",
    },

    salary: {
      type: Number,
    },

    phone: {
      type: String,
      trim: true,
    },

    paidBy: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

// ============================================
// 3. Auto-increment salaryId
// ============================================
salarySchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      let counter = await SalaryCounter.findOne({ name: "salaryId" });
      if (!counter) {
        counter = await SalaryCounter.create({ name: "salaryId" });
      }

      const updatedCounter = await SalaryCounter.findOneAndUpdate(
        { name: "salaryId" },
        { $inc: { counter: 1 } },
        { new: true }
      );

      this.salaryId = updatedCounter.counter;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const Salary = model("Salary", salarySchema);
