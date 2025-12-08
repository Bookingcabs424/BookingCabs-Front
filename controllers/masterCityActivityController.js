import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import dateFormat from "dateformat";

class MasterActivityController {
  static async getCityActivityDetails(req, res) {
    try {
      const {
        user_id,
        booking_type,
        country_id,
        city_id,
        status,
        auto_id,
        multi_auto_id,
      } = req.body;

      let sql = `
        SELECT 
          mci.*,
          mc.name AS city_name,
          mc.currency 
        FROM master_activity as mci 
        LEFT JOIN master_city as mc ON mci.city_id = mc.id 
        WHERE 1=1
      `;

      const replacements = {};

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

      if (multi_auto_id && multi_auto_id !== "") {
        const multiAutoIds = multi_auto_id
          .split(",")
          .map((item) => item.trim());
        sql += " AND mci.id IN (:multiAutoIds)";
        replacements.multiAutoIds = multiAutoIds;
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
      console.error("Error in getCityActivityDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async addCityActivityDetails(req, res) {
    try {
      const {
        city_id,
        latitude,
        longitude,
        title,
        description,
        address,
        image_path,
        ip,
        status,
        created_by,
      } = req.body;


      const sanitizedAddress = address.replace(/[^\x00-\x7F]/g, '');

      const insertValue = {
        city_id,
        latitude,
        longitude,
        title,
        description,
        address: sanitizedAddress,
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
      const sql = `INSERT INTO master_activity (${columns.join(
        ", "
      )}) VALUES (${placeholders})`;

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
      console.error("Error in addCityActivityDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async updateCityActivityDetails(req, res) {
    try {
      const {
        auto_id,
        city_id,
        latitude,
        longitude,
        title,
        description,
        address,
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
        latitude,
        longitude,
        title,
        description,
        address,
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

      const sql = `UPDATE master_activity SET ${setClause} WHERE id = :autoId`;

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
      console.error("Error in updateCityActivityDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async cityActivityStatus(req, res) {
    try {
      const { id, user_id, status } = req.body;

      if (!id || !user_id || status === undefined) {
        return res.status(400).json({
          status: "failed",
          message: "id, user_id, and status are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const sql =
        "UPDATE master_activity SET status = :status, modified_by = :userId, modified_date = :modifiedDate WHERE id IN (:idArray)";

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
      console.error("Error in cityActivityStatus:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async getActivityFare(req, res) {
    try {
      const { activity_id } = req.body;

      let sql = "SELECT * FROM master_activity_rates WHERE 1=1";
      const replacements = {};

      if (activity_id && activity_id !== "") {
        sql += " AND activity_id = :activityId";
        replacements.activityId = activity_id;
      }

      sql += " ORDER BY id ASC";

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
      console.error("Error in getActivityFare:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async addActivityFare(req, res) {
    try {
      const { user_id, activity_id, cancelfaredata } = req.body;

      if (!user_id || user_id <= 0) {
        return res.status(400).json({
          status: "failed",
          message: "Valid user_id is required",
        });
      }

      if (!activity_id) {
        return res.status(400).json({
          status: "failed",
          message: "activity_id is required",
        });
      }

      // Delete existing rates for this activity
      const deleteSql =
        "DELETE FROM master_activity_rates WHERE activity_id = :activityId";
      await sequelize.query(deleteSql, {
        replacements: { activityId: activity_id },
        type: QueryTypes.DELETE,
      });

      if (cancelfaredata && cancelfaredata.length > 0) {
        const insertValues = cancelfaredata.map((row) => ({
          activity_id: row.activity_id,
          type: row.type,
          adult_price: row.adult_price,
          child_price: row.child_price,
          sr_citizen_price: row.sr_citizen_price,
          created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
          created_by: row.created_by,
          ip: row.ip,
        }));

        const columns = Object.keys(insertValues[0]);
        const placeholders = insertValues
          .map(() => `(${columns.map((col) => `:${col}`).join(", ")})`)
          .join(", ");

        const insertSql = `INSERT INTO master_activity_rates (${columns.join(
          ", "
        )}) VALUES ${placeholders}`;

        const flattenedValues = {};
        insertValues.forEach((value, index) => {
          Object.keys(value).forEach((key) => {
            flattenedValues[`${key}_${index}`] = value[key];
          });
        });

        await sequelize.query(insertSql, {
          replacements: flattenedValues,
          type: QueryTypes.INSERT,
        });

        res.json({
          status: "success",
          message: "Activity fares added successfully",
        });
      } else {
        res.json({
          status: "success",
          message: "No fares to insert",
        });
      }
    } catch (error) {
      console.error("Error in addActivityFare:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async getActivityFareList(req, res) {
    try {
      const { activity_id } = req.body;

      if (!activity_id) {
        return res.status(400).json({
          status: "failed",
          message: "activity_id is required",
        });
      }

      const sql =
        "SELECT * FROM master_activity_rates WHERE activity_id = :activityId ORDER BY id ASC";

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements: { activityId: activity_id },
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
      console.error("Error in getActivityFareList:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default MasterActivityController;
