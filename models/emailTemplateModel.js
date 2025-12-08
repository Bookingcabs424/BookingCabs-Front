import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const EmailTemplate = sequelize.define(
  "email_templates",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    header_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    footer_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
    },
     isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,      // new templates start active
      field: "is_active",      // maps to the DB column
    },
  },
  {
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "modified_date",
    tableName: "email_templates",
  }
);
export default EmailTemplate;
export const getEmailTemplate = async (type) => {
  return await EmailTemplate.findOne({ where: { type } });
};
