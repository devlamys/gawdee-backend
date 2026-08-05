import axios from 'axios';

const API_TOKEN = '9055|r6DSgBtWzZMg4JtsaEGfiq305zIUsmimjxix32V3';
const PHONE_NUMBER_ID = '459879443881302';
const TEMPLATE_ID = '222533';
const API_URL = 'https://chat.grafizen.com/api/v1/whatsapp/send/template';

export const sendOrderConfirmation = async ({ to, customerName, productSlug }) => {
  const params = {
    apiToken: API_TOKEN,
    phone_number_id: PHONE_NUMBER_ID,
    template_id: TEMPLATE_ID,
    phone_number: "91" + to, // with country code
    'templateVariable-1': customerName, // maps to {{1}} in body
    'templateVariable-2': productSlug,  // maps to {{1}} in URL
  };

  try {
    console.log("➡️ Sending WhatsApp with params:", params);
    const response = await axios.post(API_URL, null, {
      params,
      headers: { 'Content-Type': 'application/json' },
    });
    console.log("WhatsApp order confirmation sent");
    console.log("Response:", response.data);
  } catch (err) {
    console.error("WhatsApp API error:", err.response?.data || err.message);
  }
};
