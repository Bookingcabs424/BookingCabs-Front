import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterLanguage = sequelize.define('MasterLanguage', {
    language_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    language_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
}, {
    tableName: 'master_language',
    timestamps: false,
});

export default MasterLanguage;