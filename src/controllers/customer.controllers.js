import { Customer } from "../models/customer.model.js";
import { asyncHandler, ApiResponce } from "../utils/index.js";
import { NotFoundException } from "../errors/index.js";

// ===========================================
// 1. Add Customer
// ===========================================
export const addCustomer = asyncHandler(async (req, res) => {
  const newEntry = await Customer.create(req.body);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Customer added successfully.",
      data: newEntry,
    })
  );
});

// ===========================================
// 2. Get All Customers (With Pagination)
// ===========================================
export const getAllCustomers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    Customer.find({}).skip(skip).limit(limit),
    Customer.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        customers.length > 0
          ? "Customer collection fetched successfully."
          : "Customer collection is empty.",
      data: {
        customers,
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
// 3. Get Customer By ID
// ===========================================
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id });

  if (!customer) {
    throw new NotFoundException("Customer not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Customer fetched successfully.",
      data: customer,
    })
  );
});

// ===========================================
// 4. Update Customer By ID
// ===========================================
export const updateCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id });

  if (!customer) {
    throw new NotFoundException("Customer not found.");
  }

  const updatedCustomer = await Customer.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Customer updated successfully.",
      data: updatedCustomer,
    })
  );
});

// ===========================================
// 5. Delete Customer By ID
// ===========================================
export const deleteCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id });

  if (!customer) {
    throw new NotFoundException("Customer not found.");
  }

  await Customer.findOneAndDelete({ _id: req.params.id });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Customer deleted successfully.",
    })
  );
});

// ====================================================
// 6. Search Customers (case-insensitive, paginated)
// ====================================================
export const searchCustomer = asyncHandler(async (req, res) => {
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
      { customerId: isNaN(numericQuery) ? null : numericQuery },
      { companyName: { $regex: searchRegex } },
      { clientName: { $regex: searchRegex } },
      { phone: { $regex: searchRegex } },
      { state: { $regex: searchRegex } },
      { city: { $regex: searchRegex } },
      { zipCode: { $regex: searchRegex } },
    ],
  };

  const [results, total] = await Promise.all([
    Customer.find(searchConditions).skip(skip).limit(limit),
    Customer.countDocuments(searchConditions),
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        results.length > 0
          ? "Customer search results fetched successfully."
          : "No matching customer found.",
      data: {
        customers: results,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
    })
  );
});
