import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const TollTax = sequelize.define('TollTax', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    toll_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    start_city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    end_city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    start_city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    end_city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    route_id: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    road: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tag_cost_daily: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    tag_cost_return: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    tag_cost_montly: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    cash_cost: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    cash_cost_return: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    cash_cost_monthly: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    arrival_distance: {
        type: DataTypes.STRING(25),
        allowNull: true,
    },
    arrival_time: {
        type: DataTypes.STRING(25),
        allowNull: true,
    },
    point_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    point_geometry_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    point_geometry_coordinates_0: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    point_geometry_coordinates_1: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    overview_polyline: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },
    ip: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
}, {
    tableName: 'toll_tax',
    timestamps: false,
});

export default TollTax;