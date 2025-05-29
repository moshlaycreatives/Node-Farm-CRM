import { Router } from "express";

import {
  addCustomer,
  deleteCustomerById,
  getAllCustomers,
  getCustomerById,
  searchCustomer,
  updateCustomerById,
} from "../controllers/customer.controllers.js";

const customerRouter = Router();

// ========================================
// 1. Add + Get All - Customers
// ========================================
customerRouter.route("/").post(addCustomer).get(getAllCustomers);

// ========================================
// 2. Get + Update + Delete - Customer
// ========================================
customerRouter
  .route("/:id")
  .get(getCustomerById)
  .put(updateCustomerById)
  .delete(deleteCustomerById);

// ========================================
// 3. Search Customer
// ========================================
customerRouter.route("/search").get(searchCustomer);

export { customerRouter };
