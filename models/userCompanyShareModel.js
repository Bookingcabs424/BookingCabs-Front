import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserCompanyShare = sequelize.define(
  "user_company_share",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    booking_type: {
      type: DataTypes.INTEGER,
    },
    company_share_type: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },
    company_share_value: {
      type: DataTypes.STRING,
      allowNull: true,

    },
    driver_share_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    driver_share_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    partner_share_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    partner_share_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    share_value: {
      type: DataTypes.STRING,
    },
    share_type_id: {
      type: DataTypes.INTEGER,
    },
    share_value_type: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    ip: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName:'user_company_share',
    freezeTableName:true,
    timestamps: false,
    createdAt: "created_date",
    updatedAt: "modified_date",
  }
);

export default UserCompanyShare;
