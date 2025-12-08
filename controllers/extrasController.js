// controllers/nightChargeController.js
import Extras from "../models/extrasModel.js";
import { upsertRecord } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const upsertExtrasFare = async (req, res) => {
  try {
    const userId = req.user?.id || 0;
    req.body.ip=req.ip||0
    const result = await upsertRecord(Extras, req.body, userId);

    return successResponse(res, "ExtraCharge upsert successful", { result });
  } catch (error) {
    return errorResponse(res, "Error upserting ExtraCharge", error.message);
  }
};

export const getExtras = async (req, res) => {
  try {
    const {
      id,
      base_vehicle_id,
      extras_master_id,
      extra_value_type,
      extra_value,
      created_by,
      modified_by,
      status,
      ip,
    } = req.query;

    const where = {};
    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (extras_master_id) where.extras_master_id = extras_master_id;
    if (extra_value_type) where.extra_value_type = extra_value_type;
    if (extra_value) where.extra_value = extra_value;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;
    if (status) where.status = status;
    if (ip) where.ip = ip;

    const extras = await Extras.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Extras retrieved successfully",
      data: extras,
    });
  } catch (error) {
    console.error("Error fetching extras:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch extras",
      error: error.message,
    });
  }
};
