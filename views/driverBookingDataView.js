import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const DriverBookingDataView = sequelize.define(
    "booking_with_api_data",
    {
        booking_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        reference_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        api_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        api_distance: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    },
    {
        tableName: "booking_with_api_data",
        timestamps: false,
    }
);

export default DriverBookingDataView;
