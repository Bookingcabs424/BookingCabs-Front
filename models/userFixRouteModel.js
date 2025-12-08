import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserFixRoute = sequelize.define(
  "user_fix_route",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    booking_type: {
      type: DataTypes.INTEGER,
    },
    frequent_location: {
      type: DataTypes.INTEGER,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    created_by: {
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

export default UserFixRoute;
