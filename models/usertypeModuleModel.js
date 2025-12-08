import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UsertypeModule = sequelize.define(
  "usertype_module",
  {
    rule_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usertype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    is_write: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    is_delete: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    order_menu: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "usertype_module",
    timestamps: false,
  }
);

export default UsertypeModule;
