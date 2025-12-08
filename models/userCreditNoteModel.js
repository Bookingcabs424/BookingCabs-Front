import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserCreditNote = sequelize.define(
  "UserCreditNote",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    credit_note_ref_no: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    booking_amount: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    cancellation_charge: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    credit_note_amount: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    credit_note_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: true,
    }
  },
  {
    timestamps: false, 
    tableName: "user_credit_note",
  }
);

export default UserCreditNote;