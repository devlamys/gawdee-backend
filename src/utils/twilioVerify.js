import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const contentSid = process.env.TWILIO_CONTENT_SID;

const client = twilio(accountSid, authToken);

export const sendTwilioWhatsappOtpTemplate = async ({ to, otp }) => {
  if (!to) {
    throw new Error("Receiver mobile number is required.");
  }

  if (!otp) {
    throw new Error("OTP is required.");
  }

  const finalOtp = otp.toString().trim();

  const contentVariables = JSON.stringify({
    "1": finalOtp,
  });

  console.log("Twilio WhatsApp To:", `whatsapp:${to}`);
  console.log("Twilio Content SID:", contentSid);
  console.log("Twilio Content Variables:", contentVariables);

  return await client.messages.create({
    messagingServiceSid,
    to: `whatsapp:${to}`,
    contentSid,
    contentVariables,
  });
};