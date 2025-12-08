import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const QuotationsTravellerDetails = sequelize.define('QuotationsTravellerDetails', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    age: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    alt_mobile_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    gst_no: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    gst_company_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    agent_reference: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    placcard_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    id_proof: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_teamleader: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '',
    },
  }, {
    tableName: 'quotations_traveller_details',
    timestamps: false,
  });
export default QuotationsTravellerDetails;