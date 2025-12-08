import PremiumsFare from "../models/premiumFareModel.js";
import { successResponse, errorResponse } from "../utils/response.js"; 
// adjust paths to your utils

export const upsertPremiumsFare = async (req, res) => {
  try {
    const {
      id, // optional
      base_vehicle_id,
      premiums_type,
      premiums_value,
      status,
      ip,
    } = req.body;

    const userId = req.user?.id || 0;

    let premiumsFare;

    if (id) {
      // find by PK
      premiumsFare = await PremiumsFare.findByPk(id);

      if (premiumsFare) {
        // update
        await premiumsFare.update({
          base_vehicle_id,
          premiums_type,
          premiums_value,
          modified_by: userId,
          modified_date: new Date(),
          status,
          ip,
        });
      } else {
        // create new if id not found
        premiumsFare = await PremiumsFare.create({
          id,
          base_vehicle_id,
          premiums_type,
          premiums_value,
          created_by: userId,
          created_date: new Date(),
          modified_by: userId,
          modified_date: new Date(),
          status,
          ip,
        });
      }
    } else {
      // create new
      premiumsFare = await PremiumsFare.create({
        base_vehicle_id,
        premiums_type,
        premiums_value,
        created_by: userId,
        created_date: new Date(),
        modified_by: userId,
        modified_date: new Date(),
        status,
        ip,
      });
    }

    return successResponse(res, "Premiums Fare upserted successfully", { premiumsFare });
  } catch (error) {
    return errorResponse(res, "Something went wrong while upserting Premiums Fare", error.message);
  }
};

export const getPremiumsFare = async (req, res) => {
  try {
    const {
      id,
      base_vehicle_id,
      premiums_type,
      premiums_value,
      created_by,
      modified_by,
      status,
      ip,
    } = req.query;

    const where = {};
    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (premiums_type) where.premiums_type = premiums_type;
    if (premiums_value) where.premiums_value = premiums_value;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;
    if (status) where.status = status;
    if (ip) where.ip = ip;

    const premiumsFares = await PremiumsFare.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Premiums fare(s) retrieved successfully",
      data: premiumsFares,
    });
  } catch (error) {
    console.error("Error fetching premiums fare:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch premiums fare",
      error: error.message,
    });
  }
};
