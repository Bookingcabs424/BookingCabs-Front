// controllers/nightChargeController.js
import PeakTimeCharge from "../models/peakTimeChargeModel.js";
import { upsertRecord } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const upsertPeakTimeCharge = async (req, res) => {
  try {
    const userId = req.user?.id || 0;
    console.log(req.body,"ss")
    const result = await upsertRecord(PeakTimeCharge, req.body, userId);

    return successResponse(res, "NightCharge upsert successful", { result });
  } catch (error) {
    return errorResponse(res, "Error upserting NightCharge", error.message);
  }
};
// controllers/peakTimeChargeController.js

export const getPeakTimeCharges = async (req, res) => {
  try {
    const {
      id,
      base_vehicle_id,
      start_time,
      end_time,
      peaktime_type,
      peaktime_value,
      created_by,
      modified_by,
      status,
      ip,
    } = req.query;

    // Build where condition dynamically
    const where = {};
    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (start_time) where.start_time = start_time;
    if (end_time) where.end_time = end_time;
    if (peaktime_type) where.peaktime_type = peaktime_type;
    if (peaktime_value) where.peaktime_value = peaktime_value;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;
    if (status) where.status = status;
    if (ip) where.ip = ip;

    const peakTimeCharges = await PeakTimeCharge.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Peak time charges retrieved successfully",
      data: peakTimeCharges,
    });
  } catch (error) {
    console.error("Error fetching peak time charges:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch peak time charges",
      error: error.message,
    });
  }
};
