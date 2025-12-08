import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserCreditLimit = sequelize.define(
  "user_credit_limit",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    approved_by: {
      type: DataTypes.INTEGER,
    },
    approved_status: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    credit_limit_amount: {
      type: DataTypes.DOUBLE,
    },
    from_date: {
      type: DataTypes.DATE,
    },
    to_date: {
      type: DataTypes.DATE,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    modified_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    ip: {
      type: DataTypes.STRING,
    },    
  },
  {
    timestamps: false,
    tableName: "user_credit_limit",
  }
);

export default UserCreditLimit;
