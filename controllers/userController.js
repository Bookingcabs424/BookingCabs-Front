import { Op, QueryTypes, where } from "sequelize";
import crypto from "crypto";
import md5 from "md5";
import User from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import UserInfo from "../models/userInfoModel.js";
import geoip from "geoip-lite";
import UserLoginHistory from "../models/userLoginHistoryModel.js";
import MasterCity from "../models/masterCityModel.js";
import MasterState from "../models/masterStateModel.js";
import MasterCountry from "../models/masterCountryModel.js";
import UserProfileView from "../views/userProfileView.js";
import UserPrefDriveCity from "../models/userPrefDriveCityModel.js";
import UserLanguage from "../models/userLanguageModel.js";
import UserWorkingShiftMapping from "../models/userWorkingShiftMappingModel.js";
import UserPaymentType from "../models/userPaymetTypeModel.js";
import UserWeekOffMapping from "../models/userWeekOffMappingModel.js";
import { createDuty, updateDutyType } from "./userDutyPrefController.js";
import {
  maskEmail,
  generateVerifyLink,
  getEmailTemplate,
} from "../utils/helpers.js";
import { renderEmailTemplate } from "../utils/renderTemplate.js";
import { sendEmail } from "../utils/emailSender.js";
import { addUserGrade } from "./authController.js";
import Driver from "../models/driverModel.js";
import LogInLog from "../models/logInLogModel.js";
import UserAssignRole from "../models/UserAssignRoleModel.js";
import UserRating from "../models/userRatingModel.js";
import SmsTemplate from "../models/smsTemplateModel.js";
import redisClient from "../config/redisClient.js";
import path from "path";
import MasterDocumentType from "../models/masterDocumentModel.js";
import UserDocument from "../models/userUploadDocumentModel.js";
import ViewRecentUserDetail from "../views/viewRecentUserDetail.js";
import sequelize from "../config/clientDbManager.js";
import UserRelationManager from "../models/userRelationManagerModel.js";
import { sendTemplatedSMS } from "../utils/helpers.js";
import Company from "../models/companyModel.js";
import { logger } from "../utils/logger.js";
import userBookingTypeMapping from "../models/userBookingTypeMappingModel.js";
import UserAssignModule from "../models/UserAssignModuleModel.js";
import CardDetails from "../models/cardDetailsModel.js";
import UserSignature from "./userSignature.js";
import UserDutyPreference from "../models/userDutyPrefrenceModel.js";
import { userInfo } from "os";
import UserUploadDocument from "../models/userUploadDocumentModel.js";
import { safeRender } from "./quotationHelper.js";
import Activation from "../models/activationModel.js";
import sendSMS from "../utils/sendSMS.js";

User.hasOne(UserInfo, { foreignKey: "user_id" });
UserInfo.belongsTo(User, { foreignKey: "user_id" });

export const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return errorResponse(
        res,
        MESSAGES.USER.NOT_FOUND,
        MESSAGES.USER.NOT_FOUND
      );
    }

    const updatedUser = await user.update(updateData);
    return successResponse(res, MESSAGES.USER_UPDATED, {
      updatedUser,
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

// Get all users
export const getAllUser = async (req, res) => {
  try {
    const baseFilter = {
      user_type_id: { [Op.in]: [1, 2, 6, 7, 8] },
    };

    const dynamicFilters = {};

    if (req.query.id) dynamicFilters.id = Number(req.query.id);
    if (req.query.email)
      dynamicFilters.email = { [Op.like]: `%${req.query.email}%` };
    if (req.query.first_name)
      dynamicFilters.first_name = { [Op.like]: `%${req.query.first_name}%` };
    if (req.query.mobile)
      dynamicFilters.mobile = { [Op.like]: `%${req.query.mobile}%` };
    if (["true", "false"].includes(req.query.isActive))
      dynamicFilters.isActive = req.query.isActive === "true";
    if (req.query.user_type_id)
      dynamicFilters.user_type_id = Number(req.query.user_type_id);
    if (req.query.city_id) dynamicFilters.city = Number(req.query.city_id);
    if (req.query.company)
      dynamicFilters.company = { [Op.like]: `%${req.query.company}%` };

    const filters = {
      [Op.and]: [baseFilter, dynamicFilters],
    };

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await UserProfileView.findAndCountAll({
      where: filters,
      attributes: { exclude: ["password"] },
      limit,
      offset,
    });

    return successResponse(res, MESSAGES.USERS_FETCHED, {
      users: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
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

// Get user by ID
export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserProfileView.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] }, // 🔐 exclude password
    });

    const profileImage = await UserUploadDocument.findOne({
      where: { user_id: req.user.id, document_type_id: 12 },
    });

    console.log(profileImage);

    if (!user) {
      return errorResponse(
        res,
        MESSAGES.USER.NOT_FOUND,
        MESSAGES.USER.NOT_FOUND
      );
    }
    return successResponse(res, MESSAGES.USER_FETCHED, {
      user: {
        ...user,
        profileImage: profileImage?.doc_file_upload,
      },
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

// Soft delete user (e.g., set a `deletedAt` timestamp)
export const softDeleteUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return errorResponse(
        res,
        MESSAGES.USER.NOT_FOUND,
        MESSAGES.USER.NOT_FOUND
      );
    }

    // Soft delete by setting `deletedAt` timestamp or `isDeleted` flag
    await user.update({ isDeleted: true }); // Assuming the `deletedAt` column exists
    return successResponse(res, MESSAGES.USER_DELETED, {});
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const userProfile = async (cityId, user_id, gender) => {
  try {
    if (!user_id) {
      throw new Error(MESSAGES.USER.NOT_FOUND);
    }
    if (!cityId) {
      throw new Error(`City ID ${MESSAGES.GENERAL.NOT_FOUND}`);
    }

    const stateAndCountryId = await MasterCity.findOne({
      where: { id: Number(cityId) },
    });
    if (!stateAndCountryId) {
      throw new Error(`City ID ${MESSAGES.GENERAL.NOT_FOUND}`);
    }

    const userInfo = await UserInfo.create({
      user_id,
      city_id: cityId,
      country_id: stateAndCountryId.country_id,
      state_id: stateAndCountryId.state_id,
      created_by: user_id,
      gender,
    });
    return userInfo;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const {
      father_name,
      last_name,
      first_name,
      alternate_mobile,
      gender,
      address,
      address2,
      // state_id,
      // city_id,
      pincode,
      external_ref,
      kyc_type,
      kyc,
      gst_registration_number,
      landline_number,
      newsletter_subscription,
      userId,
    } = req.body;

    let { id: user_id } = req.user;
    if (userId) {
      user_id = userId;
    }
    if (!user_id) {
      return errorResponse(res, STATUS_CODE.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }

    const existingUserInfo = await UserInfo.findOne({
      where: { user_id },
    });
    const existingUserData = await User.findOne({
      where: { id: user_id },
    });

    if (!existingUserInfo || !existingUserData) {
      return errorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        MESSAGES.USER.USER_PROFILE_NOT_FOUND
      );
    }

    await existingUserData.update({
      first_name,
      last_name,
      newsletter_subscription,
      modified_by: user_id,
      modified_on: new Date(),
    });

    // Update user info with the provided details
    await existingUserInfo.update({
      father_name,
      alternate_mobile,
      gender,
      address,
      address2,
      // state_id,
      // city_id,
      pincode,
      external_ref,
      kyc_type,
      kyc,
      gst_registration_number,
      landline_number,
      modified_by: user_id,
      modified_on: new Date(),
    });

    const updatedUserData = await UserProfileView.findOne({
      where: { id: user_id },
    });

    return successResponse(
      res,
      MESSAGES.USER.PROFILE_UPDATE,
      updatedUserData,
      STATUS_CODE.OK
    );
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const logLoginAttempt = async (
  req,
  userId,
  status,
  platform = "Web",
  geolocation = "Unknown"
) => {
  try {
    const geo = geoip.lookup(req.ip);
    const geolocationVal = geo ? `${geo.city}, ${geo.country}` : geolocation;

    const lastLogin = await UserLoginHistory.findOne({
      where: { userId, status: "success" },
      order: [["loginAt", "DESC"]],
    });

    const loginDuration = lastLogin
      ? Math.floor((new Date() - new Date(lastLogin.loginAt)) / 1000)
      : null;

    await UserLoginHistory.create({
      userId,
      status,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      loginAt: new Date(),
      lastLogin: lastLogin?.loginAt || null,
      lastIpAddress: lastLogin?.ipAddress || null,
      lastUserAgent: lastLogin?.userAgent || null,
      loginDuration,
      platform,
      geolocation: geolocationVal,
    });

    // update user login metadata
    if (userId) {
      const user = await User.findOne({ where: { id: userId } });
      if (user) {
        user.login_status = true;
        user.login_time = new Date();
        user.login_timezone = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          timeZoneName: "short",
        });
        await user.save();
      }
    }
  } catch (error) {
    // Just log it, don't send response here
    console.error("logLoginAttempt failed:", error.message);
    // Optionally rethrow if you want login() to handle it:
    // throw error;
  }
};

// export const logLoginAttempt = async (
//   req,
//   res,
//   userId,
//   status,
//   platform = "Web",
//   geolocation = "Unknown"
// ) => {
//   try {
//     const geo = geoip.lookup(req.ip);
//     const geolocationVal = geo ? `${geo.city}, ${geo.country}` : geolocation;
//     const lastLogin = await UserLoginHistory.findOne({
//       where: { userId, status: "success" },
//       order: [["loginAt", "DESC"]],
//     });

//     const loginDuration = lastLogin
//       ? Math.floor((new Date() - new Date(lastLogin.loginAt)) / 1000)
//       : null;
//     /*if (!lastLogin) {
//       return errorResponse(
//         res,
//         STATUS_CODE.NOT_FOUND,
//         MESSAGES.GENERAL.NOT_FOUND
//       );
//     }*/
//     await UserLoginHistory.create({
//       userId,
//       status,
//       ipAddress: req.ip,
//       userAgent: req.get("User-Agent"),
//       loginAt: new Date(),
//       lastLogin: lastLogin?.loginAt || null,
//       lastIpAddress: lastLogin?.ipAddress || null,
//       lastUserAgent: lastLogin?.userAgent || null,
//       loginDuration,
//       platform,
//       geolocation: geolocationVal,
//     });
//     const user = await User.findOne({ where: { id: userId } });
//     if (user) {
//       user.login_status = true;
//       user.login_time = new Date();
//       const indiaTime = new Date().toLocaleString("en-US", {
//         timeZone: "Asia/Kolkata",
//         timeZoneName: "short",
//       });
//       user.login_timezone = indiaTime;
//       await user.save();
//     }
//   } catch (error) {
//     return errorResponse(res, STATUS_CODE.NOT_FOUND, error.message);
//   }
// };

export const getUserLoginHistory = async (req, res) => {
  const userId = req.params.id;

  try {
    const history = await UserLoginHistory.findAll({
      where: { userId },
      order: [["loginAt", "DESC"]],
    });

    return successResponse(res, MESSAGES.USER.LOGIN_HISTORY, { history });
  } catch (err) {
    return errorResponse(res, STATUS_CODE.NOT_FOUND, error.message);
  }
};

export const getAllUserLoginHistories = async (req, res) => {
  try {
    const histories = await UserLoginHistory.findAll({
      order: [["loginAt", "DESC"]],
    });

    return successResponse(res, MESSAGES.USER.LOGIN_HISTORY_ALL_USER, {
      histories,
    });
  } catch (error) {
    return errorResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      error.message || "Something went wrong"
    );
  }
};

export const getUserLoginStatus = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      return errorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        MESSAGES.USER.USER_NOT_ACTIVE
      );
    }

    const latestHistory = await UserLoginHistory.findOne({
      where: { userId },
      order: [["loginAt", "DESC"]],
    });

    if (!latestHistory) {
      return errorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        MESSAGES.USER.LOGIN_HISTORY_NOT_FOUND
      );
    }

    const accountStatus = {
      status: latestHistory.status,
      lastLogin: latestHistory.loginAt,
      failedAttempts: latestHistory.failedAttempts,
      lastIpAddress: latestHistory.lastIpAddress,
      lastUserAgent: latestHistory.lastUserAgent,
    };

    return successResponse(res, MESSAGES.USER.LOGIN_STATUS, { accountStatus });
  } catch (err) {
    return errorResponse(
      res,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      err.message || "Something went wrong"
    );
  }
};

export const getAllActiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.findAll({
      where: { isActive: true },
      attributes: ["id", "email", "isActive"],
      raw: true,
    });

    if (!activeUsers.length) {
      return errorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        MESSAGES.USER.NO_ACTIVE_USER
      );
    }

    // Get userIds of all active users
    const userIds = activeUsers.map((u) => u.id);

    // Fetch latest loginHistory for each user (one per user)
    const histories = await Promise.all(
      userIds.map((userId) =>
        UserLoginHistory.findOne({
          where: { userId },
          order: [["loginAt", "DESC"]],
          raw: true,
        })
      )
    );

    const activeUsersData = activeUsers.map((user, index) => {
      const latestHistory = histories[index];

      return {
        userId: user.id,
        email: user.email,
        status: user.isActive ? "Active" : "Inactive",
        loginStatus: latestHistory
          ? latestHistory.status
          : MESSAGES.USER.LOGIN_HISTORY_NOT_FOUND,
        lastLogin: latestHistory ? latestHistory.loginAt : null,
        failedAttempts: latestHistory ? latestHistory.failedAttempts : 0,
        lastIpAddress: latestHistory ? latestHistory.lastIpAddress : "N/A",
        lastUserAgent: latestHistory ? latestHistory.lastUserAgent : "N/A",
      };
    });

    return successResponse(res, MESSAGES.USER.ACTIVE_USER, {
      activeUsers: activeUsersData,
    });
  } catch (error) {
    return errorResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const activateUser = async (req, res) => {
  const userId = req.params.id;

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
    user.isActive = true;
    await user.save();

    return successResponse(res, MESSAGES.USER_ACTIVATED, {});
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message || "Something went wrong"
    );
  }
};
// route userpersonalinfo
export const userPersonalInfo = async (req, res) => {
  const { id: user_id } = req.user;
  try {
    const userInfoData = UserInfo.findOne({
      where: { user_id },
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      userInfoData,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message || "Something went wrong"
    );
  }
};

export const updatePrefDriverCity = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    const { id: user_id } = req.user;

    const userUpdate = await UserPrefDriveCity.update(
      { status: 2 },
      { where: { user_id } }
    );

    if (isInternalCall) {
      return true;
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      userUpdate,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message || "Something went wrong"
    );
  }
};

export const addPrefDriveCity = async (req, res, isInternalCall = false) => {
  try {
    const { pref_city } = req.body;
    const { id: user_id } = req.user;

    if (!pref_city) {
      return errorResponse(res, MESSAGES.GENERAL.MANDATORY_FIELD);
    }

    let cityIdsRaw = Array.isArray(pref_city)
      ? pref_city
      : pref_city.split(",");

    const cityIds = [
      ...new Set(cityIdsRaw.map((id) => id.trim()).filter(Boolean)),
    ];

    if (cityIds.length === 0) {
      return errorResponse(res, MESSAGES.GENERAL.DATA_NOT_VALID);
    }

    const now = new Date();
    const bulkData = cityIds.map((city_id) => ({
      user_id,
      city_id,
      created_date: now,
      created_by: user_id,
    }));

    const userPrefData = await UserPrefDriveCity.bulkCreate(bulkData);
    if (isInternalCall) {
      return userPrefData;
    }
    return successResponse(res, MESSAGES.USER.USER_PREF_CITY, {
      userPrefData,
    });
  } catch (err) {
    if (isInternalCall) {
      throw new Error(err.message);
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message || "Internal Server Error"
    );
  }
};

export const insertUserLanguage = async (
  req,
  res,
  language_type,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    const { pref_lang } = req.body;
    const { id: user_id } = req.user;
    const created_date = new Date();
    const created_by = user_id;

    if (!pref_lang) {
      return errorResponse(res, MESSAGES.GENERAL.MANDATORY_FIELD);
    }

    let langIdsRaw = Array.isArray(pref_lang)
      ? pref_lang
      : pref_lang.split(",");

    const langIds = [
      ...new Set(langIdsRaw.map((id) => id.trim()).filter(Boolean)),
    ];

    if (langIds.length === 0) {
      return errorResponse(res, MESSAGES.GENERAL.DATA_NOT_VALID);
    }

    // 1. Soft-delete existing languages for that type
    await UserLanguage.update(
      { status: 2 },
      {
        where: {
          user_id,
          language_type,
        },
      }
    );

    const bulkData = langIds.map((language_id) => ({
      user_id,
      language_id,
      language_type,
      status: 1,
      created_date,
      created_by,
    }));

    const userLangData = await UserLanguage.bulkCreate(bulkData);
    if (isInternalCall) {
      return userLangData;
    }
    return successResponse(res, MESSAGE.USER.USER_LANG_UPDATED, {
      userLangData,
    });
  } catch (err) {
    if (isInternalCall) {
      throw new Error(err.message);
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message || "Internal Server Error"
    );
  }
};
export const userLoginShift = async (req, res, isInternalCall = false) => {
  try {
    const { id: user_id } = req.user;

    const userUpdate = await UserWorkingShiftMapping.update(
      { status: 2 },
      { where: { user_id } }
    );

    if (isInternalCall) {
      return true;
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      userUpdate,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message || "Something went wrong"
    );
  }
};

export const addDriverShift = async (req, res, isInternalCall = false) => {
  try {
    const { shift } = req.body;
    const { id: user_id } = req.user;
    const created_by = user_id;
    const created_date = new Date();

    if (!shift) {
      return errorResponse(res, MESSAGES.GENERAL.MANDATORY_FIELD);
    }

    let shiftIdsRaw = Array.isArray(shift) ? shift : shift.split(",");

    const shiftIds = [
      ...new Set(shiftIdsRaw.map((id) => id.trim()).filter(Boolean)),
    ];
    if (shiftIds.length === 0) {
      return errorResponse(res, MESSAGES.GENERAL.DATA_NOT_VALID);
    }

    const bulkData = shiftIds.map((working_shift_id) => ({
      user_id,
      working_shift_id,
      created_date,
      created_by,
    }));

    const shiftMappings = await UserWorkingShiftMapping.bulkCreate(bulkData);
    if (isInternalCall) {
      return shiftMappings;
    }
    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, {
      shiftMappings,
    });
  } catch (error) {
    if (isInternalCall) {
      throw new Error(error.message);
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updatePaymentType = async (req, res, isInternalCall = false) => {
  try {
    const { id: user_id } = req.user;

    const userUpdate = await UserPaymentType.update(
      { status: 2 },
      { where: { user_id } }
    );

    if (isInternalCall) {
      return true;
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      userUpdate,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message || "Something went wrong"
    );
  }
};

export const addPaymentType = async (req, res, isInternalCall) => {
  try {
    const { payment_cash } = req.body;
    const { id: user_id } = req.user;
    const created_by = user_id;
    const created_date = new Date();

    if (!payment_cash) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.SERVER_ERROR
      );
    }

    let shiftIdsRaw = Array.isArray(payment_cash)
      ? payment_cash
      : payment_cash.split(",");

    const paymentTypeIds = [
      ...new Set(shiftIdsRaw.map((id) => id.trim()).filter(Boolean)),
    ];
    if (paymentTypeIds.length === 0) {
      return errorResponse(res, MESSAGES.GENERAL.DATA_NOT_VALID);
    }

    const bulkData = paymentTypeIds.map((payment_type_id) => ({
      user_id,
      payment_type_id,
      created_date,
      created_by,
    }));

    const paymentTypes = await UserPaymentType.bulkCreate(bulkData);
    if (isInternalCall) {
      return paymentTypes;
    }
    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, {
      paymentTypes,
    });
  } catch (error) {
    if (isInternalCall) {
      throw new Error(error.message);
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updateWeekOff = async (req, res, isInternalCall = false) => {
  try {
    const { id: user_id } = req.user;

    const userUpdate = await UserWeekOffMapping.update(
      { status: 2 },
      { where: { user_id } }
    );

    if (isInternalCall) {
      return true;
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      userUpdate,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message || "Something went wrong"
    );
  }
};

export const addWeekOff = async (req, res, isInternalCall) => {
  try {
    const { week_off } = req.body;
    const { id: user_id } = req.user;
    const created_by = user_id;
    const created_date = new Date();

    if (!week_off) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.SERVER_ERROR
      );
    }

    const weekIds = week_off
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (weekIds.length === 0) {
      return errorResponse(res, MESSAGES.GENERAL.DATA_NOT_VALID);
    }

    const bulkData = weekIds.map((week_id) => ({
      user_id,
      week_id,
      created_date,
      created_by,
      status: 1,
    }));

    const weekOffData = await UserWeekOffMapping.bulkCreate(bulkData);
    if (isInternalCall) {
      return weekOffData;
    }
    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, {
      weekOffData,
    });
  } catch (error) {
    if (isInternalCall) {
      throw new Error(error.message);
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

// TODO
export const updatePackageType = async (req, res, isInternalCall = false) => {};

export const updateDriverData = async (req, res, isInternalCall = false) => {
  try {
    const { preferred_booking } = req.body;
    const { id: user_id } = req.user;

    if (!preferred_booking) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.SERVER_ERROR
      );
    }

    const [updatedCount] = await Driver.update(
      { preferred_booking },
      { where: { user_id } }
    );

    // if (updatedCount === 0) {
    //   return errorResponse(res, MESSAGES.GENERAL.DATA_NOT_VALID);
    // }
    if (isInternalCall) {
      return true;
    }
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
  } catch (err) {
    if (isInternalCall) {
      throw new Error(error.message);
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const addDutyDetailSequential = async (req, res) => {
  try {
    const {
      pref_city,
      booking_type,
      shift,
      payment_cash,
      week_off,
      language_type,
    } = req.body;
    // language_type -example speak read write
    const { id: user_id } = req.user;
    if (pref_city) {
      await updatePrefDriverCity(req, res, true);
      await addPrefDriveCity(req, res, true);
    }

    if (language_type) {
      await insertUserLanguage(req, res, language_type, true);
    }

    if (booking_type) {
      await updateDutyType(req, res, true);
      await createDuty(req, res, true);
    }

    if (shift) {
      await userLoginShift(req, res, true);
      await addDriverShift(req, res, true);
    }

    if (payment_cash) {
      await updatePaymentType(req, res, true);
      await addPaymentType(req, res, true);
    }

    if (week_off) {
      await updateWeekOff(req, res, true);
      await addWeekOff(req, res, true);
    }

    // if (pref_city && package_type) {
    //   await updatePackageType(req, res, true);
    // }

    await updateDriverData(req, res, true);
    await User.update(
      { signup_status: 10 },
      {
        where: { id: user_id },
      }
    );

    return successResponse(res, MESSAGES.GENERAL.THANK_YOU);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getLanguageListByType = async (req, res) => {
  const userId = parseInt(req.params.id);
  const languageType = req.query.type;

  if (!userId || !languageType) {
    return errorResponse(res, MESSAGES.GENERAL.MANDATORY_FIELD, error.message);
  }

  try {
    const languages = await UserLanguage.findAll({
      attributes: ["user_lang_id", "language_id"],
      where: {
        user_id: userId,
        language_type: languageType,
        status: 1,
      },
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      languages,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const userLoginList = async (req, res, isInternalCall = false) => {
  const user_id = isInternalCall ? req : parseInt(req.user.id);

  try {
    const userWorkingShift = await UserWorkingShiftMapping.findAll({
      attributes: ["user_workingshift_id", "working_shift_id"],
      where: {
        user_id,
        status: 1,
      },
    });

    if (isInternalCall) {
      return userWorkingShift;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        userWorkingShift,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw new Error(MESSAGES.GENERAL.SOMETHING_WENT_WRONG);
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message
      );
    }
  }
};

export const userPaymentList = async (req, res) => {
  const { id: user_id } = req.user;
  try {
    const userPaymentListData = await UserPaymentType.findAll({
      attributes: ["user_payment_id", "payment_type_id"],
      where: {
        user_id,
        status: 1,
      },
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      userPaymentListData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const userWeekOffList = async (req, res) => {
  const { id: user_id } = req.user;
  try {
    const userWeekOffListData = await UserWeekOffMapping.findAll({
      attributes: ["user_weekoff_id", "week_id"],
      where: {
        user_id,
        status: 1,
      },
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      userWeekOffListData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getPrefDriveCityList = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  const userId = isInternalCall ? req : parseInt(req.params.userId);

  if (!userId) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.SERVER_ERROR
    );
  }

  const sql = `
    SELECT dc.city_id, CONCAT(mc.name, " ,(", mcoun.name, ")") AS name
    FROM user_pref_drive_city AS dc
    LEFT JOIN master_city AS mc ON dc.city_id = mc.id
    LEFT JOIN master_state AS ms ON mc.state_id = ms.id
    LEFT JOIN master_country AS mcoun ON ms.country_id = mcoun.id
    WHERE dc.user_id = :userId AND dc.status = 1
  `;

  try {
    const results = await sequelize.query(sql, {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    });

    if (isInternalCall) {
      return results;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        results,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw new Error(MESSAGES.GENERAL.SOMETHING_WENT_WRONG);
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message
      );
    }
  }
};

export const emailVerifyStatus = async (req, res) => {
  const { id } = req.user;
  const { emailVerifyStatus } = req.body;

  if (!emailVerifyStatus) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }

  try {
    const updateEmail = await User.update(
      { email_verified: emailVerifyStatus },
      { where: { id } }
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updateEmail,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message || "Failed to update email verification status"
    );
  }
};

export const updateMobileVerify = async (req, res) => {
  const { id: userId, user_type_id, password } = req.user;
  const { mobileVerifyStatus } = req.body;

  if (!mobileVerifyStatus) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }

  try {
    const updateData = {
      phone_verified: mobileVerifyStatus,
    };

    if (user_type_id !== 3 && user_type_id !== 4) {
      updateData.is_active = true;
    }

    await User.update(updateData, { where: { id: userId } });

    const result = await sequelize.query(
      `SELECT u.user_type_id, u.username, u.first_name, u.email, u.mobile, u.referral_key, 
       rda.installation_amount_user as referral_amount 
       FROM user u 
       LEFT JOIN referral_discount_amount rda ON u.user_type_id = rda.user_type 
       WHERE u.id = :userId`,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!result.length) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.USER.NOT_FOUND
      );
    }

    const userData = result[0];
    const user_email = maskEmail(userData.email);
    const user_mobile = `${userData.mobile.slice(
      0,
      3
    )}xxxx${userData.mobile.slice(7, 10)}`;
    const email_verify_link = generateVerifyLink({
      username: userData.username,
      user_type_id: userData.user_type_id,
      user_id: userId,
    });

    const mailParams = {
      username: userData.first_name,
      user_id: userId,
      user_type_id: userData.user_type_id,
      user_name: userData.username,
      user_email,
      user_mobile,
      user_password: password,
      user_referral_code: userData.referral_key,
      refer_amount: userData.wallet_point,
      email_verify_link,
    };

    const type = "registration_message";
    const rendered = await renderEmailTemplate(type, mailParams);

    await sendEmail(
      userData.email,
      MESSAGES.AUTH.MOBILE_VERFICATION,
      rendered.html || "Issue with template"
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      phone_verified: mobileVerifyStatus,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updateReferralCode = async (req, res) => {
  const { referral_code } = req.body;
  const id = req.params.id;

  if (!referral_code || referral_code.trim() === "") {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }

  try {
    const [affectedRows] = await User.update(
      { referral_key: referral_code.trim() },
      { where: { id } }
    );

    if (affectedRows === 0) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG
      );
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      userId: id,
      referral_code: referral_code.trim(),
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const addUserAdmin = async (req, res) => {
  try {
    const { id } = req.user;
    const {
      company_id,
      user_type_id,
      parent_id,
      first_name,
      last_name,
      mobile,
      email,
      gender,
      password,
      mobile_prefix,
      nationality,
      signup_status,
      user_grade,
      pref_city,
    } = req.body;
    console.log(req.body);
    const combinationExists = await User.findOne({
      where: {
        email,
        mobile,
        user_type_id,
      },
    });
    if (combinationExists) {
      return errorResponse(
        res,
        MESSAGES.USER.USERALREADYEXISTS,
        MESSAGES.USER.MOBILE_EMAIL_DUPLICATE,
        STATUS_CODE.BAD_REQUEST
      );
    }
    const userGrade = await addUserGrade(user_type_id);
    const user = await User.create({
      email,
      password,
      mobile,
      mobile_prefix,
      first_name,
      last_name,
      city,
      nationality,
      newsletter_subscription: 1,
      agreement_subscription: 1,
      mobile_verified: false,
      email_verified: false,
      parent_id,
      user_type_id,
      refer_by: null,
      wallet_point: 0,
      user_grade: user_grade || userGrade,
      company_id,
      signup_status,
    });
    await userProfile(city, user?.id);
    const userName = await userNameGenerator(user.first_name, user.id);
    const referalKey = await referal_code_generator(user.first_name);
    user.referral_key = referalKey;
    user.username = userName;
    user.created_by = id;
    await user.save();
    await UserInfo.update({ gender: gender }, { where: { user_id: user.id } });
    if (user_type_id == 3 || user_type_id == 4) {
      await Driver.create({
        user_id: user?.id,
        created_date: new Date(),
      });
    }

    if (pref_city) {
      const prefCityArr = pref_city.split(",");
      if (prefCityArr.length > 0) {
        const values_user_city = prefCityArr.map((cityId) => ({
          user_id: user.id,
          city_id: cityId,
          created_date: new Date(),
          created_by: id,
        }));

        await UserPrefDriveCity.bulkCreate(values_user_city);
      }
    }
    const user_email = maskEmail(user.email);
    const user_mobile = `${user.mobile.slice(0, 3)}xxxx${user.mobile.slice(
      7,
      10
    )}`;
    const email_verify_link = generateVerifyLink({
      username: user.username,
      user_type_id: user.user_type_id,
      user_id: user.id,
    });

    const mailParams = {
      username: user.first_name,
      user_id: user.id,
      user_type_id: user.user_type_id,
      user_name: user.username,
      user_email,
      user_mobile,
      user_password: password,
      user_referral_code: user.referral_key,
      refer_amount: user.wallet_point,
      email_verify_link,
    };

    const type = "registration_message";
    const rendered = await renderEmailTemplate(type, mailParams);

    await sendEmail(
      user.email,
      MESSAGES.AUTH.MOBILE_VERFICATION,
      rendered.html || "Issue with template"
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, {
      user,
    });
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const statusHistory = async (req, res) => {
  const userId = parseInt(req.query.user_id);
  const { from_date, to_date } = req.query;

  if (!userId || !from_date || !to_date) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.INVALID_PARAMS
    );
  }

  const sql = `
    SELECT 
      DATE_FORMAT(login_time, '%Y-%m-%d %H:%i:%s') AS login_time,
      DATE_FORMAT(logout_time, '%Y-%m-%d %H:%i:%s') AS logout_time,
      login_location,
      logout_location,
      DATE_FORMAT(login_date, '%Y-%m-%d') AS \`date\`,
      SEC_TO_TIME(SUM(TIME_TO_SEC(login_diff))) AS total_hrs
    FROM log_in_log
    WHERE userId = :userId
      AND login_time >= :fromDate
      AND login_time <= :toDate
    GROUP BY login_date
    ORDER BY id DESC
  `;

  try {
    const [results] = await sequelize.query(sql, {
      replacements: {
        userId,
        fromDate: from_date,
        toDate: to_date,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getUserDetailByParentId = async (req, res) => {
  const { user_id, user_type, company_id, user_type_id } = req.body;

  const conditions = [];
  const replacements = {};

  if (user_id !== undefined) {
    conditions.push("id = :user_id");
    replacements.user_id = user_id;
  }

  if (user_type_id !== undefined) {
    conditions.push("user_type_id = :user_type_id");
    replacements.user_type_id = user_type_id;
  }

  if (user_type !== undefined) {
    conditions.push("child_usertype_id = :child_user_type");
    replacements.child_user_type = user_type;
  }

  if (company_id !== undefined) {
    conditions.push("company_id = :company_id");
    replacements.company_id = company_id;
  }

  const whereClause =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const sql = `
    SELECT * FROM view_company_vendor_driver
    ${whereClause}
  `;

  try {
    const [results] = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getUserStaff = async (req, res) => {
  const { user_id, user_type_id } = req.body;

  if (!user_id) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.USER_ID_MANDATORY
    );
  }

  const conditions = [`(u.parent_id = :user_id)`];
  const replacements = { user_id };

  if (user_type_id !== undefined) {
    const types = !Array.isArray(user_type_id)
      ? user_type_id
      : user_type_id.split(",");
    conditions.push(`u.user_type_id IN (:user_type_id)`);
    replacements.user_type_id = types;
  }

  // const sql = `
  //   SELECT
  //     u.id as user_id,
  //     u.user_type_id,
  //     u.username as username,
  //     usertype.role_name AS user_type_name,
  //     u.company_id,
  //     company_setup.com_name AS company_name,
  //     company_setup.comp_address AS company_address,
  //     company_setup.mobile AS company_mobile,
  //     u.parent_id,
  //     u.first_name,
  //     u.last_name,
  //     u.email,
  //     u.mobile,
  //     user_role.assign_role_id,
  //     user_role.role_id,
  //     role.role_name,
  //     master_department.id as department_id,
  //     master_department.department_name,
  //     u.nationality,
  //     u.wallet_amount,
  //     u.gcm_id,
  //     u.login_status,
  //     u.login_time,
  //     u.logout_time,
  //     u.email_verified,
  //     u.referral_key,
  //     u.refer_by,
  //     u.isActive,
  //     u.signup_status,
  //     ui.*,
  //     mc.name as country_name,
  //     ms.name as state_name,
  //     mct.name as city_name,
  //     GROUP_CONCAT(module.module_id) as module_id,
  //     GROUP_CONCAT(module.module_name) as module_name
  //   FROM user AS u
  //   JOIN user_info AS ui ON u.id = ui.user_id
  //   LEFT JOIN company_setup ON u.company_id = company_setup.id
  //   LEFT JOIN user_role AS usertype ON u.user_type_id = usertype.Role_ID
  //   LEFT JOIN master_country AS mc ON mc.id = ui.country_id
  //   LEFT JOIN master_state AS ms ON ms.id = ui.state_id
  //   LEFT JOIN master_city AS mct ON mct.id = ui.city_id
  //   LEFT JOIN user_assign_role AS user_role ON u.id = user_role.user_id
  //   LEFT JOIN role ON user_role.role_id = role.role_id
  //   LEFT JOIN master_department ON user_role.department_id = master_department.id
  //   LEFT JOIN user_assign_module ON user_role.assign_role_id = user_assign_module.assign_role_id AND user_assign_module.status = 1
  //   LEFT JOIN master_module_manager AS module ON module.module_id = user_assign_module.module_id
  //   WHERE ${conditions.join(" AND ")}
  //   GROUP BY user_assign_module.assign_role_id
  //   ORDER BY u.id DESC
  // `;
  // Change the GROUP BY to use user_id instead
  const sql = `
  SELECT 
    u.id as user_id,
    ANY_VALUE(u.user_type_id) as user_type_id,
    ANY_VALUE(u.username) as username,
    ANY_VALUE(usertype.RoleName) AS user_type_name,
    ANY_VALUE(u.company_id) as company_id,
    ANY_VALUE(company_setup.com_name) AS company_name,
    ANY_VALUE(company_setup.comp_address) AS company_address,
    ANY_VALUE(company_setup.mobile) AS company_mobile,
    ANY_VALUE(u.parent_id) as parent_id,
    ANY_VALUE(u.first_name) as first_name,
    ANY_VALUE(u.last_name) as last_name,
    ANY_VALUE(u.email) as email,
    ANY_VALUE(u.mobile) as mobile,
    MAX(user_role.assign_role_id) as assign_role_id,
    MAX(user_role.role_id) as role_id,
    MAX(role.role_name) as role_name,
    MAX(master_department.id) as department_id,
    MAX(master_department.department_name) as department_name,
    ANY_VALUE(u.nationality) as nationality,
    ANY_VALUE(u.wallet_amount) as wallet_amount,
    ANY_VALUE(u.gcm_id) as gcm_id,
    ANY_VALUE(u.login_status) as login_status,
    ANY_VALUE(u.login_time) as login_time,
    ANY_VALUE(u.logout_time) as logout_time,
    ANY_VALUE(u.email_verified) as email_verified,
    ANY_VALUE(u.referral_key) as referral_key,
    ANY_VALUE(u.refer_by) as refer_by,
    ANY_VALUE(u.isActive) as isActive,
    ANY_VALUE(u.signup_status) as signup_status,
    ANY_VALUE(ui.id) as ui_id,
    ANY_VALUE(ui.user_id) as ui_user_id,
    ANY_VALUE(ui.address) as address,
    ANY_VALUE(ui.address2) as address2,
    ANY_VALUE(ui.alternate_email) as alternate_email,
    ANY_VALUE(ui.alternate_mobile) as alternate_mobile,
    ANY_VALUE(ui.external_ref) as external_ref,
    ANY_VALUE(ui.city_id) as ui_city_id,
    ANY_VALUE(ui.country_id) as ui_country_id,
    ANY_VALUE(ui.dob) as dob,
    ANY_VALUE(ui.father_name) as father_name,
    ANY_VALUE(ui.gst_registration_number) as gst_registration_number,
    ANY_VALUE(ui.kyc) as kyc,
    ANY_VALUE(ui.kyc_type) as kyc_type,
    ANY_VALUE(ui.landline_number) as landline_number,
    ANY_VALUE(ui.pincode) as pincode,
    ANY_VALUE(ui.state_id) as ui_state_id,
    ANY_VALUE(ui.gender) as gender,
    ANY_VALUE(ui.pan) as pan,
    ANY_VALUE(mc.name) as country_name,
    ANY_VALUE(ms.name) as state_name,
    ANY_VALUE(mct.name) as city_name,
    GROUP_CONCAT(DISTINCT module.module_id) as module_id,
    GROUP_CONCAT(DISTINCT module.module_name) as module_name
  FROM user AS u
  JOIN user_info AS ui ON u.id = ui.user_id
  LEFT JOIN company_setup ON u.company_id = company_setup.id
  LEFT JOIN user_role AS usertype ON u.user_type_id = usertype.Role_ID
  LEFT JOIN master_country AS mc ON mc.id = ui.country_id
  LEFT JOIN master_state AS ms ON ms.id = ui.state_id
  LEFT JOIN master_city AS mct ON mct.id = ui.city_id
  LEFT JOIN user_assign_role AS user_role ON u.id = user_role.user_id AND user_role.status = 1
  LEFT JOIN role ON user_role.role_id = role.role_id
  LEFT JOIN master_department ON user_role.department_id = master_department.id
  LEFT JOIN user_assign_module ON user_role.assign_role_id = user_assign_module.assign_role_id AND user_assign_module.status = 1
  LEFT JOIN master_module_manager AS module ON module.module_id = user_assign_module.module_id
  WHERE ${conditions.join(" AND ")}
  GROUP BY u.id
  ORDER BY u.id DESC
`;
  try {
    const results = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getUserStaffDetails = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.USER_ID_MANDATORY
    );
  }

  const sql = `
    SELECT 
      u.id as user_id,
      u.user_type_id,
      u.username as username,
      usertype.RoleName AS user_type_name,
      u.company_id,
      company_setup.com_name AS company_name,
      company_setup.comp_address AS company_address,
      company_setup.mobile AS company_mobile,
      u.parent_id,
      u.first_name,
      u.last_name,
      u.email,
      u.mobile,
      u.gender,
      user_role.assign_role_id,
      user_role.role_id,
      role.role_name,
      master_department.id as department_id,
      master_department.department_name,
      u.nationality,
      u.wallet_amount,
      u.gcm_id,
      u.login_status,
      u.login_time,
      u.logout_time,
      u.email_verified,
      u.phone_verified,
      u.referral_key,
      u.refer_by,
      u.isActive,
      ui.*,
      mc.name as country_name,
      ms.name as state_name,
      mct.name as city_name,
      GROUP_CONCAT(module.module_id) as module_id,
      GROUP_CONCAT(module.module_name) as module_name
    FROM user as u
    JOIN user_info as ui on u.id = ui.user_id
    LEFT JOIN company_setup ON u.company_id = company_setup.id
    LEFT JOIN user_role AS usertype ON u.user_type_id = usertype.Role_ID
    LEFT JOIN master_country as mc on mc.id = ui.country_id
    LEFT JOIN master_state as ms on ms.id = ui.state_id
    LEFT JOIN master_city as mct on mct.id = ui.city_id
    LEFT JOIN user_assign_role AS user_role ON u.id = user_role.user_id
    LEFT JOIN role ON user_role.role_id = role.role_id
    LEFT JOIN master_department ON user_role.department_id = master_department.id
    LEFT JOIN user_assign_module ON user_role.assign_role_id = user_assign_module.assign_role_id AND user_assign_module.status = 1
    LEFT JOIN master_module_manager as module ON module.module_id = user_assign_module.module_id
    WHERE u.id = :user_id
    GROUP BY user_assign_module.assign_role_id
    ORDER BY u.id DESC
  `;

  try {
    const [results] = await sequelize.query(sql, {
      replacements: { user_id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const logInlog = async (param) => {
  try {
    const currentTime = new Date();
    const DEFAULT_TTL = 24 * 60 * 60 * 1000;
    const expires = currentTime.getTime() + DEFAULT_TTL;
    const login_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const login_date = new Date(currentTime);
    login_date.setHours(0, 0, 0, 0);

    const logEntry = {
      userId: param.user_id,
      status: param.status,
      expires: expires,
      callfrom: param.callfrom,
      login_time: currentTime,
      login_date: login_date,
      login_location: param.login_location,
      lat: param.lat,
      log: param.log,
      login_timezone: login_timezone,
      ip: param.ip,
    };
    await updateLoginStatus({
      user_id: param.user_id,
      login_time: currentTime,
    });
    const result = await LogInLog.create(logEntry);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateGcmId = async (param) => {
  const { user_id, gcm_id } = param;

  try {
    const [updated] = await User.update({ gcm_id }, { where: { id: user_id } });

    if (updated === 0) {
      throw new Error(MESSAGE.GENERAL.GCM_ID_NOT_FOUND);
    }

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateLoginStatus = async (param) => {
  try {
    const user_id = param.user_id;
    const login_time = param.login_time;
    const login_status = "1";
    const login_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const result = await User.update(
      {
        login_status,
        login_time,
        login_timezone,
      },
      {
        where: { id: user_id },
      }
    );

    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateDutyStatus = async (req, res) => {
  try {
    const { user_id, duty_status } = req.body;

    if (!user_id || duty_status == null) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.USER_ID_MANDATORY
      );
    }

    const [updatedRows] = await User.update(
      { duty_status },
      { where: { id: user_id } }
    );

    if (updatedRows === 0) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND
      );
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, { updatedRows });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updateStaffInfo = async (param) => {
  try {
    const {
      user_id,
      first_name,
      last_name,
      email,
      mobile,
      gender,
      role_id,
      department_id,
      modified_by,
    } = param;
    await User.update(
      {
        first_name,
        last_name,
        email,
        mobile,
        modified_by,
      },
      { where: { id: user_id } }
    );
    await UserInfo.update(
      {
        gender,
        // modified_by,
      },
      { where: { user_id } } // ✅ added where condition
    );

    if (role_id || department_id) {
      await UserAssignRole.update(
        {
          ...(role_id && { role_id }),
          ...(department_id && { department_id }),
        },
        { where: { user_id } } // ✅ added where condition
      );
    }
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteAssignModule = async (param) => {
  try {
    const { assign_role_id, modified_by } = param;

    if (assign_role_id) {
      const [affectedRows] = await UserAssignModule.update(
        {
          status: 2,
          modified_by,
        },
        {
          where: { assign_role_id },
        }
      );
      if (affectedRows === 0) {
        throw new Error(MESSAGES.GENERAL.NO_DATA_FOUND);
      }
    }

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addAssignModule = async (reqObj) => {
  const { assign_role_id, moduleids, created_by, created_date } = reqObj;
  console.log({ reqObj });
  if (!assign_role_id || !moduleids || !created_by || !created_date) {
    throw new Error(MESSAGES.GENERAL.MANDATORY_FIELD);
  }

  const master_module_ids = moduleids;

  if (!master_module_ids.length) {
    throw new Error(MESSAGES.GENERAL.NOT_FOUND);
  }

  const roleModuleEntries = master_module_ids.map((module_id) => ({
    assign_role_id,
    module_id,
    created_by,
    created_date,
  }));
  // console.log({roleModuleEntries})
  try {
    const result = await UserAssignModule.bulkCreate(roleModuleEntries);
    return result;
  } catch (err) {
    console.log({ err });
    throw new Error(err.message);
  }
};

export const updateStaffSequential = async function (req, res) {
  const {
    first_name,
    last_name,
    email,
    mobile,
    gender,
    role_id,
    department_id,
    assign_role_id,
    moduleids,
    created_by,
    created_date,
  } = req.body;
  const { id: modified_by } = req.user;
  const user_id = req.user.id;
  let param = {
    user_id,
    first_name,
    last_name,
    email,
    mobile,
    gender,
    role_id,
    department_id,
    modified_by,
    assign_role_id,
    moduleids,
    created_by,
    created_date,
  };

  try {
    await updateStaffInfo(param);
    await deleteAssignModule(param);
    await addAssignModule(param);
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {});
  } catch (err) {
    console.log({ err });
    return errorResponse(
      res,
      err.message,
      MESSAGES.USER.CHANGE_PASSWORD_FAIL,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getUserType = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findByPk(userId);

    if (!result) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { result });
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.USER.CHANGE_PASSWORD_FAIL,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const addUserRating = async (req, res) => {
  try {
    const { booking_id, driver_id, user_id, rating } = req.body;

    const data = {
      BookingId: booking_id,
      DriverId: driver_id,
      UserId: user_id,
      Rating: rating,
    };

    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || data[key] === "") {
        delete data[key];
      }
    });

    const result = await UserRating.create(data);

    return successResponse(res, MESSAGES.GENERAL.DATA_SAVED, { result });
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.DATA_NOT_SAVED,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const sendInvoice = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const results = await Booking.booking_info(booking_id); // Need to create this method in booking

    if (results.status !== "success") {
      return errorResponse(
        res,
        MESSAGE.GENERAL.NO_DATA_FOUND,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const bookdata = results.data;

    const booking_reference = bookdata.booking_id;
    const bookingDate1 = dateFormat(bookdata.bookingdate, "yyyy-mm-dd");
    const bookingTime = dateFormat(bookdata.bookingdate, "HH:MM:ss");
    const logo = process.env.LOGO_IMAGE;

    const bookingTemplate = `
      <table border="1" align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td align="right"><img src="${logo}" height="40" width="100" /></td>
          <td colspan="2">
            <strong>Booking No.:</strong> ${booking_reference}<br />
            <strong>Booking Date:</strong> ${bookingDate1}<br />
            <strong>Booking Time:</strong> ${bookingTime}
          </td>
        </tr>
        <tr><td colspan="2"><strong>Pickup Date:</strong> ${bookdata.pickupdate}</td></tr>
        <tr><td colspan="2"><strong>Pickup Location:</strong> ${bookdata.pickupaddress}</td></tr>
        <tr><td colspan="2"><strong>Drop Location:</strong> ${bookdata.dropaddress}</td></tr>
        <tr><td colspan="2"><strong>Minimum Charge:</strong> ${bookdata.minimum_price}</td></tr>
        <tr><td colspan="2"><strong>Tax Price:</strong> ${bookdata.total_tax_price}</td></tr>
        <tr><td colspan="2"><strong>Total Amount:</strong> ${bookdata.total_price}</td></tr>
      </table>`;

    const result = await sendEmail({
      to: bookdata.email, // Replace with actual recipient
      subject: `Invoice for Booking ${booking_reference}`,
      html: bookingTemplate,
    });

    return successResponse(res, MESSAGE.GENERAL.INVOICE_SENT, { result });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getUserHierarchy = async (req, res, isInternalCall = false) => {
  try {
    let { user_id } = req?.params || req?.body || {};
    if (!user_id) {
      user_id = req;
    }
    console.log({ user_id });
    const parentData = [];

    // Recursive function to fetch parent chain
    const fetchParentChain = async (uid) => {
      const user = await User.findOne({
        attributes: [
          "id",
          "first_name",
          "last_name",
          "parent_id",
          "user_grade",
        ],
        where: { id: uid },
      });

      if (user) {
        parentData.push(user);
        if (user.parent_id && user.parent_id !== 0) {
          await fetchParentChain(user.parent_id);
        } else if (user.id !== 1) {
          // Always include root user (ID: 1) if not already in chain
          const rootUser = await User.findOne({
            attributes: [
              "id",
              "first_name",
              "last_name",
              "parent_id",
              "user_grade",
            ],
            where: { id: 1 },
          });
          if (rootUser) parentData.push(rootUser);
        }
      }
    };
    console.log("object", { user_id });
    await fetchParentChain(user_id);

    if (isInternalCall) {
      return parentData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        parentData,
      });
    }
  } catch (err) {
    console.error(err, "Error in getUserHierarchy");
    if (isInternalCall) {
      throw new Error(MESSAGES.GENERAL.DATA_NOT_FETCHED);
    } else {
      return errorResponse(
        res,
        err.message,
        MESSAGES.GENERAL.DATA_NOT_FETCHED,
        STATUS_CODE.SERVER_ERROR
      );
    }
  }
};

export const getReferralEarnings = async (req, res) => {
  const { user_id, user_type_id } = req.body;

  try {
    const sql = `
      SELECT 
        u.referral_key,
        rda.installation_amount_user AS referral_amount,
        rda.installation_amount_referer AS refer_amount
      FROM user AS u
      LEFT JOIN referral_discount_amount AS rda
        ON u.user_type_id = rda.user_type
      WHERE u.id = :user_id
        AND u.user_type_id = :user_type_id
    `;

    const [result] = await db.sequelize.query(sql, {
      replacements: { user_id, user_type_id },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    if (!result) {
      return errorResponse(
        res,
        "No Record Found",
        MESSAGES.GENERAL.NO_RECORDS,
        STATUS_CODE.NOT_FOUND
      );
    }

    // Fetch SMS template
    const smsTemplate = await SmsTemplate.findOne({
      where: { msg_sku: "refer_earn" },
      attributes: ["message"],
    });

    let smsMessage = smsTemplate?.message || "";
    smsMessage = smsMessage
      .replace("<%= username %>", "User")
      .replace("<%= user_referral_code %>", result.referral_key)
      .replace("<%= referral_amount %>", result.referral_amount)
      .replace("<%= app_link %>", "bookingcabs.com");

    const data = {
      referral_key: result.referral_key,
      referral_amount: result.referral_amount,
      refer_amount: result.refer_amount,
      smstext: smsMessage,
    };

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, data);
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.DATA_NOT_FETCHED,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const referEarn = async (req, res) => {
  const { user_id, user_type_id } = req.body;

  try {
    const [userResult] = await sequelize.query(
      `
      SELECT 
        u.first_name,
        u.referral_key,
        rda.installation_amount_user AS referral_amount,
        rda.installation_amount_referer AS refer_amount
      FROM user AS u
      LEFT JOIN referral_discount_amount AS rda
        ON u.user_type_id = rda.user_type
      WHERE u.id = :user_id
        AND u.user_type_id = :user_type_id
      `,
      {
        replacements: { user_id, user_type_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!userResult) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        {},
        STATUS.NOT_FOUND
      );
    }

    const smsTemplate = await SmsTemplate.findOne({
      where: { msg_sku: "refer_earn" },
      attributes: ["message"],
    });

    let smsMessage = smsTemplate?.message || "";
    smsMessage = smsMessage
      .replace("<%= username %>", userResult.first_name || "User")
      .replace("<%= user_referral_code %>", userResult.referral_key)
      .replace("<%= referral_amount %>", userResult.referral_amount)
      .replace("<%= app_link %>", "bookingcabs.com");

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      referral_key: userResult.referral_key,
      referral_amount: userResult.referral_amount,
      refer_amount: userResult.refer_amount,
      smstext: smsMessage,
    });
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getUserPendingDoc = async (req, res) => {
  const { user_id } = req.body;

  try {
    const [results] = await sequelize.query(
      `
      SELECT * 
      FROM master_document_type 
      WHERE NOT EXISTS (
        SELECT 1 
        FROM user_upload_document 
        WHERE user_upload_document.document_type_id = master_document_type.doc_type_id 
          AND user_upload_document.user_id = :user_id
      )
      `,
      {
        replacements: { user_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        data: results,
      });
    } else {
      return errorResponse(
        res,
        "No record found",
        MESSAGES.GENERAL.NO_DATA_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getUserBookingTypeMapping = async (req, res) => {
  const {
    user_id,
    booking_type,
    state_id,
    auto_id,
    city_id,
    country_id,
    mapping_category,
    vehicle_type,
    booking_type_mode,
    status,
  } = req.body;

  try {
    var sql = `SELECT ubtm.*, mc.name AS city_name, mcc.name AS state_name, mccc.name AS country_name, mp.name AS package_name, mvt.vehicle_type AS vehicle_type_name, mpm.package_mode AS package_mode, u.first_name AS created_by_first_name, u.last_name AS created_by_last_name FROM user_booking_type_mapping AS ubtm LEFT JOIN master_city AS mc ON ubtm.city_id = mc.id LEFT JOIN master_state AS mcc ON ubtm.state_id = mcc.id LEFT JOIN master_country AS mccc ON ubtm.country_id = mccc.id LEFT JOIN master_package AS mp ON ubtm.master_package_id = mp.id LEFT JOIN master_vehicle_type AS mvt ON ubtm.vehicle_type = mvt.id LEFT JOIN master_package_mode AS mpm ON ubtm.master_package_mode_id = mpm.id LEFT JOIN user AS u ON ubtm.created_by = u.id WHERE 1 = 1`;

    const replacements = {};

    if (mapping_category) {
      sql += ` AND ubtm.mapping_category = :mapping_category`;
      replacements.mapping_category = mapping_category;
    }

    if (user_id) {
      sql += ` AND ubtm.user_id = :user_id`;
      replacements.user_id = user_id;
    }

    if (booking_type) {
      sql += ` AND ubtm.master_package_id IN (${booking_type})`;
    }

    if (vehicle_type) {
      sql += ` AND ubtm.vehicle_type = :vehicle_type`;
      replacements.vehicle_type = parseInt(vehicle_type, 10);
    }

    if (booking_type_mode) {
      sql += ` AND ubtm.master_package_mode_id = :booking_type_mode`;
      replacements.booking_type_mode = booking_type_mode;
    }

    if (status) {
      sql += ` AND ubtm.status = :status`;
      replacements.status = status;
    }

    // Handle the hierarchy: country -> state -> city
    if (country_id) {
      // If country is provided, state and city should be null
      sql += ` AND ubtm.country_id = :country_id AND ubtm.state_id IS NULL AND ubtm.city_id IS NULL`;
      replacements.country_id = country_id;
    } else if (state_id) {
      // If state is provided (but no country), city should be null
      sql += ` AND ubtm.state_id = :state_id AND ubtm.city_id IS NULL`;
      replacements.state_id = state_id;
    } else if (city_id) {
      // If only city is provided
      sql += ` AND ubtm.city_id = :city_id`;
      replacements.city_id = parseInt(city_id, 10);
    }

    if (auto_id) {
      sql += ` AND ubtm.id = :auto_id`;
      replacements.auto_id = auto_id;
    }

    sql += ` ORDER BY ubtm.id DESC`;

    const results = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        data: results,
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const userCreditHistory = async (req, res) => {
  const { user_id } = req.params;

  try {
    const results = await sequelize.query(
      `
      SELECT 
        ut.user_id,
        book.reference_number,
        ut.created_date,
        ut.time,
        payment_type.pay_type_mode,
        COALESCE(CASE WHEN ut.action_type = 'Debit' THEN ut.amount END, 0) AS debit_amount,
        COALESCE(CASE WHEN ut.action_type = 'Credit' THEN ut.amount END, 0) AS credit_amount,
        COALESCE(
          (
            SELECT SUM(CASE WHEN b.action_type = 'Credit' THEN b.amount ELSE 0 END) 
            FROM user_transaction b 
            WHERE b.booking_trans_id <= ut.booking_trans_id AND b.user_id = :user_id
          ) -
          (
            SELECT SUM(CASE WHEN b.action_type = 'Debit' THEN b.amount ELSE 0 END) 
            FROM user_transaction b 
            WHERE b.booking_trans_id <= ut.booking_trans_id AND b.user_id = :user_id
          ), 0
        ) AS balance
      FROM user_transaction AS ut
      LEFT JOIN booking AS book ON ut.booking_id = book.booking_id
      LEFT JOIN payment_type ON ut.payment_type_id = payment_type.payment_type_id
      WHERE ut.user_id = :user_id
      ORDER BY ut.booking_trans_id DESC
      `,
      {
        replacements: { user_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const userUploadCreditBalance = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [result] = await sequelize.query(
      `
      SELECT 
        user_id,
        SUM(COALESCE(CASE WHEN action_type = 'Debit' THEN amount END, 0)) AS total_debits,
        SUM(COALESCE(CASE WHEN action_type = 'Credit' THEN amount END, 0)) AS total_credits,
        SUM(COALESCE(CASE WHEN action_type = 'Credit' THEN amount END, 0)) - 
        SUM(COALESCE(CASE WHEN action_type = 'Debit' THEN amount END, 0)) AS balance
      FROM user_transaction
      WHERE user_id = :user_id
      `,
      {
        replacements: { user_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (result) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { result });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const allUserCreditBalance = async (req, res) => {
  try {
    const results = await sequelize.query(
      `
      SELECT 
        user_id,
        SUM(COALESCE(CASE WHEN action_type = 'debit' THEN amount END, 0)) AS debit_amount,
        SUM(COALESCE(CASE WHEN action_type = 'credit' THEN amount END, 0)) AS credit_amount,
        SUM(COALESCE(CASE WHEN action_type = 'credit' THEN amount END, 0)) - 
        SUM(COALESCE(CASE WHEN action_type = 'debit' THEN amount END, 0)) AS balance
      FROM user_transaction
      GROUP BY user_id
      HAVING balance <> 0
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const singleUserCreditBalance = async (req, res) => {
  const { user_id } = req.user.id;

  try {
    const results = await sequelize.query(
      `
      SELECT 
        user_id,
        SUM(COALESCE(CASE WHEN action_type = 'debit' THEN amount END, 0)) AS debit_amount,
        SUM(COALESCE(CASE WHEN action_type = 'credit' THEN amount END, 0)) AS credit_amount,
        SUM(COALESCE(CASE WHEN action_type = 'credit' THEN amount END, 0)) - 
        SUM(COALESCE(CASE WHEN action_type = 'debit' THEN amount END, 0)) AS balance
      FROM user_transaction
      WHERE user_id = :user_id
      GROUP BY user_id
      HAVING balance <> 0
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { user_id },
      }
    );

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        results: results[0],
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getCityName = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const cacheKey = `city-search:${city.toLowerCase()}`;
    let cachedData;
    if (redisClient) {
      cachedData = await redisClient.get(cacheKey);
    }

    if (cachedData) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        cityData: JSON.parse(cachedData),
        source: "cache",
      });
    }

    const cityData = await MasterCity.findAll({
      attributes: ["id", "name", "state_name", "country_code"],
      where: {
        name: {
          [Op.like]: `%${city}%`,
        },
      },
      limit: 15,
    });

    await redisClient.set(cacheKey, JSON.stringify(cityData), "EX", 3600);

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      cityData,
      source: "database",
    });
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getCountryName = async (req, res) => {
  try {
    const { country } = req.body;

    if (!country) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const cacheKey = `country-search:${country.toLowerCase()}`;
    let cachedData;
    if (redisClient) {
      cachedData = await redisClient.get(cacheKey);
    }

    if (cachedData) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        countryData: JSON.parse(cachedData),
        source: "cache",
      });
    }

    const countryData = await MasterCountry.findAll({
      attributes: ["id", "name", "nationality"],
      where: {
        name: {
          [Op.like]: `%${country}%`,
        },
      },
      limit: 20,
    });

    await redisClient.set(cacheKey, JSON.stringify(countryData), "EX", 3600);

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      countryData,
      source: "database",
    });
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const userProfileInfoDetail = async (req, res) => {
  try {
    const {
      father_name,
      alternate_email,
      alternate_mobile,
      dob,
      gender,
      address,
      pincode,
      email,
      mobile,
      typeId,
    } = req.body;

    // 1. Find user
    const user = await User.findOne({
      attributes: ["id", "signup_status"],
      where: {
        email,
        mobile,
        user_type_id: typeId,
      },
    });

    if (!user) {
      return errorResponse(
        res,
        MESSAGES.USER.USER_NOT_FOUND,
        MESSAGES.USER.USER_NOT_FOUND
      );
    }
    await user.update({ signup_status: 3 });

    const user_id = user.id;
    const existingUserInfo = await UserInfo.findOne({
      where: { user_id },
    });

    if (!existingUserInfo) {
      return errorResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        MESSAGES.USER.USER_PROFILE_NOT_FOUND
      );
    }
    await existingUserInfo.update({
      father_name,
      alternate_email,
      alternate_mobile,
      dob,
      gender,
      address,
      pincode,
      modified_by: user_id,
      modified_on: new Date(),
    });
    const companyData = await Company.findOne({
      where: {
        user_id: user.id,
      },
    });
    const data = companyData ? companyData : {};
    return successResponse(
      res,
      MESSAGES.GENERAL.DATA_UPDATED,
      data,
      STATUS_CODE.OK
    );
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getUserModules = async (req, res) => {
  const userId = req.user.id;

  const license = await License.findOne({
    where: { user_id: userId },
    include: [
      {
        model: LicenseModule,
        include: [MasterModuleManager],
      },
    ],
  });

  if (!license) {
    errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      MESSAGES.GENERAL.NO_DATA_FOUND,
      STATUS_CODE.NOT_FOUND
    );
  }

  const modules = license.license_modules.map((mod) => ({
    module_id: mod.master_module_manager.module_id,
    module_name: mod.master_module_manager.module_name,
  }));

  return res.json({ modules });
};

export const uploadUserProfilePhoto = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.FILE_MANDATORY,
        STATUS_CODE.NOT_FOUND
      );
    }

    const file = req.file;
    const filePath = path.join(
      "uploads",
      req.query.folder || "documents",
      file.filename
    );

    const user = await User.findByPk(userId);
    user.user_profile_path = filePath;
    await user.save();
    return successResponse(res, MESSAGES.GENERAL.FILE_UPLOADED, {
      userId,
      filename: file.filename,
    });
  } catch (error) {
    errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getDocumentList = async (req, res) => {
  try {
    const { doc_level_name } = req.params;
    const documentData = await MasterDocumentType.findAll({
      where: { status: 1, doc_level_name },
      order: [["document_name", "ASC"]],
    });

    if (documentData.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        documentData,
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const uploadUserDocument = async (req, res) => {
  try {
    const { doc_type_id, user_id, kyc } = req.body;
    let userId = req.user.id;
    user_id ? (userId = user_id) : userId;
    if (!req.file) {
      errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.FILE_MANDATORY,
        STATUS_CODE.NOT_FOUND
      );
    }

    const file = req.file;
    const filePath = path.join(
      "uploads",
      req.query.folder || "documents",
      file.filename
    );

    const user = await UserInfo.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    const ids = Number(doc_type_id);
    let userInfo;
    if ([12, 13, 14].includes(ids)) {
      await UserInfo.update(
        {
          kyc_type: doc_type_id,
          kyc: kyc,
        },
        {
          where: { user_id: userId },
        }
      );

      userInfo = await UserInfo.findOne({
        where: { user_id: userId },
      });
    }

    const userDoc = await UserDocument.findOne({
      where: { user_id: userId, document_type_id: doc_type_id },
    });
    let uploadData;
    if (userDoc) {
      userDoc.doc_file_upload = filePath;
      userDoc.document_type_id = doc_type_id;
      uploadData = await userDoc.save();
    } else {
      uploadData = await UserDocument.create({
        user_id: userId,
        document_type_id: doc_type_id,
        doc_file_upload: filePath,
        created_by: userId,
      });
    }
    const userDocuments = await UserDocument.findAll({
      where: { user_id: userId },
    });
    return successResponse(res, MESSAGES.GENERAL.FILE_UPLOADED, {
      userId,
      filename: file.filename,
      uploadData,
      userDocuments,
      userInfo,
    });
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getRecentUserDetail = async (req, res) => {
  try {
    const {
      name,
      user_id,
      company_id,
      isCommingFromb2bPanel = false,
    } = req.body;

    const whereClause = {
      user_type_id: {
        [Op.in]: isCommingFromb2bPanel ? [1, 5, 6] : [1, 6, 7, 8],
      },
    };

    const userData = user_id ? await User.findByPk(user_id) : null;

    if (userData && userData.user_type_id !== 10) {
      if (user_id) whereClause.parent_id = user_id;
      // if (company_id) whereClause.company_id = company_id;
    }

    if (name) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${name}%` } },
        { email: { [Op.like]: `%${name}%` } },
        { mobile: { [Op.like]: `%${name}%` } },
      ];
    }

    const recentUserData = await ViewRecentUserDetail.findAll({
      where: whereClause,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      recentUserData,
    });
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateUserStatus = async (req, res) => {
  const { isActive, id } = req.body;
  const userId = req?.user?.id ?? 0;

  try {
    const updatedCount = await User.update(
      { isActive, modified_by: userId },
      { where: { id } }
    );

    if (updatedCount > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
        updatedRows: updatedCount,
      });
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const addRelationShipManager = (req, res) => {
  const { user_id, staff_id, ip: currentIp } = req.body;

  const created_by = user_id;
  let ip = currentIp;
  const created_date = new Date();

  try {
    const insertedData = UserRelationManager.create({
      user_id,
      staff_id,
      created_by,
      ip,
      created_date,
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_ADDED);
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateRelationShipManager = async (req, res) => {
  const { user_id, staff_id, status, ip: currentIp, created_by } = req.body;

  try {
    let updateValues = {
      user_id,
      staff_id,
      status,
      ip: currentIp,
      created_by,
      modified_date: new Date(),
    };

    // Remove empty/undefined values (same as your LB code)
    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === undefined || updateValues[key] === "") {
        delete updateValues[key];
      }
    });

    const [rowsUpdated] = await UserRelationManager.update(updateValues, {
      where: { user_id },
    });

    if (rowsUpdated > 0) {
      return successResponse(res, "updated successfully");
    } else {
      return errorResponse(
        res,
        "No record updated",
        "No changes made",
        STATUS_CODE.BAD_REQUEST
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const sendStatusToUser = async (req, res) => {
  const { user_id, status } = req.body;
  if (!user_id || !status) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.USER_ID_MANDATORY,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      STATUS_CODE.SERVER_ERROR
    );
  }
  try {
    const user = await User.findByPk(user_id);

    const mailParams = {
      first_name: user.first_name,
      full_name: user.first_name + "" + user.last_name,
      username: user.username,
      email: user.email,
      mobile: user?.mobile?.slice(0, 3) + "xxxx" + user?.mobile?.slice(7, 10),
      company_logo: "Company Logo",
      user_status: status,
      site_url: process.env.site_url,
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
    await sendTemplatedSMS({
      msg_sku: "profile_active",
      is_active: 1,
      to: user?.mobile,
      variables: {
        firstname: user.first_name,
        username: user.username,
        email: user.email,
        full_name: user.first_name + "" + user.last_name,
        mobile: user?.mobile?.slice(0, 3) + "xxxx" + user?.mobile?.slice(7, 10),
        company_logo: "Company Logo",
        user_referral_code: user.referral_key,
        user_status: status,
      },
    });

    const type = "user_account_activation";
    const rendered = await renderEmailTemplate(type, mailParams);

    await sendEmail(
      user.email,
      MESSAGES.AUTH.ACCOUNT_ACTIVATION,
      rendered.html || "Issue with template"
    );
    return successResponse(res, MESSAGES.GENERAL.EMAIL_SENT, {});
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getUserUploadedDocument = async (req, res) => {
  try {
    const { doc_type, user_id } = req.body;

    if (!user_id) {
      return errorResponse(
        res,
        "User ID is required",
        MESSAGES.GENERAL.INVALID_PARAMETERS,
        STATUS_CODE.BAD_REQUEST
      );
    }

    let sql = `
      SELECT 
        vm.vehicle_no,
        u.document_type_id,
        u.doc_file_upload,
        u.doc_approval_status,
        u.doc_default_status,
        u.user_id,
        u.status,
        u.upload_doc_id, 
        mdt.document_name,
        mdt.doc_level_name,
        mdt.type,
        u.created_by 
      FROM user_upload_document u
      LEFT JOIN master_document_type mdt ON u.document_type_id = mdt.doc_type_id 
      LEFT JOIN vehicle_master vm ON u.user_id = vm.vehicle_master_id 
      WHERE u.created_by = :user_id 
    `;

    const replacements = { user_id };

    if (doc_type) {
      sql += ` AND mdt.type = :doc_type`;
      replacements.doc_type = doc_type;
    }

    const results = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const gstNumberVerfied = async (req, res) => {
  try {
    const { gst } = req.body;

    if (!gst) {
      return errorResponse(
        res,
        "GST number is required",
        MESSAGES.GENERAL.VALIDATION_ERROR,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const companyData = await Company.findOne({
      where: {
        service_tax_gst: gst,
      },
    });

    if (companyData) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        company: companyData,
        isExisting: true,
      });
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        isExisting: false,
        message: "No company found with this GST — new company",
      });
    }
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const getUserDataafterLogin = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user = await UserProfileView.findOne({
      where: { id: user_id },
    });
    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

export const getDepartments = async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      "SELECT * FROM master_department WHERE status <> 0"
    );
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await sequelize.query(
      "SELECT * FROM master_department WHERE id = ?",
      { replacements: [id] }
    );
    const row = rows[0];
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { row });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add
export const addDepartment = async (req, res) => {
  try {
    const { department_name, description, created_by, status } = req.body;

    const [result] = await sequelize.query(
      `INSERT INTO master_department 
      (department_name, description, created_by, created_date, status) 
      VALUES (?, ?, ?, CURDATE(), ?)`,
      {
        replacements: [department_name, description, created_by, status || 1],
      }
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_ADDED, { id: result });
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

// Update
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name, description, modified_by, status } = req.body;

    await sequelize.query(
      `UPDATE master_department 
       SET department_name = ?, description = ?, 
           modified_by = ?, modified_date = NOW(), status = ?
       WHERE id = ?`,
      {
        replacements: [department_name, description, modified_by, status, id],
      }
    );
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await sequelize.query("DELETE FROM master_department WHERE id = ?", {
      replacements: [id],
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_DELETED);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWallet = async (userId, walletAmount) => {
  try {
    const [updatedRows] = await User.update(
      { wallet_amount: walletAmount },
      { where: { id: userId } }
    );
    return updatedRows > 0;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const deductWallet = async (userId, amountToDeduct) => {
  try {
    console.log(amountToDeduct, "amountToDeduct");
    if (user.wallet_amount < amountToDeduct) {
      throw new Error("Insufficient wallet balance");
    }

    await User.decrement("wallet_amount", {
      by: amountToDeduct,
      where: { id: userId },
    });

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const InsertWallet = async (userId, amountToInsert) => {
  try {
    console.log(amountToInsert, "amountToInsert");
    if (user.wallet_amount < amountToInsert) {
      throw new Error("Insufficient wallet balance");
    }

    await User.increment("wallet_amount", {
      by: amountToInsert,
      where: { id: userId },
    });

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const insertUserCreditNote = async (params) => {
  try {
    const currentDate = new Date();
    const insertParam = {
      user_id: params.user_id,
      booking_id: params.booking_id,
      booking_amount: params.booking_amount,
      cancellation_charge: params.cancellation_charge,
      credit_note_amount: params.credit_note_amount,
      credit_note_type: params.credit_note_type,
      created_by: params.created_by,
      created_date: currentDate,
      ip: params.ip,
    };
    console.log(insertParam, "insertParam");
    Object.keys(insertParam).forEach((key) => {
      if (insertParam[key] === undefined) {
        delete insertParam[key];
      }
    });

    const fields = Object.keys(insertParam).join(", ");
    const values = Object.values(insertParam);
    const placeholders = values.map(() => "?").join(", ");

    const sql = `
      INSERT INTO user_credit_note (${fields}) 
      VALUES (${placeholders})
    `;
    let result = await sequelize.query(sql, {
      replacements: values,
      type: sequelize.QueryTypes.INSERT,
    });

    const insertedId = result[0]?.insertId || result[0]?.[0] || result[0];
    return insertedId;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addUser = async (req, res) => {
  const {
    company_id = null,
    user_type_id = null,
    first_name: firstName = null,
    last_name: lastName = null,
    mobile = null,
    email = null,
    gender = null,
    password = null,
    created_date = new Date().toISOString().slice(0, 19).replace("T", " "),
    prefix_contact_no = "+91",
    nationality = null,
    signup_status = 1,
    user_grade = 1,
    // created_by = null,
    city_id = null,
    state_id = null,
    country_id = null,
    pref_city = null,
    module_ids,
    department,
  } = req.body;
  console.log({ user_type_id });
  let created_by = req.user.id;
  let parent_id = req.user.id;
  const initial = firstName?.slice(0, 2)?.toUpperCase() || "US";
  const username =
    initial + Math.random().toString(36).substring(2, 6).toUpperCase();
  let referral_key =
    initial + Math.random().toString(36).substring(2, 6).toUpperCase();

  const t = await sequelize.transaction();

  try {
    // Insert into user
    await sequelize.query(
      `INSERT INTO user (
        company_id, user_type_id, parent_id, first_name, last_name, 
        mobile, email, gender, password, created_date, 
        mobile_prefix, nationality, signup_status, user_grade, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, MD5(?), ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          company_id,
          user_type_id,
          parent_id,
          firstName,
          lastName,
          mobile,
          email,
          gender,
          password,
          created_date,
          prefix_contact_no,
          nationality,
          signup_status,
          user_grade,
          created_by,
        ],
        transaction: t,
      }
    );

    // Get last inserted ID
    const [[{ insertId }]] = await sequelize.query(
      `SELECT LAST_INSERT_ID() AS insertId`,
      { transaction: t }
    );

    const userId = insertId;
    console.log({ userId, country_id, state_id, city_id });
    // Insert user_info
    await sequelize.query(
      `INSERT INTO user_info (user_id, country_id, state_id, city_id)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [
          userId,
          country_id || null,
          state_id || null,
          city_id || null,
        ],
        transaction: t,
      }
    );

    // Insert driver if applicable
    if ([3, 4].includes(user_type_id)) {
      await sequelize.query(
        `INSERT INTO driver (user_id, created_date)
         VALUES (?, ?)`,
        {
          replacements: [userId, created_date],
          transaction: t,
        }
      );
    }

    // Insert user_pref_drive_city if provided
    if (pref_city) {
      const cityIds = pref_city
        // .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      for (const cityId of cityIds) {
        await sequelize.query(
          `INSERT INTO user_pref_drive_city (user_id, city_id, created_date, created_by)
           VALUES (?, ?, ?, ?)`,
          {
            replacements: [userId, cityId, created_date, created_by],
            transaction: t,
          }
        );
      }
    }

    // Update referral_key and username
    await sequelize.query(
      `UPDATE user
       SET referral_key = ?, username = ?
       WHERE id = ?`,
      {
        replacements: [referral_key, username, userId],
        transaction: t,
      }
    );
    let assignmentData = {
      user_id: userId,
      role_id: user_type_id,
      department_id: department,
      created_by: req.user.id,
    };

    let roleassigned = await createUserAssignRoleInternal(assignmentData);
    console.log({ roleassigned });
    if (module_ids)
      addAssignModule({
        assign_role_id: roleassigned?.data?.assign_role_id,
        moduleids: module_ids,
        created_by: req.user.id,
        created_date: Date.now(),
      });

    await t.commit();

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: { user_id: userId },
    });
  } catch (err) {
    await t.rollback();

    // Handle duplicate email error (MySQL error code 1062)
    if (
      err.original?.code === "ER_DUP_ENTRY" &&
      err.original.message.includes("email")
    ) {
      return res.status(409).json({
        status: "failed",
        message: "Email already exists",
      });
    }
    console.error("Error in addUser:", err);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    let sql = `
      SELECT 
        u.id as user_id,
        u.parent_id as parent_id,
        u.user_type_id,
        u.user_grade,
        role.RoleName as user_type,
        u.referral_key,
        CONCAT(u.first_name,' ',u.last_name) as name,
        u.email,
        u.mobile,
        u.gender,
        ui.father_name,
        u.signup_status,
        ui.state_id,
        ui.country_id,
        ui.city_id,
        mct.name as city_name,
        mct.state_name as state_name,
        mct.country_name as country_name,
        u.is_active,
        active.status,
        active.status_class,
        company.company_name,
        company.company_address,
        company.pincode,
        company.contact_person_name,
        company.email as company_email,
        u.login_status,
        urm.staff_id as relation_manager_id,
        CONCAT(staff.first_name,' ',staff.last_name) as staff_name,
        staff.email as staff_email,
        staff.mobile as staff_mobile,
        DATE_FORMAT(u.created_date,'%Y-%m-%d %h:%i:%s') as created_date,
        signup_status.status_name,
        signup_status.signup_status_class,
        vehiclemodel.name as vehicle_name,
        vehiclemodel.image as vehicle_image,
        vehiclemaster.vehicle_no,
        vehiclemaster.model,
        GROUP_CONCAT(package.name) as package,
        COUNT(bk.user_id) AS booking,
        GROUP_CONCAT(DISTINCT pkg.name SEPARATOR ', ') as duty_type,
        u.active_by,
        CONCAT(u1.first_name,' ',u1.last_name) as activate_by
      FROM user as u
      LEFT JOIN user_info as ui ON u.id=ui.user_id
      LEFT JOIN user as u1 ON u.active_by=u1.id
      LEFT JOIN master_country as mc ON mc.id=ui.country_id
      LEFT JOIN master_state as ms ON ms.id=ui.state_id
      LEFT JOIN master_city as mct ON mct.id=ui.city_id AND mct.state_id=ui.state_id AND mct.country_id=ui.country_id
      LEFT JOIN user_role as role ON u.user_type_id = role.Role_ID
      LEFT JOIN company ON u.id = company.user_id
      LEFT JOIN user_vehicle_mapping as vehicle ON u.id = vehicle.user_id
      LEFT JOIN vehicle_master as vehiclemaster ON vehicle.vehicle_master_id = vehiclemaster.vehicle_master_id
      LEFT JOIN master_vehicle_model as vehiclemodel ON vehiclemaster.id = vehiclemodel.id
      LEFT JOIN active ON u.is_active = active.status_id
      LEFT JOIN user_relation_manager as urm ON u.id = urm.user_id
      LEFT JOIN user as staff ON urm.staff_id = staff.id
      LEFT JOIN signup_status ON u.signup_status = signup_status.signup_status_id
      LEFT JOIN user_duty_pref as dutypref ON (u.parent_id = dutypref.user_id OR u.id = dutypref.user_id)
      LEFT JOIN master_package as package ON dutypref.package_id = package.id
      LEFT JOIN booking AS bk ON u.id = bk.user_id
      LEFT JOIN master_package as pkg ON dutypref.package_id = pkg.id
      WHERE 1=1
    `;

    const replacements = {};

    if (req.body.user_id) {
      sql += " AND u.id = :user_id";
      replacements.user_id = req.body.user_id;
    }
    if (
      req.body.login_usert_type_id &&
      req.body.login_usert_type_id !== "10" &&
      req.body.login_usert_type_id !== "11"
    ) {
      sql += " AND u.parent_id = :login_user_id";
      replacements.login_user_id = req.body.login_user_id;
    }
    if (req.body.user_type_id) {
      sql += " AND u.user_type_id IN(" + req.body.user_type_id + ")";
    }
    if (req.body.company_id) {
      sql += " AND u.company_id = :company_id";
      replacements.company_id = req.body.company_id;
    }
    if (req.body.parent_id) {
      sql += " AND u.parent_id = :parent_id";
      replacements.parent_id = req.body.parent_id;
    }
    if (req.body.first_name) {
      sql += " AND u.first_name LIKE :first_name";
      replacements.first_name = req.body.first_name + "%";
    }
    if (req.body.mobile) {
      sql += " AND u.mobile = :mobile";
      replacements.mobile = req.body.mobile;
    }
    if (req.body.email) {
      sql += " AND u.email = :email";
      replacements.email = req.body.email;
    }
    if (req.body.country_id) {
      sql += " AND ui.country_id = :country_id";
      replacements.country_id = req.body.country_id;
    }
    if (req.body.state_id) {
      sql += " AND ui.state_id = :state_id";
      replacements.state_id = req.body.state_id;
    }
    if (req.body.city_id) {
      sql += " AND ui.city_id = :city_id";
      replacements.city_id = req.body.city_id;
    }
    if (req.body.status) {
      sql += " AND u.is_active = :status";
      replacements.status = req.body.status;
    }
    if (req.body.company) {
      sql += " AND company.company_name = :company";
      replacements.company = req.body.company;
    }
    if (req.body.searchValue) {
      sql += req.body.searchValue;
    }

    sql += " GROUP BY u.id";

    if (req.body.sort_column && req.body.sort_order) {
      sql += " ORDER BY " + req.body.sort_column + " " + req.body.sort_order;
    } else {
      sql += " ORDER BY u.id DESC";
    }

    if (req.body.limit && req.body.offset) {
      sql += " LIMIT :offset, :limit";
      replacements.offset = Number(req.body.offset);
      replacements.limit = Number(req.body.limit);
    }
    console.log({ req: redisClient.body }, "{{{{{{{{{{{{{{{{{");

    const users = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    // Replace nulls with empty string
    const finaluserArr = users.map((user) => {
      Object.keys(user).forEach((key) => {
        if (user[key] === null) user[key] = "";
      });
      return user;
    });

    return res.status(200).json({ status: "success", data: finaluserArr });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "failed", message: err.message });
  }
};

// export const addUsero = async (req, res) => {
//   const {
//     company_id = null,
//     user_type_id = null,
//     parent_id = null,
//     first_name: firstName = null,
//     last_name: lastName = null,
//     mobile = null,
//     email = null,
//     gender = null,
//     password = null,
//     created_date = new Date().toISOString().slice(0, 19).replace('T', ' '),
//     prefix_contact_no = '+91', // default prefix
//     nationality = null,
//     signup_status = 1, // default status
//     user_grade = 1, // default grade
//     created_by = null,
//     city_id = null,
//     state_id = null,
//     country_id = null,
//     pref_city = null,
//   } = req.body;

//   // Generate referral key and username
//   const refer_amount = 0;
//   let referral_key = firstName?.slice(0, 2)?.toUpperCase() || 'US';
//   const initial = firstName?.slice(0, 2)?.toUpperCase() || 'US';
//   const code = Math.random().toString(36).substring(2, 6).toUpperCase();
//   const user_name = initial.concat(code);

//   try {
//     // Insert user with all required fields
//     const userResult = await sequelize.query(
//       `INSERT INTO user (
//         company_id, user_type_id, parent_id, first_name, last_name,
//         mobile, email, gender, password, created_date,
//         mobile_prefix, nationality, signup_status, user_grade, created_by
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, MD5(?), ?, ?, ?, ?, ?, ?)`,
//       {
//         replacements: [
//           company_id,
//           user_type_id,
//           parent_id,
//           firstName,
//           lastName,
//           mobile,
//           email,
//           gender,
//           password,
//           created_date,
//           prefix_contact_no,
//           nationality,
//           signup_status,
//           user_grade,
//           created_by,
//         ],
//             type: sequelize.QueryTypes.INSERT,

//       }
//     );

// const lastInsertId = userResult[0][0].id;
// console.log({lastInsertId},{userResult})
//     // Generate final referral key
//     referral_key = referral_key.concat(Math.random().toString(36).substring(2, 6).toUpperCase());

//     // Insert user_info
//   await sequelize.query(
//   `INSERT INTO user_info (
//     user_id, country_id, state_id, city_id
//   ) VALUES (?, ?, ?, ?)`,
//   {
//     replacements: [
//       lastInsertId,
//       country_id || null,  // Fallback to null if undefined
//       state_id || null,    // Fallback to null if undefined
//       city_id || null      // Fallback to null if undefined
//     ],
//   }
// )

//     // Insert driver if needed
//     if (user_type_id == 3 || user_type_id == 4) {
//       await sequelize.query(
//         `INSERT INTO driver (
//           user_id, created_date
//         ) VALUES (?, ?)`,
//         {
//           replacements: [lastInsertId, created_date],
//         }
//       );
//     }

//     // Insert user_pref_drive_city if pref_city provided
//     if (pref_city) {
//       const prefCityArr = pref_city.split(",").filter(Boolean);
//       if (prefCityArr.length > 0) {
//         await Promise.all(
//           prefCityArr.map(cityId =>
//             sequelize.query(
//               `INSERT INTO user_pref_drive_city (
//                 user_id, city_id, created_date, created_by
//               ) VALUES (?, ?, ?, ?)`,
//               {
//                 replacements: [lastInsertId, cityId, created_date, created_by],
//               }
//             )
//           )
//         );
//       }
//     }

//     // Update referral_key and username
//     await sequelize.query(
//       `UPDATE user
//        SET referral_key = ?, username = ?
//       `UPDATE user
//        SET referral_key = ?, username = ?
//        WHERE id = ?`,
//       {
//         replacements: [referral_key, user_name, lastInsertId],
//       }
//     );

//     return res.json({
//       status: "success",
//       message: "User registered successfully",
//       data: { user_id: lastInsertId },
//       user_id: lastInsertId,
//     });
//   } catch (err) {
//     console.error("Error in addUser:", err);
//     return res.status(500).json({
//       status: "failed",
//       message: `Error: ${err.message}`,
//     });
//   }
// };

export const updateBookingMappingDetail = async (req, res) => {
  const { auto_id, user_id, booking_type_mode, ip, status, modified_by } =
    req.body;

  console.log(req.body);

  if (!auto_id) {
    return errorResponse(
      res,
      "Missing auto_id",
      "auto_id is required to update booking mapping.",
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const updateValues = {
      user_id,
      master_package_mode_id: Number(booking_type_mode),
      ip,
      status,
      modified_by,
    };

    console.log(updateValues);

    // Remove undefined or empty string fields
    Object.keys(updateValues).forEach((key) => {
      if (updateValues[key] === undefined || updateValues[key] === "") {
        delete updateValues[key];
      }
    });

    const affectedRows = await sequelize.query(
      `UPDATE user_booking_type_mapping SET ${Object.keys(updateValues)
        .map((key) => `${key} = :${key}`)
        .join(", ")} WHERE id = :auto_id`,
      {
        replacements: {
          ...updateValues,
          auto_id,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    console.log(affectedRows[1]);

    if (affectedRows[1] > 0) {
      return successResponse(res, "Data updated successfully", {
        status: "success",
        message: "Data updated successfully",
      });
    } else {
      return errorResponse(
        res,
        "No rows updated",
        "Something went wrong",
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    console.error("Error updating booking mapping detail:", err);
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const addBookingTypeMappingDetail = async (req, res) => {
  const {
    user_id,
    country_id,
    city_id,
    city_name,
    state_id,
    mapping_category,
    master_package_id,
    package_name,
    package_mode,
    master_package_mode_id,
    vehicle_type,
    status,
    ip,
  } = req.body;

  try {
    let user_id = req.user_id;
    const insertData = {
      user_id: Number(req.user.id) || null,
      country_id,
      state_id: Number(state_id) || null,
      city_id: Number(city_id) || null,
      mapping_category,
      master_package_id: Number(master_package_id) || null,
      master_package_mode_id: Number(master_package_mode_id),
      vehicle_type,
      status,
      created_by: req.user.id,
      modified_by: req.user.id,
      ip: req.ip,
    };

    console.log({ insertData });
    Object.keys(insertData).forEach((key) => {
      if (
        insertData[key] === undefined ||
        insertData[key] === "" ||
        insertData[key] === 0
      ) {
        delete insertData[key];
      }
    });
    const exist = await userBookingTypeMapping.findOne({ where: insertData });
    console.log({ exist });
    if (exist) {
      return errorResponse(
        res,
        "Mapping already exist",
        "Mapping already exist",
        STATUS_CODE.BAD_REQUEST
      );
    }
    // const result = await userBookingTypeMapping.create(insertData);
    return successResponse(res, MESSAGES.GENERAL.DATA_ADDED, {
      insertId: result.id,
    });
  } catch (error) {
    console.error("Error inserting booking mapping:", error);
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateDepartmentStatus = async (req, res) => {
  const { status, id } = req.body;
  const userId = req?.user?.id ?? 0;

  try {
    const [result, metadata] = await sequelize.query(
      `UPDATE master_department 
       SET status = ?, modified_by = ?
       WHERE id = ?`,
      {
        replacements: [status, userId, id],
      }
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updatedRows: metadata,
    });
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getUserBookingCounts = async (req, res) => {
  try {
    const { user_id, user_type_id } = req.body;
    let sql = `
      SELECT  
        COUNT(CASE WHEN DATE(bpd.pickup_date) = CURDATE() THEN 1 END) AS current_booking,
        COUNT(CASE WHEN DATE(bpd.pickup_date) > CURDATE() THEN 1 END) AS future_booking,
        COUNT(CASE WHEN b.status = 11 THEN 1 END) AS completed_booking,
        COUNT(CASE WHEN DATE(bpd.pickup_date) < CURDATE() AND b.status = 1 THEN 1 END) AS pending_booking,
        COUNT(CASE WHEN b.status IN (10,20) THEN 1 END) AS cancelled_booking
      FROM booking b  
      LEFT JOIN booking_pickdrop_details bpd 
             ON b.booking_id = bpd.booking_id  
      WHERE 1=1
    `;

    if (typeof user_type_id !== "undefined") {
      if (user_type_id != 10 && user_type_id != 3) {
        sql += ` AND b.user_id = '${user_id}' `;
      }
      if (user_type_id == 3) {
        sql += ` AND b.driver_id = '${user_id}' `;
      }
    }

    const [results] = await sequelize.query(sql);

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      data: results[0],
    });
  } catch (err) {
    console.error("Error fetching booking counts:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GetAssignedModules

export const getAssignModuleByUserTypeId = async (req, res) => {
  try {
    let user_type_id = req.user.role; // from query param
    user_type_id = Number(user_type_id);

    if (!user_type_id || isNaN(user_type_id)) {
      return res
        .status(400)
        .json({ status: 201, message: "Usertype id is not a number" });
    }

    // Fetch all assigned modules for the user type
    const sql = `
      SELECT 
        um.usertype_id,
        um.is_read,
        um.is_write,
        um.is_delete,
        um.order_menu,
        mm.module_id,
        mm.module_name,
        mm.parent_id,
        mm.namespace,
        mm.controller,
        mm.action,
        mm.url,
        mm.icon_class,
        mm.menu_order,
        mm.status AS module_status
      FROM usertype_module um
      LEFT JOIN master_module_manager mm
        ON um.module_id = mm.module_id
      WHERE um.usertype_id = :user_type_id
        AND um.status = 1
      ORDER BY um.order_menu ASC, mm.menu_order ASC
    `;

    const modules = await sequelize.query(sql, {
      replacements: { user_type_id },
      type: QueryTypes.SELECT,
    });

    // Group modules by parent_id
    const parents = {};
    const children = {};

    modules.forEach((mod) => {
      if (!mod.parent_id || mod.parent_id === 0) {
        // parent module
        parents[mod.module_id] = { ...mod, children: [] };
      } else {
        // child module
        if (!children[mod.parent_id]) children[mod.parent_id] = [];
        children[mod.parent_id].push(mod);
      }
    });

    // Attach children to their parent
    Object.keys(children).forEach((parentId) => {
      if (parents[parentId]) {
        parents[parentId].children = children[parentId];
      } else {
        // optional: orphan children handling
        parents[parentId] = {
          module_id: Number(parentId),
          module_name: "Unknown",
          children: children[parentId],
        };
      }
    });

    const result = Object.values(parents);

    return res.json({
      status: 200,
      message: "Modules fetched successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Internal API to create a new user role assignment
 * No HTTP response, returns data directly
 */
export const createUserAssignRoleInternal = async (assignmentData) => {
  const transaction = await sequelize.transaction();

  try {
    const { user_id, role_id, department_id, created_by } = assignmentData;
    console.log({ assignmentData });
    // Validation
    if (!user_id || !role_id || !created_by) {
      await transaction.rollback();
      throw new Error("User ID, Role ID, and Created By are required fields");
    }

    // Check if user exists
    // const userExists = await User.findByPk(user_id, { transaction });
    // if (!userExists) {
    //   await transaction.rollback();
    //   throw new Error('User not found');
    // }

    // Check if user already has an active role assignment
    const existingAssignment = await UserAssignRole.findOne({
      where: {
        user_id,
        status: 1,
      },
      transaction,
    });

    if (existingAssignment) {
      await transaction.rollback();
      throw new Error("User already has an active role assignment");
    }

    // Create new role assignment
    const newAssignment = await UserAssignRole.create(
      {
        user_id,
        role_id,
        department_id: department_id || null,
        created_by,
        created_date: new Date(),
        status: 1,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    // Fetch the complete created record with associations
    const createdRecord = await UserAssignRole.findByPk(
      newAssignment.assign_role_id
    );

    return {
      success: true,
      message: "User role assignment created successfully",
      data: createdRecord,
    };
  } catch (error) {
    console.error("Error creating user role assignment internally:", error);
    await transaction.rollback();
    return {
      success: false,
      message: error.message || "Failed to create user role assignment",
      error: error.message,
    };
  }
};

export const bulkUpsertCards = async (req, res) => {
  try {
    const { cards, user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cards array is required and cannot be empty",
      });
    }

    // Enhanced validation
    const validationErrors = [];
    const processedCards = [];

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const {
        card_number,
        card_holder_name,
        payment_method = 0,
        expiry_date,
        cvv,
      } = card;

      // Check required fields
      if (!card_number || !card_holder_name || !expiry_date || !cvv) {
        validationErrors.push(`Card at index ${i}: Missing required fields`);
        continue;
      }

      // Validate card number length
      if (card_number.length < 12 || card_number.length > 20) {
        validationErrors.push(
          `Card at index ${i}: Invalid card number length ${card_number.length}`
        );
        continue;
      }

      // Validate CVV
      if (cvv.length < 3 || cvv.length > 4) {
        validationErrors.push(`Card at index ${i}: CVV must be 3 or 4 digits`);
        continue;
      }

      // Validate expiry date
      const expiry = new Date(expiry_date);
      if (isNaN(expiry.getTime())) {
        validationErrors.push(`Card at index ${i}: Invalid expiry date`);
        continue;
      }

      // Check if card is expired
      if (expiry < new Date()) {
        validationErrors.push(`Card at index ${i}: Card has expired`);
        continue;
      }

      processedCards.push({
        user_id: parseInt(user_id),
        card_number: card_number.replace(/\s/g, ""), // Remove spaces
        card_holder_name: card_holder_name.trim(),
        payment_method: [0, 1, "0", "1"].includes(payment_method)
          ? payment_method
          : 0,
        expiry_date: expiry,
        cvv,
      });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation errors occurred",
        errors: validationErrors,
        processedCount: processedCards.length,
      });
    }

    // Check for duplicate card numbers within the request for same user
    const cardNumbers = processedCards.map((card) => card.card_number);
    const duplicates = cardNumbers.filter(
      (number, index) => cardNumbers.indexOf(number) !== index
    );
    if (duplicates.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Duplicate card numbers found in the request",
        duplicates: [...new Set(duplicates)],
      });
    }

    // Perform bulk upsert - unique constraint on (user_id, card_number)
    const result = await CardDetails.bulkCreate(processedCards, {
      updateOnDuplicate: [
        "card_holder_name",
        "payment_method",
        "expiry_date",
        "cvv",
        "updated_at",
      ],
      validate: true,
      returning: true,
    });

    // Get statistics
    const existingCards = await CardDetails.findAll({
      where: {
        user_id: parseInt(user_id),
        card_number: {
          [Op.in]: processedCards.map((card) => card.card_number),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Bulk upsert completed successfully for user ${user_id}`,
      data: {
        user_id: parseInt(user_id),
        totalProcessed: processedCards.length,
        upsertedCount: result.length,
        existingCardsUpdated: existingCards.length,
        newCardsAdded: result.length - existingCards.length,
        cards: result,
      },
    });
  } catch (error) {
    console.error("Bulk upsert error:", error);

    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Data validation failed",
        errors: validationErrors,
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Duplicate card found. Each card must be unique per user.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during bulk upsert",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user's cards
export const getUserCards = async (req, res) => {
  try {
    const user_id = req.params.user_id || req.user.id;

    console.log("userId from the bank details", user_id);

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cards = await CardDetails.findAll({
      where: { user_id: parseInt(user_id) },
      order: [["created_at", "DESC"]],
    });

    console.log("cards", JSON.stringify(cards));
    res.status(200).json({
      success: true,
      data: {
        user_id: parseInt(user_id),
        total_cards: cards.length,
        cards,
      },
    });
  } catch (error) {
    console.error("Get user cards error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user cards",
    });
  }
};

export const updateCardDetail = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log(data);
  try {
    const findCard = await CardDetails.findOne({
      where: {
        id: id,
        user_id: req.user.id,
      },
    });
    // console.log(findCard);
    // return;
    if (findCard) {
      await findCard.update(data);
    }

    res.status(200).json({
      success: true,
      message: "Card Details Updated Succesfully!",
      data: findCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

// Delete user's card
export const deleteUserCard = async (req, res) => {
  try {
    const { user_id, card_id } = req.params;

    const result = await CardDetails.destroy({
      where: {
        id: parseInt(card_id),
        user_id: parseInt(user_id),
      },
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Card not found or does not belong to user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (error) {
    console.error("Delete card error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting card",
    });
  }
};

// Get all user info with filters

export const getUserInfo = async (req, res) => {
  console.log("Fetching user info with filters");
  try {
    const {
      user_id,
      cityId,
      stateId,
      countryId,
      gender,
      kycType,
      hasKyc,
      search,
      page = 1,
      limit = 10,
      sortBy = "created_on",
      sortOrder = "DESC",
    } = req.params;

    // Build where clause
    const whereClause = {};

    // Exact match filters
    if (user_id) whereClause.user_id = user_id;
    if (cityId) whereClause.city_id = cityId;
    if (stateId) whereClause.state_id = stateId;
    if (countryId) whereClause.country_id = countryId;
    if (gender) whereClause.gender = gender;
    if (kycType) whereClause.kyc_type = kycType;

    // Boolean filter for KYC
    if (hasKyc === "true") {
      whereClause.kyc = { [Op.ne]: null };
    } else if (hasKyc === "false") {
      whereClause.kyc = null;
    }

    // Search across multiple fields
    if (search) {
      whereClause[Op.or] = [
        { address: { [Op.like]: `%${search}%` } },
        { address2: { [Op.like]: `%${search}%` } },
        { alternate_email: { [Op.like]: `%${search}%` } },
        { father_name: { [Op.like]: `%${search}%` } },
        { gst_registration_number: { [Op.like]: `%${search}%` } },
        { pincode: { [Op.like]: `%${search}%` } },
      ];
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Execute query with JOIN but flattened result
    console.log({ whereClause });

    const { count, rows } = await UserInfo.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "first_name",
            "last_name",
            "email",
            "mobile",
            "mobile_prefix",
            "username",
            "user_type_id",
            "is_active",
            "email_verified",
            "mobile_verfication",
            "gender",
            "wallet_amount",
            "wallet_point",
            "referral_key",
          ],
          required: false,
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      raw: false, // Keep as instances to manipulate
    });

    // Transform the data to keep consistent structure
    const transformedData = rows.map((item) => {
      const userInfo = item.get({ plain: true });
      const userData = userInfo.user || {};
      console.log({ userData });
      // Return flattened object with user fields directly in the main object
      return {
        // UserInfo fields
        ...userInfo,
        // User fields (flattened)
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        mobile: userData.mobile,
        mobile_prefix: userData.mobile_prefix,
        username: userData.username,
        user_type_id: userData.user_type_id,
        is_active: userData.is_active,
        email_verified: userData.email_verified,
        mobile_verfication: userData.mobile_verfication,
        user_gender: userData.gender, // Renamed to avoid conflict with user_info gender
        wallet_amount: userData.wallet_amount,
        wallet_point: userData.wallet_point,
        referral_key: userData.referral_key,
        // Remove the nested user object
        user: undefined,
      };
    });

    // Remove undefined properties
    const cleanData = transformedData.map((item) => {
      const cleaned = { ...item };
      delete cleaned.user;
      return cleaned;
    });

    // Response with pagination info
    res.json({
      success: true,
      data: cleanData,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user information",
      error: error.message,
    });
  }
};
export const updateUserInfoByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    let updateData = req.body;
    updateData = removeEmptyValues(updateData);
    // Find the user info record by user_id
    const userInfo = await UserInfo.findOne({
      where: { user_id: userId },
    });
    console.log({ userInfo });
    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "User information not found for this user ID",
      });
    }

    // Remove user_id from update data to prevent modification
    delete updateData.user_id;

    // Update the record
    const updatedUserInfo = await userInfo.update(updateData);
    console.log({ updatedUserInfo });
    res.json({
      success: true,
      message: "User information updated successfully",
      data: updatedUserInfo,
    });
  } catch (error) {
    console.error("Update user info by user ID error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user information",
      error: error.message,
    });
  }
};
export const editUser = async (req, res) => {
  try {
    const {
      id,
      first_name,
      last_name,
      email,
      mobile_prefix,
      mobile,
      gender,
      father_name,
      landline,
      alt_mobile,
      alt_email,
      dob,
      address,
      role,
      state,
      city,
      pincode,
      department,
      kyc_type,
      kyc_number,
      username,
      referral_key,
      email_verified,
      user_grade,
      phone_verified,
    } = req.body;

    // Find the user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check for duplicate email if email is being updated
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Check for duplicate mobile if mobile is being updated
    if (mobile && mobile !== user.mobile) {
      const existingUser = await User.findOne({
        where: {
          mobile,
          id: { [Op.ne]: id },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
    }

    // Prepare update data
    const updateData = {};

    // User table fields
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (mobile_prefix !== undefined) updateData.mobile_prefix = mobile_prefix;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (gender !== undefined) updateData.gender = gender;
    if (username !== undefined) updateData.username = username;
    if (referral_key !== undefined) updateData.referral_key = referral_key;
    if (role !== undefined) updateData.user_type_id = role;
    if (user_grade !== undefined) updateData.user_grade = user_grade;

    // Handle boolean conversions
    if (email_verified !== undefined) {
      updateData.email_verified =
        email_verified === "true" || email_verified === true;
    }
    if (phone_verified !== undefined) {
      updateData.mobile_verfication =
        phone_verified === "true" || phone_verified === true;
      updateData.phone_verified =
        phone_verified === "true" || phone_verified === true;
    }

    // Profile fields (if stored in user table)
    if (father_name !== undefined) updateData.father_name = father_name;
    if (landline !== undefined) updateData.landline_number = landline;
    if (alt_mobile !== undefined) updateData.alternate_mobile = alt_mobile;
    if (alt_email !== undefined) updateData.alternate_email = alt_email;
    if (dob !== undefined) updateData.dob = dob;
    if (address !== undefined) updateData.address = address;
    if (state !== undefined) updateData.state_id = state;
    if (city !== undefined) updateData.city_id = city;
    if (pincode !== undefined) updateData.pincode = pincode;
    if (department !== undefined) updateData.department = department;
    if (kyc_type !== undefined) updateData.kyc_type = kyc_type;
    if (kyc_number !== undefined) updateData.kyc = kyc_number;

    // Update user record
    const [affectedRows] = await User.update(updateData, {
      where: { id },
      individualHooks: true,
    });

    // if (affectedRows === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Failed to update user profile"
    //   });
    // }

    // Fetch updated user data
    const updatedUser = await User.findByPk(id);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const removeEmptyValues = (obj) => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach((key) => {
    if (
      cleaned[key] === undefined ||
      cleaned[key] === null ||
      cleaned[key] === ""
    ) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

export const createOrUpdateUserSignature = async (req, res) => {
  try {
    const { user_id, signature, ip } = req.body;
    let created_by = req.user.id;
    let modified_by = req.user.id;
    // Validation
    if (!user_id || !signature || !created_by || !modified_by || !ip) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: user_id, signature, created_by, modified_by, ip",
      });
    }

    // Check if signature already exists for this user
    const existingSignature = await UserSignature.findOne({
      where: { user_id },
    });

    let result;

    if (existingSignature) {
      // Update existing signature
      result = await UserSignature.update(
        {
          signature,
          modified_by,
          ip,
          modified_date: new Date(),
        },
        {
          where: { user_id },
          returning: true,
        }
      );

      const updatedSignature = await UserSignature.findOne({
        where: { user_id },
      });

      return res.status(200).json({
        success: true,
        message: "Signature updated successfully",
        data: updatedSignature,
      });
    } else {
      // Create new signature
      result = await UserSignature.create({
        user_id,
        signature,
        created_by,
        modified_by,
        ip,
        created_date: new Date(),
        modified_date: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: "Signature created successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error("Error creating/updating user signature:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getUserSignature = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Signature ID is required",
      });
    }

    const userSignature = await UserSignature.findOne({ user_id: id });

    if (!userSignature) {
      return res.status(404).json({
        success: false,
        message: "Signature not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: userSignature,
    });
  } catch (error) {
    console.error("Error fetching specific user signature:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// export const getDutyInfo=async(req,res)=>{
//   const {user_id}= req.body
//   const sql = `
//   SELECT
//       udp.user_duty_id,
//       udp.package_id AS master_package_id,
//       mp.name AS master_package_name,
//       mp.icon AS master_package_icon,
//       mp.image AS master_package_image
//   FROM user_duty_pref AS udp
//   JOIN master_package AS mp
//       ON udp.package_id = mp.id
//   WHERE udp.user_id = ${user_id}
//     AND udp.status = 1
// `;

// const userDuty = await sequelize.query(sql);

// const citysql = `
//   SELECT
//       updc.user_drive_city_id,
//       updc.user_id,
//       updc.city_id,
//       mc.name AS city_name,
//       mc.country_name,
//       mc.latitude,
//       mc.longitude,
//       mc.state_name,
//       mc.flag_icon
//   FROM user_pref_drive_city AS updc
//   JOIN master_city AS mc
//       ON updc.city_id = mc.id
//   WHERE updc.user_id = ${user_id}
//     AND updc.status = 1
//     AND mc.status = 1
// `;

// const prefCity = await sequelize.query(citysql);

// const shiftsql = `
//   SELECT
//       uwm.user_workingshift_id,
//       uwm.user_id,
//       uwm.working_shift_id,
//       mws.shift,
//       mws.shift_time
//   FROM user_workingshift_mapping AS uwm
//   JOIN master_working_shift AS mws
//       ON uwm.working_shift_id = mws.working_shift_id
//   WHERE uwm.user_id = ${user_id}
//     AND uwm.status = 1
//     AND mws.status = 1
// `;

// const userShift = await sequelize.query(shiftsql);

// const paymentsql = `
//   SELECT
//       upt.user_payment_id,
//       upt.user_id,
//       upt.payment_type_id,
//       pt.pay_type_mode
//   FROM user_payment_type AS upt
//   JOIN payment_type AS pt
//       ON upt.payment_type_id = pt.payment_type_id
//   WHERE upt.user_id = ${user_id}
//     AND upt.status = 1
//     AND pt.status = '1'
// `;

// const userPayment = await sequelize.query(paymentsql);

// const langsql = `
//   SELECT
//       ul.user_lang_id,
//       ul.user_id,
//       ul.language_id,
//       ul.language_type,
//       ml.language_name
//   FROM user_language AS ul
//   JOIN master_language AS ml
//       ON ul.language_id = ml.language_id
//   WHERE ul.user_id = ${user_id}
//     AND ul.status = 1
//     AND ml.status = 1
// `;

// const userLang = await sequelize.query(langsql);

// const weekoffsql = `
//   SELECT
//       uw.user_weekoff_id,
//       uw.user_id,
//       uw.week_id AS day_id,
//       mw.name AS day_name
//   FROM user_weekoff_mapping AS uw
//   JOIN master_week_days AS mw
//       ON uw.week_id = mw.id
//   WHERE uw.user_id = ${user_id}
//     AND uw.status = 1
//     AND mw.id IS NOT NULL
// `;

// const userWeekOff = await sequelize.query(weekoffsql);
// }

export const getDutyInfo = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "user_id is required" });
  }

  try {
    // 1. User Duty
    const dutySql = `
      SELECT 
        udp.user_duty_id,
        udp.package_id AS master_package_id,
        mp.name AS master_package_name,
        mp.icon AS master_package_icon,
        mp.image AS master_package_image
      FROM user_duty_pref AS udp
      JOIN master_package AS mp ON udp.package_id = mp.id
      WHERE udp.user_id = ${user_id} AND udp.status = 1
    `;
    const [userDuty] = await sequelize.query(dutySql);

    // 2. Preferred Cities
    const citySql = `
      SELECT 
        updc.user_drive_city_id,
        updc.user_id,
        updc.city_id,
        mc.name AS city_name,
        mc.country_name,
        mc.latitude,
        mc.longitude,
        mc.state_name,
        mc.flag_icon
      FROM user_pref_drive_city AS updc
      JOIN master_city AS mc ON updc.city_id = mc.id
      WHERE updc.user_id = ${user_id} AND updc.status = 1 AND mc.status = 1
    `;
    const [prefCity] = await sequelize.query(citySql);

    // 3. User Shifts
    const shiftSql = `
      SELECT 
        uwm.user_workingshift_id,
        uwm.user_id,
        uwm.working_shift_id,
        mws.shift,
        mws.shift_time
      FROM user_workingshift_mapping AS uwm
      JOIN master_working_shift AS mws ON uwm.working_shift_id = mws.working_shift_id
      WHERE uwm.user_id = ${user_id} AND uwm.status = 1 AND mws.status = 1
    `;
    const [userShift] = await sequelize.query(shiftSql);

    // 4. Payment Types
    const paymentSql = `
      SELECT 
        upt.user_payment_id,
        upt.user_id,
        upt.payment_type_id,
        pt.pay_type_mode
      FROM user_payment_type AS upt
      JOIN payment_type AS pt ON upt.payment_type_id = pt.payment_type_id
      WHERE upt.user_id = ${user_id} AND upt.status = 1 AND pt.status = '1'
    `;
    const [userPayment] = await sequelize.query(paymentSql);

    // 5. Languages
    const langSql = `
      SELECT 
        ul.user_lang_id,
        ul.user_id,
        ul.language_id,
        ul.language_type,
        ml.language_name
      FROM user_language AS ul
      JOIN master_language AS ml ON ul.language_id = ml.language_id
      WHERE ul.user_id = ${user_id} AND ul.status = 1 AND ml.status = 1
    `;
    const [userLang] = await sequelize.query(langSql);

    // 6. Week Off
    const weekOffSql = `
      SELECT 
        uw.user_weekoff_id,
        uw.user_id,
        uw.week_id AS day_id,
        mw.name AS day_name
      FROM user_weekoff_mapping AS uw
      JOIN master_week_days AS mw ON uw.week_id = mw.id
      WHERE uw.user_id = ${user_id} AND uw.status = 1 AND mw.id IS NOT NULL
    `;
    const [userWeekOff] = await sequelize.query(weekOffSql);

    // Send response
    return res.status(200).json({
      success: true,
      data: {
        duty: userDuty,
        preferredCities: prefCity,
        shifts: userShift,
        payments: userPayment,
        languages: userLang,
        weekOffs: userWeekOff,
      },
    });
  } catch (error) {
    console.error("Error fetching duty info:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// export const upsertDutyInfo = async (req, res) => {
//   const { user_id } = req.body || req.params;
//   const { duty, preferredCities, shifts, payments, languages, weekOffs } =
//     req.body;

//   if (!user_id) {
//     return res
//       .status(400)
//       .json({ success: false, message: "user_id is required" });
//   }

//   const transaction = await sequelize.transaction();

//   try {
//     // Helper function for upsert operations
//     const upsertRecords = async (Model, records, uniqueFields, transaction) => {
//       if (!records || !Array.isArray(records)) return [];

//       const results = [];

//       for (const record of records) {
//         const whereCondition = { user_id };
//         uniqueFields.forEach((field) => {
//           if (record[field] !== undefined) {
//             whereCondition[field] = record[field];
//           }
//         });

//         // Check if record exists
//         const existingRecord = await Model.findOne({
//           where: whereCondition,
//           transaction,
//         });

//         if (existingRecord) {
//           // Update existing record
//           const updatedRecord = await Model.update(
//             {
//               ...record,
//               modified_date: new Date(),
//               modified_by: req.user?.id || null, // Assuming you have user info in req.user
//             },
//             {
//               where: whereCondition,
//               transaction,
//               returning: true,
//             }
//           );
//           results.push(updatedRecord);
//         } else {
//           // Create new record
//           const newRecord = await Model.create(
//             {
//               ...record,
//               user_id: parseInt(user_id),
//               created_date: new Date(),
//               created_by: req.user?.id || null,
//               modified_by: req.user?.id || null,
//             },
//             { transaction }
//           );
//           results.push(newRecord);
//         }
//       }
//       console.log("results are", JSON.stringify(results));
//       return results;
//     };

//     // 1. Upsert Duty Preferences
//     const dutyResults = await upsertRecords(
//       UserDutyPreference,
//       duty,
//       ["package_id"],
//       transaction
//     );
//     console.log({ dutyResults });
//     // 2. Upsert Preferred Cities
//     const cityResults = await upsertRecords(
//       UserPrefDriveCity,
//       preferredCities,
//       ["city_id"],
//       transaction
//     );

//     console.log("cityResults", JSON.stringify(cityResults));

//     // 3. Upsert Working Shifts
//     const shiftResults = await upsertRecords(
//       UserWorkingShiftMapping,
//       shifts,
//       ["working_shift_id"],
//       transaction
//     );

//     console.log("shift result", JSON.stringify(shiftResults))

//     // 4. Upsert Payment Types
//     const paymentResults = await upsertRecords(
//       UserPaymentType,
//       payments,
//       ["payment_type_id"],
//       transaction
//     );

//     // 5. Upsert Languages (unique by language_id and language_type)
//     const languageResults = await upsertRecords(
//       UserLanguage,
//       languages,
//       ["language_id", "language_type"],
//       transaction
//     );

//     console.log("language Result", JSON.stringify(languageResults))

//     // 6. Upsert Week Offs
//     const weekOffResults = await upsertRecords(
//       UserWeekOffMapping,
//       weekOffs,
//       ["week_id"],
//       transaction
//     );

//     console.log("week of result", JSON.stringify(weekOffResults))

//     // Commit transaction
//     await transaction.commit();

//     return res.status(200).json({
//       success: true,
//       message: "Duty information updated successfully",
//       data: {
//         duty: dutyResults,
//         preferredCities: cityResults,
//         shifts: shiftResults,
//         payments: paymentResults,
//         languages: languageResults,
//         weekOffs: weekOffResults,
//       },
//     });
//   } catch (error) {
//     // Rollback transaction in case of error
//     await transaction.rollback();

//     console.error("Error upserting duty info:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// export const upsertDutyInfo = async (req, res) => {
//   const user_id = req.params.user_id || req.body.user_id;
//   const { duty, preferredCities, shifts, payments, languages, weekOffs } = req.body;
//
//   if (!user_id) {
//     return res.status(400).json({
//       success: false,
//       message: "user_id is required",
//     });
//   }
//
//   const transaction = await sequelize.transaction();
//
//   try {
//     // Remove duplicate records based on unique fields
//     const deduplicate = (records, uniqueFields) => {
//       if (!Array.isArray(records)) return [];
//       const map = new Map();
//       for (const record of records) {
//         const key = uniqueFields.map((f) => record[f]).join("_");
//         map.set(key, record);
//       }
//       return Array.from(map.values());
//     };
//
//     // Reusable upsert helper
//     const upsertRecords = async (Model, records, uniqueFields, transaction) => {
//       if (!records || !Array.isArray(records)) return [];
//       const deduped = deduplicate(records, uniqueFields);
//       const results = [];
//
//       for (const record of deduped) {
//         const whereCondition = { user_id };
//         uniqueFields.forEach((field) => {
//           if (record[field] !== undefined) whereCondition[field] = record[field];
//         });
//
//         const existing = await Model.findOne({ where: whereCondition, transaction });
//
//         if (existing) {
//           await Model.update(
//             {
//               ...record,
//               status: 1, // ✅ ensure record is active
//               modified_date: new Date(),
//               modified_by: req.user?.id || null,
//             },
//             { where: whereCondition, transaction }
//           );
//           const updatedRecord = await Model.findOne({ where: whereCondition, transaction });
//           results.push(updatedRecord);
//         } else {
//           const newRecord = await Model.create(
//             {
//               ...record,
//               user_id: parseInt(user_id),
//               status: 1, // ✅ new records active
//               created_date: new Date(),
//               created_by: req.user?.id || null,
//               modified_by: req.user?.id || null,
//             },
//             { transaction }
//           );
//           results.push(newRecord);
//         }
//       }
//
//       return results;
//     };
//
//     // Perform upserts
//     const dutyResults = await upsertRecords(UserDutyPreference, duty, ["package_id"], transaction);
//     const cityResults = await upsertRecords(UserPrefDriveCity, preferredCities, ["city_id"], transaction);
//     const shiftResults = await upsertRecords(UserWorkingShiftMapping, shifts, ["working_shift_id"], transaction);
//     const paymentResults = await upsertRecords(UserPaymentType, payments, ["payment_type_id"], transaction);
//     const languageResults = await upsertRecords(UserLanguage, languages, ["language_id", "language_type"], transaction);
//     const weekOffResults = await upsertRecords(UserWeekOffMapping, weekOffs, ["week_id"], transaction);
//
//     await transaction.commit(); // ✅ ensure commit
//
//     return res.status(200).json({
//       success: true,
//       message: "Duty information updated successfully",
//       data: {
//         duty: dutyResults,
//         preferredCities: cityResults,
//         shifts: shiftResults,
//         payments: paymentResults,
//         languages: languageResults,
//         weekOffs: weekOffResults,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("❌ Error upserting duty info:", error);
//
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

export const upsertDutyInfo = async (req, res) => {
  const user_id = req.params.user_id || req.body.user_id;
  const { duty, preferredCities, shifts, payments, languages, weekOffs } =
    req.body;

  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: "user_id is required",
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Helper: Remove duplicate records based on unique fields
    const deduplicate = (records, uniqueFields) => {
      if (!Array.isArray(records)) return [];
      const map = new Map();
      for (const record of records) {
        const key = uniqueFields.map((f) => record[f]).join("_");
        map.set(key, record);
      }
      return Array.from(map.values());
    };

    // Helper: Generic upsert
    const upsertRecords = async (Model, records, uniqueFields, transaction) => {
      if (!records || !Array.isArray(records)) return [];
      const deduped = deduplicate(records, uniqueFields);
      const results = [];

      for (const record of deduped) {
        const whereCondition = { user_id };
        uniqueFields.forEach((field) => {
          if (record[field] !== undefined)
            whereCondition[field] = record[field];
        });

        const existing = await Model.findOne({
          where: whereCondition,
          transaction,
        });

        if (existing) {
          await Model.update(
            {
              ...record,
              status: 1,
              modified_date: new Date(),
              modified_by: req.user?.id || null,
            },
            { where: whereCondition, transaction }
          );
          const updatedRecord = await Model.findOne({
            where: whereCondition,
            transaction,
          });
          results.push(updatedRecord);
        } else {
          const newRecord = await Model.create(
            {
              ...record,
              user_id: parseInt(user_id),
              status: 1,
              created_date: new Date(),
              created_by: req.user?.id || null,
              modified_by: req.user?.id || null,
            },
            { transaction }
          );
          results.push(newRecord);
        }
      }

      return results;
    };

    // Helper: Delete missing records (detect primary key automatically)
    const deleteMissingRecords = async (
      Model,
      records,
      uniqueFields,
      transaction
    ) => {
      const primaryKey = Object.keys(Model.primaryKeys)[0] || "id";

      if (!records || records.length === 0) {
        await Model.destroy({ where: { user_id }, transaction });
        return;
      }

      const existing = await Model.findAll({ where: { user_id }, transaction });

      for (const row of existing) {
        const shouldKeep = records.some((r) =>
          uniqueFields.every((f) => r[f] === row[f])
        );
        if (!shouldKeep) {
          await Model.destroy({
            where: { [primaryKey]: row[primaryKey] },
            transaction,
          });
        }
      }
    };

    // Delete old records not in payload
    await deleteMissingRecords(
      UserDutyPreference,
      duty,
      ["package_id"],
      transaction
    );
    await deleteMissingRecords(
      UserPrefDriveCity,
      preferredCities,
      ["city_id"],
      transaction
    );
    await deleteMissingRecords(
      UserWorkingShiftMapping,
      shifts,
      ["working_shift_id"],
      transaction
    );
    await deleteMissingRecords(
      UserPaymentType,
      payments,
      ["payment_type_id"],
      transaction
    );
    await deleteMissingRecords(
      UserLanguage,
      languages,
      ["language_id", "language_type"],
      transaction
    );
    await deleteMissingRecords(
      UserWeekOffMapping,
      weekOffs,
      ["week_id"],
      transaction
    );

    // Perform upserts
    const dutyResults = await upsertRecords(
      UserDutyPreference,
      duty,
      ["package_id"],
      transaction
    );
    const cityResults = await upsertRecords(
      UserPrefDriveCity,
      preferredCities,
      ["city_id"],
      transaction
    );
    const shiftResults = await upsertRecords(
      UserWorkingShiftMapping,
      shifts,
      ["working_shift_id"],
      transaction
    );
    const paymentResults = await upsertRecords(
      UserPaymentType,
      payments,
      ["payment_type_id"],
      transaction
    );
    const languageResults = await upsertRecords(
      UserLanguage,
      languages,
      ["language_id", "language_type"],
      transaction
    );
    const weekOffResults = await upsertRecords(
      UserWeekOffMapping,
      weekOffs,
      ["week_id"],
      transaction
    );

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Duty information updated successfully",
      data: {
        duty: dutyResults,
        preferredCities: cityResults,
        shifts: shiftResults,
        payments: paymentResults,
        languages: languageResults,
        weekOffs: weekOffResults,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error upserting duty info:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const toggleLoginStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find the user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle the login status
    const newLoginStatus = !user.login_status;

    // Prepare update data
    const updateData = {
      login_status: newLoginStatus,
    };

    // Update timestamps based on login/logout
    if (newLoginStatus === true) {
      // User is logging in
      updateData.login_time = new Date();
      updateData.logout_time = null; // Clear logout time when logging in
    } else {
      // User is logging out
      updateData.logout_time = new Date();
    }

    // Update the user
    const updatedUser = await user.update(updateData);

    return res.status(200).json({
      success: true,
      message: `User ${
        newLoginStatus ? "logged in" : "logged out"
      } successfully`,
      data: {
        id: updatedUser.id,
        login_status: updatedUser.login_status,
        login_time: updatedUser.login_time,
        logout_time: updatedUser.logout_time,
      },
    });
  } catch (error) {
    console.error("Error toggling login status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// export const kycController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "user not found ",
//       });
//     }
//     const {
//       kyc_type,
//       kyc,
//       city_id,
//       state_id,
//       pan,
//       address,
//       pincode,
//       country_id,
//     } = req.body;
//     if (!kyc_type || !kyc || !pan) {
//       return res.status(400).json({
//         success: false,
//         message: "required fields are kyc_type, kyc, pan",
//       });
//     }
//     const kycVerified = await UserInfo.update(
//       { kyc_type, kyc, city_id, state_id, pan, address, pincode, country_id },
//       {
//         where: {
//           user_id: id,
//         },
//       }
//     );
//     return res.status(200).json({
//       success: true,
//       message: "kyc verified ",
//       kycVerified,
//     });
//   } catch (error) {
//     console.error("something went wrong", error);
//   }
// };

export const kycController = async (req, res) => {
  try {
    const { id } = req.params; // user_id
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      kyc_type,
      kyc,
      city_id,
      state_id,
      pan,
      address,
      pincode,
      country_id,
    } = req.body;

    if (!kyc_type || !kyc || !pan) {
      return res.status(400).json({
        success: false,
        message: "Required fields: kyc_type, kyc, pan",
      });
    }

    const existingKyc = await UserInfo.findOne({
      where: { user_id: id, kyc_type },
    });

    console.log("Existing KYC found:", !!existingKyc);

    let kycRecord;

    if (existingKyc) {
      //  Update existing KYC record
      await existingKyc.update({
        kyc,
        city_id,
        state_id,
        pan,
        address,
        pincode,
        country_id,
      });
      kycRecord = existingKyc;
    } else {
      //  Create a new KYC record for this user
      kycRecord = await UserInfo.create({
        user_id: id,
        kyc_type,
        kyc,
        city_id,
        state_id,
        pan,
        address,
        pincode,
        country_id,
      });
    }

    return res.status(200).json({
      success: true,
      message: existingKyc
        ? "KYC updated successfully"
        : "KYC created successfully",
      kycRecord,
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// export const getKycUserInfo = async (req, res) => {
//   try {
//     const { id } = req.params; // get user_id from params
//     const [kycInfo] = await sequelize.query(
//       `
//   SELECT
//     ui.id,
//     ui.user_id,
//     ui.address,
//     ui.city_id,
//     mc.name AS city_name,
//     ui.state_id,
//     mc.state_name AS state_name,
//     ui.country_id,
//     mc.country_name AS country_name,
//     ui.kyc_type,
//     ui.kyc,
//     ui.pan,
//     ui.pincode,
//     mdt.document_name AS kyc_document_name,

//     -- Address Proof Image
//     ud_address.doc_file_upload AS address_proof_image,

//     -- PAN Proof Image
//     ud_pan.doc_file_upload AS pan_proof_image

//   FROM user_info ui

//   LEFT JOIN master_document_type mdt
//     ON ui.kyc_type = mdt.doc_type_id

//   LEFT JOIN master_city mc
//     ON ui.city_id = mc.id

//   -- Join for Address Proof
//   LEFT JOIN user_upload_document ud_address
//     ON ud_address.user_id = ui.user_id
//     AND ud_address.document_type_id = (
//       SELECT doc_type_id
//       FROM master_document_type
//       WHERE doc_level_name = 'residential_proof'
//       LIMIT 1
//     )

//   -- Join for PAN Proof
//   LEFT JOIN user_upload_document ud_pan
//     ON ud_pan.user_id = ui.user_id
//     AND ud_pan.document_type_id = (
//       SELECT doc_type_id
//       FROM master_document_type
//       WHERE doc_level_name = 'pancard_proof'
//       LIMIT 1
//     )

//   WHERE ui.user_id = :user_id
//   `,
//       {
//         replacements: { user_id: id },
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "KYC info fetched successfully",
//       kycInfo,
//     });
//   } catch (error) {
//     console.error("Error fetching KYC info:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };

export const getKycUserInfo = async (req, res) => {
  try {
    const { id } = req.params; // get user_id from params

    // Query to fetch all KYC records for the user
    const kycInfo = await sequelize.query(
      `
      SELECT 
    ui.id,
    ui.user_id,
    ui.address,
    ui.city_id,
    mc.name AS city_name,
    ui.state_id,
    mc.state_name AS state_name,
    ui.country_id,
    mc.country_name AS country_name,
    ui.kyc_type,
    ui.kyc,
    ui.pan,
    ui.pincode,
    mdt.document_name AS kyc_document_name,

    -- Address Proof Image (subquery to pick one)
    (
      SELECT ud.doc_file_upload
      FROM user_upload_document ud
      WHERE ud.user_id = ui.user_id
        AND ud.document_type_id = (
          SELECT doc_type_id 
          FROM master_document_type 
          WHERE doc_level_name = 'residential_proof' 
          LIMIT 1
        )
      
      LIMIT 1
    ) AS address_proof_image,

    -- PAN Proof Image (subquery to pick one)
    (
      SELECT ud.doc_file_upload
      FROM user_upload_document ud
      WHERE ud.user_id = ui.user_id
        AND ud.document_type_id = (
          SELECT doc_type_id 
          FROM master_document_type 
          WHERE doc_level_name = 'pancard_proof' 
          LIMIT 1
        )
      LIMIT 1
    ) AS pan_proof_image

FROM user_info ui
LEFT JOIN master_document_type mdt 
  ON ui.kyc_type = mdt.doc_type_id
LEFT JOIN master_city mc 
  ON ui.city_id = mc.id
WHERE ui.user_id = :user_id;

      `,
      {
        replacements: { user_id: id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Check if any KYC records were found
    if (!kycInfo || kycInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No KYC records found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "KYC info fetched successfully",
      kycInfo, // Return the array of KYC records
    });
  } catch (error) {
    console.error("Error fetching KYC info:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export async function deleteKYCInfo(req, res) {
  const { id } = req.params;

  try {
    const kycRecord = await UserInfo.findByPk(id);
    if (!kycRecord) {
      return res.status(404).json({
        success: false,
        message: "kyc record not found",
      });
    }

    await kycRecord.destroy();
    return res.status(200).json({
      success: true,
      message: "kyc deleted successfully",
    });
  } catch (error) {
    console.error("something went wrong", error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
}

export const viewKyc = async (req, res) => {
  try {
    const { id } = req.params; // kyc_id (user_info.id)
    console.log("id", id);
    // Query to fetch a single KYC record
    const [kycInfo] = await sequelize.query(
      `
      SELECT 
        ui.id,
        ui.user_id,
        ui.address,
        ui.city_id,
        mc.name AS city_name,
        ui.state_id,
        mc.state_name AS state_name,
        ui.country_id,
        mc.country_name AS country_name,
        ui.kyc_type,
        ui.kyc,
        ui.pan,
        ui.pincode,
        mdt.document_name AS kyc_document_name,

        -- Address Proof Image
        ud_address.doc_file_upload AS address_proof_image,

        -- PAN Proof Image
        ud_pan.doc_file_upload AS pan_proof_image

      FROM user_info ui

      LEFT JOIN master_document_type mdt 
        ON ui.kyc_type = mdt.doc_type_id

      LEFT JOIN master_city mc 
        ON ui.city_id = mc.id

      -- Join for Address Proof
      LEFT JOIN user_upload_document ud_address 
        ON ud_address.user_id = ui.user_id
        AND ud_address.document_type_id = (
          SELECT doc_type_id 
          FROM master_document_type 
          WHERE doc_level_name = 'residential_proof' 
          LIMIT 1
        )

      -- Join for PAN Proof
      LEFT JOIN user_upload_document ud_pan 
        ON ud_pan.user_id = ui.user_id
        AND ud_pan.document_type_id = (
          SELECT doc_type_id 
          FROM master_document_type 
          WHERE doc_level_name = 'pancard_proof' 
          LIMIT 1
        )

      WHERE ui.id = :kyc_id
      `,
      {
        replacements: { kyc_id: id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log("kycinfo", kycInfo);
    if (!kycInfo) {
      return res.status(404).json({
        success: false,
        message: "KYC record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "KYC info fetched successfully",
      kycInfo,
    });
  } catch (error) {
    console.error("Error fetching KYC info:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const editKyc = async (req, res) => {
  try {
    const { id } = req.params; // kyc_id (user_info.id)
    const {
      kyc_type,
      kyc,
      city_id,
      state_id,
      pan,
      address,
      pincode,
      country_id,
    } = req.body;

    // Find the KYC record
    const kycRecord = await UserInfo.findByPk(id);

    if (!kycRecord) {
      return res.status(404).json({
        success: false,
        message: "KYC record not found",
      });
    }

    // Validate required fields
    if (!kyc_type || !kyc || !pan) {
      return res.status(400).json({
        success: false,
        message: "Required fields: kyc_type, kyc, pan",
      });
    }

    // Update the KYC record
    await kycRecord.update({
      kyc_type,
      kyc,
      city_id,
      state_id,
      pan,
      address,
      pincode,
      country_id,
    });

    return res.status(200).json({
      success: true,
      message: "KYC updated successfully",
      kycRecord,
    });
  } catch (error) {
    console.error("Error updating KYC record:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getEmailTemp = async (req, res) => {
  const payload = req.body?.payload || {};

  // Destructure with defaults
  const {
    type = "",
    ref = "",
    company_name = "",
    formattedDate = "",
    vehicle = "",
    clientname = "",
    pickup_area = "",
    end_time = "",
    start_time = "",
    totalHours = "",
    booking_amt_paid = "",
    booking_amt_balance = "",
    client_name = "",
    company_logo = "",
    user_com_name = "",
    user_com_address = "",
    user_com_state = "",
    user_com_pincode = "",
    user_comp_mobile = "",
    user_gst_no = "",
    booking_ref_no = "",
    booking_vehicle = "",
    first_name = "",
    last_name = "",
    booking_type = "",
    driver_name = "",
    vehicle_no = "",
    pickup_address = "",
    drop_address = "",
    comp_name = "",
    closing_meter = "",
    releasing_meter = "",
    starting_meter = "",
    starting_time = "",
    total_km = "",
    total_hr = "",
    advance = "",
    balance = "",
  } = payload;

  console.log(payload);

  try {
    const template = await getEmailTemplate(type);
    const filledTemplate = await safeRender(template?.description, payload);

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      filledTemplate,
    });
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getUserDataList = async (req, res) => {
  const payload = req.body || {};
  const { company_id = "", name = "" } = payload;

  try {
    let sql = `
      SELECT 
        user.id AS user_id,
        CONCAT(user.first_name, " ", user.last_name) AS username,
        user.mobile AS mobile_no,
        user.email,
        ur.RoleName
      FROM user_role AS ur
      LEFT JOIN user ON ur.Role_ID = user.user_type_id
      WHERE user.user_type_id IN (1,4,6,7,8,9,14)
        AND user.is_active = 1
        AND user.signup_status = 10
        AND user.company_id = ?
    `;

    const params = [company_id];

    if (name && name.trim() !== "") {
      sql += `
        AND (
          user.first_name LIKE ? 
          OR user.email LIKE ? 
          OR user.mobile LIKE ?
        )
      `;
      const likeParam = `%${name}%`;
      params.push(likeParam, likeParam, likeParam);
    }

    const [rows] = await db.sequelize.query(sql, params);

    if (rows.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        data: rows,
      });
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_RECORD_FOUND, {
        data: [],
      });
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const saveLoginLogs = async (req, res) => {
  const payload = req.body || {};

  try {
    // Time & token setup
    const currentTime = new Date().getTime();
    const currentTtl = parseInt(currentTime + DEFAULT_TTL);
    const login_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const login_time = formatDateTime();
    const login_date = formatDate();
    const token = crypto.randomBytes(32).toString("hex");

    // Prepare values for insertion
    const insertValues = {
      userId: payload.user_id,
      status: token,
      expires: currentTtl,
      callfrom: payload.callfrom || "",
      login_time,
      login_date,
      login_location: payload.login_location || "",
      lat: payload.lat || null,
      log: payload.log || "",
      login_timezone,
      ip: payload.ip || "",
    };

    // Insert login record
    const insertSql = "INSERT INTO log_in_log SET ?";
    await db.sequelize.query(insertSql, [insertValues]);

    // Update user login info
    const updateSql = `
      UPDATE user
      SET login_status = 1,
          login_time = ?,
          login_timezone = ?
      WHERE id = ?
    `;
    await db.sequelize.query(updateSql, [
      login_time,
      login_timezone,
      payload.user_id,
    ]);

    return successResponse(res, MESSAGES.GENERAL.DATA_SAVED, {
      token,
      login_time,
      login_timezone,
    });
  } catch (err) {
    console.error("Error in saveLoginLogs:", err);
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateWalletAmount = async (req, res) => {
  const { user_id, wallet_amount } = req.body || {};

  if (!user_id || wallet_amount === undefined) {
    return res
      .status(400)
      .json({ error: "user_id and wallet_amount are required" });
  }

  try {
    // Query to get wallet totals
    const sql = `
      SELECT 
        u.id AS user_id,
        u.wallet_amount,
        SUM(COALESCE(CASE WHEN ut.action_type = 'Debit' THEN ut.amount END, 0)) AS total_debits,
        SUM(COALESCE(CASE WHEN ut.action_type = 'Credit' THEN ut.amount END, 0)) AS total_credits,
        SUM(COALESCE(CASE WHEN ut.action_type = 'Credit' THEN ut.amount END, 0)) - 
        SUM(COALESCE(CASE WHEN ut.action_type = 'Debit' THEN ut.amount END, 0)) AS credit_balance
      FROM user_transaction AS ut
      LEFT JOIN user AS u ON ut.user_id = u.id
      WHERE u.id = ?
      GROUP BY u.id
    `;

    const [users] = await db.sequelize.query(sql, [user_id]);

    if (!users || users.length === 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_NOT_FOUND, null);
    }

    // Update wallet amount
    const updateSql = "UPDATE user SET wallet_amount = ? WHERE id = ?";
    await db.sequelize.query(updateSql, [wallet_amount, user_id]);

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      user_id: users[0].user_id,
      wallet_amount,
      total_debits: users[0].total_debits,
      total_credits: users[0].total_credits,
      credit_balance: users[0].credit_balance,
    });
  } catch (err) {
    console.error("Error in updateWalletAmount:", err);
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const changeUserPassword = async (req, res) => {
  const { user_id, new_password, otp } = req.body || {};

  if (!user_id || !new_password || !otp) {
    return res
      .status(400)
      .json({ error: "user_id, new_password, and otp are required" });
  }

  const hashedPassword = md5(new_password);

  try {
    // Update the user's password
    const [updateResult] = await db.sequelize.query(
      "UPDATE user SET password = ? WHERE id = ?",
      { replacements: [hashedPassword, user_id] }
    );

    // Check if password update affected any rows
    if (updateResult.affectedRows > 0) {
      // Mark the OTP as used
      await db.sequelize.query(
        "UPDATE activation SET isUsed = 1 WHERE UID = ? AND Verification_code = ?",
        { replacements: [user_id, otp] }
      );

      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
        status: "success",
        msg: "Password changed successfully",
      });
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_NOT_FOUND, {
        status: "failed",
        msg: "Password not changed",
      });
    }
  } catch (err) {
    console.error("Error in changeUserPassword:", err);
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const forgotUserPassword = async (req, res) => {
  const { username, user_type_id, login_location, lat } = req.body || {};

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    // Find user by email or mobile (with optional user_type_id filter)
    const user = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [{ email: username }, { mobile: username }],
        ...(user_type_id && { user_type_id }),
      },
      include: [
        {
          model: UserInfo,
          as: "info",
          attributes: ["country_id"],
        },
      ],
    });

    if (!user) {
      return successResponse(res, MESSAGES.GENERAL.DATA_NOT_FOUND, {
        status: "failed",
        msg: "Invalid email or mobile",
      });
    }

    // Generate verification code
    const verification_code = Math.floor(10000 + Math.random() * 90000);

    // Insert verification code into DB
    await insertVerificationCode(user.id, verification_code);

    // Send email
    const subject = "Your Verification Code";
    const text = `Hi ${user.first_name},\n\nYour verification code is: ${verification_code}\n\nIt expires in 10 minutes.`;

    // Send email using your dynamic provider
    await sendEmail(user.email, subject, text);
    // Send SMS
    // const smsTemplate = await getSmsTemplate("acc_verify_code");
    // if (smsTemplate) {
    //   let smsMessage = smsTemplate.message
    //     .replace("{#username#}", user.first_name)
    //     .replace("{#code#}", verification_code)
    //     .replace("{#mobile#}", constants.COMPANY_PHONE_NO);

    //   await sendSms({
    //     mobile: user.mobile,
    //     message: smsMessage,
    //     templateParams: { username: user.first_name, code: verification_code },
    //   });
    // }

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      status: "success",
      data: {
        user_id: user.id,
        first_name: user.first_name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("Error in forgotUserPassword:", err);
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const insertVerificationCode = async (userId, code) => {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60000);
    const record = await Activation.create({
      user_id: userId,
      otp: code,
      is_used: 0,
      expires_in: expiresAt,
    });
    return record;
  } catch (err) {
    console.error("Error in insertVerificationCode:", err);
    throw err;
  }
};

/**
 * Check duplicate password for a user
 */
export const checkPassword = async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "username and password are required" });
  }

  try {
    // Find user by email or mobile AND password
    const user = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [{ email: username }, { mobile: username }],
        password,
      },
      attributes: ["id"],
    });

    if (!user) {
      return successResponse(res, MESSAGES.GENERAL.NOT_FOUND, {
        status: "false",
        error: "User not Exist",
      });
    }

    return successResponse(res, MESSAGES.GENERAL.NOT_FOUND, {
      user_id: user.id,
      status: "true",
    });
  } catch (err) {
    console.error("Error in checkPassword:", err);
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getRecentUsers = async (req, res) => {
  try {
    const sql = `SELECT first_name, last_name, email, mobile, RoleName FROM user u LEFT JOIN user_role ur ON u.user_type_id = ur.Role_ID ORDER BY u.created_date DESC LIMIT 5`;

    const resutls = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    return successResponse(res, MESSAGES.GENERAL.SUCCESS, resutls);
  } catch (error) {
    console.error("Error in getRecentUsers:", error);
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

// export const getCountryUserPercentage = async (req, res) => {
//   try {
//     const { country_name } = req.query;

//     if (!country_name) {
//       return res.status(400).json({
//         success: false,
//         message: "country_name is required"
//       });
//     }

//     // Get last 5 years including current
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let i = 0; i < 5; i++) {
//       years.push(currentYear - i);
//     }

//     let finalData = [];

//     for (const year of years) {
//       const sql = `
//         SELECT
//           mc.name AS country_name,
//           mc.id AS country_id,
//           COUNT(u.id) AS country_user_count,
//           (
//             COUNT(u.id) / (
//               SELECT COUNT(*)
//               FROM user
//               WHERE isDeleted = 0
//               AND YEAR(created_on) = :year
//             ) * 100
//           ) AS percentage
//         FROM user u
//         LEFT JOIN master_country mc ON mc.id = u.nationality
//         WHERE
//           u.isDeleted = 0
//           AND mc.name = :country_name
//           AND YEAR(u.created_on) = :year
//         GROUP BY mc.id
//       `;

//       const result = await sequelize.query(sql, {
//         replacements: { country_name, year },
//         type: sequelize.QueryTypes.SELECT,
//       });

//       if (result.length === 0) {
//         finalData.push({
//           year,
//           country_name,
//           country_id: null,
//           country_user_count: 0,
//           percentage: "0.00"
//         });
//       } else {
//         finalData.push({
//           year,
//           ...result[0]
//         });
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Year-wise country user statistics fetched successfully",
//       data: finalData
//     });

//   } catch (error) {
//     console.error("Error in getCountryUserPercentage:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };

export const getCountryUserPercentage = async (req, res) => {
  try {
    const { country_name } = req.query;

    if (!country_name) {
      return res.status(400).json({
        success: false,
        message: "country_name is required",
      });
    }

    // last 5 years automatically
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }

    let finalData = [];

    for (const year of years) {
      const sql = `
        SELECT 
          mc.name AS country_name,
          mc.id AS country_id,
          COUNT(b.booking_id) AS country_booking_count,
          (
            COUNT(b.booking_id) / (
              SELECT COUNT(*) 
              FROM booking 
              WHERE YEAR(created_date) = :year
            ) * 100
          ) AS percentage
        FROM booking b
        LEFT JOIN user u ON u.id = b.user_id
        LEFT JOIN master_country mc ON mc.id = u.nationality
        WHERE 
          u.isDeleted = 0
          AND mc.name = :country_name
          AND YEAR(b.created_date) = :year
        GROUP BY mc.id
      `;

      const result = await sequelize.query(sql, {
        replacements: { country_name, year },
        type: sequelize.QueryTypes.SELECT,
      });

      if (result.length === 0) {
        finalData.push({
          year,
          country_name,
          country_id: null,
          country_booking_count: 0,
          percentage: "0.00",
        });
      } else {
        finalData.push({
          year,
          ...result[0],
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Country-wise booking statistics fetched successfully",
      data: finalData,
    });
  } catch (error) {
    console.error("Error in getCountryBookingsPercentage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const referAndEarnSMS = async (req, res) => {
  const { referral_code, phone } = req.body;
  if (!phone) {
    return res.status(404).json({
      success: false,
      message: "Provide Phone No.",
    });
  }

  try {
    const smsTemplate = await SmsTemplate.findOne({
      where: { msg_sku: "refer_and_earn" },
    });

    // const findUser = await User.findOne({
    //   where: { email: req.user.email },
    // });

    const [result] = await sequelize.query(
      `
  SELECT u.*, c.company_name
  FROM user u
  LEFT JOIN company c ON u.company_id = c.id
  WHERE u.email = :email
`,
      {
        replacements: { email: req?.user?.email },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const template_param = {
      referral_code: referral_code,
      username: `${result?.first_name} ${result.last_name}`,
    };

    let sms_message = smsTemplate.message
      .replace(/{#username#}/g, template_param.username)
      .replace(/{#referral_code#}/g, template_param.referral_code);

    const sms = await sendSMS(phone, sms_message);
    console.log(sms);

    return res.status(200).json({
      message: "SMS Sent Succesfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
