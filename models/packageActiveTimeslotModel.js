import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const PackageActiveTimeslot = sequelize.define('package_active_timeslot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    base_vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_date: {
        type: DataTypes.NOW(),
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
    // },
    // isDeleted: {
    //     type: DataTypes.BOOLEAN,
    //     allowNull: false,
    //     defaultValue: false,
    // },
}, {
    tableName: 'package_active_timeslot', 
    timestamps: false, 
});

export default PackageActiveTimeslot;