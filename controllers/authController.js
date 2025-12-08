import moment from "moment";
import User from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/mailer.js";
import Activation from "../models/activationModel.js";
import { sendEmail } from "../utils/emailSender.js";
import { sendTemplatedSMS, maskEmail, maskMobile } from "../utils/helpers.js";
import { renderEmailTemplate } from "../utils/renderTemplate.js";
import { Op } from "sequelize";
import { logInlog, logLoginAttempt } from "./userController.js";
import { userNameGenerator, referal_code_generator } from "../utils/helpers.js";
import {
  addReferralPointsOnUserRegistration,
  updateUserReferralHistory,
} from "./referralController.js";
import { userProfile } from "./userController.js";
import UserRole from "../models/userRoleModel.js";
import { logger } from "../utils/logger.js";
import UserProfileView from "../views/userProfileView.js";
import UserAssignRole from "../models/UserAssignModuleModel.js";
import UserInfo from "../models/userInfoModel.js";
import sequelize from "../config/clientDbManager.js";
import geoip from "geoip-lite";
import axios from "axios";
import UserModule from "../models/userModuleModel.js";
import { addUserAssignedRole } from "../controllers/userRoleController.js";
import { addCompanyDetailWhileRegister } from "../controllers/companyController.js";
import { tr } from "date-fns/locale";
import Driver from "../models/driverModel.js";
import md5 from "md5";
import path from "path";
import NewsletterUser from "../models/newsletteruserModel.js";
const RESET_SECRET = process.env.RESET_SECRET || "your_reset_secret_key";

export const login = async (req, res) => {
  const {
    identifier = "",
    password,
    user_type_id,
    type,
    username,
    otp,
    recaptchaToken,
  } = req.body;
  console.log("object")
  try {
    const licenseDetail = await licenseValidation();
    if (type == "b2bpanel" && !recaptchaToken) {
      return errorResponse(
        res,
        MESSAGES.AUTH.UNAUTHORIZED,
        MESSAGES.AUTH.RECAPTCHA_VERIFICATION,
        STATUS_CODE.NOT_FOUND
      );
    }
    if (!identifier) {
      return errorResponse(
        res,
        MESSAGES.AUTH.MISSING_FIELD,
        MESSAGES.AUTH.UNAUTHORIZED,
        STATUS_CODE.NOT_FOUND
      );
    }
    if (type == "b2bpanel" && !username) {
      return errorResponse(
        res,
        MESSAGES.AUTH.MISSING_FIELD,
        MESSAGES.AUTH.UNAUTHORIZED,
        STATUS_CODE.NOT_FOUND
      );
    }
    // TODDO: check for the recaptcha token
    /*if (type == "b2bpanel") {
      const secret = process.env.RECAPTCHA_SECRET_KEY;
      const googleResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`
      );
      const { success } = googleResponse.data;

      if (!success) {
        return errorResponse(
          res,
          MESSAGES.AUTH.UNAUTHORIZED,
          MESSAGES.AUTH.RECAPTCHA_VERIFICATION,
          STATUS_CODE.NOT_FOUND
        );
      } 
    }*/

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const email = isEmail ? identifier : "";
    const mobile = !isEmail ? identifier : "";
    let user;

    if (type === "dashboard") {
      const whereCondition = {
        user_type_id: {
          [Op.in]: [1, 6, 7, 8],
        },
      };

      if (email) {
        whereCondition.email = email;
      } else if (mobile) {
        whereCondition.mobile = mobile;
      }

      user = await User.findOne({
        where: whereCondition,
      });

    } else if (type == "b2bpanel" && username) {
      user = await User.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [{ email }, { mobile }],
            },
            { username },
            // { user_type_id },
          ],
        },
        logging: console.log,
      });
    }

    if (!user) {
if (!user) {
  await logLoginAttempt(req, null, STATUS.FAILED); // no res here
  return errorResponse(
    res,
    MESSAGES.AUTH.UNAUTHORIZED,
    MESSAGES.AUTH.USER_ROLE,
    STATUS_CODE.NOT_FOUND
  );
}
      return errorResponse(
        res,
        MESSAGES.AUTH.UNAUTHORIZED,
        MESSAGES.AUTH.USER_ROLE,
        STATUS_CODE.NOT_FOUND
      );
    }
    if (!user.isActive) {
      return errorResponse(
        res,
        MESSAGES.AUTH.UNAUTHORIZED,
        MESSAGES.AUTH.USER_INACTIVE,
        STATUS_CODE.UNAUTHORIZED
      );
    }
    if (user.is_guest) {
      let internalCallValue = {
        email,
        mobile,
        is_guest: 1,
        otp,
      };
      await verifyOTP(req, res, internalCallValue, true);
      return
    }
    if (!otp) {
      const isMatch = await user.comparePassword(password)||user.password === md5(password);
      if (!isMatch) {
        await logLoginAttempt(req, res, user.id, STATUS.FAILED);
        return errorResponse(
          res,
          MESSAGES.AUTH.INVALID_PASSWORD,
          MESSAGES.AUTH.UNAUTHORIZED,
          STATUS_CODE.UNAUTHORIZED
        );
      }
    }

    // await logLoginAttempt(req, res, user.id, STATUS.SUCCESS);
    let token;
    if (type == "b2bpanel" && username) {
      token = generateToken({
        id: user.id,
        email: user?.email,
        role: user?.user_type_id,
        mobile: user?.mobile,
      });
    } else {
      token = generateToken({
        id: user.id,
        email: user?.email,
        role: user?.user_type_id,
        mobile: user?.mobile,
      });
    }

    const param = {
      user_id: user.id,
      status: "token",
      lat: req?.body?.lat || "",
      long: req?.body?.long || "",
      callfrom: req?.body?.callfrom || "",
      ip: req?.body?.ip || "",
      login_location: req?.body?.login_location,
    };
    await logInlog(param);
    if (req.body?.gcm_id) {
      await updateGcmId({ user_id: user.id, gcm_id: req.body.gcm_id });
    }

    const userData = await UserProfileView.findOne({
      where: { id: user.id },
    });

    res.cookie("isLoggedIn", "true", {
      path : "/",
      // domain: ".bookingcabs.in",
      httpOnly: false,
      //  process.env.NODE_ENV !== "production" ? true : false,
      secure: true,
      // process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });
    return successResponse(res, MESSAGES.AUTH.LOGIN_SUCCESS, {
      token,
      userData,
      licenseDetail,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      mobile,
      mobile_prefix,
      email,
      password,
      confirm_password,
      city,
      nationality,
      newsletter_subscription = false,
      mobile_promotion = false,
      user_type_id = 1,
      referral_key = "",
      agreement_subscription = false,
      parent_id = null,
      signup_status = 0,
      isCommingFromB2B = false,
      roleType,
      gender,
      company_id,
      skip = false,
    } = req.body;

    // Mandatory field validations
    if (
      !email ||
      !password ||
      !confirm_password ||
      !first_name ||
      !last_name ||
      !mobile ||
      !mobile_prefix ||
      !city ||
      !nationality
    ) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        STATUS_CODE.BAD_REQUEST
      );
    }

    if (password !== confirm_password) {
      return errorResponse(
        res,
        MESSAGES.AUTH.CHECK_PASSWORD,
        MESSAGES.AUTH.PASSWORD_CONFIRM,
        STATUS_CODE.BAD_REQUEST
      );
    }

    // Duplicate check
    const combinationExists = await User.findOne({
      where: { email, mobile, user_type_id },
    });

    if (combinationExists) {
      return errorResponse(
        res,
        MESSAGES.USER.USERALREADYEXISTS,
        MESSAGES.USER.MOBILE_EMAIL_DUPLICATE,
        STATUS_CODE.BAD_REQUEST
      );
    }

    // Create user
    const userGrade = await addUserGrade(user_type_id);
    let user_type_id_val = user_type_id == 1 ? 1 : "10";

    const user = await User.create({
      email,
      password,
      mobile,
      mobile_prefix,
      first_name,
      last_name,
      referral_key,
      city,
      nationality,
      newsletter_subscription,
      agreement_subscription,
      mobile_verified: false,
      email_verified: false,
      parent_id,
      user_type_id: user_type_id_val,
      refer_by: null,
      wallet_point: 0,
      user_grade: userGrade || 0,
      company_id,
      signup_status,
    });

    // Create driver if needed
    if (user_type_id == "3") {
      await Driver.create({
        user_id: user.id,
        status: 1,
      });
    }

    // Role Assignment (B2B)
    if (isCommingFromB2B) {
      await addUserAssignedRole(
        {
          user_id: user.id,
          user_roles: roleType || [user_type_id],
          ip: req.ip || "127.0.0.1",
        },
        "",
        true
      );
    }

    await userProfile(city, user.id, gender);

    // Update username + referral
    const userName = await userNameGenerator(user.first_name, user.id);
    const referalKey = await referal_code_generator(user.first_name);
    user.referral_key = referalKey;
    user.username = userName;
    user.created_by = user.id;
    await user.save();

    // OTP
    await sendOTPToUser(user, password);

    // Company auto create
    if (!skip && user_type_id != 5 && user_type_id != 1) {
      const companyResp = await addCompa0nyDetailWhileRegister(req, res, true);
      if (!companyResp.success) {
        return errorResponse(res, companyResp.message || "Company create failed");
      }
    }

    // ---------------------------
    // ⭐ NEWSLETTER ADD LOGIC ⭐
    // ---------------------------
    if (newsletter_subscription) {
      const exists = await NewsletterUser.findOne({
        where: { email },
      });

      if (!exists) {
        await NewsletterUser.create({
          company_id,
          campaign_id: null,
          source: "User Register",
          user_id: user.id,
          user_type_id,
          first_name,
          last_name,
          email,
          mobile,
          city_id: city,
          address: null,
          pin_code: null,
          email_subscription: "Active",
          mobile_subscription: mobile_promotion ? "Active" : "In-Active",
          unsubscribe_reason: null,
          created_date: moment().format("YYYY-MM-DD"),
          created_by: user.id,
          modified_by: null,
          status: "Active",
          ip: req.ip || "127.0.0.1",
        });
      }
    }

    return successResponse(res, MESSAGES.USER.REGISTER_SUCCESS, {
      user_id: user.id,
      mobile: user.mobile,
      message: MESSAGES.USER.REGISTRATION_MESSAGE,
    });
  } catch (err) {
    console.log({ err });
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const sendOTPToUser = async (user, password) => {
  const { id, email, mobile, first_name, referral_key, username } = user;

  // Generate 5-digit OTP
  const otp = Math.floor(10000 + Math.random() * 90000).toString();

  // Expiry: 5 min from now
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Activation.create({
    UID: id,                     
    Verification_code: otp,         
    login_code: null,             
    isUsed: 0,                     
    user_id: id,                   
    otp: otp,                       
    is_used: 0,                    
    expires_in: expiresAt         
  });

  const maskedEmail = email ? maskEmail(email) : null;
  const maskedMobile = mobile ? maskMobile(mobile) : null;

  // -----------------------------
  // EMAIL NOTIFICATION
  // -----------------------------
  if (email) {
    const templateParam = {
      username: first_name || "User",
      user_name: username,
      user_id: id,
      com_name: "bookingCabs.com",
      user_referral_code: referral_key,
      user_email: maskedEmail,
      user_mobile: maskedMobile,
      user_password: password,
      code: otp,
      global_email: "support@bookingcabs.com",
      com_phone: "011-42424242",
      com_mobile: "1234567890",
      date: new Date(),
      site_url: "https://www.bookingcabs.com",
      app_link: "https://app.booking.com",
      twitter_url: "https://x.com/bookingcabs42",
      instagram_url: "https://instagram.com/",
      linkedin_url: "https://www.linkedin.com/in/booking-cabs/",
      youtube_url: "https://youtube.com/c/",
      client_app_url: "https://client.booking.com",
      developed_by: "tracoweb.com",
      facebook_url: "https://www.facebook.com/bookingcabs/",
      refer_amount: 50,
      user_type_id: user.user_type_id || 1,
      email_verify_link: `${process.env.FRONTEND_URL}`,
    };

    const rendered = await renderEmailTemplate("verification", templateParam);
    const renderedWelcome = await renderEmailTemplate("registration_welcome", templateParam);

    await sendEmail(
      email,
      MESSAGES.AUTH.OTP_CODE,
      rendered?.html || "Email template error"
    );

    await sendEmail(
      email,
      MESSAGES.AUTH.EMAIL_VERFICATION,
      renderedWelcome?.html || "Email template error"
    );
  }

  // -----------------------------
  // SMS NOTIFICATION
  // -----------------------------
  if (mobile) {
    await sendTemplatedSMS({
      msg_sku: "acc_verify_code",
      is_active: 1,
      to: mobile,
      variables: {
        username: first_name,
        code: otp,
        mobile: process.env.COMPANY_CUSTOMER_NUMBER,
      },
    });
  }

  logger.info(`OTP sent → ${user.mobile || user.email}: ${otp}`);
};

export const forgotPassword = async (req, res) => {
  try {
    const { identifier, user_type_id } = req.body;

    function isEmail(id) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
    }
    function isMobile(id) {
      return /^(\+?\d{1,4}[\s-]?)?(\d{7,15})$/.test(id);
    }

    let email = null;
    let mobile = null;

    if (isEmail(identifier)) {
      email = identifier;
    } else if (isMobile(identifier)) {
      mobile = identifier;
    }

    if (!email) {
      return errorResponse(
        res,
        MESSAGES.AUTH.EMAIL_REQUIRED,
        MESSAGES.AUTH.MISSING_FIELD,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const user = await User.findOne({ where: { email, user_type_id } });
    if (!user) {
      return errorResponse(
        res,
        MESSAGES.USER.NOT_FOUND,
        MESSAGES.USER.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    const token = jwt.sign({ id: user.id }, RESET_SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/?token=${token}`;

    // TODO: NEED To share otp also
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otp_expiry = Date.now() + 5 * 60 * 1000;
    await Activation.create({
      otp,
      user_id: user.id,
      expires_in: otp_expiry,
      is_used: false,
    });
    await sendOTPToMobile(mobile, otp);
    // Send reset link via email
    // Will add the temlate id and parama

    /*
  const rendered = await renderEmailTemplate(templateId, templateParam);
  await sendEmail(email, MESSAGES.AUTH.OTP_CODE ,rendered.html || "Issue with template");
  await sendMail({
    to: user.email,
    subject: MESSAGES.USER.RESET,
    html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
  });
*/

    return successResponse(res, MESSAGES.AUTH.RESET);
  } catch (err) {
    errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      MESSAGES.AUTH.OTP_VERIFICATION,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword, otp, token } = req.body;

  if (!newPassword) {
    return errorResponse(
      res,
      MESSAGES.USER.NEW_PASSWORD_REQUIRED,
      MESSAGES.USER.RESET_PASSWORD_FAIL,
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const decoded = jwt.verify(token, RESET_SECRET);
    const user = await User.findByPk(decoded.id);
    const activationRecord = await Activation.findOne({
      where: {
        user_id: user.id,
        otp: otp,
        is_used: false,
      },
      order: [["created_on", "DESC"]],
    });

    if (!activationRecord) {
      return errorResponse(
        res,
        MESSAGES.AUTH.INVALID_OTP,
        MESSAGES.AUTH.OTP_VERIFICATION,
        STATUS_CODE.UNAUTHORIZED
      );
    }

    const now = Date.now();
    const otpExpiry = new Date(activationRecord.expires_in).getTime();
    if (otpExpiry < now) {
      return errorResponse(
        res,
        MESSAGES.AUTH.OTP_EXPIRED,
        MESSAGES.AUTH.OTP_VERIFICATION,
        STATUS_CODE.UNAUTHORIZED
      );
    }
    activationRecord.is_used = true;
    await activationRecord.save();
    if (!user) {
      return errorResponse(
        res,
        MESSAGES.USER.NOT_FOUND,
        MESSAGES.USER.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return errorResponse(
        res,
        MESSAGES.AUTH.PASSWORD_CHANGE,
        MESSAGES.USER.RESET_PASSWORD_FAIL,
        STATUS_CODE.BAD_REQUEST
      );
    }

    // Set and save new password
    user.password = newPassword;
    if (user.changed("password")) {
      await user.save();
    }

    return successResponse(res, MESSAGES.USER.RESET_PASSWORD);
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.USER.RESET_PASSWORD_FAIL,
      STATUS_CODE.UNAUTHORIZED
    );
  }
};
//This for the guest user
export const sendOTP = async (req, res) => {
  const type = "verification";
  const { identifier } = req.body;

  function isEmail(id) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
  }
  function isMobile(id) {
    return /^(\+?\d{1,4}[\s-]?)?(\d{7,15})$/.test(id);
  }

  let email = null;
  let mobile = null;

  if (isEmail(identifier)) {
    email = identifier;
  } else if (isMobile(identifier)) {
    mobile = identifier;
  }

  if (!mobile && !email) {
    return errorResponse(
      res,
      MESSAGES.USER.PHONE_OR_EMAIL_REQUIRED,
      MESSAGES.USER.MISSING_CONTACT,
      STATUS_CODE.BAD_REQUEST
    );
  }

  const otp = Math.floor(10000 + Math.random() * 90000).toString();

  let user;

  if (mobile) {
    user = await User.findOne({ where: { mobile } });
    if (!user) {
      user = await User.create({
        mobile,
        is_guest: 1,
        user_type_id: 1,
        isActive: 1,
      });
    }
    // Send OTP to mobile
    await sendOTPToMobile(mobile, otp);
  } else if (email) {
    user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        is_guest: 1,
        user_type_id: 1,
        isActive: 1,
      });
    }
    // Send OTP to email
    await sendOTPToEmail(email, otp, type);
  }

  // Create Activation record with OTP
  await Activation.create({
    user_id: user.id,
    otp,
    expires_in: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
    is_used: false,
  });
  return successResponse(res, MESSAGES.AUTH.OTP);
};

const sendOTPToMobile = async (mobile, otp) => {
  await sendTemplatedSMS({
    msg_sku: "acc_verify_code",
    is_active: 1,
    to: mobile,
    variables: {
      username: "User",
      code: otp,
      mobile: process.env.COMPANY_CUSTOMER_NUMBER,
    },
  });
};

const sendOTPToEmail = async (email, otp, type) => {
  // example template
  const templateParam = {
    username: "Pawan Chauhan",
    com_name: "booking.com",
    code: otp,
    global_email: "champ@gmail.com",
    com_phone: "1234567890",
    com_mobile: "8956985698",
    date: new Date(),
    site_url: "https://www.example.com",
    app_link: "https://app.booking.com",
    twitter_url: "https://twitter.com/yourhandle",
    instagram_url: "https://instagram.com/yourhandle",
    linkedin_url: "https://linkedin.com/in/yourhandle",
    youtube_url: "https://youtube.com/c/yourchannel",
    client_app_url: "https://client.booking.com",
    developed_by: "Your Company Name",
    facebook_url: "Testing@gmail.com",
  };
  const rendered = await renderEmailTemplate(type, templateParam);
  await sendEmail(
    email,
    MESSAGES.AUTH.OTP_CODE,
    rendered.html || "Issue with template"
  );
};

export const verifyOTP = async (
  req,
  res,
  internalCallValue,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  const {
    mobile,
    email,
    otp,
    is_guest = false,
  } = isInternalCall ? internalCallValue : req.body;

  try {
    let user;
    if (mobile && email) {
      user = await User.findOne({ where: { email, mobile } });
    } else if (mobile) {
      user = await User.findOne({ where: { mobile } });
    } else if (email) {
      user = await User.findOne({ where: { email } });
    }

    if (!user) {
      return errorResponse(
        res,
        MESSAGES.AUTH.USER_NOT_FOUND,
        MESSAGES.AUTH.OTP_VERIFICATION,
        STATUS_CODE.NOT_FOUND
      );
    }

    const activationRecord = await Activation.findOne({
      where: {
        user_id: user.id,
        otp: otp,
        is_used: false,
      },
      order: [["created_on", "DESC"]],
    });

    if (!activationRecord) {
      return errorResponse(
        res,
        MESSAGES.AUTH.INVALID_OTP,
        MESSAGES.AUTH.OTP_VERIFICATION,
        STATUS_CODE.UNAUTHORIZED
      );
    }

    const now = Date.now();
    const otpExpiry = new Date(activationRecord.expires_in).getTime();
    if (otpExpiry < now) {
      return errorResponse(
        res,
        MESSAGES.AUTH.OTP_EXPIRED,
        MESSAGES.AUTH.OTP_VERIFICATION,
        STATUS_CODE.UNAUTHORIZED
      );
    }
    activationRecord.is_used = true;
    await activationRecord.save();

    user.is_guest = is_guest;
    if (mobile) {
      user.mobile_verfication = true;
    } else {
      user.email_verified = true;
    }
    user.isActive = true;
    user.signup_status = 2;
    await user.save();

    const token = generateToken({
      id: user.id,
      mobile: user.mobile,
      role: user.user_type_id,
      is_guest,
    });
    if (isInternalCall) {
      return token;
    } else {
      return successResponse(res, {}, MESSAGES.AUTH.OTP_VERIFIED);
    }
  } catch (err) {
    if (isInternalCall) {
      throw new Error(MESSAGES.AUTH.OTP_VERIFICATION);
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      MESSAGES.AUTH.OTP_VERIFICATION,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
// AFter succuffuly guest user otp need to ask this detail with user
export const completeProfile = async (req, res) => {
  const { first_name, last_name, email, is_guest = true, mobile } = req.body;
  const userId = req.user.id;

  const user = await User.findByPk(userId);
  if (!user) {
    return errorResponse(
      res,
      MESSAGES.AUTH.NOT_FOUND,
      MESSAGES.USER.INVALID_USER,
      STATUS_CODE.NOT_FOUND
    );
  }

  if (email && !user.email) {
    const existing = await User.findOne({ where: { email } });
    if (existing && existing.id !== userId) {
      return errorResponse(
        res,
        MESSAGES.USER.EMAIL_USE,
        MESSAGES.USER.DUPLICATE_EMAIL,
        STATUS_CODE.BAD_REQUEST
      );
    }
    user.email = email;
  }

  // if (mobile && !user.mobile) {
  //   const existing = await User.findOne({ where: { mobile } });
  //   if (existing && existing.id !== userId) {
  //     return errorResponse(
  //       res,
  //       MESSAGES.USER.PHONE_USE,
  //       MESSAGES.USER.DUPLICATE_PHONE,
  //       STATUS_CODE.BAD_REQUEST
  //     );
  //   }
  //   user.mobile = mobile;
  // }

  user.first_name = first_name || user.first_name;
  user.last_name = last_name || user.last_name;

  await user.save();

  return successResponse(res, MESSAGES.USER.PROFILE_UPDATE, {
    user: {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.user_type_id,
    },
  });
};

export const changePassword = async (req, res) => {
  const {
    oldPassword,
    newPassword,
    user_id,
    isCommingFromB2B = false,
  } = req.body;
  const userId = isCommingFromB2B ? user_id : req.user?.id;

  // if (!oldPassword || !newPassword) {
  //   return errorResponse(
  //     res,
  //     MESSAGES.USER.OLD_AND_NEW_PASSWORD_REQUIRED,
  //     MESSAGES.USER.CHANGE_PASSWORD_FAIL,
  //     STATUS_CODE.BAD_REQUEST
  //   );
  // }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return errorResponse(
        res,
        MESSAGES.USER.NOT_FOUND,
        MESSAGES.USER.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    // const isMatch = await user.comparePassword(oldPassword);
    // if (!isMatch) {
    //   return errorResponse(
    //     res,
    //     MESSAGES.USER.OLD_PASSWORD,
    //     MESSAGES.USER.CHANGE_PASSWORD_FAIL,
    //     STATUS_CODE.UNAUTHORIZED
    //   );
    // }

    // const isSame = await user.comparePassword(newPassword);
    // if (isSame) {
    //   return errorResponse(
    //     res,
    //     MESSAGES.AUTH.PASSWORD_CHANGE,
    //     MESSAGES.USER.CHANGE_PASSWORD_FAIL,
    //     STATUS_CODE.BAD_REQUEST
    //   );
    // }

    user.password = newPassword;
    if (user.changed("password")) {
      await user.save();
    }

    return successResponse(res, MESSAGES.USER.CHANGE_PASSWORD);
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.USER.CHANGE_PASSWORD_FAIL,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    let ip = req.ip;
    if (ip === "::1" || ip === "127.0.0.1") {
      ip = "8.8.8.8";
    }
    const geo = geoip.lookup(ip);
    if (!userId) {
      return errorResponse(
        res,
        MESSAGES.AUTH.UNAUTHORIZED,
        MESSAGES.AUTH.UNAUTHORIZED,
        STATUS_CODE.UNAUTHORIZED
      );
    }

    // Call stored procedure to perform logout operations
    await sequelize.query("CALL sp_logout(:userId, :logoutLocation, :token)", {
      replacements: {
        userId,
        logoutLocation: geo.city || "default value delhi",
        token: req.headers.authorization || "",
      },
    });
    res.clearCookie("isLoggedIn", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return successResponse(
      res,
      MESSAGES.AUTH.LOGOUT_SUCCESSFULLY,
      null,
      STATUS_CODE.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email, mobile, is_guest } = req.body;

    if (!email && !mobile) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.USER.PHONE_OR_EMAIL_REQUIRED,
        STATUS_CODE.BAD_REQUEST
      );
    }
    const user = await User.findOne({
      where: email ? { email } : { mobile },
    });

    if (!user) {
      return errorResponse(
        res,
        MESSAGES.USER.NOT_FOUND,
        MESSAGES.USER.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    // Check if the user is already verified, if so, don't resend OTP
    if (user.email_verified || user.mobile_verfication) {
      return successResponse(res, MESSAGES.USER.USER_ALREADY_VERIFIED, null);
    }
    if (is_guest) {
      await sendOTP(req, res);
    } else {
      await sendOTPToUser(user);
    }

    return successResponse(res, MESSAGES.AUTH.OTP, {
      user_id: user.id,
      mobile: user.mobile,
      email: user.email,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const addUserGrade = async (user_type_id) => {
  const userGrade = await UserRole.findOne({
    where: { role_id: user_type_id },
  });
  return userGrade.user_grade;
};

export const changeUserPasswordBySuperAdmin = async (req, res) => {
  const { password, user_id } = req.body;
  const { id } = req.user;

  if (!password || !user_id) {
    return errorResponse(
      res,
      MESSAGES.USER.OLD_AND_NEW_PASSWORD_REQUIRED,
      MESSAGES.USER.CHANGE_PASSWORD_FAIL,
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const user = await User.findByPk(user_id);

    if (!user) {
      return errorResponse(
        res,
        MESSAGES.USER.NOT_FOUND,
        MESSAGES.USER.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    const isSame = await user.comparePassword(password);
    if (isSame) {
      return errorResponse(
        res,
        MESSAGES.AUTH.PASSWORD_CHANGE,
        MESSAGES.USER.CHANGE_PASSWORD_FAIL,
        STATUS_CODE.BAD_REQUEST
      );
    }

    user.password = password;
    user.modified_by = id;
    if (user.changed("password")) {
      await user.save();
    }

    return successResponse(res, MESSAGES.USER.CHANGE_PASSWORD);
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.USER.CHANGE_PASSWORD_FAIL,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
// calling Licence app to checking the module of current user
export const licenseValidation = async () => {
  // const url = process.env.LICENSE_GENRATOR_API_URL;
  // const license_key = process.env.LICENSE_KEY;
  // const url = process.env.LICENSE_GENRATOR_API_URL;
  // const license_key = process.env.LICENSE_KEY;

  // try {
  //   if (!license_key) {
  //     throw new Error(MESSAGES.AUTH.LICENSE_KEY_NOT_FOUND);
  //   }

  //   const response = await axios.get(url, {
  //     params: { licenseKey: license_key },
  //   });

  //   const assignedModules = response?.data?.license?.planDetailsData?.modules;

  //   const moduleKey = await UserModule.findAll({
  //     where: {
  //       label: {
  //         [Op.in]: assignedModules,
  //       },
  //       is_active: 1,
  //     },
  //     attributes: ["id", "key_name", "parent_id"],
  //   });
  //   const moduleKeyNames = moduleKey.map((mod) => mod.key_name);
  //   if (response.data.status === "valid") {
  //     return {
  //       valid: true,
  //       license: response.data.license,
  //       user_module: moduleKeyNames,
  //     };
  //   } else {
  //     throw new Error(MESSAGES.AUTH.LICENSE_KEY_INVALID);
  //   }
  // } catch (err) {
  //   throw new Error(err.message);
  // }
  return {
    valid: true,
    license: [],
    user_module: [],
  };
};

export const checkAuthStatus = (req, res) => {
  const isLoggedIn = req.cookies?.isLoggedIn === "true";
  return successResponse(res, MESSAGES.USER.USER_LOGGEDIN_STATUS, {
    isLoggedIn,
  });
};

export const combinationMobileChecker = async (req, res) => {
  try {
    const { mobile, user_type_id } = req.body;

    const combinationExists = await User.findOne({
      where: {
        mobile,
        user_type_id,
      },
    });

    if (combinationExists) {
      return successResponse(res, false, MESSAGES.USER.MOBILE_EMAIL_DUPLICATE);
    }
    return successResponse(res, true, MESSAGES.USER.COMBINATION_AVAILABLE);
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const combinationEmailChecker = async (req, res) => {
  try {
    const { email, user_type_id } = req.body;

    const combinationExists = await User.findOne({
      where: {
        email,
        user_type_id,
      },
    });

    if (combinationExists) {
      return successResponse(res, false, MESSAGES.USER.MOBILE_EMAIL_DUPLICATE);
    }
    return successResponse(res, true, MESSAGES.USER.COMBINATION_AVAILABLE);
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

