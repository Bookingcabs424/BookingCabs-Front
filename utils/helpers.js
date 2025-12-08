import messageTemplate from "../models/smsTemplateModel.js";
import sendSMS from "./sendSMS.js";
import UserRole from "../models/userRoleModel.js";
import { logger } from "./logger.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import EmailTemplate from "../models/emailTemplateModel.js";
import CompanySetup from "../models/companySetupModel.js";
import { sendEmail } from "./emailSender.js";
import dateFormat from "dateformat";
import ejs from "ejs";
import { config } from "dotenv";
import puppeteer from "puppeteer";
import _ from "lodash";

// import html_to_pdf from "html-pdf-node";
config();
export const sendTemplatedSMS = async ({
  msg_sku,
  is_active = 1,
  to,
  variables = {},
}) => {
  try {
    const templateData = await messageTemplate.findOne({
      where: { msg_sku, is_active },
    });

    if (!templateData || !templateData.message) {
      throw new Error(`SMS template with msg_sku ${msg_sku} not found`);
    }

    const message = templateData.message.replace(/{#(.*?)#}/g, (_, key) => {
      return variables[key] || "";
    });

    await sendSMS(to, message);
  } catch (error) {
    logger.error(
      `Error sending SMS template with msg_sku ${msg_sku}: ${error.message}`
    );
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

export const checkUserRole = async (user_type_id) => {
  const role = await UserRole.findOne({ where: { role_id: user_type_id } });

  if (!role) return null;

  if (role.role_type == 4) return "isAdmin";
  if (role.role_name) return role.role_name;
  return null;
};

export const userNameGenerator = async (first_name, id) => {
  const firstNamePart = first_name.substring(0, 3).toUpperCase();
  return `${firstNamePart}${id}`;
};
export const referal_code_generator = async (first_name) => {
  const firstNamePart = first_name.substring(0, 3).toUpperCase();
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  return `${firstNamePart}${randomNumber}`;
};

export const processUploadedFile = async (req, folder = "documents") => {
  try {
    if (!req.file) {
      return { status: "failed", message: "No file uploaded." };
    }

    const file = req.file;
    const uploadPath = path.join("uploads", folder);
    const fullPath = path.join(uploadPath, file.filename);

    return {
      status: "success",
      message: "File uploaded successfully.",
      data: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        filename: file.filename,
        path: fullPath,
      },
    };
  } catch (err) {
    return { status: "failed", message: "Upload processing failed." };
  }
};

export const maskEmail = async (email) => {
  const [username, domain] = email.split("@");
  let maskedUsername = "";
  let maskedDomain = "";

  for (let i = 0; i < username.length; i++) {
    if (i > 2 && i < username.length - 1) {
      maskedUsername += "*";
    } else {
      maskedUsername += username[i];
    }
  }

  for (let j = 0; j < domain.length; j++) {
    if (j > 1 && j < domain.length - 6) {
      maskedDomain += "*";
    } else {
      maskedDomain += domain[j];
    }
  }

  return `${maskedUsername}@${maskedDomain}`;
};

export const generateVerifyLink = async (data) => {
  const { user_id, username, user_type_id } = data;
  const secretKey = process.env.SECRET_KEY || "hello@42cab";

  const message = `${user_id}${username}${user_type_id}`;
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex");

  return hash;
};
function pad(width, string, padding) {
  return width <= string.length
    ? string
    : pad(width, padding + string, padding);
}

export const getBookingRefNo = (lastid, initial) => {
  var date = new Date();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var twoDigitYear = year.toString().substr(-2);
  year = Number(64) + Number(twoDigitYear);

  var yearCharCode = String.fromCharCode(year);
  var monthCharCode = String.fromCharCode(64 + Number(month));

  var final1 = pad("4", lastid, "0");

  if (lastid >= 10000) {
    var divide = Math.floor(lastid / 10000);
    var next = lastid - divide * 10000;
    var aa = 64 + divide;
    var lastIdCharCode = String.fromCharCode(aa);
    final1 = pad("4", next, "0");
    var booking_referece_no =
      initial +
      "" +
      yearCharCode +
      "" +
      monthCharCode +
      "" +
      lastIdCharCode +
      "" +
      final1;
  } else {
    var booking_referece_no =
      initial + "" + yearCharCode + "" + monthCharCode + "" + final1;
  }
  return booking_referece_no;
};

export const getEmailTemplate = async (code) => {
  try {
    const comp_id = process.env.COMPANY_SETUP_ID;
    const template = await EmailTemplate.findOne({
      where: {
        type: code,
        company_id: comp_id,
        is_active: 1,
      },
    });

    if (!template) {
      throw new Error(`Email template with type ${code} not found`);
    }

    return template;
  } catch (error) {
    logger.error(
      `Error fetching email template with type ${code}: ${error.message}`
    );
    throw new Error(`Failed to fetch email template: ${error.message}`);
  }
};

export const getCompanySetupDetails = async (comp_id) => {
  try {
    const companySetup = await CompanySetup.findOne({
      where: { id: comp_id },
    });

    if (!companySetup) {
      throw new Error(`Company setup with id ${comp_id} not found`);
    }

    return companySetup;
  } catch (error) {
    logger.error(
      `Error fetching company setup with id ${comp_id}: ${error.message}`
    );
    throw new Error(`Failed to fetch company setup: ${error.message}`);
  }
};

// export const generatePdf = async (req) => {
//   try {
//     console.log( process.env.COMPANY_SETUP_ID,"SETUPID")
//     const template_name = req.template_name;
//     const params1 = req.template_param;
//     const result = await getEmailTemplate(template_name);
//     const compResult = await getCompanySetupDetails(
//       process.env.COMPANY_SETUP_ID
//     );

//     const params2 = {
//       site_url: compResult.site_url,
//       global_email: compResult.global_email,
//       com_name: compResult.com_name,
//       comp_address: compResult.comp_address,
//       com_phone: compResult.phone,
//       com_mobile: compResult.mobile,
//       com_pan: compResult.pan_no,
//       com_gst_no: compResult.gst_no,
//       facebook_url: compResult.facebook,
//       twitter_url: compResult.twitter,
//       instagram_url: compResult.instagram,
//       linkedin_url: compResult.linkedin,
//       youtube_url: compResult.instagram,
//       client_app_url: compResult.client_app_url,
//       app_link: compResult.driver_app_url,
//       developed_by: compResult.developed_by,
//       developed_by_label: compResult.developed_by_label,
//       bank_name: compResult.bank_name,
//       ac_holder_name: compResult.ac_holder_name,
//       branch: compResult.branch,
//       ifsc_code: compResult.ifsc_code,
//       account_no: compResult.account_no,
//       company_logo:"https://bookingcabs.in/images/logo.png",
//       date: dateFormat(new Date(), "dd-mm-yyyy"),
//     };

//     const params = { ...params1, ...params2 };
//     const mailbody = `${result.header_text}${result.description}${result.footer_text}`;
//     const body = ejs.render(mailbody, params);

//     const date = new Date();
//     const currentYear = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const yeardir = path.join(process.env.INVOICE_PATH, currentYear.toString());
//     const monthdir = path.join(yeardir, month);

//     if (!fs.existsSync(yeardir)) {
//       fs.mkdirSync(yeardir);
//     }
//     if (!fs.existsSync(monthdir)) {
//       fs.mkdirSync(monthdir);
//     }
//     const file = { content: body };
//     const options = {
//       format: "A4",
//       path: path.join(monthdir, `${req?.file_name}.pdf`),
//       height: "11in",
//       width: "8.5in",
//       margin: {
//         top: ".5in",
//         right: ".25in",
//         bottom: ".5in",
//         left: ".25in",
//       },
//     };

//     const pdfBuffer = await html_to_pdf.generatePdf(file, options);
//     return pdfBuffer;
//   } catch (error) {
//     logger.error(`Error generating PDF: ${error.message}`);
//     throw new Error(`Failed to generate PDF: ${error.message}`);
//   }
// };

export const generatePdf = async (req) => {
  try {
    console.log(process.env.COMPANY_SETUP_ID, "SETUPID");

    const template_name = req.template_name;
    const params1 = req.template_param;

    const result = await getEmailTemplate(template_name);
    const compResult = await getCompanySetupDetails(
      process.env.COMPANY_SETUP_ID
    );

    const params2 = {
      site_url: compResult.site_url,
      global_email: compResult.global_email,
      com_name: compResult.com_name,
      comp_address: compResult.comp_address,
      com_phone: compResult.phone,
      com_mobile: compResult.mobile,
      com_pan: compResult.pan_no,
      com_gst_no: compResult.gst_no,
      facebook_url: compResult.facebook,
      twitter_url: compResult.twitter,
      instagram_url: compResult.instagram,
      linkedin_url: compResult.linkedin,
      youtube_url: compResult.instagram,
      client_app_url: compResult.client_app_url,
      app_link: compResult.driver_app_url,
      developed_by: compResult.developed_by,
      developed_by_label: compResult.developed_by_label,
      bank_name: compResult.bank_name,
      ac_holder_name: compResult.ac_holder_name,
      branch: compResult.branch,
      ifsc_code: compResult.ifsc_code,
      account_no: compResult.account_no,
      company_logo: "https://bookingcabs.in/images/logo.png",
      date: dateFormat(new Date(), "dd-mm-yyyy"),
    };

    const params = { ...params1, ...params2 };
    // const mailbody = `${result.header_text}${result.description}${result.footer_text}`;
    const mailbody = `${result.description}`;
    const body = ejs.render(mailbody, params);

    // 🗂️ Directory structure
    const date = new Date();
    const currentYear = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const yeardir = path.join(process.env.INVOICE_PATH, currentYear.toString());
    const monthdir = path.join(yeardir, month);

    if (!fs.existsSync(yeardir)) fs.mkdirSync(yeardir);
    if (!fs.existsSync(monthdir)) fs.mkdirSync(monthdir);

    const filePath = path.join(monthdir, `${req?.file_name}.pdf`);

    // 🧾 Puppeteer PDF generation
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Add HTML content
    await page.setContent(body, {
      waitUntil: ["load", "networkidle0"],
    });

    // Optional: Add custom styles (fonts, margins, etc.)
    await page.addStyleTag({
      content: `
        body { font-family: 'Arial', sans-serif; font-size: 12px; margin: 0; }
        h1, h2, h3 { color: #222; }
        @page { margin: 0.5in; }
      `,
    });

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.25in",
        bottom: "0.5in",
        left: "0.25in",
      },
    });

    await browser.close();

    const pdfBuffer = fs.readFileSync(filePath);
    return pdfBuffer;
  } catch (error) {
    logger.error(`Error generating PDF: ${error.message}`);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

export const transactionMail = async (sendMailObj) => {
  try {
    var template_name = sendMailObj.template_name;
    //var template_name  = 'registration_message';
    var params1 = sendMailObj.template_param;
    //var params1    =  {site_url:'https://www.bookingcabs.com'};
    var to = sendMailObj.sender_email;
    const result = await getEmailTemplate(template_name);
    const comp_id = process.env.COMPANY_SETUP_ID;
    const compResult = await getCompanySetupDetails(comp_id);
    let host, username, password, params2;

    if (compResult) {
      host = compResult.smtp_host;
      username = compResult.smtp_username;
      password = compResult.smtp_password;
      params2 = {
        site_url: compResult.site_url,
        global_email: compResult.global_email,
        com_name: compResult.com_name,
        comp_address: compResult.comp_address,
        com_phone: compResult.phone,
        com_mobile: compResult.mobile,
        com_pan: compResult.pan_no,
        com_gst_no: compResult.gst_no,
        facebook_url: compResult.facebook,
        twitter_url: compResult.twitter,
        instagram_url: compResult.instagram,
        linkedin_url: compResult.linkedin,
        youtube_url: compResult.youtube,
        client_app_url: compResult.client_app_url,
        app_link: compResult.driver_app_url,
        developed_by: compResult.developed_by,
        date: dateFormat(new Date(), "dd-mm-yyyy"),
      };
    } else {
      host = process.env.SMTP_HOST;
      username = process.env.MAIL_USERNAME;
      password = process.env.MAIL_PASSWORD;
      params2 = {
        site_url: process.env.SITE_URL,
        global_email: "support@bookingcabs.com",
        com_name: "Bookingcabs",
        com_phone: "NA",
        com_mobile: "NA",
        facebook_url: "#",
        twitter_url: "#",
        linkedin_url: "#",
        instagram_url: "#",
        youtube_url: "#",
        client_app_url: "#",
        app_link: "#",
        developed_by: "#",
        date: dateFormat(new Date(), "dd-mm-yyyy"),
      };
    }

    if (result) {
      const subject = result.name;
      const header = result.header_text;
      const params = { ...params1, ...params2 };
      const body = ejs.render(
        params1.temp_wx ||
          `${header}${result.description}${result.footer_text}`,
        params
      );
      // const transport = nodemailer.createTransport({
      //   host,
      //   port: 587,
      //   auth: {
      //     user: username,
      //     pass: password,
      //   },
      //   tls: {
      //     rejectUnauthorized: false,
      //   },
      // });

      // const message = {
      //   from: "no-reply@bookingcabs.com",
      //   to,
      //   subject,
      //   html: body,
      // };
      await sendEmail("manish.bookingcabs@gmail.com", subject, body);
      return { status: "success", msg: "Mail sent successfully" };
    } else {
      throw new Error("Email template not found");
    }
  } catch (error) {
    logger.error(`Error sending transaction mail: ${error.message}`);
    return { status: "failed", msg: "Mail not sent" };
  }
};
export const generatePlacCardPdf = async (req) => {
  try {
    const template_name = req.template_name;
    const params1 = req.template_param;
    const file_name = req.file_name;

    const result = await getEmailTemplate(template_name);
    const compResult = await getCompanySetupDetails(
      process.env.COMPANY_SETUP_ID
    );

    if (!result || !compResult) {
      throw new Error("Required data not found");
    }

    const params2 = {
      site_url: compResult.site_url,
      global_email: compResult.global_email,
      com_name: compResult.com_name,
      comp_address: compResult.comp_address,
      com_phone: compResult.phone,
      com_mobile: compResult.mobile,
      com_pan: compResult.pan_no,
      com_gst_no: compResult.gst_no,
      facebook_url: compResult.facebook,
      twitter_url: compResult.twitter,
      instagram_url: compResult.instagram,
      linkedin_url: compResult.linkedin,
      youtube_url: compResult.instagram,
      client_app_url: compResult.client_app_url,
      app_link: compResult.driver_app_url,
      developed_by: compResult.developed_by,
      developed_by_label: compResult.developed_by_label,
      bank_name: compResult.bank_name,
      ac_holder_name: compResult.ac_holder_name,
      branch: compResult.branch,
      ifsc_code: compResult.ifsc_code,
      account_no: compResult.account_no,
      date: dateFormat(new Date(), "dd-mm-yyyy"),
    };

    const params = { ...params1, ...params2 };
    const mailbody = `${result.header_text}${result.description}${result.footer_text}`;
    const body = ejs.render(mailbody, params);

    const date = new Date();
    const currentYear = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const yeardir = path.join(process.env.INVOICE_PATH, currentYear.toString());
    const monthdir = path.join(yeardir, month);

    if (!fs.existsSync(yeardir)) {
      fs.mkdirSync(yeardir);
    }
    if (!fs.existsSync(monthdir)) {
      fs.mkdirSync(monthdir);
    }

    const options = {
      format: "A4",
      landscape: true,
      path: path.join(monthdir, `${file_name}.pdf`),
      height: "8in",
      width: "11in",
      margin: {
        top: ".5in",
        right: ".25in",
        bottom: ".5in",
        left: ".25in",
      },
    };

    const file = { content: body };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    return { status: "success", pdfBuffer };
  } catch (error) {
    logger.error(`Error generating PlacCard PDF: ${error.message}`);
    throw new Error(`Failed to generate PlacCard PDF: ${error.message}`);
  }
};
function getBeforeAfterDate(pickupdate, n) {
  var t = new Date(pickupdate);
  var travel_hour = t.getHours();
  var travel_minute = t.getMinutes();
  t.setDate(t.getDate() + n);
  var month = "0" + (t.getMonth() + 1);
  var date = "0" + t.getDate();
  var hour = t.getHours();
  month = month.slice(-2);
  date = date.slice(-2);

  var date =
    t.getFullYear() +
    "-" +
    month +
    "-" +
    date +
    " " +
    travel_hour +
    ":" +
    travel_minute;
  return date;
}

export const calAutoExpiryDate = (pickup_date_time) => {
  var date1 = new Date(pickup_date_time);
  var date2 = new Date();
  var diffInSeconds = Math.abs(date1 - date2) / 1000;
  var travel_days = Math.floor(diffInSeconds / 60 / 60 / 24);
  diffInSeconds -= travel_days * 86400;

  var travel_hours = Math.floor(diffInSeconds / 60 / 60) % 24;
  travel_hours = ("0" + travel_hours).slice(-2);

  if (travel_days >= 30) {
    var beforeExpiryDate = getBeforeAfterDate(pickup_date_time, -21);
  } else if (travel_days >= 21 && travel_days <= 30) {
    var beforeExpiryDate = getBeforeAfterDate(pickup_date_time, -14);
  } else if (travel_days >= 15 && travel_days <= 21) {
    var beforeExpiryDate = getBeforeAfterDate(pickup_date_time, -7);
  } else if (travel_days >= 7 && travel_days <= 15) {
    var beforeExpiryDate = getBeforeAfterDate(pickup_date_time, -3);
  } else if (travel_days >= 2 && travel_days <= 7) {
    var beforeExpiryDate = getBeforeAfterDate(pickup_date_time, -1);
  } else if (travel_hours >= 12 && travel_days <= 2) {
    var month = date1.getMonth() + 1;
    var date = date1.getDate();
    var hour = date1.getHours() - 3;
    var minute = date1.getMinutes();
    var beforeExpiryDate =
      date1.getFullYear() +
      "-" +
      month +
      "-" +
      date +
      " " +
      hour +
      ":" +
      minute;
  } else if (travel_hours >= 6 && travel_hours <= 12) {
    var month = date1.getMonth() + 1;
    var date = date1.getDate();
    var hour = date1.getHours() - 2;
    var minute = date1.getMinutes();
    var beforeExpiryDate =
      date1.getFullYear() +
      "-" +
      month +
      "-" +
      date +
      " " +
      hour +
      ":" +
      minute;
  } else {
    var beforeExpiryDate = "";
  }

  var resultdata = {
    beforeExpiryDate: beforeExpiryDate,
    travel_days: travel_days,
    travel_hour: travel_hours,
  };
  return resultdata;
};

export const calDateExist = (pickup_date, date_from, date_to) => {
  if (typeof date_from !== "undefined" && date_from !== "") {
    var date_from = new Date(date_from);
    var date_from = date_from.toISOString().slice(0, 10);
    var date_to = new Date(date_to);
    var date_to = date_to.toISOString().slice(0, 10);

    var fDate, lDate, cDate;
    fDate = Date.parse(date_from);
    lDate = Date.parse(date_to);
    cDate = Date.parse(pickup_date);

    if (cDate <= lDate && cDate >= fDate) {
      return true;
    }
  }
  return false;
};
export const bookCanRuleDateArr = async (
  pickup_date_time,
  cancel_rule_Arr,
  totalbill
) => {
  var hoursDateArray = [];
  var dayDateArray = [];
  var ruleArr = cancel_rule_Arr;
  for (var i = 0; i < ruleArr.length; i++) {
    var daysArr =
      ruleArr[i].days != "" && ruleArr[i].days != "0"
        ? ruleArr[i].days.split("-")
        : "";
    var hoursArr =
      ruleArr[i].hours != "" && ruleArr[i].hours !== "0"
        ? ruleArr[i].hours.split("-")
        : "";

    var cancellationType = ruleArr[i].cancellation_type;
    var cancellation_value = ruleArr[i].cancellation_value;
    var cancellation_charges = 0;
    if (cancellationType == "Rs" || cancellationType == "Value") {
      cancellation_charges = cancellation_value;
    } else if (cancellationType == "%") {
      cancellation_charges = (totalbill * cancellation_value) / 100;
    }
    ruleArr[i]["cancellation_charge"] = cancellation_charges;

    if (hoursArr != "") {
      var hoursDateArray = [];
      for (var x in hoursArr) {
        var date1 = new Date(pickup_date_time);
        var month = "0" + (date1.getMonth() + 1);
        month = month.slice(-2);
        var date = "0" + date1.getDate();
        date = date.slice(-2);
        var hour = date1.getHours() - hoursArr[x];
        hour = "0" + hour;
        hour = hour.slice(-2);

        var minute = date1.getMinutes();
        minute = "0" + minute;
        minute = minute.slice(-2);

        //var fulld = date1.getFullYear() + "-" + month + "-" + date + " " + hour + ":" + minute;
        var fulld =
          date +
          "-" +
          month +
          "-" +
          date1.getFullYear() +
          " " +
          hour +
          ":" +
          minute;
        hoursDateArray[x] = fulld;
      }
      ruleArr[i]["cancellation_last_date"] = hoursDateArray;
    }

    if (daysArr != "") {
      var dayDateArray = [];
      for (var key in daysArr) {
        var date = new Date(pickup_date_time);
        var last = new Date(
          date.getTime() + daysArr[key] * 24 * 60 * 60 * 1000
        );
        var day = "0" + last.getDate();
        day = day.slice(-2);

        var month = last.getMonth() + 1;
        month = "0" + month;
        month = month.slice(-2);

        var year = last.getFullYear();
        var hour = last.getHours();
        hour = "0" + hour;
        hour = hour.slice(-2);

        var minute = last.getMinutes();
        minute = "0" + minute;
        minute = minute.slice(-2);

        //var fulldate = (Number(year) + '-' + (month) + '-' + (day) + " " + hour + ":" + minute);
        var fulldate =
          day + "-" + month + "-" + Number(year) + " " + hour + ":" + minute;
        dayDateArray[key] = fulldate;
      }

      ruleArr[i]["cancellation_last_date"] = dayDateArray;
    }

    console.log({ ruleArr });
  }
  return ruleArr;
};
export function extractNumberFromString(str) {
  const num = parseFloat(str.replace(/[^\d.]/g, ""));
  return isNaN(num) ? 0 : num; // Fallback to 0 if parsing fails
}

export const NumInWords = (number) => {
  const first = [
    "",
    "one ",
    "two ",
    "three ",
    "four ",
    "five ",
    "six ",
    "seven ",
    "eight ",
    "nine ",
    "ten ",
    "eleven ",
    "twelve ",
    "thirteen ",
    "fourteen ",
    "fifteen ",
    "sixteen ",
    "seventeen ",
    "eighteen ",
    "nineteen ",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const mad = ["", "thousand", "million", "billion", "trillion"];
  let word = "";

  for (let i = 0; i < mad.length; i++) {
    let tempNumber = number % (100 * Math.pow(1000, i));
    if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
      if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
        word =
          first[Math.floor(tempNumber / Math.pow(1000, i))] +
          mad[i] +
          " " +
          word;
      } else {
        word =
          tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
          "-" +
          first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
          mad[i] +
          " " +
          word;
      }
    }

    tempNumber = number % Math.pow(1000, i + 1);
    if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
      word =
        first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
        "hunderd " +
        word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1) + " only";
};
export function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export function getLowestCancellationRule(cancellationRules) {
  // Parse rules if they're in JSON string format
  console.log({ cancellationRules });
  const rules =
    typeof cancellationRules === "string"
      ? JSON.parse(cancellationRules)
      : cancellationRules;
  console.log({ rules });
  const now = new Date();

  // Get all currently active rules
  const activeRules = rules.filter((rule) => {
    // if (rule.status !== true) return false; // Skip inactive rules

    // const fromDate = new Date(rule.from_date);
    // if (now < fromDate) return false; // Rule hasn't started yet

    // if (rule.to_date) {
    //   const toDate = new Date(rule.to_date);
    //   if (now > toDate) return false; // Rule has expired
    // }

    return true;
  });

  // If no active rules, return null
  if (activeRules.length === 0) return null;
  console.log({ activeRules });
  // Find the rule with the lowest cancellation value
  return activeRules.reduce((lowest, current) => {
    return current.cancellation_value < lowest.cancellation_value
      ? current.cancellation_value
      : lowest.cancellation_value;
  });
}
export const getVehicleImages = (host, vehicle) => {
  let BaseimagePath = host + "/uploads/vehicle/" + vehicle;
  let back = BaseimagePath + "/back.jpg";
  let front = BaseimagePath + "/front.jpg";
  let left = BaseimagePath + "/left.jpg";
  let right = BaseimagePath + "/right.jpg";
  let interior = BaseimagePath + "/interior.jpg";
  return [back, front, left, right, interior];
};

export const sendTemplateMessage11 = async (req) => {
  try {
    const response = await axios({
      url: process.env.WHATSAPP_API_URL,
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: "917818886071",
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: "Rahul Sharma" }, // {{1}}
                { type: "text", text: "11 July 2025" }, // {{2}}
                { type: "text", text: "10:30 AM" }, // {{3}}
                { type: "text", text: "Sector 17, Chandigarh" }, // {{4}}
                { type: "text", text: "IGI Airport, Delhi" }, // {{5}}
                { type: "text", text: "Sedan (Swift Dzire)" }, // {{6}}
                { type: "text", text: "Ramesh Kumar" }, // {{7}}
                { type: "text", text: "+91 9876543210" }, // {{8}}
                { type: "text", text: "₹3200" }, // {{9}}
                { type: "text", text: "BK20250711-1234" }, // {{10}}
                {
                  type: "text",
                  text: "https://bookingcabs.com/invoice/BK20250711-1234",
                }, // {{11}}
                { type: "text", text: "BookingCabs" }, // {{12}}
              ],
            },
          ],
        },
      },
    });

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error) {
    console.error("WhatsApp API Error:", error.response?.data || error.message);
    throw {
      status: error.response?.status || 500,
      error: error.response?.data || { message: error.message },
    };
  }
};

export const sendTemplateMessage = async (req) => {
  try {
    const response = await axios({
      url: process.env.WHATSAPP_API_URL,
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: "917818886071",
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "body",
            },
          ],
        },
      },
    });

    // Return only the relevant data from the response
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error) {
    // Handle errors properly
    console.error("WhatsApp API Error:", error.response?.data || error.message);
    throw {
      status: error.response?.status || 500,
      error: error.response?.data || { message: error.message },
    };
  }
};

export const maskMobile = async (number, visibleDigits = 4, maskChar = "*") => {
  if (!number) return number;

  const digits = number.replace(/\D/g, "");
  const len = digits.length;
  if (len <= visibleDigits) return maskChar.repeat(len - 1) + digits.slice(-1);

  const maskedPart = maskChar.repeat(len - visibleDigits);
  return maskedPart + digits.slice(-visibleDigits);
};

// services/upsertService.js
export const upsertRecord = async (Model, data, userId = 0) => {
  // Handle multiple records (array)
  if (Array.isArray(data)) {
    const results = [];
    for (const item of data) {
      const record = await handleSingleUpsert(Model, item, userId);
      results.push(record);
    }
    return results;
  }

  // Handle single record
  return handleSingleUpsert(Model, data, userId);
};

// Internal helper for single upsert
const handleSingleUpsert = async (Model, data, userId) => {
  const { id, ...fields } = data;
  let record;

  if (id) {
    record = await Model.findByPk(id);

    if (record) {
      await record.update({
        ...fields,
        modified_by: userId,
        modified_date: new Date(),
      });
    } else {
      record = await Model.create({
        id,
        ...fields,
        created_by: userId,
        created_date: new Date(),
        modified_by: userId,
        modified_date: new Date(),
      });
    }
  } else {
    record = await Model.create({
      ...fields,
      created_by: userId,
      created_date: new Date(),
      modified_by: userId,
      modified_date: new Date(),
    });
  }

  return record;
};


export const isValidEmail = (email) => {
  // 1️⃣ Must exist and be a string
  if (!_.isString(email)) return false;

  // 2️⃣ Trim whitespace and remove trailing invalid chars (`, ', ", <, >, space)
  let cleaned = _.trim(email).replace(/[`'"<>\s]+$/g, "");

  // 3️⃣ Length check
  if (cleaned.length < 6) return false;

  // 4️⃣ Reject emails with invalid characters anywhere
  if (/[\s`'"<>(){}|\\]/.test(cleaned)) return false;

  // 5️⃣ Final strict regex check
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  return emailRegex.test(cleaned);
};

export const sanitizeEmail = (email) => {
  if (!email || typeof email !== "string") return null;

  // STEP 1: Trim spaces
  let cleaned = email.trim();

  // STEP 2: Remove invalid trailing characters like ` ' " < > space
  cleaned = cleaned.replace(/[`'"<>\s]+$/g, "");

  // STEP 3: Remove invalid characters inside the email
  // Allowed: letters, numbers, . _ % + - @
  cleaned = cleaned.replace(/[^A-Za-z0-9._%+-@]/g, "");

  // STEP 4: Ensure only 1 "@"
  const parts = cleaned.split("@");
  if (parts.length > 2) {
    // If multiple "@", join everything after the first
    cleaned = parts.shift() + "@" + parts.join("");
  }

  // STEP 5: Final strict format check
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(cleaned)) return null; // sanitization failed

  return cleaned;
};
