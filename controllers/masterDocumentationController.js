import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import dateFormat from "dateformat";

class MasterDocumentationController {
  static async getMasterDocumentation(req, res) {
    const { booking_type, country_id, status, auto_id } = req.body;

    try {
      let sql = `
        SELECT 
          md.*,
          mc.name AS country_name,
          tt.tour_type as package_name 
        FROM master_documentation as md 
        LEFT JOIN tour_type as tt ON md.booking_type = tt.id 
        LEFT JOIN master_country as mc ON md.country_id = mc.id 
        WHERE 1=1
      `;

      const replacements = {};

      if (booking_type && booking_type !== "") {
        const bookingTypes = booking_type.split(",").map((item) => item.trim());
        sql += " AND md.booking_type IN (:bookingTypes)";
        replacements.bookingTypes = bookingTypes;
      }

      if (country_id && country_id !== "") {
        const countryIds = country_id.split(",").map((item) => item.trim());
        sql += " AND md.country_id IN (:countryIds)";
        replacements.countryIds = countryIds;
      }

      if (status && status !== "") {
        sql += " AND md.status = :status";
        replacements.status = status;
      }

      if (auto_id && auto_id !== "") {
        sql += " AND md.id = :autoId";
        replacements.autoId = auto_id;
      }

      sql += " ORDER BY md.id DESC";

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
      console.error("Error fetching master documentation:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching master documentation",
      });
    }
  }

  static async addDocumentationDetails(req, res) {
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

      // Using parameterized query for safety
      const columns = Object.keys(insertValue);
      const values = Object.values(insertValue);
      const placeholders = columns
        .map((_, index) => `:${columns[index]}`)
        .join(", ");

      const sql = `INSERT INTO master_documentation (${columns.join(
        ", "
      )}) VALUES (${placeholders})`;

      const [result] = await sequelize.query(sql, {
        replacements: insertValue,
        type: QueryTypes.INSERT,
      });

      if (result) {
        res.json({
          status: "success",
          data: result, // Sequelize returns the insert ID directly
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error in addDocumentationDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async updateDocumentationDetails(req, res) {
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

      const sql = `UPDATE master_documentation SET ${setClause} WHERE id = :autoId`;

      // Execute the query - Sequelize returns [result, metadata] for UPDATE queries
      const [result, metadata] = await sequelize.query(sql, {
        replacements: {
          ...updateValue,
          autoId: auto_id,
        },
        type: QueryTypes.UPDATE,
      });

      console.log("Update metadata:", metadata);
      console.log("Update result:", result);

      // For UPDATE queries, check metadata.affectedRows or result based on your database
      // MySQL usually returns affectedRows in metadata
      const affectedRows = metadata || result;

      if (affectedRows > 0) {
        res.json({
          status: "success",
          message: "Data updated successfully",
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "No records updated or record not found",
        });
      }
    } catch (error) {
      console.error("Error in updateDocumentationDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async documentationStatus(req, res) {
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
      "UPDATE master_documentation SET status = :status, modified_by = :userId, modified_date = :modifiedDate WHERE id IN (:idArray)";

    // Execute the update
    await sequelize.query(sql, {
      replacements: {
        status,
        userId: user_id,
        idArray,
        modifiedDate: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
      },
      type: QueryTypes.UPDATE,
    });

   
    
    const countSql = "SELECT COUNT(*) as count FROM master_documentation WHERE id IN (:idArray) AND status = :status";
    
    const [countResult] = await sequelize.query(countSql, {
      replacements: {
        idArray,
        status
      },
      type: QueryTypes.SELECT,
    });

    const updatedCount = countResult.count;

    if (updatedCount > 0) {
      res.json({
        status: "success",
        message: `${updatedCount} record(s) updated successfully`,
      });
    } else {
      res.json({
        status: "success", 
        message: "Update completed",
      });
    }

  } catch (error) {
    console.error("Error in documentationStatus:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}
}

export default MasterDocumentationController;
