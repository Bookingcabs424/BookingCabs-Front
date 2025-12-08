import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const HourlyFare = sequelize.define('HourlyFare', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    base_vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type_of_dispatch: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1, // 1 - point to point, 2 - garage to garage
        comment: '1 - point to point, 2 - garage to garage'
    },
    minimum_charge: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    minimum_hrs: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    per_hr_charge: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_from: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    date_to: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    currency: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rate: {
        type: DataTypes.TINYINT,
        allowNull: true
    },
    rate_type: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    rate_value: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    week_days: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '1,2,3,4,5,6,7'
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('0', '1', '2', '3'),
        allowNull: false,
        defaultValue: '1'
    },
    ip: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableNameFreeze:true,
    tableName: 'hourly_fare',
    timestamps: false,
    underscored: true
});
export default HourlyFare