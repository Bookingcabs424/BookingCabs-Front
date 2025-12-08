import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterDocumentType = sequelize.define(
  "master_document_type",

  {
    doc_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    document_name: {
      type: DataTypes.STRING,
    },
    doc_level_name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    order_id: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
    tableName: "master_document_type",
  }
);

export default MasterDocumentType;
