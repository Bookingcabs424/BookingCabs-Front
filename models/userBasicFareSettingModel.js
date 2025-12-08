import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const UserBasicFareSetting = sequelize.define('UserBasicFareSetting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rounding: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '1-Cash, 2-Account / Credit Card',
    },
    level: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '1-Normal, 2-Decimal, 3-Unit',
    },
    direction: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '1-Nearest, 2-Next, 3-Previous',
    },
  }, {
    tableName: 'user_basic_fare_settings',
    timestamps: false,
  });
//   UserBasicFareSetting.sync({alter:true,force:true})

  export default UserBasicFareSetting;