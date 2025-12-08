import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterTourTheme = sequelize.define('master_tour_theme', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    tour_type:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "tour_type",
            key: "id"
        }
    },
    
    
    meta_title: {
        type: DataTypes.STRING,
       
    },

    meta_description: {
        type: DataTypes.STRING,

    },
    meta_keywords: {
        type: DataTypes.STRING,
    
    },
    theme_name: {
        type: DataTypes.STRING,
        allowNull: false,
    
    },
    icon: {
        type: DataTypes.STRING,
    
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
    tableName: 'master_tour_theme', 
    timestamps: false, 
});

export default MasterTourTheme;