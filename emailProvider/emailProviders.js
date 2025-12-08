import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";
import AWS from "aws-sdk";
import Mailgun from "mailgun.js";
import formData from "form-data";

/*
Nodemailer (Generic SMTP, incl. AWS SES via SMTP)
*/
export const sendViaSmtp = async (
  config,
  to,
  subject,
  text = "",
  attachments = []
) => {
  // console.log("just checking",to,subject,text)
  const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com" || config?.smtp_host,
    port: config?.smtp_port || 587,
    secure: config?.smtp_secure || false,
    auth: {
      user: "AKIAT74BEDY3KGKBD4NJ" || config?.api_user,
      pass: "BECrq/oZFrb42M3jhdm/YTomaxP8Y+pl0nQRjQFrKwDg" || config?.api_secret,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter.sendMail({
    from: config?.from_email,
    to,
    subject,
    html: text,
    attachments: attachments,
  });
};
//  SendGrid
export const sendViaSendGrid = async (config, to, subject, text) => {
  sgMail.setApiKey(config.api_key);
  return sgMail.send({
    to,
    from: config.from_email,
    subject,
    text,
  });
};

// 3. AWS SES (API-based, not SMTP)
export const sendViaSes = async (config, to, subject, text) => {
  const ses = new AWS.SES({
    region: config.api_region,
    accessKeyId: config.api_key,
    secretAccessKey: config.api_secret,
  });

  return ses
    .sendEmail({
      Source: config.from_email,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: text } },
      },
    })
    .promise();
};

// 4. Mailgun
export const sendViaMailgun = async (config, to, subject, text) => {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: config.api_key });

  return mg.messages.create(config.api_region, {
    from: config.from_email,
    to,
    subject,
    text,
  });
};
