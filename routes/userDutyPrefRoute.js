import {
  createDuty,
  updateDuty,
  getDutyByUser,
  getAllUserDuties,
  softDeleteDuty,
} from "../controllers/userDutyPrefController.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /duties:
 *   post:
 *     summary: Create duty preferences for a user
 *     tags: [Duties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - package_id
 *             properties:
 *               package_id:
 *                 type: string
 *                 example: "1,2,3"
 *                 description: Comma-separated list of package IDs
 *     responses:
 *       201:
 *         description: Duty preferences created successfully
 *       400:
 *         description: Missing or invalid package_id
 *       500:
 *         description: Internal server error
 */

router.post("/", authenticate, createDuty);

/**
 * @swagger
 * /duties/{id}:
 *   put:
 *     summary: Update an existing duty
 *     tags: [Duties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Duty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dutyDetails:
 *                 type: object
 *     responses:
 *       200:
 *         description: Duty updated successfully
 *       404:
 *         description: Duty not found
 */
router.put("/:id", authenticate, updateDuty);

/**
 * @swagger
 * /duties/get-duty:
 *   get:
 *     summary: Get duties by user ID
 *     tags: [Duties]
 *     security:
 *       - bearerAuth: []
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of duties
 *       404:
 *         description: User not found
 */
router.get("/get-duty", authenticate, getDutyByUser);

/**
 * @swagger
 * /duties/get-all-user-duty:
 *   get:
 *     summary: Get all user duties
 *     tags: [Duties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user duties
 *       404:
 *         description: No duties found
 */
router.get("/get-all-user-duty", authenticate, hasRole("admin"), getAllUserDuties);

/**
 * @swagger
 * /duties/{id}:
 *   delete:
 *     summary: Soft delete a duty
 *     tags: [Duties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Duty ID
 *     responses:
 *       200:
 *         description: Duty deleted successfully
 *       404:
 *         description: Duty not found
 */
router.delete("/duties/:id", authenticate, hasRole("admin"), softDeleteDuty);

export default router;
