import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserRole = sequelize.define("user_role", {
  role_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role_type: {
    type: DataTypes.STRING,
  },
  RoleName: {
    type: DataTypes.STRING,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
  },
  isApproved: {
    type: DataTypes.INTEGER,
  },
  isActive: {
    type: DataTypes.INTEGER,
  },
  ApprovedBy: {
    type: DataTypes.INTEGER,
  },
  RoleDescription: {
    type: DataTypes.STRING,
  },
  user_grade: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
  createdAt: 'created_date',
  updatedAt: 'ModifiedDate',
  tableName:"user_role"
});

export default UserRole;
