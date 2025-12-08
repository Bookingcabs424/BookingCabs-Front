// models/CompanyMarkupLog.js
import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const CompanyMarkupLog = sequelize.define(
  "company_markup_logs",
  {
    comp_markup_log_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comp_markup_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    master_booking_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    markup_category: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mark_amt_type: {
      type: DataTypes.ENUM('%', 'Value'),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    master_package_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    basic_amt: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    markup_amt_base: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    extra_km_markup: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    extra_hr_markup: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "company_markup_logs",
    timestamps: false,
  }
);

export default CompanyMarkupLog;
