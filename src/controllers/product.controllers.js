import { Product } from "../models/product.model.js";
import { asyncHandler, ApiResponce } from "../utils/index.js";
import { NotFoundException } from "../errors/index.js";

// ===========================================
// 1. Add Product
// ===========================================
export const addProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    samStock,
    samStockPrice,
    jozayStock,
    jozayStockPrice,
    date,
  } = req.body;
  const newProduct = await Product.create({
    productName: productName ?? "",
    samStock: samStock ?? "",
    samStockPrice: Number(samStockPrice) || 0,
    jozayStock: jozayStock ?? "",
    jozayStockPrice: Number(jozayStockPrice) || 0,
    date: date ?? new Date(),
  });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Product added successfully.",
      data: newProduct,
    })
  );
});

// ===========================================
// 2. Get All Products
// ===========================================
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  const extractNumber = (str) => parseFloat(str);
  const extractUnit = (str) => str.replace(/[0-9.]/g, "").trim();

  const productsWithTotal = products.map((product) => {
    const productObj = product.toObject();

    const samNum = extractNumber(product.samStock);
    const samUnit = extractUnit(product.samStock);

    const jozayNum = extractNumber(product.jozayStock);
    const jozayUnit = extractUnit(product.jozayStock);

    let totalStock;

    if (samUnit === jozayUnit) {
      totalStock = `${samNum + jozayNum}${samUnit}`;
    } else {
      totalStock = `${samNum}${samUnit} + ${jozayNum}${jozayUnit}`;
    }

    productObj.totalStock = totalStock;

    return productObj;
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        products.length > 0
          ? "Product collection fetched successfully."
          : "Product collection is empty.",
      data: productsWithTotal,
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
