import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
  const Booking = sequelize.define('Booking', {
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
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    package_id: DataTypes.INTEGER,
    master_package_mode_id: DataTypes.INTEGER,
    master_package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pickup_type: DataTypes.STRING(50),
    outstation_module_type: DataTypes.TINYINT,
    master_vehicle_type_id: DataTypes.INTEGER,
    base_vehicle_id: DataTypes.INTEGER,
    vehicle_master_id: DataTypes.INTEGER,
    ignition_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    coupon_id: DataTypes.INTEGER,
    route_id: DataTypes.INTEGER,
    csr_id: DataTypes.STRING(50),
    is_corportate: DataTypes.BOOLEAN,
    is_account: DataTypes.BOOLEAN,
    is_updation_allow: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'TRUE',
    },
    no_of_vehicles: DataTypes.INTEGER,
    flight_number: DataTypes.STRING(50),
    flight_time: DataTypes.STRING(20),
    airport: DataTypes.INTEGER,
    company: DataTypes.STRING(200),
    priority: DataTypes.STRING(50),
    app_client: DataTypes.TEXT,
    partner: DataTypes.INTEGER,
    customer_type: DataTypes.STRING(100),
    charge_type: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    device_type: DataTypes.STRING(50),
    sac_code_id: DataTypes.INTEGER,
    sac_code: DataTypes.STRING(50),
    sac_description: DataTypes.TEXT,
    reason: DataTypes.STRING(255),
    remark: DataTypes.STRING(255),
    driver_note: DataTypes.TEXT,
    client_note: DataTypes.TEXT,
    features: DataTypes.TEXT,
    user_feedback: DataTypes.TEXT,
    reschedule_date: DataTypes.DATE,
    booking_date: DataTypes.DATE,
    booking_release_date: DataTypes.DATE,
    filter_data: DataTypes.TEXT,
    preferred_booking: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'LEISURE',
    },
    placcard_name: DataTypes.STRING(255),
    pickup_point: DataTypes.TEXT,
    inclusions_data: DataTypes.TEXT('long'),
    exclusions_data: DataTypes.TEXT('long'),
    fare_rule_data: DataTypes.TEXT('long'),
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    booked_by_name:{
      type:DataTypes.STRING,
      allowNull:true
    },
    booked_by_contact:{
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {
    tableName: 'booking',
    timestamps: false,
  });
export default Booking;
