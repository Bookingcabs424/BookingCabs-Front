import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const BookingMarkup = sequelize.define('booking_markup', {
    booking_markup_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    markup_amt_base: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: null,
    },
    mark_amt_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
    },
    basic_amt: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    extra_km_markup: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '0',
    },
    extra_hr_markup: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    markup_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    markup_cgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    markup_igst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    markup_sgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    markup_cgst: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    markup_igst: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    markup_sgst: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'booking_markup',
    timestamps: false,
});

export default BookingMarkup;