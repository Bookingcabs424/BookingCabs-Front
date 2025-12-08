import Chats from "../models/Chat/chats.js";
import ChatMembers from "../models/Chat/chatMembers.js";
import Messages from "../models/Chat/messages.js";

export default function chatSocket(io) {

  io.on("connection", (socket) => {
    console.log("⚡ Connected:", socket.id, "User:", socket.user?.id);

    /* ======================================================
       JOIN USER PERSONAL ROOM → Notifications
    ====================================================== */
    socket.on("joinUser", () => {
      if (!socket.user?.id) return;
      socket.join(`user_${socket.user.id}`);
      console.log(`User ${socket.user.id} joined personal room`);
    });


    /* ======================================================
       JOIN CHAT ROOM
    ====================================================== */
    socket.on("joinChat", (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`User ${socket.user.id} joined chat room: ${chatId}`);
    });


    /* ======================================================
       SEND MESSAGE (AUTO CREATE CHAT + MEMBERS)
    ====================================================== */
    socket.on("sendMessage", async (data) => {
      try {
        const { senderId, receiverId, chatId, message, messageType } = data;

        let finalChatId = chatId;

        // Look for existing 1-to-1 chat
        if (!finalChatId) {
          const existingChat = await Chats.findOne({
            where: { IsGroup: false },
            include: [
              { model: ChatMembers, where: { UserId: senderId } },
              { model: ChatMembers, where: { UserId: receiverId } },
            ],
          });

          if (existingChat) {
            finalChatId = existingChat.Id;
          }
        }

        // Create new chat if not exists
        if (!finalChatId) {
          const newChat = await Chats.create({
            IsGroup: false,
            CreatedBy: senderId
          });

          finalChatId = newChat.Id;

          await ChatMembers.bulkCreate([
            { ChatId: finalChatId, UserId: senderId },
            { ChatId: finalChatId, UserId: receiverId },
          ]);
        }

        // Create message
        const savedMsg = await Messages.create({
          ChatId: finalChatId,
          SenderId: senderId,
          Message: message,
          MessageType: messageType || "text",
        });

        // Emit to chat room (everyone inside sees it)
        io.to(`chat_${finalChatId}`).emit("newMessage", savedMsg);

        // Send personal notification to receiver
        io.to(`user_${receiverId}`).emit("newMessageNotification", {
          chatId: finalChatId,
          message: savedMsg,
        });

      } catch (err) {
        console.error("sendMessage Error:", err.message);
        socket.emit("socketError", "Failed to send message");
      }
    });



    /* ======================================================
       READ RECEIPT
    ====================================================== */
    socket.on("markRead", async ({ messageId, chatId }) => {
      try {
        await Messages.update({ IsRead: true }, { where: { Id: messageId } });

        io.to(`chat_${chatId}`).emit("readReceipt", {
          messageId,
          userId: socket.user.id,
        });
      } catch (err) {
        socket.emit("socketError", "Failed to mark read");
      }
    });



    /* ======================================================
       TYPING INDICATOR
    ====================================================== */
    socket.on("typing", ({ chatId }) => {
      socket.to(`chat_${chatId}`).emit("typing", {
        userId: socket.user.id,
      });
    });

    socket.on("stopTyping", ({ chatId }) => {
      socket.to(`chat_${chatId}`).emit("stopTyping", {
        userId: socket.user.id,
      });
    });



    /* ======================================================
       USER DISCONNECT
    ====================================================== */
    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });
}
