import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BookingStack = sequelize.define(
  "booking_stack",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    last_try: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "booking_stack",
    timestamps: false,
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
  }
);
export default BookingStack;
