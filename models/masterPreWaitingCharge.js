const { DataTypes } = require('sequelize');
const { default: sequelize } = require('../config/clientDbManager');

const MasterPreWaiting = sequelize.define('MasterPreWaiting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: 'pre_waiting_charge',
    timestamps: false,
    freezeTableName:true
});

module.exports = MasterPreWaiting;