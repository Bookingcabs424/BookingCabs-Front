import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import BaseVehicleType from "./baseVehicleTypeModel.js";

const MasterVehicleType = sequelize.define('master_vehicle_type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amenities: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    luggage: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    seating_capacity: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vehicle_image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    vehicle_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'master_vehicle_type',
    timestamps: false,
});

export default MasterVehicleType;
