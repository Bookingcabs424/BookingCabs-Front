import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const DriverCancellationFare = sequelize.define('DriverCancellationFare', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    booking_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    master_driver_cancellation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'master_driver_cancellation_id' // Maps to the actual column name
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cancellation_type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    cancellation_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    from_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    to_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    days: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '0'
    },
    hours: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '0'
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
      allowNull: false
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '0-Inactive,1-Active,2-Deleted'
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'driver_cancellation_fare',
    timestamps: false, // Disable automatic timestamp fields
    underscored: true, // Use snake_case for automatic field naming
    comment: 'Driver cancellation fare information'
  });



export default DriverCancellationFare