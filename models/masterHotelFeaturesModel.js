import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterHotelFeatures = sequelize.define('master_hotel_features', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    
    type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "master_hotel_feature_type",
            key: "id"
        }
    },
    
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },


    created_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "id"
        }
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "id"
        }
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1, 
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true
    }
  
}, {
    tableName: 'master_hotel_features', 
    timestamps: false, 
});

export default MasterHotelFeatures;