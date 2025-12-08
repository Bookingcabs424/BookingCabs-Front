import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserLanguage = sequelize.define("user_language", {
    user_lang_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    language_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    language_type: {
        type: DataTypes.ENUM("primary", "secondary"),
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modified_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "user_language",
    timestamps: false,
});

export default UserLanguage;