// models/coupon_statistics.js

import { fr } from "date-fns/locale";
import sequelize from "../config/clientDbManager.js";
import { DataTypes } from "sequelize";

  const CouponStatistics = sequelize.define('CouponStatistics', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    master_coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_applied: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_used: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    device_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    app_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'coupon_statistics',
    timestamps: false,
    freezeTableName: true,
    // indexes: [
    //   {
    //     fields: ['user_id'],
    //   },
    // ],
  });

export default CouponStatistics;