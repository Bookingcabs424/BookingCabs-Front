import express from "express";
import {
  createSmsApi,
  getAllSmsApis,
  getActiveSmsApi,
  updateSmsApi,
  softDeleteSmsApi,
} from "../controllers/smsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SMS API
 *   description: Manage SMS service configurations
 */

/**
 * @swagger
 * /api/sms:
 *   post:
 *     summary: Add new SMS API config
 *     tags: [SMS API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SmsApi'
 *     responses:
 *       201:
 *         description: Successfully created
 */
router.post("/sms", createSmsApi);

/**
 * @swagger
 * /api/sms:
 *   get:
 *     summary: Get all SMS API configs
 *     tags: [SMS API]
 *     responses:
 *       200:
 *         description: List of SMS APIs
 */
router.get("/sms", getAllSmsApis);

/**
 * @swagger
 * /api/sms/active:
 *   get:
 *     summary: Get active SMS API config
 *     tags: [SMS API]
 *     responses:
 *       200:
 *         description: Active SMS API config
 */
router.get("/sms/active", getActiveSmsApi);

/**
 * @swagger
 * /api/sms/{id}:
 *   put:
 *     summary: Update an SMS API config
 *     tags: [SMS API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SmsApi'
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put("/sms/:id", updateSmsApi);

/**
 * @swagger
 * /api/sms/{id}:
 *   delete:
 *     summary: Soft delete an SMS API config
 *     tags: [SMS API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Soft deleted
 */
router.delete("/sms/:id", softDeleteSmsApi);

export default router;
