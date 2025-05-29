import { Router } from "express";
import { requiredFields, trimBodyObject } from "../middlewares/index.js";
import {
  addSalary,
  getAllSalaries,
  updateSalaryById,
  deleteSalaryById,
  searchSalary,
  getSalaryById,
  updateSalaryStatus,
} from "../controllers/salary.controllers.js";

const salaryRouter = Router();

// ========================================
// 1. Add + Get All - Salaries
// ========================================
salaryRouter
  .route("/")
  .post(
    trimBodyObject,
    requiredFields(["staffName", "salary", "phone", "paidBy", "date"]),
    addSalary
  )
  .get(getAllSalaries);

// ========================================
// 2. Get + Update + Delete - Salary
// ========================================
salaryRouter
  .route("/:id")
  .get(getSalaryById)
  .put(
    trimBodyObject,
    requiredFields(["staffName", "salary", "phone", "paidBy", "date"]),
    updateSalaryById
  )
  .patch(updateSalaryStatus)
  .delete(deleteSalaryById);

// ========================================
// 3. Search Salary
// ========================================
salaryRouter.route("/search").get(searchSalary);

export { salaryRouter };
