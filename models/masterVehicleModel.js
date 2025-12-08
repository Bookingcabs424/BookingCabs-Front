import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterVehicle = sequelize.define(
  "master_vehicle_model",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    aircondition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    luggage_capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    person_capacity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    small_suitcase: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vehicle_type_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      left_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    right_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    front_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    back_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    interior_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    no_of_airbags: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    no_of_doors: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
    // amenties: {
    //   type: DataTypes.STRING,
    //   allownull: true,
    // },
    // amenities_id: {
    //   type: DataTypes.STRING,
    //   allownull: true,
    // },
  },
  {
    tableName: "master_vehicle_model",
    timestamps: false,
  }
);

export default MasterVehicle;
