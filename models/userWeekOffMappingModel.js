import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserWeekOffMapping = sequelize.define("user_weekoff_mapping", {
    user_weekoff_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    week_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modify_date: {
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
    tableName: "user_weekoff_mapping",
    timestamps: false,
});

export default UserWeekOffMapping;