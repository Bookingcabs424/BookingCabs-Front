// models/FixRoute.js

import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

    const FixRoute = sequelize.define('FixRoute', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      base_vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      frequent_location: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '1',
      },
      ip: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    }, {
      tableName: 'fix_route',
      timestamps: false, // disable Sequelize's default timestamp fields
    });
  
   export default FixRoute;
  
  