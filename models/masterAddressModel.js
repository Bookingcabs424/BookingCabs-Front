import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";


const MasterAddress = sequelize.define('MasterAddress', {
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
    address: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: 'Not Available',
    },
    zone: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Not Available',
    },
    establishment_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    is_hotel: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'master_address',
    timestamps: false, 
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
});

export default MasterAddress;
