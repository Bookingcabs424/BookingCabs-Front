import User from "../models/userModel.js";
import ReferralDiscount from "../models/referalDiscountAmountModel.js";
import UserReferralHistory from "../models/referalSignupHistoryModel.js";
import UserWalletTransaction from "../models/userWalletTransactionModel.js";
import WalletPointConversion from "../models/walletPointConversionModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import sequelize from "../config/clientDbManager.js";

export const addReferralPointsOnUserRegistration = async (
  req,
  res,
  referalKey
) => {
  const userData = await User.findOne({ where: { referral_key: referalKey } });

  if (!userData) {
    return null;
  }

  const referalAmount = await ReferralDiscount.findOne({
    where: { user_type: userData.user_type_id },
  });

  if (!referalAmount) {
    return null;
  }

  userData.wallet_point =
    (parseFloat(userData.wallet_point) || 0) +
    (parseFloat(referalAmount.installation_amount_referer) || 0);

  await userData.save();
  return userData;
};

export const updateUserReferralHistory = async (
  userId,
  refererId,
  userPoint,
  refererPoint
) => {
  if (!userId || !refererId || !userPoint || !refererPoint) {
    throw new Error("Invalid parameters");
  }
  const userReferralHistory = await UserReferralHistory.create({
    user_id: userId,
    referer_id: refererId,
    user_point: userPoint,
    referer_point: refererPoint,
  });
  return userReferralHistory;
};

export const getUserReferralPoints = async (req, res) => {
  try {
    const { id } = req?.user || {};
    const referer_id = id || 32; // fallback to 32 for testing

    const sql = `
      SELECT 
        rsh.*, 
        CONCAT(u.first_name, ' ', u.last_name) AS name
      FROM referral_signup_history rsh
      LEFT JOIN \`user\` u ON rsh.user_id = u.id
      WHERE rsh.referer_id = :referer_id
    `;

    const userReferralHistory = await sequelize.query(sql, {
      replacements: { referer_id },
      type: sequelize.QueryTypes.SELECT,
    });

    const user = await User.findByPk(id);

    const referral_point = userReferralHistory.reduce(
      (total, item) => total + (item.referer_point || 0),
      0
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      userReferralHistory,
      referral_point,
      referral_key: user?.referral_key || "N/A",
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};
