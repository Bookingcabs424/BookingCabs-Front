import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";


const AirportRailway = sequelize.define('master_airport_railway', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pickup_type: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: 'DEPARTURE',
    },
    airport_railway_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    meeting_point: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    latitude: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '0.0',
    },
    longitude: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '0.0',
    },
    zone: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue:DataTypes.NOW
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    tableName: 'master_airport_railway',
    timestamps: false,
    // updatedAt: 'modified_date',
    createdAt: false,
    freezeTableName:true
});
export default AirportRailway