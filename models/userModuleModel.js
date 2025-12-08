import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserModule = sequelize.define('user_modules', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    key_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    label: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    path: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    app_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'user_modules',
    timestamps: false
});

export default UserModule;