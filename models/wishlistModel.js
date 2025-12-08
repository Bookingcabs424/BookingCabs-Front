// models/MessageTemplate.js
import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const Wishlist = sequelize.define(
  "wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pref_city: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    entry_group: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "wishlist",
    timestamps: false,
  }
);

export default Wishlist;
