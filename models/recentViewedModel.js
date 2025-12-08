import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const RecentViewed = sequelize.define(
  "recently_viewed",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_data: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    booking_stage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    master_package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    temp_booking_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "recently_viewed",
    timestamps: false,
  }
);

export default RecentViewed;
