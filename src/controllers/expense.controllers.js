import { Expense } from "../models/expense.model.js";
import { asyncHandler, ApiResponce } from "../utils/index.js";
import { NotFoundException } from "../errors/index.js";

// ===========================================
// 1. Add Expense
// ===========================================
export const addExpense = asyncHandler(async (req, res) => {
  if (req?.file) {
    req.body.image = process.env.BASE_URL + req.file.path.replace(/\\/g, "/");
  }

  const newExpense = await Expense.create({
    paidBy: req.body.paidBy,
    expenseType: req.body.expenseType,
    amount: req.body.amount,
    date: req.body.date,
    image: req.body?.image ? req.body.image : "",
  });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Expense added successfully.",
      data: newExpense,
    })
  );
});

// ===========================================
// 2. Get All Expenses
// ===========================================
export const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({});

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        expenses.length > 0
          ? "Expenses fetched successfully."
          : "No expense records found.",
      data: expenses,
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
    req.body.image = process.env.BASE_URL + req.file.path.replace(/\\/g, "/");
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

  let matchConditions = {};

  if (query && query.trim() !== "") {
    matchConditions = {
      $or: [
        { expenseIdStr: { $regex: query, $options: "i" } },
        { paidBy: { $regex: query, $options: "i" } },
        { expenseType: { $regex: query, $options: "i" } },
      ],
    };
  }

  const results = await Expense.aggregate([
    {
      $addFields: {
        expenseIdStr: { $toString: "$expenseId" },
      },
    },
    {
      $match: matchConditions,
    },
    {
      $project: {
        expenseIdStr: 0,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        results.length > 0
          ? "Expenses search results fetched successfully."
          : "No matching expenses found.",
      data: results,
    })
  );
});
