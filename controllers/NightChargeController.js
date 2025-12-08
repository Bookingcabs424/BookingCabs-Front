// controllers/nightChargeController.js
import NightCharge from "../models/nightChargeModel.js";
import { upsertRecord } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const upsertNightCharge = async (req, res) => {
  try {
    const userId = req.user?.id || 0;
    const result = await upsertRecord(NightCharge, req.body, userId);

    return successResponse(res, "NightCharge upsert successful", { result });
  } catch (error) {
    return errorResponse(res, "Error upserting NightCharge", error.message);
  }
};
export const getNightCharges = async (req, res) => {
  try {
    const { id, base_vehicle_id, vendor_id, status } = req.query;

    const where = {};
    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (vendor_id) where.vendor_id = vendor_id;
    if (status) where.status = status;

    const nightCharges = await NightCharge.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Night charges retrieved successfully",
      data: nightCharges,
    });
  } catch (error) {
    console.error("Error fetching night charges:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch night charges",
      error: error.message,
    });
  }
};