import FriendFamily from "../models/friendFamilyModel.js";
import { MESSAGES, STATUS_CODE } from "../constants/const.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createFriendFamily = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      title,
      relationship,
      mobile,
      email,
      dob,
      referral_code,
    } = req.body;
    const user_id = req.user.id ?? 0;
    const newEntry = await FriendFamily.create({
      user_id,
      first_name,
      last_name,
      title,
      relationship,
      mobile,
      email,
      dob,
      referral_code,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_ADDED, { newEntry });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getFriendFamilyList = async (req, res) => {
  try {
    const user_id = req.user.id ?? 0;
    const list = await FriendFamily.findAll({
      where: { user_id, isDeleted: false },
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      list: list ?? [],
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateFriendFamily = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, title,  relationship, mobile, email } = req.body;

    const updated = await FriendFamily.update(
      { first_name, last_name, title,  relationship, mobile, email },
      { where: { id, isDeleted: false } }
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, { updated });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const deleteFriendFamily = async (req, res) => {
  try {
    const { id } = req.params;

    await FriendFamily.update(
      { isDeleted: true },
      { where: { id, isDeleted: false } }
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_DELETED, {});
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
