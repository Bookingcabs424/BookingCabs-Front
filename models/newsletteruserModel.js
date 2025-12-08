import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const NewsletterUser = sequelize.define('NewsletterUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  mobile: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  city_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pin_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  email_subscription: {
    type: DataTypes.ENUM('Active', 'In-Active'),
    allowNull: true,
    defaultValue: 'Active',
  },
  mobile_subscription: {
    type: DataTypes.ENUM('Active', 'In-Active'),
    allowNull: false,
    defaultValue: 'Active',
  },
  unsubscribe_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
    charset: 'latin1',
    collate: 'latin1_swedish_ci',
  },
  created_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modified_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  modified_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Unsubscribed', 'Bounced', 'Pending'),
    allowNull: false,
    defaultValue: 'Active',
  },
  ip: {
    type: DataTypes.STRING(20),
    allowNull: false,
  }
}, {
  tableName: 'newsletter_user',
  timestamps: false,
  freezeTableName: true,
});

export default NewsletterUser;
