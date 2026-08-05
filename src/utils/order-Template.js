import axios from 'axios';

const API_TOKEN = '9055|r6DSgBtWzZMg4JtsaEGfiq305zIUsmimjxix32V3';
const PHONE_NUMBER_ID = '459879443881302';
const TEMPLATE_ID = '187531'; // ⬅️ Use the template_id shown in your screenshot
const API_URL = 'https://chat.grafizen.com/api/v1/whatsapp/send/template';

/**
 * Builds WhatsApp message request config
 * @param {string} to - 10-digit phone number
 * @param {object} data - template variables
 */
export const buildOrderStatusTemplate = (to, data) => {
  const {
    customerName,
    orderStatus,
    trackingNumber,
    courierName,
  } = data;

  const params = {
    apiToken: API_TOKEN,
    phone_number_id: PHONE_NUMBER_ID,
    template_id: TEMPLATE_ID,
    phone_number: `91${to}`,
    'templateVariable-customername-1': customerName,
    'templateVariable-orderstatus-2': orderStatus,
    'templateVariable-trackingnumber-3': trackingNumber,
    'templateVariable-couriername-4': courierName,
  };

  return {
    url: API_URL,
    method: 'POST',
    params,
    headers: {
      'Content-Type': 'application/json',
    },
    data: null,
  };
};
