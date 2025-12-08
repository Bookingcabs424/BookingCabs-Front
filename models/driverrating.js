import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const DriverRating = sequelize.define(
  "driver_rating",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    BookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment_desc: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: "driver_rating",
    timestamps: false,
    indexes: [
      {
        name: "DID_index",
        fields: ["DID"],
      },
    ],
  }
);

export default DriverRating;
