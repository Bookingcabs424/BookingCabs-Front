import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const QuotationPickDropDetails = sequelize.define('QuotationPickDropDetails', {
    pickdrop_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    adults: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    childs: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    luggages: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    smallluggage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    pickup_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    pickup_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    pickup_area: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    pickup_address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    pickup_country: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    pickup_state: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    pickup_city: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    pickup_latitude: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    pickup_longitude: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    pickup_zone: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    drop_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    drop_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    drop_area: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    drop_address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    drop_country: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    drop_state: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    drop_city: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    drop_latitude: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    drop_longitude: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    drop_zone: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    pickup_landmark: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    drop_landmark: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'quotation_pickdrop_details',
    timestamps: false
});
export default QuotationPickDropDetails;