import { Router } from "express";

import {
  trimBodyObject,
  requiredFields,
  emailValidator,
  loginAuth,
  adminAuth,
} from "../middlewares/index.js";

import {
  forgotPassword,
  getAllUsers,
  login,
  manageUserBlock,
  register,
  resetPassword,
  verifyForgotPasswordOTP,
} from "../controllers/auth.controllers.js";

const authRouter = Router();

// ==============================================
// 1. Register
// ==============================================
authRouter
  .route("/register")
  .post(
    trimBodyObject,
    requiredFields(["first_name", "email", "password"]),
    emailValidator,
    register
  );

// ==============================================
// 2. Login
// ==============================================
authRouter
  .route("/login")
  .post(
    trimBodyObject,
    requiredFields(["email", "password"]),
    emailValidator,
    login
  );

// ==============================================
// 3. Forgot Password
// ==============================================
authRouter
  .route("/forgot-password")
  .post(
    trimBodyObject,
    requiredFields(["email"]),
    emailValidator,
    forgotPassword
  );

// ==============================================
// 4. Verify Forgot Password OTP
// ==============================================
authRouter
  .route("/verify-otp")
  .patch(
    trimBodyObject,
    requiredFields(["email", "otp"]),
    emailValidator,
    verifyForgotPasswordOTP
  );

// ==============================================
// 5. Reset Password
// ==============================================
authRouter
  .route("/reset-password")
  .patch(
    trimBodyObject,
    requiredFields(["email", "newPassword"]),
    emailValidator,
    resetPassword
  );

// ==============================================
// 6. Manage user Block
// ==============================================
authRouter
  .route("/manage-block/:id")
  .patch(loginAuth, adminAuth, manageUserBlock);

// ==============================================
// 7. Get All Users
// ==============================================
authRouter.route("/").get(loginAuth, adminAuth, getAllUsers);

// ==============================================
// 8. Get User
// ==============================================
authRouter.route("/:id").get(loginAuth, getAllUsers);

export { authRouter };
