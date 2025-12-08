import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const Quotation = sequelize.define('quotation', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    itinerary_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    reference_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
    },
    agent_reference: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    status_c: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    booking_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    package_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    master_package_mode_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    master_package_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pickup_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    outstation_module_type: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    master_vehicle_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    base_vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    vehicle_master_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    ignition_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
    },
    coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    route_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    csr_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    is_corportate: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
    },
    is_account: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
    },
    is_updation_allow: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'TRUE',
    },
    no_of_vehicles: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    flight_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    flight_time: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    airport: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    company: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    priority: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    app_client: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    partner: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    customer_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    charge_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
    },
    device_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    sac_code_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sac_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    sac_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    driver_note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    client_note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    features: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    user_feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    reschedule_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    booking_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    booking_release_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    filter_data: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    preferred_booking: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'LEISURE',
    },
    placcard_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    pickup_point: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    inclusions_data: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    exclusions_data: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    fare_rule_data: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        degfaultValue: DataTypes.NOW,
    },
    updated_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    quotation_status: {
        type: DataTypes.ENUM('1', '2'),
        allowNull: false,
        defaultValue: '1',
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    timestamps: false,
    tableName: 'quotation',
    freezeTableName: true,
});

export default Quotation;