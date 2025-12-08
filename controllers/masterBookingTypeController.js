import sequelize from "../config/clientDbManager.js";
import MasterBookingType from "../models/masterBookingTypeModel.js";
import dateFormat from "dateformat";
class MasterBookingTypes {
  static async getAllBookingTypes(req, res) {
    try {
      const { status, auto_id, booking_type } = req.body;

      let whereClause = {};
      const replacements = {};

      if (status && status !== "") {
        whereClause.status = status;
      }

      if (auto_id && auto_id !== "") {
        whereClause.id = auto_id;
      }

      if (booking_type && booking_type !== "") {
        const bookingTypes = booking_type.split(",").map((item) => item.trim());
        whereClause.booking_type = bookingTypes;
      }

      const bookingTypes = await MasterBookingType.findAll({
        where: whereClause,
        order: [
       
          ["id", "DESC"],
        ],
      });

      if (bookingTypes.length > 0) {
        return res.status(200).json({
          success: true,
          data: bookingTypes,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No Data Found",
        });
      }
    } catch (error) {
      console.error("error", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error,
      });
    }
  }

  static async addBookingType(req, res) {
    try {
      const { booking_type, menu_order, ip, status, created_by } = req.body;

      if (!booking_type || !created_by) {
        return res.status(400).json({
          status: "failed",
          message: "booking_type and created_by are required",
        });
      }

      const insertData = {
        booking_type,
        menu_order: menu_order || null,
        ip: ip || null,
        status: status || 1,
        created_by,
        created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      };

      const newBookingType = await MasterBookingType.create(insertData);

      res.json({
        status: "success",
        data: newBookingType.id,
        message: "Booking type added successfully",
      });
    } catch (error) {
      console.error("Error in addBookingType:", error);

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          status: "failed",
          message: "Booking type already exists",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Update booking type
  static async updateBookingType(req, res) {
    try {
      const { auto_id, booking_type, menu_order, ip, status, modified_by } =
        req.body;

      if (!auto_id) {
        return res.status(400).json({
          status: "failed",
          message: "auto_id is required",
        });
      }

      const updateData = {
        modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      };

      if (booking_type) updateData.booking_type = booking_type;
      if (menu_order !== undefined) updateData.menu_order = menu_order;
      if (ip) updateData.ip = ip;
      if (status !== undefined) updateData.status = status;
      if (modified_by) updateData.modified_by = modified_by;

      const [affectedRows] = await MasterBookingType.update(updateData, {
        where: { id: auto_id },
      });

      if (affectedRows > 0) {
        res.json({
          status: "success",
          message: "Booking type updated successfully",
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "Booking type not found or no changes made",
        });
      }
    } catch (error) {
      console.error("Error in updateBookingType:", error);

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          status: "failed",
          message: "Booking type already exists",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Update booking type status (multiple)
  static async updateBookingTypeStatus(req, res) {
    try {
      const { id, user_id, status } = req.body;

      if (!id || !user_id || status === undefined) {
        return res.status(400).json({
          status: "failed",
          message: "id, user_id, and status are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const [affectedRows] = await MasterBookingType.update(
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
        message: "Booking types status updated successfully",
        affectedRows,
      });
    } catch (error) {
      console.error("Error in updateBookingTypeStatus:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Delete booking types (multiple)
  static async deleteBookingTypes(req, res) {
    try {
      const { id, user_id } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({
          status: "failed",
          message: "id and user_id are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const deletedCount = await MasterBookingType.destroy({
        where: { id: idArray },
      });

      res.json({
        status: "success",
        message: "Booking types deleted successfully",
        deletedCount,
      });
    } catch (error) {
      console.error("Error in deleteBookingTypes:", error);

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          status: "failed",
          message:
            "Cannot delete booking type as it is being used by other records",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Soft delete booking types (update status to 2)
  static async softDeleteBookingTypes(req, res) {
    try {
      const { id, user_id } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({
          status: "failed",
          message: "id and user_id are required",
        });
      }

      const idArray = id.split(",").map((item) => item.trim());

      const [affectedRows] = await MasterBookingType.update(
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
        message: "Booking types soft deleted successfully",
        affectedRows,
      });
    } catch (error) {
      console.error("Error in softDeleteBookingTypes:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Reorder booking types menu order
  static async reorderBookingTypes(req, res) {
    try {
      const { order_data } = req.body; 

      if (!order_data || !Array.isArray(order_data)) {
        return res.status(400).json({
          status: "failed",
          message: "order_data array is required",
        });
      }

      const updatePromises = order_data.map((item) =>
        MasterBookingType.update(
          { menu_order: item.menu_order },
          { where: { id: item.id } }
        )
      );

      await Promise.all(updatePromises);

      res.json({
        status: "success",
        message: "Booking types reordered successfully",
      });
    } catch (error) {
      console.error("Error in reorderBookingTypes:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}


export default MasterBookingTypes;
