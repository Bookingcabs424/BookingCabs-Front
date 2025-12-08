import express from "express";
import {
  createEmailApi,
  getAllEmailApis,
  getActiveEmailApi,
  updateEmailApi,
  softDeleteEmailApi,
  sendEmailWithAttach,
  sendFestEmail,
  sendCronEmail,
  sendReferMail,
} from "../controllers/emailController.js";
import { masterCron } from "../utils/eventCrone.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", async (req, res) => {
  res.status(200).json({ msg: "Hello Jii" });
});

/**
 * @swagger
 * tags:
 *   name: Email API
 *   description: Manage Email service configurations
 */

/**
 * @swagger
 * /api/email:
 *   post:
 *     summary: Add new email provider
 *     tags: [Email API]
 */
router.post("/email", createEmailApi);

/**
 * @swagger
 * /api/email:
 *   get:
 *     summary: Get all email configs
 *     tags: [Email API]
 */
router.get("/email", getAllEmailApis);

/**
 * @swagger
 * /api/email/active:
 *   get:
 *     summary: Get active email config
 *     tags: [Email API]
 */
router.get("/email/active", getActiveEmailApi);

/**
 * @swagger
 * /api/email/{id}:
 *   put:
 *     summary: Update email config
 *     tags: [Email API]
 */
router.put("/email/:id", updateEmailApi);

/**
 * @swagger
 * /api/email/{id}:
 *   delete:
 *     summary: Soft delete email config
 *     tags: [Email API]
 */
router.delete("/email/:id", softDeleteEmailApi);

router.post("/master-cron", masterCron);

router.post("/send-fest-email", sendCronEmail);

router.post("/refer-and-earn", authenticate, sendReferMail);

export default router;
