import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import MasterDocumentType from "./masterDocumentModel.js";

const UserVehicleUploadDocument = sequelize.define(
  "user_vehicle_upload_document",
  {
    upload_doc_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    },
    doc_default_status: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
    },
    ip: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "user_vehicle_upload_document",
  }
);


UserVehicleUploadDocument.belongsTo(MasterDocumentType, {
  foreignKey: "document_type_id",
  targetKey: "doc_type_id",
  as: "documentType",
});

export default UserVehicleUploadDocument;
