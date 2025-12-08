// models/ViewVehicleFareDetails.ts
import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

  const ViewVehicleFareDetails = sequelize.define('ViewVehicleFareDetails', {
    base_combination_id: DataTypes.INTEGER,
    bs_status: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    vendor_id: DataTypes.INTEGER,
    company_setup_name: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    country_name: DataTypes.INTEGER,
    state_id: DataTypes.INTEGER,
    state_name: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    city_name: DataTypes.INTEGER,
    master_package_id: DataTypes.INTEGER,
    package_name: DataTypes.INTEGER,
    master_package_mode_id: DataTypes.INTEGER,
    package_mode: DataTypes.INTEGER,
    date_from: DataTypes.INTEGER,
    date_to: DataTypes.INTEGER,
    rate_type: DataTypes.INTEGER,
    rate_value: DataTypes.INTEGER,
    week_days: DataTypes.INTEGER,
    vendor_name: DataTypes.INTEGER,
    client_name: DataTypes.INTEGER,
    vehicle_type: DataTypes.INTEGER,
    dispatch_location_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    base_comb_id: DataTypes.INTEGER,
    type_of_dispatch: DataTypes.INTEGER,
    garage_type: DataTypes.INTEGER,
    address: DataTypes.INTEGER,
    city: DataTypes.INTEGER,
    pincode: DataTypes.INTEGER,
    created_date: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    distance_minimum_charge: DataTypes.INTEGER,
    distance_minimum_distance: DataTypes.INTEGER,
    distance_per_km_charge: DataTypes.INTEGER,
    hourly_minimum_charge: DataTypes.INTEGER,
    hourly_minimum_hrs: DataTypes.INTEGER,
    hourly_per_hr_charge: DataTypes.INTEGER,
    dist_waiting_minimum_charge: DataTypes.INTEGER,
    dist_waiting_minimum_distance: DataTypes.INTEGER,
    dist_waiting_per_km_charge: DataTypes.INTEGER,
    dist_waiting_waiting_fees: DataTypes.INTEGER,
    dist_hour_minimum_charge: DataTypes.INTEGER,
    dist_hour_minimum_distance: DataTypes.INTEGER,
    dist_hour_minimum_hrs: DataTypes.INTEGER,
    dist_hour_per_km_charge: DataTypes.INTEGER,
    dist_hour_per_hr_charge: DataTypes.INTEGER,
    company_share_type: DataTypes.INTEGER,
    company_share: DataTypes.INTEGER
  }, {
    tableName: 'view_vehicle_fare_details',
    timestamps: false,
    id: false,
    primaryKey: 'base_combination_id'

  });
  export default ViewVehicleFareDetails


