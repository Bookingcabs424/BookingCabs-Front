import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import dateFormat from "dateformat";
import { getLatLon } from "../index.js";

class MasterAirportRailwayController {
  // Add new airport/railway
  static async addAirportRailway(req, res) {
    try {
      const {
        city_id,
        airport_railway_name,
        pickup_type,
        meeting_point,
        display_order,
        status,
        created_by,
      } = req.body;

      let finalCountryId = null;
      let finalStateId = null;
      let finalLatitude = null;
      let finalLongitude = null;

      // If city_id is provided, fetch all details from master_city
      if (city_id) {
        try {
          // Get the city details from the database using city_id
          const [cityResult] = await sequelize.query(
            `SELECT name, country_id, state_id FROM master_city WHERE id = :city_id`,
            {
              replacements: { city_id },
              type: QueryTypes.SELECT,
            }
          );



          if (cityResult) {
            // Set country_id and state_id from city result
            finalCountryId = cityResult.country_id;
            finalStateId = cityResult.state_id;

            // Fetch latitude and longitude using city name
            const cityName = cityResult.name;
            const { lat, lon } = await getLatLon(cityName);
      

            if (lat && lon) {
              finalLatitude = lat;
              finalLongitude = lon;
              console.log(
                `Auto-fetched coordinates for city: ${cityName} -> lat: ${lat}, lon: ${lon}`
              );
            } else {
              console.warn(`Could not fetch coordinates for city: ${cityName}`);
            }
          } else {
            console.warn(`City not found for city_id: ${city_id}`);
            return res.status(400).json({
              status: "failed",
              message: "City not found",
            });
          }
        } catch (geoError) {
          console.error(
            "Error in fetching city details or geocoding:",
            geoError.message
          );
          return res.status(400).json({
            status: "failed",
            message: "Error fetching city details or coordinates",
          });
        }
      } else {
        return res.status(400).json({
          status: "failed",
          message: "city_id is required",
        });
      }

      const insertValue = {
        country_id: finalCountryId,
        state_id: finalStateId,
        city_id,
        airport_railway_name,
        pickup_type,
        meeting_point,
        latitude: finalLatitude,
        longitude: finalLongitude,
        display_order,
        created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        status,
        created_by,
      };

   

      // Remove undefined or empty values
      Object.keys(insertValue).forEach((key) => {
        if (insertValue[key] === undefined || insertValue[key] === "") {
          delete insertValue[key];
        }
      });

      // Create parameterized query
      const columns = Object.keys(insertValue);
      const placeholders = columns.map((col) => `:${col}`).join(", ");
      const sql = `INSERT INTO master_airport_railway (${columns.join(
        ", "
      )}) VALUES (${placeholders})`;

      const [result] = await sequelize.query(sql, {
        replacements: insertValue,
        type: QueryTypes.INSERT,
      });



      if (result) {
        res.json({
          status: "success",
          message: "Airport/Railway added successfully",
          data: { insertId: result },
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Failed to add airport/railway",
        });
      }
    } catch (error) {
      console.error("Error in addAirportRailway:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Update airport/railway

  static async updateAirportRailway(req, res) {
    try {
      const {
        id,
        city_id,
        airport_railway_name,
        pickup_type,
        meeting_point,
        display_order,
     
        status,
        modified_by,
      } = req.body;

      if (!id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }

      let finalCountryId = null;
      let finalStateId = null;
      let finalLatitude = null;
      let finalLongitude = null;

      // If city_id is provided in update, fetch all details from master_city
      if (city_id) {
        try {
          // Get the city details from the database using city_id
          const [cityResult] = await sequelize.query(
            `SELECT name, country_id, state_id FROM master_city WHERE id = :city_id`,
            {
              replacements: { city_id },
              type: QueryTypes.SELECT,
            }
          );


          if (cityResult) {
            // Set country_id and state_id from city result
            finalCountryId = cityResult.country_id;
            finalStateId = cityResult.state_id;

            // Fetch latitude and longitude using city name
            const cityName = cityResult.name;
            const { lat, lon } = await getLatLon(cityName);
      

            if (lat && lon) {
              finalLatitude = lat;
              finalLongitude = lon;
              console.log(
                `Auto-fetched coordinates for city: ${cityName} -> lat: ${lat}, lon: ${lon}`
              );
            } else {
              console.warn(`Could not fetch coordinates for city: ${cityName}`);
            }
          } else {
            console.warn(`City not found for city_id: ${city_id}`);
            return res.status(400).json({
              status: "failed",
              message: "City not found",
            });
          }
        } catch (geoError) {
          console.error(
            "Error in fetching city details or geocoding:",
            geoError.message
          );
          return res.status(400).json({
            status: "failed",
            message: "Error fetching city details or coordinates",
          });
        }
      }

      const updateValue = {
        airport_railway_name,
        pickup_type,
        meeting_point,
        display_order,
 
        status,
        modified_by,
        modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      };

      // Add auto-fetched values if city_id was provided
      if (city_id) {
        updateValue.city_id = city_id;
        updateValue.country_id = finalCountryId;
        updateValue.state_id = finalStateId;
        updateValue.latitude = finalLatitude;
        updateValue.longitude = finalLongitude;
      }

      // Remove undefined or empty values
      Object.keys(updateValue).forEach((key) => {
        if (updateValue[key] === undefined || updateValue[key] === "") {
          delete updateValue[key];
        }
      });

      if (Object.keys(updateValue).length === 0) {
        return res.status(400).json({
          status: "failed",
          message: "No valid fields to update",
        });
      }

      const setClause = Object.keys(updateValue)
        .map((key) => `${key} = :${key}`)
        .join(", ");

      const sql = `UPDATE master_airport_railway SET ${setClause} WHERE id = :id`;

      const [result] = await sequelize.query(sql, {
        replacements: {
          ...updateValue,
          id,
        },
        type: QueryTypes.UPDATE,
      });

      res.json({
        status: "success",
        message: "Airport/Railway updated successfully",
      });
    } catch (error) {
      console.error("Error in updateAirportRailway:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Get single airport/railway by ID
  static async getAirportRailwayById(req, res) {
    try {
      const { id } = req.params;

      const sql = `
        SELECT 
          airport.*,
          master_country.name as country_name,
          master_state.name as state_name,
          master_city.name as city_name,
          user.first_name as created_by_name
        FROM master_airport_railway as airport 
        LEFT JOIN master_country ON airport.country_id = master_country.id 
        LEFT JOIN master_state ON airport.state_id = master_state.id 
        LEFT JOIN master_city ON airport.city_id = master_city.id 
        LEFT JOIN user ON airport.created_by = user.id 
        WHERE airport.id = :id
      `;

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements: { id },
      });

      if (results.length > 0) {
        res.json({
          status: "success",
          data: results[0],
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "Airport/Railway not found",
        });
      }
    } catch (error) {
      console.error("Error in getAirportRailwayById:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async masterAirport(req, res) {
    try {
      const { id, city_id, airport_name, status } = req.body;

      let sql = `
        SELECT 
          airport.id,
          airport.country_id,
          master_country.name as country_name,
          airport.state_id,
          master_state.name as state_name,
          airport.city_id,
          master_city.name as city_name,
          airport.airport_railway_name,
          airport.pickup_type,
          airport.meeting_point,
          user.first_name as created_by,
          airport.status,
          airport.latitude,
          airport.longitude
        FROM master_airport_railway as airport 
        LEFT JOIN master_country ON airport.country_id = master_country.id 
        LEFT JOIN master_state ON airport.state_id = master_state.id 
        LEFT JOIN master_city ON airport.city_id = master_city.id 
        LEFT JOIN user ON airport.created_by = user.id 
        WHERE 1=1
      `;

      const replacements = {};

      if (id) {
        sql += " AND airport.id = :id";
        replacements.id = id;
      }

      if (city_id) {
        sql += " AND airport.city_id = :cityId";
        replacements.cityId = city_id;
      }

      if (airport_name) {
        sql += " AND airport.airport_railway_name LIKE :airportName";
        replacements.airportName = `%${airport_name}%`;
      }

      if (status) {
        sql += " AND airport.status = :status";
        replacements.status = status;
      } else {
        sql += " AND airport.status != 2";
      }

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      res.json({
        status: "success",
        data: results,
      });
    } catch (error) {
      console.error("Error in masterAirport:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async getAirportData(req, res) {
    try {
      const { airport_name, pickup_type } = req.body;

      let sql = `
        SELECT 
          airport.id,
          airport.country_id,
          master_country.name as country_name,
          airport.state_id,
          master_state.name as state_name,
          airport.city_id,
          master_city.name as city_name,
          airport.airport_railway_name,
          airport.meeting_point,
          user.first_name as created_by,
          airport.status
        FROM master_airport_railway as airport 
        LEFT JOIN master_country ON airport.country_id = master_country.id 
        LEFT JOIN master_state ON airport.state_id = master_state.id 
        LEFT JOIN master_city ON airport.city_id = master_city.id 
        LEFT JOIN user ON airport.created_by = user.id 
        WHERE 1=1
      `;

      const replacements = {};

      if (airport_name) {
        sql += " AND airport.airport_railway_name = :airportName";
        replacements.airportName = airport_name;
      }

      if (pickup_type) {
        sql += " AND airport.pickup_type = :pickupType";
        replacements.pickupType = pickup_type;
      }

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      if (results.length > 0) {
        res.json({
          status: "success",
          message: "Get All Airports and Railway Stations Successfully",
          data: results,
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "No Airports and Railway Stations Found!",
        });
      }
    } catch (error) {
      console.error("Error in getAirportData:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id, user_id, airport_status } = req.body;

      if (!id || !user_id || airport_status === undefined) {
        return res.status(400).json({
          status: "failed",
          message: "id, user_id, and airport_status are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const sql = `
        UPDATE master_airport_railway 
        SET status = :status, modified_by = :userId, modified_date = :modifiedDate 
        WHERE id IN (:idArray)
      `;

      await sequelize.query(sql, {
        replacements: {
          status: airport_status,
          userId: user_id,
          idArray,
          modifiedDate: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        },
        type: QueryTypes.UPDATE,
      });

      res.json({
        status: "success",
        message: "Records updated successfully",
      });
    } catch (error) {
      console.error("Error in updateStatus:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async getAjaxAirportList(req, res) {
    try {
      let { airport_railway_name, pickup_type } = req.query;

      //  Normalize input
      airport_railway_name = airport_railway_name
        ? airport_railway_name.trim()
        : "";
      pickup_type = pickup_type ? pickup_type.trim() : "";

      let sql = `SELECT * FROM master_airport_railway as airport WHERE 1=1 `;
      const replacements = {};

      if (airport_railway_name !== "") {
        sql += " AND airport.airport_railway_name LIKE :airportName";
        replacements.airportName = `%${airport_railway_name}%`;
      }

      if (pickup_type !== "") {
        sql += " AND airport.pickup_type LIKE :pickupType";
        replacements.pickupType = `%${pickup_type}%`;
      }

      // 🔍 Debug: print SQL & parameters to verify
      console.log("FINAL SQL:", sql);
      console.log("REPLACEMENTS:", replacements);

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      console.log("Results", JSON.stringify(results));

      if (results.length > 0) {
        return res.json({
          status: "success",
          message: "Get All Airports and Railway Stations Successfully",
          data: results,
        });
      }

      return res.status(404).json({
        status: "failed",
        message: "No Airports and Railway Stations Found!",
      });
    } catch (error) {
      console.error("Error in getAjaxAirportList:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async getAirportDataList(req, res) {
    try {
      const { city_id, pickup_type } = req.body;

      let sql = `
        SELECT 
          airport.id,
          airport.country_id,
          master_country.name as country_name,
          airport.state_id,
          master_state.name as state_name,
          airport.city_id,
          master_city.name as city_name,
          airport.airport_railway_name,
          airport.meeting_point,
          airport.pickup_type,
          user.first_name as created_by,
          airport.status
        FROM master_airport_railway as airport 
        LEFT JOIN master_country ON airport.country_id = master_country.id 
        LEFT JOIN master_state ON airport.state_id = master_state.id 
        LEFT JOIN master_city ON airport.city_id = master_city.id 
        LEFT JOIN user ON airport.created_by = user.id 
        WHERE airport.status = 1
      `;

      const replacements = {};

      if (city_id) {
        sql += " AND airport.city_id = :cityId";
        replacements.cityId = city_id;
      }

      if (pickup_type) {
        sql += " AND airport.pickup_type = :pickupType";
        replacements.pickupType = pickup_type;
      }

      sql += " ORDER BY airport.display_order ASC";

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      if (results.length > 0) {
        res.json({
          status: "success",
          message: "Get All Airports and Railway Stations Successfully",
          data: results,
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "No Airports and Railway Stations Found!",
        });
      }
    } catch (error) {
      console.error("Error in getAirportDataList:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default MasterAirportRailwayController;
