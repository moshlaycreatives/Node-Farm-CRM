import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

export const createAdmin = async () => {
  const isAdminExist = await User.findOne({ email });

  if (!isAdminExist) {
    try {
      await User.create({
        email,
        password,
      });
    } catch (error) {
      console.error("An error occurred while creating admin.\n", error);
    }
  }
};
