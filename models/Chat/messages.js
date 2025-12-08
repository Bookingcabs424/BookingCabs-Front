import { DataTypes } from "sequelize";
import sequelize from "../../config/clientDbManager.js";
import User from "../userModel.js"
import Chats from "../Chat/chats.js"

const Messages = sequelize.define(
  "Messages",
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
    SenderId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    Message: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    MessageType: {
      type: DataTypes.ENUM("text", "image", "file"),
      defaultValue: "text",
    },
    CreatedAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    IsRead: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
  },
  {
    timestamps: false,
    tableName: "messages",
  }
);

/* -------------------- ASSOCIATIONS -------------------- */
Messages.belongsTo(User, { 
    foreignKey: "SenderId" 
});

Messages.belongsTo(Chats, { 
    foreignKey: "ChatId" 
});

export default Messages;
