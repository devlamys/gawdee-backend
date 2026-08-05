export const generateMessageTemplate = (order) => {
    const { firstName, phone } = order.customerDetails;
    const formattedPhone = `91${phone}`; 

    let itemsText = "";
    order.orderItems.forEach((item, index) => {
        itemsText += `${index + 1}. ${item.productId.productName} x${item.quantity} - ₹${item.price}\n`;
    });

    return {
        "channelId": process.env.GALLABOX_CHANNEL_ID,
        "channelType": "whatsapp",
        "recipient": { "mobileNumber": formattedPhone },
        "whatsapp": {
            "type": "template",
            "templateId": process.env.GALLABOX_TEMPLATE_ID,
            "template": {
                "templateName": "order_confirmation_template",
                "bodyValues": {
                    "name": firstName,
                    "order_id": order._id,
                    "total_amount": `₹${order.totalPrice}`,
                    "order_items": itemsText,
                    "order_status": order.orderStatus
                }
            }
        }
    };
};
