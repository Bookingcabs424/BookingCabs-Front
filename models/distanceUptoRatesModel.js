import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';


const DistanceUptoRate= sequelize.define('DistanceUptoRate', {
    distance_upto_rate_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    km_upto: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rate_per_km: {
      type: DataTypes.STRING(20),
      allowNull: true
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue:' '
      
    }
  }, {
    tableName: 'distance_upto_rate',
    timestamps: false
  });
export default DistanceUptoRate