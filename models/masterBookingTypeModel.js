import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";


const MasterBookingType = sequelize.define('MasterBookingType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    booking_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    menu_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
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
    ip: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: 'master_booking_type',
    timestamps: false,
    freezeTableName: true,
    indexes: [
        { fields: ['booking_type'] },
        { fields: ['status'] },
    ],
});

export default MasterBookingType;