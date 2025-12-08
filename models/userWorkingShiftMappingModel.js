import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserWorkingShiftMapping = sequelize.define("user_workingshift_mapping", {
    user_workingshift_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    working_shift_id: {
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
        defaultValue: DataTypes.NOW,
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
    tableName: "user_workingshift_mapping",
    freezeTableName:true,
    timestamps: false,
});

export default UserWorkingShiftMapping;