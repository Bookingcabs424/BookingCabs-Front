import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserProfileView = sequelize.define(
  // "UserProfileView",
  "vw_user_profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    mobile_prefix: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    user_type_id: {
      type: DataTypes.INTEGER,
    },
    nationality: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    referral_key: {
      type: DataTypes.STRING,
    },
    accept_fare: {
      type: DataTypes.BOOLEAN,
    },
    newsletter_subscription: {
      type: DataTypes.BOOLEAN,
    },
    agreement_subscription: {
      type: DataTypes.BOOLEAN,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
    },
    mobile_verfication: {
      type: DataTypes.BOOLEAN,
    },
    parent_id: {
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
    },
    active_by: {
      type: DataTypes.INTEGER,
    },
    company_id: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE,
    },
    duty_status: {
      type: DataTypes.STRING,
    },
    gcm_id: {
      type: DataTypes.STRING,
    },
    login_otp_status: {
      type: DataTypes.BOOLEAN,
    },
    login_status: {
      type: DataTypes.BOOLEAN,
    },
    login_time: {
      type: DataTypes.DATE,
    },
    login_timezone: {
      type: DataTypes.STRING,
    },
    logout_time: {
      type: DataTypes.DATE,
    },
    mobile_promotion: {
      type: DataTypes.BOOLEAN,
    },
    refer_by: {
      type: DataTypes.INTEGER,
    },
    signup_status: {
      type: DataTypes.INTEGER,
    },
    updated_date: {
      type: DataTypes.DATE,
    },
    user_grade: {
      type: DataTypes.STRING,
    },
    wallet_point: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
    },
    address2: {
      type: DataTypes.STRING,
    },
    alternate_email: {
      type: DataTypes.STRING,
    },
    alternate_mobile: {
      type: DataTypes.STRING,
    },
    external_ref: {
      type: DataTypes.STRING,
    },
    city_id: {
      type: DataTypes.INTEGER,
    },
    country_id: {
      type: DataTypes.INTEGER,
    },
    dob: {
      type: DataTypes.DATE,
    },
    father_name: {
      type: DataTypes.STRING,
    },
    gst_registration_number: {
      type: DataTypes.STRING,
    },
    kyc: {
      type: DataTypes.STRING,
    },
    kyc_type: {
      type: DataTypes.STRING,
    },
    landline_number: {
      type: DataTypes.STRING,
    },
    pincode: {
      type: DataTypes.STRING,
    },
    state_id: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.STRING,
    },
    user_profile_path: {
      type: DataTypes.STRING,
    },
    city_name: {
      type: DataTypes.STRING,
    },
    state_name: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    pending_doc:{
      type: DataTypes.BOOLEAN,
    },
    user_type: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "vw_user_profile",
    timestamps: false,
  }
);

export default UserProfileView;
