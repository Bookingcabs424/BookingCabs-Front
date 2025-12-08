import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserInfo = sequelize.define(
  "user_info",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternate_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternate_mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    external_ref:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gst_registration_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kyc: {
      type: DataTypes.STRING, // Could also be a file path or URL
      allowNull: true,
    },
    kyc_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landline_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
    gender:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true,
    createdAt: "created_on",
    updatedAt: "modified_on",
    tableName:"user_info"
  }
);

export default UserInfo;
