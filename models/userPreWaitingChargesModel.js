// models/UserPreWaitingCharge.js

import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const UserPreWaitingCharge = sequelize.define('UserPreWaitingCharge', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    booking_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pre_waiting_upto_minutes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pre_waiting_fees: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '0-Inactive, 1-Active, 2-Deleted'
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'user_pre_waiting_charge',
    timestamps: false, // Using custom timestamp fields
    underscored: true,
    freezeTableName:true,
    comment: 'User pre-waiting charge information'
  });
export default UserPreWaitingCharge
    
    // Add other associations as needed
