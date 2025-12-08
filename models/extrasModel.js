// models/Extras.js

import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

    const Extras = sequelize.define('Extras', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        base_vehicle_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        extras_master_id: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        extra_value_type: {
            type: DataTypes.STRING(10),
            allowNull: true, // Nullable
            defaultValue: null
        },
        extra_value: {
            type: DataTypes.INTEGER,
            allowNull: true, // Nullable
            defaultValue: null
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        modified_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
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
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        ip: {
            type: DataTypes.STRING(20),
            defaultValue:"0",
            allowNull: false
        }
    }, {
        freezeTableName:true,

        tableName: 'extras',
        timestamps: false,
        underscored: true
    });

    export default Extras;

