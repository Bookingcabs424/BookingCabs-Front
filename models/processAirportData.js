import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const ProcessAirportData = sequelize.define("process_airport_data", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  airport_railway_bus_cruise_terminal_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  entry_type: {
    type: DataTypes.ENUM("ARRIVAL", "DEPARTURE"),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: "process_airport_data",
  timestamps: false,
});

export default ProcessAirportData;
