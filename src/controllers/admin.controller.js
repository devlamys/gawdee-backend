import adminService from "../services/admin.service.js";
import { sendSuccessResponse } from "../utils/ApiMessage.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";
import RotexOrderSummary from "../models/orderSummary.model.js";
import mongoose from "mongoose";

const getFaqs = catchAsync(async (req, res) => {
  const faqs = await adminService.getFaqs(req.body);
  sendSuccessResponse(res, "get", faqs);
});
const createLabel = catchAsync(async (req, res) => {
  const label = await adminService.createLabel(req.body);
  res.status(httpStatus.CREATED).send({ label });
});

const getLabels = catchAsync(async (req, res) => {
  const label = await adminService.getLabels(req.body);
  res.status(httpStatus.OK).send({ label });
});

const updateLabel = catchAsync(async (req, res) => {
  const label = await adminService.updateLabel(req.params.id, req.body);
  res.status(httpStatus.OK).send({ label });
});

const deleteLabel = catchAsync(async (req, res) => {
  const label = await adminService.deleteLabel(req.params.id);
  res.status(httpStatus.OK).send({ label });
});

const createBrand = catchAsync(async (req, res) => {
  const brand = await adminService.createBrand(req.body);
  res.status(httpStatus.CREATED).send({ brand });
});

const getBrand = catchAsync(async (req, res) => {
  const brand = await adminService.getBrand(req.body);
  res.status(httpStatus.OK).send({ brand });
});

const updateBrand = catchAsync(async (req, res) => {
  const brand = await adminService.updateBrand(req.params.id, req.body);
  res.status(httpStatus.OK).send({ brand });
});

const deleteBrand = catchAsync(async (req, res) => {
  const brand = await adminService.deleteBrand(req.params.id);
  res.status(httpStatus.OK).send({ brand });
});

const createCollection = catchAsync(async (req, res) => {
  const data = await adminService.createCollection(req.body);
  res.status(httpStatus.CREATED).send({ data });
});

const getCollection = catchAsync(async (req, res) => {
  const data = await adminService.getCollection(req.body);
  res.status(httpStatus.OK).send({ data });
});

const updateCollection = catchAsync(async (req, res) => {
  const data = await adminService.updateCollection(req.params.id, req.body);
  res.status(httpStatus.OK).send({ data });
});

const deleteCollection = catchAsync(async (req, res) => {
  const data = await adminService.deleteCollection(req.params.id);
  res.status(httpStatus.OK).send({ data });
});

const createCategory = catchAsync(async (req, res) => {
  const category = await adminService.createCategory(req.body);
  res.status(httpStatus.CREATED).send({ category });
});

const getCategories = catchAsync(async (req, res) => {
  const category = await adminService.getCategories(req.body);
  res.status(httpStatus.OK).send({ category });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await adminService.updateCategory(req.params.id, req.body);
  res.status(httpStatus.OK).send({ category });
});

const deleteCategory = catchAsync(async (req, res) => {
  const category = await adminService.deleteCategory(req.params.id);
  res.status(httpStatus.OK).send({ category });
});

const createSubCategory = catchAsync(async (req, res) => {
  const category = await adminService.createSubCategory(req.body);
  res.status(httpStatus.CREATED).send({ category });
});

const getSubCategories = catchAsync(async (req, res) => {
  const category = await adminService.getSubCategories(req.body);
  res.status(httpStatus.OK).send({ category });
});

const getSubCategoryByCategoryId = catchAsync(async (req, res) => {
  const category = await adminService.getSubCategoryByCategoryId(
    req.params.id,
    req.body
  );
  res.status(httpStatus.OK).send({ category });
});

const updateSubCategory = catchAsync(async (req, res) => {
  const category = await adminService.updateSubCategory(
    req.params.id,
    req.body
  );
  res.status(httpStatus.OK).send({ category });
});

const deleteSubCategory = catchAsync(async (req, res) => {
  const category = await adminService.deleteSubCategory(req.params.id);
  res
    .status(httpStatus.OK)
    .send({ category, Message: "Delete SuccessFully...!" });
});

const createProduct = catchAsync(async (req, res) => {
  const product = await adminService.createProduct(req.body);
  res.status(httpStatus.CREATED).send({ product });
});

const getProducts = catchAsync(async (req, res) => {
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");

  const product = await adminService.getProducts(req.query);

  res.status(httpStatus.OK).send({ product });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await adminService.updateProduct(req.params.id, req.body);
  res.status(httpStatus.OK).send({ product });
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await adminService.deleteProduct(req.params.id);
  res.status(httpStatus.OK).send({ product });
});

// const getProductsById = catchAsync(async (req, res) => {
//     const product = await adminService.getProductsById(req.params.id);
//     res.status(httpStatus.OK).send({ product });
//   });

const getProductsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { color } = req.query;

    const product = await adminService.getProductsById(id, color);

    res.set("Cache-Control", "public, max-age=300");

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await adminService.getProductsByCategory(categoryId);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRelatedProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { product, relatedProducts } =
    await adminService.getRelatedProduct(productId);
  res.status(httpStatus.OK).send({ product, relatedProducts });
});

const getFeaturedProducts = catchAsync(async (req, res) => {
  const products = await adminService.getFeaturedProducts();
  res.status(httpStatus.OK).send({
    success: true,
    message: "Featured products fetched successfully",
    data: products,
  });
});

const addAttribute = catchAsync(async (req, res) => {
  const attribute = await adminService.createAttribute(req.body);
  res.status(httpStatus.CREATED).send({ attribute });
});

const getAttributes = catchAsync(async (req, res) => {
  const attribute = await adminService.getAttributes(req.body);
  res.status(httpStatus.OK).send({ attribute });
});

const updateAttribute = catchAsync(async (req, res) => {
  const attribute = await adminService.updateAttribute(req.params.id, req.body);
  res.status(httpStatus.OK).send({ attribute });
});

const deleteAttribute = catchAsync(async (req, res) => {
  const attribute = await adminService.deleteAttribute(req.params.id);
  res.status(httpStatus.OK).send({ attribute });
});

const deleteFAQ = catchAsync(async (req, res) => {
  const { question } = req.body;
  const attribute = await adminService.deleteFAQ(req.params.id, question);
  res.status(httpStatus.OK).send({ attribute });
});

const getOrderList = catchAsync(async (req, res) => {
  const { status } = req.query;
  const orderList = await adminService.getOrderList(status);
  res.status(httpStatus.OK).send({ orderList });
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await adminService.getOrderById(req.params.id);
  res.status(httpStatus.OK).send({ order });
});

const addShippingStatus = catchAsync(async (req, res) => {
  const statusData = await adminService.createShippingStatus(req.body);
  res.status(httpStatus.CREATED).send({ statusData });
});

const getShippingStatus = catchAsync(async (req, res) => {
  const statusData = await adminService.getShippingStatus(req.body);
  res.status(httpStatus.OK).send({ statusData });
});

const updateShippingStatus = catchAsync(async (req, res) => {
  const statusData = await adminService.updateShippingStatus(
    req.params.id,
    req.body
  );
  res.status(httpStatus.OK).send({ statusData });
});

const deleteShippingStatus = catchAsync(async (req, res) => {
  const statusData = await adminService.deleteShippingStatus(req.params.id);
  res.status(httpStatus.OK).send({ statusData });
});

const addOrderTracking = catchAsync(async (req, res) => {
  const trackingData = await adminService.createOrderTacking(
    req.params.id,
    req.body.status
  );
  res.status(httpStatus.CREATED).send({ trackingData });
});

const getOrderTracking = catchAsync(async (req, res) => {
  const trackingData = await adminService.getOrderTracking(req.body);
  res.status(httpStatus.OK).send({ trackingData });
});

const updateOrderTracking = catchAsync(async (req, res) => {
  const trackingData = await adminService.updateOrderTracking(
    req.params.id,
    req.body
  );
  res.status(httpStatus.OK).send({ trackingData });
});

const deleteOrderTracking = catchAsync(async (req, res) => {
  const trackingData = await adminService.deleteOrderTracking(req.params.id);
  res.status(httpStatus.OK).send({ trackingData });
});

const createWalletAmount = catchAsync(async (req, res) => {
  const amountData = await adminService.createWalletAmount(req.body);
  res.status(httpStatus.CREATED).send({ amountData });
});

const getWalletAmount = catchAsync(async (req, res) => {
  const amountData = await adminService.getWalletAmount(req.body);
  res.status(httpStatus.OK).send({ amountData });
});

const updateWalletAmount = catchAsync(async (req, res) => {
  const amountData = await adminService.updateWalletAmount(
    req.params.id,
    req.body
  );
  res.status(httpStatus.OK).send({ amountData });
});

const deleteWalletAmount = catchAsync(async (req, res) => {
  const amountData = await adminService.deleteWalletAmount(req.params.id);
  res.status(httpStatus.OK).send({ amountData });
});

const createTag = catchAsync(async (req, res) => {
  const brand = await adminService.createTag(req.body);
  res.status(httpStatus.CREATED).send({ brand });
});

const getTag = catchAsync(async (req, res) => {
  const brand = await adminService.getTag(req.body);
  res.status(httpStatus.OK).send({ brand });
});

const updateTag = catchAsync(async (req, res) => {
  const brand = await adminService.updateTag(req.params.id, req.body);
  res.status(httpStatus.OK).send({ brand });
});

const deleteTag = catchAsync(async (req, res) => {
  const brand = await adminService.deleteTag(req.params.id);
  res.status(httpStatus.OK).send({ brand });
});

const createCoupon = catchAsync(async (req, res) => {
  const coupon = await adminService.createCoupon(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
});

const getCoupon = catchAsync(async (req, res) => {
  const coupons = await adminService.getCoupon();
  res.status(httpStatus.OK).json({
    success: true,
    data: coupons,
  });
});

const getCouponById = catchAsync(async (req, res) => {
  const coupon = await adminService.getCouponById(req.params.id);
  res.status(httpStatus.OK).json({
    success: true,
    data: coupon,
  });
});

const updateCoupon = catchAsync(async (req, res) => {
  const coupon = await adminService.updateCoupon(req.params.id, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Coupon updated successfully",
    data: coupon,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const coupon = await adminService.deleteCoupon(req.params.id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Coupon deleted successfully",
    data: coupon,
  });
});

const addProductStatus = catchAsync(async (req, res) => {
  const statusData = await adminService.createProductStatus(req.body);
  res.status(httpStatus.CREATED).send({ statusData });
});

const getProductStatus = catchAsync(async (req, res) => {
  const statusData = await adminService.getProductStatus(req.body);
  res.status(httpStatus.OK).send({ statusData });
});

const updateProductStatus = catchAsync(async (req, res) => {
  const statusData = await adminService.updateProductStatus(
    req.params.id,
    req.body
  );
  res.status(httpStatus.OK).send({ statusData });
});

const deleteProductStatus = catchAsync(async (req, res) => {
  const statusData = await adminService.deleteProductStatus(req.params.id);
  res.status(httpStatus.OK).send({ statusData });
});

const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    console.log("Received Order ID:", orderId);

    const updatedOrder = adminService.updatePaymentStatusService(
      orderId,
      paymentStatus
    );

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}.`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { orderId } = req.params;
    const { orderStatus, courierName, courierNumber } = req.body;

    const order = await RotexOrderSummary.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = orderStatus;

    if (courierName) order.courierName = courierName;
    if (courierNumber) order.courierNumber = courierNumber;

    console.log("courierName", courierName);
    console.log("courierNumber", courierNumber);

    await order.save();

    return res
      .status(200)
      .json({ message: "Order updated successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const addAboutUsPage = async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    const result = await adminService.createAboutUsPage(data, file);

    res.status(200).json({
      success: true,
      message: "About page updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Add About Us Page Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getAboutUsPage = catchAsync(async (req, res) => {
  const AboutUs = await adminService.getAboutUsPage();

  res.status(httpStatus.OK).send({
    success: true,
    AboutUs,
  });
});

const getAboutUsById = catchAsync(async (req, res) => {
  const AboutUs = await adminService.getAboutUsById(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    AboutUs,
  });
});

const updateAboutUsPage = catchAsync(async (req, res) => {
  const AboutUs = await adminService.updateAboutUsPage(req.params.id, req.body);

  res.status(httpStatus.OK).send({
    success: true,
    message: "About page updated successfully",
    AboutUs,
  });
});

const deleteAboutUsPage = catchAsync(async (req, res) => {
  const AboutUs = await adminService.deleteAboutUsPage(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "About page deleted successfully",
    AboutUs,
  });
});

const getBlogByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const blog = await adminService.getBlogByTitle(title);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ data: blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addBlog = catchAsync(async (req, res) => {
  const post = await adminService.createBlog(req.body);
  console.log("req.body", req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Blog post created successfully",
    data: post,
  });
});

const getBlog = catchAsync(async (req, res) => {
  const posts = await adminService.getBlog();

  res.status(httpStatus.OK).send({
    success: true,
    message: "Blog posts fetched successfully",
    data: posts,
  });
});

const getBlogById = catchAsync(async (req, res) => {
  const post = await adminService.getBlogById(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Blog post fetched successfully",
    data: post,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const post = await adminService.updateBlog(req.params.id, req.body);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Blog post updated successfully",
    data: post,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  await adminService.deleteBlog(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Blog post deleted successfully",
  });
});

const createBlogContains = catchAsync(async (req, res) => {
  console.log("req.body", req.body);
  const blog = await adminService.createBlogContains(req.body);
  res.status(httpStatus.CREATED).send({ blog });
});

const getAllBlogContains = catchAsync(async (req, res) => {
  const blog = await adminService.getAllBlogContains(req.body);
  res.status(httpStatus.OK).send({ blog });
});

const getBlogContainsBYBlogId = catchAsync(async (req, res) => {
  const blog = await adminService.getBlogContainsBYBlogId(req.params.id);
  res.status(httpStatus.OK).send({ blog });
});

const getBlogContainsByTitle = catchAsync(async (req, res) => {
  const { title } = req.query;
  console.log("title", title);
  if (!title) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: "Title is required" });
  }

  const blogDetails = await adminService.getBlogContainsByTitle(title);
  console.log("blogDetails", blogDetails);
  if (!blogDetails) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ error: "Blog details not found" });
  }

  res.status(httpStatus.OK).json(blogDetails);
});
const updateBlogContains = catchAsync(async (req, res) => {
  const blog = await adminService.updateBlog(req.params.id, req.body);
  res.status(httpStatus.OK).send({ blog });
});

const deleteBlogContains = catchAsync(async (req, res) => {
  const blog = await adminService.deleteBlogContains(req.params.id);
  res.status(httpStatus.OK).send({ blog });
});

const addBanner = catchAsync(async (req, res) => {
  const blog = await adminService.createBanner(req.body);
  res.status(httpStatus.CREATED).send({ blog });
});

const getBanner = catchAsync(async (req, res) => {
  const blog = await adminService.getBanner(req.body);
  res.status(httpStatus.OK).send({ blog });
});

const updateBanner = catchAsync(async (req, res) => {
  const blog = await adminService.updateBanner(req.params.id, req.body);
  res.status(httpStatus.OK).send({ blog });
});

const deleteBanner = catchAsync(async (req, res) => {
  const blog = await adminService.deleteBanner(req.params.id);
  res.status(httpStatus.OK).send({ blog });
});

const uploadWarranty = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const results = await adminService.uploadWarrantyData(data);

    res
      .status(200)
      .json({ message: "Warranty data uploaded successfully", results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateWarranty = async (req, res) => {
  try {
    const { warrantyNumbers } = req.body;

    if (
      !warrantyNumbers ||
      !Array.isArray(warrantyNumbers) ||
      warrantyNumbers.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Warranty numbers are required and must be an array" });
    }

    const { matched, invalid } =
      await adminService.validateWarrantyNumbers(warrantyNumbers);

    res.status(200).json({
      status: "success",
      matched,
      invalid,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMultipleWarrantyNumbers = async (req, res) => {
  try {
    const warrantyData = req.body;

    if (!Array.isArray(warrantyData) || warrantyData.length === 0) {
      return res
        .status(400)
        .json({
          error: "Invalid data format. Provide an array of warranty data.",
        });
    }

    const results =
      await adminService.addWarrantyNumbersForProducts(warrantyData);

    res.status(201).json({
      message: "Warranty numbers added successfully for products",
      results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateShippingStatusService = async (req, res) => {
  const { orderId } = req.params;
  const { shippingStatus } = req.body;

  try {
    if (!shippingStatus) {
      return res.status(400).json({ error: "Shipping status is required." });
    }

    const updatedOrder = await adminService.updateShippingStatusService(
      orderId,
      shippingStatus
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    return res.status(200).json({
      message: "Shipping status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating shipping status:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const getOrdersByShippingStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Shipping status name is required.",
      });
    }

    const orders = await adminService.getOrdersByShippingStatusService(status);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No orders found for shipping status "${status}".`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Orders fetched successfully for shipping status "${status}".`,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders by shipping status:", error.message);
    return res.status(500).json({
      success: false,
      message: `Error fetching orders by shipping status: ${error.message}`,
    });
  }
};
const getContacts = async (req, res) => {
  try {
    const contacts = await adminService.getAllContacts();
    res.status(200).json({ contacts });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const updateOrderSummaryByIdHandler = async (req, res) => {
  try {
    const order = await adminService.updateOrderSummaryById(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Order updated successfully",
        data: order,
      });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteOrderSummaryById = async (req, res) => {
  try {
    const order = await adminService.deleteOrderSummaryById(req.params.id);
    res
      .status(200)
      .json({
        success: true,
        message: "Order deleted successfully",
        data: order,
      });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await adminService.getAllComplaints();
    res.status(200).json({ complaints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await adminService.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const complaint = await adminService.updateComplaint(
      req.params.id,
      req.body
    );
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await adminService.deleteComplaint(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllQuickFix = async (req, res) => {
  try {
    const data = await adminService.getAllQuickFix();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuickFixById = async (req, res) => {
  try {
    const data = await adminService.getQuickFixById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuickFix = async (req, res) => {
  try {
    const data = await adminService.updateQuickFix(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuickFix = async (req, res) => {
  try {
    const Data = await adminService.deleteQuickFix(req.params.id);
    if (!Data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuickFix = async (req, res) => {
  try {
    const quickFix = await adminService.createQuickFix(req.body);
    res.status(201).json({ quickFix });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllWarranties = async (req, res) => {
  try {
    const warranties = await adminService.getAllWarranties();
    res.status(200).json({ warranties });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const deleteContactUs = async (req, res) => {
  try {
    const Data = await adminService.deleteContactUs(req.params.id);
    if (!Data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendOrderConfirmation = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required!" });
    }

    const response = await adminService.sendOrderConfirmationWhatsApp(orderId);
    res.status(response.success ? 200 : 500).json(response);
  } catch (error) {
    console.error("Error in sendOrderConfirmation Controller:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const sendOfferNotification = async (req, res) => {
  try {
    const { userId, offerDetails } = req.body;

    if (!userId || !offerDetails) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User ID and offer details are required!",
        });
    }

    const response = await adminService.sendOfferNotificationWhatsApp(
      userId,
      offerDetails
    );
    res.status(response.success ? 200 : 500).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const sendBulkOfferNotification = async (req, res) => {
  try {
    const { offerDetails } = req.body;

    if (!offerDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Offer details are required!" });
    }

    const response =
      await adminService.sendBulkOfferNotificationWhatsApp(offerDetails);
    res.status(response.success ? 200 : 500).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const summary = await adminService.getDashboardData();
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error("Error fetching order summary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const notifyOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await RotexOrderSummary.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const phone = order.customerDetails.phone;
    const orderStatus = order.orderStatus;
    const trackingNumber = order.courierNumber || "N/A";
    const courierName = order.courierName || "N/A";
    const finalAmount = order.finalAmount;

    const result = await adminService.sendOrderUpdateWhatsApp({
      phone,
      orderStatus,
      trackingNumber,
      courierName,
      finalAmount,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "WhatsApp notification sent",
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const getCartByUserId = catchAsync(async (req, res) => {
  const data = await adminService.getCartByUserId(req.params.userId);
  sendSuccessResponse(res, "get", data);
});

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await adminService.getUserById(userId);

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

const applyCoupon = catchAsync(async (req, res) => {
  const { couponCode, productIds } = req.body;

  if (!couponCode || !Array.isArray(productIds)) {
    return res
      .status(400)
      .json({ success: false, message: "Missing couponCode or productIds" });
  }

  try {
    const coupon = await adminService.verifyCouponForProducts(
      couponCode,
      productIds
    );

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discount: coupon.amount,
      amountType: coupon.amountType,
      coupon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

const verifyCouponByCategory = catchAsync(async (req, res) => {
  const { couponCode, categoryIds } = req.body;

  if (!couponCode || !Array.isArray(categoryIds)) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    const coupon = await adminService.verifyCouponForCategories(
      couponCode,
      categoryIds
    );

    return res.status(200).json({
      valid: true,
      data: coupon,
    });
  } catch (error) {
    return res.status(400).json({
      valid: false,
      message: error.message || "Coupon verification failed",
    });
  }
});

const createHeroSection = catchAsync(async (req, res) => {
  const data = await adminService.createHeroSection(req.body);
  res.status(httpStatus.CREATED).send({ data });
});

const getHeroSection = catchAsync(async (req, res) => {
  const data = await adminService.getHeroSection(req.body);
  res.status(httpStatus.OK).send({ data });
});

const updateHeroSection = catchAsync(async (req, res) => {
  const data = await adminService.updateHeroSection(req.params.id, req.body);
  res.status(httpStatus.OK).send({ data });
});

const deleteHeroSection = catchAsync(async (req, res) => {
  const data = await adminService.deleteHeroSection(req.params.id);
  res.status(httpStatus.OK).send({ data });
});

const createResHeroSection = catchAsync(async (req, res) => {
  const data = await adminService.createResHeroSection(req.body);
  res.status(httpStatus.CREATED).send({ data });
});

const getResHeroSection = catchAsync(async (req, res) => {
  const data = await adminService.getResHeroSection(req.body);
  res.status(httpStatus.OK).send({ data });
});

const updateResHeroSection = catchAsync(async (req, res) => {
  const data = await adminService.updateResHeroSection(req.params.id, req.body);
  res.status(httpStatus.OK).send({ data });
});

const deleteResHeroSection = catchAsync(async (req, res) => {
  const data = await adminService.deleteResHeroSection(req.params.id);
  res.status(httpStatus.OK).send({ data });
});

const createProductOption = catchAsync(async (req, res) => {
  const option = await adminService.createProductOption(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Product option created successfully",
    data: option,
  });
});

const getProductOptions = catchAsync(async (req, res) => {
  const options = await adminService.getProductOptions();

  res.status(httpStatus.OK).send({
    success: true,
    data: options,
  });
});

const updateProductOption = catchAsync(async (req, res) => {
  const option = await adminService.updateProductOption(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Product option updated successfully",
    data: option,
  });
});

const deleteProductOption = catchAsync(async (req, res) => {
  await adminService.deleteProductOption(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Product option deleted successfully",
  });
});

const createFlashSale = catchAsync(async (req, res) => {
  const sale = await adminService.createFlashSale(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Flash sale created successfully",
    data: sale,
  });
});

const getFlashSales = catchAsync(async (req, res) => {
  const sales = await adminService.getFlashSales();

  res.status(httpStatus.OK).send({
    success: true,
    data: sales,
  });
});

const updateFlashSale = catchAsync(async (req, res) => {
  const sale = await adminService.updateFlashSale(req.params.id, req.body);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Flash sale updated successfully",
    data: sale,
  });
});

const deleteFlashSale = catchAsync(async (req, res) => {
  await adminService.deleteFlashSale(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Flash sale deleted successfully",
  });
});

const createTax = catchAsync(async (req, res) => {
  const tax = await adminService.createTax(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Tax created successfully",
    data: tax,
  });
});

const getTaxes = catchAsync(async (req, res) => {
  const taxes = await adminService.getTaxes();

  res.status(httpStatus.OK).send({
    success: true,
    data: taxes,
  });
});

const updateTax = catchAsync(async (req, res) => {
  const tax = await adminService.updateTax(req.params.id, req.body);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Tax updated successfully",
    data: tax,
  });
});

const deleteTax = catchAsync(async (req, res) => {
  await adminService.deleteTax(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Tax deleted successfully",
  });
});

const createSpecificationGroup = catchAsync(async (req, res) => {
  const group = await adminService.createSpecificationGroup(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Specification group created successfully",
    data: group,
  });
});

const getSpecificationGroups = catchAsync(async (req, res) => {
  const groups = await adminService.getSpecificationGroups();

  res.status(httpStatus.OK).send({
    success: true,
    data: groups,
  });
});

const updateSpecificationGroup = catchAsync(async (req, res) => {
  const group = await adminService.updateSpecificationGroup(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Specification group updated successfully",
    data: group,
  });
});

const deleteSpecificationGroup = catchAsync(async (req, res) => {
  await adminService.deleteSpecificationGroup(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Specification group deleted successfully",
  });
});

const createSpecificationAttribute = catchAsync(async (req, res) => {
  const attribute = await adminService.createSpecificationAttribute(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Specification attribute created successfully",
    data: attribute,
  });
});

const getSpecificationAttributes = catchAsync(async (req, res) => {
  const attributes = await adminService.getSpecificationAttributes();

  res.status(httpStatus.OK).send({
    success: true,
    data: attributes,
  });
});

const updateSpecificationAttribute = catchAsync(async (req, res) => {
  const attribute = await adminService.updateSpecificationAttribute(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Specification attribute updated successfully",
    data: attribute,
  });
});

const deleteSpecificationAttribute = catchAsync(async (req, res) => {
  await adminService.deleteSpecificationAttribute(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Specification attribute deleted successfully",
  });
});

const createSpecificationTableGroup = catchAsync(async (req, res) => {
  const group = await adminService.createSpecificationTableGroup(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Specification table group created successfully",
    data: group,
  });
});

const getSpecificationTableGroups = catchAsync(async (req, res) => {
  const groups = await adminService.getSpecificationTableGroups();

  res.status(httpStatus.OK).send({
    success: true,
    data: groups,
  });
});

const updateSpecificationTableGroup = catchAsync(async (req, res) => {
  const group = await adminService.updateSpecificationTableGroup(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Specification table group updated successfully",
    data: group,
  });
});

const deleteSpecificationTableGroup = catchAsync(async (req, res) => {
  await adminService.deleteSpecificationTableGroup(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Specification table group deleted successfully",
  });
});

const createBlogCategory = catchAsync(async (req, res) => {
  const category = await adminService.createBlogCategory(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Blog category created successfully",
    data: category,
  });
});

const getBlogCategories = catchAsync(async (req, res) => {
  const categories = await adminService.getBlogCategories();

  res.status(httpStatus.OK).send({
    success: true,
    data: categories,
  });
});

const updateBlogCategory = catchAsync(async (req, res) => {
  const category = await adminService.updateBlogCategory(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Blog category updated successfully",
    data: category,
  });
});

const deleteBlogCategory = catchAsync(async (req, res) => {
  await adminService.deleteBlogCategory(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Blog category deleted successfully",
  });
});

const createBlogTag = catchAsync(async (req, res) => {
  const tag = await adminService.createBlogTag(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Blog tag created successfully",
    data: tag,
  });
});

const getBlogTags = catchAsync(async (req, res) => {
  const tags = await adminService.getBlogTags();

  res.status(httpStatus.OK).send({
    success: true,
    data: tags,
  });
});

const updateBlogTag = catchAsync(async (req, res) => {
  const tag = await adminService.updateBlogTag(req.params.id, req.body);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Blog tag updated successfully",
    data: tag,
  });
});

const deleteBlogTag = catchAsync(async (req, res) => {
  await adminService.deleteBlogTag(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Blog tag deleted successfully",
  });
});

const createTransaction = catchAsync(async (req, res) => {
  const transaction = await adminService.createTransaction(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Transaction created successfully",
    data: transaction,
  });
});

const getTransactions = catchAsync(async (req, res) => {
  const transactions = await adminService.getTransactions();

  res.status(httpStatus.OK).send({
    success: true,
    data: transactions,
  });
});

const getTransactionById = catchAsync(async (req, res) => {
  const transaction = await adminService.getTransactionById(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    data: transaction,
  });
});

const updateTransaction = catchAsync(async (req, res) => {
  const transaction = await adminService.updateTransaction(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Transaction updated successfully",
    data: transaction,
  });
});

const deleteTransaction = catchAsync(async (req, res) => {
  await adminService.deleteTransaction(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Transaction deleted successfully",
  });
});

const createSubscriber = catchAsync(async (req, res) => {
  const subscriber = await adminService.createSubscriber(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Subscribed successfully",
    data: subscriber,
  });
});

const getSubscribers = catchAsync(async (req, res) => {
  const subscribers = await adminService.getSubscribers();

  res.status(httpStatus.OK).send({
    success: true,
    data: subscribers,
  });
});

const updateSubscriber = catchAsync(async (req, res) => {
  const subscriber = await adminService.updateSubscriber(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Subscriber updated successfully",
    data: subscriber,
  });
});

const deleteSubscriber = catchAsync(async (req, res) => {
  await adminService.deleteSubscriber(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Subscriber deleted successfully",
  });
});

const getMostLovedController = catchAsync(async (req, res) => {
  const data = await adminService.getMostLoved();

  res.status(httpStatus.OK).json({
    success: true,
    data,
  });
});

const upsertMostLovedController = catchAsync(async (req, res) => {
  const data = await adminService.upsertMostLoved(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Most Loved section updated successfully",
    data,
  });
});

const getFeaturedController = catchAsync(async (req, res) => {
  const data = await adminService.getFeatured();

  res.status(httpStatus.OK).json({
    success: true,
    data,
  });
});

const upsertFeaturedController = catchAsync(async (req, res) => {
  const data = await adminService.upsertFeatured(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Featured section updated successfully",
    data,
  });
});

const getVideoSectionController = catchAsync(async (req, res) => {
  const data = await adminService.getVideoSection();

  res.status(httpStatus.OK).json({
    success: true,
    data,
  });
});

const upsertVideoSectionController = catchAsync(async (req, res) => {
  const data = await adminService.upsertVideoSection(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Video section updated successfully",
    data,
  });
});

const getNewProductSectionController = catchAsync(async (req, res) => {
  const data = await adminService.getNewProductSection();

  res.status(httpStatus.OK).json({
    success: true,
    data,
  });
});

const upsertNewProductSectionController = catchAsync(async (req, res) => {
  const data = await adminService.upsertNewProductSection(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "New Product section updated",
    data,
  });
});

const getAboutSection = async (req, res) => {
  try {
    const section = await adminService.getAboutSectionService();

    res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("GET ABOUT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch about section",
    });
  }
};

const saveAboutSection = async (req, res) => {
  try {
    const { title, description, image, visible, features } = req.body;

    const section = await adminService.saveAboutSectionService({
      title,
      description,
      image,
      visible,
      features,
    });

    res.status(200).json({
      success: true,
      data: section,
      message: "About section saved successfully",
    });
  } catch (error) {
    console.error("SAVE ABOUT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save about section",
    });
  }
};

const getWhyChoose = async (req, res) => {
  try {
    const data = await adminService.getWhyChooseService();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET WHY CHOOSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch section",
    });
  }
};

const saveWhyChoose = async (req, res) => {
  try {
    const { title, desc, visible, points } = req.body;

    const section = await adminService.saveWhyChooseService({
      title,
      desc,
      visible,
      points,
    });

    res.status(200).json({
      success: true,
      data: section,
      message: "Why Choose section saved successfully",
    });
  } catch (error) {
    console.error("SAVE WHY CHOOSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save section",
    });
  }
};

const getPuritySection = async (req, res) => {
  try {
    const data = await adminService.getPuritySectionService();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET PURITY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch section",
    });
  }
};

const savePuritySection = async (req, res) => {
  try {
    const { title, visible, cards } = req.body;

    const section = await adminService.savePuritySectionService({
      title,
      visible,
      cards,
    });

    res.status(200).json({
      success: true,
      data: section,
      message: "Purity section saved successfully",
    });
  } catch (error) {
    console.error("SAVE PURITY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save section",
    });
  }
};

const getFAQSection = async (req, res) => {
  try {
    const data = await adminService.getFAQService();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET FAQ ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ section",
    });
  }
};

const saveFAQSection = async (req, res) => {
  try {
    const { title1, title2, description, tags, visible, faqs } = req.body;

    const section = await adminService.saveFAQService({
      title1,
      title2,
      description,
      tags,
      visible,
      faqs,
    });

    res.status(200).json({
      success: true,
      data: section,
      message: "FAQ section saved successfully",
    });
  } catch (error) {
    console.error("SAVE FAQ ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save FAQ section",
    });
  }
};

const getTestimonialSection = async (req, res) => {
  try {
    const data = await adminService.getTestimonialService();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET TESTIMONIAL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
    });
  }
};

const saveTestimonialSection = async (req, res) => {
  try {
    const { title1, title2, desc, visible, testimonials } = req.body;

    const section = await adminService.saveTestimonialService({
      title1,
      title2,
      desc,
      visible,
      testimonials,
    });

    res.status(200).json({
      success: true,
      data: section,
      message: "Testimonials saved successfully",
    });
  } catch (error) {
    console.error("SAVE TESTIMONIAL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save testimonials",
    });
  }
};

const getInvoiceByOrderController = async (req, res) => {
  try {
    const invoice = await adminService.getInvoiceByOrderService({
      orderId: req.params.orderId,
      userId: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoiceController = async (req, res) => {
  try {
    const invoice = await adminService.getInvoiceByIdService({
      invoiceId: req.params.id,
      userId: req.user?._id,
    });

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllInvoicesController = async (req, res) => {
  try {
    const data = await adminService.getAllInvoicesService({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    });

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInvoiceController = async (req, res) => {
  try {
    const invoice = await adminService.updateInvoiceService({
      invoiceId: req.params.id,
      userId: req.user?._id,
      updateData: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInvoiceController = async (req, res) => {
  try {
    const result = await adminService.deleteInvoiceService({
      invoiceId: req.params.id,
      userId: req.user?._id,
    });

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const createDeliveryOption = async (req, res) => {
  try {
    const deliveryOption = await adminService.createDeliveryOptionService(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Delivery option created successfully",
      data: deliveryOption,
    });
  } catch (error) {
    console.error("Create delivery option error:", error);
    return sendError(res, error);
  }
};

const getAdminDeliveryOptions = async (req, res) => {
  try {
    const deliveryOptions = await adminService.getAdminDeliveryOptionsService();

    return res.status(200).json({
      success: true,
      deliveryOptions,
    });
  } catch (error) {
    console.error("Fetch admin delivery options error:", error);
    return sendError(res, error);
  }
};

const getCheckoutDeliveryOptions = async (req, res) => {
  try {
    const deliveryOptions =
      await adminService.getCheckoutDeliveryOptionsService();

    return res.status(200).json({
      success: true,
      deliveryOptions,
    });
  } catch (error) {
    console.error("Fetch checkout delivery options error:", error);
    return sendError(res, error);
  }
};

const getSingleDeliveryOption = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryOption =
      await adminService.getSingleDeliveryOptionService(id);

    return res.status(200).json({
      success: true,
      data: deliveryOption,
    });
  } catch (error) {
    console.error("Fetch single delivery option error:", error);
    return sendError(res, error);
  }
};

const updateDeliveryOption = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedDeliveryOption =
      await adminService.updateDeliveryOptionService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Delivery option updated successfully",
      data: updatedDeliveryOption,
    });
  } catch (error) {
    console.error("Update delivery option error:", error);
    return sendError(res, error);
  }
};

const deleteDeliveryOption = async (req, res) => {
  try {
    const { id } = req.params;

    await adminService.deleteDeliveryOptionService(id);

    return res.status(200).json({
      success: true,
      message: "Delivery option deleted successfully",
    });
  } catch (error) {
    console.error("Delete delivery option error:", error);
    return sendError(res, error);
  }
};

const getReportController = async (req, res) => {
  try {
    const data = await adminService.getDashboardReport();

    return res.status(200).json({
      success: true,
      message: "Report fetched successfully",
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getDashboardController = async (req, res) => {
  try {
    const dashboard = await adminService.getDashboardService();

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      dashboard,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard data",
    });
  }
};

const formatReview = (item) => {
  return {
    id: item._id,
    _id: item._id,

    customerName: item.customerName,
    name: item.customerName,

    productId: item.productId?._id || item.productId || null,
    productName: item.productName || item.productId?.name || "",
    product: item.productName || item.productId?.name || "",

    rating: item.rating,

    review: item.review,
    message: item.review,

    status:
      item.status === "approved"
        ? "approved"
        : item.status === "rejected"
          ? "rejected"
          : "pending",

    originalStatus: item.status,

    isActive: item.isActive,

    date: item.createdAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

const createCustomerReview = async (req, res) => {
  try {
    const { customerName, productId, productName, rating, review } = req.body;

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!review) {
      return res.status(400).json({
        success: false,
        message: "Review is required",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const createdReview = await adminService.createReviewService({
      customerName,
      productId: productId || null,
      productName,
      rating,
      review,
      status: "pending",
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: formatReview(createdReview),
    });
  } catch (error) {
    console.log("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

const getAllCustomerReviews = async (req, res) => {
  try {
    const reviews = await adminService.getAllReviewsService();

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews.map(formatReview),
    });
  } catch (error) {
    console.log("Get reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

const getCustomerReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const review = await adminService.getReviewByIdService(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: formatReview(review),
    });
  } catch (error) {
    console.log("Get review by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch review",
      error: error.message,
    });
  }
};

const updateCustomerReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const updatedReview = await adminService.updateReviewService(id, req.body);

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: formatReview(updatedReview),
    });
  } catch (error) {
    console.log("Update review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

const updateCustomerReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updatedReview = await adminService.updateReviewStatusService(
      id,
      status
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review status updated successfully",
      data: formatReview(updatedReview),
    });
  } catch (error) {
    console.log("Update review status error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update review status",
    });
  }
};

const approveCustomerReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const approvedReview = await adminService.approveReviewService(id);

    if (!approvedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review approved successfully",
      data: formatReview(approvedReview),
    });
  } catch (error) {
    console.log("Approve review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve review",
      error: error.message,
    });
  }
};

const rejectCustomerReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const rejectedReview = await adminService.rejectReviewService(id);

    if (!rejectedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review rejected successfully",
      data: formatReview(rejectedReview),
    });
  } catch (error) {
    console.log("Reject review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject review",
      error: error.message,
    });
  }
};

const deleteCustomerReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review id",
      });
    }

    const deletedReview = await adminService.softDeleteReviewService(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.log("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const reviews = await adminService.getReviewsByProductService(productId);

    return res.status(200).json({
      success: true,
      message: "Product reviews fetched successfully",
      data: reviews.map(formatReview),
    });
  } catch (error) {
    console.log("Get product reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product reviews",
      error: error.message,
    });
  }
};

const createInquiryCategory = catchAsync(async (req, res) => {
  const category = await adminService.createInquiryCategory(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Inquiry category created successfully",
    data: category,
  });
});

const getInquiryCategories = catchAsync(async (req, res) => {
  const categories = await adminService.getInquiryCategories();

  res.status(httpStatus.OK).send({
    success: true,
    data: categories,
  });
});

const updateInquiryCategory = catchAsync(async (req, res) => {
  const category = await adminService.updateInquiryCategory(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Inquiry category updated successfully",
    data: category,
  });
});

const deleteInquiryCategory = catchAsync(async (req, res) => {
  const category = await adminService.deleteInquiryCategory(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Inquiry category deleted successfully",
    data: category,
  });
});

/* ================= INQUIRY FORM CONTROLLERS ================= */

const createInquiry = catchAsync(async (req, res) => {
  const inquiry = await adminService.createInquiry(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Inquiry submitted successfully",
    data: inquiry,
  });
});

const getInquiries = catchAsync(async (req, res) => {
  const inquiries = await adminService.getInquiries();

  res.status(httpStatus.OK).send({
    success: true,
    data: inquiries,
  });
});

const getInquiryById = catchAsync(async (req, res) => {
  const inquiry = await adminService.getInquiryById(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    data: inquiry,
  });
});

const updateInquiryStatus = catchAsync(async (req, res) => {
  const inquiry = await adminService.updateInquiryStatus(
    req.params.id,
    req.body
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: "Inquiry status updated successfully",
    data: inquiry,
  });
});

const deleteInquiry = catchAsync(async (req, res) => {
  const inquiry = await adminService.deleteInquiry(req.params.id);

  res.status(httpStatus.OK).send({
    success: true,
    message: "Inquiry deleted successfully",
    data: inquiry,
  });
});

const getCouponsByProductController = async (req, res) => {
  try {
    const { productId } = req.params;

    const coupons = await adminService.getCouponsByProductService(productId);

    return res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",
      data: coupons,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch coupons",
    });
  }
};

const getInventoryProductsController = async (req, res) => {
  try {
    const data = await adminService.getInventoryProductsService(req.query);

    return res.status(200).json({
      success: true,
      message: "Inventory products fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get inventory products error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const addProductToInventoryController = async (req, res) => {
  try {
    const data = await adminService.addProductToInventoryService(req.body);

    return res.status(201).json({
      success: true,
      message: "Product added to inventory successfully",
      data,
    });
  } catch (error) {
    console.error("Add product to inventory error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updateInventoryStockController = async (req, res) => {
  try {
    const data = await adminService.updateInventoryStockService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Inventory stock updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update inventory stock error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updateInventoryStatusController = async (req, res) => {
  try {
    const data = await adminService.updateInventoryStatusService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Inventory status updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update inventory status error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updateInventoryWarehouseController = async (req, res) => {
  try {
    const data = await adminService.updateInventoryWarehouseService(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Inventory warehouse updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update inventory warehouse error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
const removeProductFromInventoryController = async (req, res) => {
  try {
    const data = await adminService.removeProductFromInventoryService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product removed from inventory successfully",
      data,
    });
  } catch (error) {
    console.error("Remove product from inventory error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export default {
  createCategory, getInventoryProductsController, addProductToInventoryController, updateInventoryStockController, updateInventoryStatusController, updateInventoryWarehouseController, removeProductFromInventoryController,
  getCategories,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getSubCategories,
  getSubCategoryByCategoryId,
  updateSubCategory,
  deleteSubCategory,
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsById,
  getRelatedProduct,
  getFeaturedProducts,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollection,
  applyCoupon,
  createLabel,
  deleteLabel,
  updateLabel,
  getLabels,
  addAttribute,
  getAttributes,
  updateAttribute,
  deleteAttribute,
  deleteBrand,
  updateBrand,
  getBrand,
  createBrand,
  deleteFAQ,
  getFaqs,
  getOrderList,
  getOrderById,
  addShippingStatus,
  getShippingStatus,
  updateShippingStatus,
  deleteShippingStatus,
  addOrderTracking,
  getOrderTracking,
  updateOrderTracking,
  deleteOrderTracking,
  createWalletAmount,
  getWalletAmount,
  updateWalletAmount,
  deleteWalletAmount,
  createTag,
  getTag,
  updateTag,
  deleteTag,
  createCoupon,
  getCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  addProductStatus,
  getProductStatus,
  updateProductStatus,
  deleteProductStatus,
  updatePaymentStatus,
  addAboutUsPage,
  getAboutUsPage,
  getAboutUsById,
  updateAboutUsPage,
  deleteAboutUsPage,
  addBlog,
  getBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogByTitle,
  addBanner,
  getBanner,
  updateBanner,
  deleteBanner,
  uploadWarranty,
  validateWarranty,
  addMultipleWarrantyNumbers,
  updateOrderStatus,
  updateShippingStatusService,
  getContacts,
  getOrdersByShippingStatus,
  updateOrderSummaryByIdHandler,
  getAllWarranties,
  deleteOrderSummaryById,
  deleteContactUs,
  sendOrderConfirmation,
  sendOfferNotification,
  sendBulkOfferNotification,
  getComplaintById,
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
  getAllQuickFix,
  getQuickFixById,
  updateQuickFix,
  deleteQuickFix,
  createQuickFix,
  getCartByUserId,
  verifyCouponByCategory,
  createBlogContains,
  getAllBlogContains,
  getBlogContainsBYBlogId,
  getBlogContainsByTitle,
  updateBlogContains,
  deleteBlogContains,
  getProductsByCategory,
  getDashboardData,
  notifyOrderStatus,
  getUserById,
  createHeroSection,
  getHeroSection,
  updateHeroSection,
  deleteHeroSection,
  createResHeroSection,
  getResHeroSection,
  updateResHeroSection,
  deleteResHeroSection,
  createProductOption,
  getProductOptions,
  updateProductOption,
  deleteProductOption,
  createFlashSale,
  getFlashSales,
  updateFlashSale,
  deleteFlashSale,
  createTax,
  getTaxes,
  updateTax,
  deleteTax,
  createSpecificationGroup,
  getSpecificationGroups,
  updateSpecificationGroup,
  deleteSpecificationGroup,
  createSpecificationAttribute,
  getSpecificationAttributes,
  updateSpecificationAttribute,
  deleteSpecificationAttribute,
  createSpecificationTableGroup,
  getSpecificationTableGroups,
  updateSpecificationTableGroup,
  deleteSpecificationTableGroup,
  createBlogCategory,
  getBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
  createBlogTag,
  getBlogTags,
  updateBlogTag,
  deleteBlogTag,
  createTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  createSubscriber,
  getSubscribers,
  updateSubscriber,
  deleteSubscriber,
  getMostLovedController,
  upsertMostLovedController,
  getFeaturedController,
  upsertFeaturedController,
  getVideoSectionController,
  upsertVideoSectionController,
  getNewProductSectionController,
  upsertNewProductSectionController,
  saveAboutSection,
  getAboutSection,
  getWhyChoose,
  saveWhyChoose,
  getPuritySection,
  savePuritySection,
  getFAQSection,
  saveFAQSection,
  getTestimonialSection,
  saveTestimonialSection,
  getInvoiceByOrderController,
  getAllInvoicesController,
  getInvoiceController,
  updateInvoiceController,
  deleteInvoiceController,
  createDeliveryOption,
  getAdminDeliveryOptions,
  getSingleDeliveryOption,
  getCheckoutDeliveryOptions,
  updateDeliveryOption,
  deleteDeliveryOption,
  getReportController,
  getDashboardController,
  createCustomerReview,
  getAllCustomerReviews,
  getCustomerReviewById,
  getReviewsByProduct,
  deleteCustomerReview,
  updateCustomerReview,
  updateCustomerReviewStatus,
  approveCustomerReview,
  rejectCustomerReview,
  createInquiryCategory,
  getInquiryCategories,
  updateInquiryCategory,
  deleteInquiryCategory,
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  getCouponsByProductController,
};
