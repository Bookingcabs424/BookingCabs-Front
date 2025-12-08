import UserDutyPref from "../models/userDutyPrefrenceModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";

export const createDuty = async (req, res, isInternalCall = false) => {
  try {
    const { package_id } = req.body; // Expects comma-separated string like "1,2,3"
    const { id: user_id } = req.user;
    const created_by = user_id;
    const created_date = new Date();
 
    if (!package_id) {
      return errorResponse(
        res,
        MESSAGES.USER.USER_PACKAGE_ID,
        MESSAGES.GENERAL.MANDATORY_FIELD
      );
    }
    let langIdsRaw = Array.isArray(package_id)
      ? package_id
      : package_id.split(",");

    const packageIds = [
      ...new Set(langIdsRaw.map((id) => id.trim()).filter(Boolean)),
    ];

    // const packageIds = package_id
    //   .split(",")
    //   .map((id) => id.trim())
    //   .filter(Boolean);

    if (packageIds.length === 0) {
      return errorResponse(
        res,
        MESSAGES.USER.USER_PACKAGE_ID,
        MESSAGES.GENERAL.DATA_NOT_VALID
      );
    }

    const bulkData = packageIds.map((pkgId) => ({
      user_id,
      package_id: pkgId,
      created_by,
      created_date,
    }));

    const newDuties = await UserDutyPref.bulkCreate(bulkData);
    if (isInternalCall) {
      return true;
    }
    return successResponse(
      res,
      MESSAGES.GENERAL.DATA_CREATED,
      { newDuties },
      STATUS_CODE.CREATED
    );
  } catch (error) {
    if (isInternalCall) {
      throw new Error(error.message);
    }
    return errorResponse(res, STATUS_CODE.BAD_REQUEST, error.message);
  }
};

export const updateDuty = async (req, res) => {
  try {
    const { id } = req.params;
    const { dutyDetails } = req.body;
    const duty = await UserDutyPref.findByPk(id);
    if (!duty) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    await duty.update({ dutyDetails });
    return successResponse(
      res,
      MESSAGES.GENERAL.DATA_UPDATED,
      { duty },
      STATUS_CODE.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getDutyByUser = async (req, res, isInternalCall = false) => {
  try {
    const user_id = isInternalCall ? req : parseInt(req.user.id);

    const duties = await UserDutyPref.findAll({ where: { user_id } });
    if (isInternalCall) {
      return duties;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { duties });
    }
  } catch (error) {
    if (isInternalCall) {
      throw new Error(MESSAGES.GENERAL.SOMETHING_WENT_WRONG);
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getAllUserDuties = async (req, res) => {
  try {
    const duties = await UserDutyPref.findAll();
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { duties });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const softDeleteDuty = async (req, res) => {
  try {
    const { id } = req.params;
    const duty = await UserDutyPref.findByPk(id);
    if (!duty) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    await duty.update({ isDeleted: true });
    return successResponse(res, MESSAGES.GENERAL.DATA_DELETED, { duty });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updateDutyType = async (req, res, isInternalCall = false) => {
  try {
    const { id: user_id } = req.user;

    const userUpdate = await UserDutyPref.update(
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

export const dutyTypeList = async (req, res, isInternalCall = false) => {
  try {
    const driver_id = isInternalCall ? req?.driver_id : req?.body?.driver_id;

    const result = await UserDutyPref.findAll({
      where: {
        user_id: driver_id,
        status: 1,
      },
      attributes: ["user_duty_id", "package_id"],
    });

    if (isInternalCall) {
      return result;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { result });
    }
  } catch (err) {
    if (isInternalCall) {
      throw err;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        err.message
      );
    }
  }
};
