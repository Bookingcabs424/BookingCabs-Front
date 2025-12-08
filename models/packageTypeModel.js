import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const PackageType = sequelize.define('package_type', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lang_flag: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'en_US',
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
    tour_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'package_type', 
    timestamps: false,
});

export default PackageType;