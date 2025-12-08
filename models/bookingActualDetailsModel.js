import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
const BookingActualDetails = sequelize.define("booking_actual_details", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    actual_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    actual_driven_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    actual_driven_duration: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    actual_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    actual_waiting_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    arrival_time_actual: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    arrival_time_post: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    arrival_time_pre: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    final_latitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    final_longitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    return_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    return_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    updated_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "booking_actual_details",
    timestamps: false,
});

export default BookingActualDetails;