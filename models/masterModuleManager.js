import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterModuleManager = sequelize.define(
  "master_module_manager",
  {
    module_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    module_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    controller: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    icon_class: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    menu_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    namespace: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "master_module_manager",
    timestamps: false,
  }
);

export default MasterModuleManager;
