import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

  const UserPremiumsFare = sequelize.define('UserPremiumsFare', {
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
    premiums_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: '1-%,2-Value'
    },
    premiums_value: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
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
      defaultValue: 1
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'user_premiums_fare',
    timestamps: false, // Using custom timestamp fields
    underscored: true,
    freezeTableName:true,
    comment: 'User premium fare information'
  });

export default UserPremiumsFare
 