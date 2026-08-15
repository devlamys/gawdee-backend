import authService from "../services/auth.service.js";
import tokenService from "../services/token.service.js";
import userService from "../services/user.service.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status" ;

const registerUser = catchAsync(async (req, res) => {
  const user = await authService.createNewUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const registerAdmin = catchAsync(async (req, res) => {
  const user = await authService.createAdmin(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await authService.updateUser(req.params?.userId,req.body);
  res.status(httpStatus.OK).send({ user });
});

const getRewardStatus = async (req, res) => {
  const hasClaimed = await authService.checkRewardStatus(req.user.id);
  res.json({ hasClaimed });
};

const claimReward = async (req, res) => {
  try {
    const reward = await authService.claimReward(req.user.id);
    res.json({ success: true, reward });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const loginUser = catchAsync(async (req, res) => {
  const {email,password} = req.body
  const user = await authService.loginUser(email,password);
  res.status(httpStatus.OK).send({ user });
});

const loginAdmin = catchAsync(async (req, res) => {
  const {email,password} = req.body
  const user = await authService.loginAdmin(email,password);
  res.status(httpStatus.OK).send({ user });
});

const getReferPrice = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const referPrice = await authService.getReferralPrice(userId); 
    res.status(httpStatus.OK).send({ success: true, referPrice });
  } catch (error) {
    next(error);
  }
};

const updateReferPrice = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (amount === undefined) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Amount is required',
      });
    }

    const updatedReferPrice = await authService.updateReferPrice(userId, amount);

    res.status(httpStatus.OK).json({
      success: true,
      referPrice: updatedReferPrice,
    });
  } catch (error) {
    next(error);
  }
};
const getAllUsers = async (req, res, next) => {
  const users = await authService.getAllUsers(req.body);
  res.status(httpStatus.OK).send({ users });
};


const sendOtp = async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const { mobileNumber } = req.body;
    const response = await authService.sendOtp(mobileNumber);
    console.log('response', response);
    const statusCode = response?.success ? 200 : 400;
    res?.status(statusCode).json(response);
  } catch (error) {
    console.error("Error in sendOtp Controller:", error.message);
    res?.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || mobileNumber.length !== 10 || !otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. Mobile number and OTP are required.",
      });
    }

    const response = await authService.verifyOtp(mobileNumber, otp);
    res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    next(error);
  }
};
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const updatedOrder = await authService.updatePaymentStatusService(orderId, paymentStatus);

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}.`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error.',
    });
  }
};


const updateAdmin = catchAsync(async (req, res) => {
  const adminId = req.user._id;
  const updatedAdmin = await authService.updateAdminProfile(adminId, req.body);
  res.status(200).json({ success: true, data: updatedAdmin });
});

const getAdminProfile = async (req, res) => {
  try {
    const admin = await authService.getAdminProfileService();
    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch admin profile" });
  }
};


export default {registerUser,registerAdmin,loginUser,loginAdmin,updateUser, getReferPrice, updateReferPrice, sendOtp, verifyOtp, updatePaymentStatus, getAllUsers, updateAdmin, getAdminProfile,
  getRewardStatus, claimReward,
}