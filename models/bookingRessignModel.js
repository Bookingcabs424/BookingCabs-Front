import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BookingResecReassign = sequelize.define(
  "bookingReassign",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    booking_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    old_driver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_driver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    old_pick_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    old_pick_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    new_pick_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    new_pick_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    old_booking_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    new_booking_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    old_cab_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_cab_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    old_estimated_price: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
    },
    new_estimated_price: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps:false,
    tableName: "booking_resec_reassign",
  }
);

export default BookingResecReassign;
