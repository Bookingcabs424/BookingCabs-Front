import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

    const DispatchLocation = sequelize.define('dispatch_location', {
      dispatch_location_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'dispatch_location_id'       
    },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      base_comb_id: {
        type: DataTypes.INTEGER,
        allowNull: false 
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false // assuming it's non-nullable
      },
      
      garage_type: {
        type: DataTypes.TINYINT,
        allowNull: true
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false // assuming it's non-nullable
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false // assuming it's non-nullable
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false // assuming it's non-nullable
      },
      modified_by: {
        type: DataTypes.INTEGER,
        defaultValue:0,
        allowNull: false // assuming it's non-nullable
      },
     
      pincode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      type_of_dispatch: {
        type: DataTypes.TINYINT,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false // assuming it's non-nullable
      }
    }, {
      tableName: 'dispatch_location', // explicit table name
      timestamps: false, 
      freezeTableName: true // prevent pluralization
    });
  
  
   export default DispatchLocation;
