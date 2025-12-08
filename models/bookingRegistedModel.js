import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BookingRegistered = sequelize.define(
  "booking_register",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    read_status: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
      defaultValue: 0,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updateOn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "booking_register",
    timestamps: false,
  }
);

export default BookingRegistered;
