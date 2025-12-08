import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserExtras = sequelize.define(
  "user_extras",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    booking_type: {
      type: DataTypes.INTEGER,
    },
    extras_master_id:{
        type: DataTypes.INTEGER,
    },
    extra_value:{
        type: DataTypes.INTEGER,
    },
    extra_value_type:{
        type: DataTypes.STRING,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    modified_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  
  },
  {
    timestamps: false,
    createdAt: "created_date",
    updatedAt: "modified_date",
    tableName: "user_extras",
  }
);

export default UserExtras;
