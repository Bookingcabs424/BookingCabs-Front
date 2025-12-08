import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const SmsTemplate = sequelize.define(
  "sms_template",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
    },
    msg_type: {
      type: DataTypes.TEXT,
    },
    msg_sku: {
      type: DataTypes.TEXT,
    },
    variables: {
      type: DataTypes.TEXT,
    },
    text_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status_done: {
      type: DataTypes.INTEGER,
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
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    timestamps: false, 
    tableName: "sms_template",
  }
);

export default SmsTemplate;
