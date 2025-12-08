import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BankDetail = sequelize.define(
  "bank_detail",
  {
    bank_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    branch: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    ifsc_code: {
      type: DataTypes.STRING,
    },
    ac_no: {
      type: DataTypes.STRING,
    },
    ac_holder_name: {
      type: DataTypes.STRING,
    },
    bank_proof: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    upi_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    modified_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ip: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

export default BankDetail;
