import { Router } from "express";

import {
  addProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../controllers/product.controllers.js";

const productRouter = Router();

// ========================================
// 2. Get + Update + Delete - Product
// ========================================
productRouter
  .route("/:id")
  .get(getProductById)
  .put(updateProductById)
  .delete(deleteProductById);

// ========================================
// 1. Add + Get All - Product
// ========================================
productRouter.route("/").post(addProduct).get(getAllProducts);

export { productRouter };
