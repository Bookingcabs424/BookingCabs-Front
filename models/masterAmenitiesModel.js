import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterAmenities = sequelize.define("master_amenities", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amenities_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amenities_icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false
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
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: "master_amenities",
    timestamps: false
});

export default MasterAmenities;