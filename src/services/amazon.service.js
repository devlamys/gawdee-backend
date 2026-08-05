import Product from "../models/product.model.js";
import AmazonOrder from "../models/amazonOrder.model.js";
import { amazonRequest } from "./amazon.client.js";

const getMarketplaceId = () => process.env.AMAZON_MARKETPLACE_ID || "A21TJRUUN4KGV";
const getSellerId = () => process.env.AMAZON_SELLER_ID;
const getDefaultProductType = () => process.env.AMAZON_DEFAULT_PRODUCT_TYPE || "PRODUCT";

export const testAmazonConnectionService = async () => {
  return amazonRequest({
    method: "GET",
    path: "/sellers/v1/marketplaceParticipations",
  });
};

export const getAmazonOrdersService = async ({ days = 7, nextToken } = {}) => {
  const query = nextToken
    ? { NextToken: nextToken }
    : {
        MarketplaceIds: getMarketplaceId(),
        CreatedAfter: new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000).toISOString(),
      };

  return amazonRequest({
    method: "GET",
    path: "/orders/v0/orders",
    query,
  });
};

export const syncAmazonOrdersService = async ({ days = 7 } = {}) => {
  const ordersResponse = await getAmazonOrdersService({ days });
  const orders = ordersResponse?.payload?.Orders || [];
  const savedOrders = [];

  for (const order of orders) {
    const amazonOrderId = order.AmazonOrderId;
    let orderItems = [];

    try {
      const itemResponse = await amazonRequest({
        method: "GET",
        path: `/orders/v0/orders/${amazonOrderId}/orderItems`,
      });

      orderItems = itemResponse?.payload?.OrderItems || [];
    } catch (error) {
      console.error("Amazon order items sync error:", amazonOrderId, error.response?.data || error.message);
    }

    const savedOrder = await AmazonOrder.findOneAndUpdate(
      { amazonOrderId },
      {
        amazonOrderId,
        marketplaceId: order.MarketplaceId,
        orderStatus: order.OrderStatus,
        fulfillmentChannel: order.FulfillmentChannel,
        salesChannel: order.SalesChannel,
        purchaseDate: order.PurchaseDate,
        lastUpdateDate: order.LastUpdateDate,
        buyerEmail: order.BuyerInfo?.BuyerEmail || "",
        buyerName: order.BuyerInfo?.BuyerName || "",
        shippingAddress: {
          name: order.ShippingAddress?.Name || "",
          addressLine1: order.ShippingAddress?.AddressLine1 || "",
          addressLine2: order.ShippingAddress?.AddressLine2 || "",
          city: order.ShippingAddress?.City || "",
          stateOrRegion: order.ShippingAddress?.StateOrRegion || "",
          postalCode: order.ShippingAddress?.PostalCode || "",
          countryCode: order.ShippingAddress?.CountryCode || "",
          phone: order.ShippingAddress?.Phone || "",
        },
        amount: Number(order.OrderTotal?.Amount || 0),
        currency: order.OrderTotal?.CurrencyCode || "",
        items: orderItems.map((item) => ({
          asin: item.ASIN,
          sellerSku: item.SellerSKU,
          orderItemId: item.OrderItemId,
          title: item.Title,
          quantityOrdered: item.QuantityOrdered,
          quantityShipped: item.QuantityShipped,
          itemPrice: Number(item.ItemPrice?.Amount || 0),
          currency: item.ItemPrice?.CurrencyCode || "",
        })),
        rawData: { order, orderItems },
        syncStatus: "synced",
        syncError: "",
      },
      { upsert: true, new: true }
    );

    savedOrders.push(savedOrder);
  }

  return {
    totalFetched: orders.length,
    totalSaved: savedOrders.length,
    nextToken: ordersResponse?.payload?.NextToken || null,
    orders: savedOrders,
  };
};

export const listAmazonOrdersFromDbService = async ({ page = 1, limit = 20, status = "" }) => {
  const filter = {};
  if (status) filter.orderStatus = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    AmazonOrder.find(filter).sort({ purchaseDate: -1 }).skip(skip).limit(Number(limit)),
    AmazonOrder.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const updateAmazonInventoryService = async (productId) => {
  const sellerId = getSellerId();
  if (!sellerId) throw new Error("AMAZON_SELLER_ID is missing in config.env");

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  const sellerSku = product.amazonIntegration?.sellerSku || product.sku;
  if (!sellerSku) throw new Error("Product SKU is required for Amazon inventory sync");

  const quantity = Number(product.amazonIntegration?.quantity ?? product.quantity ?? product.stock ?? 0);
  const productType = product.amazonIntegration?.productType || getDefaultProductType();

  const body = {
    productType,
    patches: [
      {
        op: "replace",
        path: "/attributes/fulfillment_availability",
        value: [
          {
            fulfillment_channel_code: "DEFAULT",
            quantity,
          },
        ],
      },
    ],
  };

  const response = await amazonRequest({
    method: "PATCH",
    path: `/listings/2021-08-01/items/${sellerId}/${encodeURIComponent(sellerSku)}`,
    query: {
      marketplaceIds: getMarketplaceId(),
    },
    body,
  });

  product.amazonIntegration = {
    ...(product.amazonIntegration || {}),
    sellerSku,
    productType,
    marketplaceId: getMarketplaceId(),
    quantity,
    listingStatus: "inventory_updated",
    lastSyncedAt: new Date(),
    syncError: "",
  };

  await product.save();

  return { product, amazonResponse: response };
};

export const updateAmazonPriceService = async (productId) => {
  const sellerId = getSellerId();
  if (!sellerId) throw new Error("AMAZON_SELLER_ID is missing in config.env");

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  const sellerSku = product.amazonIntegration?.sellerSku || product.sku;
  if (!sellerSku) throw new Error("Product SKU is required for Amazon price sync");

  const price = Number(product.salePrice || product.price || 0);
  if (!price) throw new Error("Product price is required for Amazon price sync");

  const productType = product.amazonIntegration?.productType || getDefaultProductType();

  const body = {
    productType,
    patches: [
      {
        op: "replace",
        path: "/attributes/purchasable_offer",
        value: [
          {
            currency: "INR",
            our_price: [
              {
                schedule: [
                  {
                    value_with_tax: price,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const response = await amazonRequest({
    method: "PATCH",
    path: `/listings/2021-08-01/items/${sellerId}/${encodeURIComponent(sellerSku)}`,
    query: {
      marketplaceIds: getMarketplaceId(),
    },
    body,
  });

  product.amazonIntegration = {
    ...(product.amazonIntegration || {}),
    sellerSku,
    productType,
    marketplaceId: getMarketplaceId(),
    price,
    listingStatus: "price_updated",
    lastSyncedAt: new Date(),
    syncError: "",
  };

  await product.save();

  return { product, amazonResponse: response };
};

export const markProductReadyForAmazonService = async (productId, body = {}) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.amazonIntegration = {
    ...(product.amazonIntegration || {}),
    sellerSku: body.sellerSku || product.amazonIntegration?.sellerSku || product.sku,
    asin: body.asin || product.amazonIntegration?.asin || "",
    productType: body.productType || product.amazonIntegration?.productType || getDefaultProductType(),
    marketplaceId: body.marketplaceId || getMarketplaceId(),
    listingStatus: "ready",
    syncEnabled: body.syncEnabled ?? true,
    syncError: "",
    lastSyncedAt: new Date(),
  };

  await product.save();

  return product;
};
