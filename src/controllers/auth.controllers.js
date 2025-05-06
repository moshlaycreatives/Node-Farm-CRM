import { User } from "../models/user.model.js";
import { ForgotPassword } from "../models/forgotPassword.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { sendMail } from "../utils/sendEmail.util.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnAuthorizedException,
  UnProcessableException,
} from "../errors/index.js";

// ==============================================
// 2. Login
// ==============================================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException("User not found.");
  }

  if (user.block) {
    throw new BadRequestException("User is blocked.");
  }

  const forgotPasswordCheck = await ForgotPassword.findOne({ email });
  if (forgotPasswordCheck) {
    throw new UnProcessableException("Please reset your password.");
  }

  if (!(await user.comparePassword(password))) {
    throw new UnAuthorizedException("Invalid Password.");
  }

  const token = await user.createJWT();
  const userDetails = await User.findById(user._id).select(
    "-password -createdAt -updatedAt"
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "login successfull.",
      token,
      data: userDetails,
    })
  );
});

// ==============================================
// 3. Forgot Password
// ==============================================
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException("User not found.");
  }

  await ForgotPassword.findOneAndDelete({ email });

  const otp = generateOTP();
  await ForgotPassword.create({ email, otp });

  await sendMail({
    to: email,
    subject: "Forgot Password OTP",
    html: `Your forgot password otp is ${otp}`,
  });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "OTP has been sent to your email.",
    })
  );
});

// ==============================================
// 3. OTP Verfication
// ==============================================
export const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundException("Invalid email address.");
  }

  const isOtpExists = await ForgotPassword.findOne({ email });

  if (!isOtpExists) {
    throw new UnProcessableException("Forgot password step is missing.");
  }

  if (isOtpExists.expiresAt < Date.now()) {
    throw new UnProcessableException("OTP has been expired.");
  }

  if (!(await isOtpExists.compareOTP(otp))) {
    throw new BadRequestException("Invalid OTP.");
  }

  isOtpExists.otp_verified = true;
  await isOtpExists.save();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "OTP has been verified successfully.",
    })
  );
});

// ==============================================
// 4. Reset Passwrod
// ==============================================
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundException("Invalid email address.");
  }

  const isEmailAbleToResetPassword = await ForgotPassword.findOne({ email });

  if (!isEmailAbleToResetPassword) {
    throw new UnProcessableException("Forgot password step is missing.");
  }

  if (!isEmailAbleToResetPassword.otp_verified) {
    throw new UnProcessableException("Please first verify OTP.");
  }

  await ForgotPassword.findOneAndDelete({ email });

  user.password = newPassword;
  await user.save();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Password reset successfully.",
    })
  );
});

// ==============================================
// 5. Block User
// ==============================================
export const manageUserBlock = asyncHandler(async (req, res) => {
  const findUser = await User.findOne({ _id: req.params.id });

  if (!findUser) {
    throw new NotFoundException("User not found.");
  }

  findUser.block = !findUser.block;

  await findUser.save();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: findUser.block
        ? "User blocked successfully."
        : "User unblocked successfully.",
    })
  );
});

// ==============================================
// 6. Get All Users
// ==============================================
export const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({ role: { $ne: "admin" } });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allUsers.length > 0
          ? "Users fetched successfully."
          : "There is no any user register.",
      data: allUsers,
    })
  );
});

// ==============================================
// 7. Get User
// ==============================================
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (!user) {
    throw new NotFoundException("User not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "User fetched successfully.",
      data: user,
    })
  );
});

// ==============================================
// * Helping Function : Generate OTP
// ==============================================
function generateOTP() {
  const otp = Math.floor(Math.random() * 1000000);
  return otp.toString().padStart(6, "0");
}
