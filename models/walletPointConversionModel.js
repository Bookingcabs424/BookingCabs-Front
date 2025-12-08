import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const WalletPointConversion = sequelize.define('wallet_point_conversion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    conversion_rate: {
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
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    master_package_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    user_grade_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    user_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'wallet_point_conversion', 
    timestamps: false, 
});

export default WalletPointConversion;