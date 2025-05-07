import { Router } from "express";
import { authRouter } from "./auth.routes.js";

const router = Router();

// ==============================================
// 1. User Routes
// ==============================================
router.use("/user", authRouter);

export { router };
