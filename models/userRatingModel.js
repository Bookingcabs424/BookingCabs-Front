import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
const UserRating = sequelize.define(
  "UserRating",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    BookingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DriverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Rating: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "user_rating",
    timestamps: false,
  }
);

export default UserRating;
