import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const ApiCallInterval = sequelize.define('api_call_timeinterval', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    api_distance: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    api_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    api_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    package_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'api_call_timeinterval',
    timestamps: false,
});

export default ApiCallInterval;