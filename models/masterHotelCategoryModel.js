import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterHotelCategory = sequelize.define('master_hotel_category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    
    
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: true 
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
    tableName: 'master_hotel_category', 
    timestamps: false, 
});

export default MasterHotelCategory;