import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterPackage = sequelize.define('master_package', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    booking_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    package_mode_id: {
        type: DataTypes.INTEGER,
     
        references: {
            model: "master_package_mode",
            key: "id"
        }
    },
    package_type_id: {
        type: DataTypes.INTEGER,
      
        references: {
            model: "master_package_type",
            key: "id"
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'master_package', 
    timestamps: false, 
});

export default MasterPackage;