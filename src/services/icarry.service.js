import axios from "axios";

const safeJson = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return data;
  }
};

const maskKey = (key = "") => {
  if (!key) return "MISSING";
  return `${key.slice(0, 6)}********${key.slice(-6)}`;
};

const getEnv = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is missing in .env`);
  }

  return value;
};

const getBaseUrl = () => {
  const baseUrl = getEnv("ICARRY_BASE_URL").trim();

  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    throw new Error("ICARRY_BASE_URL must start with http:// or https://");
  }

  if (baseUrl.includes("#") || baseUrl.includes("/account")) {
    throw new Error("ICARRY_BASE_URL must be API base URL only");
  }

  return baseUrl.replace(/\/$/, "");
};

const getErrorUrl = (error) => {
  const baseURL = error?.config?.baseURL || "";
  const url = error?.config?.url || "";

  return baseURL || url ? `${baseURL}${url}` : "N/A";
};

const icarryApi = () => {
  return axios.create({
    baseURL: getBaseUrl(),
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });
};

const getFirstValue = (...values) => {
  return values.find(
    (value) => value !== undefined && value !== null && value !== ""
  );
};

const getIcarryMainData = (data) => {
  if (!data) return {};

  if (Array.isArray(data)) {
    return data[0] || {};
  }

  if (Array.isArray(data.data)) {
    return data.data[0] || {};
  }

  if (Array.isArray(data.shipment)) {
    return data.shipment[0] || {};
  }

  if (Array.isArray(data.shipments)) {
    return data.shipments[0] || {};
  }

  return (
    data.data ||
    data.shipment ||
    data.shipments ||
    data.result ||
    data.response ||
    data
  );
};

const normalizeIcarryStatus = (data, fallback = "Status Updated") => {
  const main = getIcarryMainData(data);

  return getFirstValue(
    data?.status,
    data?.current_status,
    data?.shipment_status,
    data?.order_status,
    data?.shipping_status,
    data?.delivery_status,
    data?.tracking_status,

    main?.status,
    main?.current_status,
    main?.shipment_status,
    main?.order_status,
    main?.shipping_status,
    main?.delivery_status,
    main?.tracking_status,

    data?.data?.status,
    data?.data?.current_status,
    data?.data?.shipment_status,
    data?.data?.order_status,
    data?.data?.shipping_status,

    fallback
  );
};

const normalizeIcarryShipmentResponse = (
  data,
  fallbackStatus = "Shipment Created"
) => {
  const main = getIcarryMainData(data);

  const shipmentId = getFirstValue(
    data?.shipment_id,
    data?.shipmentId,
    data?.id,
    main?.shipment_id,
    main?.shipmentId,
    main?.id,
    data?.data?.shipment_id,
    data?.data?.shipmentId,
    data?.data?.id
  );

  const awb = getFirstValue(
    data?.awb,
    data?.awb_number,
    data?.awbNumber,
    data?.awb_no,
    data?.tracking_id,
    main?.awb,
    main?.awb_number,
    main?.awbNumber,
    main?.awb_no,
    main?.tracking_id,
    data?.data?.awb,
    data?.data?.awb_number,
    data?.data?.awbNumber,
    data?.data?.awb_no,
    data?.data?.tracking_id
  );

  const courierName = getFirstValue(
    data?.courier_name,
    data?.courierName,
    data?.courier,
    main?.courier_name,
    main?.courierName,
    main?.courier,
    data?.data?.courier_name,
    data?.data?.courierName,
    data?.data?.courier
  );

  const trackingUrl = getFirstValue(
    data?.tracking_url,
    data?.trackingUrl,
    main?.tracking_url,
    main?.trackingUrl,
    data?.data?.tracking_url,
    data?.data?.trackingUrl
  );

  const labelUrl = getFirstValue(
    data?.label_url,
    data?.labelUrl,
    data?.manifest_url,
    data?.invoice_url,
    main?.label_url,
    main?.labelUrl,
    main?.manifest_url,
    main?.invoice_url,
    data?.data?.label_url,
    data?.data?.labelUrl
  );

  const status = normalizeIcarryStatus(data, fallbackStatus);

  return {
    ...data,

    shipment_id: shipmentId,
    shipmentId,

    awb,
    awb_number: awb,
    awbNumber: awb,

    courier_name: courierName,
    courierName,

    tracking_url: trackingUrl,
    trackingUrl,

    label_url: labelUrl,
    labelUrl,

    status,
    current_status: status,
    shipment_status: status,

    raw: data,
  };
};

const getIcarryToken = async () => {
  try {
    const api = icarryApi();

    const payload = {
      username: getEnv("ICARRY_API_USERNAME"),
      key: getEnv("ICARRY_API_KEY"),
    };

    console.log("========== ICARRY LOGIN ==========");
    console.log("LOGIN URL:", `${getBaseUrl()}/api_login`);
    console.log("USERNAME:", payload.username);
    console.log("API KEY:", maskKey(payload.key));

    const { data } = await api.post("/api_login", payload);

    console.log("LOGIN RESPONSE:", safeJson(data));

    const apiToken =
      data.api_token ||
      data.apiToken ||
      data.token ||
      data.data?.api_token ||
      data.data?.token;

    if (!apiToken) {
      throw new Error(
        `iCarry login failed. Token not found: ${safeJson(data)}`
      );
    }

    return apiToken;
  } catch (error) {
    console.error("ICARRY LOGIN ERROR:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "iCarry login failed"
    );
  }
};

const getStateCode = (state = "") => {
  const normalized = String(state || "")
    .trim()
    .toLowerCase();

  const stateMap = {
    gujarat: "GU",
    maharashtra: "MA",
    rajasthan: "RA",
    delhi: "DE",
    "uttar pradesh": "UP",
    "madhya pradesh": "MP",
    karnataka: "KA",
    telangana: "TS",
    tamilnadu: "TN",
    "tamil nadu": "TN",
    kerala: "KE",
    punjab: "PU",
    haryana: "HA",
    bihar: "BI",
    odisha: "OD",
    goa: "GO",
    "west bengal": "WB",
  };

  if (normalized.length === 2) {
    return normalized.toUpperCase();
  }

  return stateMap[normalized] || "GU";
};

  const normalizePincode = (pincode = "") => {
    return String(pincode || "")
      .replace(/\D/g, "")
      .slice(-6);
  };

  const getCityStateByPincode = async (pincode) => {
    const cleanPincode = normalizePincode(pincode);

    if (!cleanPincode || cleanPincode.length !== 6) {
      throw new Error("Valid 6 digit customer pincode is required");
    }

    try {
      const { data } = await axios.get(
        `https://api.postalpincode.in/pincode/${cleanPincode}`,
        {
          timeout: 10000,
        }
      );

      const response = Array.isArray(data) ? data[0] : data;

      if (
        response?.Status !== "Success" ||
        !Array.isArray(response?.PostOffice) ||
        response.PostOffice.length === 0
      ) {
        throw new Error(
          `Invalid pincode or location not found: ${cleanPincode}`
        );
      }

      const postOffice = response.PostOffice[0];

      return {
        pincode: cleanPincode,
        city: postOffice.District || postOffice.Block || postOffice.Name || "",
        state: postOffice.State || "",
      };
    } catch (error) {
      console.error(
        "PINCODE LOOKUP ERROR:",
        error.response?.data || error.message
      );

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch city and state from pincode"
      );
    }
  };

const buildParcelContents = (items = []) => {
  const names = items
    .map((item) => item.name || item.productId?.title || "Product")
    .filter(Boolean);

  return names.join(", ").slice(0, 250) || "Organic Products";
};

const buildIcarryCreateEndpoint = (apiToken) => {
  const cleanToken = encodeURIComponent(apiToken);

  // Default current iCarry create endpoint.
  // If iCarry gives separate "draft/unassigned shipment" endpoint,
  // add that endpoint path in .env as ICARRY_CREATE_UNASSIGNED_PATH.
  const path =
    process.env.ICARRY_CREATE_UNASSIGNED_PATH || "/api_add_shipment_surface";

  return `${path}&api_token=${cleanToken}`;
};

export const createIcarryShipment = async (order) => {
  try {
    console.log("========== CREATE ICARRY SHIPMENT START ==========");
    console.log("ORDER MONGO ID:", order?._id?.toString());
    console.log("ORDER ID:", order?.orderId || order?.orderNumber);
    console.log("PAYMENT METHOD:", order?.paymentMethod);
    console.log("PAYMENT STATUS:", order?.paymentStatus);

    const api = icarryApi();
    const apiToken = await getIcarryToken();

    const customer = order.customerDetails || {};

    const customerPincode = normalizePincode(
      customer.pinCode || customer.pincode || customer.zipCode || ""
    );

    const pincodeLocation = await getCityStateByPincode(customerPincode);

    const finalCity = getFirstValue(
      pincodeLocation.city,
      customer.city,
      "Rajkot"
    );

    const finalState = getFirstValue(
      pincodeLocation.state,
      customer.state,
      "Gujarat"
    );

    console.log("PINCODE LOCATION:", safeJson(pincodeLocation));
    console.log("FINAL CITY:", finalCity);
    console.log("FINAL STATE:", finalState);

    const finalAmount =
      Number(order.priceDetails?.finalAmount || 0) ||
      Number(order.finalAmount || 0);

    const orderReference =
      order.orderId || order.orderNumber || order._id?.toString();

    const isCOD = order.paymentMethod === "COD";

    const orderItems = Array.isArray(order.orderItems) ? order.orderItems : [];

    const payload = {
      pickup_address_id: Number(getEnv("ICARRY_PICKUP_ADDRESS_ID")),

      client_order_id: orderReference,

      /*
        IMPORTANT:
        save_only: 1 means shipment will be created in iCarry,
        but courier will NOT be assigned/confirmed automatically.
        It will show in iCarry Unassigned tab.
      */
      save_only: 1,

      consignee: {
        name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
        mobile: String(customer.phone || "")
          .replace(/\D/g, "")
          .slice(-10),
        address: customer.streetAddress || customer.address || "",

        // Auto fetched from pincode
        city: finalCity,
        pincode: customerPincode,
        state: getStateCode(finalState),

        country_code: "IN",
      },

      parcel: {
        type: isCOD ? "COD" : "Prepaid",
        value: finalAmount,
        currency: "INR",
        contents: buildParcelContents(orderItems),

        items: orderItems.map((item) => ({
          name: String(item.name || item.productId?.title || "Product").slice(
            0,
            50
          ),
          pid: item.productId?._id?.toString() || item.productId?.toString(),
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
        })),

        dimensions: {
          length: 10,
          breadth: 10,
          height: 10,
          unit: "cm",
        },

        weight: {
          weight: Number(order.totalWeight || 500),
          unit: "gm",
        },
      },
    };

    const mode = String(
      process.env.ICARRY_SHIPMENT_MODE || "surface"
    ).toLowerCase();

    const endpoint =
      mode === "air"
        ? `/api_add_shipment_air&api_token=${apiToken}`
        : `/api_add_shipment_surface&api_token=${apiToken}`;

    console.log("ICARRY CREATE FULL URL:", `${getBaseUrl()}${endpoint}`);
    console.log("ICARRY PAYLOAD:", safeJson(payload));

    const { data } = await api.post(endpoint, payload);

    console.log("ICARRY CREATE RAW RESPONSE:", safeJson(data));

    if (data?.error) {
      throw new Error(data.error);
    }

    const normalizedData = normalizeIcarryShipmentResponse(data, "Unassigned");

    /*
      If iCarry does not return status clearly,
      keep admin shipping status as Unassigned.
    */
    if (
      !normalizedData.status ||
      normalizedData.status === "Shipment Created" ||
      normalizedData.status === "Status Updated"
    ) {
      normalizedData.status = "Unassigned";
      normalizedData.current_status = "Unassigned";
      normalizedData.shipment_status = "Unassigned";
    }

    console.log("ICARRY CREATE NORMALIZED RESPONSE:", safeJson(normalizedData));
    console.log("========== CREATE ICARRY SHIPMENT END ==========");

    return normalizedData;
  } catch (error) {
    console.log("========== CREATE ICARRY SHIPMENT FAILED ==========");
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STATUS:", error.response?.status);
    console.error("ERROR RESPONSE:", safeJson(error.response?.data));
    console.error("ERROR URL:", getErrorUrl(error));
    console.log("===================================================");

    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create iCarry shipment"
    );
  }
};

export const trackIcarryShipment = async (shipmentId) => {
  try {
    const api = icarryApi();
    const apiToken = await getIcarryToken();

    const endpoint = `/api_track_shipment&api_token=${apiToken}`;

    const payload = {
      shipment_id: shipmentId,
    };

    console.log("========== ICARRY TRACK START ==========");
    console.log("ICARRY TRACK FULL URL:", `${getBaseUrl()}${endpoint}`);
    console.log("ICARRY TRACK PAYLOAD:", safeJson(payload));

    const { data } = await api.post(endpoint, payload);

    console.log("ICARRY TRACK RAW RESPONSE:", safeJson(data));

    if (data?.error) {
      throw new Error(data.error);
    }

    const normalizedData = normalizeIcarryShipmentResponse(
      data,
      "Status Updated"
    );

    console.log("ICARRY TRACK NORMALIZED RESPONSE:", safeJson(normalizedData));
    console.log("========== ICARRY TRACK END ==========");

    return normalizedData;
  } catch (error) {
    console.log("========== ICARRY TRACK FAILED ==========");
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STATUS:", error.response?.status);
    console.error("ERROR RESPONSE:", safeJson(error.response?.data));
    console.error("ERROR URL:", getErrorUrl(error));
    console.log("========================================");

    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to track iCarry shipment"
    );
  }
};

export const cancelIcarryShipment = async (shipmentId) => {
  try {
    const api = icarryApi();
    const apiToken = await getIcarryToken();

    const endpoint = `/api_cancel_shipment&api_token=${apiToken}`;

    const payload = {
      shipment_id: shipmentId,
    };

    console.log("========== ICARRY CANCEL START ==========");
    console.log("ICARRY CANCEL FULL URL:", `${getBaseUrl()}${endpoint}`);
    console.log("ICARRY CANCEL PAYLOAD:", safeJson(payload));

    const { data } = await api.post(endpoint, payload);

    console.log("ICARRY CANCEL RAW RESPONSE:", safeJson(data));

    if (data?.error) {
      throw new Error(data.error);
    }

    const normalizedData = normalizeIcarryShipmentResponse(data, "Cancelled");

    normalizedData.status = normalizeIcarryStatus(data, "Cancelled");
    normalizedData.current_status = normalizedData.status;
    normalizedData.shipment_status = normalizedData.status;

    console.log("ICARRY CANCEL NORMALIZED RESPONSE:", safeJson(normalizedData));
    console.log("========== ICARRY CANCEL END ==========");

    return normalizedData;
  } catch (error) {
    console.log("========== ICARRY CANCEL FAILED ==========");
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STATUS:", error.response?.status);
    console.error("ERROR RESPONSE:", safeJson(error.response?.data));
    console.error("ERROR URL:", getErrorUrl(error));
    console.log("==========================================");

    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to cancel iCarry shipment"
    );
  }
};
