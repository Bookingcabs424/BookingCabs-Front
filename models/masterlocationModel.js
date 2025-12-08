import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const MasterLocation = sequelize.define('master_location', {
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
        allowNull: true,
        defaultValue: null,
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
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
    area: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'Not Available',
    },
    zone: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Not Available',
    },
}, {
    tableName: 'master_location',
    timestamps: false, // Set to true if you have createdAt and updatedAt fields
});

export default MasterLocation;