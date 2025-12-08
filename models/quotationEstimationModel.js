import { fr } from 'date-fns/locale';
import sequelize from '../config/clientDbManager.js';
import { DataTypes } from 'sequelize';


const QuotationEstimation = sequelize.define('QuotationEstimation', {
    booking_estimation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estimated_time: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    estimated_distance: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    estimateprice_before_discount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    local_estimateprice_before_discount: {
        type: DataTypes.DOUBLE(5,2),
        allowNull: true,
        defaultValue: 0.00
    },
    discount_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    local_discount_price: {
        type: DataTypes.DOUBLE(5,2),
        allowNull: true,
        defaultValue: 0.00
    },
    service_charge: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '0'
    },
    state_tax: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: '0'
    },
    toll_tax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    user_markup: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    booking_amt_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    estimated_final_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    estimated_price_before_markup: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    approx_distance_charge: {
        type: DataTypes.DOUBLE(6,2),
        allowNull: true,
        defaultValue: 0.00
    },
    approx_after_km: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    approx_after_hour: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    approx_hour_charge: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        defaultValue: 0
    },
    approx_waiting_charge: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    approx_waiting_minute: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    minimum_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    min_per_km_charge: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    min_per_hr_charge: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        defaultValue: 0
    },
    min_minimum_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    night_rate_type: {
        type: DataTypes.ENUM('0', '%', 'Value'),
        allowNull: true
    },
    night_rate_value: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    night_rate_begins: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: '00:00:00'
    },
    night_rate_ends: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: '00:00:00'
    },
    night_charge_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    premiums_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: '0'
    },
    premiums_value: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    premiums_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    extras: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    extra_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    peak_time_value: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    peak_time_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    booking_cancellation_rule: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price_before_tax: {
        type: DataTypes.DOUBLE(25,2),
        allowNull: false,
        defaultValue: 0.00
    },
    cgst_tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    igst_tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    sgst_tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    total_tax_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    cgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    igst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    sgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_cgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_igst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_sgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_cgst: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_igst: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_sgst: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_tax_percentage: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_tax_price: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_sac_code_id: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_sac_code: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    service_charge_sac_code_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    commi_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    commi_value: {
        type: DataTypes.DOUBLE(5,2),
        allowNull: false,
        defaultValue: 0.00
    },
    rounding: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    level: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    direction: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    company_share_type: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    company_share_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    partner_share_type: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    partner_share_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    driver_share_type: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    driver_share_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    currency_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    coupon_type: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    coupon_value: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    conversion_rate: {
        type: DataTypes.DOUBLE(5,2),
        allowNull: true
    },
    driver_advance: {
        type: DataTypes.DOUBLE(10,2),
        allowNull: false,
        defaultValue: 0.00
    },
    advance_from_customer: {
        type: DataTypes.DOUBLE(10,2),
        allowNull: false,
        defaultValue: 0.00
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'quotation_estimation',
    timestamps: false,
    freezeTableName: true,
});

export default QuotationEstimation;