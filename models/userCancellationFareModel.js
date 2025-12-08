import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserCancellationFare = sequelize.define(
  "user_cancellation_fare",
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
    currency_id: {
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
    status: {
      type: DataTypes.BOOLEAN,
    },
    ip: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    createdAt: "created_date",
    updatedAt: "modified_date",
    freezeTableName:true
  }
);

export default UserCancellationFare;
