import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const BiddingDataView = sequelize.define(
  "BiddingDataView",
  {
    route_id: {
      type: DataTypes.INTEGER,
      primaryKey:true
    },

    status: {
      type: DataTypes.BOOLEAN,
    },

    base_vehicle_id: {
      type: DataTypes.INTEGER,
    },

    vehicle_type_id: {
      type: DataTypes.INTEGER,
    },

    vehicle_type: {
      type: DataTypes.STRING,
    },
    package_name: {
      type: DataTypes.STRING,
    },
    package_mode: {
      type: DataTypes.STRING,
    },

    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    minimum_charge: {
      type: DataTypes.INTEGER,
    },

    luggage_carrier: {
      type: DataTypes.BOOLEAN,
    },
    minimum_distance: {
      type: DataTypes.INTEGER,
    },
    per_km_charge: {
      type: DataTypes.INTEGER,
    },
    currency: {
      type: DataTypes.BOOLEAN,
    },
    from_date: {
      type: DataTypes.STRING,
    },
    to_date: {
      type: DataTypes.STRING,
    },
    created_date: {
      type: DataTypes.STRING,
    },

    night_rate_begins: {
      type: DataTypes.TIME,
    },
    night_rate_ends: {
      type: DataTypes.TIME,
    },
    driver_allowance: {
      type: DataTypes.STRING,
    },

    toll: {
      type: DataTypes.INTEGER,
    },

    parking: {
      type: DataTypes.INTEGER,
    },
    city_distance_id: {
      type: DataTypes.INTEGER,
    },
    distance_km: {
      type: DataTypes.INTEGER,
    },
    source_city_id: {
      type: DataTypes.INTEGER,
    },
    source_city_name: {
      type: DataTypes.STRING,
    },
    source_state_name: {
      type: DataTypes.STRING,
    },
    source_country_code: {
      type: DataTypes.STRING,
    },
    destination_city_id: {
      type: DataTypes.INTEGER,
    },
    destination_city_name: {
      type: DataTypes.STRING,
    },
    destination_state_name: {
      type: DataTypes.STRING,
    },
    destination_country_code: {
      type: DataTypes.STRING,
    },
    start_time: {
      type: DataTypes.TIME,
    },
    end_time: {
      type: DataTypes.TIME,
    },
  },
  {
    tableName: "view_bidding_data",
    timestamps: false,
  }
);

export default BiddingDataView;
