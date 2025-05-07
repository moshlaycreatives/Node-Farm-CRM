import { Router } from "express";

import {
  trimBodyObject,
  requiredFields,
  emailValidator,
} from "../middlewares/index.js";

import { login } from "../controllers/auth.controllers.js";

const authRouter = Router();

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

export { authRouter };
