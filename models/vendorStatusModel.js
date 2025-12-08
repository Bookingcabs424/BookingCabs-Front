import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const VendorStatus = sequelize.define('vendor_status', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    booking_id: {
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
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    estimated_end_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    self_reference: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    started_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    vendor_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'vendor_status',
    timestamps: false,
});

export default VendorStatus;