import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserDomainPackage = sequelize.define(
  "user_domain_package",
  {
    domain_package_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    package_id: {
      type: DataTypes.INTEGER,
    },
    domain_register_id: {
      type: DataTypes.INTEGER,
    },
    ip: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    createdAt: "created_on",
    updatedAt: "modified_on",
    tableName: "user_domain_package",
  }
);

export default UserDomainPackage;
