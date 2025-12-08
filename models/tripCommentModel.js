
import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const DriverTripComment = sequelize.define("driver_trip_comments", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  booking_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  commented_by_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  commenter_type: {
    type: DataTypes.ENUM("client", "driver"),
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "driver_trip_comments",
  timestamps: false, 
});

export default DriverTripComment;



/*
CREATE TABLE driver_trip_comments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT NOT NULL,
  commented_by_id BIGINT NOT NULL,
  commenter_type ENUM('client', 'driver') NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

*/