import Role from "../models/userRoleModel.js";
import UserAssignedRole from "../models/userAssignedRoleModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import dateFormat from "dateformat";
export const createRole = (req, res) => {
  // const {} = req.body;
};

export const addUserAssignedRole = async (req, res, isInternalCall = false) => {
  try {
    const { user_id, user_roles, ip } = isInternalCall ? req : req.body;
    if (!user_id || !user_roles) {
      return errorResponse(
        res,
        "user_id and user_roles are required",
        {},
        STATUS_CODE.BAD_REQUEST
      );
    }

    const created_date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    const created_by = user_id;

    const roleIds = Array.isArray(user_roles)
      ? user_roles.map((role) => role.toString().trim())
      : user_roles.split(",").map((role) => role.trim());

    if (roleIds.length === 0) {
      return errorResponse(
        res,
        "No roles provided",
        {},
        STATUS_CODE.BAD_REQUEST
      );
    }

    const roleRecords = roleIds.map((role_id) => ({
      user_id,
      role_id,
      created_date,
      created_by,
      modified_date: created_date,
      ip,
    }));

    const insertedRoles = await UserAssignedRole.bulkCreate(roleRecords);
    if (isInternalCall) return insertedRoles;
    return successResponse(
      res,
      MESSAGES.GENERAL.DATA_CREATED,
      {
        inserted_count: insertedRoles.length,
        data: insertedRoles,
      },
      STATUS_CODE.CREATED
    );
  } catch (error) {
    if (isInternalCall) throw Error;
    return errorResponse(res, STATUS_CODE.BAD_REQUEST, error.message);
  }
};

export const updateRole = (req, res) => {
  // const {} = req.body;
};

export const getUserRoleList = async (req, res) => {
  try {
    const results = await Role.findAll({
      where: {
        isActive: 1,
      },
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, {
      results,
    });
  } catch (error) {
    return errorResponse(res, STATUS_CODE.BAD_REQUEST, error.message);
  }
};

export const softDeleteRole = (req, res) => {};
export const updateUserRole = (req, res) => {};
