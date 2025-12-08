import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const MasterCurrency = sequelize.define('MasterCurrency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  country_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  exchange_rate: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  symbol: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fa_icon: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(10),
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
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ip: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  is_active: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'master_currency',
  timestamps: false, 
  freezeTableName: true, // Prevent pluralization
  hooks: {
    beforeUpdate: (instance) => {
      instance.modified_date = new Date();
    }
  }
});

export default MasterCurrency;