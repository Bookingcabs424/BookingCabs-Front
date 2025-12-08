import { Op } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import PostalCodeFare from "../models/postalCodeFareModel.js";

export const bulkUpsertPostalCodeFares = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { fares } = req.body;

        if (!Array.isArray(fares)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Input must be an array of fares'
            });
        }

        const results = [];
        const now = new Date();

        // Validate each fare in the array
        for (let i = 0; i < fares.length; i++) {
            const fare = fares[i];
            const { base_vehicle_id, pickup_postcode, drop_postcode, price } = fare;

            if (!base_vehicle_id || !pickup_postcode || !drop_postcode || !price) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Fare at index ${i} is missing required fields: base_vehicle_id, pickup_postcode, drop_postcode, or price`
                });
            }
        }

        // Process each fare sequentially within transaction
        for (const fare of fares) {
            const {
                id,
                base_vehicle_id,
                pickup_postcode,
                drop_postcode,
                price,
                created_by = req.user?.id || 0,
                modified_by = req.user?.id || 0,
                status = '1',
                ip = req.ip || "127.0.0.1"
            } = fare;

            let result;

            if (id) {
                // Try to find existing record
                const existing = await PostalCodeFare.findByPk(id, { transaction });
                
                if (existing) {
                    result = await existing.update({
                        base_vehicle_id,
                        pickup_postcode,
                        drop_postcode,
                        price,
                        modified_by,
                        modified_date: now,
                        status,
                        ip
                    }, { transaction });
                } else {
                    result = await PostalCodeFare.create({
                        id,
                        base_vehicle_id,
                        pickup_postcode,
                        drop_postcode,
                        price,
                        created_by,
                        created_date: now,
                        modified_by,
                        modified_date: now,
                        status,
                        ip
                    }, { transaction });
                }
            } else {
                result = await PostalCodeFare.create({
                    base_vehicle_id,
                    pickup_postcode,
                    drop_postcode,
                    price,
                    created_by,
                    created_date: now,
                    modified_by,
                    modified_date: now,
                    status,
                    ip
                }, { transaction });
            }

            results.push(result);
        }

        await transaction.commit();

        res.json({
            success: true,
            message: `All ${fares.length} postal code fares processed successfully`,
            data: results,
            summary: {
                total: fares.length,
                created: results.filter(r => !fares.find(f => f.id === r.id)).length,
                updated: results.filter(r => fares.find(f => f.id === r.id)).length
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error in bulkUpsertPostalCodeFares:', error);
        
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));
            
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: validationErrors
            });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Duplicate entry or unique constraint violation'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};




export const getPostalCodeFares = async (req, res) => {
  try {
    const { 
      id, 
      base_vehicle_id, 
      pickup_postcode, 
      drop_postcode, 
      status 
    } = req.query;

    // Build filters dynamically
    const where = {};
    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (pickup_postcode) where.pickup_postcode = pickup_postcode
    if (drop_postcode) where.drop_postcode = drop_postcode
    if (status) where.status = status;

    const fares = await PostalCodeFare.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Postal code fares retrieved successfully",
      data: fares,
    });
  } catch (error) {
    console.error("Error fetching postal code fares:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch postal code fares",
      error: error.message,
    });
  }
};
