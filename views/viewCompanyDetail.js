import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const ViewCompanyDetail = sequelize.define(
  "ViewCompanyDetail",
  {
    company_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    brand_name: {
      type: DataTypes.STRING,
    },
    city_id: {
      type: DataTypes.INTEGER,
    },
    company_address: {
      type: DataTypes.STRING,
    },
    company_name: {
      type: DataTypes.STRING,
    },
    contact_person_name: {
      type: DataTypes.STRING,
    },
    country_id: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
    },
    landline_no: {
      type: DataTypes.STRING,
    },
    pancard_no: {
      type: DataTypes.STRING,
    },
    pincode: {
      type: DataTypes.STRING,
    },
    service_tax_gst: {
      type: DataTypes.STRING,
    },
    state_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    website_url: {
      type: DataTypes.STRING,
    },
    city_name: {
      type: DataTypes.STRING,
    },
    country_name: {
      type: DataTypes.STRING,
    },
    state_name: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.NUMBER,
    },
    center: {
      type: DataTypes.STRING,
    },
    center_code: {
      type: DataTypes.STRING,
    },
    constitution: {
      type: DataTypes.STRING,
    },
    einvoice_enabled: {
      type: DataTypes.NUMBER,
    },
    expiry_date: {
      type: DataTypes.DATE,
    },
    gst_number: {
      type: DataTypes.STRING,
    },
    gst_type: {
      type: DataTypes.STRING,
    },
    last_updated_on: {
      type: DataTypes.DATE,
    },
    legal_name: {
      type: DataTypes.STRING,
    },
    nature_of_business: {
      type: DataTypes.STRING,
    },
    pan: {
      type: DataTypes.STRING,
    },
    primary_address: {
      type: DataTypes.STRING,
    },
    raw_response: {
      type: DataTypes.STRING,
    },
    registered_on: {
      type: DataTypes.DATE,
    },
    state: {
      type: DataTypes.STRING,
    },
    pan: {
      type: DataTypes.STRING,
    },

    state_code: {
      type: DataTypes.STRING,
    },
    trade_name: {
      type: DataTypes.STRING,
    },
    valid: {
      type: DataTypes.STRING,
    },
    pan: {
      type: DataTypes.STRING,
    },
    mobile_no: {
      type: DataTypes.STRING,
    },
    msme_number:{
      type:DataTypes.STRING
    }
  },
  {
    tableName: "Company_Detail",
    timestamps: false,
  }
);

export default ViewCompanyDetail;
