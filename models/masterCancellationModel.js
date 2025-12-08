import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const MasterCancellation = sequelize.define('MasterCancellation', {
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    round_off: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    days: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    hours: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    order_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'master_cancellation',
    timestamps: false,
  });
  export default MasterCancellation