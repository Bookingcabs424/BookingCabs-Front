import nodemailer from "nodemailer";
import { logger } from "./logger.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Subject of the email
 * @param {string} [options.text] - Plain text version of the message
 * @param {string} [options.html] - HTML version of the message
 * @param {Array} [options.attachments] - Optional attachments
 */
export const sendMail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
}) => {
  try {
    const fromEmail = "no-reply@bookingcabs.com";
    const info = await transporter.sendMail({
      from: `"Booking Cabs" <${fromEmail}>`,
      to,
      subject,
      text,
      html,
      attachments,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
