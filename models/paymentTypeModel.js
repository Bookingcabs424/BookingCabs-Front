import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";


const PaymentType = sequelize.define(
  "payment_type",
  {
    payment_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pay_type_mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "payment_type",
    timestamps: false,
  }
);

export default PaymentType;
