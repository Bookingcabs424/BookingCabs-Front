import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BankAccountLog = sequelize.define(
  "bank_account_log",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bank_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    previous_data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    updated_data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "bank_account_log",
    timestamps: false,
  }
);

export default BankAccountLog;
