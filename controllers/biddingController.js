import { Op } from "sequelize";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS_CODE } from "../constants/const.js";
import BiddingDataView from "../views/viewBiddingData.js";

import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from 'sequelize';
import BaseCombination from "../models/baseCombinationModel.js";
import CityDistanceList from "../models/cityDistanceModel.js";
import BaseVehicleType from "../models/baseVehicleTypeModel.js";
import OnewayCityRoutePackage from "../models/oneWayCityRoutePackage.js";
import PackageActiveTimeslot from "../models/packageActiveTimeslotModel.js";
import PackageActiveWeekdays from "../models/packageActiveWeekdaysModel.js";
import CityTollTax from "../models/cityTollModel.js";
import BiddingFare from "../models/biddingFareModel.js";
import NightCharge from "../models/nightChargeModel.js";
import dateFormat from "dateformat";

export const addBiddingData = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  const {
    fare_type,
    company_id,
    vendor_id,
    country_id,
    state_id,
    city_id,
    master_package_id,
    master_package_mode_id,
    date_from,
    date_to,
    created_date,
    created_by,
    ip,
    status,
    currency,
  } = req.body;
  const user_id = req?.user?.id || 1;
  const newStatus = status == "" ? "1" : "1";
  try {
    const results = BaseCombination.create({
      fare_type,
      company_id,
      vendor_id,
      country_id,
      state_id,
      city_id,
      master_package_id,
      master_package_mode_id,
      date_from,
      date_to,
      created_date,
      created_by: user_id,
      ip,
      status: newStatus,
      currency,
    });
    if (isInternalCall) {
      return results;
    }
    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, { results });
  } catch (error) {
    if (isInternalCall) {
      throw Error;
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

// export const getBidding = async (req, res) => {
//   try {
//     const {
//       city_distance_id,
//       route_id,
//       driver_id,
//       source_city,
//       destination_city,
//       multi_vehicle_type,
//       from_date,
//       to_date,
//       user_id,
//       page = 1,
//       limit = 10,
//     } = req.body;

//     const whereClause = {
//       ...(city_distance_id && { city_distance_id }),
//       ...(route_id && { route_id }),
//       ...(driver_id && { vendor_id: driver_id }),
//       ...(source_city && { source_city_id: source_city }),
//       ...(destination_city && { destination_city_id: destination_city }),
//       ...(user_id && { created_by: user_id }),
//       ...(multi_vehicle_type && {
//         vehicle_type_id: {
//           [Op.in]: multi_vehicle_type.split(",").map((v) => Number(v)),
//         },
//       }),
//       ...(from_date &&
//         to_date && {
//           [Op.and]: [
//             sequelize.literal(
//               `STR_TO_DATE(to_date, '%Y-%m-%d %H:%i:%s') >= '${from_date}'`
//             ),
//             sequelize.literal(
//               `STR_TO_DATE(from_date, '%Y-%m-%d %H:%i:%s') <= '${to_date}'`
//             ),
//           ],
//         }),
//     };

//     const offset = (parseInt(page) - 1) * parseInt(limit);

//     const { count, rows } = await BiddingDataView.findAndCountAll({
//       where: whereClause,
//       order: [["route_id", "DESC"]],
//       offset,
//       limit: parseInt(limit),
//     });

//     if (rows.length > 0) {
//       return successResponse(res, MESSAGES.USER_UPDATED, {
//         results: rows,
//         total: count,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages: Math.ceil(count / limit),
//       });
//     } else {
//       return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, {});
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

export const getBidding = async (req, res) => {
  try {
    const {
      city_distance_id,
      route_id,
      driver_id,
      source_city,
      destination_city,
      multi_vehicle_type,
      from_date,
      to_date,
      user_id,
    } = req.body;

    let sql = `
                SELECT 
                    vbc.id AS route_id,
                    vbc.status, 
                    bvt.base_vehicle_id as base_vehicle_id, 
                    bvt.vehicle_type_id as vehicle_type_id, 
                    vbvt.vehicle_type, 
                    master_package.name AS package_name, 
                    master_package_mode.package_mode, 
                    driver.first_name, 
                    driver.last_name, 
                    driver.email, 
                    driver.mobile, 
                    dfare.minimum_charge, 
                    dfare.luggage_carrier, 
                    dfare.minimum_distance, 
                    dfare.per_km_charge, 
                    dfare.currency, 
                    DATE_FORMAT(vbc.date_from,"%Y-%m-%d %H:%i:%s") AS from_date,
                    DATE_FORMAT(vbc.date_to,"%Y-%m-%d %H:%i:%s") AS to_date,
                    DATE_FORMAT(vbc.created_date,"%Y-%m-%d %H:%i:%s") AS created_date,
                    night_charge.night_rate_begins,
                    night_charge.night_rate_ends,
                    night_charge.night_rate_type,
                    city_toll_tax.toll, 
                    city_toll_tax.parking, 
                    night_charge.night_rate_value AS driver_allowance, 
                    oneway.city_distance_id, 
                    cdl.distance_km, 
                    sourcecity.id AS source_city_id, 
                    sourcecity.name AS source_city_name, 
                    sourcecity.state_name AS source_state_name, 
                    sourcecity.country_code AS source_country_code, 
                    destinationcity.id AS destination_city_id, 
                    destinationcity.name AS destination_city_name, 
                    destinationcity.state_name AS destination_state_name, 
                    destinationcity.country_code AS destination_country_code, 
                    pat.start_time, 
                    pat.end_time  
                FROM base_combination as vbc 
                LEFT JOIN base_vehicle_type as bvt ON vbc.id = bvt.base_comb_id 
                LEFT JOIN master_vehicle_type AS vbvt ON bvt.vehicle_type_id = vbvt.id 
                LEFT JOIN master_package ON vbc.master_package_id = master_package.id 
                LEFT JOIN master_package_mode ON vbc.master_package_mode_id = master_package_mode.id 
                LEFT JOIN user AS driver ON vbc.vendor_id = driver.id 
                LEFT JOIN bidding_fare AS dfare ON bvt.base_vehicle_id = dfare.base_vehicle_id  
                LEFT JOIN city_toll_tax ON bvt.base_vehicle_id = city_toll_tax.base_vehicle_id  
                LEFT JOIN night_charge ON bvt.base_vehicle_id = night_charge.base_vehicle_id 
                LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id 
                LEFT JOIN city_distance_list AS cdl ON oneway.city_distance_id = cdl.id 
                LEFT JOIN package_active_timeslot AS pat ON bvt.base_vehicle_id = pat.base_vehicle_id 
                LEFT JOIN master_city AS sourcecity ON cdl.source_city = sourcecity.id 
                LEFT JOIN master_city AS destinationcity ON cdl.destination_city = destinationcity.id 
                WHERE 1 = 1 
                AND vbc.status != "2" 
                AND vbc.master_package_id = 5 
                AND vbc.fare_type = "BIDDING" 
                AND sourcecity.id != ""
            `;

    const replacements = {};

    if (city_distance_id && city_distance_id !== "") {
      sql += " AND oneway.city_distance_id = :city_distance_id";
      replacements.city_distance_id = city_distance_id;
    }

    if (route_id && route_id !== "") {
      sql += " AND vbc.id = :route_id";
      replacements.route_id = route_id;
    }

    if (driver_id && driver_id !== "") {
      sql += " AND vbc.vendor_id = :driver_id";
      replacements.driver_id = driver_id;
    }

    if (source_city && source_city !== "") {
      sql += " AND sourcecity.id = :source_city";
      replacements.source_city = source_city;
    }

    if (destination_city && destination_city !== "") {
      sql += " AND destinationcity.id = :destination_city";
      replacements.destination_city = destination_city;
    }

    if (multi_vehicle_type && multi_vehicle_type !== "") {
      const vehicleTypes = multi_vehicle_type
        .split(",")
        .map((item) => item.trim());
      sql += " AND bvt.vehicle_type_id IN (:vehicleTypes)";
      replacements.vehicleTypes = vehicleTypes;
    }

    if (from_date && to_date && from_date !== "" && to_date !== "") {
      sql += " AND dfare.date_from >= :from_date AND dfare.date_to <= :to_date";
      replacements.from_date = from_date;
      replacements.to_date = to_date;
    }

    if (user_id && user_id !== "") {
      sql += " AND vbc.created_by = :user_id";
      replacements.user_id = user_id;
    }

    sql += " ORDER BY vbc.id DESC";

    const results = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements,
    });

    if (results.length > 0) {
      res.json({
        status: "success",
        data: results,
      });
    } else {
      res.status(404).json({
        status: "failed",
        error: "No Record Found",
      });
    }
  } catch (error) {
    console.error("Error in getBidding:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getKilometer = async (req, res) => {
  try {
    const { source_id, destination_id } = req.body;

    const distance = await CityDistanceList.findOne({
      where: {
        source_city: source_id,
        destination_city: destination_id,
      },
      attributes: ["total_distance", "distance_km", "id"],
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { distance });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const addVendorBaseVehicleType = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }

  try {
    const {
      base_vehicle_id: base_comb_id,
      vehicle_type_id,
      created_by,
      ip,
    } = req.body;

    const created_date = new Date(); // safer than relying on frontend

    const insertedData = await BaseVehicleType.create({
      base_comb_id,
      vehicle_type_id,
      created_date,
      created_by,
      ip,
    });

    if (isInternalCall) {
      return insertedData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
        insertedData,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
  }
};

export const addOnewayCity = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }

  try {
    const { base_vehicle_id, city_distance_id, via_city, created_by } =
      req.body;

    const created_date = new Date();

    const insertData = {
      base_vehicle_id,
      city_distance_id,
      via_city,
      created_by,
      created_date,
    };

    Object.keys(insertData).forEach((key) => {
      if (insertData[key] === undefined || insertData[key] === "") {
        delete insertData[key];
      }
    });

    const insertedData = await OnewayCityRoutePackage.create(insertData);

    if (isInternalCall) {
      return insertedData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
        insertedData,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
  }
};

export const addDistanceFare = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }

  try {
    const {
      base_vehicle_id,
      minimum_charge,
      minimum_distance,
      per_km_charge,
      date_from,
      date_to,
      start_time,
      end_time,
      currency,
      luggage_carrier,
      created_by,
      ip,
    } = req.body;

    const created_date = new Date();
    const newCurreny = currency == 1 ? "INR" : "USD";
    const insertData = {
      base_vehicle_id,
      minimum_charge,
      minimum_distance,
      per_km_charge,
      date_from,
      date_to,
      start_time,
      end_time,
      currency: newCurreny,
      luggage_carrier,
      created_date,
      created_by,
      status: "1",
      ip,
      accumulated_instance: "off",
      modified_by: created_by,
      round_up_km: "off",
      modified_date: created_date,
    };

    Object.keys(insertData).forEach((key) => {
      if (insertData[key] === undefined || insertData[key] === "") {
        delete insertData[key];
      }
    });

    const insertedData = await BiddingFare.create(insertData);

    if (isInternalCall) {
      return insertedData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
        insertedData,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
  }
};

export const addPackageActiveTime = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }

  try {
    const { base_vehicle_id, start_time, end_time, created_by, ip } = req.body;

    const created_date = new Date();

    const insertData = {
      base_vehicle_id,
      start_time,
      end_time,
      created_date,
      created_by,
      status: 1,
      ip,
    };

    // Remove keys with undefined or empty string values
    Object.keys(insertData).forEach((key) => {
      if (insertData[key] === undefined || insertData[key] === "") {
        delete insertData[key];
      }
    });

    const insertedData = await PackageActiveTimeslot.create(insertData);

    if (isInternalCall) {
      return insertedData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
        insertedData,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
  }
};

export const addPackageActiveWeekdays = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }

  try {
    const { base_vehicle_id, week_days, created_by } = req.body;
    const created_date = new Date();

    if (!week_days || typeof week_days !== "string") {
      const message = "Invalid or missing `week_days`";
      if (isInternalCall) throw new Error(message);
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }

    const weekdaysArr = week_days
      .split(",")
      .map((day) => day.trim())
      .filter((day) => day !== "");

    if (weekdaysArr.length === 0) {
      const message = "No valid weekdays provided.";
      if (isInternalCall) throw new Error(message);
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }

    const insertRows = weekdaysArr.map((weekday_id) => ({
      base_vehicle_id,
      weekdays_id: weekday_id,
      created_date,
      created_by,
    }));

    const insertedData = await PackageActiveWeekdays.bulkCreate(insertRows);

    if (isInternalCall) {
      return insertedData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
        insertedData,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
  }
};

export const addTollTax = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }

  try {
    const { base_vehicle_id, toll, parking, created_by } = req.body;

    const created_date = new Date();

    const insertData = {
      base_vehicle_id,
      toll,
      parking,
      created_date,
      created_by,
    };

    Object.keys(insertData).forEach((key) => {
      if (insertData[key] === undefined || insertData[key] === "") {
        delete insertData[key];
      }
    });

    const insertedData = await CityTollTax.create(insertData);

    if (isInternalCall) {
      return insertedData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
        insertedData,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
  }
};

export const addDriverAllowance = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }

  try {
    const {
      base_vehicle_id,
      night_rate_type,
      night_rate_begins,
      night_rate_ends,
      driver_allowance,
      created_by,
      ip,
    } = req.body;

    const created_date = new Date();

    const insertData = {
      base_vehicle_id,
      night_rate_type,
      night_rate_begins,
      night_rate_ends,
      night_rate_value: driver_allowance,
      created_date,
      created_by,
      ip,
    };

    Object.keys(insertData).forEach((key) => {
      if (insertData[key] === undefined || insertData[key] === "") {
        delete insertData[key];
      }
    });

    const insertedData = await NightCharge.create(insertData);

    if (isInternalCall) {
      return insertedData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
        insertedData,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
  }
};
// Add Bidding Data Sequentially
export const biddingSequential = async (req, res) => {
  try {
    const currentDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    req.body.created_date = currentDate;
    req.body.vendor_id = req?.user?.id || 1;
    const result1 = await addBiddingData(req, res, true);

    if (result1 && result1.id) {
      req.body.base_vehicle_id = result1.id;
      req.body.created_by = req?.user?.id || 1;
      const result2 = await addVendorBaseVehicleType(req, res, true);
      console.log(result2);
      console.log("after result2");
      req.body.base_vehicle_id = result2.base_vehicle_id;
      const result3 = await addOnewayCity(req, res, true);
      const result4 = await addDistanceFare(req, res, true);
      const result5 = await addPackageActiveTime(req, res, true);
      let result6 = null;
      if (req.body.week_days !== undefined && req.body.week_days !== "") {
        result6 = await addPackageActiveWeekdays(req, res, true);
      }
      const result7 = await addTollTax(req, res, true);
      const result8 = await addDriverAllowance(req, res, true);

      const finalResult = {
        status: "success",
        data: {
          message: MESSAGES.GENERAL.DATA_INSERTED,
          base_vehicle_id: result2.id,
          bidding_id: result1.id,
          onewayCity: result3,
          fare: result4,
          timeslot: result5,
          weekdays: result6,
          tollTax: result7,
          nightCharge: result8,
        },
      };

      return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
        finalResult,
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        STATUS_CODE.SERVER_ERROR
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

export const lowestOneWayFare = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  const { country_id, city_id, source_city_id, destination_city_id } = req.body;

  try {
    let query = `
      SELECT  
        bc.id AS base_comb_id,
        DATE_FORMAT(bc.date_from, '%Y-%m-%d') AS date_from,
        DATE_FORMAT(bc.date_to, '%Y-%m-%d') AS date_to,
        pat.start_time, 
        pat.end_time, 
        bc.city_id,
        mp.id AS master_package_id, 
        mp.name AS package_name, 
        mp.image,  
        mpm.id AS master_package_mode_id,
        mpm.package_mode,
        bvt.base_vehicle_id,
        mvt.id AS master_vehicle_type_id,
        mvt.vehicle_type,
        mvt.vehicle_image,
        mvt.seating_capacity,
        mvt.luggage,
        CONCAT(vendor.first_name, ' ', vendor.last_name) AS vendor_name,
        vendor.email AS vendor_email,
        vendor.mobile AS vendor_mobile,
        MIN(COALESCE(distance_fare.minimum_charge, bidding_fare.minimum_charge)) AS minimun_charge,
        oneway.city_distance_id,
        citylist.source_city AS source_city_id,
        citylist.destination_city AS destination_city_id,
        sourcecity.name AS source_city_name,
        destinationcity.name AS destination_city_name
      FROM base_combination AS bc
      LEFT JOIN master_package_mode AS mpm ON bc.master_package_mode_id = mpm.id
      LEFT JOIN master_package AS mp ON bc.master_package_id = mp.id
      LEFT JOIN base_vehicle_type AS bvt ON bc.id = bvt.base_comb_id
      LEFT JOIN master_vehicle_type AS mvt ON bvt.vehicle_type_id = mvt.id
      LEFT JOIN package_active_timeslot AS pat ON bvt.base_vehicle_id = pat.base_vehicle_id
      LEFT JOIN user AS vendor ON bc.vendor_id = vendor.id
      LEFT JOIN distance_fare ON bvt.base_vehicle_id = distance_fare.base_vehicle_id
      LEFT JOIN bidding_fare ON bvt.base_vehicle_id = bidding_fare.base_vehicle_id
      LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
      LEFT JOIN city_distance_list AS citylist ON oneway.city_distance_id = citylist.id
      LEFT JOIN master_city AS sourcecity ON citylist.source_city = sourcecity.id
      LEFT JOIN master_city AS destinationcity ON citylist.destination_city = destinationcity.id
      WHERE bc.master_package_id = 5
        AND bc.status = '1'
        AND bc.date_from <= CURDATE()
        AND bc.date_to >= CURDATE()
    `;

    if (country_id) {
      query += ` AND bc.country_id = '${country_id}'`;
    }
    if (city_id) {
      query += ` AND citylist.source_city = '${city_id}'`;
    }
    if (source_city_id) {
      query += ` AND citylist.source_city = '${source_city_id}'`;
    }
    if (destination_city_id) {
      query += ` AND citylist.destination_city = '${destination_city_id}'`;
    }

    query += `
      GROUP BY citylist.source_city
      ORDER BY sourcecity.name ASC
      LIMIT 0, 10
    `;

    const [results] = await sequelize.query(query);

    if (results.length > 0) {
      const message = { status: "success", data: results };
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results);
    } else {
      const message = { status: "failed", error: "No Record Found", data: [] };
      if (isInternalCall) return message;
      return errorResponse(
        res,
        message.error,
        message.data,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    if (isInternalCall) throw error;

    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getLowestBiddingFare = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  const { country_id, city_id, source_city_id, destination_city_id } = req.body;

  try {
    let query = `
      SELECT 
        bc.id AS base_comb_id,
        DATE_FORMAT(bf.date_from, '%Y-%m-%d') AS date_from,
        DATE_FORMAT(bf.date_to, '%Y-%m-%d') AS date_to,
        MIN(bf.minimum_charge) AS minimun_charge,
        mpm.id AS master_package_mode_id,
        mpm.package_mode,
        mp.id AS master_package_id,
        mp.name AS package_name,
        mp.image,
        bvt.base_vehicle_id,
        mvt.id AS master_vehicle_type_id,
        mvt.vehicle_type,
        mvt.vehicle_image,
        mvt.seating_capacity,
        mvt.luggage,
        pat.start_time,
        pat.end_time,
        CONCAT(vendor.first_name, ' ', vendor.last_name) AS vendor_name,
        vendor.email AS vendor_email,
        vendor.mobile AS vendor_mobile,
        oneway.city_distance_id,
        citylist.source_city AS source_city_id,
        citylist.destination_city AS destination_city_id,
        sourcecity.name AS source_city_name,
        destinationcity.name AS destination_city_name
      FROM base_combination AS bc
      LEFT JOIN master_package_mode AS mpm ON bc.master_package_mode_id = mpm.id
      LEFT JOIN master_package AS mp ON bc.master_package_id = mp.id
      LEFT JOIN base_vehicle_type AS bvt ON bc.id = bvt.base_comb_id
      LEFT JOIN bidding_fare AS bf ON bvt.base_vehicle_id = bf.base_vehicle_id
      LEFT JOIN master_vehicle_type AS mvt ON bvt.vehicle_type_id = mvt.id
      LEFT JOIN package_active_timeslot AS pat ON bvt.base_vehicle_id = pat.base_vehicle_id
      LEFT JOIN user AS vendor ON bc.vendor_id = vendor.id
      LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
      LEFT JOIN city_distance_list AS citylist ON oneway.city_distance_id = citylist.id
      LEFT JOIN master_city AS sourcecity ON citylist.source_city = sourcecity.id
      LEFT JOIN master_city AS destinationcity ON citylist.destination_city = destinationcity.id
      WHERE bc.master_package_id = 5
        AND bf.status = '1'
        AND bf.date_from <= CURDATE()
        AND bf.date_to >= CURDATE()
    `;

    if (city_id) {
      query += ` AND citylist.source_city = '${city_id}'`;
    }
    if (source_city_id) {
      query += ` AND citylist.source_city = '${source_city_id}'`;
    }
    if (destination_city_id) {
      query += ` AND citylist.destination_city = '${destination_city_id}'`;
    }

    query += `
      GROUP BY citylist.source_city
      ORDER BY sourcecity.name ASC
      LIMIT 0, 10
    `;

    const results = await sequelize.query(query);

    if (results.length > 0) {
      if (isInternalCall) return true;
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    } else {
      if (isInternalCall) return message;
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, null);
    }
  } catch (error) {
    if (isInternalCall) throw error;
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

const sortByTotalChargeAsc = (data) => {
  return [...data].sort((a, b) => a.total_charge - b.total_charge);
};

export const lowestFareSeq = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }

  try {
    let finalResult = [];

    const lowestOneWayDataArray = await getLowestOneWayFare(req, res, true);
    let lowestOneWayData = [];

    if (lowestOneWayDataArray?.status === "success") {
      lowestOneWayData = lowestOneWayDataArray.data ?? [];

      lowestOneWayData = lowestOneWayData.map((item) => {
        const {
          minimun_charge = 0,
          driver_allowance = 0,
          toll_tax = 0,
          parking_charge = 0,
          city_tax = 0,
        } = item;

        const total_charge =
          Number(minimun_charge) +
          Number(driver_allowance) +
          Number(toll_tax) +
          Number(parking_charge) +
          Number(city_tax);

        return {
          ...item,
          driver_allowance: Number(driver_allowance),
          total_charge,
        };
      });
    }

    const lowestBiddingDataArray = await getLowestBiddingFare(req, res, true);
    let lowestBiddingData = [];

    if (lowestBiddingDataArray?.status === "success") {
      lowestBiddingData = lowestBiddingDataArray.data ?? [];

      lowestBiddingData = lowestBiddingData.map((item) => {
        const {
          minimun_charge = 0,
          driver_allowance = 0,
          toll_tax = 0,
          parking_charge = 0,
          city_tax = 0,
        } = item;

        const total_charge =
          Number(minimun_charge) +
          Number(driver_allowance) +
          Number(toll_tax) +
          Number(parking_charge) +
          Number(city_tax);

        return {
          ...item,
          driver_allowance: Number(driver_allowance),
          total_charge,
        };
      });
    }

    const mergedFares = [...lowestOneWayData, ...lowestBiddingData];

    if (mergedFares.length > 0) {
      const sortedFares = sortByTotalChargeAsc(mergedFares);

      if (isInternalCall) {
        return sortedFares;
      }

      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        sortedFares,
      });
    } else {
      if (isInternalCall) {
        return false;
      }
      return errorResponse(res, GENERAL.MESSAGES.NO_DATA_FOUND, null);
    }
  } catch (error) {
    if (isInternalCall) throw error;

    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getLowestOneWayFare = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  const { country_id, city_id, source_city_id, destination_city_id } = req.body;

  try {
    let query = `
      SELECT 
        bc.id AS base_comb_id,
        DATE_FORMAT(bc.date_from, '%Y-%m-%d') AS date_from,
        DATE_FORMAT(bc.date_to, '%Y-%m-%d') AS date_to,
        pat.start_time, pat.end_time,
        bc.city_id,
        mp.id AS master_package_id,
        mp.name AS package_name,
        mp.image,
        mpm.id AS master_package_mode_id,
        mpm.package_mode,
        bvt.base_vehicle_id,
        mvt.id AS master_vehicle_type_id,
        mvt.vehicle_type,
        mvt.vehicle_image,
        mvt.seating_capacity,
        mvt.luggage,
        CONCAT(vendor.first_name, ' ', vendor.last_name) AS vendor_name,
        vendor.email AS vendor_email,
        vendor.mobile AS vendor_mobile,
        MIN(COALESCE(distance_fare.minimum_charge, bidding_fare.minimum_charge)) AS minimun_charge,
        distance_fare.minimum_distance,
        distance_fare.per_km_charge,
        oneway.city_distance_id,
        citylist.source_city AS source_city_id,
        citylist.destination_city AS destination_city_id,
        sourcecity.name AS source_city_name,
        destinationcity.name AS destination_city_name,
        nc.night_rate_value AS driver_allowance,
        ctt.toll AS toll_tax,
        ctt.parking AS parking_charge,
        ctt.city_tax AS city_tax
      FROM base_combination AS bc
      LEFT JOIN master_package_mode AS mpm ON bc.master_package_mode_id = mpm.id
      LEFT JOIN master_package AS mp ON bc.master_package_id = mp.id
      LEFT JOIN base_vehicle_type AS bvt ON bc.id = bvt.base_comb_id
      LEFT JOIN master_vehicle_type AS mvt ON bvt.vehicle_type_id = mvt.id
      LEFT JOIN package_active_timeslot AS pat ON bvt.base_vehicle_id = pat.base_vehicle_id
      LEFT JOIN user AS vendor ON bc.vendor_id = vendor.id
      LEFT JOIN distance_fare ON bvt.base_vehicle_id = distance_fare.base_vehicle_id
      LEFT JOIN bidding_fare ON bvt.base_vehicle_id = bidding_fare.base_vehicle_id
      LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
      LEFT JOIN city_distance_list AS citylist ON oneway.city_distance_id = citylist.id
      LEFT JOIN master_city AS sourcecity ON citylist.source_city = sourcecity.id
      LEFT JOIN master_city AS destinationcity ON citylist.destination_city = destinationcity.id
      LEFT JOIN night_charge AS nc ON bvt.base_vehicle_id = nc.base_vehicle_id
      LEFT JOIN city_toll_tax AS ctt ON bvt.base_vehicle_id = ctt.base_vehicle_id
      WHERE bc.master_package_id = 5
        AND bc.status = '1'
        AND bc.date_from <= CURDATE()
        AND bc.date_to >= CURDATE()
    `;

    if (country_id) {
      query += ` AND bc.country_id = '${country_id}'`;
    }
    if (city_id) {
      query += ` AND citylist.source_city = '${city_id}'`;
    }
    if (source_city_id) {
      query += ` AND citylist.source_city = '${source_city_id}'`;
    }
    if (destination_city_id) {
      query += ` AND citylist.destination_city = '${destination_city_id}'`;
    }

    query += `
      GROUP BY citylist.source_city
      ORDER BY sourcecity.name ASC
      LIMIT 0, 1
    `;

    const results = await sequelize.query(query);

    if (results.length > 0) {
      const response = { status: "success", data: results };
      if (isInternalCall) return response;
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    } else {
      const response = {
        status: "failed",
        message: "No record found",
        data: [],
      };
      if (isInternalCall) return response;
      return errorResponse(
        res,
        response.message,
        response.data,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    if (isInternalCall) throw error;
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const lowestBiddingFare = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  const { country_id, city_id, source_city_id, destination_city_id } = req.body;

  try {
    let query = `
      SELECT 
        bc.id AS base_comb_id,
        DATE_FORMAT(bf.date_from, '%Y-%m-%d') AS date_from,
        DATE_FORMAT(bf.date_to, '%Y-%m-%d') AS date_to,
        MIN(bf.minimum_charge) AS minimun_charge,
        bf.minimum_distance,
        bf.per_km_charge,
        mpm.id AS master_package_mode_id,
        mpm.package_mode,
        mp.id AS master_package_id,
        mp.name AS package_name,
        mp.image,
        bvt.base_vehicle_id,
        mvt.id AS master_vehicle_type_id,
        mvt.vehicle_type,
        mvt.vehicle_image,
        mvt.seating_capacity,
        mvt.luggage,
        pat.start_time,
        pat.end_time,
        CONCAT(vendor.first_name, ' ', vendor.last_name) AS vendor_name,
        vendor.email AS vendor_email,
        vendor.mobile AS vendor_mobile,
        oneway.city_distance_id,
        citylist.source_city AS source_city_id,
        citylist.destination_city AS destination_city_id,
        sourcecity.name AS source_city_name,
        destinationcity.name AS destination_city_name,
        nc.night_rate_value AS driver_allowance,
        ctt.toll AS toll_tax,
        ctt.parking AS parking_charge,
        ctt.city_tax AS city_tax
      FROM base_combination AS bc
      LEFT JOIN master_package_mode AS mpm ON bc.master_package_mode_id = mpm.id
      LEFT JOIN master_package AS mp ON bc.master_package_id = mp.id
      LEFT JOIN base_vehicle_type AS bvt ON bc.id = bvt.base_comb_id
      LEFT JOIN bidding_fare AS bf ON bvt.base_vehicle_id = bf.base_vehicle_id
      LEFT JOIN master_vehicle_type AS mvt ON bvt.vehicle_type_id = mvt.id
      LEFT JOIN package_active_timeslot AS pat ON bvt.base_vehicle_id = pat.base_vehicle_id
      LEFT JOIN user AS vendor ON bc.vendor_id = vendor.id
      LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
      LEFT JOIN city_distance_list AS citylist ON oneway.city_distance_id = citylist.id
      LEFT JOIN master_city AS sourcecity ON citylist.source_city = sourcecity.id
      LEFT JOIN master_city AS destinationcity ON citylist.destination_city = destinationcity.id
      LEFT JOIN night_charge AS nc ON bvt.base_vehicle_id = nc.base_vehicle_id
      LEFT JOIN city_toll_tax AS ctt ON bvt.base_vehicle_id = ctt.base_vehicle_id
      WHERE bc.master_package_id = 5
        AND bf.status = '1'
        AND bf.date_from <= CURDATE()
        AND bf.date_to >= CURDATE()
    `;

    // Apply optional filters
    if (country_id) {
      query += ` AND bc.country_id = '${country_id}'`;
    }
    if (city_id) {
      query += ` AND citylist.source_city = '${city_id}'`;
    }
    if (source_city_id) {
      query += ` AND citylist.source_city = '${source_city_id}'`;
    }
    if (destination_city_id) {
      query += ` AND citylist.destination_city = '${destination_city_id}'`;
    }

    query += `
      GROUP BY citylist.source_city
      ORDER BY sourcecity.name ASC
      LIMIT 0, 1
    `;

    const [results] = await sequelize.query(query);

    if (results.length > 0) {
      const response = { status: "success", data: results };
      if (isInternalCall) return response;
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results);
    } else {
      const response = {
        status: "failed",
        message: "No record found",
        data: [],
      };
      if (isInternalCall) return response;
      return errorResponse(
        res,
        response.message,
        response.data,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    if (isInternalCall) throw error;
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const deleteBidding = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const { bid_id, status } = req.body;
    const driverId = req?.user?.id ?? 1;
    if (!driverId || !bid_id || typeof status === "undefined") {
      const message = "Missing required fields: driverId, bid_id, or status";
      if (isInternalCall) throw new Error(message);
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }

    // Support for both array and comma-separated string
    const bidIds = Array.isArray(bid_id)
      ? bid_id
      : bid_id
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

    const [updatedCount] = await BaseCombination.update(
      { status: String(status), modified_by: driverId },
      { where: { id: bidIds }, logging: console.log }
    );

    if (updatedCount > 0) {
      const message = "Bid details updated successfully";
      const response = { status: "success", data: message };
      if (isInternalCall) return response;
      return successResponse(res, message, null);
    } else {
      const message = "No records were updated";
      const response = { status: "failed", data: message };
      if (isInternalCall) return response;
      return errorResponse(res, message, null, STATUS_CODE.NOT_FOUND);
    }
  } catch (error) {
    if (isInternalCall) throw error;

    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const updateBidding = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const {
      route_id,
      city_id,
      from_date,
      to_date,
      modified_by,
      ip,
      vehicle_type_id,
      city_distance_id,
      via_city,
      minimum_charge,
      minimum_distance,
      per_km_charge,
      toll,
      parking,
      driver_allowance,
      start_time,
      end_time,
    } = req.body;

    if (!route_id) {
      const msg = "Missing required field: route_id";
      if (isInternalCall) throw new Error(msg);
      return errorResponse(res, msg, null, STATUS_CODE.BAD_REQUEST);
    }

    const formattedFromDate = from_date
      ? dateFormat(from_date, "yyyy-mm-dd")
      : undefined;
    const formattedToDate = to_date
      ? dateFormat(to_date, "yyyy-mm-dd")
      : undefined;

    await BaseCombination.update(
      {
        city_id,
        date_from: formattedFromDate,
        date_to: formattedToDate,
        modified_by,
        ip,
      },
      { where: { id: route_id } }
    );
    const baseVehicleRecord = await BaseVehicleType.findOne({
      where: { base_comb_id: route_id },
    });
    if (!baseVehicleRecord) {
      const msg = "Base vehicle not found for the given route_id";
      if (isInternalCall) throw new Error(msg);
      return errorResponse(res, msg, null, STATUS_CODE.NOT_FOUND);
    }

    const base_vehicle_id = baseVehicleRecord.base_vehicle_id;

    await BaseVehicleType.update(
      {
        vehicle_type_id,
        modified_by,
        ip,
      },
      { where: { base_vehicle_id } }
    );
    await OnewayCityRoutePackage.update(
      {
        city_distance_id,
        via_city,
        modified_by,
      },
      { where: { base_vehicle_id } }
    );
    await BiddingFare.update(
      {
        minimum_charge,
        minimum_distance,
        per_km_charge,
        modified_by,
        ip,
      },
      { where: { base_vehicle_id } }
    );
    await CityTollTax.update(
      {
        toll,
        parking,
      },
      { where: { base_vehicle_id } }
    );
    await NightCharge.update(
      {
        night_rate_value: driver_allowance,
        modified_by,
        ip,
      },
      { where: { base_vehicle_id } }
    );
    await PackageActiveTimeslot.update(
      {
        start_time,
        end_time,
        modified_by,
        ip,
      },
      { where: { base_vehicle_id } }
    );

    if (isInternalCall) return success;
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
  } catch (error) {
    if (isInternalCall) throw error;
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const getActiveBidding = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const currentDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    let query = `
      SELECT 
        vbc.id AS route_id,
        oneway.city_distance_id,
        sourcecity.id AS source_city_id,
        sourcecity.name AS source_city_name,
        destinationcity.id AS destination_city_id,
        destinationcity.name AS destination_city_name,
        cdl.distance_km,
        vbc.vehicle_type_id,
        vbc.master_package_id,
        master_package.name AS package_name,
        vbc.master_package_mode_id,
        master_package_mode.package_mode,
        dfare.minimum_charge,
        dfare.minimum_distance,
        dfare.per_km_charge,
        DATE_FORMAT(vbc.date_from, "%Y-%m-%d %H:%i:%s") AS from_date,
        DATE_FORMAT(vbc.date_to, "%Y-%m-%d %H:%i:%s") AS to_date,
        vbc.start_time,
        vbc.end_time,
        vbc.status,
        driver.first_name,
        driver.last_name,
        driver.email,
        driver.mobile,
        city_toll_tax.toll,
        city_toll_tax.parking,
        DATE_FORMAT(vbc.created_date, "%Y-%m-%d %H:%i:%s") AS created_date,
        night_charge.night_rate_value AS driver_allowance
      FROM base_combination AS vbc
      LEFT JOIN master_vehicle_type AS vbvt ON vbc.vehicle_type_id = vbvt.id
      INNER JOIN oneway_city_route_package AS oneway ON oneway.base_vehicle_id = vbc.id
      LEFT JOIN city_distance_list AS cdl ON oneway.city_distance_id = cdl.id
      LEFT JOIN master_city AS sourcecity ON cdl.source_city = sourcecity.id
      LEFT JOIN master_city AS destinationcity ON cdl.destination_city = destinationcity.id
      LEFT JOIN bidding_fare AS dfare ON vbc.id = dfare.base_vehicle_id
      LEFT JOIN master_package ON vbc.master_package_id = master_package.id
      LEFT JOIN master_package_mode ON vbc.master_package_mode_id = master_package_mode.id
      LEFT JOIN user AS driver ON vbc.user_id = driver.id
      LEFT JOIN city_toll_tax ON vbc.id = city_toll_tax.base_vehicle_id
      LEFT JOIN night_charge ON vbc.id = night_charge.base_vehicle_id
      WHERE vbc.status != "2"
        AND vbc.date_to >= '${currentDate}' 
        AND vbc.date_from <= '${currentDate}'
      ORDER BY vbc.id DESC
    `;

    const [results] = await sequelize.query(query);

    if (results.length > 0) {
      const response = { status: "success", data: results };
      if (isInternalCall) return response;
      return successResponse(res, response.status, response.data);
    } else {
      const response = { status: "failed", error: "No Record Found" };
      if (isInternalCall) return response;
      return errorResponse(res, response.error, [], STATUS_CODE.NOT_FOUND);
    }
  } catch (error) {
    if (isInternalCall) throw error;

    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateBiddingData = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const {
      route_id,
      city_id,
      date_from,
      date_to,
      modified_by,
      ip,
      currency,
      start_time,
      end_time,
      base_vehicle_id,
    } = req.body;

    if (!route_id) {
      const message = "Missing required field: route_id";
      if (isInternalCall) throw new Error(message);
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }
    await PackageActiveTimeslot.update(
      {
        start_time,
        end_time,
        modified_by,
        ip,
      },
      { where: { base_vehicle_id } }
    );
    const [updatedRowsCount] = await BaseCombination.update(
      {
        city_id,
        date_from,
        date_to,
        modified_by,
        ip,
        currency,
      },
      {
        where: { id: route_id },
      }
    );
    const message = {
      status: "success",
      message: "Data updated successfully",
    };
    if (updatedRowsCount > 0) {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    } else {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    }
  } catch (error) {
    if (isInternalCall) throw error;
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateBaseVehicleTypeData = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const { vehicle_type_id, base_vehicle_id } = req.body;

    if (!vehicle_type_id || !base_vehicle_id) {
      const message =
        "Missing required fields: vehicle_type_id or base_vehicle_id";
      if (isInternalCall) throw new Error(message);
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }

    const [updatedCount] = await BaseVehicleType.update(
      { vehicle_type_id },
      { where: { base_vehicle_id } }
    );

    const message = {
      status: "success",
      message: "Data updated successfully",
    };
    if (updatedCount > 0) {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    } else {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    }
  } catch (error) {
    if (isInternalCall) throw error;
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateOnewayCity = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const { city_distance_id, base_vehicle_id } = req.body;

    if (!city_distance_id || !base_vehicle_id) {
      const message =
        "Missing required fields: city_distance_id or base_vehicle_id";
      if (isInternalCall) throw new Error(message);
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }

    const [updatedCount] = await OnewayCityRoutePackage.update(
      { city_distance_id },
      { where: { base_vehicle_id } }
    );

    const message = {
      status: "success",
      message: "Data updated successfully",
    };
    if (updatedCount > 0) {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    } else {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateDistanceFare = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const {
      minimum_charge,
      minimum_distance,
      per_km_charge,
      date_from,
      date_to,
      start_time,
      end_time,
      currency,
      luggage_carrier,
      base_vehicle_id,
    } = req.body;

    if (!base_vehicle_id) {
      const message = "Missing required field: base_vehicle_id";
      if (isInternalCall) throw new Error(message);
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }

    const updateData = {
      minimum_charge,
      minimum_distance,
      per_km_charge,
      date_from,
      date_to,
      start_time,
      end_time,
      currency,
      luggage_carrier,
    };

    const [updatedCount] = await BiddingFare.update(updateData, {
      where: { base_vehicle_id },
    });

    const message = {
      status: "success",
      message: "Data updated successfully",
    };
    if (updatedCount > 0) {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    } else {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    }
  } catch (error) {
    if (isInternalCall) throw error;
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateTollTaxFare = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const { toll, parking, base_vehicle_id } = req.body;

    if (!base_vehicle_id) {
      const message = "Missing required field: base_vehicle_id";
      if (isInternalCall) throw new Error(message);
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }

    const updateData = {
      toll,
      parking,
    };

    const [updatedCount] = await CityTollTax.update(updateData, {
      where: { base_vehicle_id },
    });

    const message = {
      status: "success",
      message: "Data updated successfully",
    };
    if (updatedCount > 0) {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    } else {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    }
  } catch (error) {
    if (isInternalCall) throw error;
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateDriverFare = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const {
      base_vehicle_id,
      night_rate_type,
      night_rate_begins,
      night_rate_ends,
      driver_allowance,
    } = req.body;

    if (!base_vehicle_id) {
      const message = "Missing required field: base_vehicle_id";
      if (isInternalCall) throw new Error(message);
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }

    const updateData = {
      night_rate_type,
      night_rate_begins,
      night_rate_ends,
      night_rate_value: driver_allowance,
    };

    const [updatedCount] = await NightCharge.update(updateData, {
      where: { base_vehicle_id },
    });

    const message = {
      status: "success",
      message: "Data updated successfully",
    };
    if (updatedCount > 0) {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    } else {
      if (isInternalCall) return message;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, null);
    }
  } catch (error) {
    if (isInternalCall) throw error;
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const biddingSequentialData = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") isInternalCall = false;

  try {
    const currentDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    req.body.created_date = currentDate;

    const result1 = await updateBiddingData(req, res, true);

    if (result1?.status === "success") {
      await updateBaseVehicleTypeData(req, res, true);
      await updateOnewayCity(req, res, true);
      await updateDistanceFare(req, res, true);
      await updateTollTaxFare(req, res, true);
      await updateDriverFare(req, res, true);

      const response = {
        status: "success",
        message: "Data updated successfully",
        data: result1,
      };

      if (isInternalCall) return response;
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, { response });
    } else {
      const response = {
        status: "failed",
        message: "No rows affected during base combination update",
      };
      if (isInternalCall) return response;
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
