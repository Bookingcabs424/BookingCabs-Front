import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const RoleType = sequelize.define(
  "role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    region_id: {
      type: DataTypes.INTEGER,
    },
    role_name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    created_by: {
      type: DataTypes.BOOLEAN,
    },
    created_date: {
      type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    tableName: "role"
  }
);

export default RoleType;
