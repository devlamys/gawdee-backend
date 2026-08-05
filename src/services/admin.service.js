import Category from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import SubCategory from "../models/subCategory.model.js";
import httpStatus from "http-status";
import Label from "../models/label.model.js";
import Attribute from "../models/attribute.model.js";
import Brand from "../models/brand.model.js";
import ShippingStatus from "../models/ShippingStatus.model.js";
import OrderTracking from "../models/orderTracking.model.js";
import { generateCouponCode } from "../utils/generateCode.js";
import Coupon from "../models/coupon.model.js";
import WalletAmount from "../models/walletAmount.model.js";
import Tag from "../models/tag.model.js";
import ProductStatus from "../models/productStatus.model.js";
import Order from "../models/order.model.js";
import { AboutUs } from "../models/aboutUs.model.js";
import Banner from "../models/banner.model.js";
import Warranty from "../models/warranty.model.js";
import Contact from "../models/contactUs.model.js";
import OrderSummary from "../models/orderSummary.model.js";
import Complaint from "../models/complaint.model.js";
import QuickFix from "../models/subCategory.model.js";
import axios from "axios";
import dotenv from "dotenv";
import { generateMessageTemplate } from "../utils/messageTemplate.js";
import { generateOfferMessageTemplate } from "../utils/offerTemplate.js";
import { User } from "../models/user.model.js";
import Product from "../models/product.model.js";
import BlogDetails from "../models/blogContent.model.js";
import moment from "moment";
import { buildOrderStatusTemplate } from "../utils/order-Template.js";
import Cart from "../models/cart.model.js";
import HeroSection from "../models/heroSection.model.js";
import ResponsiveHeroSection from "../models/resHeroSection.model.js";
import Option from "../models/option.model.js";
import FlashSale from "../models/flashSale.model.js";
import Tax from "../models/tax.model.js";
import SpecificationGroup from "../models/specificationGroup.model.js";
import SpecificationAttribute from "../models/specificationAttribure.model.js";
import SpecificationTable from "../models/specificationTable.model.js";
import BlogCategory from "../models/blogCategory.model.js";
import BlogTag from "../models/blogTag.model.js";
import PaymentTransaction from "../models/paymentTransaction.model.js";
import Newsletter from "../models/newsletter.model.js";
import Collection from "../models/collection.model.js";
import { MostLoved } from "../models/mostLoved.model.js";
import { Featured } from "../models/featured.model.js";
import { VideoSection } from "../models/videoSection.model.js";
import { NewProductSection } from "../models/newAddedSection.model.js";
import { AboutSection } from "../models/aboutUsSection.model.js";
import { WhyChoose } from "../models/whyChoose.model.js";
import { PuritySection } from "../models/purity.model.js";
import { FAQSection } from "../models/faq.model.js";
import { TestimonialSection } from "../models/testimonial.model.js";
import BlogSection from "../models/blog.model.js";
import Invoice from "../models/invoice.model.js";
import DeliveryOption from "../models/deliveryOption.model.js";
import customerReviewModel from "../models/customerReview.model.js";
import InquiryCategory from "../models/inquiryCategory.model.js";
import Inquiry from "../models/inquiry.model.js";
import mongoose from "mongoose";

const createBrand = async (brandData) => {
  if (!brandData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");

  return Brand.create(brandData);
};

const getBrand = async () => {
  return Brand.find();
};

const updateBrand = async (id, brandData) => {
  const updateData = await Brand.findByIdAndUpdate(id, brandData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
  return updateData;
};

const deleteBrand = async (id) => {
  const deleteId = await Brand.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
  return deleteId;
};

const createCollection = async (problemData) => {
  const existingCategory = await Collection.findOne({
    name: problemData?.name,
  });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Collection with name "${problemData.name}" already exists.`
    );
  }
  return Collection.create(problemData);
};

const getCollection = async () => {
  return Collection.find();
};

const updateCollection = async (id, problemData) => {
  const existingCategory = await Collection.findOne({
    name: problemData?.name,
  });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Collection with name "${problemData.name}" already exists.`
    );
  }
  const updateData = await Collection.findByIdAndUpdate(id, problemData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Collection not found");
  return updateData;
};

const deleteCollection = async (id) => {
  const deleteId = await Collection.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Collection not found");
  return deleteId;
};

const createLabel = async (labelData) => {
  if (!labelData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");
  const existingCategory = await Label.findOne({ name: labelData?.name });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Label with name "${labelData.name}" already exists.`
    );
  }
  return Label.create(labelData);
};

const getLabels = async () => {
  return Label.find();
};

const updateLabel = async (id, labelData) => {
  const existingCategory = await Label.findOne({ name: labelData?.name });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Label with name "${labelData.name}" already exists.`
    );
  }
  const updateData = await Label.findByIdAndUpdate(id, labelData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Label not found");
  return updateData;
};

const deleteLabel = async (id) => {
  const deleteId = await Label.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Label not found");
  return deleteId;
};
const createCategory = async (categoryData) => {
  if (!categoryData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");
  const existingCategory = await Category.findOne({ name: categoryData?.name });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Category with name "${categoryData.name}" already exists.`
    );
  }
  return Category.create(categoryData);
};

const getCategories = async () => {
  return Category.find();
};

const updateCategory = async (id, categoryData) => {
  const existingCategory = await Category.findOne({ name: categoryData?.name });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Category with name "${categoryData.name}" already exists.`
    );
  }
  const updateData = await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  return updateData;
};

const deleteCategory = async (id) => {
  const deleteId = await Category.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  return deleteId;
};

const createSubCategory = async (categoryData) => {
  if (!categoryData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");
  if (!categoryData.categoryId)
    throw new ApiError(httpStatus.BAD_REQUEST, "category id is required!");
  const existingCategory = await SubCategory.findOne({
    name: categoryData?.name,
  });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Sub Category with name "${categoryData.name}" already exists.`
    );
  }
  const findCategory = await Category.findById(categoryData?.categoryId);
  if (!findCategory)
    throw new ApiError(httpStatus.NOT_FOUND, "category not found");
  return SubCategory.create(categoryData);
};

const getSubCategories = async () => {
  return SubCategory.find();
};

const getSubCategoryByCategoryId = async (categoryId) => {
  if (!categoryId)
    throw new ApiError(httpStatus.BAD_REQUEST, "categoryId is required!");

  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists)
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  const subCategories = await SubCategory.find({ categoryId });

  return subCategories;
};

const updateSubCategory = async (id, categoryData) => {
  const existingCategory = await SubCategory.findOne({
    name: categoryData?.name,
  });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Sub Category with name "${categoryData.name}" already exists.`
    );
  }
  if (categoryData?.categoryId) {
    const findCategory = await Category.findById(categoryData?.categoryId);
    if (!findCategory)
      throw new ApiError(httpStatus.NOT_FOUND, "category not found");
  }

  const updateData = await SubCategory.findByIdAndUpdate(id, categoryData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  return updateData;
};

const deleteSubCategory = async (id) => {
  const deleteId = await SubCategory.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  return deleteId;
};

const createProduct = async (productData) => {
  return await Product.create(productData);
};

const getImageUrl = (img, type = "listing") => {
  if (!img) return null;

  // ✅ If database image is string
  if (typeof img === "string") return img;

  // ✅ Product listing should prefer small/optimized images if available
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

  // ✅ Product details can use original image first
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

  // ✅ ONLY database saved product.images
  // ✅ No variant images, no attribute images
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

    // ✅ ONLY database saved images
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

      // ✅ final database images only
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

      attributes: product.attributes || [],
      features: product.features || [],
      highlights: product.highlights || [],
      faqs: product.faqs || [],
      testimonials: product.testimonials || [],
      relatedProducts: product.relatedProducts || [],
      offers: product.offers || {},

      dimensions: product.dimensions || {},
      specificationTableId: product.specificationTableId || null,

      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",

      taxId: product.taxId || null,

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

const getFaqs = async () => {
  const products = Product.find();

  let allFAQs = [];
  let seenQuestions = new Set();

  (await products).forEach((product) => {
    if (product.productFAQs && Array.isArray(product?.productFAQs)) {
      product?.productFAQs.forEach((faq) => {
        if (!seenQuestions.has(faq?.question)) {
          allFAQs.push(faq);
          seenQuestions.add(faq?.question);
        }
      });
    }
  });
  return allFAQs;
};

const getProductThumbnail = (product) => {
  if (!product) return null;

  if (product.thumbnail) {
    return product.thumbnail;
  }

  if (product.image) {
    return product.image;
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }

  if (Array.isArray(product.colorImages) && product.colorImages.length > 0) {
    const firstColor = product.colorImages[0];

    if (Array.isArray(firstColor.images) && firstColor.images.length > 0) {
      return firstColor.images[0];
    }
  }

  return null;
};

const getColorImages = (product, color = null) => {
  if (!product) return [];

  const normalizeImageValue = (img) => {
    if (!img) return null;

    if (typeof img === "string") return img;

    return (
      img?.url ||
      img?.image ||
      img?.path ||
      img?.src ||
      img?.secure_url ||
      img?.thumb ||
      img?.thumbnail ||
      null
    );
  };

  if (color && Array.isArray(product.colorImages)) {
    const selectedColor = product.colorImages.find(
      (item) =>
        item?.color?.toString().toLowerCase() ===
        color?.toString().toLowerCase()
    );

    if (selectedColor && Array.isArray(selectedColor.images)) {
      return selectedColor.images.map(normalizeImageValue).filter(Boolean);
    }
  }

  if (color && Array.isArray(product.attributes)) {
    const selectedAttribute = product.attributes.find(
      (item) =>
        item?.name?.toString().toLowerCase() ===
          color?.toString().toLowerCase() ||
        item?.color?.toString().toLowerCase() ===
          color?.toString().toLowerCase() ||
        item?.value?.toString().toLowerCase() ===
          color?.toString().toLowerCase()
    );

    if (selectedAttribute && Array.isArray(selectedAttribute.images)) {
      return selectedAttribute.images.map(normalizeImageValue).filter(Boolean);
    }
  }

  if (Array.isArray(product.images)) {
    return product.images.map(normalizeImageValue).filter(Boolean);
  }

  return [];
};

const getProductsById = async (productId, color = null) => {
  try {
    const product = await Product.findById(productId)
      .populate("categoryId")
      .lean();

    if (!product) {
      throw new Error("Product not found");
    }

    const filteredImages = getColorImages(product, color);

    return {
      ...product,
      filteredImages,
      thumbnail: getProductThumbnail(product),
    };
  } catch (error) {
    throw error;
  }
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

const getRelatedProduct = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  const relatedProducts = await Product.find({
    _id: { $ne: productId }, // Exclude the current product from the related products
    // $or: [
    //     { categoryId: product.categoryId },
    // ]
  });
  // .populate('categoryId', 'name')
  return { product, relatedProducts };
};

const getFeaturedProducts = async () => {
  const featuredProducts = await Product.find({ featured: true });
  // .populate('categoryId', 'name')

  if (featuredProducts.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No featured products found");
  }

  return featuredProducts;
};

const updateProduct = async (id, productData) => {
  const updateData = await Product.findByIdAndUpdate(id, productData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  return updateData;
};

const deleteProduct = async (id) => {
  const deleteId = await Product.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  return deleteId;
};

const createAttribute = async (attributeData) => {
  if (!attributeData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");
  if (!attributeData.value)
    throw new ApiError(httpStatus.BAD_REQUEST, "value is required!");
  const existingCategory = await Attribute.findOne({
    name: attributeData?.name,
  });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Attribute with name "${attributeData.name}" already exists.`
    );
  }
  return Attribute.create(attributeData);
};

const getAttributes = async () => {
  return Attribute.find();
};

const updateAttribute = async (id, attributeData) => {
  const existingAttribute = await Attribute.findOne({
    name: attributeData?.name,
  });
  if (existingAttribute) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Attribute with name "${attributeData.name}" already exists.`
    );
  }
  const updateData = await Attribute.findByIdAndUpdate(id, attributeData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Attribute not found");
  return updateData;
};

const deleteAttribute = async (id) => {
  const deleteId = await Attribute.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "At tribute not found");
  return deleteId;
};

const deleteFAQ = async (id, question) => {
  console.log(id, question);
  const product = await Product.findById(id);

  if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  const findFAQIndex = product.productFAQs.findIndex(
    (faq) => faq.question === question
  );

  if (findFAQIndex == -1)
    throw new ApiError(httpStatus.NOT_FOUND, "FAQ not found");
  product.productFAQs.splice(findFAQIndex, 1);
  product.save();
  return product;
};

export const getOrderById = async (orderId) => {
  const order = await OrderSummary.findById(orderId).populate({
    path: "orderItems.productId",
  });

  if (!order) {
    throw new Error("Order not found");
  }

  order.orderItems = order.orderItems.map((item) => {
    const itemObj = item.toObject();
    const selectedColor = itemObj.selectedColor;
    let selectedColorImage = null;

    // Match selected color in productImages array
    if (itemObj.productId && Array.isArray(itemObj.productId.productImages)) {
      const match = itemObj.productId.productImages.find(
        (img) => img.color?.toLowerCase() === selectedColor?.toLowerCase()
      );

      if (match && Array.isArray(match.images) && match.images.length > 0) {
        selectedColorImage = match.images[0];
      }
    }

    return {
      ...itemObj,
      selectedColor: selectedColor || null,
      selectedColorImage: selectedColorImage || null,
    };
  });

  return order;
};

const deleteOrderSummaryById = async (id) => {
  const order = await OrderSummary.findByIdAndDelete(id);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

const getOrderList = async () => {
  try {
    const orders = await OrderSummary.find().populate({
      path: "orderItems.productId", // 🔥 important
      select: "name price images", // optional fields from Product
    });

    if (orders.length === 0) {
      throw new Error("No orders found");
    }

    return orders;
  } catch (error) {
    throw new Error(`Error fetching all orders: ${error.message}`);
  }
};

const createShippingStatus = async (statusData) => {
  if (!statusData?.status)
    throw new ApiError(httpStatus.BAD_REQUEST, "Status is required");
  const existingStatus = await ShippingStatus.findOne({
    status: statusData?.status,
  });
  if (existingStatus) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This ${statusData?.status} status name already exists.`
    );
  }

  return ShippingStatus.create(statusData);
};

const getShippingStatus = () => {
  return ShippingStatus.find();
};

const updateShippingStatus = async (id, statusData) => {
  const existingStatus = await ShippingStatus.findOne({
    status: statusData?.status,
  });
  if (existingStatus) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This ${statusData?.status} status name already exists.`
    );
  }

  const updateData = await ShippingStatus.findByIdAndUpdate(id, statusData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");

  return updateData;
};

const deleteShippingStatus = async (id) => {
  const deleteId = await ShippingStatus.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");

  return deleteId;
};

const createOrderTacking = async (id, trackingData) => {
  console.log(id, trackingData);

  const alreadyExist = await OrderTracking.find({ orderId: id });
  if (alreadyExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Tracking  Already exist ");

  const orderStatus = await ShippingStatus.findById(trackingData);
  if (orderStatus === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Status is required!");
  const orderId = await Order.findById(id);
  if (orderId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Order Not found ");

  const newData = new OrderTracking({
    orderId: id,
    status: trackingData,
  });
  await newData.save();
  return newData;
};

const getOrderTracking = () => {
  return OrderTracking.find()
    .populate("orderId", "shippingAddress")
    .populate("status", "status");
};

const updateOrderTracking = async (id, trackingData) => {
  // const existingStatus = await OrderTracking.findOne({ status: trackingData?.status });
  // if (existingStatus) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, `This ${trackingData?.status} name status is already selected.`);
  // }
  console.log("id, trackingData", id, trackingData);
  const orderStatus = await ShippingStatus.find({
    status: trackingData.status,
  });
  if (orderStatus === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Status is not found!");
  const updateData = await OrderTracking.findByIdAndUpdate(id, trackingData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  // return;
  return updateData;
};

const deleteOrderTracking = async (id) => {
  const deleteId = await OrderTracking.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");

  return deleteId;
};

const createWalletAmount = async (amountData) => {
  if (!amountData.amount)
    throw new ApiError(httpStatus.BAD_REQUEST, "Amount is required!");

  return WalletAmount.create(amountData);
};

const getWalletAmount = async () => {
  return WalletAmount.find();
};

const updateWalletAmount = async (id, amountData) => {
  const updateData = await WalletAmount.findByIdAndUpdate(id, amountData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  return updateData;
};

const deleteWalletAmount = async (id) => {
  const deleteId = await WalletAmount.findByIdAndDelete(id);
  if (deleteId === null) throw ApiError(httpStatus.NOT_FOUND, "Data not found");
  return deleteId;
};

const createTag = async (tagData) => {
  if (!tagData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");
  const existingCategory = await Tag.findOne({ name: tagData?.name });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Brand with name "${tagData.name}" already exists.`
    );
  }
  return Tag.create(tagData);
};

const getTag = async () => {
  return Tag.find();
};

const updateTag = async (id, tagData) => {
  const existingCategory = await Tag.findOne({ name: tagData?.name });
  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Brand with name "${tagData.name}" already exists.`
    );
  }
  const updateData = await Tag.findByIdAndUpdate(id, tagData, { new: true });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
  return updateData;
};

const deleteTag = async (id) => {
  const deleteId = await Tag.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
  return deleteId;
};

const createCoupon = async (couponData) => {
  const existingCoupon = await Coupon.findOne({
    $or: [{ name: couponData.name }, { couponCode: couponData.couponCode }],
  });

  if (existingCoupon) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Coupon name or coupon code already exists!"
    );
  }

  const couponCode = couponData.couponCode || generateCouponCode();

  if (
    couponData.amountType === "percentage" &&
    Number(couponData.amount) > 100
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Percentage discount cannot be more than 100"
    );
  }

  if (
    couponData.applyType === "product_wise" &&
    (!couponData.products || couponData.products.length === 0)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please select at least one product"
    );
  }

  const newCoupon = new Coupon({
    name: couponData.name,
    couponCode: couponCode.toUpperCase(),
    amountType: couponData.amountType,
    amount: Number(couponData.amount),

    startDate: couponData.startDate,
    endDate: couponData.endDate || null,

    image: couponData.image || "",

    applyType: couponData.applyType || "all_website",

    products:
      couponData.applyType === "product_wise" ? couponData.products || [] : [],

    categories: couponData.categories || [],

    isActive:
      typeof couponData.isActive === "boolean" ? couponData.isActive : true,
  });

  return await newCoupon.save();
};

const getCoupon = async () => {
  return Coupon.find()
    .populate("products", "name slug price salePrice images featuredImage")
    .populate("categories", "name slug")
    .sort({ createdAt: -1 });
};

const getCouponById = async (id) => {
  const coupon = await Coupon.findById(id)
    .populate("products", "name slug price salePrice images featuredImage")
    .populate("categories", "name slug");

  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found!");
  }

  return coupon;
};

const updateCoupon = async (id, couponData) => {
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found!");
  }

  const duplicateCoupon = await Coupon.findOne({
    _id: { $ne: id },
    $or: [{ name: couponData.name }, { couponCode: couponData.couponCode }],
  });

  if (duplicateCoupon) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Coupon name or coupon code already exists!"
    );
  }

  if (
    couponData.amountType === "percentage" &&
    Number(couponData.amount) > 100
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Percentage discount cannot be more than 100"
    );
  }

  if (
    couponData.applyType === "product_wise" &&
    (!couponData.products || couponData.products.length === 0)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please select at least one product"
    );
  }

  const updateData = {
    name: couponData.name,
    couponCode: couponData.couponCode?.toUpperCase(),
    amountType: couponData.amountType,
    amount: Number(couponData.amount),

    startDate: couponData.startDate,
    endDate: couponData.endDate || null,

    image: couponData.image || "",

    applyType: couponData.applyType || "all_website",

    products:
      couponData.applyType === "product_wise" ? couponData.products || [] : [],

    categories: couponData.categories || [],

    isActive:
      typeof couponData.isActive === "boolean" ? couponData.isActive : true,
  };

  const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("products", "name slug price salePrice images featuredImage")
    .populate("categories", "name slug");

  return updatedCoupon;
};

const deleteCoupon = async (id) => {
  const deleteId = await Coupon.findByIdAndDelete(id);

  if (deleteId === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found");
  }

  return deleteId;
};

const createProductStatus = async (statusData) => {
  if (!statusData?.status)
    throw new ApiError(httpStatus.BAD_REQUEST, "Status is required");
  const existingStatus = await ProductStatus.findOne({
    status: statusData?.status,
  });
  if (existingStatus) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This ${statusData?.status} status name already exists.`
    );
  }

  return ProductStatus.create(statusData);
};

const getProductStatus = () => {
  return ProductStatus.find();
};

const updateProductStatus = async (id, statusData) => {
  const existingStatus = await ProductStatus.findOne({
    status: statusData?.status,
  });
  if (existingStatus) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This ${statusData?.status} status name already exists.`
    );
  }

  const updateData = await ProductStatus.findByIdAndUpdate(id, statusData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");

  return updateData;
};

const deleteProductStatus = async (id) => {
  const deleteId = await ProductStatus.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");

  return deleteId;
};

const updatePaymentStatusService = async (orderId, paymentStatus) => {
  const allowedStatuses = ["pending", "completed", "cancelled"];

  if (!allowedStatuses.includes(paymentStatus)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid payment status. Allowed values: ${allowedStatuses.join(", ")}`
    );
  }

  const order = await OrderSummary.findById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found.");
  }

  // Update payment status
  order.paymentStatus = paymentStatus;
  await order.save();

  return order;
};

const updateOrderStatusService = async (orderId, orderStatus) => {
  try {
    const updatedOrder = await OrderSummary.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );
    return updatedOrder;
  } catch (error) {
    console.error("Error in service while updating order status:", error);
    throw error;
  }
};

const updateShippingStatusService = async (orderId, shippingStatus) => {
  try {
    const updatedOrder = await OrderSummary.findByIdAndUpdate(
      orderId,
      { shippingStatus },
      { new: true }
    );
    return updatedOrder;
  } catch (error) {
    console.error("Error in service while updating order status:", error);
    throw error;
  }
};

const parseBoolean = (value, defaultValue = true) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return defaultValue;
};

const parseArray = (value) => {
  if (!value) return [];

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      return [];
    }
  }

  return Array.isArray(value) ? value : [];
};

const createAboutUsPage = async (data) => {
  let about = await AboutUs.findOne();

  if (!about) {
    about = new AboutUs();
  }

  // 🔥 HERO SECTION
  if (data.type === "hero") {
    const features = parseArray(data.features);

    about.hero = {
      title: data.title || "",
      highlight: data.highlight || "",
      description: data.description || "",
      visible: parseBoolean(data.visible, true),
      features,
      image: data.image || about.hero?.image || "",
    };
  }

  // 🔥 YOUTUBE SECTION
  if (data.type === "youtube") {
    const videos = parseArray(data.videos);

    about.youtubeSection = {
      title: data.title || "",
      desc: data.desc || "",
      videos,
      visible: parseBoolean(data.visible, true),
    };
  }

  // 🔥 JOURNEY SECTION
  if (data.type === "journey") {
    const steps = parseArray(data.steps);

    about.journeySection = {
      title: data.title || "",
      description: data.description || "",
      steps,
      visible: parseBoolean(data.visible, true),
    };
  }

  // 🔥 GALLERY SECTION - SECTION WISE
  if (data.type === "gallery") {
    const sections = parseArray(data.sections);
    const images = parseArray(data.images);

    about.gallerySection = {
      title: data.title || "Moments From Our Farm",
      description:
        data.description ||
        "From nurturing Gir cows to the traditional Bilona process, every step reflects purity and care.",
      visible: parseBoolean(data.visible, true),

      sections: sections.map((section) => ({
        sectionTitle: section.sectionTitle || "Gallery",
        images: Array.isArray(section.images) ? section.images : [],
      })),

      // old support
      images,
    };
  }

  // 🔥 COMBO SECTION
  if (data.type === "combo") {
    const combos = parseArray(data.combos);

    about.comboSection = {
      title: data.title || "",
      description: data.description || "",
      combos,
      visible: parseBoolean(data.visible, true),
    };
  }

  await about.save();

  return about;
};

const getAboutUsPage = async () => {
  return AboutUs.find().sort({ createdAt: -1 });
};

const getAboutUsById = async (id) => {
  return AboutUs.findById(id);
};

const updateAboutUsPage = async (id, aboutUsData) => {
  const updateData = await AboutUs.findByIdAndUpdate(id, aboutUsData, {
    new: true,
  });

  if (updateData === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "About Us not found");
  }

  return updateData;
};

const deleteAboutUsPage = async (id) => {
  const deleteId = await AboutUs.findByIdAndDelete(id);

  if (deleteId === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "About Us not found");
  }

  return deleteId;
};

const generateSlug = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const createBlog = async (data) => {
  console.log("REQ BODY 👉", data);

  // 🔥 only bulk flow (remove single blog logic completely)

  if (!Array.isArray(data.blogs)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "blogs array is required!");
  }

  // 🔥 prepare blogs
  const blogsPayload = [];

  for (const blog of data.blogs) {
    if (!blog.title) continue;

    const slug = blog.slug ? generateSlug(blog.slug) : generateSlug(blog.title);

    blogsPayload.push({
      _id: blog._id || undefined, // 🔥 important for update
      title: blog.title,
      slug,
      smallImage: blog.smallImage || "",
      bigImage: blog.bigImage || "",
      content: blog.content || "",
      description: blog.description || "",
      isFeatured: blog.isFeatured || false,
      status: blog.status || "published",
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
    });
  }

  console.log("BLOGS PAYLOAD 👉", blogsPayload);

  let section = await BlogSection.findOne();

  // 🔥 CREATE
  if (!section) {
    const created = await BlogSection.create({
      sectionTitle: data.sectionTitle || "",
      sectionDesc: data.sectionDesc || "",
      visible: data.visible ?? true,
      blogs: blogsPayload,
    });

    console.log("CREATED 👉", created);
    return created;
  }

  // 🔥 UPDATE (IMPORTANT FIX)
  const updated = await BlogSection.findOneAndUpdate(
    { _id: section._id },
    {
      $set: {
        sectionTitle: data.sectionTitle || "",
        sectionDesc: data.sectionDesc || "",
        visible: data.visible ?? true,
        blogs: blogsPayload, // 🔥 THIS FIXES YOUR ISSUE
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  console.log("UPDATED 👉", updated);

  return updated;
};
const getBlog = async () => {
  return BlogSection.find().sort({ createdAt: -1 });
};

const getBlogById = async (id) => {
  const section = await BlogSection.findOne({
    "blogs._id": id,
  });

  if (!section) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  const blog = section.blogs.id(id);

  return blog;
};

const updateBlog = async (id, data) => {
  const section = await BlogSection.findById(id);

  if (!section) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Blog section not found"
    );
  }

  if (!Array.isArray(data.blogs)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "blogs array is required!"
    );
  }

  const blogsPayload = [];

  for (const blog of data.blogs) {
    if (!blog.title?.trim()) continue;

    const slug = blog.slug
      ? generateSlug(blog.slug)
      : generateSlug(blog.title);

    blogsPayload.push({
      ...(blog._id ? { _id: blog._id } : {}),

      title: blog.title.trim(),
      slug,

      smallImage: blog.smallImage || "",
      bigImage: blog.bigImage || "",

      // Tiptap HTML content
      content:
        typeof blog.content === "string"
          ? blog.content
          : "",

      description: blog.description || "",

      isFeatured:
        typeof blog.isFeatured === "boolean"
          ? blog.isFeatured
          : false,

      status: blog.status || "published",

      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
    });
  }

  section.sectionTitle =
    data.sectionTitle !== undefined
      ? data.sectionTitle
      : section.sectionTitle;

  section.sectionDesc =
    data.sectionDesc !== undefined
      ? data.sectionDesc
      : section.sectionDesc;

  section.visible =
    typeof data.visible === "boolean"
      ? data.visible
      : section.visible;

  section.blogs = blogsPayload;

  section.markModified("blogs");

  const updatedSection = await section.save();

  console.log("UPDATED BLOG SECTION 👉", updatedSection);

  return updatedSection;
};

const deleteBlog = async (id) => {
  const deleted = await BlogSection.findByIdAndDelete(id);

  if (!deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog post not found");
  }

  return deleted;
};

const getBlogByTitle = async (title) => {
  return await BlogSection.findOne({ title });
};

const createBanner = async (bannerData) => {
  if (!bannerData.image)
    throw new ApiError(httpStatus.BAD_REQUEST, "Image is required!");
  return Banner.create(bannerData);
};

const getBanner = async () => {
  return Banner.find();
};

const updateBanner = async (id, bannerData) => {
  const updateData = await Banner.findByIdAndUpdate(id, bannerData, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Banner not found");
  return updateData;
};

const deleteBanner = async (id) => {
  const deleteId = await Banner.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Banner not found");
  return deleteId;
};

const uploadWarrantyData = async (data) => {
  const results = [];
  for (const row of data) {
    const { WarrantyNumber, ProductName, ExpiryDate } = row;
    const updatedWarranty = await Warranty.updateOne(
      { warrantyNumber: WarrantyNumber },
      { productName: ProductName, expiryDate: new Date(ExpiryDate) },
      { upsert: true }
    );
    results.push(updatedWarranty);
  }
  return results;
};

const validateWarrantyNumbers = async (warrantyNumbers) => {
  const uniqueWarrantyNumbers = [...new Set(warrantyNumbers)];

  const matchedWarranties = await Warranty.find({
    warrantyNumber: { $in: uniqueWarrantyNumbers },
  });

  const matchedNumbers = matchedWarranties.map((w) => w.warrantyNumber);
  const invalidNumbers = uniqueWarrantyNumbers.filter(
    (number) => !matchedNumbers.includes(number)
  );

  return { matched: matchedWarranties, invalid: invalidNumbers };
};

const addWarrantyNumbersForProducts = async (warrantyData) => {
  const results = [];

  for (const { productId, warrantyNumber } of warrantyData) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} does not exist.`);
    }

    const existingWarranty = await Warranty.findOne({ warrantyNumber });
    if (existingWarranty) {
      throw new Error(`Warranty number ${warrantyNumber} already exists.`);
    }

    const newWarranty = await Warranty.create({
      warrantyNumber,
      productId,
    });

    product.warrantyNumbers = product.warrantyNumbers || [];
    product.warrantyNumbers.push(warrantyNumber);
    await product.save();

    results.push(newWarranty);
  }

  return results;
};

const getOrdersByShippingStatusService = async (status) => {
  try {
    const shippingStatus = await ShippingStatus.findOne({ status });
    if (!shippingStatus) {
      throw new Error(`Shipping status "${status}" not found.`);
    }

    const orders = await OrderSummary.find({
      shippingStatus: shippingStatus._id,
    }).populate("shippingStatus");
    return orders;
  } catch (error) {
    console.error(
      "Error in service while fetching orders by shipping status:",
      error
    );
    throw error;
  }
};

const getAllContacts = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};

const updateOrderSummaryById = async (id, updateData) => {
  const order = await OrderSummary.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

const getAllComplaints = async () => {
  return await Complaint.find().populate("productId");
};

const getComplaintById = async (id) => {
  return await Complaint.findById(id);
};

const updateComplaint = async (id, data) => {
  return await Complaint.findByIdAndUpdate(id, data, { new: true });
};

const deleteComplaint = async (id) => {
  return await Complaint.findByIdAndDelete(id);
};

const getAllQuickFix = async () => {
  return await QuickFix.find()
    .populate("productId", "title")
    .populate("problemId", "problem");
};

const getQuickFixById = async (id) => {
  return await QuickFix.findById(id);
};

const updateQuickFix = async (id, data) => {
  return await QuickFix.findByIdAndUpdate(id, data, { new: true });
};

const deleteQuickFix = async (id) => {
  return await QuickFix.findByIdAndDelete(id);
};

const createQuickFix = async (data) => {
  const quickFix = new QuickFix(data);
  return await quickFix.save();
};

const getAllWarranties = async () => {
  return await Warranty.find().populate("productId");
};

const deleteContactUs = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

dotenv.config();
const sendOrderConfirmationWhatsApp = async (orderId) => {
  try {
    //Fetch order details from MongoDB
    const order = await OrderSummary.findById(orderId).populate(
      "orderItems.productId"
    );

    if (!order) {
      return { success: false, message: "Order not found." };
    }

    //Generate WhatsApp message template
    const messageTemplate = generateMessageTemplate(order);

    //Send message via Gallabox API
    const response = await axios.post(
      "https://server.gallabox.com/devapi/messages/whatsapp",
      messageTemplate,
      {
        headers: {
          apiKey: process.env.GALLABOX_API_KEY,
          apiSecret: process.env.GALLABOX_API_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("WhatsApp Order Confirmation Sent:", response.data);
      return { success: true, message: "WhatsApp notification sent." };
    } else {
      console.error("Failed to send WhatsApp notification:", response.status);
      return {
        success: false,
        message: "Failed to send WhatsApp notification.",
      };
    }
  } catch (error) {
    console.error(
      "Error sending WhatsApp notification:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: "Error sending WhatsApp notification.",
      error: error.message,
    };
  }
};

const sendOfferNotificationWhatsApp = async (userId, offerDetails) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, message: "User not found." };

    if (!user.subscribedToOffers) {
      return {
        success: false,
        message: "User has opted out of promotional messages.",
      };
    }

    const messageTemplate = generateOfferMessageTemplate(user, offerDetails);

    const response = await axios.post(
      "https://server.gallabox.com/devapi/messages/whatsapp",
      messageTemplate,
      {
        headers: {
          apiKey: process.env.GALLABOX_API_KEY,
          apiSecret: process.env.GALLABOX_API_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    return response.status === 200
      ? { success: true, message: "WhatsApp offer notification sent." }
      : { success: false, message: "Failed to send offer notification." };
  } catch (error) {
    return {
      success: false,
      message: "Error sending WhatsApp offer notification.",
      error: error.message,
    };
  }
};

const sendBulkOfferNotificationWhatsApp = async (offerDetails) => {
  try {
    const users = await User.find({ subscribedToOffers: true });

    if (users.length === 0) {
      return { success: false, message: "No subscribed users found." };
    }

    const promises = users.map((user) =>
      sendOfferNotificationWhatsApp(user._id, offerDetails)
    );
    const results = await Promise.all(promises);

    return {
      success: true,
      message: "Bulk offer notifications sent.",
      results,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error sending bulk offer notifications.",
      error: error.message,
    };
  }
};

const getAllBlogContains = async () => {
  return await BlogDetails.find();
};

const getBlogContainsBYBlogId = async (blogId) => {
  try {
    const blogDetails = await BlogDetails.findOne({ blogId }).lean();
    console.log("blogDetails", blogDetails);
    return blogDetails;
  } catch (error) {
    throw new Error("Error fetching blog details: " + error.message);
  }
};

const getBlogContainsByTitle = async (title) => {
  try {
    const decodedTitle = decodeURIComponent(title);
    const cleanTitle = decodedTitle.replace(/-/g, " ").trim();

    console.log("Searching blog title:", cleanTitle);

    const blog = await BlogDetails.findOne({
      title: { $regex: cleanTitle, $options: "i" }, // <-- more flexible
    }).lean();

    if (!blog) return null;

    const blogDetails = await BlogDetails.findOne({ blogId: blog._id })
      .populate("blogId")
      .lean();

    return blogDetails;
  } catch (error) {
    throw new Error("Failed to fetch blog details by title: " + error.message);
  }
};

const updateBlogContains = async (id, data) => {
  return await BlogDetails.findByIdAndUpdate(id, data, { new: true });
};

const deleteBlogContains = async (id) => {
  return await BlogDetails.findByIdAndDelete(id);
};

const createBlogContains = async (data) => {
  const quickFix = new BlogDetails(data);
  return await quickFix.save();
};

const sendOrderUpdateWhatsApp = async ({
  phone,
  orderStatus,
  trackingNumber,
  courierName,
  finalAmount,
}) => {
  try {
    const config = buildOrderStatusTemplate(phone, {
      orderStatus,
      trackingNumber,
      courierName,
      orderValue: finalAmount, // keep this if your template uses {{3}} for order value
    });

    const response = await axios(config);

    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to send WhatsApp update",
      error: err?.response?.data || err.message,
    };
  }
};

const getDashboardData = async () => {
  const todayStart = moment().startOf("day").toDate();
  const todayEnd = moment().endOf("day").toDate();

  const monthStart = moment().startOf("month").toDate();
  const monthEnd = moment().endOf("month").toDate();

  const lastMonthStart = moment()
    .subtract(1, "month")
    .startOf("month")
    .toDate();

  const lastMonthEnd = moment().subtract(1, "month").endOf("month").toDate();

  // ================= BASIC COUNTS =================

  const totalOrders = await OrderSummary.countDocuments();

  const completedOrders = await OrderSummary.countDocuments({
    orderStatus: { $regex: /^delivered$/i },
  });

  const pendingOrders = await OrderSummary.countDocuments({
    orderStatus: { $regex: /^pending$/i },
  });

  const shippedOrders = await OrderSummary.countDocuments({
    orderStatus: { $regex: /^shipped$/i },
  });

  const cancelledOrders = await OrderSummary.countDocuments({
    orderStatus: { $regex: /^cancelled$/i },
  });

  const todaysOrders = await OrderSummary.countDocuments({
    createdAt: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });

  const totalComplaints = await Complaint.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  // ================= TOTAL UNIQUE CUSTOMERS =================

  const uniqueCustomersResult = await OrderSummary.aggregate([
    {
      $group: {
        _id: "$customerDetails.phone",
      },
    },
    {
      $count: "customers",
    },
  ]);

  const totalCustomers = Number(uniqueCustomersResult?.[0]?.customers || 0);

  // ================= TOTAL REVENUE / TAX / PRODUCTS SOLD =================

  const revenueResult = await OrderSummary.aggregate([
    {
      $match: {
        orderStatus: { $not: /^cancelled$/i },
      },
    },
    {
      $group: {
        _id: null,

        revenue: {
          $sum: { $ifNull: ["$finalAmount", 0] },
        },

        taxCollection: {
          $sum: { $ifNull: ["$gst", 0] },
        },

        discount: {
          $sum: { $ifNull: ["$discount", 0] },
        },

        shipping: {
          $sum: { $ifNull: ["$shipping", 0] },
        },

        productsSold: {
          $sum: {
            $sum: {
              $map: {
                input: { $ifNull: ["$orderItems", []] },
                as: "item",
                in: { $ifNull: ["$$item.quantity", 0] },
              },
            },
          },
        },
      },
    },
  ]);

  const totalRevenue = Number(revenueResult?.[0]?.revenue || 0);
  const taxCollection = Number(revenueResult?.[0]?.taxCollection || 0);
  const totalDiscount = Number(revenueResult?.[0]?.discount || 0);
  const totalShipping = Number(revenueResult?.[0]?.shipping || 0);
  const totalProductsSold = Number(revenueResult?.[0]?.productsSold || 0);

  // ✅ If you do not have expense model/field, keep this 0
  const totalExpenses = 0;

  const profit = Math.max(totalRevenue - taxCollection - totalExpenses, 0);

  const averageOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const conversionRate =
    totalUsers > 0 ? Number(((totalOrders / totalUsers) * 100).toFixed(1)) : 0;

  // ================= THIS MONTH / LAST MONTH GROWTH =================

  const monthlyRevenueResult = await OrderSummary.aggregate([
    {
      $match: {
        createdAt: {
          $gte: monthStart,
          $lte: monthEnd,
        },
        orderStatus: { $not: /^cancelled$/i },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: { $ifNull: ["$finalAmount", 0] },
        },
        orders: {
          $sum: 1,
        },
      },
    },
  ]);

  const lastMonthRevenueResult = await OrderSummary.aggregate([
    {
      $match: {
        createdAt: {
          $gte: lastMonthStart,
          $lte: lastMonthEnd,
        },
        orderStatus: { $not: /^cancelled$/i },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: { $ifNull: ["$finalAmount", 0] },
        },
        orders: {
          $sum: 1,
        },
      },
    },
  ]);

  const thisMonthRevenue = Number(monthlyRevenueResult?.[0]?.revenue || 0);
  const lastMonthRevenue = Number(lastMonthRevenueResult?.[0]?.revenue || 0);

  const revenueGrowth =
    lastMonthRevenue > 0
      ? Number(
          (
            ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
            100
          ).toFixed(1)
        )
      : 0;

  const thisMonthOrders = Number(monthlyRevenueResult?.[0]?.orders || 0);
  const lastMonthOrders = Number(lastMonthRevenueResult?.[0]?.orders || 0);

  const ordersGrowth =
    lastMonthOrders > 0
      ? Number(
          (
            ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) *
            100
          ).toFixed(1)
        )
      : 0;

  // ================= MONTHLY CHART DATA =================

  const monthlyChartData = await OrderSummary.aggregate([
    {
      $match: {
        orderStatus: { $not: /^cancelled$/i },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },

        revenue: {
          $sum: { $ifNull: ["$finalAmount", 0] },
        },

        taxCollection: {
          $sum: { $ifNull: ["$gst", 0] },
        },

        discount: {
          $sum: { $ifNull: ["$discount", 0] },
        },

        shipping: {
          $sum: { $ifNull: ["$shipping", 0] },
        },

        orders: {
          $sum: 1,
        },

        customers: {
          $addToSet: "$customerDetails.phone",
        },

        productsSold: {
          $sum: {
            $sum: {
              $map: {
                input: { $ifNull: ["$orderItems", []] },
                as: "item",
                in: { $ifNull: ["$$item.quantity", 0] },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,

        year: "$_id.year",
        monthNumber: "$_id.month",

        revenue: 1,
        taxCollection: 1,
        discount: 1,
        shipping: 1,
        orders: 1,
        productsSold: 1,

        customers: {
          $size: "$customers",
        },

        expenses: {
          $literal: 0,
        },

        profit: {
          $subtract: [
            {
              $subtract: ["$revenue", "$taxCollection"],
            },
            0,
          ],
        },
      },
    },
    {
      $sort: {
        year: 1,
        monthNumber: 1,
      },
    },
  ]);

  const formattedMonthlyChartData = monthlyChartData.map((item) => ({
    month: moment()
      .month(Number(item.monthNumber || 1) - 1)
      .format("MMM"),

    year: Number(item.year || 0),

    revenue: Number(item.revenue || 0),
    profit: Number(item.profit || 0),
    expenses: Number(item.expenses || 0),
    taxCollection: Number(item.taxCollection || 0),
    discount: Number(item.discount || 0),
    shipping: Number(item.shipping || 0),
    orders: Number(item.orders || 0),
    customers: Number(item.customers || 0),
    productsSold: Number(item.productsSold || 0),
  }));

  // ================= ORDER STATUS / CATEGORY DATA =================

  const categoryData = await OrderSummary.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        value: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: {
          $ifNull: ["$_id", "Unknown"],
        },
        value: 1,
      },
    },
    {
      $sort: {
        value: -1,
      },
    },
  ]);

  // ================= FUNNEL DATA =================

  const funnelData = [
    {
      name: "Users",
      value: totalUsers,
    },
    {
      name: "Customers",
      value: totalCustomers,
    },
    {
      name: "Orders",
      value: totalOrders,
    },
    {
      name: "Delivered",
      value: completedOrders,
    },
  ];

  // ================= TOP PRODUCTS =================

  const topProducts = await OrderSummary.aggregate([
    {
      $match: {
        orderStatus: { $not: /^cancelled$/i },
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $group: {
        _id: "$orderItems.productId",

        quantitySold: {
          $sum: { $ifNull: ["$orderItems.quantity", 0] },
        },

        revenue: {
          $sum: {
            $multiply: [
              { $ifNull: ["$orderItems.price", 0] },
              { $ifNull: ["$orderItems.quantity", 0] },
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        productId: {
          $toString: "$_id",
        },
        name: {
          $ifNull: ["$product.name", "Product"],
        },
        quantitySold: 1,
        revenue: 1,
      },
    },
    {
      $sort: {
        quantitySold: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  // ================= TOP CUSTOMERS =================

  const topCustomers = await OrderSummary.aggregate([
    {
      $match: {
        orderStatus: { $not: /^cancelled$/i },
      },
    },
    {
      $group: {
        _id: "$customerDetails.phone",

        name: {
          $first: {
            $concat: [
              { $ifNull: ["$customerDetails.firstName", ""] },
              " ",
              { $ifNull: ["$customerDetails.lastName", ""] },
            ],
          },
        },

        phone: {
          $first: "$customerDetails.phone",
        },

        orders: {
          $sum: 1,
        },

        spend: {
          $sum: { $ifNull: ["$finalAmount", 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,

        name: {
          $cond: [
            {
              $eq: [{ $trim: { input: "$name" } }, ""],
            },
            "Customer",
            {
              $trim: { input: "$name" },
            },
          ],
        },

        phone: 1,
        orders: 1,
        spend: 1,
      },
    },
    {
      $sort: {
        spend: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  // ================= RECENT ORDERS =================

  const recentOrders = await OrderSummary.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select(
      "_id customerDetails paymentMethod paymentStatus orderStatus finalAmount createdAt"
    )
    .lean();

  const formattedRecentOrders = recentOrders.map((order) => ({
    _id: order?._id,

    customerName:
      `${order?.customerDetails?.firstName || ""} ${
        order?.customerDetails?.lastName || ""
      }`.trim() || "Customer",

    phone: order?.customerDetails?.phone || "-",
    paymentMethod: order?.paymentMethod || "-",
    paymentStatus: order?.paymentStatus || "-",
    orderStatus: order?.orderStatus || "-",
    total: Number(order?.finalAmount || 0),
    createdAt: order?.createdAt,
  }));

  // ================= ACTIVITY FEED =================

  const activityFeed = [
    {
      id: 1,
      message: `${todaysOrders} orders placed today`,
      time: "Today",
    },
    {
      id: 2,
      message: `${completedOrders} orders delivered`,
      time: "Updated now",
    },
    {
      id: 3,
      message: `${cancelledOrders} orders cancelled`,
      time: "Updated now",
    },
    {
      id: 4,
      message: `${totalComplaints} complaints received`,
      time: "Updated now",
    },
  ];

  // ================= INSIGHTS =================

  const insights = [
    {
      icon: "🔥",
      text: `Total revenue is ₹${Number(totalRevenue).toLocaleString("en-IN")}`,
      type: "positive",
    },
    {
      icon: "📦",
      text: `${todaysOrders} orders received today`,
      type: "info",
    },
    {
      icon: "⚠️",
      text: `${cancelledOrders} orders cancelled`,
      type: cancelledOrders > 0 ? "warning" : "info",
    },
  ];

  // ================= FINAL RESPONSE =================

  return {
    kpis: {
      revenue: totalRevenue,
      profit,
      expenses: totalExpenses,
      averageOrderValue,
      orders: totalOrders,
      customers: totalCustomers,
      products: totalProducts,
      conversionRate,
      taxCollection,
      productReviews: 0,
      discount: totalDiscount,
      shipping: totalShipping,

      productsSold: totalProductsSold,
      complaints: totalComplaints,
      completedOrders,
      pendingOrders,
      shippedOrders,
      cancelledOrders,
      todaysOrders,

      revenueGrowth,
      productsSoldGrowth: 0,
      ordersGrowth,
      usersGrowth: 0,
      customersGrowth: 0,
    },

    orderSummary: {
      totalOrders,
      completedOrders,
      pendingOrders,
      shippedOrders,
      cancelledOrders,
    },

    monthlyChartData: formattedMonthlyChartData,

    revenueData: formattedMonthlyChartData.map((item) => ({
      month: item.month,
      year: item.year,
      revenue: item.revenue,
      orders: item.orders,
      customers: item.customers,
    })),

    ordersData: formattedMonthlyChartData.map((item) => ({
      month: item.month,
      year: item.year,
      orders: item.orders,
    })),

    profitData: formattedMonthlyChartData.map((item) => ({
      month: item.month,
      year: item.year,
      revenue: item.revenue,
      profit: item.profit,
      expenses: item.expenses,
      taxCollection: item.taxCollection,
    })),

    productSoldData: formattedMonthlyChartData.map((item) => ({
      month: item.month,
      year: item.year,
      productsSold: item.productsSold,
    })),

    taxData: formattedMonthlyChartData.map((item) => ({
      month: item.month,
      year: item.year,
      taxCollection: item.taxCollection,
      discount: item.discount,
      shipping: item.shipping,
    })),

    categoryData,

    funnelData,

    topProducts,

    topCustomers,

    recentOrders: formattedRecentOrders,

    activityFeed,

    insights,
  };
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getCartByUserId = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "user not found");

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "title price productImages",
  });

  return cart;
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

const verifyCouponForProducts = async (couponCode, productIds) => {
  if (!couponCode || !Array.isArray(productIds)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid input");
  }

  const coupon = await Coupon.findOne({
    couponCode: couponCode.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found");
  }

  const currentDate = new Date();

  if (coupon.startDate && currentDate < new Date(coupon.startDate)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Coupon is not started yet");
  }

  if (coupon.endDate && currentDate > new Date(coupon.endDate)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Coupon has expired");
  }

  if (coupon.applyType === "all_website") {
    return coupon;
  }

  if (coupon.applyType === "product_wise") {
    const couponProductIds = coupon.products.map((id) => id.toString());

    const isValid = productIds.some((productId) =>
      couponProductIds.includes(productId.toString())
    );

    if (!isValid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Coupon not applicable to these products"
      );
    }
  }

  return coupon;
};

const createHeroSection = async (data) => {
  if (!data.mainBanner) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Main banner is required!");
  }

  if (!data.mobileBanner) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Mobile banner is required!");
  }

  return HeroSection.create(data);
};

const getHeroSection = async () => {
  return HeroSection.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
};

const updateHeroSection = async (id, data) => {
  const updateData = await HeroSection.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!updateData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Hero banner not found");
  }

  return updateData;
};

const deleteHeroSection = async (id) => {
  const deleteId = await HeroSection.findByIdAndDelete(id);

  if (!deleteId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Hero banner not found");
  }

  return deleteId;
};

const handleCopyCoupon = (code) => {
  navigator.clipboard.writeText(code);
  alert("Coupon copied");
};

const createResHeroSection = async (data) => {
  if (!data.image)
    throw new ApiError(httpStatus.BAD_REQUEST, "Image is required!");
  return ResponsiveHeroSection.create(data);
};

const getResHeroSection = async () => {
  return ResponsiveHeroSection.find();
};

const updateResHeroSection = async (id, data) => {
  const updateData = await ResponsiveHeroSection.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  return updateData;
};

const deleteResHeroSection = async (id) => {
  const deleteId = await ResponsiveHeroSection.findByIdAndDelete(id);
  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  return deleteId;
};

const createProductOption = async (optionData) => {
  if (!optionData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");

  if (!optionData.type)
    throw new ApiError(httpStatus.BAD_REQUEST, "type is required!");

  if (!optionData.values || optionData.values.length === 0)
    throw new ApiError(httpStatus.BAD_REQUEST, "Option values are required!");

  const existingOption = await Option.findOne({ name: optionData.name });

  if (existingOption) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Option with name "${optionData.name}" already exists.`
    );
  }

  return Option.create(optionData);
};

const getProductOptions = async () => {
  return Option.find();
};

const updateProductOption = async (id, optionData) => {
  if (optionData.name) {
    const existingOption = await Option.findOne({
      name: optionData.name,
      _id: { $ne: id },
    });

    if (existingOption) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Option with name "${optionData.name}" already exists.`
      );
    }
  }

  const updateData = await Option.findByIdAndUpdate(id, optionData, {
    new: true,
  });

  if (updateData === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Product option not found");

  return updateData;
};

const deleteProductOption = async (id) => {
  const deleteId = await Option.findByIdAndDelete(id);

  if (deleteId === null)
    throw new ApiError(httpStatus.NOT_FOUND, "Product option not found");

  return deleteId;
};

const createFlashSale = async (saleData) => {
  if (!saleData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");

  if (!saleData.endDate)
    throw new ApiError(httpStatus.BAD_REQUEST, "endDate is required!");

  const existingSale = await FlashSale.findOne({ name: saleData.name });

  if (existingSale) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Flash sale "${saleData.name}" already exists`
    );
  }

  return FlashSale.create(saleData);
};

const getFlashSales = async () => {
  return FlashSale.find().populate("products.productId");
};

const updateFlashSale = async (id, saleData) => {
  const existingSale = await FlashSale.findOne({
    name: saleData.name,
    _id: { $ne: id },
  });

  if (existingSale) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Flash sale "${saleData.name}" already exists`
    );
  }

  const updateData = await FlashSale.findByIdAndUpdate(id, saleData, {
    new: true,
  });

  if (!updateData)
    throw new ApiError(httpStatus.NOT_FOUND, "Flash sale not found");

  return updateData;
};

const deleteFlashSale = async (id) => {
  const deleteId = await FlashSale.findByIdAndDelete(id);

  if (!deleteId)
    throw new ApiError(httpStatus.NOT_FOUND, "Flash sale not found");

  return deleteId;
};

const createTax = async (taxData) => {
  if (!taxData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");

  // if (!taxData.percentage)
  //   throw new ApiError(httpStatus.BAD_REQUEST, "percentage is required!");

  const existingTax = await Tax.findOne({ name: taxData.name });

  if (existingTax) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Tax "${taxData.name}" already exists`
    );
  }

  return Tax.create(taxData);
};

const getTaxes = async () => {
  return Tax.find().sort({ priority: 1 });
};

const updateTax = async (id, taxData) => {
  const existingTax = await Tax.findOne({
    name: taxData.name,
    _id: { $ne: id },
  });

  if (existingTax) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Tax "${taxData.name}" already exists`
    );
  }

  const updateData = await Tax.findByIdAndUpdate(id, taxData, { new: true });

  if (!updateData) throw new ApiError(httpStatus.NOT_FOUND, "Tax not found");

  return updateData;
};

const deleteTax = async (id) => {
  const deleteId = await Tax.findByIdAndDelete(id);

  if (!deleteId) throw new ApiError(httpStatus.NOT_FOUND, "Tax not found");

  return deleteId;
};

const createSpecificationGroup = async (groupData) => {
  if (!groupData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");

  const existingGroup = await SpecificationGroup.findOne({
    name: groupData.name,
  });

  if (existingGroup) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Specification group "${groupData.name}" already exists`
    );
  }

  return SpecificationGroup.create(groupData);
};

const getSpecificationGroups = async () => {
  return SpecificationGroup.find().sort({ createdAt: -1 });
};

const updateSpecificationGroup = async (id, groupData) => {
  const existingGroup = await SpecificationGroup.findOne({
    name: groupData.name,
    _id: { $ne: id },
  });

  if (existingGroup) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Specification group "${groupData.name}" already exists`
    );
  }

  const updateData = await SpecificationGroup.findByIdAndUpdate(id, groupData, {
    new: true,
  });

  if (!updateData)
    throw new ApiError(httpStatus.NOT_FOUND, "Specification group not found");

  return updateData;
};

const deleteSpecificationGroup = async (id) => {
  const deleteId = await SpecificationGroup.findByIdAndDelete(id);

  if (!deleteId)
    throw new ApiError(httpStatus.NOT_FOUND, "Specification group not found");

  return deleteId;
};

const createSpecificationAttribute = async (attributeData) => {
  if (!attributeData.groupId)
    throw new ApiError(httpStatus.BAD_REQUEST, "groupId is required!");

  if (!attributeData.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");

  if (!attributeData.fieldType)
    throw new ApiError(httpStatus.BAD_REQUEST, "fieldType is required!");

  const existingAttribute = await SpecificationAttribute.findOne({
    name: attributeData.name,
    groupId: attributeData.groupId,
  });

  if (existingAttribute) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Attribute "${attributeData.name}" already exists in this group`
    );
  }

  return SpecificationAttribute.create(attributeData);
};

const getSpecificationAttributes = async () => {
  return SpecificationAttribute.find().populate("groupId");
};

const updateSpecificationAttribute = async (id, attributeData) => {
  const existingAttribute = await SpecificationAttribute.findOne({
    name: attributeData.name,
    groupId: attributeData.groupId,
    _id: { $ne: id },
  });

  if (existingAttribute) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Attribute "${attributeData.name}" already exists`
    );
  }

  const updateData = await SpecificationAttribute.findByIdAndUpdate(
    id,
    attributeData,
    { new: true }
  );

  if (!updateData)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Specification attribute not found"
    );

  return updateData;
};

const deleteSpecificationAttribute = async (id) => {
  const deleteId = await SpecificationAttribute.findByIdAndDelete(id);

  if (!deleteId)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Specification attribute not found"
    );

  return deleteId;
};

const createSpecificationTableGroup = async (data) => {
  if (!data.groupName)
    throw new ApiError(httpStatus.BAD_REQUEST, "groupName is required!");

  const existing = await SpecificationTable.findOne({
    groupName: data.groupName,
  });

  if (existing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Specification table group "${data.groupName}" already exists`
    );
  }

  return SpecificationTable.create(data);
};

const getSpecificationTableGroups = async () => {
  return SpecificationTable.find()
    .populate("specificationGroups")
    .sort({ createdAt: -1 });
};

const updateSpecificationTableGroup = async (id, data) => {
  const existing = await SpecificationTable.findOne({
    groupName: data.groupName,
    _id: { $ne: id },
  });

  if (existing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Specification table group "${data.groupName}" already exists`
    );
  }

  const updateData = await SpecificationTable.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updateData)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Specification table group not found"
    );

  return updateData;
};

const deleteSpecificationTableGroup = async (id) => {
  const deleted = await SpecificationTable.findByIdAndDelete(id);

  if (!deleted)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Specification table group not found"
    );

  return deleted;
};

const createBlogCategory = async (data) => {
  if (!data.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");

  if (!data.slug)
    throw new ApiError(httpStatus.BAD_REQUEST, "slug is required!");

  const existing = await BlogCategory.findOne({ slug: data.slug });

  if (existing)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Category with slug "${data.slug}" already exists`
    );

  return BlogCategory.create(data);
};

const getBlogCategories = async () => {
  return BlogCategory.find().populate("parent").sort({ createdAt: -1 });
};

const updateBlogCategory = async (id, data) => {
  const existing = await BlogCategory.findOne({
    slug: data.slug,
    _id: { $ne: id },
  });

  if (existing)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Category with slug "${data.slug}" already exists`
    );

  const updated = await BlogCategory.findByIdAndUpdate(id, data, { new: true });

  if (!updated)
    throw new ApiError(httpStatus.NOT_FOUND, "Blog category not found");

  return updated;
};

const deleteBlogCategory = async (id) => {
  const deleted = await BlogCategory.findByIdAndDelete(id);

  if (!deleted)
    throw new ApiError(httpStatus.NOT_FOUND, "Blog category not found");

  return deleted;
};

const createBlogTag = async (data) => {
  if (!data.name)
    throw new ApiError(httpStatus.BAD_REQUEST, "name is required!");

  if (!data.slug)
    throw new ApiError(httpStatus.BAD_REQUEST, "slug is required!");

  const existing = await BlogTag.findOne({ slug: data.slug });

  if (existing)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Tag with slug "${data.slug}" already exists`
    );

  return BlogTag.create(data);
};

const getBlogTags = async () => {
  return BlogTag.find().sort({ createdAt: -1 });
};

const updateBlogTag = async (id, data) => {
  const existing = await BlogTag.findOne({
    slug: data.slug,
    _id: { $ne: id },
  });

  if (existing)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Tag with slug "${data.slug}" already exists`
    );

  const updated = await BlogTag.findByIdAndUpdate(id, data, { new: true });

  if (!updated) throw new ApiError(httpStatus.NOT_FOUND, "Blog tag not found");

  return updated;
};

const deleteBlogTag = async (id) => {
  const deleted = await BlogTag.findByIdAndDelete(id);

  if (!deleted) throw new ApiError(httpStatus.NOT_FOUND, "Blog tag not found");

  return deleted;
};

const createTransaction = async (data) => {
  if (!data.chargeId)
    throw new ApiError(httpStatus.BAD_REQUEST, "chargeId is required");

  const existing = await PaymentTransaction.findOne({
    chargeId: data.chargeId,
  });

  if (existing)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Transaction with chargeId "${data.chargeId}" already exists`
    );

  return PaymentTransaction.create(data);
};

const getTransactions = async () => {
  return PaymentTransaction.find()
    .populate("userId")
    .populate("orderId")
    .sort({ createdAt: -1 });
};

const getTransactionById = async (id) => {
  const transaction = await PaymentTransaction.findById(id)
    .populate("userId")
    .populate("orderId");

  if (!transaction)
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");

  return transaction;
};

const updateTransaction = async (id, data) => {
  const updated = await PaymentTransaction.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updated)
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");

  return updated;
};

const deleteTransaction = async (id) => {
  const deleted = await PaymentTransaction.findByIdAndDelete(id);

  if (!deleted)
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");

  return deleted;
};

const createSubscriber = async (data) => {
  if (!data.email)
    throw new ApiError(httpStatus.BAD_REQUEST, "email is required");

  const existing = await Newsletter.findOne({ email: data.email });

  if (existing)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email "${data.email}" already subscribed`
    );

  return Newsletter.create(data);
};

const getSubscribers = async () => {
  return Newsletter.find().sort({ createdAt: -1 });
};

const updateSubscriber = async (id, data) => {
  const updated = await Newsletter.findByIdAndUpdate(id, data, { new: true });

  if (!updated)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscriber not found");

  return updated;
};

const deleteSubscriber = async (id) => {
  const deleted = await Newsletter.findByIdAndDelete(id);

  if (!deleted)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscriber not found");

  return deleted;
};

const getMostLoved = async () => {
  let data = await MostLoved.findOne().populate("products");

  if (!data) {
    data = await MostLoved.create({
      title: "",
      description: "",
      visible: true,
      products: [],
    });
  }

  return data;
};

const upsertMostLoved = async (body) => {
  let data = await MostLoved.findOne();

  if (!data) {
    data = new MostLoved();
  }

  data.title = body.title || "";
  data.description = body.description || "";
  data.visible = body.visible === true || body.visible === "true";

  // 🔥 IMPORTANT: only store productId array
  data.products = body.products || [];

  await data.save();

  return data;
};

const getFeatured = async () => {
  let data = await Featured.findOne().populate("products.productId");

  if (!data) {
    data = await Featured.create({
      title: "",
      description: "",
      visible: true,
      products: [],
      cards: [],
    });
  }

  return data;
};

const upsertFeatured = async (body) => {
  let data = await Featured.findOne();

  if (!data) {
    data = new Featured();
  }

  data.title = body.title || "";
  data.description = body.description || "";

  data.visible = body.visible === true || body.visible === "true";

  // 🔥 products (IDs only)
  if (body.products) {
    data.products = body.products || [];
  }

  // 🔥 optional cards
  if (body.cards) {
    data.cards = body.cards;
  }

  await data.save();

  return data;
};

const getVideoSection = async () => {
  let data = await VideoSection.findOne().populate("videos.productId");

  if (!data) {
    data = await VideoSection.create({
      title: "",
      visible: true,
      videos: [],
    });
  }

  return data;
};

const upsertVideoSection = async (body) => {
  let data = await VideoSection.findOne();

  if (!data) {
    data = new VideoSection();
  }

  data.title = body.title || "";
  data.visible = body.visible === true || body.visible === "true";

  data.videos = body.videos || [];

  await data.save();

  return data;
};

const getNewProductSection = async () => {
  let data = await NewProductSection.findOne().populate("products");

  if (!data) {
    data = await NewProductSection.create({
      title: "",
      description: "",
      visible: true,
      products: [],
    });
  }

  return data;
};

const upsertNewProductSection = async (body) => {
  let data = await NewProductSection.findOne();

  if (!data) {
    data = new NewProductSection();
  }

  data.title = body.title || "";
  data.description = body.description || "";

  data.visible = body.visible === true || body.visible === "true";

  // 🔥 store only product IDs
  data.products = body.products || [];

  await data.save();

  return data;
};

const getAboutSectionService = async () => {
  return await AboutSection.findOne();
};

const saveAboutSectionService = async (data) => {
  let section = await AboutSection.findOne();

  if (section) {
    // UPDATE
    section.title = data.title;
    section.description = data.description;
    section.image = data.image;
    section.visible = data.visible;
    section.features = data.features;

    await section.save();
  } else {
    // CREATE
    section = await AboutSection.create({
      title: data.title,
      description: data.description,
      image: data.image,
      visible: data.visible,
      features: data.features,
    });
  }

  return section;
};

const getWhyChooseService = async () => {
  return await WhyChoose.findOne();
};

const saveWhyChooseService = async (data) => {
  let section = await WhyChoose.findOne();

  if (section) {
    // UPDATE
    section.title = data.title;
    section.desc = data.desc;
    section.visible = data.visible;
    section.points = data.points;

    await section.save();
  } else {
    // CREATE
    section = await WhyChoose.create({
      title: data.title,
      desc: data.desc,
      visible: data.visible,
      points: data.points,
    });
  }

  return section;
};

const getPuritySectionService = async () => {
  return await PuritySection.findOne();
};

const savePuritySectionService = async (data) => {
  let section = await PuritySection.findOne();

  if (section) {
    // UPDATE
    section.title = data.title;
    section.visible = data.visible;
    section.cards = data.cards;

    await section.save();
  } else {
    // CREATE
    section = await PuritySection.create({
      title: data.title,
      visible: data.visible,
      cards: data.cards,
    });
  }

  return section;
};

const getFAQService = async () => {
  return await FAQSection.findOne();
};

const saveFAQService = async (data) => {
  let section = await FAQSection.findOne();

  if (section) {
    // UPDATE
    section.title1 = data.title1;
    section.title2 = data.title2;
    section.description = data.description;
    section.tags = data.tags;
    section.visible = data.visible;
    section.faqs = data.faqs;

    await section.save();
  } else {
    // CREATE
    section = await FAQSection.create({
      title1: data.title1,
      title2: data.title2,
      description: data.description,
      tags: data.tags,
      visible: data.visible,
      faqs: data.faqs,
    });
  }

  return section;
};

const getTestimonialService = async () => {
  return await TestimonialSection.findOne();
};

const saveTestimonialService = async (data) => {
  let section = await TestimonialSection.findOne();

  if (section) {
    // UPDATE
    section.title1 = data.title1;
    section.title2 = data.title2;
    section.desc = data.desc;
    section.visible = data.visible;
    section.testimonials = data.testimonials;

    await section.save();
  } else {
    // CREATE
    section = await TestimonialSection.create({
      title1: data.title1,
      title2: data.title2,
      desc: data.desc,
      visible: data.visible,
      testimonials: data.testimonials,
    });
  }

  return section;
};

const getInvoiceByOrderService = async ({ orderId, userId }) => {
  const invoice = await Invoice.findOne({ orderId });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  // 🔒 Ownership check
  if (userId && invoice.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  return invoice;
};

const getInvoiceByIdService = async ({ invoiceId, userId }) => {
  const invoice = await Invoice.findById(invoiceId)
    .populate({
      path: "userId",
      select: "name email phone number address",
    })
    .populate({
      path: "orderId",
      populate: {
        path: "userId",
        select: "name email phone number address",
      },
    })
    .populate({
      path: "items.productId",
      model: "Product",
    })
    .lean();

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  // Ownership check
  const invoiceUserId = invoice?.userId?._id || invoice?.userId;

  if (userId && invoiceUserId?.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  return invoice;
};

const getAllInvoicesService = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const invoices = await Invoice.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Invoice.countDocuments();

  return {
    invoices,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

const updateInvoiceService = async ({ invoiceId, userId, updateData }) => {
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  // 🔒 Ownership check
  if (userId && invoice.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  // Prevent critical field overwrite
  const restrictedFields = ["orderId", "userId", "invoiceNumber"];
  restrictedFields.forEach((field) => delete updateData[field]);

  // 🔥 Update directly
  const updatedInvoice = await Invoice.findByIdAndUpdate(
    invoiceId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedInvoice;
};

const deleteInvoiceService = async ({ invoiceId, userId }) => {
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  // 🔒 Ownership check
  if (userId && invoice.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  await Invoice.findByIdAndDelete(invoiceId);

  return { message: "Invoice deleted successfully" };
};

const createDeliveryOptionService = async (payload) => {
  const { name, price, estimatedDays, available } = payload;

  if (!name || price === undefined || !estimatedDays) {
    const error = new Error("Name, price and estimated days are required");
    error.statusCode = 400;
    throw error;
  }

  const deliveryOption = await DeliveryOption.create({
    name,
    price: Number(price),
    estimatedDays,
    available: available ?? true,
  });

  return deliveryOption;
};

const getAdminDeliveryOptionsService = async () => {
  const deliveryOptions = await DeliveryOption.find()
    .sort({ createdAt: -1 })
    .lean();

  return deliveryOptions;
};

const getCheckoutDeliveryOptionsService = async () => {
  const deliveryOptions = await DeliveryOption.find({
    available: true,
  })
    .sort({ price: 1 })
    .lean();

  return deliveryOptions;
};

const getSingleDeliveryOptionService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid delivery option ID");
    error.statusCode = 400;
    throw error;
  }

  const deliveryOption = await DeliveryOption.findById(id);

  if (!deliveryOption) {
    const error = new Error("Delivery option not found");
    error.statusCode = 404;
    throw error;
  }

  return deliveryOption;
};

const updateDeliveryOptionService = async (id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid delivery option ID");
    error.statusCode = 400;
    throw error;
  }

  const { name, price, estimatedDays, available } = payload;

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (price !== undefined) updateData.price = Number(price);
  if (estimatedDays !== undefined) updateData.estimatedDays = estimatedDays;
  if (available !== undefined) updateData.available = available;

  const updatedDeliveryOption = await DeliveryOption.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedDeliveryOption) {
    const error = new Error("Delivery option not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedDeliveryOption;
};

const deleteDeliveryOptionService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid delivery option ID");
    error.statusCode = 400;
    throw error;
  }

  const deletedDeliveryOption = await DeliveryOption.findByIdAndDelete(id);

  if (!deletedDeliveryOption) {
    const error = new Error("Delivery option not found");
    error.statusCode = 404;
    throw error;
  }

  return deletedDeliveryOption;
};

export const getDashboardReport = async () => {
  const invoices = await Invoice.find({ paymentStatus: "completed" }).lean();

  let grossRevenue = 0;
  let netRevenue = 0;
  let taxCollection = 0;
  let shippingCollection = 0;
  let totalDiscount = 0;

  const monthlyMap = {};
  const dailyMap = {};
  const productMap = {};
  const paymentMethodMap = {};

  const today = new Date();

  for (const invoice of invoices) {
    const priceDetails = invoice.priceDetails || {};

    const subtotal = Number(priceDetails.subtotal || 0);
    const discount = Number(priceDetails.discount || 0);
    const shippingCost = Number(priceDetails.shippingCost || 0);
    const tax = Number(priceDetails.tax || 0);
    const finalAmount = Number(priceDetails.finalAmount || 0);

    const cleanNetRevenue = finalAmount - tax - shippingCost;

    grossRevenue += finalAmount;
    netRevenue += cleanNetRevenue;
    taxCollection += tax;
    shippingCollection += shippingCost;
    totalDiscount += discount;

    const createdAt = invoice.createdAt
      ? new Date(invoice.createdAt)
      : new Date();

    // Monthly chart
    const monthKey = createdAt.toLocaleString("en-IN", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        month: monthKey,
        grossRevenue: 0,
        netRevenue: 0,
        orders: 0,
      };
    }

    monthlyMap[monthKey].grossRevenue += finalAmount;
    monthlyMap[monthKey].netRevenue += cleanNetRevenue;
    monthlyMap[monthKey].orders += 1;

    // Daily chart - last 7 days
    const diffTime = today.getTime() - createdAt.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays <= 7) {
      const dayKey = createdAt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          day: dayKey,
          grossRevenue: 0,
          netRevenue: 0,
          orders: 0,
        };
      }

      dailyMap[dayKey].grossRevenue += finalAmount;
      dailyMap[dayKey].netRevenue += cleanNetRevenue;
      dailyMap[dayKey].orders += 1;
    }

    // Product report
    for (const item of invoice.items || []) {
      const productName = item.name || "Unknown Product";
      const quantity = Number(item.quantity || 0);
      const itemRevenue = Number(item.total || 0);

      if (!productMap[productName]) {
        productMap[productName] = {
          name: productName,
          quantity: 0,
          revenue: 0,
        };
      }

      productMap[productName].quantity += quantity;
      productMap[productName].revenue += itemRevenue;
    }

    // Payment method report
    const paymentMethod = invoice.paymentMethod || "unknown";

    if (!paymentMethodMap[paymentMethod]) {
      paymentMethodMap[paymentMethod] = {
        method: paymentMethod,
        orders: 0,
        revenue: 0,
      };
    }

    paymentMethodMap[paymentMethod].orders += 1;
    paymentMethodMap[paymentMethod].revenue += finalAmount;
  }

  const totalOrders = invoices.length;
  const avgOrderValue = totalOrders ? netRevenue / totalOrders : 0;

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const recentOrders = invoices
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)
    .map((invoice) => ({
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      customer: invoice.billingDetails?.name || "Unknown Customer",
      email: invoice.billingDetails?.email || "",
      phone: invoice.billingDetails?.phone || "",
      amount: Number(invoice.priceDetails?.finalAmount || 0),
      netAmount:
        Number(invoice.priceDetails?.finalAmount || 0) -
        Number(invoice.priceDetails?.tax || 0) -
        Number(invoice.priceDetails?.shippingCost || 0),
      paymentMethod: invoice.paymentMethod,
      paymentStatus: invoice.paymentStatus,
      date: invoice.createdAt,
    }));

  return {
    kpi: {
      grossRevenue: Number(grossRevenue.toFixed(2)),
      netRevenue: Number(netRevenue.toFixed(2)),
      profit: Number(netRevenue.toFixed(2)),
      expenses: 0,
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
      totalOrders,
      taxCollection: Number(taxCollection.toFixed(2)),
      shippingCollection: Number(shippingCollection.toFixed(2)),
      totalDiscount: Number(totalDiscount.toFixed(2)),
    },

    charts: {
      monthlySales: Object.values(monthlyMap),
      dailySales: Object.values(dailyMap),
      paymentMethods: Object.values(paymentMethodMap),
    },

    topProducts,
    recentOrders,

    breakdown: {
      grossRevenue: Number(grossRevenue.toFixed(2)),
      taxCollection: Number(taxCollection.toFixed(2)),
      shippingCollection: Number(shippingCollection.toFixed(2)),
      totalDiscount: Number(totalDiscount.toFixed(2)),
      netRevenue: Number(netRevenue.toFixed(2)),
    },
  };
};

const getDashboardService = async () => {
  const orders = await OrderSummary.find({})
    .populate("orderItems.productId", "name title price mrp")
    .lean();

  const products = await Product.find({}).lean();
  const customers = await User.find({}).lean();

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;

  let totalRevenue = 0;
  let totalProfit = 0;
  let totalExpenses = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let totalShipping = 0;
  let completedOrders = 0;
  let pendingOrders = 0;
  let cancelledOrders = 0;

  orders.forEach((order) => {
    const priceDetails = order.priceDetails || {};

    const finalAmount = Number(
      priceDetails.finalAmount || order.finalAmount || 0
    );

    const subtotal = Number(priceDetails.subtotal || order.totalPrice || 0);

    const tax = Number(priceDetails.tax || order.gst || 0);

    const discount = Number(priceDetails.discount || 0);

    const couponDiscount = Number(priceDetails.couponDiscount || 0);

    const shippingCost = Number(priceDetails.shippingCost || 0);

    totalRevenue += finalAmount;
    totalTax += tax;
    totalDiscount += discount + couponDiscount;
    totalShipping += shippingCost;

    if (order.paymentStatus === "completed") {
      completedOrders += 1;
    }

    if (order.paymentStatus === "pending") {
      pendingOrders += 1;
    }

    if (order.orderStatus === "cancelled") {
      cancelledOrders += 1;
    }

    order.orderItems?.forEach((item) => {
      const salePrice = Number(item.price || 0);
      const quantity = Number(item.quantity || 1);

      const productCost = Number(
        item.productId?.costPerItem || item.costPerItem || 0
      );

      const itemRevenue = salePrice * quantity;
      const itemCost = productCost * quantity;

      totalExpenses += itemCost;
      totalProfit += itemRevenue - itemCost;
    });
  });

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const conversionRate =
    totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0;

  const productReviews = products.reduce((acc, product) => {
    const reviewCount = Number(
      product.reviewCount || product.reviews?.length || 0
    );
    return acc + reviewCount;
  }, 0);

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)
    .map((order) => ({
      _id: order._id,
      customerName:
        `${order.customerDetails?.firstName || ""} ${order.customerDetails?.lastName || ""}`.trim(),
      phone: order.customerDetails?.phone || "",
      paymentMethod: order.paymentMethod || "",
      paymentStatus: order.paymentStatus || "",
      orderStatus: order.orderStatus || "",
      total: order.priceDetails?.finalAmount || order.finalAmount || 0,
      createdAt: order.createdAt,
    }));

  const topProductsMap = {};

  orders.forEach((order) => {
    order.orderItems?.forEach((item) => {
      const productId = String(item.productId?._id || item.productId || "");
      const productName =
        item.productId?.name || item.productId?.title || item.name || "Product";

      if (!topProductsMap[productId]) {
        topProductsMap[productId] = {
          productId,
          name: productName,
          quantitySold: 0,
          revenue: 0,
        };
      }

      topProductsMap[productId].quantitySold += Number(item.quantity || 1);
      topProductsMap[productId].revenue +=
        Number(item.price || 0) * Number(item.quantity || 1);
    });
  });

  const topProducts = Object.values(topProductsMap)
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 8);

  return {
    kpis: {
      revenue: Math.round(totalRevenue),
      profit: Math.round(totalProfit),
      expenses: Math.round(totalExpenses),
      averageOrderValue: Math.round(averageOrderValue),
      orders: totalOrders,
      customers: totalCustomers,
      products: totalProducts,
      conversionRate: Number(conversionRate.toFixed(2)),
      taxCollection: Math.round(totalTax),
      productReviews,
      discount: Math.round(totalDiscount),
      shipping: Math.round(totalShipping),
    },

    orderSummary: {
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
    },

    recentOrders,
    topProducts,
  };
};

const createReviewService = async (body) => {
  return await customerReviewModel.create(body);
};

const getAllReviewsService = async () => {
  return await customerReviewModel
    .find({ isActive: true })
    .populate("productId", "name slug featuredImage")
    .sort({ createdAt: -1 });
};

const getReviewByIdService = async (id) => {
  return await customerReviewModel
    .findOne({ _id: id, isActive: true })
    .populate("productId", "name slug featuredImage");
};

const updateReviewService = async (id, body) => {
  return await customerReviewModel.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
};

const deleteReviewService = async (id) => {
  return await customerReviewModel.findByIdAndDelete(id);
};

const softDeleteReviewService = async (id) => {
  return await customerReviewModel.findByIdAndUpdate(
    id,
    { isActive: false },
    {
      new: true,
      runValidators: true,
    }
  );
};

const updateReviewStatusService = async (id, status) => {
  const normalizedStatus = status?.toLowerCase();

  if (!["pending", "approved", "rejected"].includes(normalizedStatus)) {
    throw new Error("Invalid review status");
  }

  return await customerReviewModel
    .findByIdAndUpdate(
      id,
      { status: normalizedStatus },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate("productId", "name slug featuredImage");
};

const approveReviewService = async (id) => {
  return await customerReviewModel
    .findByIdAndUpdate(
      id,
      { status: "approved" },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate("productId", "name slug featuredImage");
};

const rejectReviewService = async (id) => {
  return await customerReviewModel
    .findByIdAndUpdate(
      id,
      { status: "rejected" },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate("productId", "name slug featuredImage");
};

const getReviewsByProductService = async (productId) => {
  return await customerReviewModel
    .find({
      productId,
      status: "approved",
      isActive: true,
    })
    .sort({ createdAt: -1 });
};

const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

/* ================= CATEGORY SERVICES ================= */

const createInquiryCategory = async (body) => {
  const existingCategory = await InquiryCategory.findOne({
    name: body.name,
  });

  if (existingCategory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Inquiry category already exists"
    );
  }

  const category = await InquiryCategory.create({
    name: body.name,
    slug: body.slug || createSlug(body.name),
    isActive: body.isActive ?? true,
  });

  return category;
};

const getInquiryCategories = async () => {
  return InquiryCategory.find({ isActive: true }).sort({ createdAt: -1 });
};

const updateInquiryCategory = async (id, body) => {
  const category = await InquiryCategory.findByIdAndUpdate(
    id,
    {
      name: body.name,
      slug: body.slug || createSlug(body.name),
      isActive: body.isActive ?? true,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Inquiry category not found");
  }

  return category;
};

const deleteInquiryCategory = async (id) => {
  const category = await InquiryCategory.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Inquiry category not found");
  }

  return category;
};

/* ================= INQUIRY FORM SERVICES ================= */

const createInquiry = async (body) => {
  if (!body.name || !body.number || !body.categoryId || !body.type) {
    throw new ApiError(httpStatus.BAD_REQUEST, "All fields are required");
  }

  const categoryExists = await InquiryCategory.findById(body.categoryId);

  if (!categoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid category selected");
  }

  if (!["B2B", "B2C"].includes(body.type)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid inquiry type");
  }

  // B2C validation
  if (body.type === "B2C") {
    if (
      !body.productId ||
      body.amount === undefined ||
      body.amount === null ||
      body.amount === ""
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Product and amount are required for B2C inquiry"
      );
    }

    if (Number(body.amount) < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Amount cannot be negative");
    }

    // Optional but recommended: validate product exists
    // const productExists = await Product.findById(body.productId);
    // if (!productExists) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, "Invalid product selected");
    // }
  }

  // B2B validation
  if (body.type === "B2B") {
    if (!body.note || !body.note.trim()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Note is required for B2B inquiry"
      );
    }
  }

  const inquiryData = {
    name: body.name,
    number: body.number,
    type: body.type,
    categoryId: body.categoryId,

    ...(body.type === "B2B" && {
      note: body.note,
      productId: null,
      amount: null,
    }),

    ...(body.type === "B2C" && {
      note: "",
      productId: body.productId,
      amount: Number(body.amount),
    }),
  };

  const inquiry = await Inquiry.create(inquiryData);

  return inquiry;
};

const getInquiries = async () => {
  return Inquiry.find()
    .populate("categoryId", "name slug")
    .populate("productId", "name slug price images")
    .sort({ createdAt: -1 });
};

const getInquiryById = async (id) => {
  const inquiry = await Inquiry.findById(id)
    .populate("categoryId", "name slug")
    .populate("productId", "name slug price images");

  if (!inquiry) {
    throw new ApiError(httpStatus.NOT_FOUND, "Inquiry not found");
  }

  return inquiry;
};

const updateInquiryStatus = async (id, body) => {
  if (!body.status) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Status is required");
  }

  const allowedStatus = ["new", "contacted", "converted", "rejected"];

  if (!allowedStatus.includes(body.status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status");
  }

  const inquiry = await Inquiry.findByIdAndUpdate(
    id,
    {
      status: body.status,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("categoryId", "name slug")
    .populate("productId", "name slug price images");

  if (!inquiry) {
    throw new ApiError(httpStatus.NOT_FOUND, "Inquiry not found");
  }

  return inquiry;
};

const deleteInquiry = async (id) => {
  const inquiry = await Inquiry.findByIdAndDelete(id);

  if (!inquiry) {
    throw new ApiError(httpStatus.NOT_FOUND, "Inquiry not found");
  }

  return inquiry;
};
export const getCouponsByProductService = async (productId) => {
  const coupon = await Coupon.find({
    $or: [
      { applyType: "all_website" },
      {
        applyType: "product_wise",
        products: {
          $in: [new mongoose.Types.ObjectId(productId)],
        },
      },
    ],
  });

  console.log("Product:", productId, "Coupons Found:", coupon.length);

  return coupon;
};

const getInventoryStatus = (stock, lowStockThreshold = 5) => {
  const currentStock = Number(stock) || 0;

  if (currentStock <= 0) return "Out of Stock";
  if (currentStock < lowStockThreshold) return "Low Stock";
  return "In Stock";
};

const getProductImage = (product) => {
  if (product.featuredImage) return product.featuredImage;

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];

    if (typeof firstImage === "string") return firstImage;

    return (
      firstImage?.url ||
      firstImage?.image ||
      firstImage?.path ||
      firstImage?.secure_url ||
      ""
    );
  }

  return "";
};

const getCategoryName = (product) => {
  if (product.categoryId && typeof product.categoryId === "object") {
    return (
      product.categoryId.name ||
      product.categoryId.title ||
      product.categoryId.categoryName ||
      "Uncategorized"
    );
  }

  return "Uncategorized";
};

const formatInventoryProduct = (product) => {
  const inventoryStock =
    product.inventory?.stock ??
    product.amazonIntegration?.quantity ??
    0;

  const lowStockThreshold = product.inventory?.lowStockThreshold || 5;

  const status =
    product.inventory?.status ||
    getInventoryStatus(inventoryStock, lowStockThreshold);

  return {
    id: product._id,
    _id: product._id,

    name: product.name,
    sku: product.sku || "-",

    category: getCategoryName(product),
    categoryId: product.categoryId?._id || product.categoryId || null,

    price: product.salePrice > 0 ? product.salePrice : product.price || 0,
    originalPrice: product.price || 0,
    salePrice: product.salePrice || 0,

    stock: inventoryStock,
    status,
    warehouse: product.inventory?.warehouse || "Main Warehouse",
    lowStockThreshold,

    image: getProductImage(product),

    stockStatus: product.stockStatus,
    withStorehouseManagement: product.withStorehouseManagement,

    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

const getInventoryProductsService = async (query) => {
  const {
    search = "",
    category = "all",
    status = "all",
    warehouse = "all",
  } = query;

  const filter = {
    isActive: true,
    "inventory.isVisible": { $ne: false },
  };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
      { barcode: { $regex: search, $options: "i" } },
    ];
  }

  if (status !== "all") {
    filter["inventory.status"] = status;
  }

  if (warehouse !== "all") {
    filter["inventory.warehouse"] = warehouse;
  }

  if (category !== "all") {
    filter.categoryId = category;
  }

  const products = await Product.find(filter)
    .populate("categoryId", "name title categoryName")
    .sort({ createdAt: -1 })
    .lean();

  return products.map(formatInventoryProduct);
};

const addProductToInventoryService = async (body) => {
  const {
    productId,
    stock = 0,
    warehouse = "Main Warehouse",
    lowStockThreshold = 5,
  } = body;

  if (!productId) {
    const error = new Error("Product ID is required");
    error.statusCode = 400;
    throw error;
  }

  const finalStock = Number(stock) || 0;
  const finalStatus = getInventoryStatus(finalStock, lowStockThreshold);

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      withStorehouseManagement: true,
      stockStatus: finalStock > 0 ? "in_stock" : "out_of_stock",

      "inventory.stock": finalStock,
      "inventory.status": finalStatus,
      "inventory.warehouse": warehouse,
      "inventory.lowStockThreshold": Number(lowStockThreshold) || 5,
      "inventory.isVisible": true,

      "amazonIntegration.quantity": finalStock,
    },
    { new: true }
  )
    .populate("categoryId", "name title categoryName")
    .lean();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return formatInventoryProduct(product);
};

const updateInventoryStockService = async (id, body) => {
  const { stock } = body;

  if (stock === undefined || stock === null) {
    const error = new Error("Stock is required");
    error.statusCode = 400;
    throw error;
  }

  const finalStock = Number(stock);

  if (Number.isNaN(finalStock) || finalStock < 0) {
    const error = new Error("Stock must be a valid positive number");
    error.statusCode = 400;
    throw error;
  }

  const existingProduct = await Product.findById(id).lean();

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const lowStockThreshold = existingProduct.inventory?.lowStockThreshold || 5;
  const finalStatus = getInventoryStatus(finalStock, lowStockThreshold);

  const product = await Product.findByIdAndUpdate(
    id,
    {
      withStorehouseManagement: true,
      stockStatus: finalStock > 0 ? "in_stock" : "out_of_stock",

      "inventory.stock": finalStock,
      "inventory.status": finalStatus,
      "inventory.isVisible": true,

      "amazonIntegration.quantity": finalStock,
    },
    { new: true }
  )
    .populate("categoryId", "name title categoryName")
    .lean();

  return formatInventoryProduct(product);
};

const updateInventoryStatusService = async (id, body) => {
  const status = body.status || body.inventoryStatus;

  const allowedStatus = ["In Stock", "Low Stock", "Out of Stock"];

  if (!allowedStatus.includes(status)) {
    const error = new Error("Invalid inventory status");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      "inventory.status": status,
      stockStatus: status === "Out of Stock" ? "out_of_stock" : "in_stock",
    },
    { new: true }
  )
    .populate("categoryId", "name title categoryName")
    .lean();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return formatInventoryProduct(product);
};

const updateInventoryWarehouseService = async (id, body) => {
  const { warehouse } = body;

  const allowedWarehouses = [
    "Main Warehouse",
    "Secondary Warehouse",
    "Cold Storage",
  ];

  if (!allowedWarehouses.includes(warehouse)) {
    const error = new Error("Invalid warehouse");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      "inventory.warehouse": warehouse,
      "inventory.isVisible": true,
    },
    { new: true }
  )
    .populate("categoryId", "name title categoryName")
    .lean();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return formatInventoryProduct(product);
};

const removeProductFromInventoryService = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    {
      "inventory.isVisible": false,
    },
    { new: true }
  )
    .populate("categoryId", "name title categoryName")
    .lean();

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return formatInventoryProduct(product);
};

export default {
  createLabel, removeProductFromInventoryService,
  updateInventoryWarehouseService,
  updateInventoryStatusService,
  getInventoryProductsService,
  updateInventoryStockService,
  addProductToInventoryService,
  deleteLabel,
  updateLabel,
  getLabels,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createSubCategory,
  sendOrderConfirmationWhatsApp,
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
  createAttribute,
  getAttributes,
  updateAttribute,
  deleteAttribute,
  deleteContactUs,
  getCouponByCodeAndCategory,
  deleteBrand,
  updateBrand,
  getBrand,
  createBrand,
  deleteFAQ,
  getFaqs,
  getOrderList,
  getOrderById,
  createShippingStatus,
  getShippingStatus,
  updateShippingStatus,
  deleteShippingStatus,
  createOrderTacking,
  getOrderTracking,
  updateOrderTracking,
  deleteOrderTracking,
  createWalletAmount,
  createCoupon,
  getCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  verifyCouponForCategories,
  getWalletAmount,
  updateWalletAmount,
  deleteWalletAmount,
  createTag,
  getTag,
  updateTag,
  deleteTag,
  createProductStatus,
  getProductStatus,
  updateProductStatus,
  deleteProductStatus,
  updatePaymentStatusService,
  createAboutUsPage,
  getAboutUsById,
  getAboutUsPage,
  updateAboutUsPage,
  deleteAboutUsPage,
  createBlog,
  getBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogByTitle,
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
  uploadWarrantyData,
  validateWarrantyNumbers,
  addWarrantyNumbersForProducts,
  updateOrderStatusService,
  updateShippingStatusService,
  getOrdersByShippingStatusService,
  getAllContacts,
  getAllComplaints,
  getComplaintById,
  getUserById,
  updateComplaint,
  deleteComplaint,
  getQuickFixById,
  getAllQuickFix,
  updateQuickFix,
  deleteQuickFix,
  createQuickFix,
  getAllWarranties,
  deleteOrderSummaryById,
  sendOfferNotificationWhatsApp,
  sendBulkOfferNotificationWhatsApp,
  createBlogContains,
  getAllBlogContains,
  getBlogContainsBYBlogId,
  getBlogContainsByTitle,
  updateBlogContains,
  deleteBlogContains,
  getProductsByCategory,
  getDashboardData,
  updateOrderSummaryById,
  sendOrderUpdateWhatsApp,
  getCartByUserId,
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
  getMostLoved,
  upsertMostLoved,
  getFeatured,
  upsertFeatured,
  getVideoSection,
  upsertVideoSection,
  getNewProductSection,
  upsertNewProductSection,
  getAboutSectionService,
  saveAboutSectionService,
  getWhyChooseService,
  saveWhyChooseService,
  getPuritySectionService,
  savePuritySectionService,
  getFAQService,
  saveFAQService,
  getTestimonialService,
  saveTestimonialService,
  getInvoiceByIdService,
  getInvoiceByOrderService,
  getAllInvoicesService,
  updateInvoiceService,
  updateInvoiceService,
  deleteInvoiceService,
  createDeliveryOptionService,
  getAdminDeliveryOptionsService,
  getSingleDeliveryOptionService,
  updateDeliveryOptionService,
  deleteDeliveryOptionService,
  getCheckoutDeliveryOptionsService,
  getDashboardReport,
  getDashboardService,
  createReviewService,
  getAllReviewsService,
  getReviewByIdService,
  getReviewsByProductService,
  updateReviewService,
  deleteReviewService,
  approveReviewService,
  rejectReviewService,
  updateReviewStatusService,
  softDeleteReviewService,
  verifyCouponForCategories,
  createInquiryCategory,
  getInquiryCategories,
  updateInquiryCategory,
  deleteInquiryCategory,
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  getCouponsByProductService,
};
