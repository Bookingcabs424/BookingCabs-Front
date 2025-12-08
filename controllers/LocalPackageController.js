
// Assuming you have a Sequelize model named LocalPackage

import { Op } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import LocalPackage from "../models/localPackageModel.js";
import { errorResponse } from "../utils/response.js";
import LocalPackageFare from "../models/LocalPackageFareModel.js";
import DistanceHourFare from "../models/distanceHourFareModel.js";


// Express route handler
// export const getLocalPackages = async (req, res) => {
//     try {
//         let { booking_type, booking_mode } = req.query;
//         if(!booking_type && !booking_mode) {
//             return errorResponse(res, 400, 'Booking type or mode is required');
//         }
//         const where = { status: 1 };

//         if (booking_type) {
//             where.booking_type = booking_type;
//         }
//         if (booking_mode) {
//             where.booking_mode = booking_mode;
//         }

//         const packages = await LocalPackage.findAll({
//             where,
//             order: [['display_order', 'ASC']]
//         });

//         if (packages.length > 0) {
//             res.json({ status: 'success', data: packages });
//         } else {
//             res.json({ status: 'failed', error: 'No Record Found' });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ status: 'failed', error: 'Server Error' });
//     }
// };

export const getLocalPackages = async (req, res) => {
  try {
    const { city_id, package_id, package_mode } = req.query; // or req.query

    let sql = `
      SELECT DISTINCT(lp.id) as local_pkg_id,
             lp.name,
             lp.hrs,
             lp.km,
             mpm.id AS package_mode_id,
             mpm.package_mode,
             lpf.base_vehicle_id,
             lpf.local_pkg_fare_id AS local_package_id,
             lpf.local_pkg_fare AS price
      FROM base_combination AS bc
      LEFT JOIN base_vehicle_type AS bvt ON bc.id = bvt.base_comb_id
      LEFT JOIN master_package_mode AS mpm ON bc.master_package_mode_id = mpm.id
      LEFT JOIN local_package_fare AS lpf ON bvt.base_vehicle_id = lpf.base_vehicle_id
      JOIN local_package AS lp ON lp.id = lpf.local_pkg_id
      WHERE 1 = 1
        AND lpf.local_pkg_fare != ''
    `;

    if (city_id) {
      sql += ` AND bc.city_id = '${city_id}'`;
    }

    if (package_id) {
      sql += ` AND bc.master_package_id = '${package_id}'`;
    }

    if (package_mode) {
      sql += ` AND bc.master_package_mode_id IN (${package_mode})`;
    }

    sql += ` AND lp.status = 1 GROUP BY lp.id ORDER BY lp.display_order ASC`;

    // Run query
    const [results] = await sequelize.query(sql);

    if (results.length > 0) {
      return res.json({
        status: 'success',
        data: results,
      });
    } else {
      return res.json({
        status: 'failed',
        error: 'No Record Found',
      });
    }
  } catch (err) {
    console.error('Error in localPackageData:', err);
    return res.status(500).json({
      status: 'failed',
      error: 'Internal Server Error',
    });
  }
};

export const getLocalPackagesmaster = async (req, res) => {
  try {
    const { id } = req.query;
console.log({id})
    let sql = `
      SELECT lp.id as local_package_id,
             lp.booking_type as package_type,
             lp.booking_mode as package_type_mode,
             mpm.package_mode as booking_mode,
             mp.name as booking_type,
             lp.name as package_name,
             lp.hrs,
             lp.km,
             lp.status
      FROM local_package as lp
      JOIN master_package_mode as mpm ON lp.booking_mode = mpm.id
      JOIN master_package as mp ON lp.booking_type = mp.id
      WHERE lp.status != 2
    `;

    if (id) {
      sql += ` AND lp.id = :id `;
    }

    sql += " ORDER BY lp.id DESC";

    const results = await sequelize.query(sql, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    return res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLocalPackageStatus = async (req, res) => {
  try {
    const { id, package_status } = req.body;
let user_id= req.user.id; // Assuming user_id is taken from the authenticated user
    if (!id || !user_id || package_status === undefined) {
      return res.status(400).json({
        success: false,
        message: "id, user_id and package_status are required",
      });
    }

    // Update multiple ids (comma separated or array)
    const ids = Array.isArray(id) ? id : id.toString().split(",");

    const [updated] = await LocalPackage.update(
      {
        status: package_status,
        modified_by: user_id,
      },
      {
        where: { id: ids },
      }
    );

    if (updated === 0) {
      return res.json({ success: false, message: "No records updated" });
    }

    return res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const editPackage = async (req, res) => {
  try {
    // Get `where` filter from query string
 const where = { id:req.body.id };
    //  if (req.query.where) {
    //   where = JSON.parse(req.query.where);
    // }

    // Get new data from body
    const data = req.body;

    // Check if record exists
    const existing = await LocalPackage.findByPk(data?.id);
    console.log({ existing, data, where });
    let result;
    if (existing) {
      // Remove id from update data to prevent primary key modification
      const { id, ...updateData } = data;
      
      // Update existing record
      await LocalPackage.update(updateData, { where });
      result = await LocalPackage.findOne({ where });
    } else {
      // Insert new record
      // result = await LocalPackage.create(data);
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const getLocalPackageFares = async (req, res) => {
  try {
    const {
      local_pkg_fare_id,
      base_vehicle_id,
      local_pkg_id,
      status,
      created_by,
      start_date, // optional filter (YYYY-MM-DD)
      end_date,   // optional filter (YYYY-MM-DD)
      search,     // optional search on local_pkg_fare
    } = req.query;

    // build where condition dynamically
    const where = {};

    if (local_pkg_fare_id) where.local_pkg_fare_id = local_pkg_fare_id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (local_pkg_id) where.local_pkg_id = local_pkg_id;
    if (status) where.status = status;
    if (created_by) where.created_by = created_by;

    if (start_date && end_date) {
      where.created_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    } else if (start_date) {
      where.created_date = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.created_date = { [Op.lte]: new Date(end_date) };
    }

    if (search) {
      where.local_pkg_fare = { [Op.like]: `%${search}%` };
    }

    const fares = await LocalPackageFare.findAll({ where });

    res.status(200).json(fares);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fares", error: error.message });
  }
};
export const upsertLocalPackageFare = async (req, res) => {
  try {
    let { base_vehicle_id, local_pkg_id, local_pkg_fare, created_by } = req.body;
created_by= req.user.id
    // Validate required fields
    if (!base_vehicle_id || !local_pkg_id || !local_pkg_fare || !created_by) {
      return res.status(400).json({
        success: false,
        message: "All fields (base_vehicle_id, local_pkg_id, local_pkg_fare, created_by) are required"
      });
    }

    // Use upsert to either create or update
    const [result, created] = await LocalPackageFare.upsert({
      base_vehicle_id,
      local_pkg_id,
      local_pkg_fare,
      created_by,
      created_date: new Date(),
      status: 1
    }, {
      conflictFields: ['base_vehicle_id', 'local_pkg_id'] // Specify unique constraint fields
    });

    const action = created ? "created" : "updated";

    res.status(200).json({
      success: true,
      message: `Local package fare ${action} successfully`,
      data: result
    });

  } catch (error) {
    console.error("Error in upsertLocalPackageFare:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
export const upsertDistanceHourFare = async (req, res) => {
  try {
    const fareData = {
      ...req.body,
      created_date: new Date(),
      modified_date: new Date()
    };

    // Use upsert with conflict handling on the unique fields
    const [record, created] = await DistanceHourFare.upsert(fareData, {
      conflictFields: ['minimum_charge', 'minimum_distance', 'minimum_hrs',"base_vehicle_id"], // Specify unique constraint fields
      returning: true
    });

    const action = created ? "created" : "updated";

    res.status(200).json({
      success: true,
      message: `Distance hour fare ${action} successfully`,
      data: record
    });

  } catch (error) {
    console.error("Error in upsertDistanceHourFareWithConstraint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const upsertLocalPackageFareArr = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    let { packageFares } = req.body;
    const created_by = req.user.id;

    // Validate required fields
    if (!packageFares || !Array.isArray(packageFares) || packageFares.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "packageFares array is required and must not be empty"
      });
    }

    const results = [];
    const createdCount = { created: 0, updated: 0 };

    // Process each package fare in the array
    for (const fare of packageFares) {
      const { base_vehicle_id, local_pkg_id, local_pkg_fare } = fare;

      // Validate required fields for each item
      if (!base_vehicle_id || !local_pkg_id || local_pkg_fare === undefined || local_pkg_fare === null) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "All fields (base_vehicle_id, local_pkg_id, local_pkg_fare) are required for each package fare"
        });
      }

      // Check if a record with this vehicle_id and package_id already exists
      const existingRecord = await LocalPackageFare.findOne({
        where: {
          base_vehicle_id,
          local_pkg_id
        },
        transaction
      });

      if (existingRecord) {
        console.log({local_pkg_fare})
        // Update the existing record with the new fare amount
        await LocalPackageFare.update({
          local_pkg_fare,
          // updated_by: created_by,
          // updated_date: new Date()
        }, {
          where: {
            base_vehicle_id,
            local_pkg_id
          },
          transaction
        });

        // Fetch the updated record
        const updatedRecord = await LocalPackageFare.findOne({
          where: {
            base_vehicle_id,
            local_pkg_id
          },
          transaction
        });

        results.push({
          result: updatedRecord,
          action: "updated"
        });

        createdCount.updated++;
      } else {
        // Create a new record
        const newRecord = await LocalPackageFare.create({
          base_vehicle_id,
          local_pkg_id,
          local_pkg_fare,
          created_by,
          created_date: new Date(),
          status: 1
        }, { transaction });

        results.push({
          result: newRecord,
          action: "created"
        });

        createdCount.created++;
      }
    }

    // Commit the transaction if all operations succeeded
    await transaction.commit();

  return  res.status(200).json({
      success: true,
      message: `Bulk upsert completed: ${createdCount.created} created, ${createdCount.updated} updated`,
      data: results,
      summary: createdCount
    });

  } catch (error) {
    console.log({error})
    // Rollback transaction on error
    await transaction.rollback();
    
    console.error("Error in upsertLocalPackageFare:", error);
  return  res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};