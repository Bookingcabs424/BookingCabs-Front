import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

  const OnewayCityRoutePackage = sequelize.define('OnewayCityRoutePackage', {
    route_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'route_id'
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city_distance_id: {
      type: DataTypes.INTEGER,
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
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    via_city: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'oneway_city_route_package',
    timestamps: false, 
    freezeTableName: true,
   
  });



export default OnewayCityRoutePackage;