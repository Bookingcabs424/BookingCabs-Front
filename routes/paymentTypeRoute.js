import express from "express";
import {
  getPaymentType,
  updatePaymentType,
} from "../controllers/paymentTypeController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const paymentType = express.Router();

/**
 * @swagger
 * /paymentType:
 *   get:
 *     summary: Retrieve a list of payment types
 *     tags: [Payment Type]
 *     description: Fetch all available payment types.
 *     responses:
 *       200:
 *         description: A list of payment types.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *   put:
 *     summary: Update a payment type
 *     description: Update the details of an existing payment type.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment type updated successfully.
 *       400:
 *         description: Invalid input.
 */

paymentType.route("/").get(authenticate, getPaymentType);
paymentType.route("/:id").put(authenticate, updatePaymentType);



export default paymentType;
