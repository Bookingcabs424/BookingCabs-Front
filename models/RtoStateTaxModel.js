import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';



const RtoStateTax = sequelize.define('RtoStateTax', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    vehicle_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    period_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    amount: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null,
    },
    seating_capacity: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    currency: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    created_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },
    ip: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: 'rto_state_taxes',
    timestamps: false,
    updatedAt: 'modified_date',
    createdAt: false,
});

export default RtoStateTax;