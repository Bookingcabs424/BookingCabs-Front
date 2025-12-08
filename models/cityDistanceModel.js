import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const CityDistanceList = sequelize.define('CityDistanceList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  source_city: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'source_city'
  },
  destination_city: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'destination_city'
  },
  distance_km: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'distance_km'
  },
  radius: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: '0',
    field: 'radius'
  },
  total_distance: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: '0',
    field: 'total_distance'
  },
  total_toll: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'total_toll'
  },
  duration: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'duration'
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'status'
  }
}, {
  tableName: 'city_distance_list',
  timestamps: false,
  freezeTableName: true,
//   indexes: [
//     {
//       name: 'idx_source_city',
//       fields: ['source_city']
//     },
//     {
//       name: 'idx_destination_city',
//       fields: ['destination_city']
//     }
//   ]
});

export default CityDistanceList;