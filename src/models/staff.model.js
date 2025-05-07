import { Schema, model } from "mongoose";

const staffSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
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
export const Staff = model("Staff", staffSchema);
