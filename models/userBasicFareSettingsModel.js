import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserBasicFareSettings = sequelize.define(
  "user_basic_fare_settings",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    rounding: {
      type: DataTypes.INTEGER,
      // 1 for cash, 2 for account/credit
    },
    level:{
        type: DataTypes.INTEGER,
        // 1 for Normal, 2 for decimal, 3 unit
    },
    direction:{
        type: DataTypes.INTEGER,
        // 1 for nearest, 2 upward, 3 downward
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
  },
  {
    timestamps: false,
    createdAt: "created_on",
    updatedAt: "modified_on",
  }
);

export default UserBasicFareSettings;
