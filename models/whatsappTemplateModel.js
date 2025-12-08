// models/MessageTemplate.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js'; 

const WhatsAppTemplate = sequelize.define(
  'whatsapp_templates',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    template_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    template_category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    language_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'en',
    },
    header_type: {
      type: DataTypes.ENUM('TEXT', 'MEDIA', 'DOCUMENT', 'VIDEO', 'IMAGE'),
      allowNull: true,
      defaultValue: 'TEXT',
    },
    header_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    body_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    footer_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: true,
      defaultValue: 'PENDING',
    },
    lead_type: {
      type: DataTypes.ENUM('local', 'outstation', 'one way'),
      defaultValue: 'local'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'whatsapp_templates',
    timestamps: false, 
    underscored: true,
  }
);

export default WhatsAppTemplate;
