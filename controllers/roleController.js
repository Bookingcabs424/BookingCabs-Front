import Role from "../models/roleModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import { Op } from "sequelize";
import sequelize from "../config/clientDbManager.js";

export const createRole = async (req, res) => {
  const { role_name, description } = req.body;

  if (!role_name || !description) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const results = await Role.create({
      role_name,
      description,
      status: 1,
      created_by: req.user.id,
      region_id: null,
    });
    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        results: results,
        page: Number(page),
        limit: Number(limit),
      });
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, {});
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Role.findAndCountAll({
      limit,
      offset,
    });

    let sql = `
    SELECT role.*, u.first_name, u.last_name from role LEFT JOIN user as u ON u.id = role.created_by WHERE role.created_by =:created_by AND status = 1;
    `;

    const result = await Role.sequelize.query(sql, {
      replacements: { created_by: req.user.id },
      type: Role.sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.USERS_FETCHED, {
      roles: result,
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

export const deleteRole = async (req, res) => {
  const { id } = req.body;
  const userId = req?.user?.id ?? 0;

  try {
    const [result, metadata] = await sequelize.query(
      `UPDATE role
       SET status = 2, modified_by = ?
       WHERE role_id = ?`,
      {
        replacements: [userId, id],
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

export const updateRole = async (req, res) => {
  const { role_id, role_name, description, status } = req.body;
  const userId = req.user.id;

  try {
    const [result, metadata] = await sequelize.query(
      `UPDATE role
       SET role_name = ?, description = ?, status = ?, modified_by = ?
       WHERE role_id = ?`,
      {
        replacements: [role_name, description, status, userId, role_id],
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

// export const updateRoleStatus = async (req, res) => {
//   const { role_id, status } = req.body;
//   const userId = req?.user?.id ?? 0;

//   try {
//     const roleIds = Array.isArray(role_id)
//       ? role_id
//       : role_id
//           .split(",")
//           .map((id) => id.trim())
//           .filter(Boolean);

//     const [updatedCount] = await Role.update(
//       {
//         status: Number(status),
//         modified_by: userId,
//       },
//       {
//         where: {
//           role_id: roleIds,
//         },
//         logging: false,
//       }
//     );

//     if (updatedCount > 0) {
//       const message = "Role status updated successfully";
//       const response = { status: "success", data: message };
//       return response;
//     } else {
//       const message = "No records were updated";
//       const response = { status: "failed", data: message };
//       return response;
//     }
//   } catch (error) {
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error.message,
//       STATUS_CODE.SERVER_ERROR
//     );
//   }
// };

export const updateRoleStatus = async (req, res) => {
  const { role_id, status } = req.body;
  const userId = req?.user?.id ?? 0;

  try {
    const roleIds = Array.isArray(role_id)
      ? role_id
      : role_id
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

    const [updatedCount] = await Role.update(
      {
        status: Number(status),
        modified_by: userId,
      },
      {
        where: {
          role_id: roleIds,
        },
        logging: false,
      }
    );

    if (updatedCount > 0) {
      return successResponse(res, "Role status updated successfully", {
        updatedCount,
      });
    } else {
      return errorResponse(
        res,
        "No records were updated",
        null,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
