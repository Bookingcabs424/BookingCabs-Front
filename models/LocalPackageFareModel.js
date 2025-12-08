// models/LocalPackageFare.js
import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const LocalPackageFare = sequelize.define(
  "LocalPackageFare",
  {
    local_pkg_fare_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    local_pkg_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    local_pkg_fare: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "local_package_fare",
    underscored: true, // use snake_case for column names
    freezeTableName: true, // prevent Sequelize from pluralizing the table name
    timestamps: false, // disable Sequelize's auto timestamps
  }
);

export default LocalPackageFare;
