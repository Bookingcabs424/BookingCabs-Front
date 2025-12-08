import MasterPackage from "../models/masterPackageModel.js";

class MasterPackageController {
  static async getAllPackage(req, res) {
    try {
      const packages = await MasterPackage.findAll();

      return res.status(200).json({
        success: true,
        data: packages,
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

  static async getPackages(req, res) {
    try {
      const {
        booking_type_id,
        package_mode_id,
        package_type_id,
        status,
        auto_id,
        name,
      } = req.body;

      let sql = `
                SELECT 
                    mp.*,
                    mbt.booking_type,
                    mpm.mode_name as package_mode_name,
                    mpt.type_name as package_type_name
                FROM master_package as mp 
                LEFT JOIN master_booking_type as mbt ON mp.booking_type_id = mbt.id 
                LEFT JOIN master_package_mode as mpm ON mp.package_mode_id = mpm.id 
                LEFT JOIN master_package_type as mpt ON mp.package_type_id = mpt.id 
                WHERE 1=1
            `;

      const replacements = {};

      if (booking_type_id && booking_type_id !== "") {
        const bookingTypeIds = booking_type_id
          .split(",")
          .map((item) => item.trim());
        sql += " AND mp.booking_type_id IN (:bookingTypeIds)";
        replacements.bookingTypeIds = bookingTypeIds;
      }

      if (package_mode_id && package_mode_id !== "") {
        const packageModeIds = package_mode_id
          .split(",")
          .map((item) => item.trim());
        sql += " AND mp.package_mode_id IN (:packageModeIds)";
        replacements.packageModeIds = packageModeIds;
      }

      if (package_type_id && package_type_id !== "") {
        const packageTypeIds = package_type_id
          .split(",")
          .map((item) => item.trim());
        sql += " AND mp.package_type_id IN (:packageTypeIds)";
        replacements.packageTypeIds = packageTypeIds;
      }

      if (status && status !== "") {
        sql += " AND mp.status = :status";
        replacements.status = status;
      }

      if (auto_id && auto_id !== "") {
        sql += " AND mp.id = :auto_id";
        replacements.auto_id = auto_id;
      }

      if (name && name !== "") {
        sql += " AND mp.name LIKE :name";
        replacements.name = `%${name}%`;
      }

      sql += " ORDER BY mp.id DESC";

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
          message: "No packages found",
        });
      }
    } catch (error) {
      console.error("Error in getPackages:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  static async addPackage(req, res) {
    try {
      const {
        booking_type_id,
        package_mode_id,
        package_type_id,
        name,
        icon,
        image,
        description,
        ip,
        status,
        created_by,
      } = req.body;

      if (
        !booking_type_id ||
        !package_mode_id ||
        !package_type_id ||
        !name ||
        !created_by
      ) {
        return res.status(400).json({
          status: "failed",
          message:
            "booking_type_id, package_mode_id, package_type_id, name, and created_by are required",
        });
      }

      const insertData = {
        booking_type_id,
        package_mode_id,
        package_type_id,
        name,
        icon: icon || "",
        image: image || null,
        description: description || null,
        ip: ip || null,
        status: status || 1,
        created_by,
        created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      };

      const newPackage = await MasterPackage.create(insertData);

      res.json({
        status: "success",
        data: newPackage.id,
        message: "Package added successfully",
      });
    } catch (error) {
      console.error("Error in addPackage:", error);

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          status: "failed",
          message: "Package name already exists",
        });
      }

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          status: "failed",
          message:
            "Invalid foreign key reference (booking_type_id, package_mode_id, or package_type_id)",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Update package
  static async updatePackage(req, res) {
    try {
      const {
        auto_id,
        booking_type_id,
        package_mode_id,
        package_type_id,
        name,
        icon,
        image,
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

      const updateData = {
        modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      };

      if (booking_type_id) updateData.booking_type_id = booking_type_id;
      if (package_mode_id) updateData.package_mode_id = package_mode_id;
      if (package_type_id) updateData.package_type_id = package_type_id;
      if (name) updateData.name = name;
      if (icon !== undefined) updateData.icon = icon;
      if (image !== undefined) updateData.image = image;
      if (description !== undefined) updateData.description = description;
      if (ip) updateData.ip = ip;
      if (status !== undefined) updateData.status = status;
      if (modified_by) updateData.modified_by = modified_by;

      const [affectedRows] = await MasterPackage.update(updateData, {
        where: { id: auto_id },
      });

      if (affectedRows > 0) {
        res.json({
          status: "success",
          message: "Package updated successfully",
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "Package not found or no changes made",
        });
      }
    } catch (error) {
      console.error("Error in updatePackage:", error);

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          status: "failed",
          message: "Package name already exists",
        });
      }

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

  // Update package status (multiple)
  static async updatePackageStatus(req, res) {
    try {
      const { id, user_id, status } = req.body;

      if (!id || !user_id || status === undefined) {
        return res.status(400).json({
          status: "failed",
          message: "id, user_id, and status are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const [affectedRows] = await MasterPackage.update(
        {
          status,
          modified_by: user_id,
          modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        },
        {
          where: { id: idArray },
        }
      );

      res.json({
        status: "success",
        message: "Packages status updated successfully",
        affectedRows,
      });
    } catch (error) {
      console.error("Error in updatePackageStatus:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Delete packages (multiple)
  static async deletePackages(req, res) {
    try {
      const { id, user_id } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({
          status: "failed",
          message: "id and user_id are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const deletedCount = await MasterPackage.destroy({
        where: { id: idArray },
      });

      res.json({
        status: "success",
        message: "Packages deleted successfully",
        deletedCount,
      });
    } catch (error) {
      console.error("Error in deletePackages:", error);

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          status: "failed",
          message: "Cannot delete package as it is being used by other records",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Soft delete packages (update status to 2)
  static async softDeletePackages(req, res) {
    try {
      const { id, user_id } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({
          status: "failed",
          message: "id and user_id are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const [affectedRows] = await MasterPackage.update(
        {
          status: 2,
          modified_by: user_id,
          modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        },
        {
          where: { id: idArray },
        }
      );

      res.json({
        status: "success",
        message: "Packages soft deleted successfully",
        affectedRows,
      });
    } catch (error) {
      console.error("Error in softDeletePackages:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Get packages by booking type
  static async getPackagesByBookingType(req, res) {
    try {
      const { booking_type_id, status } = req.body;

      if (!booking_type_id) {
        return res.status(400).json({
          status: "failed",
          message: "booking_type_id is required",
        });
      }

      const whereClause = { booking_type_id };
      if (status !== undefined) whereClause.status = status;

      const packages = await MasterPackage.findAll({
        where: whereClause,
        include: [
          {
            model: sequelize.models.master_package_mode,
            attributes: ["mode_name"],
          },
          {
            model: sequelize.models.master_package_type,
            attributes: ["type_name"],
          },
        ],
        order: [["name", "ASC"]],
      });

      res.json({
        status: "success",
        data: packages,
      });
    } catch (error) {
      console.error("Error in getPackagesByBookingType:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Search packages by name
  static async searchPackages(req, res) {
    try {
      const { search_term, status } = req.body;

      if (!search_term) {
        return res.status(400).json({
          status: "failed",
          message: "search_term is required",
        });
      }

      const whereClause = {
        name: {
          [sequelize.Op.like]: `%${search_term}%`,
        },
      };

      if (status !== undefined) whereClause.status = status;

      const packages = await MasterPackage.findAll({
        where: whereClause,
        include: [
          {
            model: sequelize.models.master_booking_type,
            attributes: ["booking_type"],
          },
          {
            model: sequelize.models.master_package_mode,
            attributes: ["mode_name"],
          },
          {
            model: sequelize.models.master_package_type,
            attributes: ["type_name"],
          },
        ],
        limit: 50,
        order: [["name", "ASC"]],
      });

      res.json({
        status: "success",
        data: packages,
      });
    } catch (error) {
      console.error("Error in searchPackages:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}

export default MasterPackageController;
