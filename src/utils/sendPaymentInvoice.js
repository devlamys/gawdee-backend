import axios from "axios";

const cleanWhatsappParam = (value, fallback = "") => {
  return String(value ?? fallback)
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const sendPaymentInvoiceWhatsapp = async ({
  to,
  customerName,
  orderId,
  invoiceUrl,
}) => {
  try {
    if (!to) throw new Error("Phone number missing");
    if (!customerName) throw new Error("Customer name missing");
    if (!orderId) throw new Error("Order ID missing");
    if (!invoiceUrl) throw new Error("Invoice URL missing");

    const API_TOKEN =
      "20224|0gCFaPphoh8l3nhRY8oI1eBhd3pWwccvy9rKaUkcce795f3d";

    const PHONE_NUMBER_ID = "1035554969638172";
    const TEMPLATE_ID = "399167";

    const finalPhone = cleanWhatsappParam(to).replace(/\D/g, "");
    const finalCustomerName = cleanWhatsappParam(customerName, "Customer");
    const finalOrderId = cleanWhatsappParam(orderId);
    const finalInvoiceUrl = cleanWhatsappParam(invoiceUrl);

    if (!finalInvoiceUrl.startsWith("https://")) {
      throw new Error("Invoice URL must be public HTTPS URL");
    }

    if (!finalInvoiceUrl.toLowerCase().endsWith(".pdf")) {
      throw new Error("Invoice URL must end with .pdf");
    }

    const params = new URLSearchParams();
    params.append("apiToken", API_TOKEN);
    params.append("phone_number_id", PHONE_NUMBER_ID);
    params.append("template_id", TEMPLATE_ID);
    params.append("template_header_media_url", finalInvoiceUrl);
    params.append("templateVariable-1-1", finalCustomerName);
    params.append("templateVariable-2-2", finalOrderId);
    params.append("phone_number", `91${finalPhone}`);

    const url = `https://chat.grafizen.com/api/v1/whatsapp/send/template?${params.toString()}`;

    console.log("PAYMENT INVOICE WHATSAPP URL:", url);

    const response = await axios.post(url, {}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data?.status !== "1") {
      throw new Error(response.data?.message || "Payment invoice WhatsApp failed");
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Payment Invoice WhatsApp Error:",
      error?.response?.data || error.message
    );

    return {
      success: false,
      error: error?.response?.data || error.message,
    };
  }
};