import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const CityTollTax = sequelize.define("city_toll_tax", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    base_vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    city_tax: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    toll: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    parking: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: "city_toll_tax",
    timestamps: false
});

export default CityTollTax;