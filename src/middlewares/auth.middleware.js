import { ApiError } from "../utils/ApiError.js";
// import  asyncHandler  from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(new ApiError(401, 'No token provided'));
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET); 
    req.user = decoded;

    if (req.user.role !== 'admin') {
      return next(new ApiError(403, 'You do not have permission to access this resource'));
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token has expired'));
    } else {
      return next(new ApiError(401, 'Invalid token'));
    }
  }
};

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(new ApiError(401, 'No token provided.'));
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET);  

    req.sub = decoded;  
    const user = await User.findById(decoded.sub); 

    if (!user) {
      return next(new ApiError(404, 'User not found.'));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token has expired.'));
    } else {
      return next(new ApiError(401, 'Invalid token.'));
    }
  }
};
  
export default {authenticateAdmin,authenticateUser}  