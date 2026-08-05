import { Router } from 'express';
import adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import multer from 'multer';

const router = Router() ;
const upload = multer({ dest: 'uploads/' });

router.get('/categories', adminController.getCategories);
router.get('/products', adminController.getProducts);
router.get('/product/:id', adminController.getProductsById);
router.get('/orders/shipping-status/:status', adminController.getOrdersByShippingStatus);
router.get('/contact-us', adminController.getContacts);
router.get('/orderList',adminController.getOrderList);
router.get('/order/:id', adminController.getOrderById);
router.get('/shipping-status', adminController.getShippingStatus);
router.get('/complaints', adminController.getAllComplaints);
router.get('/quick-fix', adminController.getAllQuickFix);
router.get('/warranties', adminController.getAllWarranties);
router.get('/blog-details', adminController.getAllBlogContains);
router.get('/blog-detail/:blogId', adminController.getBlogContainsBYBlogId);
router.get("/product-by-category/:categoryId", adminController.getProductsByCategory);
router.get('/cart/:userId', adminController.getCartByUserId);
router.get('/user/:userId', adminController.getUserById);
router.get('/blog-by-title', adminController.getBlogByTitle);
router.get('/blog-detail-by-title', adminController.getBlogContainsByTitle);
router.post('/apply', adminController.applyCoupon);  
router.post("/verify", adminController.verifyCouponByCategory);
router.get("/coupon/product/:productId", adminController.getCouponsByProductController);



// router.use(authMiddleware.authenti cateAdmin);

router.route('/category')
  .post(adminController.createCategory);

router.route('/category/:id')
  .put(adminController.updateCategory)
  .delete(adminController.deleteCategory);

router.route('/brand')
  .post(adminController.createBrand);

router.get("/brands", adminController.getBrand);

router.route('/brand/:id')
  .put( adminController.updateBrand)
  .delete(adminController.deleteBrand);

router.route('/label')
  .post(adminController.createLabel);

router.get("/labels", adminController.getLabels);

router.route('/label/:id')
  .put(adminController.updateLabel)
  .delete(adminController.deleteLabel);

router.post('/collection', adminController.createCollection)
router.get('/collections', adminController.getCollection)

router.route('/collection/:id')
  .put(adminController.updateCollection)
  .delete(adminController.deleteCollection);

router.route('/subcategory')
  .post(adminController.createSubCategory)
  .get(adminController.getSubCategories);

router.route('/subcategory/:id')
  .put(adminController.updateSubCategory)
  .get(adminController.getSubCategoryByCategoryId)
  .delete(adminController.deleteSubCategory);

router.route('/product')
  .post(adminController.createProduct);

  router.route('/product/:id')
  .put(adminController.updateProduct)
  .delete(adminController.deleteProduct);

  router.route('/blog-detail')
  .post(adminController.createBlogContains);

  router.route('/blog-detail/:id')
  .put(adminController.updateBlogContains)
  
  .delete(adminController.deleteBlogContains);
  
  
  router.get('/productFaqs',adminController.getFaqs)
  router.get('/related-product/:productId', adminController.getRelatedProduct);
  router.delete('/product/:id/faq',adminController.deleteFAQ)
  router.get('/featured-product', adminController.getFeaturedProducts);

router.route('/attribute')
.post(adminController.addAttribute)
.get(adminController.getAttributes);

router.route('/attribute/:id')
.put(adminController.updateAttribute)
.delete(adminController.deleteAttribute);

router.post('/shipping-status', adminController.addShippingStatus);

router.route('/shipping-status/:id')
.put(adminController.updateShippingStatus)
.delete(adminController.deleteShippingStatus);

router.route('/order-tracking')
.get(adminController.getOrderTracking);

router.route('/order-tracking/:id')
.post(adminController.addOrderTracking)
.put(adminController.updateOrderTracking)
.delete(adminController.deleteOrderTracking);

router.route('/wallet-amount')
.post(adminController.createWalletAmount)
.get(adminController.getWalletAmount);

router.route('/wallet-amount/:id')
.put(adminController.updateWalletAmount)
.delete(adminController.deleteWalletAmount);

router.route('/coupon')
.post(adminController.createCoupon)
.get(adminController.getCoupon);

router.route('/coupon/:id')
.get(adminController.getCouponById)
.put(adminController.updateCoupon)
.delete(adminController.deleteCoupon);

router.route('/product-status')
.post(adminController.addProductStatus)
.get(adminController.getProductStatus);

router.route('/product-status/:id')
.put(adminController.updateProductStatus)
.delete(adminController.deleteProductStatus);

router.put('/update-status/:orderId', adminController.updatePaymentStatus);
router.put('/update-order-status/:orderId', adminController.updateOrderStatus);
router.put('/update-shipping-status/:orderId', adminController.updateShippingStatusService);
router.put('/update-order-summary/:id', adminController.updateOrderSummaryByIdHandler);
router.delete('/order-summary/:id', adminController.deleteOrderSummaryById);

router.delete('/delete-contact/:id', adminController.deleteContactUs);


router.route('/about-us')
.post(adminController.addAboutUsPage)
.get(adminController.getAboutUsPage);

router.route('/about-us/:id')
.put(adminController.updateAboutUsPage)
.get(adminController.getAboutUsById)
.delete(adminController.deleteAboutUsPage);

router.route('/blog')
.post(adminController.addBlog)
.get(adminController.getBlog);

router.route('/blog/:id')
.put(adminController.updateBlog)
.get(adminController.getBlogById)
.delete(adminController.deleteBlog);

router.route('/banner')
.post(adminController.addBanner)
.get(adminController.getBanner);

router.route('/banner/:id')
.put(adminController.updateBanner)
.delete(adminController.deleteBanner);

router.route('/complaint/:id')
.get(adminController.getComplaintById)
.put(adminController.updateComplaint)
.delete(adminController.deleteComplaint);

router.post('/quick-fix', adminController.createQuickFix);

router.route('/quick-fix/:id')
.get(adminController.getQuickFixById)
.put(adminController.updateQuickFix)
.delete(adminController.deleteQuickFix);

router.get("/dashboard-data", adminController.getDashboardData);


router.post('/upload', upload.single('file'), adminController.uploadWarranty);

router.post('/add/warranty', adminController.addMultipleWarrantyNumbers);

router.post("/send-order-confirmation", adminController.sendOrderConfirmation);

router.post("/send-offer-notification", adminController.sendOfferNotification);
router.post("/send-bulk-offer-notification", adminController.sendBulkOfferNotification);

router.post('/order/:orderId/notify-status', adminController.notifyOrderStatus);

router.route('/hero-section')
.post(adminController.createHeroSection)
.get(adminController.getHeroSection);

router.route('/hero-section/:id')
.put(adminController.updateHeroSection)
.delete(adminController.deleteHeroSection);

router.route('/res-hero-section')
.post(adminController.createResHeroSection)
.get(adminController.getResHeroSection);

router.route('/res-hero-section/:id')
.put(adminController.updateResHeroSection)
.delete(adminController.deleteResHeroSection);

router.route('/option')
  .post(adminController.createProductOption)
  .get(adminController.getProductOptions);

router.route('/option/:id')
  .put(adminController.updateProductOption)
  .delete(adminController.deleteProductOption);

router.route('/flash-sale')
  .post(adminController.createFlashSale)
  .get(adminController.getFlashSales);

router.route('/flash-sale/:id')
  .put(adminController.updateFlashSale)
  .delete(adminController.deleteFlashSale);

router.route('/tax')
  .post(adminController.createTax)
  .get(adminController.getTaxes);

router.route('/tax/:id')
  .put(adminController.updateTax)
  .delete(adminController.deleteTax);

router.route('/specification-group')
  .post(adminController.createSpecificationGroup)
  .get(adminController.getSpecificationGroups);

router.route('/specification-group/:id')
  .put(adminController.updateSpecificationGroup)
  .delete(adminController.deleteSpecificationGroup);

router.route('/specification-attribute')
  .post(adminController.createSpecificationAttribute)
  .get(adminController.getSpecificationAttributes);

router.route('/specification-attribute/:id')
  .put(adminController.updateSpecificationAttribute)
  .delete(adminController.deleteSpecificationAttribute);

router.route('/specification-table')
  .post(adminController.createSpecificationTableGroup)
  .get(adminController.getSpecificationTableGroups);

router.route('/specification-table/:id')
  .put(adminController.updateSpecificationTableGroup)
  .delete(adminController.deleteSpecificationTableGroup);

router.route('/blog-category')
  .post(adminController.createBlogCategory)
  .get(adminController.getBlogCategories);

router.route('/blog-category/:id')
  .put(adminController.updateBlogCategory)
  .delete(adminController.deleteBlogCategory);

router.route('/blog-tag')
  .post(adminController.createBlogTag)
  .get(adminController.getBlogTags);

router.route('/blog-tag/:id')
  .put(adminController.updateBlogTag)
  .delete(adminController.deleteBlogTag);

router.route('/transaction')
  .post(adminController.createTransaction)
  .get(adminController.getTransactions);

router.route('/transaction/:id')
  .put(adminController.updateTransaction)
  .get(adminController.getTransactionById)
  .delete(adminController.deleteTransaction);

router.route('/subscriber')
  .post(adminController.createSubscriber)
  .get(adminController.getSubscribers);

router.route('/subscriber/:id')
  .put(adminController.updateSubscriber)
  .delete(adminController.deleteSubscriber);

router.get("/most-loved", adminController.getMostLovedController);

router.post("/most-loved", adminController.upsertMostLovedController);

router.get("/featured", adminController.getFeaturedController);

router.post("/featured", adminController.upsertFeaturedController);

router.get("/video-section", adminController.getVideoSectionController);

router.post("/video-section", adminController.upsertVideoSectionController);

router.get("/new-add", adminController.getNewProductSectionController);

router.post("/new-add", adminController.upsertNewProductSectionController);

router.get("/about", adminController.getAboutSection);

router.post("/about", adminController.saveAboutSection);

router.get("/why-choose", adminController.getWhyChoose);

router.post("/why-choose", adminController.saveWhyChoose);

router.get("/purity", adminController.getPuritySection);

router.post("/purity", adminController.savePuritySection);

router.get("/faq", adminController.getFAQSection);

router.post("/faq", adminController.saveFAQSection);

router.get("/testimonial", adminController.getTestimonialSection);

router.post("/testimonial", adminController.saveTestimonialSection);

router.get("/invoice/order/:orderId", adminController.getInvoiceByOrderController);
router.get("/invoice/:id", adminController.getInvoiceController);
router.get("/invoices", adminController.getAllInvoicesController);


router.post('/delivery-options', adminController.createDeliveryOption);

router.get('/delivery-options', adminController.getAdminDeliveryOptions);

router.get('/delivery-options/:id', adminController.getSingleDeliveryOption);

router.put('/delivery-options/:id', adminController.updateDeliveryOption);

router.delete('/delivery-options/:id', adminController.deleteDeliveryOption);

router.get('/user/delivery-options', adminController.getCheckoutDeliveryOptions);

router.get('/reports', adminController.getReportController);

router.get('/dashboard', adminController.getDashboardController);

router.post("/customer-review/create", adminController.createCustomerReview);
router.get("/customer-review", adminController.getAllCustomerReviews);
router.get("/customer-review/product/:productId/reviews", adminController.getReviewsByProduct);
router.get("/customer-review/:id", adminController.getCustomerReviewById);
router.put("/customer-review/:id", adminController.updateCustomerReview);
router.put("/customer-review/:id/status", adminController.updateCustomerReview);
router.delete("/customer-review/:id/delete", adminController.deleteCustomerReview);
router.put("/customer-review/:id/approve", adminController.approveCustomerReview);
router.put("/customer-review/:id/reject", adminController.rejectCustomerReview);


router.post("/inquiry-categories", adminController.createInquiryCategory);

router.get("/inquiry-categories", adminController.getInquiryCategories);

router.put("/inquiry-categories/:id", adminController.updateInquiryCategory);

router.delete("/inquiry-categories/:id", adminController.deleteInquiryCategory);


router.post("/inquiries", adminController.createInquiry);

router.get("/inquiries", adminController.getInquiries);

router.get("/inquiries/:id", adminController.getInquiryById);

router.patch("/inquiries/:id/status", adminController.updateInquiryStatus);

router.delete("/inquiries/:id", adminController.deleteInquiry);

router.get("/product/inventory", adminController.getInventoryProductsController);

router.post("/add-product/inventory", adminController.addProductToInventoryController);

router.put("/inventory/:id/stock", adminController.updateInventoryStockController);

router.put("/inventory/:id/status", adminController.updateInventoryStatusController);

router.put("/inventory/:id/warehouse", adminController.updateInventoryWarehouseController);

router.put("/inventory/:id/remove", adminController.removeProductFromInventoryController);


export default router;
