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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({}).skip(skip).limit(limit),
    Product.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        products.length > 0
          ? "Product collection fetched successfully."
          : "Product collection is empty.",
      data: {
        products,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
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

// ===================================================
// 6. Search Products (case-insensitive, paginated)
// ===================================================
export const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!query || query.trim() === "") {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message: "Search query is required.",
      })
    );
  }

  const searchRegex = new RegExp(query, "i");
  const numericQuery = Number(query);

  const searchConditions = {
    $or: [
      { productName: { $regex: searchRegex } },
      { shyamalStock: isNaN(numericQuery) ? null : numericQuery },
      { shyamalStockPrice: isNaN(numericQuery) ? null : numericQuery },
      { patelStock: isNaN(numericQuery) ? null : numericQuery },
      { patelStockPrice: isNaN(numericQuery) ? null : numericQuery },
    ],
  };

  const [results, total] = await Promise.all([
    Product.find(searchConditions).skip(skip).limit(limit),
    Product.countDocuments(searchConditions),
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        results.length > 0
          ? "Product search results fetched successfully."
          : "No matching product found.",
      data: {
        products: results,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
    })
  );
});
