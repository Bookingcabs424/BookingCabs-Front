// models/UserWaitingCharge.js

import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const UserWaitingCharge = sequelize.define('UserWaitingCharge', {
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
    waiting_minute_upto: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    waiting_fees: {
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
      defaultValue: 1
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'user_waiting_charge',
    freezeTableName:true,

    timestamps: false, // We're using custom date fields
    underscored: true,

    comment: 'User waiting charge information'
  });

    
export default UserWaitingCharge
