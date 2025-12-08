import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterPackageMode = sequelize.define('master_package_mode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    package_mode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'master_package_mode', 
    timestamps: false,
});

export default MasterPackageMode;