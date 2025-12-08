import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const SmsApi = sequelize.define(
  "sms_apis",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    api_name: { 
      type: DataTypes.STRING,
    },
    api_title: {
      type: DataTypes.STRING, // 'twilio', 'sns', 'valueFirst', 'messagebird'
    },
    api_username: {
      type: DataTypes.STRING,
    },
    api_password: {
      type: DataTypes.STRING,
    },
    api_sender_id: {
      type: DataTypes.STRING,
    },
    api_base_uri: {
      type: DataTypes.STRING,
    },
    api_ts_code: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    // created_by: {
    //   type: DataTypes.BOOLEAN,
    // },
    // modified_by: {
    //   type: DataTypes.INTEGER,
    // },
    // isActive: {
    //   type: DataTypes.BOOLEAN,
    // },
    ip: {
      type: DataTypes.BOOLEAN,
    },
    // isDeleted: {
    //   type: DataTypes.BOOLEAN,
    // },
    // provider: {
    //   type: DataTypes.STRING, 
    // },
    // api_sid: {
    //   type: DataTypes.STRING, // for Twilio
    // },
    // api_token: {
    //   type: DataTypes.STRING, // for Twilio
    // },
    // api_key: {
    //   type: DataTypes.STRING, // for AWS SNS or MessageBird
    // },
    // api_secret: {
    //   type: DataTypes.STRING, // for AWS SNS
    // },
    // api_region: {
    //   type: DataTypes.STRING, // for AWS SNS
    // },
    
  },
  {
    timestamps: false,
    tableName: "sms_api",
    freezeTableName:true,
    createdAt: "created_on",
    updatedAt: "modified_on",
  }
);

export default SmsApi;
