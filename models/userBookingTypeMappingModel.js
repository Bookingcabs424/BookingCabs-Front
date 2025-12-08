import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const userBookingTypeMapping = sequelize.define(
  "user_booking_type_mapping",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    country_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    mapping_category: {
      type: DataTypes.INTEGER,
    },
    master_package_id: {
      type: DataTypes.INTEGER,
    },
    master_package_mode_id: {
      type: DataTypes.INTEGER,
    },
    state_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    city_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    vehicle_type: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    ip: {
      type: DataTypes.STRING,
    },
    status:{
      type: DataTypes.INTEGER,
    }
  },
  {
    timestamps: false,
    createdAt: "created_on",
    updatedAt: "modified_on",
    freezeTableName: true,
  }
);

export default userBookingTypeMapping;
