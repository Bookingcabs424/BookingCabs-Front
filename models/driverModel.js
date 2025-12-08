import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const Driver = sequelize.define('driver', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    driving_license_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gps: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_functional: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    license_state: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    license_validity: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pancard_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preferred_booking: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preferred_partner: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'NO',
    },
    route_know: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    total_fleet_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    zone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'driver',
    timestamps: false,
});

export default Driver;