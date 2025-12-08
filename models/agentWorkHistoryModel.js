import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const AgentWorkHistory = sequelize.define(
  "AgentWorkHistory",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    AgentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CallerId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    BookingID: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ActionType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ActionDesc: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "agent_work_history",
  }
);

export default AgentWorkHistory;
