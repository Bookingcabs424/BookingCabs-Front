import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const VehicleMaster = sequelize.define(
  "vehicle_master",
  {
    vehicle_master_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fitness_validity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ignition_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insurance_validity: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    large_suitcase: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    luggage_carrier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    passenger: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permit_exp_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rc_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    small_suitcase: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    vehicle_ac_nonac: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_owner_mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_owner_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_owner_type: {
      type: DataTypes.ENUM("Owned"),
      allowNull: true,
    },
    id: {
      type: DataTypes.INTEGER,
    },
    owner_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reg_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    chassis_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    engine_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insurance_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    policy_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    policy_issue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    premium_amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover_amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rto_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rto_tax_efficiency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rto_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fitness_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    auth_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    auth_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    speed_governor_detail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    speed_governor_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    puc_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    puc_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    permit_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    permit_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vehicle_left_image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_right_image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_front_image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_back_image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "vehicle_master",
  }
);

export default VehicleMaster;
