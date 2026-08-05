import warrantyModel from "../models/warranty.model.js";
import userService from "../services/user.service.js";
import { sendSuccessResponse } from "../utils/ApiMessage.js";
import catchAsync from "../utils/catchAsync.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import httpStatus from "http-status";

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await userService.deleteUser(userId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

const createCart = catchAsync(async (req, res) => {
  console.log("req.body", req.body);
  const { userId, items } = req.body;
  const data = await userService.createCart(userId, items);
  console.log("data", data);
  sendSuccessResponse(res, "create", data);
});

const getCartByUserId = catchAsync(async (req, res) => {
  const data = await userService.getCartByUserId(req.params.userId);
  sendSuccessResponse(res, "get", data);
});

const updateCartItems = catchAsync(async (req, res) => {
  const data = await userService.updateCartItems(
    req.params.cartId,
    req.body.items
  );
  sendSuccessResponse(res, "update", data);
});

const deleteCartItems = catchAsync(async (req, res) => {
  const { cartId, cartItemId } = req.params;

  const data = await userService.deleteCartItems(cartId, cartItemId);

  sendSuccessResponse(res, "delete", data);
});

const updateCartStatus = catchAsync(async (req, res) => {
  const data = await userService.updateCartStatus(req.params.cartId);
  sendSuccessResponse(res, "update", data);
});

const createWishlist = catchAsync(async (req, res) => {
  const { userId, productId } = req.body;

  console.log("req.body", req.body);
  const data = await userService.createWishlist(userId, [productId]);
  sendSuccessResponse(res, "create", data);
});

const deleteWishlistProduct = catchAsync(async (req, res) => {
  const { userId, deleteProductId } = req.body;

  // ✅ HARD VALIDATION
  if (!userId || !deleteProductId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "userId and deleteProductId are required"
    );
  }

  const data = await userService.deleteWishlistProduct(
    userId,
    [deleteProductId] // ✅ ALWAYS ARRAY
  );

  sendSuccessResponse(res, "update", data);
});

const getWishlist = catchAsync(async (req, res) => {
  const { userId } = req.params;
  console.log("userIds", userId);
  const data = await userService.getWishlist(userId);
  sendSuccessResponse(res, "get", data);
});

const deleteWishlist = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const data = await userService.deleteWishlist(userId);
  sendSuccessResponse(res, "delete", data);
});

const getOrderListByUser = catchAsync(async (req, res) => {
  const { status } = req.query;
  const { userId } = req.params;
  const orderList = await userService.getOrderListByUser(userId, status);
  sendSuccessResponse(res, "get", orderList);
});

const createFeedback = catchAsync(async (req, res) => {
  const feedbackData = await userService.createFeedback(req.body);
  sendSuccessResponse(res, "create", feedbackData);
});

const addShippingAddress = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const addShippingAddress = await userService.addShippingAddress(
    userId,
    req.body
  );
  sendSuccessResponse(res, "create", addShippingAddress);
});

const updatePrimaryAddress = catchAsync(async (req, res) => {
  const { userId, addressId } = req.params;
  const updateAddress = await userService.updatePrimaryAddress(
    userId,
    addressId
  );
  sendSuccessResponse(res, "update", updateAddress);
});

const updateShippingAddress = catchAsync(async (req, res) => {
  const { userId, addressId } = req.params;
  const updatePrimaryAddress = await userService.updateShippingAddress(
    userId,
    addressId,
    req.body
  );
  sendSuccessResponse(res, "update", updatePrimaryAddress);
});

const deleteShippingAddress = catchAsync(async (req, res) => {
  const { userId, addressId } = req.params;
  const updatePrimaryAddress = await userService.deleteShippingAddress(
    userId,
    addressId
  );
  sendSuccessResponse(res, "delete", updatePrimaryAddress);
});

const getFeedbacks = catchAsync(async (req, res) => {
  const feedbackData = await userService.getFeedbacks(req.body);
  sendSuccessResponse(res, "get", feedbackData);
});

const getOrderByUserId = catchAsync(async (req, res) => {
  const orderData = await userService.getOrderByUserId(req.params.userId);
  sendSuccessResponse(res, "get", orderData);
});

const getOrderByOrderId = catchAsync(async (req, res) => {
  const orderData = await userService.getOrderByOrderId(req.params.orderId);
  sendSuccessResponse(res, "get", orderData);
});

const getUserAddressById = catchAsync(async (req, res) => {
  const userData = await userService.getUserAddressById(req.params.userId);
  sendSuccessResponse(res, "get", userData);
});

const updateFeedback = catchAsync(async (req, res) => {
  const feedbackData = await userService.updateFeedback(
    req.params.id,
    req.body
  );
  sendSuccessResponse(res, "update", feedbackData);
});

const deleteFeedback = catchAsync(async (req, res) => {
  const feedbackData = await userService.deleteFeedback(req.params.id);
  sendSuccessResponse(res, "delete", feedbackData);
});

const createOrder = catchAsync(async (req, res) => {
  const { userId, shippingAddressId, paymentMethod, cartId } = req.body;
  const order = await userService.createOrder(
    userId,
    shippingAddressId,
    paymentMethod,
    cartId
  );
  sendSuccessResponse(res, "create", order);
});

const orderStatusChange = catchAsync(async (req, res) => {
  const { status } = req.query;
  const order = await userService.orderStatusChange(
    req.params.userId,
    req.params.orderId,
    status
  );
  sendSuccessResponse(res, "update", order);
});

const getOrderReceipt = catchAsync(async (req, res) => {
  const { status } = req.query;
  const order = await userService.getOrderReceipt(
    req.params.userId,
    req.params.orderId
  );
  sendSuccessResponse(res, "get", order);
});

const getProducts = catchAsync(async (req, res) => {
  // ✅ Product list can be cached
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");

  const product = await userService.getProducts(req.query);

  sendSuccessResponse(res, "get", product);
});

const getProductsById = catchAsync(async (req, res) => {
  const { productId } = req.params;
  console.log("Product ID received in backend:", productId);
  console.log("Type of Product ID:", typeof productId);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid Product ID" });
  }

  const product = await userService.getProductsById(productId);

  if (!product) {
    return res
      .status(404)
      .json({ status: "fail", message: "Product not found" });
  }

  sendSuccessResponse(res, "get", product);
});

const getCategories = catchAsync(async (req, res) => {
  // ✅ Categories can be cached
  res.set("Cache-Control", "public, max-age=600, stale-while-revalidate=86400");

  const categories = await userService.getCategories(req.query);

  sendSuccessResponse(res, "get", categories);
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await userService.createRazorpayOrderService(amount);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOrderSummaryHandler = async (req, res) => {
  try {
    console.log("req.body", req.body);

    const { userId } = req.body || {};

    if (
      !userId ||
      typeof userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(userId.trim())
    ) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // ✅ Validate frontend orderItems
    if (
      !Array.isArray(req.body.orderItems) ||
      req.body.orderItems.length === 0
    ) {
      return res.status(400).json({
        message: "Order items are required from frontend",
      });
    }

    // ✅ Validate frontend priceDetails
    if (!req.body.priceDetails || typeof req.body.priceDetails !== "object") {
      return res.status(400).json({
        message: "Price details are required from frontend",
      });
    }

    const response = await userService.createOrderSummary({
      userId: userId.trim(),

      customerDetails: req.body.customerDetails,
      shippingAddress: req.body.shippingAddress,
      deliveryDetails: req.body.deliveryDetails,

      // ✅ Payment
      paymentMethod: req.body.paymentMethod,

      // ✅ IMPORTANT: frontend calculated order data
      orderItems: req.body.orderItems,
      totalPrice: req.body.totalPrice,
      finalAmount: req.body.finalAmount,
      priceDetails: req.body.priceDetails,
      giftPackaging: req.body.giftPackaging,
      coupon: req.body.coupon,

      // ✅ Razorpay
      razorpay_order_id: req.body.razorpay_order_id,
      razorpay_payment_id: req.body.razorpay_payment_id,
      razorpay_signature: req.body.razorpay_signature,
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: response,
    });
  } catch (error) {
    console.error("Order Error:", error);

    const msg = (error?.message || "").toString();

    if (
      msg.startsWith("Invalid Razorpay signature") ||
      msg.startsWith("Missing Razorpay")
    ) {
      return res.status(400).json({ message: msg });
    }

    if (
      msg.startsWith("Cart is empty") ||
      msg.startsWith("Invalid userId") ||
      msg.startsWith("Order items are required") ||
      msg.startsWith("Price details are required")
    ) {
      return res.status(400).json({ message: msg });
    }

    return res.status(500).json({
      message: "Order failed",
      error: msg,
    });
  }
};

export const getOrderSummaryById = async (req, res) => {
  const orderId = req.params.id;
  const order = await userService.getOrderSummaryById(orderId);
  sendSuccessResponse(res, "get", order);
};

const updateOrderSummaryByIdHandler = async (req, res) => {
  try {
    const order = await userService.updateOrderSummaryById(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteOrderSummaryByIdHandler = async (req, res) => {
  try {
    const order = await userService.deleteOrderSummaryById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: order,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  const orders = await userService.getOrdersByUser(userId);
  sendSuccessResponse(res, "get", orders);
};

const getAllOrders = async (req, res) => {
  const orders = await userService.getAllOrders();
  sendSuccessResponse(res, "get", orders);
};

const createContact = async (req, res) => {
  try {
    const { name, email, subject, phone, message } = req.body;

    if (!name || !email || !subject || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contactData = { name, email, subject, phone, message };
    const contact = await userService.saveContact(contactData);

    res
      .status(201)
      .json({ message: "Contact message sent successfully", contact });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await userService.getAllContacts();
    res.status(200).json({ contacts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const getContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await userService.getContactById(id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.status(200).json({ contact });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const createWarranty = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { productName, productColor, warrantyNumber, userId } = req.body;

    if (!productName || !productColor || !warrantyNumber || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const warranty = await userService.createWarranty({
      productName,
      productColor,
      warrantyNumber,
      userId,
    });

    return res.status(201).json({
      message: "Warranty created successfully",
      warranty,
    });
  } catch (error) {
    console.error("Error creating warranty:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getWarrantiesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const warranties = await getWarrantiesByUserService(userId);

    return res.status(200).json({
      message: "Warranties fetched successfully.",
      data: warranties,
    });
  } catch (error) {
    console.error("Error fetching warranties:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to fetch warranties.", error: error.message });
  }
};

const getAllWarranties = async (req, res) => {
  try {
    const warranties = await userService.getAllWarranties();
    res.status(200).json({ warranties });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const getWarrantiesByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const warranties = await userService.getWarrantiesByUserId(userId);
    res.status(200).json({ success: true, data: warranties });
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ error: "Unable to fetch warranties." });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userService.getUserById(userId);

    if (!user) {
      throw new ApiError("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getCoupon = catchAsync(async (req, res) => {
  const coupon = await userService.getCoupon(req.body);
  sendSuccessResponse(res, "get", coupon);
});

const getCouponById = catchAsync(async (req, res) => {
  const coupon = await userService.getCouponById(req.params.id);
  sendSuccessResponse(res, "get", coupon);
});

const getBlog = catchAsync(async (req, res) => {
  const blog = await userService.getBlog(req.body);
  sendSuccessResponse(res, "get", blog);
});
const getAboutUsPage = catchAsync(async (req, res) => {
  const AboutUs = await userService.getAboutUsPage(req.body);
  sendSuccessResponse(res, "get", AboutUs);
});

const getAboutUsById = catchAsync(async (req, res) => {
  const AboutUs = await userService.getAboutUsById(req.params.id);
  sendSuccessResponse(res, "get", AboutUs);
});

const createComplaint = async (req, res) => {
  try {
    const { warranty, ...complaintData } = req.body;

    if (warranty) {
      const warrantyExists = await warrantyModel.findOne({
        warrantyNumber: warranty,
      });
      if (!warrantyExists) {
        return res.status(400).json({ message: "Invalid warranty number." });
      }
    }

    const complaint = await userService.createComplaint({
      ...complaintData,
      warranty,
    });
    res.status(201).json(complaint);
  } catch (error) {
    console.error("Error creating complaint:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const getAllQuickFix = async (req, res) => {
  try {
    const complaints = await adminService.getAllQuickFix();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuickFixById = async (req, res) => {
  try {
    const complaint = await adminService.getQuickFixById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuickFixByProductAndProblem = async (req, res) => {
  const { productId, problemId } = req.query; // Destructuring the query parameters

  // Log the incoming parameters for debugging purposes
  console.log("productId:", productId, "problemId:", problemId);

  // Check if both productId and problemId are provided
  if (!productId || !problemId) {
    return res
      .status(400)
      .json({ message: "Both productId and problemId are required." });
  }

  try {
    // Call the service method to fetch data
    const quickFixes = await userService.getQuickFixByProductAndProblem(
      productId,
      problemId
    );

    // If no data is found, return a 404 status with a message
    if (!quickFixes || quickFixes.length === 0) {
      return res.status(404).json({
        message: "No QuickFix data found for the provided product and problem.",
      });
    }

    // Send the fetched QuickFix data in the response
    res.status(200).json({ quickFixes });
  } catch (error) {
    // Handle any errors during the process
    console.error("Error fetching QuickFix data:", error.message);
    res.status(500).json({ message: "Error fetching QuickFix data." });
  }
};

const getProblem = catchAsync(async (req, res) => {
  const data = await userService.getProblem(req.body);
  sendSuccessResponse(res, "get", data);
});

const getBrand = catchAsync(async (req, res) => {
  const brand = await userService.getBrand(req.body);
  sendSuccessResponse(res, "get", brand);
});

const getBlogContainsByBlogId = catchAsync(async (req, res) => {
  const { blogId } = req.query;
  const blog = await userService.getBlogContainsByBlogId(blogId);
  sendSuccessResponse(res, "get", blog);
});

const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const result = await userService.getProductsByCategory(categoryId);
  sendSuccessResponse(res, "get", result);
};

const getProductByNameController = async (req, res) => {
  try {
    const { title } = req.params;
    const product = await userService.getProductByNameService(title);
    res.status(200).json(product);
  } catch (error) {
    res
      .status(404)
      .json({ message: error.message || "Error fetching product" });
  }
};

const createVisitEntryController = async (req, res, next) => {
  try {
    const savedEntry = await userService.createVisitEntryService(req.body);
    res.status(201).json({
      success: true,
      message: "Influencer visit registered successfully.",
      data: savedEntry,
    });
  } catch (error) {
    next(error);
  }
};

const createCodes = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const codes = await userService.generateProductCodes(productId, quantity);
  res.status(httpStatus.CREATED).json({
    status: true,
    message: `${quantity} codes generated successfully`,
    data: codes,
  });
});

const useCode = catchAsync(async (req, res) => {
  const { userId, code } = req.body;
  const result = await userService.validateAndUseCode(code, userId);
  res.status(httpStatus.OK).json({
    status: true,
    message: "Code redeemed successfully. 20 points awarded.",
    data: result,
  });
});

const sendOtp = catchAsync(async (req, res) => {
  const { mobileNumber } = req.body;
  const otp = await userService.generateOtp(mobileNumber);
  res.json({ status: true, message: "OTP sent successfully", otp });
});

const verifyAndApplyCode = catchAsync(async (req, res) => {
  const { mobileNumber, name, otp, barcodeData } = req.body;

  const isOtpValid = await userService.verifyOtp(mobileNumber, otp);
  if (!isOtpValid) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid or expired OTP" });
  }

  const result = await userService.applyProductCode(
    barcodeData,
    mobileNumber,
    name
  );
  res.json({ status: result.applied, message: result.message });
});

const applyCoupon = async (req, res) => {
  const { couponCode, categoryId, productId } = req.body;

  if (!couponCode) {
    return res.status(400).json({
      success: false,
      message: "Coupon code is required",
    });
  }

  try {
    const coupon = await userService.getCouponByCode(
      couponCode,
      categoryId,
      productId
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discount: coupon.amount,
      amountType: coupon.amountType,
      coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyCouponByCategory = async (req, res) => {
  try {
    const { couponCode, categoryIds } = req.body;

    const coupon = await userService.verifyCouponForCategories(
      couponCode,
      categoryIds
    );

    return res.status(200).json({
      valid: true,
      coupon,
    });
  } catch (error) {
    console.error("Coupon verification failed:", error.message);
    return res.status(400).json({
      valid: false,
      message: error.message || "Error verifying coupon",
    });
  }
};

const getCouponsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Category ID is required" });
  }

  try {
    const coupons = await userService.getCouponsByCategory(categoryId);

    if (!coupons.length) {
      return res.status(404).json({
        success: false,
        message: "No coupons found for this category",
      });
    }

    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHeroSection = catchAsync(async (req, res) => {
  const data = await userService.getHeroSection(req.body);
  res.status(httpStatus.OK).send({ data });
});

const getBanner = catchAsync(async (req, res) => {
  const blog = await userService.getBanner(req.body);
  res.status(httpStatus.OK).send({ blog });
});

const getResHeroSection = catchAsync(async (req, res) => {
  const data = await userService.getResHeroSection(req.body);
  res.status(httpStatus.OK).send({ data });
});

const search = catchAsync(async (req, res) => {
  const { q = "", limit } = req.query;
  const results = await userService.searchProductsService(q, { limit });
  res.status(httpStatus.OK).send({ results });
});

const getProductBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    // ✅ Cache public product detail API
    // ✅ Fast repeat load + browser/service worker cache support
    res.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=86400"
    );

    const product = await userService.getProductBySlugService(slug);

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const createReturnRequest = async (req, res) => {
  try {
    const result = await userService.createReturnRequestService(req.body);

    return res.status(200).json({
      success: true,
      message: "Return request created successfully",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const cancelOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const userId = req.user?._id || null;

    const order = await userService.cancelOrderService({
      orderId: id,
      userId,
      reason,
    });

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const generateInvoiceController = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const invoice = await userService.generateInvoiceService({
      orderId,

      // ✅ optional userId
      // If route has auth, it will check ownership.
      // If route has no auth, service should allow it.
      userId: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      data: invoice,
    });
  } catch (error) {
    console.error("Generate invoice error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Invoice generation failed",
    });
  }
};

const removeCartItem = async (req, res) => {
  try {
    console.log("REMOVE CART BODY:", req.body);

    const { cartId, cartItemId, productId, selectedColor } = req.body;

    if (!cartId) {
      return res.status(400).json({
        status: 400,
        message: "Cart ID is required",
        data: null,
      });
    }

    if (!cartItemId && !productId) {
      return res.status(400).json({
        status: 400,
        message: "Cart Item ID or Product ID is required",
        data: null,
      });
    }

    const data = await userService.removeCartItem({
      cartId,
      cartItemId,
      productId,
      selectedColor,
    });

    return res.status(200).json({
      status: 200,
      message: "Item removed from cart successfully",
      data,
    });
  } catch (error) {
    console.error("REMOVE CART ERROR:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Something went wrong",
      data: null,
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { cartId, cartItemId, quantity } = req.body;

    if (!cartId || !cartItemId) {
      return res.status(400).json({
        status: 400,
        message: "Cart ID or Cart Item ID missing",
        data: null,
      });
    }

    const data = await userService.updateCartItemQty({
      cartId,
      cartItemId,
      quantity,
    });

    return res.status(200).json({
      status: 200,
      message: "Cart item quantity updated successfully",
      data,
    });
  } catch (error) {
    console.error("UPDATE CART QTY ERROR:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Something went wrong",
      data: null,
    });
  }
};

const createIcarryShipmentController = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await userService.createIcarryShipmentForOrder(orderId);

    console.log("iCarry Shipment Created:", order);

    return res.status(200).json({
      success: true,
      message: "iCarry shipment created successfully",
      data: order,
    });
    console.log("iCarry Shipment Creation successfully");
  } catch (error) {
    console.error("Create iCarry Shipment Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create iCarry shipment",
    });
  }
};

const trackIcarryShipmentController = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const tracking = await userService.trackIcarryShipmentForOrder(orderId);

    return res.status(200).json({
      success: true,
      message: "iCarry shipment tracking fetched successfully",
      data: tracking,
    });
  } catch (error) {
    console.error("Track iCarry Shipment Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to track iCarry shipment",
    });
  }
};

const cancelIcarryShipmentController = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const data = await userService.cancelIcarryShipmentForOrder(orderId);

    return res.status(200).json({
      success: true,
      message: "iCarry shipment cancelled successfully",
      data,
    });
  } catch (error) {
    console.error("Cancel iCarry Shipment Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to cancel iCarry shipment",
    });
  }
};

const icarryShipmentWebhookController = async (req, res) => {
  try {
    const order = await userService.icarryShipmentWebhookService(req.body);

    return res.status(200).json({
      success: true,
      message: "iCarry webhook received successfully",
      data: order,
    });
  } catch (error) {
    console.error("iCarry Webhook Error:", error.message);

    // Important: return 200 so iCarry does not keep retrying again and again
    return res.status(200).json({
      success: false,
      message: error.message || "Webhook received but order update failed",
    });
  }
};

export default {
  deleteUser,
  createCart,
  updateShippingAddress,
  updatePrimaryAddress,
  getCartByUserId,
  updateCartItems,
  deleteCartItems,
  updateCartStatus,
  createWishlist,
  deleteWishlistProduct,
  getWishlist,
  deleteWishlist,
  getOrderListByUser,
  createFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
  addShippingAddress,
  createVisitEntryController,
  getUserAddressById,
  deleteShippingAddress,
  createOrder,
  getOrderByOrderId,
  getOrderByUserId,
  orderStatusChange,
  getOrderReceipt,
  getProducts,
  getProductsById,
  getCategories,
  createOrderSummaryHandler,
  getOrderSummaryById,
  updateOrderSummaryByIdHandler,
  deleteOrderSummaryByIdHandler,
  getOrdersByUserId,
  getAllOrders,
  createContact,
  getContacts,
  getContact,
  createWarranty,
  getAllWarranties,
  getWarrantiesByUserId,
  getUserById,
  getCoupon,
  getCouponById,
  getBlog,
  getAboutUsPage,
  getAboutUsById,
  createWarranty,
  createComplaint,
  getAllQuickFix,
  getQuickFixById,
  getQuickFixByProductAndProblem,
  getProblem,
  getBrand,
  getBlogContainsByBlogId,
  getProductsByCategory,
  createRazorpayOrder,
  getProductByNameController,
  createReturnRequest,
  createCodes,
  useCode,
  sendOtp,
  verifyAndApplyCode,
  applyCoupon,
  getCouponsByCategory,
  getHeroSection,
  getBanner,
  getResHeroSection,
  verifyCouponByCategory,
  search,
  getProductBySlugController,
  cancelOrderController,
  generateInvoiceController,
  removeCartItem,
  updateCartItemQty,
  createIcarryShipmentController,
  trackIcarryShipmentController,
  cancelIcarryShipmentController,
  icarryShipmentWebhookController,
};
