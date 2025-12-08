import sequelize from "../config/clientDbManager.js";

const PaymentResponse = sequelize.define('PaymentResponse', {
  payment_response_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clientcode'
  },
  customer_account_no: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  mmp_txn: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mer_txn: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  amt: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  prod: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  prod_amount: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  txn_init_date: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  txn_complete_date: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  txn_currency: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  bank_txn: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  f_code: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  status_code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  auth_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  bank_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  merchant_id: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  udf9: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  discriminator: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  surcharge: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  total_amount: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  card_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  CardNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  scheme: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  signature: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  udf1: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  udf2: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  udf3: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  udf4: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  udf5: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  customer_email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  customer_mobile: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_date: {
    type: DataTypes.TIMESTAMP,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  ip: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'payment_transaction_response',
  timestamps: false,
  freezeTableName:true
});

export default PaymentResponse;