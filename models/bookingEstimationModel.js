import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BookingEstimation = sequelize.define('BookingEstimation', {
    advance_from_customer: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
    },
    approx_after_hour: {
        type: DataTypes.INTEGER
    },
    approx_after_km: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    approx_distance_charge: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
        allowNull: true
    },
    approx_hour_charge: {
        type: DataTypes.INTEGER
    },
    approx_waiting_charge: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    approx_waiting_minute: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    booking_amt_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    booking_cancellation_rule: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    booking_estimation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER
    },
    cgst_amount: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cgst_tax: {
        type: DataTypes.FLOAT
    },
    commi_type: {
        type: DataTypes.INTEGER
    },
    commi_value: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
    },
    company_share_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    company_share_value: {
        type: DataTypes.FLOAT
    },
    conversion_rate: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    coupon_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    coupon_value: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    created_date: {
        type: DataTypes.DATE
    },
    currency_id: {
        type: DataTypes.INTEGER
    },
    direction: {
        type: DataTypes.STRING,
        allowNull: true
    },
    discount_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    driver_advance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
    },
    driver_share_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    driver_share_value: {
        type: DataTypes.FLOAT
    },
    estimated_distance: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estimated_final_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estimated_price_before_markup: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estimated_time: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estimateprice_before_discount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    extras: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    extra_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    igst_amount: {
        type: DataTypes.STRING,
        allowNull: true
    },
    igst_tax: {
        type: DataTypes.FLOAT
    },
    level: {
        type: DataTypes.STRING,
        allowNull: true
    },
    local_discount_price: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
        allowNull: true
    },
    local_estimateprice_before_discount: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00,
        allowNull: true
    },
    minimum_charge: {
        type: DataTypes.INTEGER
    },
    min_minimum_charge: {
        type: DataTypes.INTEGER
    },
    min_per_hr_charge: {
        type: DataTypes.INTEGER
    },
    min_per_km_charge: {
        type: DataTypes.INTEGER
    },
    night_charge_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    night_rate_begins: {
        type: DataTypes.TIME,
        allowNull: true
    },
    night_rate_ends: {
        type: DataTypes.TIME,
        allowNull: true
    },
    night_rate_type: {
        type: DataTypes.ENUM,
        values: ['fixed', 'percentage'], // Adjust values as needed
        allowNull: true
    },
    night_rate_value: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    partner_share_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    partner_share_value: {
        type: DataTypes.FLOAT
    }
}, {
    tableName: 'booking_estimation',
    timestamps: false
});

export default BookingEstimation;