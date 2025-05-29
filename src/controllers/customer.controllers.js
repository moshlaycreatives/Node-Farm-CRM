import { Customer } from "../models/customer.model.js";
import { asyncHandler, ApiResponce } from "../utils/index.js";
import { BadRequestException, NotFoundException } from "../errors/index.js";

// ===========================================
// 1. Add Customer
// ===========================================
export const addCustomer = asyncHandler(async (req, res) => {
  const { companyName, clientName, phone, state, city, zipCode } = req.body;

  if (!(phone && phone.length >= 8 && phone.length <= 15)) {
    throw new BadRequestException("Invalid phone number lenght.");
  }

  const newEntry = await Customer.create({
    companyName: companyName ?? "",
    clientName: clientName ?? "",
    phone: phone ?? "",
    state: state ?? "",
    city: city ?? "",
    zipCode: zipCode ?? "",
  });

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
  const customers = await Customer.find({});

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        customers.length > 0
          ? "Customer collection fetched successfully."
          : "Customer collection is empty.",
      data: customers,
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

  const results = await Customer.find(searchConditions);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        results.length > 0
          ? "Customer search results fetched successfully."
          : "No matching customer found.",
      data: results,
    })
  );
});
