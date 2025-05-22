import { Product } from "../models/product.model.js";
import { asyncHandler, ApiResponce } from "../utils/index.js";
import { NotFoundException } from "../errors/index.js";

// ===========================================
// 1. Add Product
// ===========================================
export const addProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Product added successfully.",
      data: newProduct,
    })
  );
});

// ===========================================
// 2. Get All Products (With Pagination)
// ===========================================
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        products.length > 0
          ? "Product collection fetched successfully."
          : "Product collection is empty.",
      data: products,
    })
  );
});

// ===========================================
// 3. Get Product By Id
// ===========================================
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    throw new NotFoundException("Product not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product fetched successfully.",
      data: product,
    })
  );
});

// ===========================================
// 4. Update Product By Id
// ===========================================
export const updateProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    throw new NotFoundException("Product not found.");
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product updated successfully.",
      data: updatedProduct,
    })
  );
});

// ===========================================
// 5. Delete Product By Id
// ===========================================
export const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    throw new NotFoundException("Product not found.");
  }

  await Product.findOneAndDelete({ _id: req.params.id });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Product deleted successfully.",
    })
  );
});
