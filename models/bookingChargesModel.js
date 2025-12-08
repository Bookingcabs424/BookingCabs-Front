import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BookingCharges = sequelize.define('booking_charges', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    BookingID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    waitingCharge: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '0',
    },
    tripCharge: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    minimumCharge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    totalBill: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
    },
    discount_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    AddedTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    is_paid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    balance_amt: {
        type: DataTypes.DOUBLE(10,2),
        allowNull: false,
        defaultValue: 0.00,
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    currency: {
        type: DataTypes.STRING(11),
        allowNull: false,
        defaultValue: 'USD',
    },
    invoice_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
    },
    payment_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
    },
    fees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_tax_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    distance_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    duration_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    starting_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    base_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    tax_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    starting_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    distance_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    duration_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    minimum_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    cancellation_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    companyshare: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    drivershare: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    partnershare: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    minimum_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    extracharges: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    toll_tax: {
        type: DataTypes.DOUBLE(5,2),
        allowNull: false,
        defaultValue: 0.00,
    },
    state_tax: {
        type: DataTypes.DOUBLE(5,2),
        allowNull: false,
        defaultValue: 0.00,
    },
    nightcharge_unit: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null,
    },
    nightcharge: {
        type: DataTypes.STRING(5),
        allowNull: true,
        defaultValue: null,
    },
    nightcharge_price: {
        type: DataTypes.STRING(5),
        allowNull: false,
        defaultValue: '0',
    },
    night_rate_begins: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: '00:00:00',
    },
    night_rate_ends: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: '00:00:00',
    },
    extras: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    extraPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    peak_time_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
    },
    peak_time_value: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    basic_tax: {
        type: DataTypes.STRING(5),
        allowNull: true,
        defaultValue: null,
    },
    basic_tax_type: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null,
    },
    basic_tax_price: {
        type: DataTypes.STRING(5),
        allowNull: true,
        defaultValue: '0',
    },
    pre_waiting_time: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null,
    },
    pre_waiting_charge: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    waiting_time: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null,
    },
    waiting_charge: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    cgst_tax: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    igst_tax: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    sgst_tax: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    estimated_price_before_markup: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    markup_type: {
        type: DataTypes.STRING(5),
        allowNull: true,
        defaultValue: null,
    },
    markup_value: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    markup_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    driver_share_amt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    comp_share_amt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    partner_share_amt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    coupon_type: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null,
    },
    coupon_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    conversion_rate: {
        type: DataTypes.DOUBLE(5,2),
        allowNull: true,
        defaultValue: null,
    },
    driver_advance: {
        type: DataTypes.DOUBLE(10,2),
        allowNull: false,
        defaultValue: 0.00,
    },
    advance_from_customer: {
        type: DataTypes.DOUBLE(10,2),
        allowNull: false,
        defaultValue: 0.00,
    },
    starting_meter: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
    },
    closing_meter: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
    },
    start_time: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '00:00:00',
    },
    end_time: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '00:00:00',
    },
    total_running_time: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: '00:00:00',
    },
    starting_meter_image: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    closing_meter_image: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    client_signature: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    parking_image: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    toll_image: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    extra_image: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    client_image: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    service_charge: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '0',
    },
    estimated_price_before_discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    local_estimateprice_before_discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    local_discount_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    min_per_km_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    min_per_hr_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    min_minimum_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    premiums_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '0',
    },
    premiums_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    premiums_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    booking_cancellation_rule: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    price_before_tax: {
        type: DataTypes.DOUBLE(25,2),
        allowNull: false,
        defaultValue: 0.00,
    },
    cgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    sgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    igst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_charge_cgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_charge_sgst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_charge_igst_amount: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_charge_cgst: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_charge_sgst: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_charge_igst: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_tax_price: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_charge_sac_code_id: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_charge_sac_code: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null,
    },
    service_charge_sac_code_description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    commi_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    commi_value: {
        type: DataTypes.DOUBLE(5,2),
        allowNull: false,
        defaultValue: 0.00,
    },
    rounding: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null,
    },
    level: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null,
    },
    direction: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null,
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: 'booking_charges',
    timestamps: false,
});

export default BookingCharges;