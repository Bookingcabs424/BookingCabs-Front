import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

    const UserPeakTimeCharge = sequelize.define('UserPeakTimeCharge', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        booking_type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        peaktime_type: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        peaktime_value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        created_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ip: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        tableName: 'user_peak_time_charge',
        timestamps: false,
        underscored: true
    });
export default UserPeakTimeCharge