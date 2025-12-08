import express from "express";
import {
  addMemberToChat,
  createChat,
  deleteChat,
  deleteMessage,
  getAllChats,
  getChatById,
  getChatMembers,
  getMessagesByChat,
  removeChatMember,
  sendMessage,
  updateChat,
  updateChatMemberRole,
  updateMessageReadStatus,
} from "../controllers/chatController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ========================================================
   SWAGGER TAGS
======================================================== */

/**
 * @swagger
 * tags:
 *   name: Chat API
 *   description: Manage Chats (1-to-1 & Group)
 */

/**
 * @swagger
 * tags:
 *   name: Chat Member API
 *   description: Manage Chat Members
 */

/**
 * @swagger
 * tags:
 *   name: Message API
 *   description: Manage Chat Messages
 */

/* ========================================================
   CHAT ROUTES
======================================================== */

/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Create a new chat (1-to-1 or group)
 *     tags: [Chat API]
 */
router.post("/create", createChat);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all chats for a user
 *     tags: [Chat API]
 */
router.get("/list", authenticate, getAllChats);

/**
 * @swagger
 * /api/chats/{id}:
 *   get:
 *     summary: Get chat details by ID
 *     tags: [Chat API]
 */
router.get("/detail/:id", getChatById);

/**
 * @swagger
 * /api/chats/{id}:
 *   put:
 *     summary: Update chat (rename group, etc.)
 *     tags: [Chat API]
 */
router.put("/update/:id", updateChat);

/**
 * @swagger
 * /api/chats/{id}:
 *   delete:
 *     summary: Soft delete a chat
 *     tags: [Chat API]
 */
router.delete("/delete/:id", deleteChat);

/* ========================================================
   CHAT MEMBERS ROUTES
======================================================== */

/**
 * @swagger
 * /api/chat-members:
 *   post:
 *     summary: Add a member to chat
 *     tags: [Chat Member API]
 */
router.post("/chat-members", addMemberToChat);

/**
 * @swagger
 * /api/chat-members/{chatId}:
 *   get:
 *     summary: Get all members of a chat
 *     tags: [Chat Member API]
 */
router.get("/chat-members/:chatId", getChatMembers);

/**
 * @swagger
 * /api/chat-members/{id}:
 *   put:
 *     summary: Update chat member role (admin/member)
 *     tags: [Chat Member API]
 */
router.put("/chat-members/:id", updateChatMemberRole);

/**
 * @swagger
 * /api/chat-members/{id}:
 *   delete:
 *     summary: Remove a member from chat
 *     tags: [Chat Member API]
 */
router.delete("/chat-members/:id", removeChatMember);

/* ========================================================
   MESSAGE ROUTES
======================================================== */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Message API]
 */
router.post("/messages", sendMessage);

/**
 * @swagger
 * /api/messages/{chatId}:
 *   get:
 *     summary: Get all messages of a chat (supports pagination)
 *     tags: [Message API]
 */
router.get("/messages/:chatId", getMessagesByChat);

/**
 * @swagger
 * /api/messages/read/{id}:
 *   put:
 *     summary: Mark message as read
 *     tags: [Message API]
 */
router.put("/messages/read/:id", updateMessageReadStatus);

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message (soft delete)
 *     tags: [Message API]
 */
router.delete("/messages/:id", deleteMessage);

export default router;
