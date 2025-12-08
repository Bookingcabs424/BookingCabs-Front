import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserAssignModule = sequelize.define(
  "user_assign_module",
  {
    assign_module_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    assign_role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATEONLY, // DATE in MySQL
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_date: {
      type: DataTypes.DATE, // TIMESTAMP
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "user_assign_module",
    timestamps: false, // ✅ handled manually
  }
);

export default UserAssignModule;
