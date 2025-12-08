import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BookingPickDropDetails = sequelize.define('booking_pickdrop_details', {
    pickdrop_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    adults: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    childs: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    luggages: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    smallluggage: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    pickup_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pickup_area: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pickup_city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pickup_country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pickup_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    pickup_landmark: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pickup_latitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pickup_longitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pickup_state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pickup_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    pickup_zone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drop_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drop_area: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drop_city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drop_country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drop_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    drop_landmark: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drop_latitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drop_longitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drop_state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    drop_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    drop_zone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'booking_pickdrop_details',
    timestamps: false,
});

export default BookingPickDropDetails;