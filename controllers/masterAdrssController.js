import MasterAddress from "../models/masterAddressModel.js";
import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import dateFormat from "dateformat";
import { getLatLon } from "../index.js";

class MasterAddressController {
  // Get all addresses with joins and filtering
  static async getAddresses(req, res) {
    try {
      const {
        country_id,
        state_id,
        city_id,
        auto_id,
        address,
        zone,
        establishment_name,
        is_hotel,
      } = req.body;

      let sql = `
                SELECT 
                    ma.*,
                    mc.name as country_name,
                    ms.name as state_name,
                    mct.name as city_name
                FROM master_address as ma
                LEFT JOIN master_country as mc ON ma.country_id = mc.id
                LEFT JOIN master_state as ms ON ma.state_id = ms.id
                LEFT JOIN master_city as mct ON ma.city_id = mct.id
                WHERE 1=1
            `;

      const replacements = {};

      if (country_id && country_id !== "") {
        const countryIds = country_id.split(",").map((item) => item.trim());
        sql += " AND ma.country_id IN (:countryIds)";
        replacements.countryIds = countryIds;
      }

      if (state_id && state_id !== "") {
        const stateIds = state_id.split(",").map((item) => item.trim());
        sql += " AND ma.state_id IN (:stateIds)";
        replacements.stateIds = stateIds;
      }

      if (city_id && city_id !== "") {
        const cityIds = city_id.split(",").map((item) => item.trim());
        sql += " AND ma.city_id IN (:cityIds)";
        replacements.cityIds = cityIds;
      }

      if (address && address !== "") {
        sql += " AND ma.address LIKE :address";
        replacements.address = `%${address}%`;
      }

      if (zone && zone !== "") {
        sql += " AND ma.zone LIKE :zone";
        replacements.zone = `%${zone}%`;
      }

      if (establishment_name && establishment_name !== "") {
        sql += " AND ma.establishment_name LIKE :establishment_name";
        replacements.establishment_name = `%${establishment_name}%`;
      }

      if (is_hotel !== undefined && is_hotel !== "") {
        sql += " AND ma.is_hotel = :is_hotel";
        replacements.is_hotel = is_hotel;
      }

      if (auto_id && auto_id !== "") {
        sql += " AND ma.id = :auto_id";
        replacements.auto_id = auto_id;
      }

      sql += " ORDER BY ma.id DESC";

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
          message: "No addresses found",
        });
      }
    } catch (error) {
      console.error("Error in getAddresses:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Add new address with automatic geocoding
  static async addAddress(req, res) {
    try {
      const {
        country_id,
        state_id,
        city_id,
        address,
        zone,
        establishment_name,
        is_hotel,
        latitude,
        longitude,
      } = req.body;

      if (!country_id) {
        return res.status(400).json({
          status: "failed",
          message: "country_id is required",
        });
      }

      let finalLatitude = latitude || "0.0";
      let finalLongitude = longitude || "0.0";

      // If address is provided but no coordinates, try to fetch them automatically
      if (
        address &&
        address !== "Not Available" &&
        (!latitude || !longitude || latitude === "0.0" || longitude === "0.0")
      ) {
        try {
          let searchAddress = address;

          // Build a better search address with city and country info if available
          if (city_id) {
            const [cityResult] = await sequelize.query(
              `SELECT name FROM master_city WHERE id = :city_id`,
              {
                replacements: { city_id },
                type: QueryTypes.SELECT,
              }
            );
            if (cityResult) {
              searchAddress = `${address}, ${cityResult.name}`;
            }
          }

          const { lat, lon } = await getLatLon(searchAddress);

          if (lat && lon) {
            finalLatitude = lat.toString();
            finalLongitude = lon.toString();
            console.log(
              `Auto-fetched coordinates for address: ${searchAddress} -> lat: ${finalLatitude}, lon: ${finalLongitude}`
            );
          } else {
            console.warn(
              `Could not fetch coordinates for address: ${searchAddress}`
            );
          }
        } catch (geoError) {
          console.error(
            "Error in fetching address coordinates:",
            geoError.message
          );
        }
      }

      const insertData = {
        country_id,
        state_id: state_id || null,
        city_id: city_id || null,
        latitude: finalLatitude,
        longitude: finalLongitude,
        address: address || "Not Available",
        zone: zone || "Not Available",
        establishment_name: establishment_name || null,
        is_hotel: is_hotel || 0,
      };

      const newAddress = await MasterAddress.create(insertData);

      res.json({
        status: "success",
        data: newAddress.id,
        message: "Address added successfully",
      });
    } catch (error) {
      console.error("Error in addAddress:", error);

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          status: "failed",
          message:
            "Invalid foreign key reference (country_id, state_id, or city_id)",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Update address
  static async updateAddress(req, res) {
    try {
      const {
        auto_id,
        country_id,
        state_id,
        city_id,
        address,
        zone,
        establishment_name,
        is_hotel,
        latitude,
        longitude,
      } = req.body;

      if (!auto_id) {
        return res.status(400).json({
          status: "failed",
          message: "auto_id is required",
        });
      }

      const updateData = {};

      if (country_id !== undefined) updateData.country_id = country_id;
      if (state_id !== undefined) updateData.state_id = state_id;
      if (city_id !== undefined) updateData.city_id = city_id;
      if (address !== undefined) updateData.address = address;
      if (zone !== undefined) updateData.zone = zone;
      if (establishment_name !== undefined)
        updateData.establishment_name = establishment_name;
      if (is_hotel !== undefined) updateData.is_hotel = is_hotel;
      if (latitude !== undefined) updateData.latitude = latitude;
      if (longitude !== undefined) updateData.longitude = longitude;

      // If address changed and no coordinates provided, try to fetch new coordinates
      if (
        address &&
        address !== "Not Available" &&
        (!latitude || !longitude || latitude === "0.0" || longitude === "0.0")
      ) {
        try {
          let searchAddress = address;

          if (city_id) {
            const [cityResult] = await sequelize.query(
              `SELECT name FROM master_city WHERE id = :city_id`,
              {
                replacements: { city_id: city_id || updateData.city_id },
                type: QueryTypes.SELECT,
              }
            );
            if (cityResult) {
              searchAddress = `${address}, ${cityResult.name}`;
            }
          }

          const { lat, lon } = await getLatLon(searchAddress);

          if (lat && lon) {
            updateData.latitude = lat.toString();
            updateData.longitude = lon.toString();
            console.log(
              `Auto-updated coordinates for address: ${searchAddress}`
            );
          }
        } catch (geoError) {
          console.error(
            "Error in updating address coordinates:",
            geoError.message
          );
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          status: "failed",
          message: "No valid fields to update",
        });
      }

      const [affectedRows] = await MasterAddress.update(updateData, {
        where: { id: auto_id },
      });

      if (affectedRows > 0) {
        res.json({
          status: "success",
          message: "Address updated successfully",
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "Address not found or no changes made",
        });
      }
    } catch (error) {
      console.error("Error in updateAddress:", error);

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          status: "failed",
          message: "Invalid foreign key reference",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Delete addresses (multiple)
  // static async deleteAddresses(req, res) {
  //     try {
  //         const { id } = req.body;

  //         if (!id) {
  //             return res.status(400).json({
  //                 status: 'failed',
  //                 message: 'id is required'
  //             });
  //         }

  //         const idArray = id.split(',').map(item => item.trim());

  //         const deletedCount = await MasterAddress.destroy({
  //             where: { id: idArray }
  //         });

  //         res.json({
  //             status: 'success',
  //             message: 'Addresses deleted successfully',
  //             deletedCount
  //         });

  //     } catch (error) {
  //         console.error('Error in deleteAddresses:', error);

  //         if (error.name === 'SequelizeForeignKeyConstraintError') {
  //             return res.status(400).json({
  //                 status: 'failed',
  //                 message: 'Cannot delete address as it is being used by other records'
  //             });
  //         }

  //         res.status(500).json({
  //             status: 'error',
  //             message: 'Internal server error'
  //         });
  //     }
  // }

  static async deleteAddresses(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }

      let idArray = [];

      // If id is already an array → convert all elements to string
      if (Array.isArray(id)) {
        idArray = id.map((item) => String(item).trim());
      }
      // If id is a comma-separated string → split it
      else if (typeof id === "string") {
        idArray = id.split(",").map((item) => item.trim());
      }
      // Anything else is invalid
      else {
        return res.status(400).json({
          status: "failed",
          message: "Invalid id format. Must be string or array.",
        });
      }

      // Delete records
      const deletedCount = await MasterAddress.destroy({
        where: { id: idArray },
      });

      return res.json({
        status: "success",
        message: "Addresses deleted successfully",
        deletedCount,
      });
    } catch (error) {
      console.error("Error in deleteAddresses:", error);

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          status: "failed",
          message: "Cannot delete address as it is being used by other records",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Search addresses
  static async searchAddresses(req, res) {
    try {
      const { search_term, country_id, state_id, city_id, is_hotel } = req.body;

      if (!search_term) {
        return res.status(400).json({
          status: "failed",
          message: "search_term is required",
        });
      }

      let sql = `
                SELECT 
                    ma.*,
                    mc.name as country_name,
                    ms.name as state_name,
                    mct.name as city_name
                FROM master_address as ma
                LEFT JOIN master_country as mc ON ma.country_id = mc.id
                LEFT JOIN master_state as ms ON ma.state_id = ms.id
                LEFT JOIN master_city as mct ON ma.city_id = mct.id
                WHERE (ma.address LIKE :search_term OR ma.establishment_name LIKE :search_term OR ma.zone LIKE :search_term OR mct.name LIKE :search_term OR ms.name LIKE :search_term OR mc.name LIKE :search_term)
            `;

      const replacements = {
        search_term: `%${search_term}%`,
      };

      if (country_id && country_id !== "") {
        sql += " AND ma.country_id = :country_id";
        replacements.country_id = country_id;
      }

      if (state_id && state_id !== "") {
        sql += " AND ma.state_id = :state_id";
        replacements.state_id = state_id;
      }

      if (city_id && city_id !== "") {
        sql += " AND ma.city_id = :city_id";
        replacements.city_id = city_id;
      }

      if (is_hotel !== undefined && is_hotel !== "") {
        sql += " AND ma.is_hotel = :is_hotel";
        replacements.is_hotel = is_hotel;
      }

      sql += " ORDER BY ma.establishment_name ASC, ma.address ASC LIMIT 50";

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      res.json({
        status: "success",
        data: results,
      });
    } catch (error) {
      console.error("Error in searchAddresses:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Get addresses by coordinates (nearby addresses)
  static async getAddressesByCoordinates(req, res) {
    try {
      const { latitude, longitude, radius_km = 10, is_hotel } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          status: "failed",
          message: "latitude and longitude are required",
        });
      }

      let sql = `
                SELECT 
                    ma.*,
                    mc.name as country_name,
                    ms.name as state_name,
                    mct.name as city_name,
                    (6371 * acos(cos(radians(:latitude)) * cos(radians(CAST(ma.latitude AS DECIMAL(10,6)))) * cos(radians(CAST(ma.longitude AS DECIMAL(10,6))) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(CAST(ma.latitude AS DECIMAL(10,6)))))) AS distance
                FROM master_address as ma
                LEFT JOIN master_country as mc ON ma.country_id = mc.id
                LEFT JOIN master_state as ms ON ma.state_id = ms.id
                LEFT JOIN master_city as mct ON ma.city_id = mct.id
                WHERE ma.latitude != '0.0' AND ma.longitude != '0.0'
            `;

      const replacements = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius_km: parseFloat(radius_km),
      };

      if (is_hotel !== undefined && is_hotel !== "") {
        sql += " AND ma.is_hotel = :is_hotel";
        replacements.is_hotel = is_hotel;
      }

      sql += " HAVING distance < :radius_km ORDER BY distance ASC LIMIT 20";

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      res.json({
        status: "success",
        data: results,
      });
    } catch (error) {
      console.error("Error in getAddressesByCoordinates:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Get hotels only
  static async getHotels(req, res) {
    try {
      const { country_id, state_id, city_id } = req.body;

      let sql = `
                SELECT 
                    ma.*,
                    mc.name as country_name,
                    ms.name as state_name,
                    mct.name as city_name
                FROM master_address as ma
                LEFT JOIN master_country as mc ON ma.country_id = mc.id
                LEFT JOIN master_state as ms ON ma.state_id = ms.id
                LEFT JOIN master_city as mct ON ma.city_id = mct.id
                WHERE ma.is_hotel = 1
            `;

      const replacements = {};

      if (country_id && country_id !== "") {
        sql += " AND ma.country_id = :country_id";
        replacements.country_id = country_id;
      }

      if (state_id && state_id !== "") {
        sql += " AND ma.state_id = :state_id";
        replacements.state_id = state_id;
      }

      if (city_id && city_id !== "") {
        sql += " AND ma.city_id = :city_id";
        replacements.city_id = city_id;
      }

      sql += " ORDER BY ma.establishment_name ASC";

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      res.json({
        status: "success",
        data: results,
      });
    } catch (error) {
      console.error("Error in getHotels:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default MasterAddressController;
