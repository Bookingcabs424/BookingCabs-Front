import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterCity = sequelize.define('master_city', {
    activity: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    airport_transfer: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    country_latitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country_longitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currency_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    flag_icon: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    local_hire: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    north_east_latitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    north_east_longitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    one_way: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    outstation: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    phone_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    point_to_point: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    radius: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    south_west_latitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    south_west_longitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    timezones: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    transport_package: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'master_city', 
    timestamps: false, 
});

export default MasterCity;