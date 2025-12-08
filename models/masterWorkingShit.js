// models/masterWorkingShift.js
import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterWorkingShift = sequelize.define(
  "master_working_shift",
  {
    working_shift_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shift: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shift_time: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1, // 0-Inactive, 1-Active
      comment: "0-Inactive,1-Active",
    },
  },
  {
    tableName: "master_working_shift",
    timestamps: false, // disable createdAt/updatedAt
  }
);

export default MasterWorkingShift;
