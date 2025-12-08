// routes/emailTemplateRoute.js
import express from "express";
import {
  createEmailTemplate,
  getAllEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  softDeleteEmailTemplate,
} from "../controllers/emailTemplateController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Email Template API
 *   description: Manage Email Templates
 */

/**
 * @swagger
 * /api/email-template:
 *   post:
 *     summary: Create new email template
 *     tags: [Email Template API]
 */
router.post("/email-template", createEmailTemplate);

/**
 * @swagger
 * /api/email-template:
 *   get:
 *     summary: Get all email templates
 *     tags: [Email Template API]
 */
router.get("/", getAllEmailTemplates);

/**
 * @swagger
 * /api/email-template/{id}:
 *   get:
 *     summary: Get email template by ID
 *     tags: [Email Template API]
 */
router.get("/email-template/:id", getEmailTemplateById);

/**
 * @swagger
 * /api/email-template/{id}:
 *   put:
 *     summary: Update email template
 *     tags: [Email Template API]
 */
router.put("/email-template/:id", updateEmailTemplate);

/**
 * @swagger
 * /api/email-template/{id}:
 *   delete:
 *     summary: Soft delete email template
 *     tags: [Email Template API]
 */
router.delete("/email-template/:id", softDeleteEmailTemplate);

export default router;
