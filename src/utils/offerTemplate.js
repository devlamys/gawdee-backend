export const generateOfferMessageTemplate = (user, offerDetails) => {
    return {
        "channelId": process.env.GALLABOX_CHANNEL_ID,
        "channelType": "whatsapp",
        "recipient": { "mobileNumber": `91${user.phone}` },
        "whatsapp": {
            "type": "template",
            "templateId": process.env.GALLABOX_OFFER_TEMPLATE_ID,
            "template": {
                "templateName": "special_offer_template",
                "bodyValues": {
                    "name": user.firstName,
                    "offer_details": offerDetails
                }
            }
        }
    };
};
