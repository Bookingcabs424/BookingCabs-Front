import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

// models/BasicTax.js
const MasterDocumentation = sequelize.define(
  "MasterDocumentation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    booking_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "master_documentation",
    freezeTableName: true,
    timestamps: false,
  }
);

export default MasterDocumentation;
