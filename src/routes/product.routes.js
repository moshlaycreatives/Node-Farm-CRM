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
productRouter
  .route("/")
  .post(
    trimBodyObject,
    requiredFields([
      "productName",
      "samStock",
      "samStockPrice",
      "jozayStock",
      "jozayStockPrice",
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
      "samStock",
      "samStockPrice",
      "jozayStock",
      "jozayStockPrice",
      "date",
    ]),
    updateProductById
  )
  .delete(deleteProductById);

export { productRouter };
