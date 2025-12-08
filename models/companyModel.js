import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      indexes: [{ unique: false, fields: ["user_id"] }],
    },
    company_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    brand_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contact_person_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    website_url: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    country: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    city: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(111),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    alt_email: {
      type: DataTypes.STRING(111),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    country_prefix_mob: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "0",
    },
    mobile_no: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    country_prefix_land: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    landline_no: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    service_tax_gst: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    pancard_no: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    added_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    msme_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    company_size: {
      type: DataTypes.ENUM,
      values: ["1", "2", "3", "4", "5"],
      allowNull: true,
    },
    company_logo_path: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    company_pancard_path: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    address_proof_path: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    gst_proof_path: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: "company",
    timestamps: false, // Since you have created_date field
    indexes: [
      {
        fields: ["user_id"],
      },
    ],
  }
);

export default Company;
