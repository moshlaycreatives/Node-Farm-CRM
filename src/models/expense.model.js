import { Schema, model } from "mongoose";
// ==============================================
// 1. Expense counter schema
// ==============================================
const expenseCounterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    counter: {
      type: Number,
      default: 5000,
    },
  },
  { timestamps: true }
);

const ExpenseCounter = model("ExpenseCounter", expenseCounterSchema);

// ==============================================
// 2. Expense schema
// ==============================================
const expenseSchema = new Schema(
  {
    expenseId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    paidBy: {
      type: String,
      enum: ["Sam", "Jose"],
    },

    expenseType: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ==============================================
// 3. Auto-increment expenseId
// ==============================================
expenseSchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      let counter = await ExpenseCounter.findOne({ name: "expenseId" });
      if (!counter) {
        counter = await ExpenseCounter.create({ name: "expenseId" });
      }

      const updatedCounter = await ExpenseCounter.findOneAndUpdate(
        { name: "expenseId" },
        { $inc: { counter: 1 } },
        { new: true }
      );

      this.expenseId = updatedCounter.counter;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const Expense = model("Expense", expenseSchema);
