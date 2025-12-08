import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const QuotationMarkup = sequelize.define('QuotationMarkup', {
    booking_markup_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    markup_amt_base: {
      type: DataTypes.ENUM('', '%', 'Value'),
      allowNull: true,
    },
    mark_amt_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    basic_amt: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    extra_km_markup: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    extra_hr_markup: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    markup_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'quotation_markup',
    timestamps: false,
    indexes: [
      {
        fields: ['booking_id'],
      },
    ],
  });
  export default QuotationMarkup;