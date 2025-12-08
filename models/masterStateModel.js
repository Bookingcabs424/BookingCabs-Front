import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterState = sequelize.define('master_state', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'master_state', 
    timestamps: false, 
});

export default  MasterState;