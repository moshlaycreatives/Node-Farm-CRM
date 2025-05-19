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
        totalShyamalStock: { $sum: "$shyamalStock" },
        totalPatelStock: { $sum: "$patelStock" },
      },
    },
  ]);

  const totalStock =
    stockAggregation.length > 0
      ? stockAggregation[0].totalShyamalStock +
        stockAggregation[0].totalPatelStock
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

  let shyamalExpense = 0;
  let patelExpense = 0;

  expenseAggregation.forEach((entry) => {
    if (entry._id === "Shyamal") shyamalExpense = entry.totalAmount;
    if (entry._id === "Patel") patelExpense = entry.totalAmount;
  });

  const totalExpenses = shyamalExpense + patelExpense;

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Total expenses fetched successfully.",
      data: {
        shyamalExpense,
        patelExpense,
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

// ===========================================
// 4. Earnings Controller (Just Sum of Prices)
// ===========================================
// export const getEarnings = asyncHandler(async (req, res) => {
//   const { query } = req.query;

//   if (!query) {
//     return res.status(400).json(
//       new ApiResponce({
//         statusCode: 400,
//         message:
//           "Query parameter is required (week, month, year, or specific year).",
//       })
//     );
//   }

//   let startDate, endDate;
//   const now = dayjs();

//   if (query.toLowerCase() === "week") {
//     startDate = now.startOf("week").toDate();
//     endDate = now.endOf("week").toDate();
//   } else if (query.toLowerCase() === "month") {
//     startDate = now.startOf("month").toDate();
//     endDate = now.endOf("month").toDate();
//   } else if (query.toLowerCase() === "year") {
//     startDate = now.startOf("year").toDate();
//     endDate = now.endOf("year").toDate();
//   } else if (/^\d{4}$/.test(query)) {
//     const year = parseInt(query);
//     startDate = dayjs(`${year}-01-01`).startOf("year").toDate();
//     endDate = dayjs(`${year}-12-31`).endOf("year").toDate();
//   } else {
//     return res.status(400).json(
//       new ApiResponce({
//         statusCode: 400,
//         message: "Invalid query parameter.",
//       })
//     );
//   }

//   const orders = await Order.find({
//     createdAt: { $gte: startDate, $lte: endDate },
//   });

//   let shyamalEarning = 0;
//   let patelEarning = 0;

//   for (const order of orders) {
//     shyamalEarning += order.shyamalStockPrice || 0;
//     patelEarning += order.patelStockPrice || 0;
//   }

//   let value;
//   if (query === "month") {
//     const monthNames = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];

//     value = monthNames[new Date().getMonth()];
//   } else if (query === "year") {
//     value = new Date().getFullYear();
//   }

//   return res.status(200).json(
//     new ApiResponce({
//       statusCode: 200,
//       message: "Earnings fetched successfully.",
//       data:
//         query === "month"
//           ? {
//               [query]: value,
//               shyamalEarning,
//               patelEarning,
//             }
//           : query === "year"
//           ? {
//               [query]: value,
//               shyamalEarning,
//               patelEarning,
//             }
//           : query === "week"
//           ? {
//               query,
//               shyamalEarning,
//               patelEarning,
//             }
//           : {
//               year: query,

//               shyamalEarning,
//               patelEarning,
//             },
//     })
//   );
// });

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
      shyamalEarning: 0,
      patelEarning: 0,
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
        monthlyData[monthIndex].shyamalEarning += order.shyamalStockPrice || 0;
        monthlyData[monthIndex].patelEarning += order.patelStockPrice || 0;
      }
    }

    // Add totalEarning to each month object
    const formattedData = monthlyData.map((item) => ({
      ...item,
      shyamalEarning: +item.shyamalEarning.toFixed(2),
      patelEarning: +item.patelEarning.toFixed(2),
      totalEarning: +(item.shyamalEarning + item.patelEarning).toFixed(2),
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

  let shyamalEarning = 0;
  let patelEarning = 0;

  for (const order of orders) {
    shyamalEarning += order.shyamalStockPrice || 0;
    patelEarning += order.patelStockPrice || 0;
  }

  return res.status(200).json({
    success: true,
    message: `Earnings for ${query.toLowerCase()} fetched successfully.`,
    data: [
      {
        month:
          query.toLowerCase() === "month" ? now.format("MMMM") : "This Week",
        shyamalEarning: +shyamalEarning.toFixed(2),
        patelEarning: +patelEarning.toFixed(2),
        totalEarning: +(shyamalEarning + patelEarning).toFixed(2),
      },
    ],
  });
});
