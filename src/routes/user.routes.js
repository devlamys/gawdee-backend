import { Router } from 'express';
import userController from '../controllers/user.controller.js';

const router = Router();

router.post("/influencer/register", userController.createVisitEntryController);
router.get('/products', userController.getProducts);
router.get("/product-by-category/:categoryId", userController.getProductsByCategory);
router.get('/product/:productId', userController.getProductsById);
router.get('/categories', userController.getCategories);
router.post('/create-order', userController.createOrderSummaryHandler);
router.post('/create-razorpay-order', userController.createRazorpayOrder);
router.route('/order-summary/:id')
.get(userController.getOrderSummaryById)
.put(userController.updateOrderSummaryByIdHandler)
.delete(userController.deleteOrderSummaryByIdHandler)

router.get('/order-list/:userId', userController.getOrdersByUserId);
router.delete('/delete_user/:userId', userController.deleteUser);
router.get("/quick-fix", userController.getQuickFixByProductAndProblem);
router.get('/quick-fix/:id', userController.getQuickFixById);
router.post('/complaint', userController.createComplaint);
router.get('/problems', userController.getProblem);


router.get('/user/:userId', userController.getUserById);

//cart

router.post('/warranty', userController.createWarranty);

router.get('/warranties', userController.getAllWarranties);

router.get('/warranties/:userId', userController.getWarrantiesByUserId);
router.get('/coupons', userController.getCoupon);
router.get('/blogs', userController.getBlog);
router.get('/about-us', userController.getAboutUsPage);
router.get('/about-us/:id', userController.getAboutUsPage);
router.get('/blog-detail', userController.getBlogContainsByBlogId);
router.route('/contact-us')
.post(userController.createContact)
.get(userController.getContacts);
router.get('/brand', userController.getBrand);

router.post('/cart', userController.createCart); 
router.get('/cart/:userId', userController.getCartByUserId);
router.put('/cart/:cartId', userController.updateCartItems);
router.put('/cart/:cartId/status',userController.updateCartStatus);
router.delete('/cart/:cartId/item/:productId', userController.deleteCartItems);
router.post("/cart/update-item-qty", userController.updateCartItemQty);
router.post('/cart/remove-item', userController.removeCartItem);
router.post('/addWishlist',userController.createWishlist)
router.put('/deleteWishlistProduct',userController.deleteWishlistProduct)
router.route('/wishlist/:userId')
  .get(userController.getWishlist)
  .delete(userController.deleteWishlist)
  
router.get('/orderList/:userId',userController.getOrderListByUser);
router.get("/product/by-title/:title", userController.getProductByNameController);
router.get("/products/search", userController.search);



router.route('/review')
.post(userController.createFeedback)
.get(userController.getFeedbacks);

router.route('/review/:id')
.put(userController.updateFeedback)
.delete(userController.deleteFeedback);



router.post('/addShippingAddress/:userId',userController.addShippingAddress)
router.patch('/updatePrimaryAddress/:userId/:addressId',userController.updatePrimaryAddress)
router.put('/updateAddress/:userId/:addressId',userController.updateShippingAddress)
router.delete('/deleteAddress/:userId/:addressId',userController.deleteShippingAddress)
router.get('/getUserAddress/:userId',userController.getUserAddressById)


router.get('/contact-us/:id', userController.getContact);
router.post('/apply', userController.applyCoupon); 
router.post("/verify", userController.verifyCouponByCategory);
router.get('/category/:categoryId', userController.getCouponsByCategory); 

router.get('/getOrderByUserId/:userId',userController.getOrderByUserId)
router.put('/order-status/:userId/:orderId',userController.orderStatusChange)
       

router.get('/getOrderReceipt/:userId/:orderId',userController.getOrderReceipt)

router.post('/generate-codes', userController.createCodes);
router.post('/use-code', userController.useCode);

router.post('/send-otp', userController.sendOtp);
router.post('/verify-and-apply', userController.verifyAndApplyCode);

router.get('/hero-section', userController.getHeroSection);
router.get('/banners', userController.getBanner);
router.get('/res-hero-section', userController.getResHeroSection);

router.get('/product/by-slug/:slug', userController.getProductBySlugController);

router.post("/return-request/create", userController.createReturnRequest);

router.put("/order/cancel/:id", userController.cancelOrderController);

router.post("/invoice/create", userController.generateInvoiceController);

router.post(
  "/shipping/icarry/create/:orderId",
  userController.createIcarryShipmentController
);

router.get(
  "/shipping/icarry/track/:orderId",
  userController.trackIcarryShipmentController
);

router.post(
  "/shipping/icarry/cancel/:orderId",
  userController.cancelIcarryShipmentController
);

router.post(
  "/shipping/shipments/webhook/icarry",
  userController.icarryShipmentWebhookController
);

export default router;