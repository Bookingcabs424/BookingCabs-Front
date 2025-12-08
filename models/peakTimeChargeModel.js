import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

// models/PeakTimeCharge.
    const PeakTimeCharge = sequelize.define('PeakTimeCharge', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        base_vehicle_id: {
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
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: '%'
        },
        peaktime_value: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modified_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            // Sequelize does not support ON UPDATE CURRENT_TIMESTAMP in model. Keep that in DB schema.
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('1', '0'),
            allowNull: false,
            defaultValue: '1'
        },
        ip: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue:"127.0.1"
        }
    }, {
        freezeTableName:true,

        tableName: 'peak_time_charge',
        timestamps: false,
        underscored: true
    });

    export default PeakTimeCharge;

