import { Expense } from "../models/expense.model.js";
import { asyncHandler, ApiResponce } from "../utils/index.js";
import { NotFoundException, BadRequestException } from "../errors/index.js";

// ===========================================
// 1. Add Expense
// ===========================================
export const addExpense = asyncHandler(async (req, res) => {
  if (req?.file) {
    req.body.image = process.env.BASE_URL + req.file.path.replace(/\\/g, "/");
  }

  const newExpense = await Expense.create(req.body);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Expense added successfully.",
      data: newExpense,
    })
  );
});

// ===========================================
// 2. Get All Expenses (Paginated)
// ===========================================
export const getAllExpenses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [expenses, total] = await Promise.all([
    Expense.find({}).skip(skip).limit(limit),
    Expense.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        expenses.length > 0
          ? "Expenses fetched successfully."
          : "No expense records found.",
      data: {
        expenses,
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
// 3. Get Expense By ID
// ===========================================
export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id });

  if (!expense) {
    throw new NotFoundException("Expense not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Expense fetched successfully.",
      data: expense,
    })
  );
});

// ===========================================
// 4. Update Expense By ID
// ===========================================
export const updateExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id });

  if (!expense) {
    throw new NotFoundException("Expense not found.");
  }

  if (req?.file) {
    req.body.image = req.file.path.replace(/\\/g, "/");
  }

  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Expense updated successfully.",
      data: updated,
    })
  );
});

// ===========================================
// 5. Delete Expense By ID
// ===========================================
export const deleteExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id });

  if (!expense) {
    throw new NotFoundException("Expense not found.");
  }

  await Expense.findOneAndDelete({ _id: req.params.id });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Expense deleted successfully.",
    })
  );
});

// ===========================================
// 6. Search Expenses
// ===========================================
export const searchExpenses = asyncHandler(async (req, res) => {
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
      { expenseId: isNaN(numericQuery) ? null : numericQuery },
      { paidBy: { $regex: searchRegex } },
      { expenseType: { $regex: searchRegex } },
    ],
  };

  const [results, total] = await Promise.all([
    Expense.find(searchConditions).skip(skip).limit(limit),
    Expense.countDocuments(searchConditions),
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        results.length > 0
          ? "Expenses search results fetched successfully."
          : "No matching expenses found.",
      data: {
        expenses: results,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
    })
  );
});
