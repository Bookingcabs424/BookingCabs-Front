import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const MasterSacCode = sequelize.define('MasterSacCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    country_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 101,
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    booking_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    charge_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'BASIC',
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    sgst: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    cgst: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    igst: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
    ip: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
}, {
    tableName: 'master_sac_code',
    timestamps: false,
    freezeTableName: true,
    indexes: [
        { fields: ['status'] },
    ],
});

export default MasterSacCode;