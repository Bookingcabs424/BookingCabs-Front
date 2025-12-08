import sequelize from "../config/clientDbManager.js";
import CancellationFare from "../models/cancellationChargeModel.js";
import MasterCancellation from "../models/masterCancellationModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getMasterCancellations = async (req,res) => {
    try {
        const body = req.query||{}
        let {
            id,
            booking_type_id,
            name,
            description,
            round_off,
            days,
            hours,
            order_by,
            status,
            ip,
            created_by,
            modified_by,
            start_date,
            end_date,
            page,
            limit,
            sort_by = 'id',
            sort_order = 'ASC'
        } = body

        // Build where clause
        const whereClause = {};
        
        // Exact match filters
        if (id) whereClause.id = id;
        if (booking_type_id) whereClause.booking_type_id = booking_type_id;
        if (name) whereClause.name = name;
        if (description) whereClause.description = description;
        if (round_off) whereClause.round_off = round_off;
        if (days) whereClause.days = days;
        if (hours) whereClause.hours = hours;
        if (order_by) whereClause.order_by = order_by;
        if (status) whereClause.status = status;
        if (ip) whereClause.ip = ip;
        if (created_by) whereClause.created_by = created_by;
        if (modified_by) whereClause.modified_by = modified_by;

        // Date range filter
        if (start_date || end_date) {
            whereClause.created_date = {};
            if (start_date) whereClause.created_date[Op.gte] = new Date(start_date);
            if (end_date) whereClause.created_date[Op.lte] = new Date(end_date);
        }

        // Pagination
        const offset = (page - 1) * limit;
console.log({whereClause})
        const result = await MasterCancellation.findAndCountAll({
            where: whereClause,
            order: [[sort_by, sort_order.toUpperCase()]],
            // limit: parseInt(limit),
            // offset: offset
        });

        return res.status(200).json({
            success: true,
            data: result.rows,
            pagination: {
                total: result.count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(result.count / limit)
            }
        });

    } catch (error) {
        console.error('Get MasterCancellations error:', error);
        throw new Error(`Failed to fetch records: ${error.message}`);
    }
};
export const bulkUpsertCancellationFares = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { cancellation_fares, base_vehicle_id } = req.body;
    const userId = req.user?.id || req.body.created_by;

    if (!cancellation_fares || !Array.isArray(cancellation_fares)) {
      return res.status(400).json({
        success: false,
        message: 'cancellation_fares array is required'
      });
    }

    const results = [];

    for (const fare of cancellation_fares) {
      const cancellationData = {
        base_vehicle_id: fare.base_vehicle_id || base_vehicle_id,
        currency_id: fare.currency_id || 1,
        cancellation_master_id: fare.cancellation_master_id,
        cancellation_type: fare.cancellation_type,
        cancellation_value: fare.cancellation_value,
        round_off: fare.round_off || 0,
        days: fare.days || '0',
        hours: fare.hours || '0',
        modified_by: userId,
        status: fare.status || 1,
        ip: fare.ip || req.ip,
        modified_date: new Date()
      };

      // If ID is provided, it's an update
      if (fare.id) {
        cancellationData.id = fare.id;
        // For updates, preserve created_by and created_date
        const existingRecord = await CancellationFare.findByPk(fare.id, { transaction });
        if (existingRecord) {
          cancellationData.created_by = existingRecord.created_by;
          cancellationData.created_date = existingRecord.created_date;
        }
      } else {
        // For new records, set created_by and created_date
        cancellationData.created_by = userId;
        cancellationData.created_date = new Date();
      }

      let cancellationFare;
      let created = false;

      if (fare.id) {
        // Update existing record by ID
        cancellationFare = await CancellationFare.findByPk(fare.id, { transaction });
        if (cancellationFare) {
          await cancellationFare.update(cancellationData, { transaction });
        } else {
          // ID provided but record doesn't exist - create new
          cancellationFare = await CancellationFare.create(cancellationData, { transaction });
          created = true;
        }
      } else {
        // No ID provided - upsert based on composite key
        [cancellationFare, created] = await CancellationFare.upsert(cancellationData, {
          transaction,
          conflictFields: ['base_vehicle_id', 'cancellation_master_id']
        });
      }

      results.push({
        data: cancellationFare,
        created: created,
        id: cancellationFare.id
      });
    }

    await transaction.commit();

    return res.status(200).json({
      success: true,
      data: results,
      message: 'Cancellation fares processed successfully'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Bulk upsert CancellationFares error:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to process cancellation fares: ${error.message}`
    });
  }
};
// controllers/cancellationFareController.js


export const getCancellationFares = async (req, res) => {
  try {
    // extract filters from query
    const {
      id,
      base_vehicle_id,
      currency_id,
      cancellation_master_id,
      cancellation_type,
      cancellation_value,
      round_off,
      days,
      hours,
      created_by,
      modified_by,
      status,
      ip,
      created_date,
      modified_date,
    } = req.query;

    // build where dynamically
    const where = {};

    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (currency_id) where.currency_id = currency_id;
    if (cancellation_master_id) where.cancellation_master_id = cancellation_master_id;
    if (cancellation_type) where.cancellation_type = cancellation_type;
    if (cancellation_value) where.cancellation_value = cancellation_value;
    if (round_off) where.round_off = round_off;
    if (days) where.days = days;
    if (hours) where.hours = hours;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;
    if (status) where.status = status;
    if (ip) where.ip = ip;

    // date filters (range)
    if (created_date) {
      where.created_date = created_date; // can extend for between queries
    }
    if (modified_date) {
      where.modified_date = modified_date;
    }

    const fares = await CancellationFare.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return successResponse(res, fares, "Cancellation fares fetched successfully");
  } catch (error) {
    console.error("Error fetching cancellation fares:", error);
    return errorResponse(res, error.message || "Something went wrong");
  }
};
