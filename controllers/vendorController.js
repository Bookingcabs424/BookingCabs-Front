import VendorStatus from "../models/vendorStatusModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { MESSAGES } from "../constants/const.js";

export const getVendorClients = async (req, res) => {
  const vendorId = parseInt(req.params.vendorId);

  const baseSQL = `
      SELECT 
        user.id AS user_id, 
        user.user_type_id, 
        user_role.RoleName AS user_type, 
        CONCAT(user.first_name, " ", user.last_name) AS clientname, 
        user.mobile, 
        user.email 
      FROM user 
      LEFT JOIN user_role ON user.user_type_id = user_role.Role_ID 
      WHERE user.user_type_id NOT IN (1, 2, 10, 11)
    `;

  const conditionalSQL = vendorId ? " AND user.parent_id = :vendorId" : "";

  const fullSQL = baseSQL + conditionalSQL;

  try {
    const [results] = await sequelize.query(fullSQL, {
      replacements: vendorId ? { vendorId } : {},
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      results,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getVendorStatusDetail = async (req, res) => {
  const { user_id, status, auto_id } = req.query;

  const baseSQL = `
      SELECT 
        ds.*, 
        b.reference_number AS booking_ref_no, 
        cs.status AS user_status, 
        ds.self_reference AS self_reference 
      FROM vendor_status AS ds 
      LEFT JOIN booking AS b ON ds.booking_id = b.booking_id 
      LEFT JOIN cab_status AS cs ON ds.vendor_status = cs.status_id AND cs.type = 'driver'
      WHERE 1 = 1
    `;

  const conditions = [];
  const replacements = {};

  if (user_id) {
    conditions.push("AND ds.user_id = :user_id");
    replacements.user_id = user_id;
  }

  if (status) {
    conditions.push("AND ds.status = :status");
    replacements.status = status;
  }

  if (auto_id) {
    conditions.push("AND ds.id = :auto_id");
    replacements.auto_id = auto_id;
  }

  const finalSQL = `${baseSQL} ${conditions.join(" ")} ORDER BY ds.id DESC`;

  try {
    const [results] = await sequelize.query(finalSQL, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.DATA_NOT_FOUND,
        MESSAGES.GENERAL.DATA_NOT_FOUND
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

export const addVendorStatusDetail = async (req, res) => {
  try {
    const {
      user_id,
      booking_id,
      self_reference,
      vendor_status,
      start_date,
      end_date,
      ip,
      status,
      created_by,
    } = req.body;
    const { id } = req.user;
    const newRecord = {
      user_id,
      booking_id,
      self_reference,
      vendor_status,
      start_date,
      end_date,
      created_date: new Date(),
      ip,
      status,
      created_by: id,
    };

    Object.keys(newRecord).forEach((key) => {
      if (newRecord[key] === undefined || newRecord[key] === "") {
        delete newRecord[key];
      }
    });

    const result = await VendorStatus.create(newRecord);

    return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
      id: result.id,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message || "Failed to insert vendor status"
    );
  }
};

export const updateVendorStatusDetail = async (req, res) => {
  const {
    auto_id,
    user_id,
    vendor_status,
    start_date,
    end_date,
    ip,
    modified_by,
  } = req.body;
  const { id } = req.user;

  if (!auto_id) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }

  try {
    const updateData = {
      user_id,
      vendor_status,
      start_date,
      end_date,
      ip,
      modified_by,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === "") {
        delete updateData[key];
      }
    });

    const updatedCount = await VendorStatus.update(updateData, {
      where: { id: auto_id },
    });

    if (updatedCount > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
        updatedRows: updatedCount,
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        MESSAGES.GENERAL.ERROR_WHILE_UDPATE
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

export const updateVendorStatus = async (req, res) => {
  const { ids, user_id, status } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0 || !user_id || !status) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }

  try {
    const [updatedCount] = await VendorStatus.update(
      {
        vendor_status: status,
        modified_by: user_id,
      },
      {
        where: {
          id: ids,
        },
      }
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
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};


export const getAllVendor = async (req, res) => {
  try {
    const baseFilter = {
      user_type_id: { [Op.in]: [4] },
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
      offset
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
