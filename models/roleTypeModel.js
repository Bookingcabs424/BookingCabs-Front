import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const RoleType = sequelize.define(
  "role_type",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    created_by: {
      type: DataTypes.BOOLEAN,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
    createdAt: "created_on",
    updatedAt: "modified_on",
  }
);

export default RoleType;
