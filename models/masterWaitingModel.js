import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';


const MasterWaiting = sequelize.define('MasterWaiting', {
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
    tableName: 'master_waiting',
    timestamps: false,
    freezeTableName:true
});

export default MasterWaiting;