import { ForbiddenException } from "../errors/index.js";

// ================================================
// * Middleware : Admin Auth
// ================================================
export const adminAuth = async (req, res, next) => {
  if (req.userRole !== "admin") {
    console.error("Invalid role.");
    throw new ForbiddenException("Invalid role");
  }

  next();
};
