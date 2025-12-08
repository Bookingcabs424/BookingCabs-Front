import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

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
        unique: false,
    },
    is_applied: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    is_used: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    device_type: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    app_type: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'coupon_statistics',
    timestamps: false,
});

export default CouponStatistics;