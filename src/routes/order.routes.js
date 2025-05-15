import { Router } from "express";
import { trimBodyObject, requiredFields } from "../middlewares/index.js";
import {
  addOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  searchOrders,
} from "../controllers/order.controllers.js";

const orderRouter = Router();

// ========================================
// 1. Add + Get All - Order
// ========================================
orderRouter
  .route("/")
  .post(trimBodyObject, requiredFields(["product"]), addOrder)
  .get(getAllOrders);

// ========================================
// 2. Get + Update + Delete - Order
// ========================================
orderRouter
  .route("/:id")
  .get(getOrderById)
  .put(trimBodyObject, updateOrderById)
  .delete(deleteOrderById);

// ========================================
// 3. Search Order
// ========================================
orderRouter.route("/search").get(searchOrders);

export { orderRouter };
