import express from "express";
import {
  getUserCreditLimit,
  getAllUserCreditLimit,
  addCreditLimit,
  updateCreditLimit,
  updateStatus,
  approveCreditLimit,
  walletAmount,
  userwalletAmount,
} from "../controllers/walletController.js";
import { getUserReferralPoints } from "../controllers/referralController.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const creditLimit = express.Router();

/**
 * @swagger
 * /creditLimit:
 *   get:
 *     summary: Get credit limit for authenticated user
 *     tags: [CreditLimit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credit limit fetched successfully
 */
creditLimit.route("/").post(getUserCreditLimit);

/**
 * @swagger
 * /creditLimit/all:
 *   get:
 *     summary: Get all active user credit limits
 *     tags: [CreditLimit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All credit limits fetched
 */
creditLimit
  .route("/all")
  .get(authenticate, hasRole("admin"), getAllUserCreditLimit);

/**
 * @swagger
 * /creditLimit:
 *   post:
 *     summary: Add new credit limit for user
 *     tags: [CreditLimit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - credit_limit_amount
 *               - from_date
 *               - to_date
 *               - status
 *             properties:
 *               user_id:
 *                 type: string
 *               credit_limit_amount:
 *                 type: number
 *               from_date:
 *                 type: string
 *                 format: date
 *               to_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: number
 *     responses:
 *       200:
 *         description: Credit limit added
 */
creditLimit.route("/add").post(authenticate, hasRole("admin"), addCreditLimit);

/**
 * @swagger
 * /creditLimit:
 *   put:
 *     summary: Update existing credit limit
 *     tags: [CreditLimit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *               user_id:
 *                 type: string
 *               credit_limit_amount:
 *                 type: number
 *               from_date:
 *                 type: string
 *               to_date:
 *                 type: string
 *               status:
 *                 type: number
 *     responses:
 *       200:
 *         description: Credit limit updated
 */
creditLimit.route("/update").put(authenticate, hasRole("admin"), updateCreditLimit);

/**
 * @swagger
 * /creditLimit/update-status:
 *   patch:
 *     summary: Update status for one or multiple credit limits
 *     tags: [CreditLimit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 oneOf:
 *                   - type: number
 *                   - type: array
 *                     items:
 *                       type: number
 *               status:
 *                 type: number
 *     responses:
 *       200:
 *         description: Status updated
 */
creditLimit
  .route("/update-status")
  .patch(authenticate, hasRole("admin"), updateStatus);

/**
 * @swagger
 * /creditLimit/approve:
 *   patch:
 *     summary: Approve credit limit
 *     tags: [CreditLimit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - approved_status
 *             properties:
 *               id:
 *                 type: number
 *               approved_status:
 *                 type: number
 *     responses:
 *       200:
 *         description: Credit limit approved
 */
creditLimit
  .route("/approve")
  .patch(authenticate, hasRole("admin"), approveCreditLimit);

creditLimit.route("/wallet").get(authenticate, walletAmount).post(userwalletAmount);
creditLimit.route("/referal-points").get(authenticate, getUserReferralPoints);
creditLimit.route("/wallet").post(userwalletAmount);
export default creditLimit;
