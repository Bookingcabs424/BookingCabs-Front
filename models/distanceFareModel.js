import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const DistanceFare = sequelize.define(
  "DistanceFare",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_of_dispatch: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "1 - point to point, 2 - Garage to garage",
    },
    minimum_charge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    minimum_distance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    per_km_charge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    round_up_km: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "off",
    },
    accumulated_instance: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "off",
    },
    date_from: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    date_to: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rate: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    rate_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    rate_value: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    week_days: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "1,2,3,4,5,6,7",
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("0", "1", "2", "3"),
      allowNull: false,
      defaultValue: "1",
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: "distance_fare",
    timestamps: false,
    underscored: true,
  }
);
export default DistanceFare;
