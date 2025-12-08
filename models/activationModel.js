import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const Activation = sequelize.define(
  "activation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    UID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    Verification_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    login_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    isUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    is_used: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    expires_in: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "activation",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_on",
    updatedAt: "modified_on",
  }
);

export default Activation;
