import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const BaseCombination = sequelize.define('base_combination', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date_from: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    date_to: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fare_parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0
    },
    fare_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'NORMAL'
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    market_place: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    master_package_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    master_package_mode_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    rate: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    rate_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rate_value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    status: {
      type: DataTypes.ENUM,
      values: ['0', '1', '2', '3'], 
      allowNull: false
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    week_days: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'base_combination',
    timestamps: false, 
 
    indexes: [
      {
        fields: ['country_id'], 
        name: 'idx_country_id'
      },
      {
        fields: ['state_id'], 
        name: 'idx_state_id'
      },
      {
        fields: ['vendor_id'], 
        name: 'idx_vendor_id'
      }
    ]
  });

export default BaseCombination