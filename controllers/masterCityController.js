import BaseCombination from "../models/baseCombinationModel.js";
import MasterCity from "../models/masterCityModel.js";
import sequelize from "../config/clientDbManager.js";
import MasterState from "../models/masterStateModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { MESSAGES } from "../constants/const.js";
import CompanyMarkup from "../models/companyMarkupModel.js";
import MasterCountry from "../models/masterCountryModel.js";
import { Op } from "sequelize";

/*
    Association needed:
    BaseCombination should have a belongsTo association to MasterCity.
    Example (usually in your model definition or a central association file):

    */
BaseCombination.belongsTo(MasterCity, {
  foreignKey: "city_id",
  as: "master_city",
});

// export const packageCity = async (req, res) => {
//   try {
//     const { city_name, master_package_id, city, toCity } = req.query;
//     // Validate city_name
//     const isValid = /^[a-zA-Z\s]+$/.test(city_name);
//     if (!city_name || !isValid) {
//       return res
//         .status(400)
//         .json({ status: "failed", message: "Invalid city name." });
//     }
//     let sql = toCity
//       ? `SELECT id as city_id,  name as city_name,state_id,state_name,latitude,longitude,country_id from master_city WHERE 1=1 `
//       : `
//             SELECT DISTINCT base_combination.city_id,
//             master_city.status,
//             master_city.name as city_name,
//             master_city.latitude as latitude,
//             master_city.longitude as longitude,
//             master_city.north_east_latitude as north_east_latitude,
//             master_city.north_east_longitude as north_east_longitude,
//             master_city.south_west_latitude as south_west_latitude,
//             master_city.south_west_longitude as south_west_longitude,
//             master_city.state_name as state_name,
//             master_city.country_code as country_code,
//             master_city.country_id,
//             master_city.state_id
//             FROM base_combination
//             LEFT JOIN master_city ON base_combination.city_id = master_city.id
//             WHERE 1=1
//         `;

//     const replacements = {};

//     if (city) {
//       sql += " AND master_city.name = :city";
//       replacements.city = city;
//     }

//     if (city_name) {
//       sql += true
//         ? "AND name LIKE :cityName"
//         : " AND master_city.name LIKE :cityName";
//       replacements.cityName = `%${city_name}%`;
//     }

//     if (master_package_id) {
//       sql += " AND base_combination.master_package_id = :masterPackageId";
//       replacements.masterPackageId = master_package_id;
//     }
//     toCity ? (sql += " LIMIT 10") : "";
//     const result = await sequelize.query(sql, {
//       replacements,
//       type: sequelize.QueryTypes.SELECT,
//     });

//     if (result && result.length > 0) {
//       return res.status(200).json({
//         data: result,
//       });
//       // (res, MESSAGES.GENERAL.DATA_FETCHED,result);
//     } else {
//       return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
//     }
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ status: "error", message: "Internal server error" });
//   }
// };

// In your routes file:
// router.get('/package-city', packageCity);

export const packageCity = async (req, res) => {
  try {
    const { city_name, master_package_id, city, toCity } = req.query;
    // Validate city_name
    const isValid = /^[a-zA-Z\s]+$/.test(city_name);
    if (!city_name || !isValid) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid city name." });
    }

    let sql = toCity
      ? `SELECT id as city_id, name as city_name, state_id, state_name, latitude, longitude, country_id from master_city WHERE 1=1 `
      : `
            SELECT DISTINCT base_combination.city_id, 
            master_city.status, 
            master_city.name as city_name,
            master_city.latitude as latitude,
            master_city.longitude as longitude,
            master_city.north_east_latitude as north_east_latitude,
            master_city.north_east_longitude as north_east_longitude,
            master_city.south_west_latitude as south_west_latitude,
            master_city.south_west_longitude as south_west_longitude,
            master_city.state_name as state_name,
            master_city.country_code as country_code,
            master_city.country_id,
            master_city.state_id
            FROM base_combination 
            LEFT JOIN master_city ON base_combination.city_id = master_city.id 
            WHERE 1=1 
        `;

    const replacements = {};

    if (city) {
      sql += " AND master_city.name = :city";
      replacements.city = city;
    }

    if (city_name) {
      sql += toCity
        ? " AND name LIKE :cityName"
        : " AND master_city.name LIKE :cityName";
      replacements.cityName = `%${city_name}%`;
    }

    if (master_package_id) {
      sql += " AND base_combination.master_package_id = :masterPackageId";
      replacements.masterPackageId = master_package_id;
    }

    // Add ORDER BY to prioritize exact matches and increase limit
    if (toCity) {
      sql += ` 
        ORDER BY 
          CASE 
            WHEN name = :exactCity THEN 0 
            WHEN name LIKE :startWithCity THEN 1 
            ELSE 2 
          END,
          name ASC 
        LIMIT 15
      `;
      replacements.exactCity = city_name;
      replacements.startWithCity = `${city_name}%`;
    } else {
      // For non-toCity queries, you can also add ordering if needed
      sql += " ORDER BY master_city.name ASC";
    }

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return res.status(200).json({
        data: result,
      });
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const cityActivePackage = async (req, res) => {
  try {
    const { cityId, cityname, type } = req.body || req.query;

    if (!type) {
      return res.status(400).json({
        status: "failed",
        message: "Type parameter is required",
      });
    }

    let sql = `
            SELECT 
                mc.id as city_id,
                mc.state_id,
                mc.name as city_name,
                bc.master_package_id,
                mp.name,
                mp.image,
                mc.country_id,
                mp.icon 
            FROM master_city as mc 
            JOIN base_combination as bc ON mc.id = bc.city_id AND bc.status = "1" 
            JOIN master_package as mp ON bc.master_package_id = mp.id AND mp.booking_type_id = :type 
            WHERE 1=1
        `;

    const replacements = { type };

    if (cityId) {
      sql += " AND mc.id = :cityId";
      replacements.cityId = cityId;
    }

    if (cityname) {
      sql += " AND mc.name = :cityname";
      replacements.cityname = cityname;
    }

    // Include all non-aggregated columns in GROUP BY
    sql +=
      " GROUP BY bc.master_package_id, mc.id, mc.name, mp.name, mp.image, mp.icon";

    const packages = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    return res.json({
      status: "success",
      data: packages,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getStates = async (req, res) => {
  try {
    const { country_id } = req.query;

    const whereClause = {};
    if (country_id) {
      whereClause.country_id = country_id;
    }

    const states = await MasterState.findAll({
      where: whereClause,
    });

    res.json({
      success: true,
      data: states,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch states",
      error: err.message,
    });
  }
};

export const getAllStates = async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = {};

    if (search) {
      whereClause.name = {
        [Op.iLike]: `${search}%`,
      };
    }

    const states = await MasterState.findAll({
      where: whereClause,
      // limit: 10,
    });

    res.json({
      success: true,
      data: states,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch states",
      error: err.message,
    });
  }
};
export const getCities = async (req, res) => {
  try {
    const { state_id } = req.query;

    const whereClause = {};
    if (state_id) {
      whereClause.state_id = state_id;
    }

    const states = await MasterCity.findAll({
      where: whereClause,
      attributes: ["id", "name", "state_id"],
    });

    res.json({
      success: true,
      data: states,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch states",
      error: err.message,
    });
  }
};

// ==========================================
export const getVehicleAmenities = async (req, res) => {
  try {
    const sql = `
      SELECT * 
      FROM master_amenities 
      WHERE 1=1 
      ORDER BY master_amenities.amenities_name ASC
    `;

    const amenities = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (amenities && amenities.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, amenities);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getTourExclusionDetails = async (req, res) => {
  try {
    const { booking_type, country_id, status, auto_id } = req.query;

    let sql = `
      SELECT 
        me.*,
        mc.name AS country_name,
        tt.tour_type as package_name 
      FROM master_tour_exclusion as me 
      LEFT JOIN tour_type as tt ON me.booking_type = tt.id 
      LEFT JOIN master_country as mc ON me.country_id = mc.id 
      WHERE 1=1
    `;

    const replacements = {};

    if (booking_type) {
      sql += " AND me.booking_type IN (:booking_type)";
      replacements.booking_type = booking_type.split(",").map(Number);
    }

    if (country_id) {
      sql += " AND me.country_id IN (:country_id)";
      replacements.country_id = country_id.split(",").map(Number);
    }

    if (status) {
      sql += " AND me.status = :status";
      replacements.status = status;
    }

    if (auto_id) {
      sql += " AND me.id = :auto_id";
      replacements.auto_id = auto_id;
    }

    sql += " ORDER BY me.id DESC";

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getDocumentationDetails = async (req, res) => {
  try {
    const { booking_type, country_id, status, auto_id } = req.query;

    let sql = `
      SELECT 
        md.*,
        mc.name AS country_name,
        tt.tour_type AS package_name 
      FROM master_documentation AS md 
      LEFT JOIN tour_type AS tt ON md.booking_type = tt.id 
      LEFT JOIN master_country AS mc ON md.country_id = mc.id 
      WHERE 1=1
    `;

    const replacements = {};

    // Handle array parameters safely
    if (booking_type) {
      const bookingTypes = booking_type.split(",").map(Number);
      sql += " AND md.booking_type IN (:booking_type)";
      replacements.booking_type = bookingTypes;
    }

    if (country_id) {
      const countryIds = country_id.split(",").map(Number);
      sql += " AND md.country_id IN (:country_id)";
      replacements.country_id = countryIds;
    }

    if (status) {
      sql += " AND md.status = :status";
      replacements.status = status;
    }

    if (auto_id) {
      sql += " AND md.id = :auto_id";
      replacements.auto_id = auto_id;
    }

    sql += " ORDER BY md.id DESC";

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getCancellationPolicyDetails = async (req, res) => {
  try {
    const { booking_type, country_id, status, auto_id } = req.query;

    // Base query with proper joins
    let sql = `
      SELECT 
        mcp.*,
        mc.name AS country_name,
        tt.tour_type AS package_name 
      FROM master_cancellation_policy AS mcp 
      LEFT JOIN tour_type AS tt ON mcp.booking_type = tt.id 
      LEFT JOIN master_country AS mc ON mcp.country_id = mc.id 
      WHERE 1=1
    `;

    const replacements = {};

    // Safe parameter handling for array values
    if (booking_type && !!booking_type) {
      const bookingTypes = booking_type.split(",").filter(Boolean).map(Number);
      if (bookingTypes.length > 0) {
        sql += " AND mcp.booking_type IN (:booking_type)";
        replacements.booking_type = bookingTypes;
      }
    }

    if (country_id && !!country_id) {
      const countryIds = country_id.split(",").filter(Boolean).map(Number);
      if (countryIds.length > 0) {
        sql += " AND mcp.country_id IN (:country_id)";
        replacements.country_id = countryIds;
      }
    }

    if (status && !!status) {
      sql += " AND mcp.status = :status";
      replacements.status = status;
    }

    if (auto_id && !!auto_id) {
      sql += " AND mcp.id = :auto_id";
      replacements.auto_id = auto_id;
    }

    sql += " ORDER BY mcp.id DESC";

    // Execute query
    const policies = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    // Handle response
    if (policies.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, policies);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getRefundPolicyDetails = async (req, res) => {
  try {
    const { booking_type, country_id, status, auto_id } = req.query;

    // Initialize query with proper joins
    let query = `
      SELECT 
        mrp.*,
        mc.name AS country_name,
        tt.tour_type AS package_name,
        DATE_FORMAT(mrp.created_at, '%Y-%m-%d %H:%i:%s') AS formatted_created_at
      FROM master_refund_policy AS mrp
      LEFT JOIN tour_type AS tt ON mrp.booking_type = tt.id
      LEFT JOIN master_country AS mc ON mrp.country_id = mc.id
      WHERE 1=1
    `;

    const queryParams = {};

    // Handle array parameters safely
    if (booking_type && !!booking_type) {
      const types = booking_type.split(",").map(Number).filter(Boolean);
      if (types.length) {
        query += " AND mrp.booking_type IN (:bookingTypes)";
        queryParams.bookingTypes = types;
      }
    }

    if (country_id && !!country_id) {
      const countries = country_id.split(",").map(Number).filter(Boolean);
      if (countries.length) {
        query += " AND mrp.country_id IN (:countries)";
        queryParams.countries = countries;
      }
    }

    if (status && !!status) {
      query += " AND mrp.status = :status";
      queryParams.status = status;
    }

    if (auto_id && !!auto_id) {
      query += " AND mrp.id = :policyId";
      queryParams.policyId = auto_id;
    }
    query += " ORDER BY mrp.id DESC";
    // Execute query
    const policies = await sequelize.query(query, {
      replacements: queryParams,
      type: sequelize.QueryTypes.SELECT,
    });
    // Format response
    if (policies.length > 0) {
      return res.json({
        status: "success",
        timestamp: new Date().toISOString(),
        count: policies.length,
        data: policies.map((policy) => ({
          ...policy,
          is_active: policy.status === 1,
        })),
      });
    }
    return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
  } catch (error) {
    console.error("[RefundPolicy] Error:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getTermConditionsDetails = async (req, res) => {
  try {
    const { booking_type, country_id, status, auto_id } = req.query;

    let sql = `
      SELECT 
        mtcp.*,
        mc.name AS country_name,
        tt.tour_type as package_name 
      FROM master_terms_condition_policy as mtcp 
      LEFT JOIN tour_type as tt ON mtcp.booking_type = tt.id 
      LEFT JOIN master_country as mc ON mtcp.country_id = mc.id 
      WHERE 1=1
    `;

    const replacements = {};

    if (booking_type && !!booking_type) {
      sql += " AND mtcp.booking_type IN(:booking_type)";
      replacements.booking_type = booking_type.split(",").map(Number);
    }

    if (country_id && !!country_id) {
      sql += " AND mtcp.country_id IN(:country_id)";
      replacements.country_id = country_id.split(",").map(Number);
    }

    if (status && !!status) {
      sql += " AND mtcp.status = :status";
      replacements.status = status;
    }

    if (auto_id && !!auto_id) {
      sql += " AND mtcp.id = :auto_id";
      replacements.auto_id = auto_id;
    }

    sql += " ORDER BY mtcp.id DESC";
    const termsConditions = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });
    if (termsConditions.length > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_FETCHED,
        termsConditions
      );
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getTransferDetails = async (req, res) => {
  try {
    const { country_id, status, auto_id } = req.query;

    let sql = `
      SELECT 
        me.*,
        mc.name AS country_name 
      FROM master_transfer as me  
      LEFT JOIN master_country as mc ON me.country_id = mc.id 
      WHERE 1=1
    `;
    const replacements = {};

    if (country_id && !!country_id) {
      sql += " AND me.country_id IN(:country_id)";
      replacements.country_id = country_id.split(",").map(Number);
    }
    if (status && !!status) {
      sql += " AND me.status = :status";
      replacements.status = status;
    }

    if (auto_id && !!auto_id) {
      sql += " AND me.id = :auto_id";
      replacements.auto_id = auto_id;
    }
    sql += " ORDER BY me.id DESC";
    const transfers = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });
    if (transfers.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, transfers);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getCityIntroductionDetails = async (req, res) => {
  try {
    const { booking_type, country_id, city_id, status, auto_id } = req.query;
    let sql = `
      SELECT 
        mci.*,
        mc.name AS city_name,
        tt.tour_type AS package_name 
      FROM master_city_introduction AS mci 
      LEFT JOIN tour_type AS tt ON mci.booking_type = tt.id 
      LEFT JOIN master_city AS mc ON mci.city_id = mc.id 
      WHERE 1=1
    `;

    const replacements = {};

    if (booking_type && !!booking_type) {
      sql += " AND mci.booking_type IN(:booking_type)";
      replacements.booking_type = booking_type.split(",").map(Number);
    }

    if (country_id && !!country_id) {
      sql += " AND mci.country_id IN(:country_id)";
      replacements.country_id = country_id.split(",").map(Number);
    }

    if (city_id && !!city_id) {
      sql += " AND mci.city_id = :city_id";
      replacements.city_id = city_id;
    }

    if (status && !!status) {
      sql += " AND mci.status = :status";
      replacements.status = status;
    }

    if (auto_id && !!auto_id) {
      sql += " AND mci.id = :auto_id";
      replacements.auto_id = auto_id;
    }

    sql += " ORDER BY mci.id DESC";

    const cityIntroductions = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (cityIntroductions.length > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_FETCHED,
        cityIntroductions
      );
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getAirportDataList = async (req, res) => {
  try {
    const { city_id, pickup_type } = req.query;

    let sql = `
      SELECT 
        airport.id,
        airport.country_id,
        master_country.name AS country_name,
        airport.state_id,
        master_state.name AS state_name,
        airport.city_id,
        master_city.name AS city_name,
        airport.airport_railway_name,
        airport.meeting_point,
        user.first_name AS created_by,
        airport.status
      FROM master_airport_railway AS airport
      LEFT JOIN master_country ON airport.country_id = master_country.id
      LEFT JOIN master_state ON airport.state_id = master_state.id
      LEFT JOIN master_city ON airport.city_id = master_city.id
      LEFT JOIN user ON airport.created_by = user.id
      WHERE airport.status = 1
    `;

    const replacements = {};

    if (city_id && !!city_id) {
      sql += " AND airport.city_id = :city_id";
      replacements.city_id = city_id;
    }

    if (pickup_type && !!pickup_type) {
      sql += " AND airport.pickup_type = :pickup_type";
      replacements.pickup_type = pickup_type;
    }

    sql += " ORDER BY airport.display_order ASC";

    const airports = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (airports.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, airports);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    console.error("Error fetching airport data:", err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getItineraryDescriptionDetails = async (req, res) => {
  try {
    const {
      user_id,
      booking_type,
      country_id,
      start_city,
      destination_city,
      status,
      auto_id,
    } = req.query;

    let sql = `
      SELECT 
        mid.*,
        mcs.name AS start_city_name,
        mcd.name AS destination_city_name 
      FROM master_itinerary_description AS mid 
      LEFT JOIN master_city AS mcs ON mid.start_city = mcs.id 
      LEFT JOIN master_city AS mcd ON mid.destination_city = mcd.id 
      WHERE 1=1
    `;

    const replacements = {};

    if (start_city && !!start_city) {
      sql += " AND mid.start_city = :start_city";
      replacements.start_city = start_city;
    }

    if (destination_city && !!destination_city) {
      sql += " AND mid.destination_city = :destination_city";
      replacements.destination_city = destination_city;
    }

    if (status && !!status) {
      sql += " AND mid.status = :status";
      replacements.status = status;
    }

    if (user_id && !!user_id) {
      sql += " AND mid.user_id IN(:user_id)";
      replacements.user_id = user_id.split(",").map(Number);
    }

    if (auto_id && !!auto_id) {
      sql += " AND mid.id = :auto_id";
      replacements.auto_id = auto_id;
    }

    sql += " ORDER BY mid.id DESC";

    const itineraries = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (itineraries.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, itineraries);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getCompanyMarkup = async (req, res) => {
  try {
    const {
      company_id,
      country_id,
      city_id,
      markp_type,
      master_package_id,
      user_id,
      user_grade,
      markup_id,
      created_by,
      master_booking_type_id,
      state_id,
      markup_category,
      page = 1,
      pageSize = 10,
    } = req.body;
    const offset = (page - 1) * pageSize;
    console.log(req.body);

    const replacements = {
      pageSize: parseInt(pageSize),
      offset: parseInt(offset),
    };
    let sql = `
      SELECT 
        company_markup.*,
        company_setup.com_name,
        company_setup.comp_address,
        master_city.name AS city_name,
        master_currency.code AS currency_code,
        master_currency.symbol AS currency_symbol,
        master_country.name AS country_name,
        master_state.name AS state_name,
        master_package.name AS package_name,
        user.first_name,
        company_markup.user_grade,
        user_grade.grade_name,
        mvt.vehicle_type AS vehicle_type_name 
      FROM company_markup 
      LEFT JOIN company_setup ON company_markup.company_id = company_setup.id 
      LEFT JOIN master_city ON company_markup.city_id = master_city.id 
      LEFT JOIN master_vehicle_type AS mvt ON company_markup.vehicle_type_id = mvt.id 
      LEFT JOIN master_currency ON company_markup.currency = master_currency.id 
      LEFT JOIN master_package ON company_markup.master_package_id = master_package.id 
      LEFT JOIN master_country ON company_markup.country_id = master_country.id 
      LEFT JOIN master_state ON company_markup.state_id = master_state.id 
      LEFT JOIN user ON company_markup.user_id = user.id 
      LEFT JOIN user_grade ON company_markup.user_grade = user_grade.id 
      WHERE 1=1
    `;
    if (!!company_id) {
      sql += " AND company_markup.company_id = :company_id";
      replacements.company_id = company_id;
    }
    if (!!country_id) {
      sql += " AND company_markup.country_id = :country_id";
      replacements.country_id = country_id;
    }
    if (!!city_id) {
      sql += " AND company_markup.city_id = :city_id";
      replacements.city_id = city_id;
    }
    if (!!markp_type) {
      sql += " AND company_markup.markp_type = :markp_type";
      replacements.markp_type = markp_type;
    }
    if (!!master_package_id) {
      sql += " AND company_markup.master_package_id = :master_package_id";
      replacements.master_package_id = master_package_id;
    }
    if (!!user_id) {
      sql += " AND company_markup.user_id = :user_id";
      replacements.user_id = user_id;
    }
    if (!!user_grade) {
      sql += " AND company_markup.user_grade = :user_grade";
      replacements.user_grade = user_grade;
    }
    if (!!markup_id) {
      sql += " AND company_markup.id = :markup_id";
      replacements.markup_id = markup_id;
    }
    if (!!created_by) {
      sql += " AND company_markup.created_by = :created_by";
      replacements.created_by = created_by;
    }
    if (!!master_booking_type_id) {
      console.log(master_booking_type_id, "master_booking_type_id");
      sql +=
        " AND company_markup.master_booking_type_id = :master_booking_type_id";
      replacements.master_booking_type_id = master_booking_type_id;
    }
    if (!!state_id) {
      sql += " AND company_markup.state_id = :state_id";
      replacements.state_id = state_id;
    }
    if (!!markup_category) {
      sql += " AND company_markup.markup_category = :markup_category";
      replacements.markup_category = markup_category;
    }

    // Order and pagination
    sql +=
      " ORDER BY master_package.name, user_grade.grade_name, mvt.display_order ASC";
    sql += " LIMIT :pageSize OFFSET :offset";

    const results = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    // COUNT query with same filters
    let countSql = `
      SELECT COUNT(*) as total 
      FROM company_markup 
      WHERE 1=1
    `;

    if (!!company_id)
      countSql += " AND company_markup.company_id = :company_id";
    if (!!country_id)
      countSql += " AND company_markup.country_id = :country_id";
    if (!!city_id) countSql += " AND company_markup.city_id = :city_id";
    if (!!markp_type)
      countSql += " AND company_markup.markp_type = :markp_type";
    if (!!master_package_id)
      countSql += " AND company_markup.master_package_id = :master_package_id";
    if (!!user_id) countSql += " AND company_markup.user_id = :user_id";
    if (!!user_grade)
      countSql += " AND company_markup.user_grade = :user_grade";
    if (!!markup_id) countSql += " AND company_markup.id = :markup_id";
    if (!!created_by)
      countSql += " AND company_markup.created_by = :created_by";
    if (!!master_booking_type_id)
      countSql +=
        " AND company_markup.master_booking_type_id = :master_booking_type_id";
    if (!!state_id) countSql += " AND company_markup.state_id = :state_id";
    if (!!markup_category)
      countSql += " AND company_markup.markup_category = :markup_category";

    const totalResult = await sequelize.query(countSql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    const total = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(total / pageSize);

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        data: results,
        pagination: {
          totalItems: total,
          totalPages,
          currentPage: parseInt(page),
          pageSize: parseInt(pageSize),
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      });
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const addCompanyMarkup = async (req, res) => {
  try {
    const {
      company_id,
      master_booking_type_id,
      user_grade,
      markup_category,
      user_id,
      country_id,
      state_id,
      city_id,
      currency,
      master_package_id,
      vehicle_type_id,
      markup_amt_type,
      markup_amount,
      markup_amt_base,
      extra_km,
      extra_min,
      created_by,
      ip,
    } = req.body;

    const insertData = {
      company_id,
      master_booking_type_id,
      user_grade,
      markup_category,
      user_id: user_id || null,
      country_id,
      state_id,
      city_id,
      currency,
      master_package_id,
      vehicle_type_id,
      mark_amt_type: markup_amt_type,
      basic_amt: markup_amount,
      markup_amt_base,
      extra_km_markup: extra_km,
      extra_hr_markup: extra_min,
      // created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      created_by,
      ip,
    };
    const response = await CompanyMarkup.create(insertData);
    if (response) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, response);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getCompanyFareMarkup = async (
  company_id,
  country_id,
  city_id,
  markp_type,
  master_package_id,
  user_id,
  user_grade,
  markup_id,
  created_by,
  master_booking_type_id,
  state_id,
  markup_category,
  cb
) => {
  try {
    let sql = `
      SELECT 
        company_markup.*, 
        company_setup.com_name, 
        company_setup.comp_address, 
        master_city.name AS city_name, 
        master_country.name AS country_name, 
        master_state.name AS state_name, 
        master_package.name AS package_name, 
        user.first_name, 
        company_markup.user_grade, 
        user_grade.grade_name 
      FROM company_markup 
      LEFT JOIN company_setup ON company_markup.company_id = company_setup.id 
      LEFT JOIN master_city ON company_markup.city_id = master_city.id 
      LEFT JOIN master_package ON company_markup.master_package_id = master_package.id 
      LEFT JOIN master_country ON company_markup.country_id = master_country.id 
      LEFT JOIN master_state ON company_markup.state_id = master_state.id 
      LEFT JOIN user ON company_markup.user_id = user.id 
      LEFT JOIN user_grade ON company_markup.user_grade = user_grade.id 
      WHERE company_markup.status = 1
    `;
    const replacements = {};
    if (company_id && !!company_id) {
      sql += " AND company_markup.company_id = :company_id";
      replacements.company_id = company_id;
    }
    if (country_id && !!country_id) {
      sql += " AND company_markup.country_id = :country_id";
      replacements.country_id = country_id;
    }
    if (city_id && !!city_id) {
      sql += " AND company_markup.city_id = :city_id";
      replacements.city_id = city_id;
    }
    if (state_id && !!state_id) {
      sql += " AND company_markup.state_id = :state_id";
      replacements.state_id = state_id;
    }
    if (markp_type && !!markp_type) {
      sql += " AND company_markup.markup_category = :markp_type";
      replacements.markp_type = markp_type;
    }
    if (master_package_id && !!master_package_id) {
      sql += " AND company_markup.master_package_id = :master_package_id";
      replacements.master_package_id = master_package_id;
    }
    if (markup_id && !!markup_id) {
      sql += " AND company_markup.comp_markup_id = :markup_id";
      replacements.markup_id = markup_id;
    }
    if (user_id && !!user_id) {
      sql += " AND company_markup.user_id = :user_id";
      replacements.user_id = user_id;
    }
    if (user_grade && !!user_grade) {
      sql += " AND company_markup.user_grade = :user_grade";
      replacements.user_grade = user_grade;
    }
    if (created_by && !!created_by) {
      sql += " AND company_markup.created_by = :created_by";
      replacements.created_by = created_by;
    }
    if (master_booking_type_id && !!master_booking_type_id) {
      sql +=
        " AND company_markup.master_booking_type_id = :master_booking_type_id";
      replacements.master_booking_type_id = master_booking_type_id;
    }
    if (markup_category && !!markup_category) {
      sql += " AND company_markup.markup_category = :markup_category";
      replacements.markup_category = markup_category;
    }

    sql += " ORDER BY company_markup.comp_markup_id DESC";

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getCompanyFareMarkupData = async (req, res) => {
  try {
    const {
      company_id,
      country_id,
      city_id,
      markp_type,
      master_package_id,
      user_id,
      user_grade,
      markup_id,
      created_by,
      master_booking_type_id,
      state_id,
      markup_category,
      vehicle_type_id,
    } = req.body;

    let sql = `
      SELECT 
        company_markup.*,
        company_setup.com_name,
        company_setup.comp_address,
        master_city.name AS city_name,
        master_country.name AS country_name,
        master_state.name AS state_name,
        master_package.name AS package_name,
        user.first_name,
        company_markup.user_grade,
        user_grade.grade_name
      FROM company_markup
      LEFT JOIN company_setup ON company_markup.company_id = company_setup.id
      LEFT JOIN master_city ON company_markup.city_id = master_city.id
      LEFT JOIN master_package ON company_markup.master_package_id = master_package.id
      LEFT JOIN master_country ON company_markup.country_id = master_country.id
      LEFT JOIN master_state ON company_markup.state_id = master_state.id
      LEFT JOIN user ON company_markup.user_id = user.id
      LEFT JOIN user_grade ON company_markup.user_grade = user_grade.id
      WHERE company_markup.status = 1
    `;
    const replacements = {};
    if (company_id && !!company_id) {
      sql += ` AND company_markup.company_id = :company_id`;
      replacements.company_id = company_id;
    }
    if (country_id && !!country_id) {
      sql += ` AND company_markup.country_id = :country_id`;
      replacements.country_id = country_id;
    }
    if (city_id && !!city_id) {
      sql += ` AND company_markup.city_id = :city_id`;
      replacements.city_id = city_id;
    }
    if (state_id && !!state_id) {
      sql += ` AND company_markup.state_id = :state_id`;
      replacements.state_id = state_id;
    }
    if (markp_type && !!markp_type) {
      sql += ` AND company_markup.markup_category = :markp_type`;
      replacements.markp_type = markp_type;
    }
    if (master_package_id && !!master_package_id) {
      sql += ` AND company_markup.master_package_id = :master_package_id`;
      replacements.master_package_id = master_package_id;
    }
    if (markup_id && !!markup_id) {
      sql += ` AND company_markup.comp_markup_id = :markup_id`;
      replacements.markup_id = markup_id;
    }
    if (user_id && !!user_id) {
      sql += ` AND company_markup.user_id = :user_id`;
      replacements.user_id = user_id;
    }
    if (user_grade && !!user_grade) {
      sql += ` AND company_markup.user_grade = :user_grade`;
      replacements.user_grade = user_grade;
    }
    if (created_by && !!created_by) {
      sql += ` AND company_markup.created_by = :created_by`;
      replacements.created_by = created_by;
    }
    if (master_booking_type_id && !!master_booking_type_id) {
      sql += ` AND company_markup.master_booking_type_id = :master_booking_type_id`;
      replacements.master_booking_type_id = master_booking_type_id;
    }
    if (markup_category && !!markup_category) {
      sql += ` AND company_markup.markup_category = :markup_category`;
      replacements.markup_category = markup_category;
    }
    if (vehicle_type_id && !!vehicle_type_id) {
      sql += ` AND company_markup.vehicle_type_id = :vehicle_type_id`;
      replacements.vehicle_type_id = vehicle_type_id;
    }
    sql += ` ORDER BY company_markup.comp_markup_id DESC`;
    const result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      replacements,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    console.error(err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const updateCompanyMarkup = async (req, res) => {
  try {
    const {
      markup_id,
      company_id,
      master_booking_type_id,
      user_grade,
      markup_category,
      user_id,
      country_id,
      state_id,
      city_id,
      currency,
      master_package_id,
      vehicle_type_id,
      markup_amt_type,
      markup_amount,
      markup_amt_base,
      extra_km,
      extra_min,
      modified_by,
      ip,
    } = req.body;

    if (!markup_id) {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    const insertLogSQL = `
      INSERT INTO company_markup_logs (
        comp_markup_id, company_id, master_booking_type_id, base_vehicle_id, user_grade,
        markup_category, mark_amt_type, user_id, country_id, state_id, city_id,
        master_package_id, basic_amt, markup_amt_base, extra_km_markup, extra_hr_markup,
        currency, created_date, created_by, modified_by, status, ip
      )
      SELECT 
        comp_markup_id, company_id, master_booking_type_id, base_vehicle_id, user_grade,
        markup_category, mark_amt_type, user_id, country_id, state_id, city_id,
        master_package_id, basic_amt, markup_amt_base, extra_km_markup, extra_hr_markup,
        currency, created_date, created_by, modified_by, status, ip
      FROM company_markup
      WHERE comp_markup_id = :markup_id
    `;

    await sequelize.query(insertLogSQL, {
      replacements: { markup_id },
      type: sequelize.QueryTypes.INSERT,
    });

    // 2.Update the current record
    const updatePayload = {
      company_id,
      master_booking_type_id,
      user_grade,
      markup_category,
      user_id: user_id || null,
      country_id,
      state_id: state_id || null,
      city_id: city_id || null,
      currency,
      master_package_id,
      vehicle_type_id,
      mark_amt_type: markup_amt_type,
      basic_amt: markup_amount,
      markup_amt_base,
      extra_km_markup: extra_km,
      extra_hr_markup: extra_min,
      modified_by,
      ip,
    };

    // Remove undefined/null values from update
    Object.keys(updatePayload).forEach((key) => {
      if (updatePayload[key] === undefined) delete updatePayload[key];
    });

    const [rowsUpdated] = await CompanyMarkup.update(updatePayload, {
      where: { comp_markup_id: markup_id },
    });

    if (rowsUpdated > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const updateMarkupStatus = async (req, res) => {
  try {
    const { id, user_id, markup_status } = req.body;
    // Support both single and comma-separated ids
    const ids = typeof id === "string" ? id.split(",") : [id];
    const [rowsUpdated] = await CompanyMarkup.update(
      {
        status: Number(markup_status),
        modified_by: user_id,
      },
      {
        where: {
          comp_markup_id: ids,
        },
      }
    );
    if (rowsUpdated > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getCompanyMarkupLogs = async (req, res) => {
  try {
    const { markup_id } = req.body;
    let sql = `
      SELECT 
        company_markup_logs.*,
        company_setup.com_name,
        company_setup.comp_address,
        master_city.name AS city_name,
        master_country.name AS country_name,
        master_package.name AS package_name,
        user.first_name,
        company_markup_logs.user_grade,
        user_grade.grade_name
      FROM company_markup_logs
      LEFT JOIN company_setup ON company_markup_logs.company_id = company_setup.id
      LEFT JOIN master_city ON company_markup_logs.city_id = master_city.id
      LEFT JOIN master_package ON company_markup_logs.master_package_id = master_package.id
      LEFT JOIN master_country ON company_markup_logs.country_id = master_country.id
      LEFT JOIN user ON company_markup_logs.user_id = user.id
      LEFT JOIN user_grade ON company_markup_logs.user_grade = user_grade.id
      WHERE 1=1
    `;
    const replacements = {};
    if (markup_id && !!markup_id) {
      sql += ` AND company_markup_logs.comp_markup_id = :markup_id`;
      replacements.markup_id = markup_id;
    }
    sql += ` ORDER BY company_markup_logs.comp_markup_log_id DESC`;
    const results = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });
    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    console.log(results);
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getUserMarkupDetails = async (req, res) => {
  try {
    const {
      user_id,
      master_booking_type_id,
      master_package_id,
      markup_category,
      country_id,
      state_id,
      city_id,
      user_grade,
    } = req.body;

    let sql = `SELECT * FROM company_markup WHERE status = 1`;
    const replacements = {};

    if (user_id && !!user_id) {
      sql += ` AND created_by = :user_id`;
      replacements.user_id = user_id;
    }
    if (master_booking_type_id && !!master_booking_type_id) {
      sql += ` AND master_booking_type_id = :master_booking_type_id`;
      replacements.master_booking_type_id = master_booking_type_id;
    }
    if (master_package_id && !!master_package_id) {
      sql += ` AND master_package_id = :master_package_id`;
      replacements.master_package_id = master_package_id;
    }
    if (markup_category && !!markup_category) {
      sql += ` AND markup_category = :markup_category`;
      replacements.markup_category = markup_category;
    }
    if (country_id && !!country_id) {
      sql += ` AND country_id = :country_id`;
      replacements.country_id = country_id;
    }
    if (state_id && !!state_id) {
      sql += ` AND state_id = :state_id`;
      replacements.state_id = state_id;
    }
    if (city_id && !!city_id) {
      sql += ` AND city_id = :city_id`;
      replacements.city_id = city_id;
    }
    if (user_grade && !!user_grade) {
      sql += ` AND user_grade = :user_grade`;
      replacements.user_grade = user_grade;
    }

    sql += ` ORDER BY comp_markup_id ASC LIMIT 1`;

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const deleteMarkup = async (req, res) => {
  try {
    const { company_id } = req.body;
    const result = await CompanyMarkup.destroy({
      where: { comp_markup_id: company_id },
    });

    if (res.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

// export const getCities = async (req, res) => {
//   try {
//     const { state_id } = req.body;

//     if (!state_id) {
//       return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
//     }

//     const cities = await MasterCity.findAll({
//       where: { state_id },
//       order: [["name", "ASC"]],
//     });

//     if (cities.length > 0) {
//       return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, cities);
//     } else {
//       return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, []);
//     }
//   } catch (error) {
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error?.response?.data || error.message,
//       error?.response?.status || 500
//     );
//   }
// };

// export const getStates = async (req, res) => {
//   try {
//     const { country_id } = req.body;

//     if (!country_id) {
//       return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
//     }

//     const states = await MasterState.findAll({
//       where: { country_id },
//       order: [["name", "ASC"]],
//     });

//     if (states.length > 0) {
//       return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, states);
//     } else {
//       return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, []);
//     }
//   } catch (error) {
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error?.response?.data || error.message,
//       error?.response?.status || 500
//     );
//   }
// };

export const getCountries = async (req, res) => {
  try {
    const { name } = req.body;

    const whereClause = {};
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`, // Case-insensitive search
      };
    }

    const countries = await MasterCountry.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
    });

    if (countries.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, countries);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, []);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const getLocalPackage = async (req, res) => {
  try {
    const { id, page = 1, limit = 10, search = "" } = req.body;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let sql = `
      SELECT 
        lp.id as local_package_id,
        lp.booking_type as package_type,
        lp.booking_mode as package_type_mode,
        mpm.package_mode as booking_mode,
        mp.name as booking_type,
        lp.name as package_name,
        lp.hrs,
        lp.km,
        lp.status 
      FROM local_package as lp 
      JOIN master_package_mode as mpm ON lp.booking_mode = mpm.id 
      JOIN master_package as mp ON lp.booking_type = mp.id 
      WHERE lp.status != 2
    `;

    const replacements = {
      limit: parseInt(limit),
      offset,
    };

    if (id) {
      sql += " AND lp.id = :id";
      replacements.id = id;
    }

    if (search) {
      sql += ` AND (lp.name LIKE :search OR mp.name LIKE :search)`;
      replacements.search = `%${search}%`;
    }

    sql += ` ORDER BY lp.id DESC LIMIT :limit OFFSET :offset`;

    const packages = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    // Count for pagination
    const countSql = `
      SELECT COUNT(*) as total 
      FROM local_package as lp 
      JOIN master_package_mode as mpm ON lp.booking_mode = mpm.id 
      JOIN master_package as mp ON lp.booking_type = mp.id 
      WHERE lp.status != 2
      ${id ? ` AND lp.id = :id` : ""}
      ${search ? ` AND (lp.name LIKE :search OR mp.name LIKE :search)` : ""}
    `;

    const totalResult = await sequelize.query(countSql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    const total = totalResult[0]?.total || 0;

    return res.json({
      status: "success",
      data: packages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const fetchStateCountByStateName = async (req, res) => {
  try {
    const { state_name } = req.body;

    let sql = `
      SELECT 
        state_id AS state_id,
        country_id,
        state_name,
        country_code,
        currency_id,
        currency,
        currency_symbol,
        CONCAT(state_name, " (", country_code, ")") AS statecountry
      FROM master_city
      WHERE 1=1
    `;

    const replacements = {};

    if (typeof state_name !== "undefined") {
      sql += " AND state_name LIKE :state_name";
      replacements.state_name = `%${state_name}%`;
    }
    sql += " GROUP BY state_name LIMIT 0, 20";

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};

export const fetchCityStateCountryByNameOrId = async (req, res) => {
  try {
    const { cityname, cityid } = req.body;

    let sql = `
      SELECT 
        mc.id AS city_id,
        mc.currency_id AS currency_id,
        mc.currency AS currency,
        mc.currency_symbol AS currency_symbol,
        mc.radius AS city_radius,
        mc.latitude,
        mc.longitude,
        mc.north_east_latitude,
        mc.north_east_longitude,
        mc.south_west_latitude,
        mc.south_west_longitude,
        mc.status,
        mc.state_id AS state_id,
        mc.country_id AS country_id,
        CONCAT(mc.name, " (", mc.state_name, ", ", mc.country_code, ")") AS citystatecountry
      FROM master_city AS mc
      WHERE 1=1
    `;

    const replacements = {};

    if (typeof cityname !== "undefined" && cityname !== "") {
      sql += " AND mc.name LIKE :cityname";
      replacements.cityname = `%${cityname}%`;
    }

    if (typeof cityid !== "undefined" && cityid !== "") {
      sql += " AND mc.id = :cityid";
      replacements.cityid = cityid;
    }

    sql += " LIMIT 0, 10";

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error?.response?.data || error.message,
      error?.response?.status || 500
    );
  }
};
