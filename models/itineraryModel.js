import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const Itinerary = sequelize.define('Itinerary', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    itinerary_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  }, {
    tableName: 'itinerary',
    timestamps: false,
    updatedAt: 'modified_date',
    createdAt: false,
    freezeTableName: true,
  });

  export default Itinerary;

