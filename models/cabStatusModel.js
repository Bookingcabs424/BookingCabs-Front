import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const CabStatus = sequelize.define(
  "cab_status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Columnstatus: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Columnstatus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Columntype: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "cab_status",
    timestamps: false,
  }
);

export default CabStatus;
