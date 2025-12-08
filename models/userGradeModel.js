import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserGrade = sequelize.define(
  "user_grade",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    grade_name: {
      type: DataTypes.STRING,
    },

    ip: {
      type: DataTypes.STRING,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    ip: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    createdAt: "created_on",
    updatedAt: "modified_on",
  }
);

export default UserGrade;
