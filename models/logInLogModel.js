import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const LogInLog = sequelize.define("log_in_log", {
    callfrom: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expires: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    log: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    login_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    login_diff: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    login_location: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    login_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    login_timezone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    logout_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    logout_location: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    logout_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: "log_in_log",
    timestamps: false,
});

export default LogInLog;