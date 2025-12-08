import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const Packages = sequelize.define('Packages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    nri_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    other_charge: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    package_name: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    total_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'packages', 
    timestamps: false, 
});

export default Packages;