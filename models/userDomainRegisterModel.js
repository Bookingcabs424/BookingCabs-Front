import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserDomainRegister = sequelize.define(
  "user_domain_register",
  {
    domain_register_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    user_license_id: {
      type: DataTypes.INTEGER,
    },
    domain_name: {
      type: DataTypes.INTEGER,
    },
    ip: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    timestamps: false,
    createdAt: "created_on",
    updatedAt: "modified_on",
  }
);

export default UserDomainRegister;
