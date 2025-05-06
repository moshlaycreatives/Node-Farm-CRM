import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  BadRequestException,
  InternalServerErrorException,
} from "../errors/index.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  { timestamps: true }
);

// ==============================================
// 1. Hash password before storing in db
// ==============================================
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    throw new InternalServerErrorException(
      "An error occurred while hashing your password."
    );
  }
});

// ==============================================
// 2. Compare Password
// ==============================================
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("There is an error while comparing password.", error);
    throw new BadRequestException(
      "There is an error while comparing password."
    );
  }
};

// ==============================================
// 3. Generate JWT Token
// ==============================================
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || "t/19HAsveT4xJbTQmf0KHA==",
    {
      expiresIn: process.env.JWT_EXPIRE || "1d",
    }
  );
};
export const User = model("User", userSchema);
