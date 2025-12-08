import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const PackageActiveWeekdays = sequelize.define('package_active_weekday', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    base_vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    weekdays_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'package_active_weekdays', 
    timestamps: false, 
});

export default PackageActiveWeekdays;