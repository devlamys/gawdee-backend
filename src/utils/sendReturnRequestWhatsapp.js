import axios from "axios";

const cleanWhatsappParam = (value, fallback = "") => {
  return String(value ?? fallback)
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const sendReturnRequestWhatsapp = async ({
  to,
  customerName,
  orderId,
}) => {
  try {
    const API_TOKEN =
      "20224|0gCFaPphoh8l3nhRY8oI1eBhd3pWwccvy9rKaUkcce795f3d";

    const PHONE_NUMBER_ID = "1035554969638172";

    // replace with your return template ID
    const TEMPLATE_ID = "399168";

    const params = new URLSearchParams();

    params.append("apiToken", API_TOKEN);
    params.append("phone_number_id", PHONE_NUMBER_ID);
    params.append("template_id", TEMPLATE_ID);
    params.append("templateVariable-1-1", cleanWhatsappParam(customerName, "Customer"));
    params.append("templateVariable-2-2", cleanWhatsappParam(orderId));
    params.append("phone_number", `91${cleanWhatsappParam(to).replace(/\D/g, "")}`);

    const url = `https://chat.grafizen.com/api/v1/whatsapp/send/template?${params.toString()}`;

    const response = await axios.post(url, {}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Return WhatsApp Response:", response.data);

    return {
      success: response.data?.status === "1",
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Return WhatsApp Error:",
      error?.response?.data || error.message
    );

    return {
      success: false,
      error: error?.response?.data || error.message,
    };
  }
};