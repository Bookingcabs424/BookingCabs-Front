import EmailApi from "../models/emailApiModel.js";
import {
  sendViaSmtp,
  sendViaSendGrid,
  sendViaSes,
  sendViaMailgun,
} from "../emailProvider/emailProviders.js";

let cachedEmailConfig = null;

export const getEmailConfig = async () => {
  if (cachedEmailConfig) return cachedEmailConfig;
  const config = await EmailApi.findOne({
    where: { isActive: true, isDeleted: false },
  });
  if (!config) throw new Error("No active email provider found.");
  cachedEmailConfig = config;
  return config;
};

export const sendEmail = async (to, subject, text, attachments = []) => {
  const config = await getEmailConfig();
  console.log("config".config);
  switch (config.provider?.toLowerCase()) {
    case "sendgrid":
      return sendViaSendGrid(config, to, subject, text);
    case "ses":
      return sendViaSes(config, to, subject, text);
    case "mailgun":
      return sendViaMailgun(config, to, subject, text);
    case "smtp":
    default:
      return sendViaSmtp(config, to, subject, text, attachments);
  }
};
export const sendEmailWithAttachment = async (
  to,
  subject,
  html,
  fileBuffer,
  fileName
) => {
  const attachment = {
    filename: fileName,
    content: fileBuffer,
    contentType: "application/pdf",
  };

  return await sendEmail(to, subject, html, [attachment]);
};
