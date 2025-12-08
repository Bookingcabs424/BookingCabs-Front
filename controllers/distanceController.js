import axios from "axios";
import { errorResponse, successResponse } from "../utils/response.js";
import { MESSAGES } from "../constants/const.js";
import DistanceFare from "../models/distanceFareModel.js";
import { Op } from "sequelize";
import DistanceHourFare from "../models/distanceHourFareModel.js";
import DistanceUptoRate from "../models/distanceUptoRatesModel.js";
import DistanceWaitingFare from "../models/distanceWaitingFare.js";
import HourlyFare from "../models/hourlyFareModel.js";
import sequelize from "../config/clientDbManager.js";
import LocalPackageFare from "../models/LocalPackageFareModel.js";
import DistanceHourFareLogs from "../models/distanceHourFareLogsModel.js";
import DistanceFareLogs from "../models/distanceFareLogsModel.js";
import DistanceWaitingFareLogs from "../models/distanceWaitingFareLogsModel.js";
import HourlyFareLogs from "../models/hourlyFareLogsModel.js";

export const getDistance = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return errorResponse(
        res,
        "origin and destination are required",
        null,
        400
      );
    }

    const apiKey = process.env.GKEY;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

    const response = await axios.get(url);
    return successResponse(res, "Success", response.data, 200);
  } catch (error) {
    return errorResponse(res, "Failed to fetch distance", error, 500);
  }
};

export const geocodeAddress = async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ error: "address is required" });
    }

    const apiKey = process.env.GKEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await axios.get(url);
    // res.json(response.data);
    return successResponse(
      res,
      "Success",
      response.data.results[0]?.geometry?.location
    );
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

export const getDistanceFares = async (req, res) => {
  try {
    const {
      id,
      base_vehicle_id,
      type_of_dispatch,
      currency,
      status,
      created_by,
      modified_by,
      start_date, // filter for created_date >=
      end_date, // filter for created_date <=
      week_days, // match exact or partial string
      search, // search on rate_type / rate_value
    } = req.query;

    const where = {};

    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = Number(base_vehicle_id);
    if (type_of_dispatch) where.type_of_dispatch = type_of_dispatch;
    if (currency) where.currency = currency;
    if (status) where.status = status;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;

    if (start_date && end_date) {
      where.created_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    } else if (start_date) {
      where.created_date = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.created_date = { [Op.lte]: new Date(end_date) };
    }

    if (week_days) {
      // allows partial match (e.g., "1" matches "1,2,3,4,5,6,7")
      where.week_days = { [Op.like]: `%${week_days}%` };
    }

    if (search) {
      where[Op.or] = [
        { rate_type: { [Op.like]: `%${search}%` } },
        { rate_value: { [Op.like]: `%${search}%` } },
      ];
    }
    console.log({ where });
    const fares = await DistanceFare.findAll({ where });
    res.status(200).json(fares);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching distance fares", error: error.message });
  }
};

export const getDistanceHourFares = async (req, res) => {
  try {
    const {
      id,
      base_vehicle_id,
      type_of_dispatch,
      currency,
      status,
      created_by,
      modified_by,
      start_date, // filter created_date >=
      end_date, // filter created_date <=
      week_days, // partial match
      search, // search in rate_type / rate_value
    } = req.query;

    const where = {};

    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = Number(base_vehicle_id);
    if (type_of_dispatch) where.type_of_dispatch = type_of_dispatch;
    if (currency) where.currency = currency;
    if (status) where.status = status;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;

    if (start_date && end_date) {
      where.created_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    } else if (start_date) {
      where.created_date = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.created_date = { [Op.lte]: new Date(end_date) };
    }

    if (week_days) {
      where.week_days = { [Op.like]: `%${week_days}%` };
    }

    if (search) {
      where[Op.or] = [
        { rate_type: { [Op.like]: `%${search}%` } },
        { rate_value: { [Op.like]: `%${search}%` } },
      ];
    }
    const fares = await DistanceHourFare.findAll({ where });
    res.status(200).json(fares);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching distance hour fares",
      error: error.message,
    });
  }
};

export const getDistanceUptoRates = async (req, res) => {
  try {
    const {
      distance_upto_rate_id,
      base_vehicle_id,
      status,
      created_by,
      modified_by,
      start_date, // filter created_date >=
      end_date, // filter created_date <=
      search, // search on km_upto or rate_per_km
    } = req.query;

    const where = {};

    if (distance_upto_rate_id)
      where.distance_upto_rate_id = distance_upto_rate_id;
    if (base_vehicle_id) where.base_vehicle_id = Number(base_vehicle_id);
    if (status) where.status = status;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;

    if (start_date && end_date) {
      where.created_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    } else if (start_date) {
      where.created_date = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.created_date = { [Op.lte]: new Date(end_date) };
    }

    if (search) {
      where[Op.or] = [
        { km_upto: { [Op.like]: `%${search}%` } },
        { rate_per_km: { [Op.like]: `%${search}%` } },
      ];
    }
    console.log({ where }, "wge");
    const rates = await DistanceUptoRate.findAll({ where });
    res.status(200).json(rates);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching distance upto rates",
      error: error.message,
    });
  }
};

export const getDistanceWaitingFares = async (req, res) => {
  try {
    const {
      id,
      base_vehicle_id,
      type_of_dispatch,
      currency,
      status,
      created_by,
      modified_by,
      start_date, // filter created_date >=
      end_date, // filter created_date <=
      week_days, // partial match
      search, // search in rate_type / rate_value
    } = req.query;

    const where = {};

    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (type_of_dispatch) where.type_of_dispatch = type_of_dispatch;
    if (currency) where.currency = currency;
    if (status) where.status = status;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;

    if (start_date && end_date) {
      where.created_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    } else if (start_date) {
      where.created_date = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.created_date = { [Op.lte]: new Date(end_date) };
    }

    if (week_days) {
      where.week_days = { [Op.like]: `%${week_days}%` };
    }

    if (search) {
      where[Op.or] = [
        { rate_type: { [Op.like]: `%${search}%` } },
        { rate_value: { [Op.like]: `%${search}%` } },
      ];
    }

    const fares = await DistanceWaitingFare.findAll({ where });
    res.status(200).json(fares);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching distance waiting fares",
      error: error.message,
    });
  }
};

export const addUpdateDistanceHourFareData = async (req, res) => {
  try {
    const { autoid, data } = req.body; // autoid = distanceHourId, data = fare info

    // build where condition
    let where = { base_vehicle_id: data.base_vehicle_id };
    if (autoid) {
      where = { id: autoid, base_vehicle_id: data.base_vehicle_id };
    }

    // check if fare exists
    const existingFare = await DistanceHourFare.findOne({ where });

    let fareData;
    if (existingFare) {
      // update
      await DistanceHourFare.update(data, { where });
      fareData = await DistanceHourFare.findOne({ where });
      await DistanceHourFareLogs.create({ ...existingFare.dataValues ,created_date:Date.now()});
    } else {
      // create
      fareData = await DistanceHourFare.create(data);
    }

    return res.json({
      success: true,
      message: "Fare data saved successfully",
      data: fareData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const addUpdateDistanceFareData = async (req, res) => {
  try {
    const { autoid, data } = req.body; // autoid = distanceHourId, data = fare info

    // build where condition
    let where = { base_vehicle_id: data.base_vehicle_id };
    if (autoid) {
      where = { id: autoid, base_vehicle_id: data.base_vehicle_id };
    }

    // check if fare exists
    const existingFare = await DistanceFare.findOne({ where });

    let fareData;
    if (existingFare) {
      // update
      await DistanceFare.update(data, { where });
      fareData = await DistanceFare.findOne({ where });
      await DistanceFareLogs.create({ ...existingFare.dataValues ,created_date:Date.now()});
    } else {
      // create
      fareData = await DistanceFare.create(data);
    }

    return res.json({
      success: true,
      message: "Fare data saved successfully",
      data: fareData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const addUpdateHourFareData = async (req, res) => {
  try {
    const { autoid, data } = req.body; // autoid = distanceHourId, data = fare info

    // build where condition
    let where = { base_vehicle_id: data.base_vehicle_id };
    if (autoid) {
      where = { id: autoid, base_vehicle_id: data.base_vehicle_id };
    }

    // check if fare exists
    const existingFare = await HourlyFare.findOne({ where });

    let fareData;
    if (existingFare) {
      // update
      await HourlyFare.update(data, { where });
      fareData = await HourlyFare.findOne({ where });
      await HourlyFareLogs.create({ ...existingFare.dataValues ,created_date:Date.now()});
    } else {
      // create
      fareData = await HourlyFare.create(data);
    }

    return res.json({
      success: true,
      message: "Fare data saved successfully",
      data: fareData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const addUpdateDistanceWaitingFareData = async (req, res) => {
  try {
    const { autoid, data } = req.body; // autoid = distanceHourId, data = fare info
    console.log(data, "daata");
    // build where condition
    let where = { base_vehicle_id: data.base_vehicle_id };
    if (autoid) {
      where = { id: autoid, base_vehicle_id: data.base_vehicle_id };
    }

    // check if fare exists
    const existingFare = await DistanceWaitingFare.findOne({ where });

    let fareData;
    if (existingFare) {
      // update
      await DistanceWaitingFare.update(data, { where });
      fareData = await DistanceWaitingFare.findOne({ where });
      await DistanceWaitingFareLogs.create({ ...existingFare.dataValues ,created_date:Date.now()});
    } else {
      // create
      fareData = await DistanceWaitingFare.create(data);
    }

    return res.json({
      success: true,
      message: "Fare data saved successfully",
      data: fareData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const addUpdateDistanceUptoRateData = async (req, res) => {
  try {
    const { autoid, data } = req.body; // autoid = distanceHourId, data = fare info (can be array or object)
    const userId = req.user.id; // Get user ID from authenticated user

    // If data is an array (bulk operation)
    if (Array.isArray(data)) {
      const results = [];

      for (const item of data) {
        // Add created_by to each item
        const itemWithUser = { ...item, created_by: userId };

        // Build where condition
        let where = { base_vehicle_id: itemWithUser.base_vehicle_id };
        if (item?.distance_upto_rate_id) {
          where = {
            distance_upto_rate_id: itemWithUser.distance_upto_rate_id,
            base_vehicle_id: itemWithUser.base_vehicle_id,
          };
        }

        // Check if fare exists
        const existingRate = await DistanceUptoRate.findOne({ where });

        let rateData;
        if (existingRate) {
          // Update - preserve created_by from original record
          const updateData = { ...itemWithUser };
          delete updateData.created_by; // Don't overwrite created_by on update

          await DistanceUptoRate.update(updateData, { where });
          rateData = await DistanceUptoRate.findOne({ where });
        } else {
          // Create new record with created_by
          rateData = await DistanceUptoRate.create(itemWithUser);
        }

        results.push(rateData);
      }

      return res.json({
        success: true,
        message: "Bulk rate data saved successfully",
        data: results,
        count: results.length,
      });
    }
    // If data is a single object
    else {
      // Add created_by to the data
      const dataWithUser = { ...data, created_by: userId };

      // Build where condition
      let where = { base_vehicle_id: dataWithUser.base_vehicle_id };
      if (autoid) {
        where = {
          distance_upto_rate_id: autoid,
          base_vehicle_id: dataWithUser.base_vehicle_id,
        };
      }

      // Check if fare exists
      const existingRate = await DistanceUptoRate.findOne({ where });

      let rateData;
      if (existingRate) {
        // Update - preserve created_by from original record
        const updateData = { ...dataWithUser };
        delete updateData.created_by; // Don't overwrite created_by on update

        await DistanceUptoRate.update(updateData, { where });
        rateData = await DistanceUptoRate.findOne({ where });
      } else {
        // Create new record with created_by
        rateData = await DistanceUptoRate.create(dataWithUser);
      }

      return res.json({
        success: true,
        message: "Rate data saved successfully",
        data: rateData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const upsertHourlyFare = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { data } = req.body; // Can be single object or array
    const userId = req.user?.id || 0;
    const userIp = req.ip || req.connection.remoteAddress;

    const currentDate = new Date();

    // Handle bulk upsert
    if (Array.isArray(data)) {
      const results = [];
      const errors = [];

      for (const [index, item] of data.entries()) {
        try {
          // Prepare data with user info and timestamps
          const fareData = {
            ...item,
            created_by: userId,
            modified_by: userId,
            ip: userIp,
            created_date: currentDate,
            modified_date: currentDate,
          };

          // Build where condition for unique constraint
          let where = {
            base_vehicle_id: item.base_vehicle_id,
          };
          if (item.local_pkg_id) {
            where.local_pkg_id = item.local_pkg_id;
          }
          // Check if record exists
          const existingFare = await HourlyFare.findOne({
            where,
            transaction,
          });
console.log({existingFare},"existingFare")
          let result;
          if (existingFare) {
            // Update existing record (preserve original created_date and created_by)
            const updateData = {
              ...fareData,
              created_date: existingFare.created_date, // Preserve original creation date
              created_by: existingFare.created_by, // Preserve original creator
              modified_date: currentDate, // Update modification date
              modified_by: userId, // Set modifier
            };

            await HourlyFare.update(updateData, {
              where,
              transaction,
            });
            console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
await HourlyFareLogs.create({ ...existingFare.dataValues ,created_date:Date.now()});
            result = await HourlyFare.findOne({
              where,
              transaction,
            });
          } else {
            // Create new record
            result = await HourlyFare.create(fareData, {
              transaction,
            });
          }

          results.push(result);
        } catch (error) {
          errors.push({
            index,
            error: error.message,
            data: item,
          });
        }
      }

      await transaction.commit();

      if (errors.length > 0) {
        return res.status(207).json({
          // 207 Multi-Status
          success: true,
          message: "Bulk upsert completed with some errors",
          data: results,
          errors: errors,
          counts: {
            successful: results.length,
            failed: errors.length,
            total: data.length,
          },
        });
      }

      return res.json({
        success: true,
        message: "Bulk upsert completed successfully",
        data: results,
        counts: {
          successful: results.length,
          total: data.length,
        },
      });
    }
    // Handle single upsert
    else {
      const fareData = {
        ...data,
        created_by: userId,
        modified_by: userId,
        ip: userIp,
        created_date: currentDate,
        modified_date: currentDate,
      };

      // Build where condition for unique constraint
      const where = {
        base_vehicle_id: data.base_vehicle_id,
        type_of_dispatch: data.type_of_dispatch,
        currency: data.currency,
        rate_type: data.rate_type,
      };

      // Check if record exists
      const existingFare = await HourlyFare.findOne({
        where,
        transaction,
      });

      let result;
      if (existingFare) {
        // Update existing record (preserve original created_date and created_by)
        const updateData = {
          ...fareData,
          created_date: existingFare.created_date, // Preserve original creation date
          created_by: existingFare.created_by, // Preserve original creator
          modified_date: currentDate, // Update modification date
          modified_by: userId, // Set modifier
        };

        await HourlyFare.update(updateData, {
          where,
          transaction,
        });
await HourlyFareLogs.create({ ...existingFare.dataValues ,created_date:Date.now()});
        result = await HourlyFare.findOne({
          where,
          transaction,
        });
      } else {
        // Create new record
        result = await HourlyFare.create(fareData, {
          transaction,
        });
      }

      await transaction.commit();

      return res.json({
        success: true,
        message: existingFare
          ? "Hourly fare updated successfully"
          : "Hourly fare created successfully",
        data: result,
      });
    }
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getLocalPackageFares = async (req, res) => {
  try {
    const {
      base_vehicle_id,
      local_pkg_id,
      status,
      created_by,
      from_date,
      to_date,
      min_fare,
      max_fare,
    } = req.query;

    let where = {};

    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (local_pkg_id) where.local_pkg_id = local_pkg_id;
    if (status) where.status = status;
    if (created_by) where.created_by = created_by;

    // Date range filter (created_date)
    if (from_date && to_date) {
      where.created_date = {
        [Op.between]: [new Date(from_date), new Date(to_date)],
      };
    } else if (from_date) {
      where.created_date = { [Op.gte]: new Date(from_date) };
    } else if (to_date) {
      where.created_date = { [Op.lte]: new Date(to_date) };
    }

    // Fare range filter
    if (min_fare && max_fare) {
      where.local_pkg_fare = {
        [Op.between]: [min_fare, max_fare],
      };
    } else if (min_fare) {
      where.local_pkg_fare = { [Op.gte]: min_fare };
    } else if (max_fare) {
      where.local_pkg_fare = { [Op.lte]: max_fare };
    }

    const fares = await LocalPackageFare.findAll({
      where,
      order: [["created_date", "DESC"]],
    });

    return successResponse(
      res,
      "Local Package Fares fetched successfully",
      fares
    );
  } catch (error) {
    console.error("Error fetching LocalPackageFares:", error);
    return errorResponse(res, "Failed to fetch Local Package Fares", error);
  }
};
export const getHourlyFares = async (req, res) => {
  try {
    const {
      base_vehicle_id,
      status,
      type_of_dispatch,
      date_from,
      date_to,
      week_days,
    } = req.query;

    const where = {};

    if (base_vehicle_id) {
      where.base_vehicle_id = base_vehicle_id;
    }

    if (status) {
      where.status = status; // ENUM('0','1','2','3')
    }

    if (type_of_dispatch) {
      where.type_of_dispatch = type_of_dispatch; // 1 or 2
    }

    if (date_from && date_to) {
      where.date_from = { [Op.lte]: date_to };
      where.date_to = { [Op.gte]: date_from };
    } else if (date_from) {
      where.date_from = { [Op.gte]: date_from };
    } else if (date_to) {
      where.date_to = { [Op.lte]: date_to };
    }

    if (week_days) {
      // week_days is stored as string like "1,2,3,4,5,6,7"
      where.week_days = { [Op.like]: `%${week_days}%` };
    }

    const fares = await HourlyFare.findAll({
      where,
      order: [["created_date", "DESC"]],
    });

    return res.json({
      success: true,
      count: fares.length,
      data: fares,
    });
  } catch (error) {
    console.error("Error fetching hourly fares:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
