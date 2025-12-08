import { DataTypes } from "sequelize";
import sequelize from "../../config/clientDbManager.js";
import User from "../userModel.js"
import Chats from "../Chat/chats.js"

const ChatMembers = sequelize.define(
  "ChatMembers",
  {
    Id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    ChatId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    UserId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    Role: {
      type: DataTypes.ENUM("member", "admin"),
      defaultValue: "member",
    },
    JoinedAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
  },
  {
    timestamps: false,
    tableName: "chat_members",
  }
);

/* -------------------- ASSOCIATIONS -------------------- */
ChatMembers.belongsTo(User,{
  foreignKey: "UserId" 
});

ChatMembers.belongsTo(Chats, {
  foreignKey: "ChatId" 
});

export default ChatMembers;
