import BasicFareSetting from "../models/basicFareSettingModel.js";
import BasicTax from "../models/basicTaxModel.js";
import MasterSacCode from "../models/MasterSacCodeModel.js";
import MasterWaiting from "../models/masterWaitingModel.js";
import TaxDetail from "../models/taxDetailModel.js";

export const getSacCodeDetails = async (req, res) => {
  try {
    const {
      status,
      auto_id,
      country_id,
      booking_type_id,
      charge_type
    } = req.query; // Using query parameters instead of req.body

    // Build where condition
    const whereCondition = {};

    if (country_id && country_id !== '') {
      whereCondition.country_id = country_id;
    }

    if (booking_type_id && booking_type_id !== '') {
      whereCondition.booking_type_id = booking_type_id;
    }

    if (charge_type && charge_type !== '') {
      whereCondition.charge_type = charge_type;
    }

    if (status && status !== '') {
      whereCondition.status = status;
    }

    if (auto_id && auto_id !== '') {
      whereCondition.id = auto_id;
    }

    // Execute query
    const result = await MasterSacCode.findAll({
      where: whereCondition,
      order: [['id', 'ASC']]
    });

    if (result.length > 0) {
      return res.status(200).json({
        status: 'success',
        data: result
      });
    } else {
      return res.status(404).json({
        status: 'failed',
        message: 'No record found'
      });
    }

  } catch (err) {
    console.error('Error in getSacCodeDetails:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};
// export const createBasicTax = async (req, res) => {
//   try {
//     const {
//       base_vehicle_id,
//       vendor_id = 0, // Default value if not provided
//       tax_type,
//       sac_code,
//       sgst,
//       cgst,
//       igst,
//       created_date = new Date(), // Default to current date if not provided
//       updated_date = new Date(), // Default to current date if not provided
//     } = req.body;

//     // Validate required fields
//     if (!base_vehicle_id) {
//       return res.status(400).json({
//         success: false,
//         message: 'base_vehicle_id is required'
//       });
//     }

//     // Create the BasicTax record
//     const newBasicTax = await BasicTax.create({
//       base_vehicle_id,
//       vendor_id,
//       tax_type,
//       sac_code,
//       sgst,
//       cgst,
//       igst,
//       created_date,
//       updated_date
//     });

//     // Return success response
//     return res.status(201).json({
//       success: true,
//       message: 'BasicTax record created successfully',
//       data: newBasicTax
//     });

//   } catch (error) {
//     console.error('Error creating BasicTax:', error);
    
//     // Handle Sequelize validation errors
//     if (error.name === 'SequelizeValidationError') {
//       const errors = error.errors.map(err => ({
//         field: err.path,
//         message: err.message
//       }));
      
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: errors
//       });
//     }

//     // Handle other errors
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
//     });
//   }
// };


export const createBasicTax = async (req, res) => {
  try {
    let {
      base_vehicle_id,
      vendor_id = 0,
      tax_type,
      sac_code,
      sgst,
      cgst,
      igst,
    } = req.body;

    base_vehicle_id = Number(base_vehicle_id);

    if (!base_vehicle_id) {
      return res.status(400).json({
        success: false,
        message: "base_vehicle_id is required",
      });
    }

    // 1. Check if record exists
    const existing = await BasicTax.findOne({
      where: { base_vehicle_id },
    });

    let record, created;

    if (existing) {
      // 2. Update if exists
      await existing.update({
        vendor_id,
        tax_type,
        sac_code,
        sgst,
        cgst,
        igst,
      });
      record = existing;
      created = false;
    } else {
      // 3. Create if not exists
      record = await BasicTax.create({
        base_vehicle_id,
        vendor_id,
        tax_type,
        sac_code,
        sgst,
        cgst,
        igst,
      });
      created = true;
    }

    return res.status(200).json({
      success: true,
      message: created
        ? "BasicTax record created successfully"
        : "BasicTax record updated successfully",
      data: record,
    });
  } catch (error) {
    console.error("Error upserting BasicTax:", error);

    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
};

// Combined create and edit API for TaxDetail
export const upsertTaxDetailData= async (req, res) => {
  try {
    const {
      id,
      master_booking_type_id=1,
      booking_type,
      sac_code,
      tax_type,
      charge_type,
      sgst,
      cgst,
      igst,
      from_date,
      to_date,
      modified_by,
      status,
      ip
    } = req.body;
console.log(req.user)
let created_by=req.user.id
let  user_id= req.user.id

    // Validate required fields
    if (!from_date || !to_date || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'from_date, to_date, and created_by are required fields'
      });
    }

    // Check date validity
    if (new Date(from_date) > new Date(to_date)) {
      return res.status(400).json({
        success: false,
        message: 'from_date cannot be after to_date'
      });
    }

    let taxDetail;
    const currentDate = new Date();

    if (id) {
      // Edit existing record
      taxDetail = await TaxDetail.findByPk(id);
      
      if (!taxDetail) {
        return res.status(404).json({
          success: false,
          message: 'Tax detail not found'
        });
      }

      // Update the record
      await taxDetail.update({
        user_id: user_id !== undefined ? user_id : taxDetail.user_id,
        master_booking_type_id: master_booking_type_id !== undefined ? master_booking_type_id : taxDetail.master_booking_type_id,
        booking_type: booking_type !== undefined ? booking_type : taxDetail.booking_type,
        sac_code: sac_code !== undefined ? sac_code : taxDetail.sac_code,
        tax_type: tax_type !== undefined ? tax_type : taxDetail.tax_type,
        charge_type: charge_type !== undefined ? charge_type : taxDetail.charge_type,
        sgst: sgst !== undefined ? sgst : taxDetail.sgst,
        cgst: cgst !== undefined ? cgst : taxDetail.cgst,
        igst: igst !== undefined ? igst : taxDetail.igst,
        from_date: from_date !== undefined ? from_date : taxDetail.from_date,
        to_date: to_date !== undefined ? to_date : taxDetail.to_date,
        modified_date: currentDate,
        modified_by: modified_by !== undefined ? modified_by : taxDetail.modified_by,
        status: status !== undefined ? status : taxDetail.status,
        ip: ip !== undefined ? ip : taxDetail.ip

      });

      return res.status(200).json({
        success: true,
        message: 'Tax detail updated successfully',
        data: taxDetail,
        id:req.user
      });
    } else {
      // Create new record
      taxDetail = await TaxDetail.create({
        user_id: user_id || 0,
        master_booking_type_id: master_booking_type_id || 1,
        booking_type: booking_type || 0,
        sac_code: sac_code || null,
        tax_type: tax_type || "%",
        charge_type: charge_type || 'BASIC',
        sgst: sgst || 0,
        cgst: cgst || 0,
        igst: igst || 0,
        from_date,
        to_date,
        created_date: currentDate,
        modified_date: currentDate,
        created_by,
        modified_by: modified_by || null,
        status: status !== undefined ? status : 1,
        ip: ip || null
      });

      return res.status(201).json({
        success: true,
        message: 'Tax detail created successfully',
        data: taxDetail
      });
    }
  } catch (error) {
    console.error('Error saving tax detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
export const getTaxDetailData = async()=>{
  try {
    
    const data = TaxDetail.findAll()
    return res.status(200).json({
      data,
      message:"Success"
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}
// export const changeTaxDetailStatus = async (req, res) => {
//   try {
//     const { id, status } = req.body;

//     if (!id || typeof status === 'undefined') {
//       return res.status(400).json({
//         success: false,
//         message: 'id and status are required'
//       });
//     }

//     const taxDetail = await TaxDetail.findByPk(id);

//     if (!taxDetail) {
//       return res.status(404).json({
//         success: false,
//         message: 'Tax detail not found'
//       });
//     }

//     await taxDetail.update({ status });

//     return res.status(200).json({
//       success: true,
//       message: 'Status updated successfully',
//       data: taxDetail
//     });
//   } catch (error) {
//     console.error('Error changing tax detail status:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

export const changeTaxDetailStatus = async (req, res) => {
  try {
    const { id } = req.body||{};

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'id is required'
      });
    }

    const taxDetail = await TaxDetail.findByPk(id);

    if (!taxDetail) {
      return res.status(404).json({
        success: false,
        message: 'Tax detail not found'
      });
    }

    // Toggle the status (1 becomes 0, 0 becomes 1)
    const newStatus = taxDetail.status === 1 ? 0 : 1;
    
    await taxDetail.update({ 
      status: newStatus,
      modified_date: new Date()
    });

    return res.status(200).json({
      success: true,
      message: `Status ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: taxDetail.id,
        previous_status: taxDetail.status,
        new_status: newStatus
      }
    });
  } catch (error) {
    console.error('Error toggling tax detail status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


export const upsertBasicFareSetting = async (req, res) => {
  try {
    const {
      base_vehicle_id,
      vendor_id = 0,
      rounding,
      level,
      direction,
      ip = "",
      status = "1",
    } = req.body;

    const created_by = req.user?.id;

    // ----------------- Validation -----------------
    if (!base_vehicle_id || !rounding || !level || !direction || !created_by) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: base_vehicle_id, rounding, level, direction, created_by, and ip are required",
      });
    }

    const validRounding = [1, 2];
    const validLevel = [1, 2, 3];
    const validDirection = [1, 2, 3];
    const validStatus = ["0", "1"];

    if (!validRounding.includes(rounding)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid rounding value. Must be 1 (Cash) or 2 (Account/Credit Card)",
      });
    }
    if (!validLevel.includes(level)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid level value. Must be 1 (Normal), 2 (Decimal), or 3 (Unit)",
      });
    }
    if (!validDirection.includes(direction)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid direction value. Must be 1 (Nearest), 2 (Upward), or 3 (Downward)",
      });
    }
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Must be '0' or '1'",
      });
    }

    // ----------------- Manual Upsert -----------------
    const whereCondition = { base_vehicle_id, vendor_id };
    const existingRecord = await BasicFareSetting.findOne({ where: whereCondition });
    const now = new Date();

    let record, created;

    if (existingRecord) {
      // Update existing
      await existingRecord.update({
        rounding,
        level,
        direction,
        status,
        ip,
        modified_by: created_by,
        modified_date: now,
      });
      record = existingRecord;
      created = false;
    } else {
      // Create new
      record = await BasicFareSetting.create({
        base_vehicle_id,
        vendor_id,
        rounding,
        level,
        direction,
        status,
        ip,
        created_by,
        created_date: now,
        modified_by: created_by,
        modified_date: now,
      });
      created = true;
    }

    // ----------------- Response -----------------
    res.status(200).json({
      success: true,
      message: created
        ? "Basic fare setting created successfully"
        : "Basic fare setting updated successfully",
      data: record,
    });
  } catch (error) {
    console.error("Error in upsertBasicFareSetting:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getBasicFareSettingsWithFilters = async (req, res) => {
  try {
    const { 
      base_vehicle_id, 
      id,
      vendorId, 
      rounding, 
      level, 
      direction, 
      status,
      page = 1, 
      limit = 10 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    if (base_vehicle_id) whereClause.base_vehicle_id = parseInt(base_vehicle_id);
    if (vendorId) whereClause.vendor_id = parseInt(vendorId);
    if (rounding) whereClause.rounding = parseInt(rounding);
    if (level) whereClause.level = parseInt(level);
    if (direction) whereClause.direction = parseInt(direction);
    if (status !== undefined) whereClause.status = status;
    if(id) whereClause.id = id
    const { count, rows: fareSettings } = await BasicFareSetting.findAndCountAll({
      where: Object.keys(whereClause).length > 0 ? whereClause : {},
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_date', 'DESC']]
    });
    
    if (!fareSettings || fareSettings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No basic fare settings found with the specified filters'
      });
    }

    res.status(200).json({
      success: true,
      data: fareSettings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      },
      filters: whereClause
    });
  } catch (error) {
    console.error('Error fetching filtered basic fare settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching basic fare settings',
      error: error.message
    });
  }
};
export const upsertMasterWaiting = async (req, res) => {
    try {
        const {
            id, // Only needed for update, not for create
            name,
            description,
            created_by,
            modified_by,
            status,
            ip
        } = req.body;

        // Validate required fields
        if (!name || !description || !created_by || !modified_by || !status || !ip) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, description, created_by, modified_by, status, ip) are required'
            });
        }

        // Validate status enum values
        if (!['0', '1'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either "0" or "1"'
            });
        }

        let result;
        let action;

        if (id) {
            // Update existing record
            const [affectedRows] = await MasterWaiting.update({
                name,
                description,
                modified_by,
                status,
                ip
            }, {
                where: { id },
                returning: true // For PostgreSQL, use plain: true for other dialects
            });

            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Record not found for update'
                });
            }

            // Fetch the updated record
            result = await MasterWaiting.findByPk(id);
            action = 'updated';
        } else {
            // Create new record
            result = await MasterWaiting.create({
                name,
                description,
                created_by,
                modified_by,
                status,
                ip
            });
            action = 'created';
        }

        res.status(200).json({
            success: true,
            message: `Record successfully ${action}`,
            data: result
        });

    } catch (error) {
        console.error('Upsert error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
export const upsertMasterPreWaiting = async (data) => {
    try {
        const {
            id,
            name,
            description,
            created_by,
            modified_by,
            status,
            ip
        } = data;

        let record;
        let created;

        if (id) {
            // Update existing record
            const [affectedRows] = await MasterPreWaiting.update({
                name,
                description,
                modified_by,
                status,
                ip
            }, {
                where: { id }
            });

            if (affectedRows === 0) {
                throw new Error('Record not found for update');
            }

            record = await MasterPreWaiting.findByPk(id);
            created = false;
        } else {
            // Create new record
            record = await MasterPreWaiting.create({
                name,
                description,
                created_by,
                modified_by,
                status,
                ip
            });
            created = true;
        }

        return {
            success: true,
            message: `Record successfully ${created ? 'created' : 'updated'}`,
            data: record,
            created: created
        };

    } catch (error) {
        console.error('Manual upsert error:', error);
        throw new Error(`Manual upsert failed: ${error.message}`);
    }
};
// Get basic taxes with query parameters (filtering)
export const getBasicTaxesWithFilters = async (req, res) => {
  try {
    const { base_vehicle_id, vendorId, taxType ,id} = req.query;
    
    const whereClause = {};
    
    if (base_vehicle_id) whereClause.base_vehicle_id = base_vehicle_id;
    if (vendorId) whereClause.vendor_id = vendorId;
    if (taxType) whereClause.tax_type = taxType;
    if(id) whereClause.id=id
    const basicTaxes = await BasicTax.findAll({
      where: Object.keys(whereClause).length > 0 ? whereClause : {}
    });
    
    if (!basicTaxes || basicTaxes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No basic taxes found with the specified filters'
      });
    }

    res.status(200).json({
      success: true,
      data: basicTaxes,
      count: basicTaxes.length,
      filters: whereClause
    });
  } catch (error) {
    console.error('Error fetching filtered basic taxes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching basic taxes',
      error: error.message
    });
  }
};
