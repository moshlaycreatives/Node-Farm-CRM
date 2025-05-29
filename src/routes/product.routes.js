import { Router } from "express";
import { requiredFields, trimBodyObject } from "../middlewares/index.js";

import {
  addProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../controllers/product.controllers.js";

const productRouter = Router();

// ========================================
// 1. Add + Get All - Product
// ========================================
productRouter.route("/").post(addProduct).get(getAllProducts);

// ========================================
// 2. Get + Update + Delete - Product
// ========================================
productRouter
  .route("/:id")
  .get(getProductById)
  .put(updateProductById)
  .delete(deleteProductById);

export { productRouter };
