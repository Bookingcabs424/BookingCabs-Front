import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";

const FriendFamily = sequelize.define(
  "friends_family",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    referral_code: {
      type: DataTypes.STRING(50),
      allowNull: true 
    },
    title: {
      type: DataTypes.ENUM("Mr", "Mrs", "Ms", "Miss", "Master"),
      allowNull: false,
    },
    relationship: {
      type: DataTypes.ENUM(
        "parent",
        "spouse",
        "child",
        "in-law",
        "sibling",
        "friend"
      ),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "friends_family",
    timestamps: true,
    freezeTableName:true,
  },
);

export default FriendFamily;
