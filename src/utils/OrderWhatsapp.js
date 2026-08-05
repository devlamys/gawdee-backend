import axios from "axios";

const cleanWhatsappParam = (value, fallback = "") => {
  return String(value ?? fallback)
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const cleanPhoneNumber = (phone) => {
  return cleanWhatsappParam(phone).replace(/\D/g, "");
};

/**
 * ✅ Your common WhatsApp config
 * Better: move these values to .env later.
 */
const WHATSAPP_CONFIG = {
  API_TOKEN: "20224|0gCFaPphoh8l3nhRY8oI1eBhd3pWwccvy9rKaUkcce795f3d",
  PHONE_NUMBER_ID: "1035554969638172",
  API_URL: "https://chat.grafizen.com/api/v1/whatsapp/send/template",
};

/**
 * ✅ Add your real approved template ids here
 * Replace these ids according to your WhatsApp template panel.
 */
const TEMPLATE_IDS = {
  ORDER_RECEIVED: "399165",
  ORDER_CONFIRMED: "399188",
  ORDER_SHIPPED: "399164", 
  OUT_FOR_DELIVERY: "399192 ",
  ORDER_DELIVERED: "399194",
  ORDER_INVOICE: "399167",
  ORDER_CANCELLED: "399199",
};

/**
 * ✅ Common sender
 */
const sendWhatsappTemplate = async ({ to, templateId, variables = [] }) => {
  try {
    const phone = cleanPhoneNumber(to);

    if (!phone) {
      return {
        success: false,
        error: "Customer WhatsApp number is required",
      };
    }

    if (!templateId) {
      return {
        success: false,
        error: "WhatsApp template id is required",
      };
    }

    const params = new URLSearchParams();

    params.append("apiToken", WHATSAPP_CONFIG.API_TOKEN);
    params.append("phone_number_id", WHATSAPP_CONFIG.PHONE_NUMBER_ID);
    params.append("template_id", templateId);

    variables.forEach((value, index) => {
      const variableNumber = index + 1;
      params.append(
        `templateVariable-${variableNumber}-${variableNumber}`,
        cleanWhatsappParam(value)
      );
    });

    params.append("phone_number", `91${phone}`);

    const url = `${WHATSAPP_CONFIG.API_URL}?${params.toString()}`;

    console.log("WhatsApp Template URL:", url);

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("WhatsApp Response:", response.data);

    return {
      success: response.data?.status === "1",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "WhatsApp Template Error:",
      error?.response?.data || error.message
    );

    return {
      success: false,
      error: error?.response?.data || error.message,
    };
  }
};

/**
 * 1. When customer places order
 * Variables:
 * {{Customer Name}}
 * {{Order ID}}
 */
export const sendOrderReceivedWhatsapp = async ({
  to,
  customerName,
  orderId,
}) => {
  return sendWhatsappTemplate({
    to,
    templateId: TEMPLATE_IDS.ORDER_RECEIVED,
    variables: [
      cleanWhatsappParam(customerName, "Customer"),
      cleanWhatsappParam(orderId),
    ],
  });
};

/**
 * 2. When order confirmed
 * Variables:
 * {{Customer Name}}
 * {{Order ID}}
 */
export const sendOrderConfirmedWhatsapp = async ({
  to,
  customerName,
  orderId,
}) => {
  return sendWhatsappTemplate({
    to,
    templateId: TEMPLATE_IDS.ORDER_CONFIRMED,
    variables: [
      cleanWhatsappParam(customerName, "Customer"),
      cleanWhatsappParam(orderId),
    ],
  });
};

/**
 * 3. When order shipped / dispatched
 * Your current function has:
 * customerName, orderId, trackingUrl
 *
 * If your template also has Tracking ID, then add trackingId as 3rd variable
 * and trackingUrl as 4th variable.
 */
export const sendShippingWhatsapp = async ({
  to,
  customerName,
  orderId,
  trackingId,
  trackingUrl,
}) => {
  return sendWhatsappTemplate({
    to,
    templateId: TEMPLATE_IDS.ORDER_SHIPPED,
    variables: [
      cleanWhatsappParam(customerName, "Customer"),
      cleanWhatsappParam(orderId),
      cleanWhatsappParam(trackingId || trackingUrl),
      cleanWhatsappParam(trackingUrl),
    ],
  });
};

/**
 * 4. Out for delivery
 * Variables:
 * {{Customer Name}}
 * {{Order ID}}
 */
export const sendOutForDeliveryWhatsapp = async ({
  to,
  customerName,
  orderId,
}) => {
  return sendWhatsappTemplate({
    to,
    templateId: TEMPLATE_IDS.OUT_FOR_DELIVERY,
    variables: [
      cleanWhatsappParam(customerName, "Customer"),
      cleanWhatsappParam(orderId),
    ],
  });
};

/**
 * 5. Delivered
 * Variables:
 * {{Customer Name}}
 * {{Order ID}}
 */
export const sendOrderDeliveredWhatsapp = async ({
  to,
  customerName,
  orderId,
}) => {
  return sendWhatsappTemplate({
    to,
    templateId: TEMPLATE_IDS.ORDER_DELIVERED,
    variables: [
      cleanWhatsappParam(customerName, "Customer"),
      cleanWhatsappParam(orderId),
    ],
  });
};

/**
 * 6. Invoice
 * Variables:
 * {{Customer Name}}
 * {{Order ID}}
 * {{Invoice Link}}
 */
export const sendInvoiceWhatsapp = async ({
  to,
  customerName,
  orderId,
  invoiceLink,
}) => {
  return sendWhatsappTemplate({
    to,
    templateId: TEMPLATE_IDS.ORDER_INVOICE,
    variables: [
      cleanWhatsappParam(customerName, "Customer"),
      cleanWhatsappParam(orderId),
      cleanWhatsappParam(invoiceLink),
    ],
  });
};

/**
 * 7. Cancelled
 * Variables:
 * {{Customer Name}}
 * {{Order ID}}
 * {{Cancellation Reason}}
 */
export const sendOrderCancelledWhatsapp = async ({
  to,
  customerName,
  orderId,
  cancellationReason,
}) => {
  return sendWhatsappTemplate({
    to,
    templateId: TEMPLATE_IDS.ORDER_CANCELLED,
    variables: [
      cleanWhatsappParam(customerName, "Customer"),
      cleanWhatsappParam(orderId),
      cleanWhatsappParam(cancellationReason, "unavoidable reason"),
    ],
  });
};

/**
 * ✅ One common function for status based sending
 */
export const sendOrderStatusWhatsapp = async ({
  status,
  to,
  customerName,
  orderId,
  trackingId,
  trackingUrl,
  invoiceLink,
  cancellationReason,
}) => {
  switch (status) {
    case "Pending":
    case "Order Received":
      return sendOrderReceivedWhatsapp({
        to,
        customerName,
        orderId,
      });

    case "Confirmed":
      return sendOrderConfirmedWhatsapp({
        to,
        customerName,
        orderId,
      });

    case "Shipped":
    case "Dispatched":
      return sendShippingWhatsapp({
        to,
        customerName,
        orderId,
        trackingId,
        trackingUrl,
      });

    case "Out For Delivery":
      return sendOutForDeliveryWhatsapp({
        to,
        customerName,
        orderId,
      });

    case "Delivered":
      return sendOrderDeliveredWhatsapp({
        to,
        customerName,
        orderId,
      });

    case "Invoice":
      return sendInvoiceWhatsapp({
        to,
        customerName,
        orderId,
        invoiceLink,
      });

    case "Cancelled":
      return sendOrderCancelledWhatsapp({
        to,
        customerName,
        orderId,
        cancellationReason,
      });

    default:
      return {
        success: false,
        error: `No WhatsApp template mapped for status: ${status}`,
      };
  }
};