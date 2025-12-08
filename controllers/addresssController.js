import { Op } from "sequelize";
import MasterAddress from "../models/masterAddressModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import AirportRailway from "../models/airportRailwayModel.js";

// Controller function to get address data
export const getAddressData = async (req, res) => {
  try {
    const { city_id, address } = req.query;
    // Build where clause dynamically
    let where = {};
    if (city_id) {
      where.city_id = Number(city_id);
    }
    if (address) {
      where.address = { [Op.like]: `%${address}%` };
    }

    const data = await MasterAddress.findAll({
      where,
      limit: address ? 10 : undefined,
    });

    if (data.length > 0) {
      return successResponse(res, "Get Address Successfully", data, 200);
    } else {
        return errorResponse(res, "No Address Found!","null",404);
    }
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", null, 500);
  }
};

export const getAirportAddresses = async (req, res) => {
  try {
    const { city_id } = req.query;
    if (!city_id) {
      return errorResponse(res, "city_id is required", null, 400);
    }

    const result = await AirportRailway.findAll({
      where: { city_id ,pickup_type:"DEPARTURE"},
     
    });

    return successResponse(res, "Airport address count fetched", result , 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal Server Error", null, 500);
  }
};