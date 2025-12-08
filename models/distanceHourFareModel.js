import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const DistanceHourFare = sequelize.define('DistanceHourFare', {
    base_vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    currency: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    date_from: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    date_to: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minimum_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    minimum_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    minimum_hrs: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    per_hr_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    per_km_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    rate_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rate_value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('1'),
        allowNull: false,
        defaultValue: '1',
    },
    type_of_dispatch: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    week_days: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    tableName: 'distance_hour_fare',
    timestamps: false,
});

export default DistanceHourFare;