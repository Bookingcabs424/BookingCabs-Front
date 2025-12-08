import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const PremiumsFare= sequelize.define('PremiumsFare', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    premiums_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '1-% , 2-Value'
    },
    premiums_value: {
      type: DataTypes.STRING(5),
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('1', '0'),
      allowNull: false,
      defaultValue: '1'
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'premiums_fare',
    timestamps: false,
    freezeTableName: true,

  });
export default PremiumsFare