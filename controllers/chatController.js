import Chats from "../models/Chat/chats.js";
import ChatMembers from "../models/Chat/chatMembers.js";
import Messages from "../models/Chat/messages.js";
import Users from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES } from "../constants/const.js";
import sequelize from "../config/clientDbManager.js";

/* ============================================================
   CHAT CONTROLLERS
============================================================ */

// CREATE CHAT
export const createChat = async (req, res) => {
  try {
    const { isGroup, groupName, createdBy, members } = req.body;

    const chat = await Chats.create({
      IsGroup: isGroup,
      GroupName: groupName,
      CreatedBy: createdBy,
    });

    if (members?.length) {
      const mapped = members.map((u) => ({
        ChatId: chat.Id,
        UserId: u,
      }));
      await ChatMembers.bulkCreate(mapped);
    }

    return successResponse(res, "Chat created successfully", chat);
  } catch (err) {
    return errorResponse(res, "Unable to create chat", err.message);
  }
};

// GET ALL CHATS OF USER
export const getAllChats = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await Chats.sequelize.query(
      `
      SELECT 
        c.Id AS ChatId,
        c.IsGroup,
        c.GroupName,
        c.CreatedAt,
        c.CreatedBy,
        u.id AS MemberId,
        CONCAT(u.first_name, ' ', u.last_name) AS MemberName,
        u.email AS MemberEmail,
        cm.Role AS MemberRole,
        cm.JoinedAt AS MemberJoinedAt
      FROM chats c
      INNER JOIN chat_members cm_filter 
        ON cm_filter.ChatId = c.Id 
        AND cm_filter.UserId = :userId      -- <-- ensure user is a member
      LEFT JOIN chat_members cm 
        ON cm.ChatId = c.Id                 -- <-- load all members
      LEFT JOIN user u 
        ON u.id = cm.UserId
      ORDER BY c.Id, u.id;
      `,
      { replacements: { userId } }
    );


    const result = {};

    rows.forEach((row) => {
      if (!result[row.ChatId]) {
        result[row.ChatId] = {
          ChatId: row.ChatId,
          IsGroup: row.IsGroup,
          GroupName: row.GroupName,
          CreatedAt: row.CreatedAt,
          CreatedBy: row.CreatedBy,
          Members: [],
        };
      }

      if (row.MemberId) {
        result[row.ChatId].Members.push({
          MemberId: row.MemberId,
          MemberName: row.MemberName,
          MemberEmail: row.MemberEmail,
          MemberRole: row.MemberRole,
          JoinedAt: row.MemberJoinedAt,
        });
      }
    });

    return successResponse(res, "Chats loaded", Object.values(result));
  } catch (err) {
    return errorResponse(res, "Unable to load chats", err.message);
  }
};

// GET CHAT BY ID
export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await Chats.sequelize.query(
      `
      SELECT 
        c.Id AS ChatId,
        c.IsGroup,
        c.GroupName,
        c.CreatedAt,
        c.CreatedBy,
        u.id AS MemberId,
        CONCAT(u.first_name, ' ', u.last_name) AS MemberName,
        u.email AS MemberEmail,
        cm.Role AS MemberRole,
        cm.JoinedAt AS MemberJoinedAt
      FROM chats c
      INNER JOIN chat_members cm ON cm.ChatId = c.Id
      INNER JOIN user u ON u.id = cm.UserId
      WHERE c.Id = :id
      ORDER BY u.id;
      `,
      { replacements: { id } }
    );

    if (!rows.length) {
      return successResponse(res, "Chat not found", null);
    }

    const base = rows[0];

    const chat = {
      ChatId: base.ChatId,
      IsGroup: base.IsGroup,
      GroupName: base.GroupName,
      CreatedAt: base.CreatedAt,
      CreatedBy: base.CreatedBy,
      Members: rows.map((r) => ({
        MemberId: r.MemberId,
        MemberName: r.MemberName,
        MemberEmail: r.MemberEmail,
        MemberRole: r.MemberRole,
        JoinedAt: r.MemberJoinedAt,
      })),
    };

    return successResponse(res, "Chat loaded", chat);
  } catch (err) {
    return errorResponse(res, "Unable to fetch chat", err.message);
  }
};

// UPDATE CHAT
export const updateChat = async (req, res) => {
  try {
    const { id } = req.params;

    await Chats.update(req.body, { where: { Id: id } });

    return successResponse(res, "Chat updated successfully");
  } catch (err) {
    return errorResponse(res, "Unable to update chat", err.message);
  }
};

// DELETE CHAT
export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    await Chats.destroy({ where: { Id: id } });

    return successResponse(res, "Chat deleted");
  } catch (err) {
    return errorResponse(res, "Failed to delete chat", err.message);
  }
};

/* ============================================================
   CHAT MEMBER CONTROLLERS
============================================================ */

// ADD MEMBER
export const addMemberToChat = async (req, res) => {
  try {
    const { chatId, userId, role } = req.body;

    if (!chatId || !userId) {
      return errorResponse(res, "chatId and userId are required");
    }

    // 1️⃣ Check if user exists
    const [userCheck] = await sequelize.query(
      `SELECT id FROM user WHERE id = :userId LIMIT 1;`,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!userCheck) {
      return errorResponse(
        res,
        "User does not exist",
        `Invalid userId: ${userId}`
      );
    }

    // 2️⃣ Check if chat exists
    const [chatCheck] = await sequelize.query(
      `SELECT Id FROM chats WHERE Id = :chatId LIMIT 1;`,
      {
        replacements: { chatId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!chatCheck) {
      return errorResponse(
        res,
        "Chat does not exist",
        `Invalid chatId: ${chatId}`
      );
    }

    // 3️⃣ Prevent duplicate
    const [exists] = await sequelize.query(
      `SELECT Id FROM chat_members WHERE ChatId = :chatId AND UserId = :userId LIMIT 1;`,
      {
        replacements: { chatId, userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (exists) {
      return successResponse(res, "Member already exists", exists);
    }

    // 4️⃣ Insert member
    const member = await ChatMembers.create({
      ChatId: chatId,
      UserId: userId,
      Role: role || "member",
    });

    return successResponse(res, "Member added", member);
  } catch (err) {
    return errorResponse(res, "Unable to add member", err.message);
  }
};

// GET MEMBERS
export const getChatMembers = async (req, res) => {
  try {
    const { chatId } = req.params;

    const query = `
      SELECT 
        cm.Id AS ChatMemberId, 
        cm.ChatId, 
        cm.UserId, 
        cm.Role, 
        cm.JoinedAt,
        u.id AS UserId,
        CONCAT(u.first_name, ' ', u.last_name) AS UserName,
        u.email AS UserEmail
      FROM chat_members cm
      INNER JOIN user u ON u.id = cm.UserId
      WHERE cm.ChatId = :chatId
      ORDER BY u.id;
    `;

    const [rows] = await sequelize.query(query, {
      replacements: { chatId },
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, "Members loaded", rows);
  } catch (err) {
    return errorResponse(res, "Unable to load members", err.message);
  }
};

// UPDATE MEMBER ROLE
export const updateChatMemberRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    await ChatMembers.update({ Role: role }, { where: { Id: id } });

    return successResponse(res, "Role updated");
  } catch (err) {
    return errorResponse(res, "Unable to update role", err.message);
  }
};

// REMOVE MEMBER
export const removeChatMember = async (req, res) => {
  try {
    const { id } = req.params;

    await ChatMembers.destroy({ where: { Id: id } });

    return successResponse(res, "Member removed");
  } catch (err) {
    return errorResponse(res, "Failed to remove member", err.message);
  }
};

/* ============================================================
   MESSAGE CONTROLLERS
============================================================ */

// SEND MESSAGE (AUTO-CREATE CHAT + MEMBERS IF NOT EXISTS)
export const sendMessage = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { senderId, receiverId, chatId, message, messageType } = req.body;

    if (!senderId) {
      return errorResponse(res, "SenderId is required");
    }
    if (!message) {
      return errorResponse(res, "Message is required");
    }

    let finalChatId = chatId;

    // 1️⃣ Validate sender exists
    const [senderCheck] = await sequelize.query(
      `SELECT id FROM user WHERE id = :senderId LIMIT 1`,
      { replacements: { senderId }, type: sequelize.QueryTypes.SELECT }
    );

    if (!senderCheck) {
      return errorResponse(res, "Invalid senderId");
    }

    // 2️⃣ Validate receiver exists (if provided)
    if (receiverId) {
      const [receiverCheck] = await sequelize.query(
        `SELECT id FROM user WHERE id = :receiverId LIMIT 1`,
        { replacements: { receiverId }, type: sequelize.QueryTypes.SELECT }
      );

      if (!receiverCheck) {
        return errorResponse(res, "Invalid receiverId");
      }
    }

    // 3️⃣ If chatId not given → try to find existing 1-on-1 chat
    if (!finalChatId && receiverId) {
      const findChatQuery = `
        SELECT c.Id
        FROM chats c
        WHERE c.IsGroup = false
        AND EXISTS (
          SELECT 1 FROM chat_members WHERE ChatId = c.Id AND UserId = :senderId
        )
        AND EXISTS (
          SELECT 1 FROM chat_members WHERE ChatId = c.Id AND UserId = :receiverId
        )
        LIMIT 1;
      `;

      const [existing] = await sequelize.query(findChatQuery, {
        replacements: { senderId, receiverId },
        type: sequelize.QueryTypes.SELECT,
      });

      if (existing && existing.Id) {
        finalChatId = existing.Id;
      }
    }

    // 4️⃣ Create a new chat if none found
    if (!finalChatId) {
      const newChat = await Chats.create(
        {
          IsGroup: false,
          CreatedBy: senderId,
        },
        { transaction: t }
      );

      finalChatId = newChat.Id;

      // Add members to chat
      const membersToAdd = [{ ChatId: finalChatId, UserId: senderId }];

      if (receiverId) {
        membersToAdd.push({ ChatId: finalChatId, UserId: receiverId });
      }

      await ChatMembers.bulkCreate(membersToAdd, { transaction: t });
    }

    // 5️⃣ Insert message
    const saved = await Messages.create(
      {
        ChatId: finalChatId,
        SenderId: senderId,
        Message: message,
        MessageType: messageType || "text",
        IsRead: false,
      },
      { transaction: t }
    );

    await t.commit();

    return successResponse(res, "Message sent successfully", {
      chatId: finalChatId,
      message: saved,
    });
  } catch (err) {
    await t.rollback();
    return errorResponse(res, "Unable to send message", err.message);
  }
};

// GET MESSAGES BY CHAT
export const getMessagesByChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const query = `
      SELECT 
        m.Id,
        m.ChatId,
        m.SenderId,
        m.Message,
        m.MessageType,
        m.IsRead,
        m.CreatedAt,
        u.id AS UserId,
        CONCAT(u.first_name, ' ', u.last_name) AS SenderName,
        u.email AS SenderEmail
      FROM messages m
      INNER JOIN user u ON u.id = m.SenderId
      WHERE m.ChatId = :chatId
      ORDER BY m.CreatedAt ASC;
    `;

    const rows = await sequelize.query(query, {
      replacements: { chatId },
      type: sequelize.QueryTypes.SELECT,
    });

    console.log(rows);

    return successResponse(res, "Messages loaded", rows);
  } catch (err) {
    return errorResponse(res, "Unable to fetch messages", err.message);
  }
};

// MARK READ
export const updateMessageReadStatus = async (req, res) => {
  try {
    const { id } = req.params;

    await Messages.update({ IsRead: true }, { where: { Id: id } });

    return successResponse(res, "Message marked read");
  } catch (err) {
    return errorResponse(res, "Failed to update read status", err.message);
  }
};

// DELETE MESSAGE
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await Messages.destroy({ where: { Id: id } });

    return successResponse(res, "Message deleted");
  } catch (err) {
    return errorResponse(res, "Unable to delete message", err.message);
  }
};
