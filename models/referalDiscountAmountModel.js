import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const ReferralDiscountAmount = sequelize.define('referral_discount_amount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    booking_amount_percent: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    installation_amount_referer: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    installation_amount_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    user_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'referral_discount_amount', 
    timestamps: false, 
});

export default ReferralDiscountAmount;