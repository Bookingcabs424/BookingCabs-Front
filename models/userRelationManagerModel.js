import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserRelationManager = sequelize.define("UserRelationManager", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "user_relation_manager",
    timestamps: false
});

export default UserRelationManager;