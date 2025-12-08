import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import bcrypt from "bcryptjs";
import UserLoginHistory from "./userLoginHistoryModel.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
      allowNull: false,
      // unique: true,
    },
    mobile_prefix: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
      // unique: true,
    },
    city: {
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING,
    },
    user_type_id: {
      type: DataTypes.INTEGER,
    },
    nationality: {
      type: DataTypes.INTEGER,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    modified_by: {
      type: DataTypes.INTEGER,
    },
    refer_by: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.ENUM(1, 2, 3, 4, 5, 6),
    },
    referral_key: {
      type: DataTypes.STRING,
    },
    accept_fare: {
      type: DataTypes.INTEGER,
    },
    newsletter_subscription: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    agreement_subscription: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mobile_verfication: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    username: {
      type: DataTypes.STRING,
    },
    active_by: {
      type: DataTypes.INTEGER,
    },
    company_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    duty_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gcm_id: {
      type: DataTypes.STRING,
    },
    login_otp_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    login_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
      defaultValue: false,
    },
    refer_by: {
      type: DataTypes.STRING,
    },
    signup_status: {
      type: DataTypes.INTEGER,
      defaultValue: false,
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_grade: {
      type: DataTypes.STRING,
    },
    user_type_id: {
      type: DataTypes.INTEGER,
    },
    wallet_point: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    wallet_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    is_guest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_profile_path: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.ENUM(1, 2, 3, 4, 5, 6),
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female"),
    },
  },
  {
    timestamps: true,
    createdAt: "created_on",
    updatedAt: "modified_on",
    tableName: "user",
    indexes: [
      {
        unique: true,
        fields: ["email", "mobile", "user_type_id"],
      },
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);
// username changes need to added
User.associate = (models) => {
  User.hasMany(models.UserLoginHistory, {
    foreignKey: "userId",
    as: "loginHistories",
  });
};

User.prototype.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

export default User;
