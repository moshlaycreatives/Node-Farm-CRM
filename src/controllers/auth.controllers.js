import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { NotFoundException, UnAuthorizedException } from "../errors/index.js";

// ==============================================
// 2. Login
// ==============================================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException("User not found.");
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
