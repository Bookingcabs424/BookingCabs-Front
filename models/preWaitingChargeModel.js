// models/PreWaitingCharge.js

import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

   const PreWaitingCharge = sequelize.define('PreWaitingCharge', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        base_vehicle_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pre_waiting_upto_minutes: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        pre_waiting_fees: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false,
            default:DataTypes.NOW
        },
        modified_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: sequelize.literal('CURRENT_TIMESTAMP') // Sequelize doesn't support this directly, see note below
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        ip: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        freezeTableName:true,
        tableName: 'pre_waiting_charge',
        timestamps: false, // Disable default timestamps (createdAt, updatedAt)
        underscored: true
    });

    export default PreWaitingCharge;
