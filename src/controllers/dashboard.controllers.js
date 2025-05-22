import { Product } from "../models/product.model.js";
import { Staff } from "../models/staff.model.js";
import { Salary } from "../models/salary.model.js";
import { Expense } from "../models/expense.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import dayjs from "dayjs";
import { Order } from "../models/order.model.js";

// =============================================
// 1. Counter Details
// =============================================
export const counterDetails = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();

  const stockAggregation = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalSamStock: { $sum: "$samStock" },
        totalJozayStock: { $sum: "$jozayStock" },
      },
    },
  ]);

  const totalStock =
    stockAggregation.length > 0
      ? stockAggregation[0].totalSamStock + stockAggregation[0].totalJozayStock
      : 0;

  const totalStaff = await Staff.countDocuments();

  const salaryAggregation = await Salary.aggregate([
    {
      $group: {
        _id: null,
        totalSalaries: { $sum: "$salary" },
      },
    },
  ]);

  const totalSalaries =
    salaryAggregation.length > 0 ? salaryAggregation[0].totalSalaries : 0;

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Counter details fetched successfully.",
      data: {
        totalProducts,
        totalStock,
        totalStaff,
        totalSalaries,
      },
    })
  );
});

// =============================================
// 2. Total Expense Details
// =============================================
export const totalExpense = asyncHandler(async (req, res) => {
  const expenseAggregation = await Expense.aggregate([
    {
      $group: {
        _id: "$paidBy",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  let samExpense = 0;
  let jozayExpense = 0;

  expenseAggregation.forEach((entry) => {
    if (entry._id === "Sam") samExpense = entry.totalAmount;
    if (entry._id === "Jozay") jozayExpense = entry.totalAmount;
  });

  const totalExpenses = samExpense + jozayExpense;

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Total expenses fetched successfully.",
      data: {
        samExpense,
        jozayExpense,
        totalExpenses,
      },
    })
  );
});

// =============================================
// 3. Monthly Expenses (Jan - Dec for given year)
// =============================================
export const monthlyExpenses = asyncHandler(async (req, res) => {
  const { year } = req.query;
  const selectedYear = parseInt(year) || new Date().getFullYear();

  const monthlyAggregation = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${selectedYear}-01-01`),
          $lte: new Date(`${selectedYear}-12-31T23:59:59.999Z`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const filteredExpenses = monthlyAggregation
    .filter((entry) => entry.totalAmount > 0)
    .map((entry) => ({
      month: `${monthNames[entry._id - 1]}-${selectedYear}`,
      amount: entry.totalAmount,
    }));

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: `Monthly expenses for year ${selectedYear} fetched successfully.`,
      data: {
        year: selectedYear,
        monthlyExpenses: filteredExpenses,
      },
    })
  );
});

// =============================================
// 4. Get Eranings
// =============================================
export const getEarnings = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message:
          "Query parameter is required (week, month, year, or specific year).",
      })
    );
  }

  const now = dayjs();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ============ SPECIFIC YEAR OR "year" ============
  if (query.toLowerCase() === "year" || /^\d{4}$/.test(query)) {
    const year = query.toLowerCase() === "year" ? now.year() : parseInt(query);
    const isCurrentYear = year === now.year();
    const limitMonth = isCurrentYear ? now.month() + 1 : 12;

    const monthlyData = Array.from({ length: limitMonth }, (_, i) => ({
      month: monthNames[i],
      samEarning: 0,
      jozayEarning: 0,
    }));

    const startDate = dayjs(`${year}-01-01`).startOf("month").toDate();
    const endDate = isCurrentYear
      ? now.endOf("month").toDate()
      : dayjs(`${year}-12-31`).endOf("month").toDate();

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    for (const order of orders) {
      const monthIndex = new Date(order.createdAt).getMonth();
      if (monthIndex < limitMonth) {
        monthlyData[monthIndex].samEarning += order.samStockPrice || 0;
        monthlyData[monthIndex].jozayEarning += order.jozayStockPrice || 0;
      }
    }

    // Add totalEarning to each month object
    const formattedData = monthlyData.map((item) => ({
      ...item,
      samEarning: +item.samEarning.toFixed(2),
      jozayEarning: +item.jozayEarning.toFixed(2),
      totalEarning: +(item.samEarning + item.jozayEarning).toFixed(2),
    }));

    return res.status(200).json({
      success: true,
      message: `Earnings for year ${year} fetched successfully.`,
      data: formattedData,
    });
  }

  // ============ WEEK / MONTH ============
  let startDate, endDate;
  if (query.toLowerCase() === "week") {
    startDate = now.startOf("week").toDate();
    endDate = now.endOf("week").toDate();
  } else if (query.toLowerCase() === "month") {
    startDate = now.startOf("month").toDate();
    endDate = now.endOf("month").toDate();
  } else {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message: "Invalid query parameter.",
      })
    );
  }

  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  let samEarning = 0;
  let jozayEarning = 0;

  for (const order of orders) {
    samEarning += order.samStockPrice || 0;
    jozayEarning += order.jozayStockPrice || 0;
  }

  return res.status(200).json({
    success: true,
    message: `Earnings for ${query.toLowerCase()} fetched successfully.`,
    data: [
      {
        month:
          query.toLowerCase() === "month" ? now.format("MMMM") : "This Week",
        samEarning: +samEarning.toFixed(2),
        jozayEarning: +jozayEarning.toFixed(2),
        totalEarning: +(samEarning + jozayEarning).toFixed(2),
      },
    ],
  });
});
