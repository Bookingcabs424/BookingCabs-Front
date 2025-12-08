import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserCurrentLocation = sequelize.define(
  "user_current_location",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    current_latitude: {
      type: DataTypes.STRING,
    },
    current_longitude: {
      type: DataTypes.STRING,
    },
    distance: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: false,
    createdAt: "created_on",
    updatedAt: "modified_on",
  }
);

export default UserCurrentLocation;
