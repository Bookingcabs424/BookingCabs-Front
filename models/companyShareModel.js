// models/CompanyShare.js

import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const CompanyShare = sequelize.define('CompanyShare', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    share_type_id: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '1-company, 2-Partner, 3-Driver',
    },
    share_value_type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '1-% , 2-Rs',
    },
    share_value: {
      type: DataTypes.STRING(10),
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
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, {
    tableName: 'company_share',
    timestamps: false, // disable Sequelize's default timestamps
  });

export default CompanyShare