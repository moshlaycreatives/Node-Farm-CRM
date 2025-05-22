import { Router } from "express";
import {
  requiredFields,
  trimBodyObject,
  upload,
} from "../middlewares/index.js";
import {
  addExpense,
  deleteExpenseById,
  getAllExpenses,
  getExpenseById,
  searchExpenses,
  updateExpenseById,
} from "../controllers/expense.controllers.js";

const expenseRouter = Router();

// ========================================
// 1. Add + Get All - Expense
// ========================================
expenseRouter
  .route("/")
  .post(
    upload.single("image"),
    trimBodyObject,
    requiredFields(["paidBy", "expenseType", "amount", "date"]),
    addExpense
  )
  .get(getAllExpenses);

// ========================================
// 2. Search Expense
// ========================================
expenseRouter.route("/search").get(searchExpenses);

// ========================================
// 3. Get + Update + Delete - Expense
// ========================================
expenseRouter
  .route("/:id")
  .get(getExpenseById)
  .put(
    upload.single("image"),
    trimBodyObject,
    requiredFields(["paidBy", "expenseType", "amount", "date"]),
    updateExpenseById
  )
  .delete(deleteExpenseById);

export { expenseRouter };
