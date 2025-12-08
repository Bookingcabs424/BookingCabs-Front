import { DataTypes } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import NewsletterUser from "./newsletteruserModel.js"; 

const NewsletterComment = sequelize.define(
  "NewsletterComment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    newsletter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "newsletter_user",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("Active", "In-Active"),
      allowNull: false,
      defaultValue: "Active",
    },
  },
  {
    tableName: "newsletter_comments",
    timestamps: false,
    freezeTableName: true,
  }
);

NewsletterComment.belongsTo(NewsletterUser, {
  foreignKey: "newsletter_id",
  as: "newsletter",
});

export default NewsletterComment;
