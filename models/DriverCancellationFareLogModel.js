import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const DriverCancellationFareLog = sequelize.define('driver_cancellation_fare_log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  master_booking_type_id: {
    type: DataTypes.INTEGER,
  },
  booking_type: {
    type: DataTypes.INTEGER,
  },
  vehicle_type: {
    type: DataTypes.INTEGER,
  },
  cancellation_master_id: {
    type: DataTypes.INTEGER,
  },
  cancellation_type: {
    type: DataTypes.STRING,
  },
  cancellation_value: {
    type: DataTypes.DECIMAL(10, 2),
  },
  created_by: {
    type: DataTypes.INTEGER,
  },
  ip: {
    type: DataTypes.STRING,
  },
  created_date: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'driver_cancellation_fare_logs',
  timestamps: false,
});

export default DriverCancellationFareLog;
