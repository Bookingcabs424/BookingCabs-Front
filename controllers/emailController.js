import { sendViaSmtp } from "../emailProvider/emailProviders.js";
import EmailApi from "../models/emailApiModel.js";
import {
  getEmailConfig,
  sendEmail,
  sendEmailWithAttachment,
} from "../utils/emailSender.js";
import { generatePdf, isValidEmail, sanitizeEmail } from "../utils/helpers.js";
import EmailTemplate from "../models/emailTemplateModel.js";
import ejs from "ejs";
import { te } from "date-fns/locale";

import moment from "moment";
import cron from "node-cron";
import User from "../models/userModel.js";
import { renderEmailTemplate } from "../utils/renderTemplate.js";
import NewsletterUser from "../models/newsletteruserModel.js";
import { logger } from "../utils/logger.js";

export const createEmailApi = async (req, res) => {
  const created = await EmailApi.create(req.body);
  res.status(201).json({ success: true, data: created });
};

export const getAllEmailApis = async (req, res) => {
  const all = await EmailApi.findAll({ where: { isDeleted: false } });
  res.json({ success: true, data: all });
};

export const getActiveEmailApi = async (req, res) => {
  const config = await EmailApi.findOne({
    where: { active: true, isDeleted: false },
  });
  res.json({ success: true, data: config });
};

export const updateEmailApi = async (req, res) => {
  await EmailApi.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true, message: "Updated successfully" });
};

export const softDeleteEmailApi = async (req, res) => {
  await EmailApi.update({ isDeleted: true }, { where: { id: req.params.id } });
  res.json({ success: true, message: "Soft deleted" });
};
export const shootEmail = async (req, res) => {
  console.log("email shooted");
  try {
    const config = await getEmailConfig();
    console.log({ config });
    await sendEmail("manish.bookingcabs@gmail.com", "Dhanteras", html);
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailWithAttach = async (req, res) => {
  const { to, subject, data, id, template_name } = req.body;
  try {
    const template = await EmailTemplate.findOne({
      where: { type: template_name },
    });

    const renderedTemplate = ejs.render(template?.description, data);

    // console.log(template);

    let pdf = await generatePdf({
      template_name: template_name,
      template_param: data,
      file_name: `${template_name}_${id}`,
    });
    await sendEmailWithAttachment(to, subject, String(renderedTemplate), pdf);
    return res.status(201).json({ message: "Email Sent Succesfully!" });
  } catch (error) {
    console.log(error);
  }
};

export const sendCronEmail = async (
  param,
  subject,
  show_header_footer = true
) => {
  try {
    // 1️⃣ Fetch users based on recipients (if provided)
    // const whereClause =
    //   recipients && recipients.length > 0
    //     ? { email: "kartik.bookingcabs@gmail.com" } // only those
    //     : { is_active: 1 }; // else, all active users

    // const getUsers = await User.findAll({
    //   where: whereClause,
    //   attributes: ["email"],
    // });

    const getUsers = await NewsletterUser.findAll({
      raw: true,
    });

    if (!getUsers || getUsers?.length === 0) {
      console.log("⚠️ No users found for this campaign");
      return false;
    }

    // const validUsers = getUsers.filter(
    //   (u) =>
    //     u.email &&
    //     typeof u.email === "string" &&
    //     u.email.trim().length > 5 &&
    //     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email.trim())
    // );
    // const validUsers = getUsers.filter((u) => isValidEmail(u?.email?.trim()));
    const validUsers = getUsers
      .map((u) => {
        const fixed = sanitizeEmail(u.email);
        return fixed ? { ...u, email: fixed } : null;
      })
      .filter(Boolean);

    // const validUsers = getUsers?.filter((user) =>
    // console.log(user?.email)
    // );
    // if (validUsers?.length === 0) {
    //   console.log("⚠️ No valid email addresses found");
    //   return false;
    // }

    console.log(
      `📨 Preparing to send ${subject} to ${validUsers?.length} recipients`
    );
    logger.info(
      `📨 Preparing to send ${subject} to ${validUsers?.length} recipients`
    );

    // 2️⃣ Define batch config
    const BATCH_SIZE = 50;
    const DELAY_BETWEEN_BATCHES = 5000; // ms between batches

    // 3️⃣ Send in batches
    for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
      const batch = validUsers.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map(async (user) => {
        // const subscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
        //   user.email
        // )}&status=1`;

        // const unsubscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
        //   user.email
        // )}&status=0`;

        const subscribeUrl = `https://api.bookingcabs.in/api/newsletter/subscribe-email-for-mail?email=${encodeURIComponent(
          user.email
        )}`;

        const unsubscribeUrl = `https://api.bookingcabs.in/api/newsletter/unsubscribe-email-for-mail?email=${encodeURIComponent(
          user.email
        )}`;

        const name = user.first_name || "there";
        const type = param;

        const templateParam = {
          name,
          subscribeUrl,
          unsubscribeUrl,
          site_url: "https://www.bookingcabs.in/",
          company_logo: (process.env.B2B_URL || "") + "public/logo1.png",
          first_name: user.first_name,
          full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          username: user.username,
          email: user.email,
          mobile:
            user?.mobile?.slice(0, 3) + "xxxx" + user?.mobile?.slice(7, 10),
          user_status: "ACTIVE",
          global_email: process.env.GLOBAL_EMAIL,
          com_name: process.env.EMAIL_COMPANY_NAME,
          com_phone: process.env.COMPANY_CUSTOMER_NUMBER,
          com_mobile: "1234567890",
          date: new Date(),
          app_link: "https://app.booking.com",
          twitter_url: "https://twitter.com/yourhandle",
          instagram_url: "https://instagram.com/yourhandle",
          linkedin_url: "https://linkedin.com/in/yourhandle",
          youtube_url: "https://youtube.com/c/yourchannel",
          client_app_url: "https://client.booking.com",
          developed_by: "Your Company Name",
          facebook_url: "Testing@gmail.com",
          developed_by_label: "",
        };

        const rendered = await renderEmailTemplate(
          type,
          templateParam,
          show_header_footer
        );
        return sendEmail(user.email, subject, rendered?.html);
      });

      await Promise.all(batchPromises);

      console.log(
        `✅ Sent batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
          validUsers.length / BATCH_SIZE
        )}`
      );
      logger.info(
        `✅ Sent batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
          validUsers.length / BATCH_SIZE
        )}`
      );

      if (i + BATCH_SIZE < validUsers.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES)
        );
      }
    }

    console.log("🎉 All batches processed successfully");
    return true;
  } catch (error) {
    console.error("❌ Bulk email error:", error);
    logger.warn("❌ Bulk email error:", error);
    return false;
  }
};

export const sendFestEmail = async (param, subject) => {
  try {
    const getUsers = await User.findAll({
      where: {
        is_active: 1,
      },
      attributes: ["email"],
    });
    console.log({ getUsers });
    if (!getUsers || getUsers.length === 0) {
      console.log("No uSers found");
      return false;
    }
    const validUsers = getUsers.filter((user) => user.email);
    if (validUsers.length === 0) {
      return false;
    }
    console.log(`Preparing to send emails to ${validUsers.length} recipients`);
    const BATCH_SIZE = 50;
    const DELAY_BETWEEN_BATCHES = 5000;
    for (let i = 80; i < validUsers.length; i += BATCH_SIZE) {
      const batch = validUsers.slice(i, i + BATCH_SIZE);
      console.log({ batch });
      const batchPromises = batch.map(async (user) => {
        const subscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
          user.email
        )}&status=1`;
        const unsubscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
          user.email
        )}&status=0`;
        const name = user.first_name || "there";
        const type = param;
        const templateParam = {
          name,
          subscribeUrl,
          unsubscribeUrl,
          site_url: "https://www.bookingcabs.in",
          company_logo: (process.env.B2B_URL || "") + "public/logo1.png",
          first_name: user.first_name,
          full_name: user.first_name + "" + user.last_name,
          username: user.username,
          email: user.email,
          // email: user.email,
          mobile:
            user?.mobile?.slice(0, 3) + "xxxx" + user?.mobile?.slice(7, 10),
          company_logo: "Company Logo",
          user_status: "ACTIVE",
          // site_url: process.env.site_url,
          site_url: "https://bookingcabs.in/",
          global_email: process.env.global_email,
          com_name: process.env.EMAIL_COMPANY_NAME,
          com_phone: process.env.COMPANY_CUSTOMER_NUMBER,
          com_mobile: "1234567890",
          date: new Date(),
          app_link: "https://app.booking.com",
          twitter_url: "https://twitter.com/yourhandle",
          instagram_url: "https://instagram.com/yourhandle",
          linkedin_url: "https://linkedin.com/in/yourhandle",
          youtube_url: "https://youtube.com/c/yourchannel",
          client_app_url: "https://client.booking.com",
          developed_by: "Your Company Name",
          facebook_url: "Testing@gmail.com",
        };
        // user.email
        // console.log(templateParam);

        const rendered = await renderEmailTemplate(type, templateParam);
        console.log(templateParam);
        return sendEmail(user.email, subject, rendered?.html);
      });
      await Promise.allSettled(batchPromises);
      console.log(
        `Sent batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
          validUsers.length / BATCH_SIZE
        )}`
      );
      if (i + BATCH_SIZE < validUsers.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES)
        );
      }
    }
    return true;
  } catch (error) {
    console.error("Bulk email error:", error);
    return false;
  }
};

export const sendReferMail = async (req, res) => {
  const { email, referral_code } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const subscribeUrl = `https://api.bookingcabs.in/api/newsletter/subscribe-email-for-mail?email=${encodeURIComponent(
      user.email
    )}`;
    const unsubscribeUrl = `https://api.bookingcabs.in/api/newsletter/unsubscribe-email-for-mail?email=${encodeURIComponent(
      user.email
    )}`;

    const template_param = {
      subscribeUrl,
      unsubscribeUrl,
      site_url: "https://www.bookingcabs.in/",
      company_logo: (process.env.B2B_URL || "") + "public/logo1.png",
      first_name: user.first_name,
      full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      username: user.username,
      email: user.email,
      mobile:
        user?.mobile?.slice(0, 3) + "xxxx" + user?.mobile?.slice(7, 10),
      user_status: "ACTIVE",
      global_email: process.env.GLOBAL_EMAIL,
      com_name: process.env.EMAIL_COMPANY_NAME,
      com_phone: process.env.COMPANY_CUSTOMER_NUMBER,
      com_mobile: "1234567890",
      date: new Date(),
      app_link: "https://app.booking.com",
      twitter_url: "https://twitter.com/yourhandle",
      instagram_url: "https://instagram.com/yourhandle",
      linkedin_url: "https://linkedin.com/in/yourhandle",
      youtube_url: "https://youtube.com/c/yourchannel",
      client_app_url: "https://client.booking.com",
      developed_by: "Your Company Name",
      facebook_url: "Testing@gmail.com",
      developed_by_label: "",
      name: `${user.first_name} ${user.last_name}`,
      referral_code: referral_code,
      appLink: "https://www.bookingcabs.in",
    };

    const rendered = await renderEmailTemplate(
      "refer_and_earn",
      template_param,
      true
    );

    // ⬅ sendEmail must be awaited
    const mailResponse = await sendEmail(email, "Referral", rendered?.html);

    return res.status(200).json({
      success: true,
      message: "Referral email sent successfully!",
      data: mailResponse,
    });
  } catch (error) {
    console.log("Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send referral email.",
      error: error.message,
    });
  }
};

