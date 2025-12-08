import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';


const CancellationFare = sequelize.define('CancellationFare', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  base_vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  currency_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  cancellation_master_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  cancellation_type: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  cancellation_value: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  round_off: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  days: {
    type: DataTypes.STRING(11),
    allowNull: true,
    defaultValue: '0',
  },
  hours: {
    type: DataTypes.STRING(11),
    allowNull: true,
    defaultValue: '0',
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,

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
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  ip: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'cancellation_fare', // change to match your actual table name
  timestamps: false,
});
export default CancellationFare;
