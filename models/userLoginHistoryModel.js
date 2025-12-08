import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import User from "./userModel.js"

const UserLoginHistory = sequelize.define(
  "user_login_history",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("SUCCESS", "FAILED"),
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING,
    },
    userAgent: {
      type: DataTypes.STRING,
    },
    loginAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    lastIpAddress: {
      type: DataTypes.STRING,
    },
    lastUserAgent: {
      type: DataTypes.STRING,
    },
    failedAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    loginDuration: {
      type: DataTypes.INTEGER,
    },
    platform: {
      type: DataTypes.STRING,
    },
    geolocation: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    createdAt: "created_on",
    updatedAt: "modified_on",
    tableName: "user_login_history",
  }
);
UserLoginHistory.associate = (models) => {
  UserLoginHistory.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};

export default UserLoginHistory;
