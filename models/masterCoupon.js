import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

// models/Coupon.js
  const Coupon = sequelize.define('Coupon', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    master_coupon_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    valid_from_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    valid_to_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    master_week_days_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    master_package_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    minimum_booking_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discount_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    terms_condition: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'master_coupon', 
    timestamps: false 
  });

export default Coupon;