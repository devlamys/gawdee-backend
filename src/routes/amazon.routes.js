import { Router } from "express";
import amazonController from "../controllers/amazon.controller.js";

const router = Router();

router.get("/test", amazonController.testAmazonConnection);

router.get("/orders", amazonController.getAmazonOrders);
router.post("/orders/sync", amazonController.syncAmazonOrders);

router.post("/products/:productId/ready", amazonController.markProductReadyForAmazon);
router.post("/products/:productId/inventory", amazonController.updateAmazonInventory);
router.post("/products/:productId/price", amazonController.updateAmazonPrice);

export default router;
