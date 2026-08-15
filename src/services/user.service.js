import { ApiError } from "../utils/ApiError.js";
import httpStatus from "http-status";
import WishList from "../models/wishList.model.js";
import { Types } from "mongoose";
import Order from "../models/order.model.js";
import orderStatus from "../config/orderStatus.js";
import Category from "../models/category.model.js";
import OrderSummary from "../models/orderSummary.model.js";
import Contact from "../models/contactUs.model.js";
import Warranty from "../models/warranty.model.js";
import Coupon from "../models/coupon.model.js";
import BlogPost from "../models/blog.model.js";
import { AboutUs } from "../models/aboutUs.model.js";
import { User } from "../models/user.model.js";
import Review from "../models/review.model.js";
import Cart from "../models/cart.model.js";
import Complaint from "../models/complaint.model.js";
import QuickFix from "../models/subCategory.model.js";
import Problem from "../models/collection.model.js";
import Brand from "../models/brand.model.js";
import BlogDetails from "../models/blogContent.model.js";
import Product from "../models/product.model.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import path from "path";
import crypto from "crypto";
import InfluencerVisit from "../models/infulancer.model.js";
import Code from "../models/code.model.js";
import HeroSection from "../models/heroSection.model.js";
import Banner from "../models/banner.model.js";
import { sendOrderConfirmation } from "../utils/confirm_order.js";
import mongoose from "mongoose";
import ReturnRequest from "../models/requestReturn.model.js";
import Invoice from "../models/invoice.model.js";
import { sendOrderWhatsapp } from "../utils/sendOrderWhatsapp.js";
import { sendPaymentInvoiceWhatsapp } from "../utils/sendPaymentInvoice.js";
import { sendShippingWhatsapp } from "../utils/sendShippingWhatsapp.js";
import { sendReturnRequestWhatsapp } from "../utils/sendReturnRequestWhatsapp.js";
import catchAsync from "../utils/catchAsync.js";
import {
  createIcarryShipment,
  trackIcarryShipment,
  cancelIcarryShipment,
} from "./icarry.service.js";
import { sendOrderCancelledWhatsapp } from "../utils/OrderWhatsapp.js";

dotenv.config({ path: path.resolve(process.cwd(), "config.env") });

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummysecret",
});

const sendOrderStatusSideEffects = async (oldOrder, updatedOrder) => {
  const oldStatus = oldOrder.orderStatus;
  const newStatus = updatedOrder.orderStatus;

  const phone = updatedOrder.customerDetails?.phone;
  if (!phone) return;

  // ================= SHIPPED =================
  if (oldStatus !== "Shipped" && newStatus === "Shipped") {
    try {
      const trackingUrl =
        updatedOrder.trackingUrl ||
        getIcarryTrackingUrlFromPayload(updatedOrder.shippingResponse);

      if (trackingUrl) {
        await sendShippingWhatsapp({
          to: phone,
          customerName:
            updatedOrder.customerDetails?.firstName ||
            updatedOrder.customerDetails?.name ||
            "Customer",
          orderId: updatedOrder.orderId,
          trackingId: updatedOrder.awbNumber || updatedOrder.shipmentId,
          trackingUrl,
        });

        await OrderSummary.findByIdAndUpdate(updatedOrder._id, {
          $set: {
            shippingWhatsappSent: true,
            shippingWhatsappSentAt: new Date(),
          },
        });
      }
    } catch (err) {
      console.error("Shipping WhatsApp Error:", err.message);
    }
  }

  // ================= DELIVERED =================
  if (oldStatus !== "Delivered" && newStatus === "Delivered") {
    try {
      await sendOrderWhatsapp({
        to: phone,
        customerName:
          updatedOrder.customerDetails?.firstName ||
          updatedOrder.customerDetails?.name ||
          "Customer",
        orderId: updatedOrder.orderId,
        messageType: "delivered",
      });
    } catch (err) {
      console.error("Delivered WhatsApp Error:", err.message);
    }
  }

  // ================= CANCELLED =================
  if (oldStatus !== "Cancelled" && newStatus === "Cancelled") {
    try {
      await sendOrderWhatsapp({
        to: phone,
        customerName:
          updatedOrder.customerDetails?.firstName ||
          updatedOrder.customerDetails?.name ||
          "Customer",
        orderId: updatedOrder.orderId,
        messageType: "cancelled",
      });
    } catch (err) {
      console.error("Cancelled WhatsApp Error:", err.message);
    }
  }
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByName = async (username) => {
  return User.findOne({ username });
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getProductById = async (id) => {
  return Product.findById(id).select("-password");
};

const deleteUser = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required!");
  }

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found or already deleted"
    );
  }

  return {
    message: "User deleted successfully",
    user: deletedUser,
  };
};

const pickPriceAndMRP = (productDoc, selectedColor) => {
  const key = (selectedColor || "").toLowerCase();
  const variant = (productDoc.productImages || []).find(
    (v) => (v.color || "").toLowerCase() === key
  );

  const price = Number(variant?.price ?? productDoc.price ?? 0);

  // Prefer variant.mrp, then product.mrp, then product.maxPrice, else price
  const mrp = Number(
    variant?.mrp ?? productDoc.mrp ?? productDoc.maxPrice ?? price
  );

  return { price, mrp };
};

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const calculateCartTotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);
};

const findSelectedVariant = (product, selectedColor) => {
  const keyColor = normalizeText(selectedColor);

  if (!keyColor) return null;

  return (product.productImages || []).find((variant) => {
    return (
      normalizeText(variant.color) === keyColor ||
      normalizeText(variant.name) === keyColor ||
      normalizeText(variant.size) === keyColor ||
      normalizeText(variant.weight) === keyColor ||
      normalizeText(variant.title) === keyColor ||
      normalizeText(variant.value) === keyColor
    );
  });
};

const createCart = async (userId, items) => {
  const user = await User.findById(userId).select("_id").lean();

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart items are required");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [],
      totalPrice: 0,
    });
  }

  const productIds = [
    ...new Set(
      items
        .filter((item) => item.productId)
        .map((item) => String(item.productId))
    ),
  ];

  const products = await Product.find({ _id: { $in: productIds } })
    .select("_id title name price salePrice mrp maxPrice productImages")
    .lean();

  const productMap = new Map(
    products.map((product) => [String(product._id), product])
  );

  for (const incoming of items) {
    if (!incoming.productId) continue;

    const product = productMap.get(String(incoming.productId));

    if (!product) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product not found");
    }

    const selectedColor = incoming.selectedColor || "";

    const selectedVariant = findSelectedVariant(product, selectedColor);

    // ✅ Main fix:
    // 1. First use frontend selected variant price
    // 2. Then use selected variant sale price
    // 3. Then use selected variant price
    // 4. Then fallback to product price
    const finalPrice = Number(
      incoming.price ??
      selectedVariant?.salePrice ??
      selectedVariant?.sellingPrice ??
      selectedVariant?.price ??
      product.salePrice ??
      product.price ??
      0
    );

    const finalMrp = Number(
      incoming.mrp ??
      selectedVariant?.mrp ??
      selectedVariant?.regularPrice ??
      selectedVariant?.maxPrice ??
      product.mrp ??
      product.maxPrice ??
      finalPrice
    );

    const finalImage =
      incoming.selectedColorImage ||
      selectedVariant?.url ||
      selectedVariant?.image ||
      selectedVariant?.imageUrl ||
      "";

    if (!finalPrice) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Price not found for selected variant: ${selectedColor}`
      );
    }

    const existingItem = cart.items.find((item) => {
      return (
        String(item.productId) === String(incoming.productId) &&
        normalizeText(item.selectedColor) === normalizeText(selectedColor)
      );
    });

    if (existingItem) {
      existingItem.quantity =
        Number(existingItem.quantity || 0) + Number(incoming.quantity || 1);

      existingItem.name = product.title || product.name;
      existingItem.price = finalPrice;
      existingItem.mrp = finalMrp;
      existingItem.selectedColor = selectedColor;
      existingItem.selectedColorImage = finalImage;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.title || product.name,
        quantity: Number(incoming.quantity || 1),

        // ✅ selected variant price only
        price: finalPrice,
        mrp: finalMrp,

        selectedColor,
        selectedColorImage: finalImage,
      });
    }
  }

  cart.totalPrice = calculateCartTotal(cart.items);

  await cart.save();

  return await Cart.findById(cart._id)
    .select("items totalPrice")
    .populate({
      path: "items.productId",
      select: "title name productImages",
    })
    .lean();
};

const createOrder = async (
  userId,
  shippingAddressId,
  paymentMethod,
  cartId
) => {
  // Fetch the cart and populate product details
  const cart = await Cart.findOne({ _id: cartId, userId }).populate(
    "items.productId"
  );
  if (!cart || cart.items.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cart not found or cart is empty!"
    );
  }

  // Fetch the user
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  // Find the shipping address
  const shippingAddress = user.shippingAddress?.find(
    (address) => address._id.toString() === shippingAddressId
  );
  if (!shippingAddress) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Shipping address not found!");
  }

  // Map cart items to order items
  const orderItems = cart.items.map((data) => ({
    productId: data?.productId?._id,
    name: data?.productId?.name,
    quantity: data?.quantity,
    price: data?.price,
    selectedColor: data?.selectedColor,
    selectedColorImage: data?.selectedColorImage,
  }));

  // Calculate total price
  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.quantity * item?.price,
    0
  );

  // Calculate GST and final price
  const gst = totalPrice * 0.18;
  const finalPrice = totalPrice + gst + 100;

  // Create a new order
  const newOrder = new Order({
    userId,
    shippingAddress,
    paymentMethod,
    orderItems,
    totalPrice,
    finalPrice,
  });

  await newOrder.save();

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return newOrder;
};

const orderStatusChange = async (userId, orderId, status) => {
  const normalizedStatus = status?.trim().toLowerCase();

  if (!orderStatus.includes(normalizedStatus)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Select a valid status");
  }
  const order = await Order.findOne({ _id: orderId, userId }).sort({
    createdAt: -1,
  });

  order.status = status;
  await order.save();
  return order;
};
const getOrderReceipt = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, userId })
    .populate("orderItems.productId")
    .populate("userId", "username email");

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const receipt = {
    orderId: order._id,
    userId: order.userId._id,
    username: order.userId.username,
    email: order.userId.email,
    shippingAddress: order.shippingAddress,
    items: order?.orderItems?.map((item) => ({
      product: item?.productId._id,
      productName: item?.productId?.name,
      quantity: item?.quantity,
      price: item?.price,
      total: item?.quantity * item?.price,
    })),
    totalPrice: order.totalPrice,
    finalPrice: order.finalPrice,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
  return receipt;
};
const getOrderByOrderId = async (orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    status: { $ne: "cancelled" },
  }).populate("orderItems.productId");

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found.");
  }
  return order;
};

const getOrderByUserId = async (userId) => {
  const order = await Order.find({ userId, status: { $ne: "cancelled" } }).sort(
    { createdAt: -1 }
  );

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found.");
  }
  return order;
};

const getCartByUserId = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "user not found");

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
  });

  return cart;
};

const updateCartItems = async (cartId, items) => {
  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart not found");
  }

  if (!items || !Array.isArray(items)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Items are required");
  }

  cart.items = cart.items.filter((cartItem) => {
    const incoming = items.find((newItem) => {
      return (
        String(newItem.productId) === String(cartItem.productId) &&
        normalizeText(newItem.selectedColor) ===
        normalizeText(cartItem.selectedColor)
      );
    });

    return !incoming || Number(incoming.quantity) > 0;
  });

  const productIds = [
    ...new Set(
      items.filter((i) => i.productId).map((i) => String(i.productId))
    ),
  ];

  const products = await Product.find({ _id: { $in: productIds } })
    .select("_id title price mrp maxPrice productImages")
    .lean();

  const productMap = new Map(products.map((p) => [String(p._id), p]));

  for (const newItem of items) {
    if (!newItem.productId) continue;
    if (Number(newItem.quantity) < 1) continue;

    const product = productMap.get(String(newItem.productId));

    if (!product) continue;

    const selectedColor = newItem.selectedColor || "";

    const selectedVariant = findSelectedVariant(product, selectedColor);

    const finalPrice = Number(
      selectedVariant?.price ?? newItem.price ?? product.price ?? 0
    );

    const finalMrp = Number(
      selectedVariant?.mrp ??
      newItem.mrp ??
      product.mrp ??
      product.maxPrice ??
      finalPrice
    );

    const finalImage =
      newItem.selectedColorImage ||
      selectedVariant?.url ||
      selectedVariant?.image ||
      selectedVariant?.imageUrl ||
      "";

    if (!finalPrice) continue;

    const existingItem = cart.items.find((cartItem) => {
      return (
        String(cartItem.productId) === String(newItem.productId) &&
        normalizeText(cartItem.selectedColor) === normalizeText(selectedColor)
      );
    });

    if (existingItem) {
      existingItem.name = product.title;
      existingItem.quantity = Number(newItem.quantity || 1);
      existingItem.price = finalPrice;
      existingItem.mrp = finalMrp;
      existingItem.selectedColor = selectedColor;
      existingItem.selectedColorImage = finalImage;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.title,
        quantity: Number(newItem.quantity || 1),
        price: finalPrice,
        mrp: finalMrp,
        selectedColor,
        selectedColorImage: finalImage,
      });
    }
  }

  cart.totalPrice = calculateCartTotal(cart.items);

  await cart.save();

  return await Cart.findById(cartId)
    .select("items totalPrice")
    .populate({
      path: "items.productId",
      select: "title productImages",
    })
    .lean();
};

const deleteCartItems = async (req, res) => {
  console.log("REQ PARAMS:", req.params);

  const { cartId, cartItemId } = req.params;

  if (!cartId || !cartItemId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cart ID or Cart Item ID missing"
    );
  }

  const data = await userService.deleteCartItems(cartId, cartItemId);

  sendSuccessResponse(res, "delete", data);
};

const updateCartStatus = async (cartId) => {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new ApiError(httpStatus.BAD_REQUEST, "Cart not found");
  const updateStatus = await Cart.findByIdAndUpdate(
    cartId,
    { status: "complete" },
    { new: true }
  );

  if (!updateStatus)
    throw new ApiError(httpStatus.BAD_REQUEST, "Error in update status");

  return updateStatus;
};

const createWishlist = async (userId, productIds) => {
  for (let productId of productIds) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Invalid productId: ${productId}`
      );
    }
  }

  const productObjectIds = productIds.map((id) => new Types.ObjectId(id));

  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

  const products = await Promise.all(
    productObjectIds.map((productId) => getProductById(productId))
  );

  for (let product of products) {
    if (!product)
      throw new ApiError(httpStatus.BAD_REQUEST, `Product not found`);
  }

  let wishlist = await WishList.findOne({ userId });

  if (!wishlist) {
    wishlist = new WishList({ userId, products: productObjectIds });
  } else {
    for (let productId of productObjectIds) {
      if (!wishlist.products.some((p) => p.equals(productId))) {
        wishlist.products.push(productId);
      }
    }
  }

  await wishlist.save();

  return wishlist;
};

const deleteWishlistProduct = async (userId, removeProductIds) => {
  if (!Array.isArray(removeProductIds) || !removeProductIds.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "removeProductIds must be a non-empty array"
    );
  }

  removeProductIds.forEach((productId) => {
    if (!productId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "productId is missing");
    }

    if (!Types.ObjectId.isValid(productId)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Invalid productId: ${productId}`
      );
    }
  });

  const removeProductObjectIds = removeProductIds.map(
    (id) => new Types.ObjectId(id)
  );

  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

  const wishlist = await WishList.findOne({ userId });
  if (!wishlist)
    throw new ApiError(httpStatus.BAD_REQUEST, "Wishlist not found");

  wishlist.products = wishlist.products.filter(
    (p) => !removeProductObjectIds.some((r) => r.equals(p))
  );

  await wishlist.save();
  return wishlist;
};

const getWishlist = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

  let wishlist = await WishList.findOne({ userId }).populate("products");
  // .populate('products','name');
  console.log("wishlist", wishlist);
  if (!wishlist) {
    // throw new ApiError(httpStatus.BAD_REQUEST, `Wishlist not found`);
    return { userId, products: [] };
  }
  return wishlist;
};

const deleteWishlist = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

  let wishlist = await WishList.findOne({ userId });

  if (!wishlist) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Wishlist not found`);
  }

  await wishlist.deleteOne({ userId });

  return wishlist;
};

const getOrderListByUser = async (userId, status) => {
  console.log("userId,status", userId, status);
  const user = await getUserById(userId);

  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

  if (!status) throw new ApiError(httpStatus.NOT_FOUND, "status is required");
  console.log("status", status);
  if (status !== "complete" && status !== "incomplete") {
    throw new ApiError(httpStatus.NOT_FOUND, "Select a valid status");
  }
  const data = await Cart.find({ userId: userId, status: status });

  return data;
};

const createFeedback = async (feedbackData) => {
  if (!feedbackData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "Name is required!");
  if (!feedbackData.description)
    throw new ApiError(httpStatus.BAD_REQUEST, "Description is required!");

  return Review.create(feedbackData);
};

const addShippingAddress = async (userId, addressData) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "user not found!");
  console.log("addressData", addressData);
  console.log("usersd", user);

  user.shippingAddress.push(addressData);

  if (user?.shippingAddress.length === 1) {
    user.shippingAddress[0].isPrimary = true;
  }

  await user.save();
  return user;
};

const updateShippingAddress = async (userId, addressId, newAddress) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "user not found!");

  const addressIndex = user.shippingAddress.findIndex((address) => {
    return address._id.toString() === addressId;
  });
  console.log("addressIndex", addressIndex, newAddress);
  if (addressIndex !== -1) {
    user.shippingAddress[addressIndex] = {
      ...user.shippingAddress[addressIndex],
      ...newAddress,
    };
  } else {
    user.shippingAddress.push(newAddress);
  }
  const address = user.shippingAddress.id(addressId);
  if (address) {
    address.isPrimary = true;
  }

  await user.save();
  return user;
};
const deleteShippingAddress = async (userId, addressId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const addressIndex = user.shippingAddress.findIndex(
    (address) => address._id.toString() === addressId
  );

  if (addressIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "Address not found!");
  }
  console.log("after", user?.shippingAddress);

  user.shippingAddress.splice(addressIndex, 1);

  await user.save();

  return user;
};

const updatePrimaryAddress = async (userId, addressId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "user not found!");

  user.shippingAddress.forEach((address) => {
    address.isPrimary = false;
  });

  const address = user.shippingAddress.find((address) => {
    return address._id.toString() === addressId;
  });

  if (!address) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address not found!");
  }
  if (address) {
    address.isPrimary = true;
  }

  await user.save();
  return user;
};

const getUserAddressById = async (userId) => {
  const user = await getUserById(userId);
  return user;
};

const getFeedbacks = async () => {
  return Review.find();
};

const updateFeedback = async (id, feedbackData) => {
  const updateData = await Review.findByIdAndUpdate(id, feedbackData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  return updateData;
};

const deleteFeedback = async (id) => {
  const deleteId = await Review.findByIdAndDelete(id);
  if (deleteId === null) throw ApiError(httpStatus.NOT_FOUND, "Data not found");
  return deleteId;
};

const getImageUrl = (img, type = "listing") => {
  if (!img) return null;

  if (typeof img === "string") return img;

  if (type === "listing") {
    return (
      img?.thumb ||
      img?.thumbnail ||
      img?.small ||
      img?.medium ||
      img?.webp ||
      img?.url ||
      img?.image ||
      img?.path ||
      img?.src ||
      null
    );
  }

  return (
    img?.url ||
    img?.image ||
    img?.path ||
    img?.src ||
    img?.large ||
    img?.medium ||
    img?.thumb ||
    img?.thumbnail ||
    null
  );
};

const normalizeImages = (images = [], type = "listing") => {
  if (!Array.isArray(images)) return [];

  return images
    .filter(Boolean)
    .map((img) => getImageUrl(img, type))
    .filter(Boolean);
};

const getProductImages = (product) => {
  if (!product) return [];

  // ✅ ONLY product.images from DB
  const dbImages = normalizeImages(product.images || [], "listing");

  return dbImages.slice(0, 2);
};

const getProducts = async (query) => {
  const { page = 1, limit = 100, sortBy, filter = {} } = query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const options = {
    page: pageNumber,
    limit: limitNumber,
    sortBy,
    populate: [
      {
        path: "categoryId",
        select: "name slug",
      },
    ],
  };

  const result = await Product.paginate(filter, options);

  const currentDate = new Date();

  const products = result.results.map((productDoc) => {
    const product = productDoc.toObject ? productDoc.toObject() : productDoc;

    let finalPrice = Number(product.price || 0);
    let salePriceApplied = false;

    if (product.salePrice && Number(product.salePrice) > 0) {
      if (product.discountStart && product.discountEnd) {
        const discountStart = new Date(product.discountStart);
        const discountEnd = new Date(product.discountEnd);

        if (currentDate >= discountStart && currentDate <= discountEnd) {
          finalPrice = Number(product.salePrice);
          salePriceApplied = true;
        }
      } else {
        finalPrice = Number(product.salePrice);
        salePriceApplied = true;
      }
    }

    const originalPrice = Number(product.price || 0);

    const discount =
      originalPrice > 0 && finalPrice > 0 && finalPrice < originalPrice
        ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
        : 0;

    const images = getProductImages(product);

    const image1 = images[0] || null;
    const image2 = images[1] || images[0] || null;

    const displayWeight =
      product?.sku?.match(/\d+\s*(ml|ltr|liter|litre|l|kg|g|gm)/i)?.[0] ||
      (product?.weight && product?.weightUnit
        ? `${product.weight} ${product.weightUnit}`
        : "") ||
      (product?.variants?.[0]?.weight && product?.variants?.[0]?.weightUnit
        ? `${product.variants[0].weight} ${product.variants[0].weightUnit}`
        : "");

    return {
      _id: product._id,

      name: product.name,
      slug: product.slug,
      subTitle: product.subTitle || "",
      description: product.description || "",

      price: Math.max(Math.round(finalPrice), 0),
      originalPrice: product.price,
      salePrice: product.salePrice || null,
      salePriceApplied,
      discount,

      sku: product.sku || "",
      weight: product.weight || null,
      weightUnit: product.weightUnit || "",
      displayWeight,

      categoryId: product.categoryId,

      isActive: product.isActive,
      stockStatus: product.stockStatus,

      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      reviews: product.reviews || 0,

      // ✅ final fast image fields
      images,
      featuredImage: image1,
      image1,
      image2,
      thumbnail: image1,
      image: image1,

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  });

  return {
    success: true,
    message: "Products fetched successfully",
    products,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    totalResults: result.totalResults,
  };
};

const getProductsById = async (id) => {
  return Product.findById(id);
};

const getCategories = async () => {
  return Category.find();
};

const createRazorpayOrderService = async (amount) => {
  if (!amount || Number(amount) <= 0) {
    throw new Error("Invalid payment amount");
  }

  const order = await razorpayInstance.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  });

  return {
    key: process.env.RAZORPAY_KEY_ID,
    order,
  };
};

const verifyRazorpaySignatureService = (orderId, paymentId, signature) => {
  console.log("Loaded Secret:", process.env.RAZORPAY_KEY_SECRET);
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
};

const slugify = (text) => {
  return text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const generateOrderId = () => {
  const date = new Date();

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `GWD-${yyyy}${mm}${dd}-${random}`;
};

const createOrderSummary = async ({
  userId,
  customerDetails,
  shippingAddress,
  deliveryDetails,
  paymentMethod,
  orderItems = [],
  totalPrice,
  finalAmount,
  priceDetails = {},
  giftPackaging,
  coupon,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  console.log("userId", userId);

  if (!userId) {
    throw new Error("Invalid userId");
  }

  const normalizedPaymentMethod = String(paymentMethod || "")
    .trim()
    .toLowerCase();

  const selectedPaymentMethod =
    normalizedPaymentMethod === "cod" ? "COD" : "razorpay";

  const isCOD = selectedPaymentMethod === "COD";

  console.log("paymentMethod received:", paymentMethod);
  console.log("selectedPaymentMethod:", selectedPaymentMethod);
  console.log("isCOD:", isCOD);

  if (!isCOD) {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing Razorpay payment details");
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error("Server misconfig: RAZORPAY_KEY_SECRET missing");
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid Razorpay signature");
    }
  }

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new Error("Order items are required from frontend");
  }

  const filters = [{ userId }];

  if (mongoose.Types.ObjectId.isValid(userId)) {
    filters.push({ userId: new mongoose.Types.ObjectId(userId) });
  }

  const savedOrderItems = orderItems.map((item) => {
    const qty = Number(item.quantity || item.qty || 1);

    // ✅ price = base amount without tax, example 723
    const price = Number(
      item.price ||
      item.actualPrice ||
      item.taxableAmount ||
      item.basePrice ||
      0
    );

    // ✅ salePrice = final product price including 5% tax, example 759
    const salePrice = Number(
      item.salePrice ||
      item.sellingPrice ||
      item.priceWithTax ||
      item.itemTotal ||
      item.saleTotal ||
      price ||
      0
    );

    const mrp = Number(
      item.mrp || item.originalPrice || salePrice || price || 0
    );

    return {
      productId: item.productId,

      name: item.name || "Product",

      quantity: qty,

      // ✅ base price without tax
      price,
      rate: Number(item.rate || price),
      actualPrice: Number(item.actualPrice || price),
      taxableAmount: Number(item.taxableAmount || price),

      // ✅ sale price including tax / bill price
      salePrice,
      sellingPrice: Number(item.sellingPrice || salePrice),
      priceWithTax: Number(item.priceWithTax || salePrice),

      // ✅ MRP
      mrp,
      originalPrice: Number(item.originalPrice || mrp),

      selectedColor: item.selectedColor || item.variant || "",
      variant: item.variant || item.selectedColor || "",

      selectedColorImage: item.selectedColorImage || item.image || "",
      image: item.image || item.selectedColorImage || "",

      // ✅ discount from frontend
      itemDiscount: Number(item.itemDiscount || item.discountAmount || 0),
      discountAmount: Number(item.discountAmount || item.itemDiscount || 0),
      discountPercent: Number(item.discountPercent || 0),
      discountTotal: Number(item.discountTotal || 0),

      // ✅ tax from frontend, included in salePrice
      tax: Number(item.tax || 0),
      gst: Number(item.gst || item.tax || 0),
      taxRate: Number(item.taxRate || 5),
      taxIncluded: item.taxIncluded === true,

      shipping: Number(item.shipping || 0),

      // ✅ totals from frontend
      mrpTotal: Number(item.mrpTotal || mrp * qty),

      // base total without tax
      taxableTotal: Number(item.taxableTotal || price * qty),

      // sale total including tax
      saleTotal: Number(item.saleTotal || salePrice * qty),

      // final line total = sale price including tax
      total: Number(item.total || item.saleTotal || salePrice * qty),
      itemTotal: Number(item.itemTotal || item.saleTotal || salePrice * qty),
    };
  });

  const safePriceDetails = {
    // ✅ MRP subtotal
    // Example: 799
    subtotal: Number(
      priceDetails.subtotal ||
      priceDetails.originalSubtotal ||
      priceDetails.mrpSubtotal ||
      0
    ),

    originalSubtotal: Number(
      priceDetails.originalSubtotal ||
      priceDetails.subtotal ||
      priceDetails.mrpSubtotal ||
      0
    ),

    // ✅ base amount without tax
    // Example: 723
    taxableSubtotal: Number(
      priceDetails.taxableSubtotal || priceDetails.baseSubtotal || 0
    ),

    // ✅ sale price including tax
    // Example: 759
    saleSubtotal: Number(
      priceDetails.saleSubtotal || totalPrice || finalAmount || 0
    ),

    // ✅ MRP - sale price
    // Example: 40
    discount: Number(priceDetails.discount || 0),
    productDiscount: Number(
      priceDetails.productDiscount || priceDetails.discount || 0
    ),

    couponDiscount: Number(priceDetails.couponDiscount || 0),

    shippingCost: Number(
      priceDetails.shippingCost || deliveryDetails?.price || 0
    ),

    giftPackaging: Number(priceDetails.giftPackaging || 0),

    // ✅ included tax
    // Example: 36
    tax: Number(priceDetails.tax || 0),
    gst: Number(priceDetails.gst || priceDetails.tax || 0),
    taxRate: Number(priceDetails.taxRate || 5),
    taxIncluded: priceDetails.taxIncluded !== false,

    // ✅ final payable amount
    // Example: 759
    finalAmount: Number(
      finalAmount || priceDetails.finalAmount || priceDetails.saleSubtotal || 0
    ),

    totalSavings: Number(
      priceDetails.totalSavings ||
      Number(priceDetails.discount || 0) +
      Number(priceDetails.couponDiscount || 0)
    ),
  };

  const orderId = generateOrderId();

  const orderSummary = await OrderSummary.create({
    orderId,

    userId,
    customerDetails,
    shippingAddress,
    orderItems: savedOrderItems,

    // ✅ bill amount / sale price including tax
    totalPrice: Number(
      totalPrice ||
      safePriceDetails.saleSubtotal ||
      safePriceDetails.finalAmount ||
      0
    ),

    // ✅ included tax only
    gst: safePriceDetails.tax,
    tax: safePriceDetails.tax,

    // ✅ final payable amount
    finalAmount: Number(
      finalAmount ||
      safePriceDetails.finalAmount ||
      safePriceDetails.saleSubtotal ||
      0
    ),

    priceDetails: safePriceDetails,

    deliveryDetails: {
      methodId: deliveryDetails?.methodId || null,
      name: deliveryDetails?.name || "",
      price: Number(
        deliveryDetails?.price || safePriceDetails.shippingCost || 0
      ),
      estimatedDays: deliveryDetails?.estimatedDays || "",
    },

    giftPackaging: giftPackaging || {
      selected: false,
      price: safePriceDetails.giftPackaging || 0,
    },

    coupon: coupon || null,

    razorpayOrderId: isCOD ? null : razorpay_order_id,
    paymentId: isCOD ? null : razorpay_payment_id,
    paymentSignature: isCOD ? null : razorpay_signature,

    paymentMethod: selectedPaymentMethod,
    paymentStatus: isCOD ? "unpaid" : "completed",
  });

  await Cart.updateOne(
    { $or: filters },
    { $set: { items: [], totalPrice: 0 } }
  );

  const invoiceData = await generateInvoiceService({
    orderId: orderSummary.orderId,
    userId: orderSummary.userId,
  });

  const orderWhatsapp = await sendOrderWhatsapp({
    to: customerDetails.phone,
    customerName:
      customerDetails?.firstName || customerDetails?.name || "Customer",
    orderId: orderSummary.orderId,
  });

  console.log("Create Order WhatsApp Result:", orderWhatsapp);

  if (orderSummary.paymentStatus === "completed") {
    if (!invoiceData?.invoiceUrl) {
      console.log("Invoice URL missing. Payment invoice WhatsApp skipped.");
    } else {
      const paymentInvoiceWhatsapp = await sendPaymentInvoiceWhatsapp({
        to: customerDetails.phone,
        customerName:
          customerDetails?.firstName || customerDetails?.name || "Customer",
        orderId: orderSummary.orderId,
        invoiceUrl: invoiceData.invoiceUrl,
      });

      console.log("Payment Invoice WhatsApp Result:", paymentInvoiceWhatsapp);
    }
  }

  return orderSummary;
};

const getOrderSummaryById = async (orderId) => {
  const order = await OrderSummary.findById(orderId).populate({
    path: "orderItems.productId",
  });
  return order;
};

const getOrdersByUser = async (userId) => {
  try {
    const orders = await OrderSummary.find({ userId }).populate({
      path: "orderItems.productId",
    });

    if (orders.length === 0) {
      return { message: "No orders found for this user", orders: [] };
    }

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    return { error: `Error fetching user orders: ${error.message}` };
  }
};

const getAllOrders = async () => {
  try {
    const orders = await OrderSummary.find().populate({
      path: "orderItems.productId",
      select: "_id title mrp subTitle color price description productImgUrl",
    });

    if (orders.length === 0) {
      throw new Error("No orders found");
    }

    return orders;
  } catch (error) {
    throw new Error(`Error fetching all orders: ${error.message}`);
  }
};

const getIcarryTrackingUrlFromPayload = (payload = {}) => {
  return (
    payload.tracking_url ||
    payload.trackingUrl ||
    payload.track_url ||
    payload.trackUrl ||
    payload.awb_tracking_url ||
    payload.awbTrackingUrl ||
    payload.data?.tracking_url ||
    payload.data?.trackingUrl ||
    payload.data?.track_url ||
    payload.data?.trackUrl ||
    payload.data?.awb_tracking_url ||
    payload.data?.awbTrackingUrl ||
    payload.shipment?.tracking_url ||
    payload.shipment?.trackingUrl ||
    ""
  );
};

const isIcarryAssignedOrShippedStatus = (status = "") => {
  const normalizedStatus = String(status || "").toLowerCase();

  return (
    normalizedStatus.includes("assigned") ||
    normalizedStatus.includes("pickup assigned") ||
    normalizedStatus.includes("courier assigned") ||
    normalizedStatus.includes("awb assigned") ||
    normalizedStatus.includes("manifest") ||
    normalizedStatus.includes("created") ||
    normalizedStatus.includes("picked") ||
    normalizedStatus.includes("pickup") ||
    normalizedStatus.includes("shipped") ||
    normalizedStatus.includes("in transit") ||
    normalizedStatus.includes("transit") ||
    normalizedStatus.includes("out for delivery") ||
    normalizedStatus.includes("ofd")
  );
};

const shouldSendIcarryShippingWhatsapp = ({
  oldOrderStatus,
  oldShippingStatus,
  newOrderStatus,
  newShippingStatus,
  oldShippingWhatsappSent,
}) => {
  if (oldShippingWhatsappSent) return false;

  const oldStatusText = `${oldOrderStatus || ""} ${oldShippingStatus || ""}`;
  const newStatusText = `${newOrderStatus || ""} ${newShippingStatus || ""}`;

  const wasAlreadyAssignedOrShipped =
    isIcarryAssignedOrShippedStatus(oldStatusText);

  const isNowAssignedOrShipped = isIcarryAssignedOrShippedStatus(newStatusText);

  return !wasAlreadyAssignedOrShipped && isNowAssignedOrShipped;
};

const sendIcarryShippingWhatsappForOrder = async (order) => {
  if (!order) return;

  const trackingUrl =
    order.trackingUrl ||
    getIcarryTrackingUrlFromPayload(order.shippingResponse) ||
    "";

  if (!trackingUrl) {
    console.log("iCarry tracking URL missing. Shipping WhatsApp skipped.");
    return;
  }

  if (!order.customerDetails?.phone) {
    console.log("Customer phone missing. Shipping WhatsApp skipped.");
    return;
  }

  await sendShippingWhatsapp({
    to: order.customerDetails.phone,
    customerName:
      order.customerDetails.firstName ||
      order.customerDetails.name ||
      "Customer",
    orderId: order.orderId || order.orderNumber || order._id.toString(),
    trackingId:
      order.awbNumber || order.courierNumber || order.shipmentId || "",
    trackingUrl, // ✅ iCarry URL only
  });
};

const updateOrderSummaryById = async (id, updateData) => {
  const oldOrder = await OrderSummary.findById(id);
  if (!oldOrder) throw new Error("Order not found");

  const allowedUpdate = {};

  if (updateData.orderStatus !== undefined)
    allowedUpdate.orderStatus = updateData.orderStatus;

  if (updateData.paymentStatus !== undefined)
    allowedUpdate.paymentStatus = updateData.paymentStatus;

  if (updateData.courierName !== undefined)
    allowedUpdate.courierName = updateData.courierName;

  if (updateData.courierNumber !== undefined)
    allowedUpdate.courierNumber = updateData.courierNumber;

  if (updateData.orderStatus === "Cancelled") {
    allowedUpdate.cancelledAt = new Date();
  }

  const updatedOrder = await OrderSummary.findByIdAndUpdate(id, allowedUpdate, {
    new: true,
    runValidators: true,
  });

  // 🔥 TRIGGER SAME SYSTEM
  await sendOrderStatusSideEffects(oldOrder, updatedOrder);

  return updatedOrder;
};

const deleteOrderSummaryById = async (id) => {
  const order = await OrderSummary.findByIdAndDelete(id);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

const getOrdersByUserId = async (userId) => {
  try {
    const orders = await OrderSummary.find({ userId }).sort({ date: -1 });
    return orders;
  } catch (error) {
    throw new Error("Error fetching order s from the database");
  }
};

const saveContact = async (contactData) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

const getAllContacts = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};

const getContactById = async (id) => {
  return await Contact.findById(id);
};

const colorNames = {
  "#dddcdc": "White",
  "#363636": "Matte Black",
  "#4b3933": "Chocolate Brown",
  "#dfdfdf": "White and Grey",
  "#311d1c": "Brown",
  "#191919": "Black",
  "#505a65": "Black and Grey",
  "#d2cabb": "Ivory",
  "#996a5a": "Dark Shade",
  "#b89455": "Light Shade",
  "#d4dadb": "Star White",
  "#e2e4e5": "Pearl White",
  "#3b2424": "Metalic Brown",
  "#ce9e4c": "Antique Ivory",
  "#735140": "Wood Ivory",
  "#213d5d": "Blue Ocean",
  "#2d2d2b": "Black and Gold",
};

const nameToHexMap = Object.entries(colorNames).reduce((acc, [hex, name]) => {
  acc[name.toLowerCase()] = hex.toLowerCase();
  return acc;
}, {});

const createWarranty = async ({
  productName,
  productColor,
  warrantyNumber,
  userId,
}) => {
  const product = await Product.findOne({
    title: { $regex: new RegExp(`^${productName}$`, "i") },
  });
  if (!product) throw new Error(`Product "${productName}" not found.`);

  const requested = (productColor || "").trim().toLowerCase();
  const requestedHex = requested.startsWith("#")
    ? requested
    : nameToHexMap[requested] || null;

  if (!requestedHex) {
    throw new Error(`Colour "${productColor}" is not recognised.`);
  }

  const available = new Set();

  if (product.color) {
    const list = Array.isArray(product.color) ? product.color : [product.color];
    list.forEach((c) =>
      c
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .forEach((s) => {
          available.add(s);
          if (s.startsWith("#") && colorNames[s])
            available.add(colorNames[s].toLowerCase());
          if (!s.startsWith("#") && nameToHexMap[s])
            available.add(nameToHexMap[s]);
        })
    );
  }

  if (Array.isArray(product.productImages)) {
    product.productImages.forEach((img) => {
      const col = (img.color || "").toLowerCase();
      if (!col) return;
      available.add(col);
      if (colorNames[col]) available.add(colorNames[col].toLowerCase());
    });
  }

  const colourOK =
    available.has(requested) || available.has(requestedHex.toLowerCase());

  if (!colourOK) {
    throw new Error(
      `Color "${productColor}" does not exist for product "${productName}".`
    );
  }

  const existing = await Warranty.findOne({ warrantyNumber });
  if (existing) {
    throw new Error(
      "This warranty number is already assigned to another product."
    );
  }

  const warranty = new Warranty({
    productId: product._id,
    productColor: requestedHex,
    userId,
    warrantyNumber,
  });

  await warranty.save();
  return warranty;
};

export const getWarrantiesByUserService = async (userId) => {
  return await Warranty.find({ userId }).populate(
    "productId",
    "title color mrp price"
  );
};

const getAllWarranties = async () => {
  return await Warranty.find().populate("productId").sort({ createdAt: -1 });
};

const getWarrantiesByUserId = async (userId) => {
  try {
    const warranties = await Warranty.find({ userId })
      .populate("productId", "title mrp price color")
      .populate("userId")
      .lean();

    return warranties;
  } catch (error) {
    console.error("Service Error: Unable to fetch warranties", error.message);
    throw new Error("Unable to fetch warranties. Please try again later.");
  }
};

const getCoupon = async () => {
  return Coupon.find();
};

const getCouponById = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found!");

  return coupon;
};

const getBlog = async () => {
  return BlogPost.find();
};

const getAboutUsPage = async () => {
  return AboutUs.find();
};

const getAboutUsById = async (id) => {
  return AboutUs.findById(id);
};

const createComplaint = async (complaintData) => {
  const { productId, customerName, phoneNumber, email, address } =
    complaintData;

  if (!productId || !customerName || !phoneNumber || !email || !address) {
    throw new Error(
      "Missing required fields: productId, customerName, phoneNumber, email, address."
    );
  }

  const newComplaint = new Complaint(complaintData);

  const savedComplaint = await newComplaint.save();

  return savedComplaint;
};

const getAllQuickFix = async () => {
  try {
    const quickFixes = await QuickFix.find()
      .populate("productId")
      .populate("problemId");
    res.status(200).json({ quickFixes });
  } catch (error) {
    console.error("Error fetching QuickFix data:", error.message);
    res.status(500).json({ message: "Error fetching QuickFix data." });
  }
};

const getQuickFixById = async (id) => {
  try {
    const quickFixes = await QuickFix.findById(id)
      .populate("productId")
      .populate("problemId");
    res.status(200).json({ quickFixes });
  } catch (error) {
    console.error("Error fetching QuickFix data:", error.message);
    res.status(500).json({ message: "Error fetching QuickFix data." });
  }
};

const getQuickFixByProductAndProblem = async (productId, problemId) => {
  try {
    const quickFixes = await QuickFix.find({
      productId,
      problemId,
    })
      .populate("productId")
      .populate("problemId");

    return quickFixes;
  } catch (error) {
    console.error("Error fetching QuickFix data from database:", error.message);
    throw new Error("Error fetching QuickFix data from database");
  }
};

const getProblem = async () => {
  return Problem.find();
};

const getBrand = async () => {
  return Brand.find();
};
const getBlogContainsByBlogId = async (blogId) => {
  const blog = await BlogDetails.findOne({ blogId });
  return blog;
};

const getProductsByCategory = async (categoryId) => {
  try {
    const products = await Product.find({ categoryId }).populate("categoryId");
    return products.length
      ? { success: true, products }
      : { success: false, message: "No products found" };
  } catch (error) {
    throw new Error("Internal Server Error");
  }
};

const getProductByNameService = async (title) => {
  const decodedTitle = decodeURIComponent(title);

  const product = await Product.findOne({
    title: new RegExp("^" + decodedTitle + "$", "i"),
  });

  console.log("Searching for:", decodedTitle);
  console.log("Found product:", product);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const createVisitEntryService = async (formData) => {
  const entry = new InfluencerVisit(formData);
  return await entry.save();
};

const generateProductCodes = async (productId, quantity = 1) => {
  const codes = [];
  for (let i = 0; i < quantity; i++) {
    const newCode = generateCode(productId);
    const saved = await Code.create({ code: newCode, productId });
    codes.push(saved);
  }
  return codes;
};

const validateAndUseCode = async (codeInput, userId) => {
  const code = await Code.findOne({ code: codeInput });
  if (!code) throw new Error("Invalid code");
  if (code.used) throw new Error("Code already used");

  const user = await UserProfile.findById(userId);
  if (!user) throw new Error("User not found");

  code.used = true;
  code.assignedTo = userId;
  await code.save();

  user.points = (user.points || 0) + 20;
  user.scannedCodes = user.scannedCodes || [];
  user.scannedCodes.push(code.code);
  await user.save();

  const product = await Product.findById(code.productId);

  return { user, product, code };
};

const generateOtp = async (mobileNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await Code.findOneAndUpdate(
    { mobileNumber },
    { otp, expiresAt },
    { upsert: true, new: true }
  );
  return otp;
};

const verifyOtp = async (mobileNumber, otpInput) => {
  const otpRecord = await Code.findOne({ mobileNumber });
  if (
    !otpRecord ||
    otpRecord.otp !== otpInput ||
    otpRecord.expiresAt < new Date()
  ) {
    return false;
  }
  await OTP.deleteOne({ mobileNumber });
  return true;
};
7;
const applyProductCode = async (barcodeData, mobileNumber, name) => {
  const product = await Code.findOne({ code: barcodeData });

  if (!product || product.used) {
    return { applied: false, message: "Code is invalid or already used." };
  }

  product.used = true;
  product.usedBy = { mobileNumber, name, appliedAt: new Date() };
  await product.save();

  return { applied: true, message: "Code successfully applied." };
};

const getCouponByCodeAndCategory = async (code, categoryId) => {
  return await Coupon.findOne({
    couponCode: code,
    categories: categoryId,
  });
};

const verifyCouponForCategories = async (couponCode, categoryIds) => {
  if (!couponCode || !Array.isArray(categoryIds)) {
    throw new Error("Invalid input");
  }

  const coupon = await Coupon.findOne({ couponCode });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  const isValid = coupon.categories.some((catId) =>
    categoryIds.includes(catId.toString())
  );

  if (!isValid) {
    throw new Error("Coupon not applicable to these products");
  }

  return coupon;
};

const getCouponsByCategory = async (categoryId) => {
  return await Coupon.find({ categories: categoryId }).populate("categories");
};

const getHeroSection = async () => {
  return HeroSection.find();
};

const getBanner = async () => {
  return Banner.find();
};

const getResHeroSection = async () => {
  return ResponsiveHeroSection.find();
};

const escapeRx = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
async function searchProductsService(q, { limit = 8 } = {}) {
  const query = String(q || "").trim();
  if (!query) return [];

  const projection = "title _id price thumbnail subTitle";

  // If you have a text index on title/subTitle/tags:
  const textHits = await Product.find(
    { $text: { $search: query }, isActive: true },
    { score: { $meta: "textScore" } }
  )
    .select(projection)
    .sort({ score: { $meta: "textScore" }, createdAt: -1 })
    .limit(Number(limit) || 8)
    .lean();

  if (textHits.length) return textHits;

  // Fallback regex
  const rx = new RegExp(escapeRx(query), "i");
  return Product.find(
    { isActive: true, $or: [{ title: rx }, { subTitle: rx }, { tags: rx }] },
    projection
  )
    .sort({ createdAt: -1 })
    .limit(Number(limit) || 8)
    .lean();
}

const getProductBySlugService = async (slug) => {
  if (!slug) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Slug is required");
  }

  const product = await Product.findOne({
    slug: slug.trim(),
    isActive: true,
  })
    .populate("categoryId", "name slug")
    .populate("brandId", "name slug")
    .lean();

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  const currentDate = new Date();

  let finalPrice = Number(product.price || 0);
  let salePriceApplied = false;

  if (product.salePrice && Number(product.salePrice) > 0) {
    if (product.discountStart && product.discountEnd) {
      const discountStart = new Date(product.discountStart);
      const discountEnd = new Date(product.discountEnd);

      if (currentDate >= discountStart && currentDate <= discountEnd) {
        finalPrice = Number(product.salePrice);
        salePriceApplied = true;
      }
    } else {
      finalPrice = Number(product.salePrice);
      salePriceApplied = true;
    }
  }

  const originalPrice = Number(product.price || 0);

  const discount =
    originalPrice > 0 && finalPrice > 0 && finalPrice < originalPrice
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : 0;

  // ✅ Product detail page: all DB saved product.images
  const images = normalizeImages(product.images || [], "detail");

  const image1 = images[0] || null;
  const image2 = images[1] || images[0] || null;

  // ✅ Normalize attributes / variants images also
  const attributes = Array.isArray(product.attributes)
    ? product.attributes.map((attr) => {
      const attrImages = normalizeImages(attr.images || [], "detail");

      return {
        ...attr,
        images: attrImages,
        image: attrImages[0] || null,
      };
    })
    : [];

  const variants = Array.isArray(product.variants)
    ? product.variants.map((variant) => {
      const variantImages = normalizeImages(variant.images || [], "detail");

      return {
        ...variant,
        images: variantImages,
        image:
          variantImages[0] || getImageUrl(variant.image, "detail") || null,
      };
    })
    : [];

  const displayWeight =
    product?.sku?.match(/\d+\s*(ml|ltr|liter|litre|l|kg|g|gm)/i)?.[0] ||
    (product?.weight && product?.weightUnit
      ? `${product.weight} ${product.weightUnit}`
      : "") ||
    (variants?.[0]?.weight && variants?.[0]?.weightUnit
      ? `${variants[0].weight} ${variants[0].weightUnit}`
      : "");

  // ✅ Related products lightweight and fast
  let relatedProducts = [];

  if (product.categoryId?._id) {
    const relatedDocs = await Product.find({
      _id: { $ne: product._id },
      categoryId: product.categoryId._id,
      isActive: true,
    })
      .select(
        "name title slug price salePrice discountStart discountEnd images stockStatus rating reviewCount"
      )
      .limit(8)
      .lean();

    relatedProducts = relatedDocs.map((item) => {
      let relatedFinalPrice = Number(item.price || 0);
      let relatedSalePriceApplied = false;

      if (item.salePrice && Number(item.salePrice) > 0) {
        if (item.discountStart && item.discountEnd) {
          const start = new Date(item.discountStart);
          const end = new Date(item.discountEnd);

          if (currentDate >= start && currentDate <= end) {
            relatedFinalPrice = Number(item.salePrice);
            relatedSalePriceApplied = true;
          }
        } else {
          relatedFinalPrice = Number(item.salePrice);
          relatedSalePriceApplied = true;
        }
      }

      const relatedOriginalPrice = Number(item.price || 0);

      const relatedDiscount =
        relatedOriginalPrice > 0 &&
          relatedFinalPrice > 0 &&
          relatedFinalPrice < relatedOriginalPrice
          ? Math.round(
            ((relatedOriginalPrice - relatedFinalPrice) /
              relatedOriginalPrice) *
            100
          )
          : 0;

      // ✅ Related products use listing image type
      const relatedImages = normalizeImages(item.images || [], "listing");

      const relatedImage1 = relatedImages[0] || null;
      const relatedImage2 = relatedImages[1] || relatedImages[0] || null;

      return {
        _id: item._id,
        name: item.name || item.title || "",
        title: item.title || item.name || "",
        slug: item.slug,

        price: Math.max(Math.round(relatedFinalPrice), 0),
        originalPrice: item.price,
        salePrice: item.salePrice || null,
        salePriceApplied: relatedSalePriceApplied,
        discount: relatedDiscount,

        stockStatus: item.stockStatus,
        rating: item.rating || 0,
        reviewCount: item.reviewCount || 0,

        images: relatedImages.slice(0, 2),
        featuredImage: relatedImage1,
        image1: relatedImage1,
        image2: relatedImage2,
        thumbnail: relatedImage1,
        image: relatedImage1,
      };
    });
  }

  return {
    _id: product._id,

    name: product.name || product.title || "",
    title: product.title || product.name || "",
    slug: product.slug,

    subTitle: product.subTitle || "",
    description: product.description || "",
    content: product.content || "",

    price: Math.max(Math.round(finalPrice), 0),
    originalPrice: product.price,
    salePrice: product.salePrice || null,
    salePriceApplied,
    discount,
    priceIncludesTax: product.priceIncludesTax || false,
    costPerItem: product.costPerItem || 0,

    discountStart: product.discountStart || null,
    discountEnd: product.discountEnd || null,

    sku: product.sku || "",
    barcode: product.barcode || "",
    weight: product.weight || null,
    weightUnit: product.weightUnit || "",
    displayWeight,

    categoryId: product.categoryId,
    brandId: product.brandId || null,
    collectionIds: product.collectionIds || [],
    labelIds: product.labelIds || [],

    isActive: product.isActive,
    stockStatus: product.stockStatus,
    withStorehouseManagement: product.withStorehouseManagement || false,

    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    reviews: product.reviews || 0,

    // ✅ only DB saved product images
    images,
    featuredImage: image1,
    image1,
    image2,
    thumbnail: image1,
    image: image1,

    sections: product.sections || {},
    productInfoSection: product.productInfoSection || {},
    aPlusContent: product.aPlusContent || {},
    whySection: product.whySection || {},
    faqSection: product.faqSection || {},
    specialSections: product.specialSections || [],

    attributes,
    variants,

    features: product.features || [],
    highlights: product.highlights || [],
    faqs: product.faqs || [],
    testimonials: product.testimonials || [],

    relatedProducts,

    offers: product.offers || {},
    dimensions: product.dimensions || {},
    specificationTableId: product.specificationTableId || null,

    metaTitle: product.metaTitle || "",
    metaDescription: product.metaDescription || "",

    taxId: product.taxId || null,

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

const createReturnRequestService = async (data) => {
  const { orderId, items } = data;

  // =========================
  // 1. FIND ORDER
  // =========================
  const order = await OrderSummary.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // =========================
  // 2. CHECK EXISTING RETURN
  // =========================
  const existing = await ReturnRequest.findOne({ orderId });

  if (existing) {
    throw new Error("Return already requested for this order");
  }

  // =========================
  // 3. CREATE RETURN REQUEST
  // =========================
  const requestId = `RET-${Date.now()}`;

  const newReturn = await ReturnRequest.create({
    ...data,
    requestId,
  });

  // =========================
  // 4. UPDATE ORDER STATUS
  // =========================
  order.returnRequestStatus = "requested";
  order.returnRequestId = requestId;
  await order.save();

  // =========================
  // 5. SEND WHATSAPP MESSAGE (SAFE)
  // =========================
  try {
    const phone = order.customerDetails?.phone;

    if (phone) {
      await sendReturnRequestWhatsapp({
        to: phone,
        customerName:
          order.customerDetails?.firstName ||
          order.customerDetails?.name ||
          "Customer",
        orderId: order.orderId || order.orderNumber || order._id.toString(),
        requestId: requestId,
      });
    }
  } catch (error) {
    console.error("Return WhatsApp failed:", error.message);
  }

  // =========================
  // 6. RETURN RESPONSE
  // =========================
  return newReturn;
};

const cancelOrderService = async ({ orderId, userId, reason }) => {
  const order = await OrderSummary.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // 🔒 Ownership check
  if (userId && order.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  // 🚫 Prevent cancel after shipping
  if (["Shipped", "Delivered"].includes(order.orderStatus)) {
    throw new Error("Order cannot be cancelled after shipping");
  }

  // ❌ Already cancelled
  if (order.orderStatus === "Cancelled") {
    throw new Error("Order already cancelled");
  }

  const oldStatus = order.orderStatus;

  // =========================
  // 🔥 UPDATE ORDER STATUS
  // =========================
  const updatedOrder = await OrderSummary.findByIdAndUpdate(
    orderId,
    {
      $set: {
        orderStatus: "Cancelled",
        cancelledAt: new Date(),
        cancelReason: reason || "User cancelled",
      },
    },
    {
      new: true,
      runValidators: false,
    }
  );

  // =========================
  // 🔥 SEND WHATSAPP (FIXED)
  // =========================
  try {
    const phone = updatedOrder.customerDetails?.phone;

    if (phone) {
      // 👉 USE YOUR CENTRAL SYSTEM (IMPORTANT FIX)
      await sendOrderCancelledWhatsapp({
        status: "Cancelled",
        to: phone,
        customerName:
          updatedOrder.customerDetails?.firstName ||
          updatedOrder.customerDetails?.name ||
          "Customer",
        orderId: updatedOrder.orderId,
        cancellationReason: reason || "User requested cancellation",
      });

      // =========================
      // OPTIONAL FLAG (ANTI DUPLICATE)
      // =========================
      await OrderSummary.findByIdAndUpdate(orderId, {
        $set: {
          cancelWhatsappSent: true,
          cancelWhatsappSentAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Cancel WhatsApp failed:", error.message);
  }

  return updatedOrder;
};

const generateInvoiceService = async ({ orderId, userId }) => {
  const order = await OrderSummary.findOne({
    orderId,
  }).populate({
    path: "orderItems.productId",
    select:
      "_id name title price salePrice mrp images featuredImage weight weightUnit sku",
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (userId && order.userId && order.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  const invoicePdfUrl = `https://storage.server.grafizen.in/invoices/${order.orderId}.pdf`;

  // ✅ Invoice items should come from order.orderItems only
  // ✅ No calculation here
  const invoiceItems = order.orderItems.map((item) => {
    const product = item.productId;

    return {
      productId: product?._id || item.productId,

      name: item?.name || product?.name || product?.title || "Product",

      quantity: item?.quantity,

      // ✅ MRP
      mrp: item?.mrp,
      originalPrice: item?.originalPrice,

      // ✅ price is sale price including tax
      price: item?.price,
      salePrice: item?.salePrice || item?.price,
      sellingPrice: item?.sellingPrice || item?.price,
      priceWithTax: item?.priceWithTax || item?.price,

      // ✅ base price without tax
      basePrice: item?.basePrice,
      taxablePrice: item?.taxablePrice,
      actualPrice: item?.actualPrice,
      taxableAmount: item?.taxableAmount,

      selectedColor: item?.selectedColor,
      variant: item?.variant,

      selectedColorImage:
        item?.selectedColorImage ||
        item?.image ||
        product?.featuredImage ||
        product?.images?.[0] ||
        "",

      image:
        item?.image ||
        item?.selectedColorImage ||
        product?.featuredImage ||
        product?.images?.[0] ||
        "",

      // ✅ discount from order
      itemDiscount: item?.itemDiscount,
      discountAmount: item?.discountAmount,
      discountPercent: item?.discountPercent,
      discountTotal: item?.discountTotal,

      // ✅ included tax
      tax: item?.tax,
      gst: item?.gst,
      taxRate: item?.taxRate,
      taxIncluded: item?.taxIncluded,

      // ✅ totals from order
      mrpTotal: item?.mrpTotal,
      taxableTotal: item?.taxableTotal,
      saleTotal: item?.saleTotal,
      total: item?.total,
      itemTotal: item?.itemTotal,
    };
  });

  const invoiceData = {
    orderId: order._id,
    userId: order.userId,

    invoiceUrl: invoicePdfUrl,

    billingDetails: {
      name: `${order.customerDetails?.firstName || ""} ${order.customerDetails?.lastName || ""
        }`.trim(),
      email: order.customerDetails?.email || "",
      phone: order.customerDetails?.phone || "",
      address: order.customerDetails?.streetAddress || "",
      city: order.customerDetails?.city || "",
      state: order.customerDetails?.state || "",
      pinCode: order.customerDetails?.pinCode || "",
      country: order.customerDetails?.country || "India",
    },

    shippingAddress: order.shippingAddress || {},

    items: invoiceItems,

    // ✅ same priceDetails from order
    // ✅ no recalculation
    priceDetails: {
      // ✅ MRP total
      subtotal: order.priceDetails?.subtotal,
      originalSubtotal: order.priceDetails?.originalSubtotal,

      // ✅ base without tax
      taxableSubtotal: order.priceDetails?.taxableSubtotal,

      // ✅ sale amount including tax
      saleSubtotal: order.priceDetails?.saleSubtotal,

      // ✅ discount
      discount: order.priceDetails?.discount,
      productDiscount: order.priceDetails?.productDiscount,
      couponDiscount: order.priceDetails?.couponDiscount,

      // ✅ charges
      shippingCost: order.priceDetails?.shippingCost,
      giftPackaging: order.priceDetails?.giftPackaging,

      // ✅ included tax
      tax: order.priceDetails?.tax,
      gst: order.priceDetails?.gst,
      taxRate: order.priceDetails?.taxRate,
      taxIncluded: order.priceDetails?.taxIncluded,

      // ✅ final
      finalAmount: order.priceDetails?.finalAmount,
      totalSavings: order.priceDetails?.totalSavings,
    },

    // ✅ also save main order amount fields
    totalPrice: order.totalPrice,
    gst: order.gst,
    tax: order.tax,
    finalAmount: order.finalAmount,

    deliveryDetails: order.deliveryDetails || {},
    giftPackaging: order.giftPackaging || {},
    coupon: order.coupon || null,

    paymentMethod: order.paymentMethod,

    // ✅ COD should stay unpaid/pending, Razorpay completed/paid
    paymentStatus:
      order.paymentMethod === "COD"
        ? "unpaid"
        : order.paymentStatus === "completed"
          ? "paid"
          : order.paymentStatus,

    orderStatus: order.orderStatus,
    currency: order.currency || "INR",
  };

  // ✅ Important:
  // If invoice already exists, update it according to latest order data
  // Otherwise old invoice will show old calculation.
  const invoice = await Invoice.findOneAndUpdate(
    { orderId: order._id },
    { $set: invoiceData },
    {
      new: true,
      upsert: true,
      runValidators: false,
    }
  );

  return {
    ...invoice.toObject(),
    invoiceUrl: invoicePdfUrl,
  };
};

const removeCartItem = async ({
  cartId,
  cartItemId,
  productId,
  selectedColor,
}) => {
  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart not found");
  }

  if (!cart.items || cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No items in the cart");
  }

  console.log("REMOVE CART SERVICE DEBUG:", {
    cartId,
    cartItemId,
    productId,
    selectedColor,
    cartItems: cart.items.map((item) => ({
      cartItemId: item._id?.toString(),
      productId: item.productId?.toString(),
      selectedColor: item.selectedColor,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  const beforeLength = cart.items.length;

  cart.items = cart.items.filter((item) => {
    const sameCartItem =
      cartItemId && item._id?.toString() === cartItemId?.toString();

    const sameProductAndVariant =
      productId &&
      item.productId?.toString() === productId?.toString() &&
      String(item.selectedColor || "").toLowerCase() ===
      String(selectedColor || "").toLowerCase();

    return !(sameCartItem || sameProductAndVariant);
  });

  if (beforeLength === cart.items.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Item not found in cart");
  }

  cart.totalPrice = cart.items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  await cart.save();

  return await Cart.findById(cartId)
    .select("items totalPrice")
    .populate({
      path: "items.productId",
      select: "title name productImages",
    })
    .lean();
};

const updateCartItemQty = async ({ cartId, cartItemId, quantity }) => {
  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart not found");
  }

  const qty = Number(quantity);

  if (!qty || qty < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Quantity must be at least 1");
  }

  const item = cart.items.id(cartItemId);

  if (!item) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Item not found in cart");
  }

  item.quantity = qty;

  cart.totalPrice = cart.items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  await cart.save();

  return await Cart.findById(cartId)
    .select("items totalPrice")
    .populate({
      path: "items.productId",
      select: "title name productImages",
    })
    .lean();
};

const applyIcarryUpdateToOrder = async (order, payload) => {
  const currentStatus = getIcarryStatusFromResponse(payload, "Status Updated");
  const statusUpdate = mapIcarryStatusToOrderStatus(currentStatus);

  const trackingUrl = getIcarryTrackingUrlFromPayload(payload);
  const ids = getIcarryIdsFromPayload(payload);

  const updateData = {
    ...statusUpdate,
    shippingProvider: "icarry",
    shippingStatus: statusUpdate.shippingStatus || currentStatus,
    shippingResponse: payload,
    lastIcarryStatusSyncedAt: new Date(),
  };

  if (trackingUrl) updateData.trackingUrl = trackingUrl;
  if (ids.awbNumber) updateData.awbNumber = ids.awbNumber;
  if (ids.shipmentId) updateData.shipmentId = ids.shipmentId;
  if (ids.courierName) updateData.courierName = ids.courierName;

  const updatedOrder = await OrderSummary.findByIdAndUpdate(
    order._id,
    { $set: updateData },
    { new: true, runValidators: false }
  );

  // 🔥 ONLY ONE PLACE FOR WHATSAPP TRIGGERS
  await sendOrderStatusSideEffects(order, updatedOrder);

  return updatedOrder;
};

const mapIcarryStatusToOrderStatus = (icarryStatus = "") => {
  const status = String(icarryStatus || "").toLowerCase();

  // Cancelled
  if (
    status.includes("cancel") ||
    status.includes("canceled") ||
    status.includes("cancelled")
  ) {
    return {
      orderStatus: "Cancelled",
      shippingStatus: "Cancelled",
      cancelledAt: new Date(),
    };
  }

  // Delivered
  if (status.includes("delivered")) {
    return {
      orderStatus: "Delivered",
      shippingStatus: "Delivered",
      deliveredAt: new Date(),
    };
  }

  // RTO / Return
  if (
    status.includes("rto") ||
    status.includes("return") ||
    status.includes("returned")
  ) {
    return {
      orderStatus: "Cancelled",
      shippingStatus: icarryStatus || "RTO",
      cancelledAt: new Date(),
    };
  }

  // Out for delivery
  if (status.includes("out for delivery") || status.includes("ofd")) {
    return {
      orderStatus: "Out For Delivery",
      shippingStatus: "Out For Delivery",
    };
  }

  // Shipped / Picked / Transit
  if (
    status.includes("picked") ||
    status.includes("pickup") ||
    status.includes("in transit") ||
    status.includes("transit") ||
    status.includes("shipped") ||
    status.includes("manifest") ||
    status.includes("assigned") ||
    status.includes("awb") ||
    status.includes("created")
  ) {
    return {
      orderStatus: "Shipped",
      shippingStatus: icarryStatus || "Shipped",
    };
  }

  // Default: only update shippingStatus
  return {
    shippingStatus: icarryStatus || "Status Updated",
  };
};

const getIcarryIdsFromPayload = (payload = {}) => {
  const awbNumber =
    payload.awb_number ||
    payload.awbNumber ||
    payload.awb ||
    payload.awb_no ||
    payload.tracking_id ||
    payload.data?.awb_number ||
    payload.data?.awbNumber ||
    payload.data?.awb ||
    payload.data?.awb_no ||
    payload.data?.tracking_id ||
    payload.shipment?.awb_number ||
    payload.shipment?.awbNumber ||
    payload.shipment?.awb ||
    "";

  const shipmentId =
    payload.shipment_id ||
    payload.shipmentId ||
    payload.id ||
    payload.data?.shipment_id ||
    payload.data?.shipmentId ||
    payload.data?.id ||
    payload.shipment?.shipment_id ||
    payload.shipment?.shipmentId ||
    payload.shipment?.id ||
    "";

  const courierName =
    payload.courier_name ||
    payload.courierName ||
    payload.courier ||
    payload.data?.courier_name ||
    payload.data?.courierName ||
    payload.data?.courier ||
    payload.shipment?.courier_name ||
    payload.shipment?.courierName ||
    "";

  return {
    awbNumber,
    shipmentId,
    courierName,
  };
};

const getIcarryStatusFromResponse = (data, fallback = "Status Updated") => {
  return (
    data?.status ||
    data?.current_status ||
    data?.shipment_status ||
    data?.order_status ||
    data?.shipping_status ||
    data?.delivery_status ||
    data?.tracking_status ||
    data?.data?.status ||
    data?.data?.current_status ||
    data?.data?.shipment_status ||
    data?.data?.order_status ||
    data?.data?.shipping_status ||
    data?.shipment?.status ||
    data?.shipment?.current_status ||
    data?.shipment?.shipment_status ||
    fallback
  );
};

const createIcarryShipmentForOrder = async (orderId) => {
  const order = await OrderSummary.findById(orderId).populate(
    "orderItems.productId"
  );

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.awbNumber || order.shipmentId) {
    throw new Error("Shipment already created for this order");
  }

  if (order.orderStatus === "Cancelled") {
    throw new Error("Cannot create shipment for cancelled order");
  }

  if (order.paymentMethod !== "COD" && order.paymentStatus !== "completed") {
    throw new Error("Payment is not completed for this order");
  }

  const shipment = await createIcarryShipment(order);

  const awbNumber =
    shipment.awb_number ||
    shipment.awbNumber ||
    shipment.awb ||
    shipment.data?.awb_number ||
    shipment.data?.awbNumber ||
    "";

  const shipmentId =
    shipment.shipment_id ||
    shipment.shipmentId ||
    shipment.id ||
    shipment.data?.shipment_id ||
    shipment.data?.shipmentId ||
    "";

  const courierName =
    shipment.courier_name ||
    shipment.courierName ||
    shipment.courier ||
    shipment.data?.courier_name ||
    shipment.data?.courierName ||
    "";

  const labelUrl =
    shipment.label_url ||
    shipment.labelUrl ||
    shipment.data?.label_url ||
    shipment.data?.labelUrl ||
    "";

  const trackingUrl =
    shipment.tracking_url ||
    shipment.trackingUrl ||
    shipment.data?.tracking_url ||
    shipment.data?.trackingUrl ||
    "";

  const updatedOrder = await OrderSummary.findByIdAndUpdate(
    orderId,
    {
      $set: {
        shippingProvider: "icarry",
        shipmentId,
        awbNumber,

        courierName,
        courierNumber: awbNumber,

        labelUrl,
        trackingUrl,

        shippingStatus:
          shipment.status ||
          shipment.current_status ||
          shipment.shipment_status ||
          shipment.data?.status ||
          shipment.data?.current_status ||
          shipment.data?.shipment_status ||
          "Unassigned",

        shippingResponse: shipment,

        // Because save_only: 1 creates shipment as Unassigned, not confirmed shipment.
        orderStatus: "Processing",
      },
    },
    {
      new: true,
      runValidators: false,
    }
  );

  console.log(
    "iCarry shipment created as Unassigned. Shipping WhatsApp will be sent after assignment/shipping status update."
  );

  return updatedOrder;
};

const trackIcarryShipmentForOrder = async (orderId) => {
  const oldOrder = await OrderSummary.findById(orderId);

  if (!oldOrder) throw new Error("Order not found");
  if (!oldOrder.shipmentId) throw new Error("Shipment ID not found");

  const tracking = await trackIcarryShipment(oldOrder.shipmentId);

  const updatedOrder = await applyIcarryUpdateToOrder(oldOrder, tracking);

  return {
    tracking,
    order: updatedOrder,
  };
};

const cancelIcarryShipmentForOrder = async (orderId) => {
  const order = await OrderSummary.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const shipmentId = order.shipmentId;

  if (!shipmentId) {
    throw new Error("Shipment ID not found for this order");
  }

  if (order.orderStatus === "Delivered" || order.orderStatus === "delivered") {
    throw new Error("Delivered order shipment cannot be cancelled");
  }

  const result = await cancelIcarryShipment(shipmentId);

  console.log("ICARRY CANCEL RESPONSE:", JSON.stringify(result, null, 2));

  const updatedOrder = await OrderSummary.findByIdAndUpdate(
    orderId,
    {
      $set: {
        orderStatus: "Cancelled",
        shippingStatus: "Cancelled",
        cancelledAt: new Date(),
        shippingResponse: result,
        lastIcarryStatusSyncedAt: new Date(),
      },
      $push: {
        shippingStatusHistory: {
          status: "Cancelled",
          orderStatus: "Cancelled",
          source: "icarry-cancel",
          response: result,
          changedAt: new Date(),
        },
      },
    },
    {
      new: true,
      runValidators: false,
    }
  );

  return {
    result,
    order: updatedOrder,
  };
};

const icarryShipmentWebhookService = async (payload) => {
  const ids = getIcarryIdsFromPayload(payload);

  const awbNumber = ids.awbNumber;
  const shipmentId = ids.shipmentId;

  if (!awbNumber && !shipmentId) {
    throw new Error("Invalid webhook payload");
  }

  const filter = awbNumber
    ? {
      $or: [
        { awbNumber },
        { courierNumber: awbNumber },
        ...(shipmentId ? [{ shipmentId }] : []),
      ],
    }
    : { shipmentId };

  const oldOrder = await OrderSummary.findOne(filter);

  if (!oldOrder) {
    throw new Error("Order not found");
  }

  const updatedOrderData = await applyIcarryUpdateToOrder(oldOrder, payload);

  return updatedOrderData;
};
const getCouponByCode = async (
  couponCode,
  categoryId = null,
  productId = null
) => {
  const today = new Date();

  const coupon = await Coupon.findOne({
    couponCode: couponCode.toUpperCase(),
    isActive: true,
    startDate: { $lte: today },
    $or: [{ endDate: null }, { endDate: { $gte: today } }],
  });

  if (!coupon) {
    return null;
  }

  // ✅ Important:
  // Do not check showOnWebsite here.
  // Because hidden coupon should also apply manually.

  // ✅ Product wise validation
  if (coupon.applyType === "product_wise") {
    if (!productId) {
      throw new Error("This coupon is valid for selected products only");
    }

    const isProductValid = coupon.products?.some(
      (id) => String(id) === String(productId)
    );

    if (!isProductValid) {
      throw new Error("Coupon not valid for this product");
    }
  }

  // ✅ Category wise validation only if category exists in coupon
  if (coupon.categories && coupon.categories.length > 0) {
    if (!categoryId) {
      throw new Error("This coupon is valid for selected categories only");
    }

    const isCategoryValid = coupon.categories?.some(
      (id) => String(id) === String(categoryId)
    );

    if (!isCategoryValid) {
      throw new Error("Coupon not valid for this category");
    }
  }

  return coupon;
};

export default {
  getUserByName,
  createIcarryShipmentForOrder,
  trackIcarryShipmentForOrder,
  cancelIcarryShipmentForOrder,
  icarryShipmentWebhookService,
  updateCartItemQty,
  generateProductCodes,
  validateAndUseCode,
  generateOtp,
  verifyOtp,
  updatePrimaryAddress,
  applyProductCode,
  getBanner,
  getResHeroSection,
  updateShippingAddress,
  getHeroSection,
  verifyCouponForCategories,
  addShippingAddress,
  getCouponsByCategory,
  searchProductsService,
  createCart,
  getCouponByCodeAndCategory,
  getProductBySlugService,
  getCartByUserId,
  createReturnRequestService,
  updateCartItems,
  cancelOrderService,
  generateInvoiceService,
  deleteCartItems,
  updateCartStatus,
  getUserByEmail,
  getUserById,
  createComplaint,
  createWishlist,
  deleteWishlistProduct,
  deleteWishlist,
  getWishlist,
  getOrderListByUser,
  createFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
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
  createOrderSummary,
  getOrderSummaryById,
  updateOrderSummaryById,
  deleteOrderSummaryById,
  createVisitEntryService,
  getOrdersByUserId,
  getAllOrders,
  getOrdersByUser,
  saveContact,
  deleteUser,
  getAllContacts,
  getContactById,
  createWarranty,
  getWarrantiesByUserId,
  getAllWarranties,
  getCoupon,
  getCouponById,
  getBlog,
  getAboutUsPage,
  getAboutUsById,
  getAllQuickFix,
  getQuickFixById,
  getQuickFixByProductAndProblem,
  getProblem,
  getBrand,
  getBlogContainsByBlogId,
  getProductsByCategory,
  createRazorpayOrderService,
  getProductByNameService,
  removeCartItem,
  getCouponByCode,
};
