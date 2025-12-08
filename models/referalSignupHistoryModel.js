import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const ReferralSignupHistory = sequelize.define('referral_signup_history', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    referer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    referer_point: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_point: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    modified: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'referral_signup_history',
    timestamps: false,
});

export default ReferralSignupHistory;