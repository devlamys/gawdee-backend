import axios from 'axios';

export const sendWhatsappOTP = async ({ to, otp }) => {
    const API_TOKEN = process.env.WHATSAPP_API_TOKEN || '20224|0gCFaPphoh8l3nhRY8oI1eBhd3pWwccvy9rKaUkcce795f3d';
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '1035554969638172';
    const TEMPLATE_ID = process.env.WHATSAPP_TEMPLATE_ID || '400119';

    const cleanTo = String(to || '').replace(/\D/g, '').slice(-10);

    try {
        console.log(`📱 Sending WhatsApp OTP [${otp}] to +91${cleanTo}...`);

        const params = new URLSearchParams();
        params.append("apiToken", API_TOKEN);
        params.append("phone_number_id", PHONE_NUMBER_ID);
        params.append("template_id", TEMPLATE_ID);
        params.append("template_quick_reply_button_values", JSON.stringify(["EXTERNAL_ECOMMERCE_CONFIRM_ORDER"]));
        params.append("templateVariable-otp-1", String(otp));
        params.append("templateVariable-otp-2", String(otp));
        params.append("templateVariable-1-1", String(otp));
        params.append("templateVariable-1", String(otp));
        params.append("phone_number", `91${cleanTo}`);

        const url = `https://chat.grafizen.com/api/v1/whatsapp/send/template?${params.toString()}`;

        console.log("➡️ WhatsApp Gateway Request URL:", url);

        const response = await axios.post(url, {}, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            }
        });

        const resData = response.data || {};

        if (resData.status === false || resData.success === false || resData.error === true || resData.message === 'Access denied.') {
            console.warn("⚠️ WhatsApp Gateway Warning / API Failure:", resData);
            return {
                success: false,
                message: resData.message || "WhatsApp gateway delivery failed",
                data: resData,
            };
        }

        console.log("✅ WhatsApp OTP Sent Successfully! Response:", resData);

        return {
            success: true,
            data: {
                ...resData,
                otp
            }
        };

    } catch (error) {
        console.error("❌ WhatsApp OTP Network/API Error:", error?.response?.data || error.message);
        return {
            success: false,
            message: error?.response?.data?.message || "OTP send failed",
            error: error?.response?.data || error.message
        };
    }
};
