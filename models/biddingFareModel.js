
import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BiddingFare = sequelize.define("BiddingFare", {
    accumulated_instance: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    base_vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_from: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    date_to: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    luggage_carrier: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minimum_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    minimum_distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    per_km_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    round_up_km: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
    },
}, {
    tableName: "bidding_fare",
    timestamps: false,
});

export default BiddingFare;