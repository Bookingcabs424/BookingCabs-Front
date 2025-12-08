import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const CompanyDetail = sequelize.define(
  "company",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    added_by: {
      type: DataTypes.INTEGER,
    },
    alt_email: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
    },
    brand_name: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    company_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_person_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.INTEGER,
    },
    country_prefix_land: {
      type: DataTypes.STRING,
    },
    country_prefix_mob: {
      type: DataTypes.STRING,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    landline_no: {
      type: DataTypes.STRING,
    },
    mobile_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pancard_no: {
      type: DataTypes.STRING,
    },
    pincode: {
      type: DataTypes.STRING,
    },
    service_tax_gst: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    website_url: {
      type: DataTypes.STRING,
    },
    company_logo_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    company_pancard_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "company",
  }
);

export default CompanyDetail;
