const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as per your project structure

const BookingRegister = sequelize.define('BookingRegister', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    bookingid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(5),
        allowNull: false,
        defaultValue: 'M',
    },
    updateOn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'NA',
    },
    read_status: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '0',
    },
}, {
    tableName: 'booking_register',
    timestamps: false, // Disable Sequelize's automatic timestamps
});

module.exports = BookingRegister;