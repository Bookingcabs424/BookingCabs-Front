import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const EmailApi = sequelize.define(
  "email_api",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    provider: {
      type: DataTypes.STRING, // sendgrid, mailgun, ses, smtp
    },
    api_key: {
      type: DataTypes.STRING,
    },
    api_secret: {
      type: DataTypes.STRING,
    },
    api_user: {
      type: DataTypes.STRING,
    },
    api_region: {
      type: DataTypes.STRING,
    },
    smtp_host: {
      type: DataTypes.STRING,
    },
    smtp_port: {
      type: DataTypes.INTEGER,
    },
    smtp_secure: {
      type: DataTypes.BOOLEAN,
    },
    from_email: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    createdAt: "created_on",
    updatedAt: "modified_on",
    tableName: "email_api",
  }
);

export default EmailApi;
