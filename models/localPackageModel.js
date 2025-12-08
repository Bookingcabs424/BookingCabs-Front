import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const LocalPackage = sequelize.define('local_package', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    booking_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    booking_mode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    hrs: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    km: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    tableName: 'local_package',
    timestamps: false, // Set to true if you have `createdAt` and `updatedAt` columns
});
LocalPackage.sync({alter:true})
export default LocalPackage;