import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const GstVerification = sequelize.define(
  "gst_verifications",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    active: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    center: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    center_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    constitution: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    einvoice_enabled: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    filings: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    gst_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    gst_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_updated_on: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    legal_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nature_of_business: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    primary_address: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    raw_response: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    registered_on: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trade_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    valid: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "gst_verifications",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["gst_number"],
      },
      {
        fields: ["company_id"],
      },
    ],
  }
);

export default GstVerification;
