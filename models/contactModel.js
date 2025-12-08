import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    mobile: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },

    company: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    modified_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    status: {
      type: DataTypes.ENUM("0", "1", "2"),
      allowNull: false,
      defaultValue: "0", // 1-Active, 0-InActive, 2-Soft Delete
    },

    ip: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "contact",
    timestamps: false,
  }
);

export default Contact;
