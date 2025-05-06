import { NotFoundException } from "../errors/index.js";

// ================================================
// * Middleware : Check Required Fields
// ================================================
export const requiredFields = (requiredFields) => (req, res, next) => {
  const missingFields = [];

  const isEmpty = (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (Array.isArray(value) && value.length === 0)
    );
  };

  const checkField = (fieldPath, obj) => {
    const keys = fieldPath.split(".");
    let current = obj;

    for (const key of keys) {
      if (!current || current[key] === undefined || current[key] === null) {
        missingFields.push(fieldPath);
        return;
      }
      current = current[key];
    }

    if (isEmpty(current)) {
      missingFields.push(fieldPath);
    }
  };

  for (const field of requiredFields) {
    checkField(field, req.body);
  }

  if (missingFields.length > 0) {
    if (missingFields.length > 1) {
      missingFields[missingFields.length - 1] = `and ${
        missingFields[missingFields.length - 1]
      }`;
    }

    throw new NotFoundException(`Please provide ${missingFields.join(", ")}`);
  } else {
    next();
  }
};

// ================================================
// * Sample How To Pass Data
// ================================================
/*
checkRequiredFields([
  "companyName",
  "clientName",
  "date",
  "order.products",
])
*/
