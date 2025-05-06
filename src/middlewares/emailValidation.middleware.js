import { BadRequestException } from "../errors/index.js";

// ================================================
// * Middleware : Email Validator
// ================================================
export const emailValidator = async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(req.body.email)) {
    throw new BadRequestException("Invalid email formate");
  }

  next();
};
