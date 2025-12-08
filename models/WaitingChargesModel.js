import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
const WaitingCharge = sequelize.define('WaitingCharges', {
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
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
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
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },
    waiting_fees: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    waiting_minute_upto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    tableName: 'waiting_charge',
    timestamps: false,
});

export default WaitingCharge;