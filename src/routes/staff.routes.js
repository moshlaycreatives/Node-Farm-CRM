import { Router } from "express";
import { requiredFields, trimBodyObject } from "../middlewares/index.js";
import {
  addStaff,
  deleteStaffMemberById,
  getAllStaff,
  getStaffMemberById,
  searchStaff,
  updateStaffMemberById,
} from "../controllers/staff.controllers.js";

const staffRouter = Router();

// ========================================
// 1. Add + Get All - Staff
// ========================================
staffRouter
  .route("/")
  .post(
    trimBodyObject,
    requiredFields(["fullName", "gender", "role", "phone"]),
    addStaff
  )
  .get(getAllStaff);

// ========================================
// 2. Get + Update + Delete - Staff
// ========================================
staffRouter
  .route("/:id")
  .get(getStaffMemberById)
  .put(
    trimBodyObject,
    requiredFields(["fullName", "gender", "role", "phone"]),
    updateStaffMemberById
  )
  .delete(deleteStaffMemberById);

// ========================================
// 3. Search Staff
// ========================================
staffRouter.route("/search").get(searchStaff);
export { staffRouter };
