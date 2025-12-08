import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const CampaignMaster = sequelize.define(
  "campaign_master",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      
    },
    company_id: {
      type: DataTypes.INTEGER,
    },
    campaign_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_ids: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: []
    },
    user_type_id: {
      type: DataTypes.INTEGER
    },
    list_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    launch_status: {
      type: DataTypes.ENUM("Pending", "Scheduled", "Launched", "Failed"),
      defaultValue: "Pending",
    },
    generate_url: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    launch_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    recipients: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "campaign_master",
    timestamps: false,
  }
);

export default CampaignMaster;  
