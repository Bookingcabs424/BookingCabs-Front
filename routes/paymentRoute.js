import express from "express";
import { advanceToVendor, atomPayment, atomPaymentResponse, getPaymentGatewayDetails, getUploadedPayments, paymentHistory, TransactionResponse, userTransaction, viewPaymentHookLogs } from "../controllers/paymentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const payment = express.Router();

/**
 * @swagger
 * /driver/payment-history:
 *   get:
 *     summary: Get payment history for a driver
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the driver
 *     responses:
 *       200:
 *         description: Payment history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       driver_id:
 *                         type: integer
 *                       amount:
 *                         type: number
 *                       transaction_id:
 *                         type: string
 *                       upload_time:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                         enum: [Approved, Not Approved]
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
payment.post('/advanceToVendor', advanceToVendor);
payment.get("/uploadedPaymentList",authenticate,getUploadedPayments)
payment.route("payment-history").get(authenticate, paymentHistory);
payment.get("/get-paymentGatewayDetails",getPaymentGatewayDetails)
payment.post("/initiatePayment",atomPayment)
payment.get("/Atomresponse",atomPaymentResponse)
payment.post("/Transactionresp",TransactionResponse)
payment.post("/userTransaction",userTransaction)
payment.get("/view-response",viewPaymentHookLogs)


export default payment;
