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
  const totalPreroles = await Product.countDocuments({ category: "PREROLE" });
  const totalFlowers = await Product.countDocuments({ category: "FLOWER" });

  const totalStaff = await Staff.countDocuments();

  const startOfMonth = dayjs().startOf("month").toDate();
  const endOfMonth = dayjs().endOf("month").toDate();

  const salaryAggregation = await Salary.aggregate([
    {
      $match: {
        date: { $gte: startOfMonth, $lte: endOfMonth },
        status: "Paid",
      },
    },
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
        totalFlowers,
        totalPreroles,
        totalStaff,
        totalSalaries,
      },
    })
  );
});

// =============================================
// 2. Get Eranings
// =============================================
export const getEarnings = asyncHandler(async (req, res) => {
  const { query, yearParam } = req.query;
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

  // ========== CASE 1: WEEK or MONTH ==========
  if (
    query &&
    (query.toLowerCase() === "week" || query.toLowerCase() === "month")
  ) {
    const lowerQuery = query.toLowerCase();
    let startDate, endDate;

    if (lowerQuery === "week") {
      startDate = now.startOf("week").toDate();
      endDate = now.endOf("week").toDate();
    } else {
      startDate = now.startOf("month").toDate();
      endDate = now.endOf("month").toDate();
    }

    const orders = await Order.find({
      date: { $gte: startDate, $lte: endDate },
    });

    let samEarning = 0;
    let joseEarning = 0;

    for (const order of orders) {
      samEarning += order.samStockPrice || 0;
      joseEarning += order.joseStockPrice || 0;
    }

    return res.status(200).json({
      success: true,
      message: `Earnings for ${lowerQuery} fetched successfully.`,
      data: [
        {
          period: lowerQuery === "week" ? "This Week" : now.format("MMMM"),
          samEarning: +samEarning.toFixed(2),
          joseEarning: +joseEarning.toFixed(2),
          totalEarning: +(samEarning + joseEarning).toFixed(2),
        },
      ],
    });
  }

  // ========== CASE 2: Specific Year or Current Year ==========
  const year = yearParam
    ? parseInt(yearParam)
    : query === "year"
    ? now.year()
    : now.year(); // fallback if both are missing

  if (isNaN(year) || year < 1900 || year > 2100) {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message: "Invalid year provided.",
      })
    );
  }

  const isCurrentYear = year === now.year();
  const limitMonth = isCurrentYear ? now.month() + 1 : 12;

  const monthlyData = Array.from({ length: limitMonth }, (_, i) => ({
    month: monthNames[i],
    samEarning: 0,
    joseEarning: 0,
  }));

  const startDate = dayjs(`${year}-01-01`).startOf("month").toDate();
  const endDate = isCurrentYear
    ? now.endOf("month").toDate()
    : dayjs(`${year}-12-31`).endOf("month").toDate();

  const orders = await Order.find({
    date: { $gte: startDate, $lte: endDate },
  });

  for (const order of orders) {
    const monthIndex = new Date(order.date).getMonth();
    if (monthIndex < limitMonth) {
      monthlyData[monthIndex].samEarning += order.samStockPrice || 0;
      monthlyData[monthIndex].joseEarning += order.joseStockPrice || 0;
    }
  }

  const formattedData = monthlyData.map((item) => ({
    ...item,
    samEarning: +item.samEarning.toFixed(2),
    joseEarning: +item.joseEarning.toFixed(2),
    totalEarning: +(item.samEarning + item.joseEarning).toFixed(2),
  }));

  return res.status(200).json({
    success: true,
    message: `Earnings for year ${year} fetched successfully.`,
    data: formattedData,
  });
});

// =============================================
// 3. Total Expense Details
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
  let joseExpense = 0;

  expenseAggregation.forEach((entry) => {
    if (entry._id === "Sam") samExpense = entry.totalAmount;
    if (entry._id === "Jose") joseExpense = entry.totalAmount;
  });

  const totalExpenses = samExpense + joseExpense;

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Total expenses fetched successfully.",
      data: {
        samExpense,
        joseExpense,
        totalExpenses,
      },
    })
  );
});

// =============================================
// 4. Monthly Expenses (Jan - Dec for given year)
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
