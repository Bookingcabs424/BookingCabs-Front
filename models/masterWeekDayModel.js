import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const MasterWeekDay = sequelize.define('MasterWeekDay', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    day_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    tableName: 'master_week_days',
    timestamps: false,
});

export default MasterWeekDay;