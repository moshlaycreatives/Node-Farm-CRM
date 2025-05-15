import { Router } from "express";
import {
  counterDetails,
  totalExpense,
  monthlyExpenses,
  getEarnings,
} from "../controllers/dashboard.controllers.js";

const dashboardRouter = Router();

// ========================================
// 1. Counter Details
// ========================================
dashboardRouter.get("/counter-details", counterDetails);

// ========================================
// 2. Total Expenses
// ========================================
dashboardRouter.get("/total-expense", totalExpense);

// ========================================
// 3. Monthly Expenses (Pass ?year=2025)
// ========================================
dashboardRouter.get("/monthly-expenses", monthlyExpenses);

// ========================================
// 4. Earnings (Pass ?query=week/month/year/2024/etc.)
// ========================================
dashboardRouter.get("/earnings", getEarnings);

export { dashboardRouter };
