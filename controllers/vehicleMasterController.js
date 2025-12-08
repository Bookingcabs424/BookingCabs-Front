import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS_CODE } from "../constants/const.js";
import VehicleMaster from "../models/vehicleMasterModel.js";
import MasterVehicleModal from "../models/masterVehicleModel.js";
import sequelize from "../config/clientDbManager.js";
import MasterVehicleType from "../models/masterVehicleTypeModel.js";
import MasterAmenities from "../models/masterAmenitiesModel.js";
import UserVehicleMapping from "../models/userVehicleMappingModel.js";
import VehicleAmenities from "../models/vehicleAmenitiesModel.js";
import User from "../models/userModel.js";
import HelicopterShift from "../models/HelicopterShiftModel.js";
import { QueryTypes } from "sequelize";
import path from "path";

export const getVehicleDetail = async (req, res) => {
  const { id } = req.user;

  try {
    const vehicleData = await VehicleMaster.findOne({
      where: { id },
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { vehicleData });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};
// export const getAllVehicleDetails = async (req, res) => {
//   try {
//     console.log("Fetching all vehicle details");
//     const { vehicle_master_id } = req.query; // take from query params
//     const where = {};

//     if (vehicle_master_id) {
//       where.id = vehicle_master_id;
//     }

//     const vehicleData = await VehicleMaster.findAll({ where });
// console.log(vehicleData, "vehicleData")
//     return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, vehicleData );
//   } catch (error) {
//     console.log({ error }, "Error in getAllVehicleDetails");
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error.message,
//       STATUS_CODE.NOT_FOUND
//     );
//   }
// };

export const getAllVehicleDetails = async (req, res) => {
  try {
    console.log("Fetching all vehicle details");

    const { vehicle_master_id, city_id } = req.query;

    let replacements = {};
    let condition = "";

    if (vehicle_master_id) {
      condition = "WHERE vm.id = :vehicle_master_id";
      replacements.vehicle_master_id = vehicle_master_id;
    }
    if (city_id) {
      condition = condition
        ? condition + " AND user.city = :city"
        : " WHERE user.city = :city";
      replacements.city = city_id;
    }

    const sql = `
      SELECT 
        vm.id AS vehicle_master_id,
        vm.vehicle_no,
        vm.status AS vehicle_status,
        uvm.user_vehicle_id,
        uvm.user_id,
        uvm.status AS mapping_status,
        uvm.created_date,
        uvm.modified_date,
        uvm.created_by,
        uvm.modified_by,
        user.city
      FROM vehicle_master vm
      LEFT JOIN user_vehicle_mapping uvm 
      ON vm.id = uvm.vehicle_master_id
      LEFT JOIN user on uvm.user_id = user.id
      ${condition}
      ORDER BY vm.id DESC
    `;

    const vehicleData = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements,
    });

    console.log(vehicleData, "vehicleData");

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, vehicleData);
  } catch (error) {
    console.log({ error }, "Error in getAllVehicleDetails");
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const addVehicleDetail = async (req, res) => {
  const data = req.body;
  const { id } = req.user;
  const modified_by = id;

  try {
    const createdVehicle = await VehicleMaster.create({
      ...data,
      id,
      modified_by,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_ADDED, {
      createdVehicle,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updateVehicleDetail = async (req, res) => {
  const updateData = req.body;
  const { id } = req.user;
  const vehicle_master_id = req.params.id;

  try {
    const existing = await VehicleMaster.findOne({
      where: {
        vehicle_master_id,
        id,
        status: true,
      },
    });

    if (!existing) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    await existing.update(updateData);
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const softDeleteVehicleDetail = async (req, res) => {
  const { id } = req.user;
  const vehicle_master_id = req.params.id;

  try {
    const vehicle = await VehicleMaster.findOne({
      where: {
        vehicle_master_id,
        id,
        status: true,
      },
    });

    if (!vehicle) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    await vehicle.update({ isDeleted: true });

    return successResponse(res, MESSAGES.GENERAL.DATA_DELETED);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const getAllVehicleModels = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  const vehicle_type_id = isInternalCall ? req : req.params.id;

  let sql = `
    SELECT GROUP_CONCAT(DISTINCT(name) SEPARATOR ', ') AS vehicle_model 
    FROM master_vehicle_model 
    WHERE 1 = 1
  `;

  if (vehicle_type_id !== undefined && vehicle_type_id !== "") {
    sql += ` AND vehicle_type_id = :vehicle_type_id`;
  }

  try {
    const [results] = await sequelize.query(sql, {
      replacements: { vehicle_type_id },
      type: sequelize.QueryTypes.SELECT,
    });
    if (isInternalCall) {
      return results;
    }
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (error) {
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        error.message,
        STATUS_CODE.BAD_REQUEST
      );
    }
  }
};

export const getVehicleTypeList = async (req, res) => {
  try {
    const sql = `Select mv.vehicle_type,concat(u.first_name, ' ', u.last_name ) as created_name
    ,mv.status,mv.display_order,mv.amenities,mv.vehicle_image,mv.id,mvm.name,u.email, u.mobile from master_vehicle_type mv
               left outer join user as u ON u.id = mv.created_by
           left outer join master_vehicle_model as mvm ON mv.category_id = mvm.id    
               where mv.status <>2 order by display_order`;

    const vehicleModelType = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      vehicleModelType,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const updateVehicleType = async (req, res) => {
  try {
    const { id, status } = req.body;
    const userId = req?.user?.id ?? 1;
    const ids = Array.isArray(id)
      ? id
      : id
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

    const updatedCount = await MasterVehicleType.update(
      { status: String(status), modified_by: userId },
      { where: { id: ids }, logging: console.log }
    );
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updatedCount,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const addVehicleType = async (req, res) => {
  try {
    const { category_id, status, vehicle_type } = req.body;
    const userId = req?.user?.id ?? 1;

    const vehicle_image = req.uploadedFilePath || req.file.path;
    const createData = await MasterVehicleType.create({
      created_by: userId,
      category_id,
      status,
      vehicle_image,
      created_date: new Date(),
      type: 0,
      vehicle_type,
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      createData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const getVehicleNameList = async (req, res) => {
  try {
    const sql = `Select concat(u.first_name, ' ', u.last_name ) as created_name,
    mvm.id,
    mvm.aircondition,
    mvm.created_by,
    mvm.created_date,
    mvm.image,
    mvm.left_image,
    mvm.right_image,
    mvm.front_image,
    mvm.back_image,
    mvm.interior_image,
    mvm.luggage_capacity,
    mvm.modified_by,
    mvm.modified_date,
    mvm.name,
    mvm.person_capacity,
    mvm.small_suitcase,
    mvm.status,
    mvm.vehicle_type_id,
    mvm.vehicle_type_name,
    mvm.no_of_doors,
    mvm.no_of_airbags,
    u.email,
    u.mobile 
    from master_vehicle_model mvm
    left outer join user as u ON u.id = mvm.created_by
    where mvm.status <> 2;`;

    const vehicleNameData = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      vehicleNameData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const updateVehicleName = async (req, res) => {
  try {
    const { id, status } = req.body;
    const userId = req?.user?.id ?? 1;
    const ids = Array.isArray(id)
      ? id
      : id
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

    const updatedCount = await MasterVehicleModal.update(
      { status: String(status), modified_by: userId },
      { where: { id: ids }, logging: console.log }
    );
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updatedCount,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const addVehicleName = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    let {
      category_id,
      status,
      vehicle_type_name,
      vehicle_type_id,
      name,
      no_of_doors,
      no_of_airbags,
      person_capacity,
      luggage_capacity,
      small_suitcase,
      amenities,
      amenities_id,
      vehicle_name,
    } = req.body;
    console.log({ isInternalCall }, "is Internal Call");
    const userId = req?.user?.id ?? 1;
    if (
      !person_capacity ||
      !luggage_capacity ||
      !small_suitcase ||
      !amenities
    ) {
      console.log("uoooooooooooooooooooo");
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        {},
        STATUS_CODE.BAD_REQUEST
      );
    }
    const image = req.uploadedFilePath || req?.file?.path;
    if (isInternalCall) {
      name = vehicle_name;
    }
    let left_image = req?.files?.left ? req.files.left[0].path : null;
    left_image = path.join(
      "uploads",
      name || "documents",
      req.files.left[0].filename
    );
    let right_image = req?.files?.right ? req.files.right[0].path : null;
    right_image = path.join(
      "uploads",
      name || "documents",
      req.files.right[0].filename
    );
    let front_image = req?.files?.front ? req.files.front[0].path : null;
    front_image = path.join(
      "uploads",
      name || "documents",
      req.files.front[0].filename
    );
    let back_image = req?.files?.back ? req.files.back[0].path : null;
    back_image = path.join(
      "uploads",
      name || "documents",
      req.files.back[0].filename
    );
    let interior_image = req?.files?.interior
      ? req.files.interior[0].path
      : null;
    interior_image = path.join(
      "uploads",
      name || "documents",
      req.files.interior[0].filename
    );

    const createData = await MasterVehicleModal.create({
      vehicle_type_id: category_id,
      vehicle_type_name,
      name,
      aircondtion: "AC",
      person_capacity,
      luggage_capacity,
      small_suitcase,
      no_of_doors,
      no_of_airbags,
      image,
      status,
      created_by: userId,
      created_date: new Date().toISOString(),
      amenties: amenities.toString(),
      amenities_id,
      status: 1,
      vehicle_type_id,
      left_image,
      right_image,
      front_image,
      back_image,
      interior_image,
    });
    console.log({ createData });
    if (isInternalCall) {
      return createData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
        createData,
      });
    }
  } catch (error) {
    console.log({ error });
    if (isInternalCall) {
      throw error; // Just throw the error, don't try to send response
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        error.message,
        STATUS_CODE.BAD_REQUEST
      );
    }
  }
};

export const updateVehicleNameData = async (req, res) => {
  try {
    const {
      category_id,
      status,
      vehicle_type_name,
      name,
      person_capacity,
      luggage_capacity,
      no_of_doors,
      no_of_airbags,
      small_suitcase,
      amenities,
      amenities_id,
      id,
    } = req.body;

    let left_image = req?.files?.left ? req.files.left[0].path : null;
    left_image = path.join(
      "uploads",
      name || "documents",
      req.files.left[0].filename
    );
    let right_image = req?.files?.right ? req.files.right[0].path : null;
    right_image = path.join(
      "uploads",
      name || "documents",
      req.files.right[0].filename
    );
    let front_image = req?.files?.front ? req.files.front[0].path : null;
    front_image = path.join(
      "uploads",
      name || "documents",
      req.files.front[0].filename
    );
    let back_image = req?.files?.back ? req.files.back[0].path : null;
    back_image = path.join(
      "uploads",
      name || "documents",
      req.files.back[0].filename
    );
    let interior_image = req?.files?.interior
      ? req.files.interior[0].path
      : null;
    interior_image = path.join(
      "uploads",
      name || "documents",
      req.files.interior[0].filename
    );

    const userId = req?.user?.id ?? 1;
    const image = req?.uploadedFilePath || req?.file?.path;

    // Build update payload dynamically
    const updatePayload = {
      vehicle_type_id: category_id,
      vehicle_type_name,
      name,
      aircondtion: "AC",
      person_capacity,
      luggage_capacity,
      small_suitcase,
      status,
      modified_by: userId,
      modified_date: new Date().toISOString(),
      amenties: amenities,
      amenities_id,
      no_of_doors,
      no_of_airbags,
      left_image,
      right_image,
      front_image,
      back_image,
      interior_image,
    };

    if (image) {
      updatePayload.image = image;
    }

    const createData = await MasterVehicleModal.update(
      { ...updatePayload },
      { where: { id: id } }
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      createData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const getVehicleAmenities = async (req, res) => {
  try {
    const sql = `Select concat(u.first_name, ' ', u.last_name ) as created_name,
    mvm.id,
    mvm.amenities_name,
    mvm.created_by,
    mvm.created_date,
    mvm.display_order,
    mvm.status
    from master_amenities mvm
    left outer join user as u ON u.id = mvm.created_by
    where mvm.status <> 2;`;

    const amenitiesData = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      amenitiesData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const updateAmenitiesStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const userId = req?.user?.id ?? 1;
    const ids = Array.isArray(id)
      ? id
      : id
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

    const updatedCount = await MasterAmenities.update(
      { status: String(status), modified_by: userId },
      { where: { id: ids }, logging: console.log }
    );
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updatedCount,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const addAmenities = async (req, res) => {
  try {
    const { amenities_name, status, display_order } = req.body;
    const userId = req?.user?.id ?? 1;
    if (!amenities_name || !status || !display_order) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        {},
        STATUS_CODE.BAD_REQUEST
      );
    }
    const createData = await MasterAmenities.create({
      amenities_name,
      display_order,
      status,
      created_date: new Date(),
      modified_date: new Date(),
      created_by: userId,
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      createData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const updateAmenitiesData = async (req, res) => {
  try {
    const { id, status, display_order, amenities_name } = req.body;
    const userId = req?.user?.id ?? 1;

    const updatedCount = await MasterAmenities.update(
      {
        status: String(status),
        display_order,
        amenities_name,
        modified_by: userId,
      },
      { where: { id: id }, logging: console.log }
    );
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updatedCount,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};
export const getAllVehicleTypeBySeatingCapacity = async (req, res) => {
  const { seating_capacity, vehicle_type } = req.query;

  let sql = "SELECT * FROM master_vehicle_type WHERE 1=1";

  const replacements = {};

  if (seating_capacity !== undefined && seating_capacity !== "") {
    sql += " AND seating_capacity >= :seating_capacity";
    replacements.seating_capacity = seating_capacity;
  }

  // Uncomment and adjust if vehicle_type filter is needed
  // if (vehicle_type !== undefined && vehicle_type !== '') {
  //   sql += ' AND vehicle_type LIKE :vehicle_type';
  //   replacements.vehicle_type = `%${vehicle_type}%`;
  // }

  try {
    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return successResponse(res, MESSAGES.GENERAL.NOT_FOUND, { data: [] });
    }
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const addUserVehicleDetails = async (req, res) => {
  try {
    console.log("start");
    const { vehicle_name_id } = req.body;
    const userId = req?.user?.id ?? 1;
    let vehicle_exist_id;
    if (!vehicle_name_id) {
      console.log("object");
      const vehicleModal = await addVehicleName(req, res, true);
      vehicle_exist_id = vehicleModal.id;
    }
    req.body.vehicle_exist_id = vehicle_exist_id || vehicle_name_id;
    const addUserVehicle = await addVehicleMaster(req, res, true);
    req.body.vehicle_master_id = addUserVehicle.vehicle_master_id;
    await addVehicleAmenities(req, res, true);
    const insertedData = UserVehicleMapping.create({
      user_id: userId,
      vehicle_master_id: addUserVehicle.vehicle_master_id,
      created_by: userId,
      created_date: new Date(),
    });
    const userData = await User.findOne({ where: { id: userId } });
    userData.signup_status = 5;
    await userData.save();
    return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
      insertedData,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      err.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const addVehicleMaster = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    const {
      color,
      fitness_validity,
      ignition_type_id,
      image,
      insurance_validity,
      passenger,
      permit_exp_date,
      rc_no,
      small_suitcase,
      status,
      vehicle_owner_mobile,
      vehicle_owner_name,
      vehicle_owner_type,
      vehicle_exist_id,
      owner_name,
      reg_date,
      chassis_no,
      engine_no,
      insurance_name,
      policy_number,
      policy_issue,
      premium_amount,
      cover_amount,
      rto_address,
      rto_tax_efficiency,
      rto_expiry,
      fitness_number,
      auth_number,
      auth_expiry,
      speed_governor_detail,
      speed_governor_expiry,
      puc_number,
      puc_expiry,
      permit_type,
      permit_expiry,
      vehicle_code,
      vehicle_reg_no,
      carrier,
      model_year,
      ac,
      big_suitcase,
      permit_expiry_date,
    } = req.body;

    const userId = req?.user?.id ?? 1;
    const vnumber = `${vehicle_code}-${vehicle_reg_no}`;
    const safeDate = (value, fallback = null) => {
      if (!value || typeof value !== "string" || value.trim() === "") {
        return fallback;
      }

      const date = new Date(value);
      return isNaN(date.getTime()) ? fallback : date;
    };
    const insertedData = await VehicleMaster.create({
      created_by: userId,
      created_date: new Date(),
      color,
      fitness_expiry: fitness_validity,
      ignition_type_id,
      image,
      insurance_validity: safeDate(insurance_validity, new Date()),
      large_suitcase: big_suitcase,
      luggage_carrier: carrier,
      model: model_year,
      passenger,
      permit_exp_date,
      rc_no,
      small_suitcase,
      status,
      vehicle_ac_nonac: ac,
      vehicle_no: vnumber,
      vehicle_owner_mobile,
      vehicle_owner_name,
      vehicle_owner_type,
      id: vehicle_exist_id,
      owner_name,
      reg_date: safeDate(reg_date, new Date()),
      chassis_no,
      engine_no,
      insurance_name,
      policy_number,
      policy_issue,
      premium_amount,
      cover_amount,
      rto_address,
      rto_tax_efficiency,
      rto_expiry: safeDate(rto_expiry, new Date()),
      fitness_number,
      auth_number,
      auth_expiry: safeDate(auth_expiry, new Date()),
      speed_governor_detail,
      speed_governor_expiry: safeDate(speed_governor_expiry, new Date()),
      puc_number,
      puc_expiry: safeDate(puc_expiry, new Date()),
      permit_type,
      permit_expiry: safeDate(permit_expiry_date, new Date()),
      permit_exp_date: safeDate(permit_expiry_date, new Date()),
    });
    if (isInternalCall) {
      return insertedData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
        insertedData,
      });
    }
  } catch (err) {
    console.log({ err }, "ersssssssss");
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      err.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const addVehicleAmenities = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    const { vehicle_master_id, amenties_id: amenities_id = 11 } = req.body;
    let amenitiesArray = [];

    if (Array.isArray(amenities_id)) {
      amenitiesArray = amenities_id;
    } else if (typeof amenities_id === "string") {
      amenitiesArray = amenities_id.split(",").map((id) => id.trim());
    } else if (amenities_id) {
      amenitiesArray = [amenities_id];
    }

    if (!vehicle_master_id || amenitiesArray.length === 0) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.BAD_REQUEST,
        "Vehicle ID and amenities are required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const created_date = new Date();

    const insertData = amenitiesArray.map((amenityId) => ({
      vehicle_master_id,
      amenities_id: amenityId,
      created_date,
    }));

    const insertedData = await VehicleAmenities.bulkCreate(insertData);

    if (isInternalCall) return insertedData;

    return successResponse(res, MESSAGES.GENERAL.DATA_INSERTED, {
      insertedData,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      err.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const getVehicleColorCombo = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    const sql = `Select colour_id,colour_name from master_colour`;
    const results = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });
    if (isInternalCall) {
      return results;
    }
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      err.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const getUserVehicleList = async (req, res) => {
  const user_id = req?.user?.id ?? 1;
  const user_type_id = req?.user?.role;
  const userData = await User.findByPk(user_id);
  const company_id = userData.company_id;

  try {
    const { vehicle_master_id, vehicle_no } = req.query;

    let whereClause =
      user_type_id === 10
        ? "WHERE vm.status <> 2"
        : "WHERE uvm.user_id = :user_id AND vm.status <> 2 ";

    const replacements = user_type_id === 10 ? {} : { user_id, company_id };

    if (vehicle_master_id) {
      whereClause += " AND vm.id = :vehicle_master_id";
      replacements.vehicle_master_id = vehicle_master_id;
    }

    if (vehicle_no) {
      whereClause += " AND vm.vehicle_no LIKE :vehicle_no";
      replacements.vehicle_no = `%${vehicle_no}%`;
    }

    const sql = `
SELECT 
    uvm.user_vehicle_id,
    uvm.vehicle_master_id,
    vm.model,
    uvm.user_id,
    uvm.status AS map_status,
    vm.vehicle_no,
    vm.vehicle_master_id as vm_id,
    vm.color,
    vm.ignition_type_id,
    vm.passenger,
    vm.small_suitcase,
    vm.large_suitcase,
    vm.permit_expiry,
    vm.insurance_validity,
    vm.fitness_validity,
    vm.owner_name,
    vm.vehicle_ac_nonac,
    vm.vehicle_owner_type,
    vm.reg_date,
    vm.chassis_no,
    vm.engine_no,
    vm.insurance_name,
    vm.policy_number,
    vm.policy_issue,
    vm.policy_expiry,
    vm.premium_amount,
    vm.cover_amount,
    vm.rto_address,
    vm.rto_tax_efficiency,
    vm.rto_expiry,
    vm.fitness_number,
    vm.auth_number,
    vm.auth_expiry,
    vm.speed_governor_detail,
    vm.speed_governor_expiry,
    vm.puc_number,
    vm.puc_expiry,
    vm.permit_type,
    vm.luggage_carrier,
    u.email AS vendor_email,
    u.mobile AS vendor_mobile,
    GROUP_CONCAT(DISTINCT CONCAT_WS(' ', u.first_name, u.last_name)) AS vendor_name,
    GROUP_CONCAT(DISTINCT va.amenities_id) AS amenities_id,
    GROUP_CONCAT(DISTINCT ma.amenities_name) AS amenities_name,
    mc.name AS city_name,
    mvm.vehicle_type_name,
    mvm.name AS vehicle_name,
    mca.colour_name,
    mft.fuel_type,
    GROUP_CONCAT(DISTINCT CONCAT_WS(' ', ua.first_name, ua.last_name)) AS driver_name,
    GROUP_CONCAT(DISTINCT ua.email) AS driver_email,
    GROUP_CONCAT(DISTINCT ua.mobile) AS driver_mobile
FROM user_vehicle_mapping uvm 
LEFT JOIN vehicle_master vm ON uvm.vehicle_master_id = vm.vehicle_master_id
LEFT JOIN user u ON uvm.created_by = u.id
LEFT JOIN vehicle_amenities va ON vm.vehicle_master_id = va.vehicle_master_id
LEFT JOIN master_amenities ma ON va.amenities_id = ma.id
LEFT JOIN master_city mc ON u.city = mc.id
LEFT JOIN master_vehicle_model mvm ON vm.id = mvm.id
LEFT JOIN master_colour mca ON vm.color = mca.colour_id
LEFT JOIN master_fuel_type mft ON vm.ignition_type_id = mft.id
LEFT JOIN user ua ON uvm.user_id = ua.id
 ${whereClause}
 GROUP BY uvm.user_vehicle_id
`;
    const results = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      err.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const updateUserVehicleStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const userId = req?.user?.id ?? 1;
    const ids = Array.isArray(id)
      ? id
      : id
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

    const updatedCount = await VehicleMaster.update(
      { status: String(status), modified_by: userId },
      { where: { vehicle_master_id: ids } }
    );
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updatedCount,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const mapUserVehicle = async (req, res) => {
  try {
    const { user_id, user_vehicle_id, status } = req.body;
    const id = req.user.id;

    const updateData = await UserVehicleMapping.update(
      {
        user_id,
        status,
        modified_date: new Date(),
        modified_by: id,
      },
      {
        where: {
          user_vehicle_id: user_vehicle_id,
        },
      }
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updateData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const updateUserVehicleDetails = async (req, res) => {
  try {
    const {
      color,
      fitness_validity,
      ignition_type_id,
      image,
      insurance_validity,
      passenger,
      permit_exp_date,
      rc_no,
      small_suitcase,
      status,
      vehicle_owner_mobile,
      vehicle_owner_name,
      vehicle_owner_type,
      vehicle_exist_id,
      owner_name,
      reg_date,
      chassis_no,
      engine_no,
      insurance_name,
      policy_number,
      policy_issue,
      premium_amount,
      cover_amount,
      rto_address,
      rto_tax_efficiency,
      rto_expiry,
      fitness_number,
      auth_number,
      auth_expiry,
      speed_governor_detail,
      speed_governor_expiry,
      puc_number,
      puc_expiry,
      permit_type,
      permit_expiry,
      vehicle_code,
      vehicle_reg_no,
      carrier,
      model_year,
      ac,
      big_suitcase,
      permit_expiry_date,
      id,
    } = req.body;

    const userId = req?.user?.id ?? 1;
    const vehicle_no = `${vehicle_code}-${vehicle_reg_no}`;

    await VehicleMaster.update(
      {
        modified_by: userId,
        modified_date: new Date(),
        color,
        fitness_expiry: fitness_validity,
        ignition_type_id,
        image,
        insurance_validity,
        large_suitcase: big_suitcase,
        luggage_carrier: carrier,
        model: model_year,
        passenger,
        permit_exp_date,
        rc_no,
        small_suitcase,
        status,
        vehicle_ac_nonac: ac,
        vehicle_no,
        vehicle_owner_mobile,
        vehicle_owner_name,
        vehicle_owner_type,
        owner_name,
        reg_date,
        chassis_no,
        engine_no,
        insurance_name,
        policy_number,
        policy_issue,
        premium_amount,
        cover_amount,
        rto_address,
        rto_tax_efficiency,
        rto_expiry,
        fitness_number,
        auth_number,
        auth_expiry,
        speed_governor_detail,
        speed_governor_expiry,
        puc_number,
        puc_expiry,
        permit_type,
        permit_expiry: permit_expiry_date,
      },
      { where: { id: id } }
    );

    const updatedData = await VehicleMaster.findByPk(id);

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updatedData,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      err.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const getVehicleTypeDetails = async (req, res) => {
  try {
    let sql = `SELECT mvt.vehicle_type,
       mvt.amenities,
       mvt.luggage,
       mvt.vehicle_image,
       mvt.seating_capacity,
       bvt.base_vehicle_id,
       bvt.vehicle_type_id,
       lp.id   AS local_pkg_id,
       lp.NAME AS package_name,
       df.minimum_charge,
       lp.hrs,
       lp.km,
       lpf.local_pkg_fare,


        vm.vehicle_ac_nonac,
    vm.ignition_type_id,

    mft.fuel_type

FROM   master_vehicle_type AS mvt
       LEFT JOIN base_vehicle_type AS bvt
              ON bvt.base_vehicle_id = mvt.id
                 AND bvt.status = 1
       LEFT JOIN local_package_fare AS lpf
              ON lpf.base_vehicle_id = bvt.base_vehicle_id
                 AND lpf.base_vehicle_id = bvt.vehicle_type_id
       LEFT JOIN local_package AS lp
              ON lp.id = lpf.local_pkg_id
                 AND lp.status = 1
       LEFT JOIN distance_fare AS df
              ON df.base_vehicle_id = bvt.base_vehicle_id
                 AND df.base_vehicle_id = bvt.vehicle_type_id
       LEFT JOIN master_fuel_type AS mft ON
       mft.id = bvt.vehicle_type_id 

      LEFT JOIN vehicle_master AS vm
      ON vm.id = bvt.base_vehicle_id
    AND vm.status = 1
GROUP  BY mvt.vehicle_type

`;

    const results = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results);
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      err.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};
