import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserCancellationFareLogs = sequelize.define(
  "user_cancellation_fare_logs",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    booking_type: {
      type: DataTypes.INTEGER,
    },
    cancellation_master_id: {
      type: DataTypes.INTEGER,
    },
    cancellation_type: {
      type: DataTypes.STRING,
    },
    cancellation_value: {
      type: DataTypes.BOOLEAN,
    },
    curreny_id: {
      type: DataTypes.INTEGER,
    },
    days: {
      type: DataTypes.STRING,
    },
    from_date: {
      type: DataTypes.DATE,
    },
    hours: {
      type: DataTypes.STRING,
    },
    master_booking_type_id: {
      type: DataTypes.INTEGER,
    },
    round_off: {
      type: DataTypes.INTEGER,
    },
    to_date: {
      type: DataTypes.DATE,
    },
    vehicle_type: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    ip: {
      type: DataTypes.STRING,
    },
    log_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    createdAt: "created_on",
    updatedAt: "modified_on",
  }
);

export default UserCancellationFareLogs;
