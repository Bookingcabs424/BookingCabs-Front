import express from "express";
import {
  addBankAccount,
  updateBankAccount,
  getAllBankAccounts,
  softDeleteBankAccount,
  getBankDetailsById,
} from "../controllers/userBankController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  bulkUpsertCards,
  deleteUserCard,
  getUserCards,
} from "../controllers/userController.js";

const bankDetail = express.Router();




/**
 * @swagger
 * /bankDetail/update/{id}:
 *   put:
 *     summary: Update an existing bank account (with logs)
 *     tags: [Bank Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bank account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               ac_holder_name: "Updated Name"
 *               branch: "New Branch"
 *     responses:
 *       200:
 *         description: Bank account updated and logged successfully
 *       404:
 *         description: Bank account not found
 */
bankDetail.route("/update/:id").put(authenticate, updateBankAccount);

/**
 * @swagger
 * tags:
 *   name: Bank Account
 *   description: APIs for managing bank accounts
 */

/**
 * @swagger
 * /bankDetail/add:
 *   post:
 *     summary: Add a new bank account
 *     tags: [Bank Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               ac_holder_name:
 *                 type: string
 *               ac_no:
 *                 type: string
 *               ifsc_code:
 *                 type: string
 *               address:
 *                 type: string
 *               upi_id:
 *                 type: string
 *               branch:
 *                 type: string
 *               status:
 *                 type: Boolean
 *                 description: Status of the bank account
 *                 example: true
 *     responses:
 *       201:
 *         description: Bank account created successfully
 */
bankDetail.route("/add").post(authenticate, addBankAccount);

/**
 * @swagger
 * /bankDetail/list:
 *   get:
 *     summary: Get all active bank accounts
 *     tags: [Bank Account]
 *     responses:
 *       200:
 *         description: List of bank accounts
 */
bankDetail.route("/list").get(authenticate, getAllBankAccounts);

/**
 * @swagger
 * /bankDetail/delete/{id}:
 *   delete:
 *     summary: Soft delete a bank account
 *     tags: [Bank Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bank account ID
 *     responses:
 *       200:
 *         description: Bank account soft-deleted successfully
 *       404:
 *         description: Bank account not found
 */

bankDetail.route("/get/").post(authenticate, getBankDetailsById);

bankDetail.route("/delete/:id").delete(authenticate, softDeleteBankAccount);
bankDetail.route("/insert-card").post(authenticate, bulkUpsertCards);
bankDetail.route("/get-user-cards/:user_id").get(authenticate, getUserCards);
bankDetail.route("/delete-card").post(authenticate, deleteUserCard);

export default bankDetail;
