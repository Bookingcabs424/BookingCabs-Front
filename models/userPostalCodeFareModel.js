// models/UserPostalcodeFare.js

import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const UserPostalcodeFare = sequelize.define('UserPostalcodeFare', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    booking_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    pickup_postcode: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    drop_postcode: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING(10),
      allowNull: false,
      get() {
        // Convert string price to number when accessed
        const value = this.getDataValue('price');
        return value ? parseFloat(value) : null;
      },
      set(value) {
        // Convert number to string when saving
        this.setDataValue('price', value.toString());
      }
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '0-Inactive, 1-Active, 2-Deleted'
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'user_postalcode_fare',
    timestamps: false, // Using custom timestamp fields
    underscored: true,
    comment: 'User postal code fare information'
  });

    // Add other associations as needed

  export default UserPostalcodeFare;
