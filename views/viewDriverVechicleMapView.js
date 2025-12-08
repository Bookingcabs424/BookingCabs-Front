import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const ViewDriverVehicleMap = sequelize.define(
    "view_driver_vehicle_map",
    {
        user_id: { type: DataTypes.INTEGER },
        gcm_id: { type: DataTypes.INTEGER },
        driver_name: { type: DataTypes.STRING },
        company_id: { type: DataTypes.INTEGER },
        vendor_id: { type: DataTypes.INTEGER },
        mobile: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        state_name: { type: DataTypes.STRING },
        state_id: { type: DataTypes.INTEGER },
        city_name: { type: DataTypes.STRING },
        city_id: { type: DataTypes.INTEGER },
        driver_status: { type: DataTypes.INTEGER },
        mapping_id: { type: DataTypes.INTEGER },
        vehicle_type: { type: DataTypes.STRING },
        vehicle_type_color: { type: DataTypes.STRING },
        vehicle_type_id: { type: DataTypes.INTEGER },
        vehicle_name: { type: DataTypes.STRING },
        vehicle_model_id: { type: DataTypes.INTEGER },
        vehicle_color: { type: DataTypes.STRING },
        vehicle_master_id: { type: DataTypes.INTEGER },
        created_by: { type: DataTypes.INTEGER },
        vehicle_no: { type: DataTypes.STRING },
        model_year: { type: DataTypes.INTEGER },
        color: { type: DataTypes.STRING },
        vehicle_owner_type: { type: DataTypes.STRING },
        owner_name: { type: DataTypes.STRING },
        owner_mobile: { type: DataTypes.STRING },
        permit_expiry_date: { type: DataTypes.DATE },
        passenger: { type: DataTypes.INTEGER },
        large_suitcase: { type: DataTypes.INTEGER },
        small_suitcase: { type: DataTypes.INTEGER },
        fuel_type: { type: DataTypes.STRING },
    },
    {
        tableName: "view_driver_vehicle_map",
        timestamps: false,
    }
);

export default ViewDriverVehicleMap;