import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const DriverLocation = sequelize.define('driver_location', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    accuracy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    booking_status: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    current_latitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    current_longitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    current_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    distance: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duration: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    pre_Waiting_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    speed: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    start_latitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    start_longitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    time_stamp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tripRunnStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    WaitingTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
}, {
    tableName: 'driver_location', 
    timestamps: false, 
});

export default DriverLocation;