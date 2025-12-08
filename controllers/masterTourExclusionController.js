import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import dateFormat from "dateformat";

class MasterTourExclusionController {
  static async getTourExclusionDetails(req, res) {
    try {
      const { user_id, booking_type, country_id, status, auto_id } = req.body;

      let sql = `
                SELECT 
                    mti.*,
                    mc.name AS country_name,
                    tt.tour_type as package_name, 
                    u.first_name as created_by_name 
                FROM master_tour_exclusion as mti 
                LEFT JOIN tour_type as tt ON mti.booking_type = tt.id 
                LEFT JOIN master_country as mc ON mti.country_id = mc.id 
                LEFT JOIN user as u ON mti.created_by = u.id 
                WHERE 1=1
            `;

      const replacements = {};

      if (booking_type && booking_type !== "") {
        const bookingTypes = booking_type.split(",").map((item) => item.trim());
        sql += " AND mti.booking_type IN (:bookingTypes)";
        replacements.bookingTypes = bookingTypes;
      }

      if (country_id && country_id !== "") {
        const countryIds = country_id.split(",").map((item) => item.trim());
        sql += " AND mti.country_id IN (:countryIds)";
        replacements.countryIds = countryIds;
      }

      if (status && status !== "") {
        sql += " AND mti.status = :status";
        replacements.status = status;
      }

      if (auto_id && auto_id !== "") {
        sql += " AND mti.id = :auto_id";
        replacements.auto_id = auto_id;
      }

      sql += " ORDER BY mti.id DESC";

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
      console.error("Error in getTourexclusionDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async addTourExclusionDetails(req, res) {
    try {
      const {
        country_id,
        booking_type,
        title,
        description,
        ip,
        status,
        created_by,
      } = req.body;

      const insertValue = {
        country_id,
        booking_type,
        title,
        description,
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
      const sql = `INSERT INTO master_tour_exclusion (${columns.join(
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
          message: "Tour exclusion added successfully",
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error in addTourexclusionDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async updateTourExclusionDetails(req, res) {
    try {
      const {
        auto_id,
        country_id,
        booking_type,
        title,
        description,
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
        country_id,
        booking_type,
        title,
        description,
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

      const sql = `UPDATE master_tour_exclusion SET ${setClause} WHERE id = :auto_id`;

      await sequelize.query(sql, {
        replacements: {
          ...updateValue,
          auto_id,
        },
        type: QueryTypes.UPDATE,
      });

      res.json({
        status: "success",
        message: "Tour exclusion updated successfully",
      });
    } catch (error) {
      console.error("Error in updateTourexclusionDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async tourExclusionStatus(req, res) {
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

      const sql =
        "UPDATE master_tour_exclusion SET status = :status, modified_by = :user_id, modified_date = :modified_date WHERE id IN (:idArray)";

      await sequelize.query(sql, {
        replacements: {
          status,
          user_id,
          idArray,
          modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        },
        type: QueryTypes.UPDATE,
      });

      res.json({
        status: "success",
        message: "Tour exclusions status updated successfully",
      });
    } catch (error) {
      console.error("Error in tourexclusionStatus:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  

  static async deleteTourExclusions(req, res) {
    try {
      const { id, user_id } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({
          status: "failed",
          message: "id and user_id are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const sql = "DELETE FROM master_tour_exclusion WHERE id IN (:idArray)";

      const result = await sequelize.query(sql, {
        replacements: { idArray },
        type: QueryTypes.DELETE,
      });

      res.json({
        status: "success",
        message: "Tour exclusions deleted successfully",
        affectedRows: result, // result is number of rows deleted
      });
    } catch (error) {
      console.error("Error in deleteTourexclusions:", error);

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          status: "failed",
          message:
            "Cannot delete tour exclusion as it is being used by other records",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Soft delete tour exclusions (update status to 2)
  static async softDeleteTourExclusions(req, res) {
    try {
      const { id, user_id } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({
          status: "failed",
          message: "id and user_id are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const sql =
        "UPDATE master_tour_exclusion SET status = 2, modified_by = :user_id, modified_date = :modified_date WHERE id IN (:idArray)";

      await sequelize.query(sql, {
        replacements: {
          user_id,
          idArray,
          modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        },
        type: QueryTypes.UPDATE,
      });

      res.json({
        status: "success",
        message: "Tour exclusions soft deleted successfully",
      });
    } catch (error) {
      console.error("Error in softDeleteTourexclusions:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default MasterTourExclusionController;
