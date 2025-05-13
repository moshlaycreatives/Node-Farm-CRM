import { Router } from "express";
import { requiredFields, trimBodyObject } from "../middlewares/index.js";

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
customerRouter
  .route("/")
  .post(
    trimBodyObject,
    requiredFields([
      "companyName",
      "clientName",
      "phone",
      "state",
      "city",
      "zipCode",
    ]),
    addCustomer
  )
  .get(getAllCustomers);

// ========================================
// 2. Get + Update + Delete - Customer
// ========================================
customerRouter
  .route("/:id")
  .get(getCustomerById)
  .put(
    trimBodyObject,
    requiredFields([
      "companyName",
      "clientName",
      "phone",
      "state",
      "city",
      "zipCode",
    ]),
    updateCustomerById
  )
  .delete(deleteCustomerById);

// ========================================
// 3. Search Customer
// ========================================
customerRouter.route("/search").get(searchCustomer);

export { customerRouter };
