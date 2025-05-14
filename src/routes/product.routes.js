import { Router } from "express";
import { requiredFields, trimBodyObject } from "../middlewares/index.js";

import {
  addProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  searchProducts,
  updateProductById,
} from "../controllers/product.controllers.js";

const productRouter = Router();

// ========================================
// 1. Add + Get All - Product
// ========================================
productRouter
  .route("/")
  .post(
    trimBodyObject,
    requiredFields([
      "productName",
      "shyamalStock",
      "shymalStockPrice",
      "patelStock",
      "patelStockPrice",
      "date",
    ]),
    addProduct
  )
  .get(getAllProducts);

// ========================================
// 2. Get + Update + Delete - Product
// ========================================
productRouter
  .route("/:id")
  .get(getProductById)
  .put(
    trimBodyObject,
    requiredFields([
      "productName",
      "shyamalStock",
      "shymalStockPrice",
      "patelStock",
      "patelStockPrice",
      "date",
    ]),
    updateProductById
  )
  .delete(deleteProductById);

// ========================================
// 3. Search Product
// ========================================
productRouter.route("/search").get(searchProducts);

export { productRouter };
