import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import dateFormat from "dateformat";


class MasterTransferController {


  static async uploadImage(req, res) {
    try {
      console.log('📤 Upload request received:', {
        file: req.file ? {
          originalname: req.file.originalname,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype
        } : 'No file',
        uploadedFilePath: req.uploadedFilePath
      });

      if (!req.file) {
        return res.status(400).json({
          status: "failed",
          message: "No file uploaded",
        });
      }

      // Use the path that multer already prepared for us
      const filePath = req.uploadedFilePath;

      console.log(' File uploaded successfully:', {
        filename: req.file.filename,
        filePath: filePath,
        size: req.file.size
      });

      // Return the file path to frontend
      res.json({
        status: "success",
        message: "Image uploaded successfully",
        data: {
          filename: req.file.filename,
          filePath: filePath,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: `/${filePath}` // URL for frontend access
        },
      });

    } catch (error) {
      console.error("❌ Error in uploadImage:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error while uploading image",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getTransferDetails(req, res) {
    try {
      const { country_id, status, auto_id } = req.body;

      let sql = `
        SELECT 
          me.*,
          mc.name AS country_name 
        FROM master_transfer as me  
        LEFT JOIN master_country as mc ON me.country_id = mc.id 
        WHERE 1=1
      `;

      const replacements = {};

      if (country_id && country_id !== "") {
        const countryIds = country_id.split(",").map((item) => item.trim());
        sql += " AND me.country_id IN (:countryIds)";
        replacements.countryIds = countryIds;
      }

      if (status && status !== "") {
        sql += " AND me.status = :status";
        replacements.status = status;
      }

      if (auto_id && auto_id !== "") {
        sql += " AND me.id = :autoId";
        replacements.autoId = auto_id;
      }

      sql += " ORDER BY me.id DESC";

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
      console.error("Error in getTransferDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async addTransferDetails(req, res) {
    try {
      const {
        country_id,
        title,
        description,
        image_path,
        ip,
        status,
        created_by,
      } = req.body;

      const insertValue = {
        country_id,
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
      const sql = `INSERT INTO master_transfer (${columns.join(
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
      console.error("Error in addTransferDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async updateTransferDetails(req, res) {
    try {
      const {
        auto_id,
        country_id,
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
        country_id,
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

      const sql = `UPDATE master_transfer SET ${setClause} WHERE id = :autoId`;

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
      console.error("Error in updateTransferDetails:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async transferStatus(req, res) {
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
        "UPDATE master_transfer SET status = :status, modified_by = :userId, modified_date = :modifiedDate WHERE id IN (:idArray)";

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
      console.error("Error in transferStatus:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default MasterTransferController;
