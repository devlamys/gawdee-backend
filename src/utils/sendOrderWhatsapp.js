import axios from "axios";

const cleanWhatsappParam = (value, fallback = "") => {
  return String(value ?? fallback)
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const sendOrderWhatsapp = async ({
  to,
  customerName,
  orderId,
}) => {
  try {
    if (!to) throw new Error("Phone number missing");
    if (!orderId) throw new Error("Order ID missing");

    const API_TOKEN =
      "20224|0gCFaPphoh8l3nhRY8oI1eBhd3pWwccvy9rKaUkcce795f3d";

    const PHONE_NUMBER_ID = "1035554969638172";
    const TEMPLATE_ID = "399165";

    const finalPhone = cleanWhatsappParam(to).replace(/\D/g, "");
    const finalCustomerName = cleanWhatsappParam(customerName, "Customer");

    // ✅ IMPORTANT FIX
    const finalOrderId = `${cleanWhatsappParam(orderId)}`;

    const params = new URLSearchParams();

    params.append("apiToken", API_TOKEN);
    params.append("phone_number_id", PHONE_NUMBER_ID);
    params.append("template_id", TEMPLATE_ID);
    params.append("templateVariable-1-1", finalCustomerName);
    params.append("templateVariable-2-2", finalOrderId);
    params.append("phone_number", `91${finalPhone}`);

    const url = `https://chat.grafizen.com/api/v1/whatsapp/send/template?${params.toString()}`;

    console.log("WA FINAL CUSTOMER:", JSON.stringify(finalCustomerName));
    console.log("WA FINAL ORDER ID:", JSON.stringify(finalOrderId));
    console.log("CREATE ORDER WHATSAPP URL:", url);

    const response = await axios.post(url, {}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data?.status !== "1") {
      throw new Error(response.data?.message || "WhatsApp message failed");
    }

    console.log("Create Order WhatsApp Sent:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Create Order WhatsApp Error:",
      error?.response?.data || error.message
    );

    return {
      success: false,
      error: error?.response?.data || error.message,
    };
  }
};