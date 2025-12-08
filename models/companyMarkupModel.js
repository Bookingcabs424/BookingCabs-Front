import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const CompanyMarkup = sequelize.define(
  "company_markup",
  {
    comp_markup_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      defaultValue: 0,
    },
    user_grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    markup_category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "1-user,2-Booking Type,3-Country,4-City",
    },
    mark_amt_type: {
      type: DataTypes.ENUM('%', 'Value'),
      allowNull: true,
      comment: "Percentage ,Fixed",
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
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    basic_amt: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    markup_amt_base: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1-Total,2-Base",
    },
    extra_km_markup: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "0",
    },
    extra_hr_markup: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "0",
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: "company_markup",
    timestamps: false, 
    createdAt: "created_date",
    updatedAt: "modified_date",
  }
);

export default CompanyMarkup;
