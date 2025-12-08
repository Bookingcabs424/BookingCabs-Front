import MasterVehicle from "../models/masterVehicleModel.js";
import MasterVehicleType from "../models/masterVehicleTypeModel.js";
import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import VehicleMaster from "../models/vehicleMasterModel.js";

class MyInventory {
  static async getAllVehiclesTableData(req, res) {
    try {
      const query = `
  SELECT
    ROW_NUMBER() OVER (ORDER BY mvm.vehicle_type_name, mvm.name) AS sno,
    vm.id as id,
    mvm.vehicle_type_name AS vehicle_type_name,
    mvm.name AS vehicle_name,
    mvm.aircondition AS aircondition,
    vm.model AS model,
    vm.vehicle_no AS vehicle_no,
    mvm.status AS status,
    CONCAT(u.first_name, ' ', u.last_name) AS vendor_name,
    u.email AS vendor_email,
    u.city AS vendor_city,
    u.mobile AS vendor_mobile,
    GROUP_CONCAT(mdt.document_name SEPARATOR ', ') AS pending_documents
FROM vehicle_master vm
INNER JOIN master_vehicle_model mvm
    ON vm.id = mvm.id
LEFT JOIN user u
    ON vm.created_by = u.id
LEFT JOIN user_upload_document uud
    ON u.id = uud.user_id
LEFT JOIN master_document_type mdt
    ON uud.document_type_id = mdt.doc_type_id
    AND uud.doc_approval_status = 0
    AND mdt.type = 'vehicle'
GROUP BY
    vm.id,
    mvm.vehicle_type_name,
    mvm.name,
    mvm.aircondition,
    vm.model,
    vm.vehicle_no,
    mvm.status,
    u.first_name,
    u.last_name,
    u.email,
    u.city,
    u.mobile
ORDER BY mvm.vehicle_type_name, mvm.name;


    `;

      const vehicles = await sequelize.query(query, {
        type: QueryTypes.SELECT,
      });

      return res.status(200).json({
        success: true,
        message: "Vehicle list fetched successfully",
        data: vehicles,
      });
    } catch (error) {
      console.error("Error fetching vehicle list:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching vehicle list",
        error: error.message,
      });
    }
  }

  // get All vehicle types with count

  static async getAllVehicleTypesWithCount(req, res) {
    try {
      const vehicleTypes = await MasterVehicleType.findAll({
        attributes: ["id", "vehicle_type", "vehicle_image"],
        raw: true,
      });

      console.log("vehicles types", JSON.stringify(vehicleTypes));

      // count model for each type

      const typeIds = vehicleTypes.map((vt) => vt.id);
      console.log("typeIds", typeIds);

      const modelCounts = await MasterVehicle.findAll({
        attributes: [
          "vehicle_type_id",
          [MasterVehicle.sequelize.fn("COUNT", "*"), "count"],
        ],
        where: { vehicle_type_id: typeIds },
        group: ["vehicle_type_id"],
        raw: true,
      });

      const result = vehicleTypes.map((type) => {
        const found = modelCounts.find((m) => m.vehicle_type_id === type.id);
        return {
          ...type,
          count: found ? parseInt(found.count, 10) : 0,
        };
      }).filter((r)=> r.count > 0); // filter types with count > 0

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error fetching vehicle types with counts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getModelsByType(req, res) {
    try {
      const { typeId } = req.params;

      const numericTypeId = Number(typeId);

      // const query = `
      //   SELECT
      //     mvm.id AS id,
      //     mvm.name AS name,
      //     mvm.image AS image,
      //     vm.model AS year_of_make,
      //     vm.vehicle_no AS vehicle_no
      //   FROM master_vehicle_model AS mvm
      //   LEFT JOIN vehicle_master AS vm
      //     ON vm.vehicle_master_id = mvm.id
      //   WHERE mvm.vehicle_type_id = :typeId
      // `;
      const query = `
        SELECT 
          mvm.id AS id,
          mvm.name AS name,
          mvm.image AS image,
          vm.model AS year_of_make,
          vm.vehicle_no AS vehicle_no
        FROM master_vehicle_model AS mvm
        LEFT JOIN vehicle_master AS vm 
          ON vm.id = mvm.id
        WHERE mvm.vehicle_type_id = :typeId
      `;

      const models = await sequelize.query(query, {
        replacements: { typeId: numericTypeId },
        type: sequelize.QueryTypes.SELECT,
      });

      console.log("models:", JSON.stringify(models, null, 2));

      if (!models.length) {
        return res.status(404).json({
          success: false,
          message: "No models found for this vehicle type",
        });
      }

      return res.status(200).json({
        success: true,
        data: models,
      });
    } catch (error) {
      console.error("Error fetching vehicle models:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  static async addVehicle(req, res) {
    try {
      const {
        model_name,
        vehicle_type_id,
        vehicle_no,
        year_of_make,
        vehicle_type_name,
        vehicle_owner_type,
      } = req.body;
      const { id: created_by } = req.user;

      if (
        !model_name ||
        !vehicle_type_id ||
        !vehicle_no ||
        !year_of_make ||
        !vehicle_type_name
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: model_name, vehicle_type_id, vehicle_no, year_of_make",
        });
      }

      // Step 1: Insert into master_vehicle_model
      const newModel = await MasterVehicle.create({
        name: model_name,
        vehicle_type_id: vehicle_type_id,
        vehicle_type_name,
        created_date: new Date().toISOString(),
        status: 1,
        created_by,
      });

      // Step 2: Insert into vehicle_master using new model_id
      const newVehicle = await VehicleMaster.create({
        id: newModel.id, // use the generated ID here
        vehicle_no,
        model: year_of_make,
        vehicle_owner_type,
        luggage_carrier: 0,
        created_date: new Date(),
        created_by,
      });

      return res.status(201).json({
        success: true,
        message: "Vehicle successfully added",
        data: {
          model: newModel,
          vehicle: newVehicle,
        },
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      return res.status(500).json({
        success: false,
        message: "Error adding vehicle",
        error: error.message,
      });
    }
  }

  static async getVehicleModels(req, res) {
    try {
      const { vehicle_type_id, vehicle_name } = req.query;

      let sql = `
        SELECT 
          mvm.id,
          mvm.vehicle_type_id,
          mvt.vehicle_type,
          mvm.name AS vehicle_name,
          mvm.person_capacity,
          mvm.luggage_capacity,
          mvm.small_suitcase
        FROM master_vehicle_model AS mvm
        LEFT JOIN master_vehicle_type AS mvt ON mvm.vehicle_type_id = mvt.id
        WHERE mvm.status = 1
      `;

      // replacements object for safe query binding
      const replacements = {};

      if (vehicle_type_id) {
        sql += " AND mvm.vehicle_type_id = :vehicle_type_id";
        replacements.vehicle_type_id = vehicle_type_id;
      }

      if (vehicle_name) {
        sql += " AND (mvm.name LIKE :search OR mvt.vehicle_type LIKE :search)";
        replacements.search = `%${vehicle_name}%`;
      }

      sql += " ORDER BY mvt.vehicle_type, mvm.name";

      const data = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements,
      });

      return res.status(200).json({
        success: true,
        message: "Vehicle models fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error fetching vehicle models:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching vehicle models",
        error: error.message,
      });
    }
  }

  static async deleteVehicles(req, res) {
    try {
      const { ids } = req.body; // Expecting an array of IDs
      const { id: deleted_by } = req.user;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide an array of vehicle IDs to delete",
        });
      }

      // Step 1: Delete from vehicle_master
      await VehicleMaster.destroy({
        where: { id: ids },
      });

      // Step 2: Delete from master_vehicle_model
      await MasterVehicle.destroy({
        where: { id: ids },
      });

      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${ids.length} vehicle(s)`,
      });
    } catch (error) {
      console.error("Error deleting vehicles:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting vehicles",
        error: error.message,
      });
    }
  }
}

export default MyInventory;
