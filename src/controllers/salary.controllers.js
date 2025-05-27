import { Salary } from "../models/salary.model.js";
import { asyncHandler, ApiResponce } from "../utils/index.js";
import { NotFoundException } from "../errors/index.js";

// ===========================================
// 1. Add Salary Record
// ===========================================
export const addSalary = asyncHandler(async (req, res) => {
  const newEntry = await Salary.create(req.body);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Salary record added successfully.",
      data: newEntry,
    })
  );
});

// ===========================================
// 2. Get All Salaries with total per paidBy
// ===========================================
export const getAllSalaries = asyncHandler(async (req, res) => {
  const salaries = await Salary.find({});

  const totalsByPaidBy = await Salary.aggregate([
    { $match: { status: "Paid" } },
    {
      $group: {
        _id: "$paidBy",
        totalAmount: { $sum: "$salary" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        paidBy: "$_id",
        totalAmount: 1,
        count: 1,
        _id: 0,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        salaries.length > 0
          ? "Salary records fetched successfully."
          : "Salary collection is empty.",
      data: {
        salaries,
        totalsByPaidBy,
      },
    })
  );
});

// ===========================================
// 3. Get Salary By ID
// ===========================================
export const getSalaryById = asyncHandler(async (req, res) => {
  const salary = await Salary.findOne({ _id: req.params.id });

  if (!salary) {
    throw new NotFoundException("Salary record not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Salary record fetched successfully.",
      data: salary,
    })
  );
});

// ===========================================
// 4. Update Salary By ID
// ===========================================
export const updateSalaryById = asyncHandler(async (req, res) => {
  const salary = await Salary.findOne({ _id: req.params.id });

  if (!salary) {
    throw new NotFoundException("Salary record not found.");
  }

  const updated = await Salary.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Salary record updated successfully.",
      data: updated,
    })
  );
});

// ===========================================
// 5. Delete Salary By ID
// ===========================================
export const deleteSalaryById = asyncHandler(async (req, res) => {
  const salary = await Salary.findOne({ _id: req.params.id });

  if (!salary) {
    throw new NotFoundException("Salary record not found.");
  }

  await Salary.findOneAndDelete({ _id: req.params.id });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Salary record deleted successfully.",
    })
  );
});

// ===========================================
// 6. Search Salary Records
// ===========================================
export const searchSalary = asyncHandler(async (req, res) => {
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
      { salaryId: isNaN(numericQuery) ? null : numericQuery },
      { staffName: { $regex: searchRegex } },
      { gender: { $regex: searchRegex } },
      { phone: { $regex: searchRegex } },
      { paidBy: { $regex: searchRegex } },
      { status: { $regex: searchRegex } },
    ],
  };

  const results = await Salary.find(searchConditions);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        results.length > 0
          ? "Salary search results fetched successfully."
          : "No matching salary record found.",
      data: results,
    })
  );
});

// ===========================================
// 7. Update Salary Status Only
// ===========================================
export const updateSalaryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;

  if (!["Paid", "Unpaid"].includes(status)) {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message: "Invalid status value. Must be 'paid' or 'unpaid'.",
      })
    );
  }

  const salary = await Salary.findOne({ _id: id });

  if (!salary) {
    throw new NotFoundException("Salary record not found.");
  }

  salary.status = status;
  await salary.save();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Salary status updated successfully.",
      data: salary,
    })
  );
});
