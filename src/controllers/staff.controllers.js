import { Staff } from "../models/staff.model.js";
import { asyncHandler, ApiResponce } from "../utils/index.js";
import { NotFoundException } from "../errors/index.js";

// ===========================================
// 1. Add Staff
// ===========================================
export const addStaff = asyncHandler(async (req, res) => {
  const newEntry = await Staff.create(req.body);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Staff added successfully.",
      data: newEntry,
    })
  );
});

// ===========================================
// 2. Get All Staff (With Pagination)
// ===========================================
export const getAllStaff = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [staffList, total] = await Promise.all([
    Staff.find({}).skip(skip).limit(limit),
    Staff.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        staffList.length > 0
          ? "Staff collection feteched successfully."
          : "Staff collection is empty.",
      data: {
        staff: staffList,
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
// 3. Get Staff Member By Id
// ===========================================
export const getStaffMemberById = asyncHandler(async (req, res) => {
  const staffMember = await Staff.findOne({ _id: req.params.id });

  if (!staffMember) {
    throw new NotFoundException("Staff member not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Staff member feteched successfully.",
      data: staffMember,
    })
  );
});

// ===========================================
// 4. Update Staff Member By Id
// ===========================================
export const updateStaffMemberById = asyncHandler(async (req, res) => {
  const staffMember = await Staff.findOne({ _id: req.params.id });

  if (!staffMember) {
    throw new NotFoundException("Staff member not found.");
  }

  const updatedStaffMember = await Staff.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Staff member updated successfully.",
      data: updatedStaffMember,
    })
  );
});

// ===========================================
// 5. Delete Staff Member By Id
// ===========================================
export const deleteStaffMemberById = asyncHandler(async (req, res) => {
  const staffMember = await Staff.findOne({ _id: req.params.id });

  if (!staffMember) {
    throw new NotFoundException("Staff member not found.");
  }

  await Staff.findOneAndDelete({ _id: req.params.id });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Staff member deleted successfully.",
    })
  );
});

// ===================================================
// 6. Search Staff (case-insensitive, paginated)
// ===================================================
export const searchStaff = asyncHandler(async (req, res) => {
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
      { staffId: isNaN(numericQuery) ? null : numericQuery },
      { fullName: { $regex: searchRegex } },
      { gender: { $regex: searchRegex } },
      { role: { $regex: searchRegex } },
      { phone: { $regex: searchRegex } },
    ],
  };

  const [results, total] = await Promise.all([
    Staff.find(searchConditions).skip(skip).limit(limit),
    Staff.countDocuments(searchConditions),
  ]);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        results.length > 0
          ? "Staff search results fetched successfully."
          : "No matching staff found.",
      data: {
        staff: results,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
    })
  );
});
