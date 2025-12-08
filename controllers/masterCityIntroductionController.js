import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import dateFormat from "dateformat";

class MasterCityIntroductionController {

  static async getCityIntroductionDetails(req, res) {
    try {
      const { user_id, booking_type, country_id, city_id, status, auto_id } = req.body;

      let sql = `
        SELECT 
          mci.*,
          mc.name AS city_name,
          tt.tour_type as package_name 
        FROM master_city_introduction as mci 
        LEFT JOIN tour_type as tt ON mci.booking_type = tt.id 
        LEFT JOIN master_city as mc ON mci.city_id = mc.id 
        WHERE 1=1
      `;

      const replacements = {};

      if (booking_type && booking_type !== "") {
        const bookingTypes = booking_type.split(",").map(item => item.trim());
        sql += " AND mci.booking_type IN (:bookingTypes)";
        replacements.bookingTypes = bookingTypes;
      }

    //   if (country_id && country_id !== "") {
    //     const countryIds = country_id.split(",").map(item => item.trim());
    //     sql += " AND mci.country_id IN (:countryIds)";
    //     replacements.countryIds = countryIds;
    //   }

      if (city_id && city_id !== "") {
        sql += " AND mci.city_id = :cityId";
        replacements.cityId = city_id;
      }

      if (status && status !== "") {
        sql += " AND mci.status = :status";
        replacements.status = status;
      }

      if (auto_id && auto_id !== "") {
        sql += " AND mci.id = :autoId";
        replacements.autoId = auto_id;
      }

      sql += " ORDER BY mci.id DESC";

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
          message: "No record found",
        });
      }
    } catch (error) {
      console.error("Error in getCityIntroductionDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async addCityIntroductionDetails(req, res) {
    try {
      const {
        city_id,
        booking_type,
        title,
        description,
        image_path,
        ip,
        status,
        created_by,
      } = req.body;

      const insertValue = {
        city_id,
        booking_type,
        title,
        description,
        image_path,
        created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        ip,
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
      const sql = `INSERT INTO master_city_introduction (${columns.join(", ")}) VALUES (${placeholders})`;

      const [result] = await sequelize.query(sql, {
        replacements: insertValue,
        type: QueryTypes.INSERT,
      });

      if (result) {
        res.json({
          status: "success",
          data: result,
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error in addCityIntroductionDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async updateCityIntroductionDetails(req, res) {
    try {
      const {
        auto_id,
        city_id,
        booking_type,
        title,
        description,
        image_path,
        ip,
        status,
        modified_by,
      } = req.body;

      if (!auto_id) {
        return res.status(400).json({
          status: "failed",
          message: "auto_id is required",
        });
      }

      const updateValue = {
        city_id,
        booking_type,
        title,
        description,
        image_path,
        ip,
        status,
        modified_by,
        modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      };

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

      const sql = `UPDATE master_city_introduction SET ${setClause} WHERE id = :autoId`;

      await sequelize.query(sql, {
        replacements: {
          ...updateValue,
          autoId: auto_id,
        },
        type: QueryTypes.UPDATE,
      });

      res.json({
        status: "success",
        message: "Data updated successfully",
      });
    } catch (error) {
      console.error("Error in updateCityIntroductionDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async cityIntroductionStatus(req, res) {
    try {
      const { id, user_id, status } = req.body;

      if (!id || !user_id || status === undefined) {
        return res.status(400).json({
          status: "failed",
          message: "id, user_id, and status are required",
        });
      }

      // Convert id string to array for IN clause
      const idArray = id.split(",").map((item) => item.trim());

      const sql = "UPDATE master_city_introduction SET status = :status, modified_by = :userId, modified_date = :modifiedDate WHERE id IN (:idArray)";

      await sequelize.query(sql, {
        replacements: {
          status,
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
      console.error("Error in cityIntroductionStatus:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default MasterCityIntroductionController;