import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

// models/BasicTax.js
const BasicTax = sequelize.define(
  "BasicTax",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tax_type: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    sac_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sgst: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cgst: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    igst: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
    tableName: "basic_tax",
    freezeTableName: true,
    timestamps: false,
  }
);

export default BasicTax;
