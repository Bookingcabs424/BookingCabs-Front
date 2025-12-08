import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterCountry = sequelize.define('master_country', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'master_country', 
    timestamps: false, 
});

export default  MasterCountry;