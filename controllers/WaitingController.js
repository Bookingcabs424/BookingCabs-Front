import sequelize from "../config/clientDbManager.js";
import PreWaitingCharge from "../models/preWaitingChargeModel.js";
import WaitingCharge from "../models/WaitingChargesModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getPreWaitingCharges = async (req, res) => {
  try {
    const {
      id,
      base_vehicle_id,
      pre_waiting_upto_minutes,
      pre_waiting_fees,
      created_by,
      modified_by,
      status,
      ip,
      created_date,
      modified_date,
    } = req.query;

    // Build filters dynamically
    const where = {};
    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (pre_waiting_upto_minutes)
      where.pre_waiting_upto_minutes = pre_waiting_upto_minutes;
    if (pre_waiting_fees) where.pre_waiting_fees = pre_waiting_fees;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;
    if (status) where.status = status;
    if (ip) where.ip = ip;

    // Date filters
    if (created_date) where.created_date = created_date;
    if (modified_date) where.modified_date = modified_date;

    const charges = await PreWaitingCharge.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return successResponse(
      res,
      charges,
      "Pre-waiting charges fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching pre-waiting charges:", error);
    return errorResponse(res, error.message || "Something went wrong");
  }
};

export const upsertPreWaitingCharges = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { charges } = req.body;

    if (!Array.isArray(charges)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Input must be an array of charges",
      });
    }

    const results = [];
    const now = new Date();

    // Validate each charge in the array
    for (let i = 0; i < charges.length; i++) {
      const charge = charges[i];
      const { base_vehicle_id, pre_waiting_upto_minutes, pre_waiting_fees } =
        charge;

      // Only validate the essential fields that exist in your sample data
      if (
        !base_vehicle_id ||
        pre_waiting_upto_minutes === undefined ||
        pre_waiting_fees === undefined
      ) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Charge at index ${i} is missing required fields: base_vehicle_id, pre_waiting_upto_minutes, or pre_waiting_fees`,
        });
      }
    }

    // Process each charge sequentially within transaction
    for (const charge of charges) {
      const {
        id,
        base_vehicle_id,
        pre_waiting_upto_minutes,
        pre_waiting_fees,
        created_by = req.user?.id || 0, // Provide default if user not available
        modified_by = req.user?.id || 0,
        status = 1,
        ip = req.ip || "127.0.0.1", // Get IP from request or use default
      } = charge;

      let result;

      if (id) {
        // Try to find existing record
        const existing = await PreWaitingCharge.findByPk(id, { transaction });

        if (existing) {
          result = await existing.update(
            {
              base_vehicle_id,
              pre_waiting_upto_minutes,
              pre_waiting_fees,
              modified_by,
              modified_date: now,
              status,
              ip,
            },
            { transaction }
          );
        } else {
          result = await PreWaitingCharge.create(
            {
              id,
              base_vehicle_id,
              pre_waiting_upto_minutes,
              pre_waiting_fees,
              created_by,
              created_date: now,
              modified_by,
              modified_date: now,
              status,
              ip,
            },
            { transaction }
          );
        }
      } else {
        result = await PreWaitingCharge.create(
          {
            base_vehicle_id,
            pre_waiting_upto_minutes,
            pre_waiting_fees,
            created_by,
            created_date: now,
            modified_by,
            modified_date: now,
            status,
            ip,
          },
          { transaction }
        );
      }

      results.push(result);
    }

    await transaction.commit();

    res.json({
      success: true,
      message: `All ${charges.length} pre-waiting charges processed successfully`,
      data: results,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in upsertPreWaitingCharges:", error);

    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry or unique constraint violation",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

export const bulkUpsertWaitingCharges = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { charges } = req.body;

    // Validate input is an array
    if (!Array.isArray(charges)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Input must be an array of charges",
      });
    }

    // Validate each charge in the array
    for (let i = 0; i < charges.length; i++) {
      const charge = charges[i];
      const { base_vehicle_id } = charge;

      if (!base_vehicle_id) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Charge at index ${i} is missing required field: base_vehicle_id`,
        });
      }
    }

    const results = [];
    const now = new Date();

    // Process each charge sequentially within transaction
    for (const charge of charges) {
      const {
        id,
        base_vehicle_id,
        waiting_fees,
        waiting_minute_upto,
        status,
        
      } = charge;
     let created_by = req.user.id || 0;
    let  modified_by = req.user.id || 0;
    let ip = req.ip||0
      let result;

      if (id) {
        // Try to find existing record
        const existing = await WaitingCharge.findByPk(id, { transaction });

        if (existing) {
          // Update existing record
          result = await existing.update(
            {
              base_vehicle_id,
              waiting_fees:
                waiting_fees !== undefined
                  ? waiting_fees
                  : existing.waiting_fees,
              waiting_minute_upto:
                waiting_minute_upto !== undefined
                  ? waiting_minute_upto
                  : existing.waiting_minute_upto,
              modified_by: modified_by || existing.modified_by,
              modified_date: now,
              status: status !== undefined ? status : existing.status,
              ip: ip || existing.ip,
            },
            { transaction }
          );
        } else {
          // Create new record with specified ID
          result = await WaitingCharge.create(
            {
              id,
              base_vehicle_id,
              waiting_fees,
              waiting_minute_upto,
              created_by: created_by || modified_by,
              created_date: now,
              modified_by: modified_by || created_by,
              modified_date: now,
              status: status !== undefined ? status : 1,
              ip,
            },
            { transaction }
          );
        }
      } else {
        // Create new record without ID
        result = await WaitingCharge.create(
          {
            base_vehicle_id,
            waiting_fees,
            waiting_minute_upto,
            created_by,
            created_date: now,
            modified_by: modified_by || created_by,
            modified_date: now,
            status: status !== undefined ? status : 1,
            ip,
          },
          { transaction }
        );
      }

      results.push(result);
    }

    await transaction.commit();

    res.json({
      success: true,
      message: `Successfully processed ${charges.length} waiting charges`,
      data: results,
      summary: {
        total: charges.length,
        created: results.filter((r) => !charges.find((c) => c.id === r.id))
          .length,
        updated: results.filter((r) => charges.find((c) => c.id === r.id))
          .length,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in bulkUpsertWaitingCharges:", error);

    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry or unique constraint violation",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};
export const getWaitingCharges = async (req, res) => {
  try {
    const {
      id,
      base_vehicle_id,
      created_by,
      modified_by,
      status,
      waiting_fees,
      waiting_minute_upto,
      created_date,
      modified_date,
      ip,
    } = req.query;

    // Build dynamic filter object
    const where = {};
    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;
    if (status) where.status = status;
    if (waiting_fees) where.waiting_fees = waiting_fees;
    if (waiting_minute_upto) where.waiting_minute_upto = waiting_minute_upto;
    if (ip) where.ip = ip;

    // Handle date filters
    if (created_date) where.created_date = created_date;
    if (modified_date) where.modified_date = modified_date;

    // Fetch from DB
    const charges = await WaitingCharge.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return successResponse(
      res,
      charges,
      "Waiting charges fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching waiting charges:", error);
    return errorResponse(res, error.message || "Something went wrong");
  }
};
