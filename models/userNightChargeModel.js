import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

  const UserNightCharge = sequelize.define('UserNightCharge', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    booking_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    night_rate_begins: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '00:00:00'
    },
    night_rate_ends: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '00:00:00'
    },
    night_rate_type: {
      type: DataTypes.STRING(10),
      comment: '1-%,2-Value'
    },
    night_rate_value: {
      type: DataTypes.STRING(10),
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
      type: DataTypes.DATEONLY,
      allowNull: false
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
      type: DataTypes.STRING(20)
    }
  }, {
    tableName: 'user_night_charge',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id', 'booking_type', 'status']
      }
    ]
  });

export default UserNightCharge;