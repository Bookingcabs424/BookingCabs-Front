import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserDutyPreference = sequelize.define('user_duty_pref', {
    user_duty_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    package_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },


}, {
    tableName: 'user_duty_pref',
    timestamps: false, 
});

export default UserDutyPreference;