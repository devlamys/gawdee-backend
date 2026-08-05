import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import {
  testAmazonConnectionService,
  syncAmazonOrdersService,
  listAmazonOrdersFromDbService,
  updateAmazonInventoryService,
  updateAmazonPriceService,
  markProductReadyForAmazonService,
} from "../services/amazon.service.js";

const testAmazonConnection = catchAsync(async (req, res) => {
  const data = await testAmazonConnectionService();
  res.status(httpStatus.OK).send({
    success: true,
    message: "Amazon SP-API connection successful",
    data,
  });
});

const syncAmazonOrders = catchAsync(async (req, res) => {
  const data = await syncAmazonOrdersService({ days: req.query.days || 7 });
  res.status(httpStatus.OK).send({
    success: true,
    message: "Amazon orders synced successfully",
    data,
  });
});

const getAmazonOrders = catchAsync(async (req, res) => {
  const data = await listAmazonOrdersFromDbService(req.query);
  res.status(httpStatus.OK).send({
    success: true,
    message: "Amazon orders fetched successfully",
    data,
  });
});

const updateAmazonInventory = catchAsync(async (req, res) => {
  const data = await updateAmazonInventoryService(req.params.productId);
  res.status(httpStatus.OK).send({
    success: true,
    message: "Amazon inventory updated successfully",
    data,
  });
});

const updateAmazonPrice = catchAsync(async (req, res) => {
  const data = await updateAmazonPriceService(req.params.productId);
  res.status(httpStatus.OK).send({
    success: true,
    message: "Amazon price updated successfully",
    data,
  });
});

const markProductReadyForAmazon = catchAsync(async (req, res) => {
  const data = await markProductReadyForAmazonService(req.params.productId, req.body);
  res.status(httpStatus.OK).send({
    success: true,
    message: "Product Amazon details saved successfully",
    data,
  });
});

export default {
  testAmazonConnection,
  syncAmazonOrders,
  getAmazonOrders,
  updateAmazonInventory,
  updateAmazonPrice,
  markProductReadyForAmazon,
};
