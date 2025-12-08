import express from "express";
import {
  getVendorClients,
  addVendorStatusDetail,
  getVendorStatusDetail,
  updateVendorStatusDetail,
  updateVendorStatus,
  getAllVendor,
} from "../controllers/vendorController.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const vendor = express.Router();
/**
 * @swagger
 * /vendor/{vendorId}/clients:
 *   get:
 *     summary: Get clients associated with a specific vendor
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the vendor
 *     responses:
 *       200:
 *         description: Successfully fetched vendor clients
 *       400:
 *         description: Invalid vendor ID
 *       500:
 *         description: Internal server error
 */

vendor.route("/:vendorId/clients").get(authenticate, getVendorClients);

/**
 * @swagger
 * /vendor/status-detail:
 *   get:
 *     summary: Get vendor status details with optional filters
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: auto_id
 *         schema:
 *           type: integer
 *         description: Filter by record ID
 *     responses:
 *       200:
 *         description: Successfully fetched vendor status detail
 *       404:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */

vendor.route("/status-detail").get(authenticate, getVendorStatusDetail);

/**
 * @swagger
 * /api/vendor/status-detail:
 *   post:
 *     summary: Add a new vendor status detail record
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               booking_id:
 *                 type: integer
 *               self_reference:
 *                 type: string
 *               vendor_status:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               ip:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully inserted vendor status
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
vendor.route("/status-detail").post(authenticate, addVendorStatusDetail);
/**
 * @swagger
 * /vendor/status-detail:
 *   put:
 *     summary: Update vendor status detail
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auto_id
 *             properties:
 *               auto_id:
 *                 type: integer
 *                 description: Auto-increment ID of the vendor status record
 *               user_id:
 *                 type: integer
 *                 description: ID of the user (vendor)
 *               vendor_status:
 *                 type: integer
 *                 description: Status ID from cab_status table
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               ip:
 *                 type: string
 *               modified_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vendor status updated successfully
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Internal server error
 */

vendor.route("/status-detail").put(authenticate, updateVendorStatusDetail);

/**
 * @swagger
 * /vendor/status:
 *   put:
 *     summary: Bulk update vendor status
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *               - user_id
 *               - status
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of vendor status record IDs to update
 *               user_id:
 *                 type: integer
 *                 description: ID of the user making the update
 *               status:
 *                 type: integer
 *                 description: New status to be applied
 *     responses:
 *       200:
 *         description: Vendor status updated successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
vendor.route("/status").put(authenticate, updateVendorStatus);

vendor.route("/all").get(authenticate, hasRole("admin"), getAllVendor);

export default vendor;
