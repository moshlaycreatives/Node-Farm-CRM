import { Schema, model } from "mongoose";

// ===================================================
// 1. Counter schema for auto-incrementing staffId
// ===================================================
const staffCounterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    counter: {
      type: Number,
      default: 200,
    },
  },
  { timestamps: true }
);

const StaffCounter = model("StaffCounter", staffCounterSchema);

// ===================================================
// 2. Staff schema
// ===================================================
const staffSchema = new Schema(
  {
    staffId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Fxemale"],
      required: true,
    },

    role: {
      type: String,
      required: [true, "Role is required."],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Role is required."],
      trim: true,
    },
  },
  { timestamps: true }
);

// =======================================================
// 3. Pre-validation hook to auto-increment staffId
// =======================================================
staffSchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      let counter = await StaffCounter.findOne({ name: "staffId" });
      if (!counter) {
        counter = await StaffCounter.create({
          name: "staffId",
        });
      }

      const updatedCounter = await StaffCounter.findOneAndUpdate(
        { name: "staffId" },
        { $inc: { counter: 1 } },
        { new: true }
      );

      this.staffId = updatedCounter.counter;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const Staff = model("Staff", staffSchema);
