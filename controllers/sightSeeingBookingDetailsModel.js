import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const SightSeeingBookingDetails = sequelize.define('SightSeeingBookingDetails', {
    s_booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sightseeing_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    ip: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '0',
    },
}, {
    tableName: 'sightseeing_booking_details',
    timestamps: false,
});

export default SightSeeingBookingDetails;