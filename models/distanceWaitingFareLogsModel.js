import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';


 const  DistanceWaitingFareLogs =sequelize.define('DistanceWaitingFareLogs', {
    id: {
      type: DataTypes.INTEGER,
    
    },
    logs_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_of_dispatch: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '1-point to point, 2- Garage to garage'
    },
    minimum_charge: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minimum_distance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    per_km_charge: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minutes_upto: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    fees: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    fees_per_minute: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    date_from: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    date_to: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rate: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    rate_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: ''
    },
    rate_value: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    week_days: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '1,2,3,4,5,6,7'
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
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
      type: DataTypes.ENUM('0', '1', '2', '3'),
      allowNull: false,
      defaultValue: '1'
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DistanceWaitingFareLogs',
    tableName: 'distance_waiting_fare_logs',
    timestamps: false, // We're handling created_date and modified_date manually
    indexes: [
      {
        fields: ['base_vehicle_id']
      },
      {
        fields: ['date_from']
      },
      {
        fields: ['date_to']
      }
    ]
  });
// (async () => {
//     try {
//         await DistanceWaitingFareLogs.sync({ alter: true });
//         console.log('✅ distance_fare_logs table is ready.');
//     } catch (error) {
//         console.error('❌ Failed to sync distance_fare_logs table:', error);
//     }
// })();
  export default DistanceWaitingFareLogs;
