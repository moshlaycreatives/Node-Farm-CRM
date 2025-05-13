import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { staffRouter } from "./staff.routes.js";
import { loginAuth } from "../middlewares/index.js";
import { expenseRouter } from "./expense.routes.js";
import { salaryRouter } from "./salary.routes.js";
import { customerRouter } from "./customer.routes.js";

const router = Router();

// ==============================================
// 1. User Routes
// ==============================================
router.use("/user", authRouter);

// ==============================================
// 2. Staff Routes
// ==============================================
router.use("/staff", loginAuth, staffRouter);

// ==============================================
// 3. Expense Routes
// ==============================================
router.use("/expense", loginAuth, expenseRouter);

// ==============================================
// 4. Salary Routes
// ==============================================
router.use("/salary", loginAuth, salaryRouter);

// ==============================================
// 5. Salary Routes
// ==============================================
router.use("/customer", loginAuth, customerRouter);

export { router };
