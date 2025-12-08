import SmsApi from "../models/smsApiModel.js";
import sendViaValueFirst from "../smsProviders/valuefirst.js";
import sendViaTwilio from "../smsProviders//twilio.js";
import sendViaMessageBird from "../smsProviders/messagebird.js";
import sendViaSNS from "../smsProviders/sns.js";

let cachedConfig = null;

const getSmsConfig = async () => {
  if (cachedConfig) return cachedConfig;

  const config = await SmsApi.findOne({
    where: { active: true },
  });

  if (!config) throw new Error("No active SMS API configuration found.");
  cachedConfig = config;
  return config;
};

const sendSMS = async (to, message) => {
  const config = await getSmsConfig();
  const provider = config.api_title?.toLowerCase();
  switch (provider) {
    case "valuefirst":
      return sendViaValueFirst(config, to, message);
    case "twilio":
      return sendViaTwilio(config, to, message);
    case "messagebird":
      return sendViaMessageBird(config, to, message);
    case "sns":
    case "amazonsns":
      return sendViaSNS(config, to, message);
    default:
      throw new Error(`Unsupported SMS provider: ${provider}`);
  }
};



export default sendSMS;
