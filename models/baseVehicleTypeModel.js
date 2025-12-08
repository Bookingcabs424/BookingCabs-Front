import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import MasterVehicleType from "./masterVehicleTypeModel.js";

  const BaseVehicleType = sequelize.define('base_vehicle_type', {
    base_comb_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true

    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    vehicle_master_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'base_vehicle_type', 
    timestamps: false, 

  });
  // BaseVehicleType.sync({alter:true})

  
 export default BaseVehicleType;
