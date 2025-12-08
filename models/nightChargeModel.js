import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';


const NightCharge = sequelize.define('NightCharge', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  base_vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  night_rate_begins: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '22:00:00',
  },
  night_rate_ends: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '06:00:00',
  },
  night_rate_type: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: '1-% , 2-Value',
  },
  night_rate_value: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  created_date: {
    type: DataTypes.DATEONLY,
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
    allowNull: true,
  }
}, {
  tableName: 'night_charge',
  timestamps: false,
  freezeTableName: true,
});

export default NightCharge;
