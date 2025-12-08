import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";


const BankDetails = sequelize.define('bankdetails', {
    bank_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ac_holder_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ac_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bank_proof: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    branch: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ifsc_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isDeleted: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    upi_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: 'bankdetails',
});

export default BankDetails;