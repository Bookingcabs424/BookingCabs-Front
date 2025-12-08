import express from "express";
import {
  forgotPassword,
  register,
  login,
  resetPassword,
  sendOTP,
  verifyOTP,
  completeProfile,
  changePassword,
  logoutUser,
  resendOTP,
  checkAuthStatus,
  changeUserPasswordBySuperAdmin,
  combinationEmailChecker,
  combinationMobileChecker,
} from "../controllers/authController.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const auth = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirm_password
 *               - first_name
 *               - last_name
 *               - user_type_id
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *               mobile:
 *                 type: string
 *                 description: User's mobile number
 *               mobile_prefix:
 *                 type: string
 *                 description: Country code prefix for mobile number (e.g., +91)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 description: Should match the password
 *               user_type_id:
 *                 type: integer
 *                 default: 1
 *                 description: Role ID of the user, e.g., user, vendor, corporate
 *               referral_key:
 *                 type: string
 *                 default: ""
 *                 description: Optional referral code
 *               newsletter_subscription:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the user subscribes to the newsletter
 *               agreement_subscription:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the user accepts the terms and agreements
 *               parent_id:
 *                 type: integer
 *                 nullable: true
 *                 description: ID of the referring user or organization
 *               city:
 *                 type: integer
 *                 description: User's city
 *               nationality:
 *                 type: integer
 *                 description: User's nationality
 *               mobile_promotion:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the user agrees to mobile promotions
 *               signup_status:
 *                 type: integer
 *                 default: 0
 *                 description: Signup status flag (e.g., 0 = basic, 1 = verified)
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Registration successful
 *               userId: 123
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               message: Email already in use
 */

auth.route("/register").post(register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and return JWT  identifier means email or mobile
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *               password:
 *                 type: string
 *               user_type_id:
 *                 type: integer
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
auth.route("/login").post(login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - user_type_id
 *             properties:
 *               email:
 *                 type: string
 *               user_type_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
auth.route("/forgot-password").post(forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
auth.route("/reset-password").post(resetPassword);

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to guest user's mobile
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
auth.route("/send-otp").post(sendOTP);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify guest user's OTP and return token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - otp
 *               - is_guest
 *             properties:
 *               mobile:
 *                 type: string
 *               otp:
 *                 type: string
 *               is_guest:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OTP verified, token returned
 *       401:
 *         description: Invalid or expired OTP
 */
auth.route("/verify-otp").post(verifyOTP);

/**
 * @swagger
 * /auth/complete-profile:
 *   post:
 *     summary: Complete guest profile after OTP login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile completed
 */
auth.route("/complete-profile").post(authenticate, completeProfile);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password for logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: User's old password
 *               newPassword:
 *                 type: string
 *                 description: User's new password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Password changed successfully
 *       400:
 *         description: Bad Request (e.g. missing fields or same old/new password)
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid password request
 *       401:
 *         description: Unauthorized (e.g. old password incorrect or invalid token)
 *         content:
 *           application/json:
 *             example:
 *               message: Incorrect old password or invalid token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Something went wrong
 */
auth.route("/change-password").post(authenticate, changePassword);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               message: Logout successful
 *       401:
 *         description: Unauthorized (invalid or expired token)
 */

auth.route("/logout").post(authenticate, logoutUser);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP to the user
 *     description: This endpoint is used to resend an OTP to the user either via email or mobile. It checks if the user exists and is not already verified.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - required:
 *                   - email
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: The email of the user.
 *               - required:
 *                   - mobile
 *                 properties:
 *                   mobile:
 *                     type: string
 *                     description: The mobile number of the user.
 *             properties:
 *               is_guest:
 *                 type: boolean
 *                 description: Whether the request is from a guest user.
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP resent successfully.
 *                 user_id:
 *                   type: integer
 *                   example: 123
 *                 mobile:
 *                   type: string
 *                   example: "9876543210"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Mandatory field missing
 *                 message:
 *                   type: string
 *                   example: Phone number or email is required.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *                 message:
 *                   type: string
 *                   example: No user found with the given email or mobile.
 *       409:
 *         description: Conflict - User already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User is already verified.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Something went wrong
 *                 message:
 *                   type: string
 *                   example: Internal server error while resending OTP.
 */
auth.route("/resend-otp").post(resendOTP);

/**
 * @swagger
 * /auth/change-password-by-admin:
 *   post:
 *     summary: Change another user's password (admin-only)
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - password
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user whose password is to be changed
 *               password:
 *                 type: string
 *                 description: New password to set
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Missing parameters or invalid password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

auth
  .route("/change-password-by-admin")
  .post(authenticate, hasRole("admin"), completeProfile);
auth.route("/check-auth").post(checkAuthStatus);
auth.route("/combination-mobile-check").post(combinationMobileChecker);
auth.route("/combination-email-check").post(combinationEmailChecker);

export default auth;
