import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserUploadDocument = sequelize.define(
  "user_upload_document",
  {
    upload_doc_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    document_type_id: {
      type: DataTypes.INTEGER,
    },
    doc_file_upload: {
      type: DataTypes.TEXT,
    },
    doc_approval_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    doc_default_status: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    createdAt: "created_date",
    updatedAt: false,
    tableName: "user_upload_document",
    freezeTableName: true, // Prevents Sequelize from pluralizing table names
  }
);

export default UserUploadDocument;
