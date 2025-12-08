// models/UserCancellationFareLog.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const UserCancellationFareLog = sequelize.define('user_cancellation_fare_logs', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cancellation_master_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cancellation_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cancellation_value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  from_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  to_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  currency_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  booking_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  vehicle_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  master_booking_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  modified_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_cancellation_fare_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'user_cancellation_fare_logs',
  timestamps: false
});

export default UserCancellationFareLog;
