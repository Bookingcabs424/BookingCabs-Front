import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BookingLogs = sequelize.define("booking_logs", {
    bookingid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "booking_logs",
    timestamps: false,
});

export default BookingLogs;