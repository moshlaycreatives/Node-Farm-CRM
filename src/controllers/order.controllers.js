import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler, ApiResponce } from "../utils/index.js";
import { NotFoundException, BadRequestException } from "../errors/index.js";

// ===========================================
// 1. Add Order (with stock update)
// ===========================================
export const addOrder = asyncHandler(async (req, res) => {
  const { product, samStock, joseStock, ...rest } = req.body;

  const existingProduct = await Product.findById(product);
  if (!existingProduct) {
    throw new NotFoundException("Product not found.");
  }

  const extractNumber = (str) => parseFloat(str); // e.g. "1200lb" => 1200
  const extractUnit = (str) => str.replace(/[0-9.]/g, "").trim(); // e.g. "1200lb" => "lb"

  const existingSamStockNum = extractNumber(existingProduct.samStock);
  const existingJoseStockNum = extractNumber(existingProduct.joseStock);

  if (samStock > existingSamStockNum || joseStock > existingJoseStockNum) {
    throw new BadRequestException(
      "Insufficient stock in the selected product."
    );
  }

  const samUnit = extractUnit(existingProduct.samStock);
  const joseUnit = extractUnit(existingProduct.joseStock);

  const newSamStock = `${existingSamStockNum - samStock}${samUnit}`;
  const newJoseStock = `${existingJoseStockNum - joseStock}${joseUnit}`;

  existingProduct.samStock = newSamStock;
  existingProduct.joseStock = newJoseStock;
  await existingProduct.save();

  const newOrder = await Order.create({
    product,
    samStock,
    joseStock,
    ...rest,
  });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Order placed successfully.",
      data: newOrder,
    })
  );
});

// ===========================================
// 2. Get All Orders
// ===========================================
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("product");

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: orders.length
        ? "Order collection fetched successfully."
        : "Order collection is empty.",
      data: orders,
    })
  );
});

// ===========================================
// 3. Get Order By Id
// ===========================================
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id }).populate("product");

  if (!order) {
    throw new NotFoundException("Order not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Order fetched successfully.",
      data: order,
    })
  );
});

// ===========================================
// 4. Update Order By Id (Stock adjusted properly)
// ===========================================
export const updateOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  const oldOrder = await Order.findById(id);
  if (!oldOrder) {
    throw new NotFoundException("Order not found.");
  }

  const product = await Product.findById(oldOrder.product);
  if (!product) {
    throw new NotFoundException("Product not found.");
  }

  const extractNumber = (str) => parseFloat(str);
  const extractUnit = (str) => str.replace(/[0-9.]/g, "").trim();

  const currentSamStock = extractNumber(product.samStock);
  const currentJoseStock = extractNumber(product.joseStock);
  const samUnit = extractUnit(product.samStock);
  const joseUnit = extractUnit(product.joseStock);

  // Revert old order stock
  let updatedSamStock = currentSamStock + oldOrder.samStock;
  let updatedJoseStock = currentJoseStock + oldOrder.joseStock;

  // Subtract new values if provided
  const newSamStockVal = newData.samStock ?? oldOrder.samStock;
  const newJoseStockVal = newData.joseStock ?? oldOrder.joseStock;

  updatedSamStock -= newSamStockVal;
  updatedJoseStock -= newJoseStockVal;

  if (updatedSamStock < 0 || updatedJoseStock < 0) {
    throw new BadRequestException("Not enough stock to update this order.");
  }

  product.samStock = `${updatedSamStock}${samUnit}`;
  product.joseStock = `${updatedJoseStock}${joseUnit}`;
  await product.save();

  const updatedOrder = await Order.findByIdAndUpdate(id, newData, {
    new: true,
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Order updated and stock adjusted successfully.",
      data: updatedOrder,
    })
  );
});

// ===========================================
// 5. Delete Order By Id (Stock not restored)
// ===========================================
export const deleteOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });

  if (!order) {
    throw new NotFoundException("Order not found.");
  }

  await Order.findOneAndDelete({ _id: req.params.id });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Order deleted successfully.",
    })
  );
});

// ===================================================
// 6. Search Orders (by clientName or phone)
// ===================================================
export const searchOrders = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message: "Search query is required.",
      })
    );
  }

  const searchRegex = new RegExp(query, "i");

  const orders = await Order.find({
    $or: [
      { clientName: { $regex: searchRegex } },
      { phone: { $regex: searchRegex } },
    ],
  }).populate("product");

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: orders.length
        ? "Order search results fetched successfully."
        : "No matching order found.",
      data: orders,
    })
  );
});
