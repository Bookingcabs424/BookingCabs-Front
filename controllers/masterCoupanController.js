import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import dateFormat from "dateformat";

class MasterCouponController {
  static async couponValidate(req, res) {
    try {
      const { companyId, couponcode, masterPackageId } = req.query;

      if (!companyId || !couponcode || !masterPackageId) {
        return res.status(400).json({
          status: "failed",
          message: "companyId, couponcode, and masterPackageId are required",
        });
      }

      const start_date = dateFormat(new Date(), "yyyy-mm-dd");

      let sql = `
                SELECT * FROM master_coupon as mc 
                WHERE DATE_FORMAT(valid_from_date, "%Y-%m-%d") <= :start_date 
                AND DATE_FORMAT(valid_to_date, "%Y-%m-%d") >= :start_date
            `;

      const replacements = { start_date };

      if (couponcode) {
        sql += " AND mc.name = :couponcode";
        replacements.couponcode = couponcode;
      }

      if (companyId) {
        sql += " AND mc.company_id = :companyId";
        replacements.companyId = companyId;
      }

      if (masterPackageId) {
        sql += " AND mc.master_package_id = :masterPackageId";
        replacements.masterPackageId = masterPackageId;
      }

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      if (results.length > 0) {
        res.json({
          status: "success",
          message: "Get Coupon Code Successfully",
          data: results[0],
        });
      } else {
        res.status(404).json({
          status: "failed",
          error: "No Record Found!",
        });
      }
    } catch (error) {
      console.error("Error in couponValidate:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async couponValidation(req, res) {
    try {
      const { companyId, couponcode, masterPackageId } = req.query;

      const start_date = dateFormat(new Date(), "yyyy-mm-dd");

      let sql = `
                SELECT * FROM master_coupon as mc 
                WHERE DATE_FORMAT(valid_from_date, "%Y-%m-%d") <= :start_date 
                AND DATE_FORMAT(valid_to_date, "%Y-%m-%d") >= :start_date
            `;

      const replacements = { start_date };

      if (couponcode) {
        sql += " AND mc.name = :couponcode";
        replacements.couponcode = couponcode;
      }

      if (companyId) {
        sql += " AND mc.company_id = :companyId";
        replacements.companyId = companyId;
      }

      if (masterPackageId) {
        sql += " AND mc.master_package_id = :masterPackageId";
        replacements.masterPackageId = masterPackageId;
      }

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      if (results.length > 0) {
        res.json({
          status: "success",
          message: "Get Coupon Code Successfully",
          data: results[0],
        });
      } else {
        res.status(404).json({
          status: "failed",
          error: "No Coupon Code Found!",
        });
      }
    } catch (error) {
      console.error("Error in couponValidation:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async getAllCoupanTypes(req, res) {
    try {
      const sql = `SELECT * FROM master_coupon_type WHERE 1=1 ORDER BY id desc`;

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
      });

      return res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error("error", error);
      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error,
      });
    }
  }

  static async deleteCouponTypes(req, res) {
    try {
      const { id, user_id } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({
          status: "failed",
          message: "id and user_id are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const sql = "DELETE FROM master_coupon_type WHERE id IN (:idArray)";

      const [result] = await sequelize.query(sql, {
        replacements: {
          idArray,
        },
        type: QueryTypes.DELETE,
      });

      res.json({
        status: "success",
        message: "Coupon types deleted successfully",
        affectedRows: result.affectedRows,
      });
    } catch (error) {
      console.error("Error in deleteCouponTypes:", error);

      // Handle foreign key constraint errors
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          status: "failed",
          message: "Cannot delete coupon type as it is being used by coupons",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async addCoupanType(req, res) {
    try {
      const { name, valid_to_date, valid_from_date } = req.body;

      const insertValue = {
        name,
        valid_from_date,
        valid_to_date,
      };

      Object.keys(insertValue).forEach((key) => {
        if (insertValue[key] === "undefined" || insertValue[key] === "") {
          delete insertValue[key];
        }
      });

      const columns = Object.keys(insertValue);
      const placeholders = columns.map((col) => `:${col}`).join(", ");
      const sql = `INSERT INTO master_coupon_type (${columns.join(
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
          message: "Coupon type added successfully",
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Failed to add coupon type",
        });
      }
    } catch (error) {
      console.error("error", error);
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  // update coupan type

  static async updateCouponType(req, res) {
    try {
      const { auto_id, name, valid_from_date, valid_to_date } = req.body;

      if (!auto_id) {
        return res.status(400).json({
          status: "failed",
          message: "auto_id is required",
        });
      }

      const updateValue = {
        name,
        valid_from_date,
        valid_to_date,
      };

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

      const sql = `UPDATE master_coupon_type SET ${setClause} WHERE id = :auto_id`;

      await sequelize.query(sql, {
        replacements: {
          ...updateValue,
          auto_id,
        },
        type: QueryTypes.UPDATE,
      });

      res.json({
        status: "success",
        message: "Coupon type updated successfully",
      });
    } catch (error) {
      console.error("Error in updateCouponType:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // coupan

  // add

  static async addCoupan(req, res) {
    const {
      company_id,
      name,
      description,
      master_coupon_type_id,
      valid_from_date,
      valid_to_date,
      master_week_days_id,
      master_package_id,
      minimum_booking_amount,
      discount_type,
      discount_amount,
      image,
      terms_condition,
    } = req.body;

    const insertValue = {
      company_id,
      name,
      description,
      master_coupon_type_id,
      valid_from_date,
      valid_to_date,
      master_week_days_id,
      master_package_id,
      minimum_booking_amount,
      discount_type,
      discount_amount,
      image,
      terms_condition,
    };

    Object.keys(insertValue).forEach((key) => {
      if (insertValue[key] === "undefined" || insertValue[key] === "") {
        delete insertValue[key];
      }
    });

    const columns = Object.keys(insertValue);
    const placeholders = columns.map((col) => `:${col}`).join(", ");
    const sql = `INSERT INTO master_coupon (${columns.join(
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
        message: "Coupon added successfully",
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Failed to add coupon",
      });
    }
  }

  static async getCoupons(req, res) {
    try {
      const { company_id, master_coupon_type_id, master_package_id, auto_id } =
        req.body;

      let sql = `
                SELECT 
                    mc.*,
                    mct.name as coupon_type_name,
                    mp.name as package_name,
                    c.company_name as company_name,
                    GROUP_CONCAT(mw.name) as valid_days_names,
                    GROUP_CONCAT(mw.day_id) as valid_days_ids
                FROM master_coupon as mc 
                LEFT JOIN master_coupon_type as mct ON mc.master_coupon_type_id = mct.id 
                LEFT JOIN master_package as mp ON mc.master_package_id = mp.id 
                LEFT JOIN company as c ON mc.company_id = c.id
                LEFT JOIN master_week_days as mw
                ON FIND_IN_SET(mw.id, mc.master_week_days_id)

                WHERE 1=1
            `;
      const replacements = {};

      if (company_id && company_id !== "") {
        const companyIds = company_id.split(",").map((item) => item.trim());
        sql += " AND mc.company_id IN (:companyIds)";
        replacements.companyIds = companyIds;
      }

      if (master_coupon_type_id && master_coupon_type_id !== "") {
        const typeIds = master_coupon_type_id
          .split(",")
          .map((item) => item.trim());
        sql += " AND mc.master_coupon_type_id IN (:typeIds)";
        replacements.typeIds = typeIds;
      }

      if (master_package_id && master_package_id !== "") {
        const packageIds = master_package_id
          .split(",")
          .map((item) => item.trim());
        sql += " AND mc.master_package_id IN (:packageIds)";
        replacements.packageIds = packageIds;
      }

      if (auto_id && auto_id !== "") {
        sql += " AND mc.id = :auto_id";
        replacements.auto_id = auto_id;
      }

      sql += " GROUP BY mc.id ORDER BY mc.id DESC";

      const results = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      // Process the results to format week days data
      const processedResults = results.map((coupon) => ({
        ...coupon,
        valid_days_names: coupon.valid_days_names
          ? coupon.valid_days_names.split(",")
          : [],
        valid_days_ids: coupon.valid_days_ids
          ? coupon.valid_days_ids.split(",").map((id) => parseInt(id))
          : [],
      }));

      res.json({
        status: "success",
        data: processedResults,
      });
    } catch (error) {
      console.error("Error in getCoupons:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async deleteCoupons(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          status: "failed",
          message: "id is required",
        });
      }

      // Convert "17,16" → ["17", "16"]
      const idArray = String(id)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (idArray.length === 0) {
        return res.status(400).json({
          status: "failed",
          message: "No valid IDs found",
        });
      }

      const sql = "DELETE FROM master_coupon WHERE id IN (:ids)";

      const result = await sequelize.query(sql, {
        replacements: { ids: idArray },
        type: QueryTypes.DELETE,
      });

      res.json({
        status: "success",
        message: "Coupons deleted successfully",
        deletedCount: result, // <-- result contains affected rows
      });
    } catch (error) {
      console.error("Error in deleteCoupons:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async updateCoupon(req, res) {
    try {
      const {
        auto_id,
        company_id,
        name,
        description,
        master_coupon_type_id,
        valid_from_date,
        valid_to_date,
        master_weeks_id,
        master_package_id,
        minimum_booking_amount,
        discount_type,
        discount_amount,
        image,
        terms_condition,
      } = req.body;

      if (!auto_id) {
        return res.status(400).json({
          status: "failed",
          message: "auto_id is required",
        });
      }

      const updateValue = {
        company_id,
        name,
        description,
        master_coupon_type_id,
        valid_from_date,
        valid_to_date,
        master_weeks_id,
        master_package_id,
        minimum_booking_amount,
        discount_type,
        discount_amount,
        image,
        terms_condition,
      };

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

      const sql = `UPDATE master_coupon SET ${setClause} WHERE id = :auto_id`;

      await sequelize.query(sql, {
        replacements: {
          ...updateValue,
          auto_id,
        },
        type: QueryTypes.UPDATE,
      });

      res.json({
        status: "success",
        message: "Coupon updated successfully",
      });
    } catch (error) {
      console.error("Error in updateCoupon:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default MasterCouponController;
