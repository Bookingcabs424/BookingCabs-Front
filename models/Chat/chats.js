import { DataTypes } from "sequelize";
import sequelize from "../../config/clientDbManager.js";

const Chats = sequelize.define(
  "Chats",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    IsGroup: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    GroupName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "chats",
  }
);

export default Chats;
