import { ApiResponce } from "./apiResponce.util.js";

// export const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json(
//       new ApiResponce({
//         statusCode: error.code || 500,
//         message: error.message,
//         ...error,
//       })
//     );
//   }
// };

export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error(error);
    const statusCode =
      typeof error.code === "number" && error.code >= 100 && error.code < 600
        ? error.code
        : 500;

    res.status(statusCode).json(
      new ApiResponce({
        statusCode,
        message: error.message || "Internal Server Error",
        ...error,
      })
    );
  }
};
