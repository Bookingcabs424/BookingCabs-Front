import { DataTypes } from 'sequelize';
import sequelize from '../config/clientDbManager.js';

const CompanySetup = sequelize.define('CompanySetup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_api_key: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  user_type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trading_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  api_token: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  com_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  comp_address: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  domain_address: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  office_address: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  payment_mode: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  payment_options: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  credit_limit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ref_no: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  no_of_agent: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  no_of_mem_partner: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  no_of_staff: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currency_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pan_no: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  fax_no: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  gst_no: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  site_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  site_title: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  site_url: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  analytics_code: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  additional_javascript: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  meta_key: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  meta_desc: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  global_email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  admin_footer: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  admin_footer_url: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  frontend_footer: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  frontend_footer_url: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  admin_header_logo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  frontend_header_logo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  admin_favicon: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  frontend_favicon: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  start_on: {
    type: DataTypes.DATE,
    allowNull: false
  },
  expiry_on: {
    type: DataTypes.DATE,
    allowNull: false
  },
  opr_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  opr_lat: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  opr_long: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  dis_unit: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  price_format: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  seo_mode: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  lang_direction: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  maintenance_mode: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  maintenance_mode_message: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date_format_short: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  date_format_long: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  time_format_short: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  time_format_long: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  billing_payment_mode: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  shopping_cart_mode: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  payment_flow: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pay_to_text: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  working_hour: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  global_cache_mode: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  cache_adapter: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cache_directory: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  smtp_host: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  smtp_username: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  smtp_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  smtp_port: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  facebook: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  twitter: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  linkedin: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  instagram: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  youtube: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  client_app_url: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  driver_app_url: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  ios_client_app_url: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  ios_driver_app_url: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  car_model_path: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  developed_by: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  developed_by_label: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  booking_prefix: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  hold_prefix: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  quote_prefix: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  itinerary_prefix: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  credit_note_prefix: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  driver_min_balance: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: false,
    defaultValue: 0.00
  },
  short_code: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  bank_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ac_holder_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  branch: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ifsc_code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  account_no: {
    type: DataTypes.STRING(50),
    allowNull: true
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
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('0', '1'),
    allowNull: false
  },
  ip: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'company_setup',
  timestamps: false,
  freezeTableName: true,
  hooks: {
    beforeUpdate: (instance) => {
      instance.modified_date = new Date();
    },
    beforeCreate: (instance) => {
      instance.created_date = new Date();
      instance.modified_date = new Date();
    }
  }
});

export default CompanySetup;