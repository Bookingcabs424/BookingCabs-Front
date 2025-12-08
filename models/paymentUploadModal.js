import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const PaymentUpload = sequelize.define("payment_upload", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  payment_ref_no: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  deposit_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  transaction_mode: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  fileupload: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  trans: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  chequeno: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  partner_bank: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  deposit_bank: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  deposit_branch: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  remark: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0, // 0-Pending, 1-Approved, 2-Audit
  },
  credit_date: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  credit_amount: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  audit_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  admin_remarks: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  transaction_no:{
    type:DataTypes.STRING,
    allowNull:true
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: "payment_upload"
});

export default PaymentUpload;