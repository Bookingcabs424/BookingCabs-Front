import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import { sign } from "crypto";

const ViewRecentUserDetail = sequelize.define(
  "view_recent_user_detail",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    city_name: { type: DataTypes.STRING },
    pending_doc: { type: DataTypes.STRING },
    vehicle_model_names: { type: DataTypes.STRING },
    modified_on: { type: DataTypes.STRING },
    user_type: { type: DataTypes.STRING },
    vehicle_numbers: { type: DataTypes.STRING },
    login_status: { type: DataTypes.BOOLEAN },
    signup_status: { type: DataTypes.TINYINT },
    created_date: { type: DataTypes.DATE },
    isActive: { type: DataTypes.INTEGER },
  },
  {
    tableName: "view_recent_user_detail",
    timestamps: false,
  }
);

export default ViewRecentUserDetail;
