import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BookingTracker = sequelize.define('booking_tracker', {
    BookingID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
    },
    CabStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Date_Time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    DriverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    Latitutude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Logitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    starting_meter: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    UpdateOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'booking_tracker', 
    timestamps: false, 
});

export default BookingTracker;