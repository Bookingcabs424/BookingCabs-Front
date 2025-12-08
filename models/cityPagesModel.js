import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const CityPages = sequelize.define('city_pages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    company_setup_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    image_path: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    master_package_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    meta_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meta_keywords: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meta_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    no_of_hotels: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    no_of_offers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    no_of_sightseeing: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    page_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    page_title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'city_pages', 
    timestamps: false, 
  });


export default CityPages
  