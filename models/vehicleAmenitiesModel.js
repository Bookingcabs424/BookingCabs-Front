import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
const VehicleAmenities = sequelize.define("vehicle_amenities", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    vehicle_master_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amenities_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "vehicle_amenities",
    timestamps: false
});

export default VehicleAmenities;