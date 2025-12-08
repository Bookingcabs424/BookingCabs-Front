import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

// models/UserAssignRole.js

const UserAssignRole = sequelize.define('UserAssignRole', {
  assign_role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
   
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
 
  },
  created_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
   
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'user_assign_role',
  timestamps: false, // Since you have custom created_date field
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['role_id']
    },
    {
      fields: ['department_id']
    },
    {
      fields: ['status']
    }
  ]
});

export default UserAssignRole;
