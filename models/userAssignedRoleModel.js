import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserAssignedRole = sequelize.define(
  "user_assigned_role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.BOOLEAN,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
    },
    ip: {
      type: DataTypes.STRING,
    },
    created_date: {
      type: DataTypes.DATE,
    },
    modified_date :{
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    tableName: "user_assigned_role",
  }
);

export default UserAssignedRole;
