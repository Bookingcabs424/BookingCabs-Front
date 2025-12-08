import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration from JSON
const configPath = path.join(__dirname, "email-config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Create transporter using AWS SES SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "email-smtp.us-east-1.amazonaws.com",
  port:  process.env.SMTP_PORT || 587,
  secure:false,
  auth: {
    user: process.env.MAIL_USERNAME || "AKIAT74BEDY3KGKBD4NJ",
    pass: process.env.MAIL_PASSWORD || "BECrq/oZFrb42M3jhdm/YTomaxP8Y+pl0nQRjQFrKwDg",
  },
});

// Replace {{key}} placeholders with actual values
function renderTemplate(template, data) {
  let result = template;
  for (const key in data) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(placeholder, data[key]);
  }
  return result; 
}

// Send templated email
async function sendEmail(templateName, toEmail, templateData = {}) {
  try {
    const template = config.templates[templateName];
    if (!template) throw new Error(`Template ${templateName} not found`);

    const mailOptions = {
      from: process.env.from_email || "no-reply@bookingcabs.com",
      to: toEmail,
      subject: renderTemplate(template.subject, templateData),
      html: template.html
        ? renderTemplate(template.html, templateData)
        : undefined,
      text: template.text
        ? renderTemplate(template.text, templateData)
        : undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log(`Email sent to ${toEmail}:`, info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export { sendEmail, transporter };
