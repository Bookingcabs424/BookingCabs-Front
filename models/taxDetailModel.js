import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js'; // Adjust the path as needed

const TaxDetail = sequelize.define('TaxDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  master_booking_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  booking_type: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sac_code: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tax_type: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  charge_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'BASIC'
  },
  sgst: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: true
  },
  cgst: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  igst: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  from_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  to_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  modified_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  modified_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  },
  ip: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  freezeTableName:true,
  tableName: 'tax_detail',
  timestamps: false,
});

export default TaxDetail;