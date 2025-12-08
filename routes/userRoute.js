import express from "express";
import {
  updateUser,
  softDeleteUser,
  getAllUser,
  getUserById,
  userProfile,
  updateUserProfile,
  getAllUserLoginHistories,
  getUserLoginHistory,
  getUserLoginStatus,
  getAllActiveUsers,
  activateUser,
  addPaymentType,
  addWeekOff,
  addDutyDetailSequential,
  userLoginList,
  getLanguageListByType,
  userPaymentList,
  userWeekOffList,
  getPrefDriveCityList,
  updateReferralCode,
  emailVerifyStatus,
  updateMobileVerify,
  addPrefDriveCity,
  addDriverShift,
  addUser,
  statusHistory,
  getUserStaffDetails,
  getUserDetailByParentId,
  getUserStaff,
  updateDutyStatus,
  updateStaffSequential,
  getUserType,
  getUserHierarchy,
  referEarn,
  getUserPendingDoc,
  getUserBookingTypeMapping,
  userCreditHistory,
  userUploadCreditBalance,
  allUserCreditBalance,
  getCityName,
  getCountryName,
  userProfileInfoDetail,
  getUserModules,
  uploadUserProfilePhoto,
  uploadUserDocument,
  getDocumentList,
  getRecentUserDetail,
  updateUserStatus,
  addRelationShipManager,
  sendStatusToUser,
  getUserUploadedDocument,
  gstNumberVerfied,
  getUserDataafterLogin,
  getUsers,
  singleUserCreditBalance,
  updateBookingMappingDetail,
  addBookingTypeMappingDetail,
  getDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  updateDepartmentStatus,
  getUserBookingCounts,
  getAssignModuleByUserTypeId,
  bulkUpsertCards,
  getUserCards,
  deleteUserCard,
  getUserInfo,
  updateUserInfoByUserId,
  editUser,
  getUserSignature,
  createOrUpdateUserSignature,
  getDutyInfo,
  upsertDutyInfo,
  toggleLoginStatus,
  kycController,
  getKycUserInfo,
  deleteKYCInfo,
  viewKyc,
  editKyc,
  updateCardDetail,
  getEmailTemp,
  getUserDataList,
  saveLoginLogs,
  updateWalletAmount,
  changeUserPassword,
  forgotUserPassword,
  checkPassword,
  getRecentUsers,
  updateRelationShipManager,
  referAndEarnSMS,
} from "../controllers/userController.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import UserRating from "../models/userRatingModel.js";
import upload from "../middlewares/upload.js";
const user = express.Router();

const requireFolderQuery = (req, res, next) => {
  if (!req.query.folder) {
    return res
      .status(400)
      .json({ message: "Missing 'folder' query parameter" });
  }
  next();
};
user.get("/get-top-user", getRecentUsers);
user.route("/get-profile-details").get(authenticate, getUserDataafterLogin);
user
  .route("/get-assign-module-by-user-type-id")
  .get(authenticate, getAssignModuleByUserTypeId);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 */
user.route("/").get(authenticate, hasRole("isAdmin"), getAllUser);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       404:
 *         description: User not found
 */
user.route("/:id").get(authenticate, getUserById);

/**
 * @swagger
 * /user/update-user:
 *   put:
 *     summary: Update user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 */
user.route("/update-user").put(authenticate, updateUser);

/**
 * @swagger
 * /user/delete:
 *   post:
 *     summary: Soft delete a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
user.route("/delete").post(authenticate, softDeleteUser); // need to add userid for authntication like admin

/**
 * @swagger
 * /user/profile:
 *   put:
 *     tags: [User]
 *     summary: Update user profile
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
 *                 format: email
 *               mobile:
 *                 type: string
 *               alternate_mobile:
 *                 type: string
 *               father_name:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               address2:
 *                 type: string
 *               state_id:
 *                 type: integer
 *               city_id:
 *                 type: integer
 *               pincode:
 *                 type: string
 *               external_ref:
 *                 type: string
 *               kyc_type:
 *                 type: string
 *               kyc:
 *                 type: string
 *               gst_registration_number:
 *                 type: string
 *               landline_number:
 *                 type: string
 *               newsletter_subscription:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */

user.route("/profile").put(authenticate, updateUserProfile);
/**
 * @swagger
 * /user/get-all-user-login-history:
 *   get:
 *     summary: Get all user login histories
 *     tags: [User Login History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All login histories retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 histories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       ipAddress:
 *                         type: string
 *                       loginAt:
 *                         type: string
 *                         format: date-time
 */
user
  .route("/get-all-user-login-history")
  .get(authenticate, hasRole("admin"), getAllUserLoginHistories);
/**
 * @swagger
 * /user/user-login-history/{id}:
 *   get:
 *     summary: Get login history for a specific user
 *     tags: [User Login History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User login history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       ipAddress:
 *                         type: string
 *                       loginAt:
 *                         type: string
 *                         format: date-time
 */
user.route("/user-login-history/:id").get(authenticate, getUserLoginHistory);

/**
 * @swagger
 * /user/get-all-active-user:
 *   get:
 *     summary: Get all active users with their latest login status
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved active users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activeUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       status:
 *                         type: string
 *                       loginStatus:
 *                         type: string
 *                       lastLogin:
 *                         type: string
 *                         format: date-time
 *                       failedAttempts:
 *                         type: integer
 *                       lastIpAddress:
 *                         type: string
 *                       lastUserAgent:
 *                         type: string
 */
user.route("/get-all-active-user").get(authenticate, getAllActiveUsers);

/**
 * @swagger
 * /user/get-active-user/{id}:
 *   get:
 *     summary: Get the login status of a specific user, only if the user is active
 *     tags: [User Login History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User login status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountStatus:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     lastLogin:
 *                       type: string
 *                       format: date-time
 *                     failedAttempts:
 *                       type: integer
 *                     lastIpAddress:
 *                       type: string
 *                     lastUserAgent:
 *                       type: string
 *       404:
 *         description: User not found or user is not active, or login history not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
user.route("/get-active-user/:id").get(authenticate, getUserLoginStatus);

/**
 * @swagger
 * /user/activate-user/{id}:
 *  post:
 *   summary: Activate a user account
 *   tags: [User]
 *   security:
 *     - bearerAuth: []
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: User ID
 *       schema:
 *         type: integer
 *   responses:
 *     200:
 *       description: User account activated successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 */
user
  .route("/activate-user/:id")
  .post(authenticate, hasRole("admin"), activateUser);

/**
 * @swagger
 * /user/preferred-city:
 *   post:
 *     summary: Add preferred cities for a driver
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pref_city
 *             properties:
 *               pref_city:
 *                 type: string
 *                 example: "1,2,3"
 *                 description: Comma-separated list of city IDs
 *     responses:
 *       200:
 *         description: Preferred cities saved successfully
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Internal server error
 */
user.route("/preferred-city").post(authenticate, addPrefDriveCity);

/**
 * @swagger
 * /user/shift:
 *   post:
 *     summary: Assign working shifts to a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shift
 *             properties:
 *               shift:
 *                 type: string
 *                 example: "1,2,3"
 *                 description: Comma-separated list of working shift IDs
 *     responses:
 *       201:
 *         description: Working shifts assigned successfully
 *       400:
 *         description: Invalid or missing shift IDs
 *       500:
 *         description: Internal server error
 */
user.route("/shift").post(authenticate, addDriverShift);
/**
 * @swagger
 * /user/user-payment-type:
 *   post:
 *     summary: Assign payment types to a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_cash
 *             properties:
 *               payment_cash:
 *                 type: string
 *                 example: "1,2"
 *                 description: Comma-separated list of payment type IDs
 *     responses:
 *       201:
 *         description: Payment types assigned successfully
 *       400:
 *         description: Invalid or missing payment type IDs
 *       500:
 *         description: Internal server error
 */
user.route("/user-payment-type").post(authenticate, addPaymentType);

/**
 * @swagger
 * /user/week-off:
 *   post:
 *     summary: Assign weekly off days to a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - week_off
 *             properties:
 *               week_off:
 *                 type: string
 *                 example: "1,2,7"
 *                 description: Comma-separated list of week day IDs (e.g., 1 for Monday, 7 for Sunday)
 *     responses:
 *       201:
 *         description: Week off days assigned successfully
 *       400:
 *         description: Invalid or missing week off days
 *       500:
 *         description: Internal server error
 */
user.route("/week-off").post(authenticate, addWeekOff);

/**
 * @swagger
 * /user/add-duty-detail:
 *   post:
 *     summary: Add multiple driver preferences and duty details sequentially
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pref_city:
 *                 type: string
 *                 example: "1,2"
 *                 description: Comma-separated preferred city IDs
 *               booking_type:
 *                 type: string
 *                 example: "1,3"
 *                 description: Comma-separated booking type IDs
 *               shift:
 *                 type: string
 *                 example: "2,4"
 *                 description: Comma-separated shift IDs
 *               payment_cash:
 *                 type: string
 *                 example: "1"
 *                 description: Comma-separated payment type IDs
 *               week_off:
 *                 type: string
 *                 example: "6,7"
 *                 description: Comma-separated week day IDs (e.g., 6 for Saturday)
 *               language_type:
 *                 type: object
 *                 example: { speak: "English,Hindi", read: "English", write: "English" }
 *                 description: Language skills in speak/read/write categories
 *     responses:
 *       200:
 *         description: Driver duty and preference details added successfully
 *       400:
 *         description: Invalid or missing data
 *       500:
 *         description: Internal server error
 */
user.route("/add-duty-detail").post(authenticate, addDutyDetailSequential);

/**
 * @swagger
 * /user/language-list/{id}:
 *   get:
 *     summary: Get language list for a user by type (speak/read/write)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [speak, read, write]
 *         description: Type of language skill
 *     responses:
 *       200:
 *         description: Language list fetched successfully
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
user.route("/language-list/:id").post(authenticate, getLanguageListByType);

/**
 * @swagger
 * /user/login-list:
 *   get:
 *     summary: Get list of working shifts assigned to the logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned working shifts fetched successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */
user.route("/login-list").get(authenticate, userLoginList);

/**
 * @swagger
 * /user/payment-list:
 *   get:
 *     summary: Get list of payment types assigned to the logged-in User
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned payment types fetched successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */
user.route("/payment-list").get(authenticate, userPaymentList);

/**
 * @swagger
 * /user/week-off-list:
 *   get:
 *     summary: Get list of week-off days assigned to the logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned week-off days fetched successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */
user.route("/week-off-list").get(authenticate, userWeekOffList);

/**
 * @swagger
 * /user/pref-drive-city-list/{id}:
 *   get:
 *     summary: Get preferred driving cities for a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Preferred cities fetched successfully
 *       400:
 *         description: Missing or invalid user ID
 *       500:
 *         description: Internal server error
 */
user
  .route("/pref-drive-city-list/:id/")
  .get(authenticate, getPrefDriveCityList);

/**
 * @swagger
 * /user/email-verify-status:
 *   put:
 *     summary: Update email verification status
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailVerifyStatus
 *             properties:
 *               emailVerifyStatus:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Email verification status updated successfully
 *       400:
 *         description: Mandatory field missing
 *       500:
 *         description: Failed to update email verification status
 */
user.route("/email-verify-status").put(authenticate, emailVerifyStatus);

/**
 * @swagger
 * /user/mobile-verify-status:
 *   put:
 *     summary: Update mobile verification status and send confirmation email
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileVerifyStatus
 *             properties:
 *               mobileVerifyStatus:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Mobile verification status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     phone_verified:
 *                       type: boolean
 *       400:
 *         description: Missing mobileVerifyStatus or invalid input
 *       500:
 *         description: Server error while updating mobile verification status
 */

user.route("mobile-verify-status").put(authenticate, updateMobileVerify);

/**
 * @swagger
 * /user/update-referral-code/{id}/:
 *   put:
 *     summary: Update referral code for a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - referral_code
 *             properties:
 *               referral_code:
 *                 type: string
 *                 example: ABC123
 *     responses:
 *       200:
 *         description: Referral code updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     referral_code:
 *                       type: string
 *       400:
 *         description: Missing or invalid referral_code
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
user
  .route("/update-referral-code/:id/")
  .put(authenticate, hasRole("admin"), updateReferralCode);

/**
 * @swagger
 * /user/add-user/:
 *   post:
 *     summary: Add a new user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - mobile
 *               - email
 *               - password
 *               - user_type_id
 *             properties:
 *               company_id:
 *                 type: integer
 *               user_type_id:
 *                 type: integer
 *               parent_id:
 *                 type: integer
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               password:
 *                 type: string
 *               mobile_prefix:
 *                 type: string
 *               nationality:
 *                 type: string
 *               signup_status:
 *                 type: integer
 *               user_grade:
 *                 type: string
 *               pref_city:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Duplicate user or validation error
 *       500:
 *         description: Internal server error
 */
user.route("/add-user").post(authenticate, addUser);

/**
 * @swagger
 * /user/status-history:
 *   get:
 *     summary: Get login/logout status history of a user within a date range
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the driver
 *       - in: query
 *         name: from_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start datetime (YYYY-MM-DD HH:mm:ss)
 *       - in: query
 *         name: to_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End datetime (YYYY-MM-DD HH:mm:ss)
 *     responses:
 *       200:
 *         description: Status history fetched successfully
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
 *                       login_time:
 *                         type: string
 *                         format: date-time
 *                       logout_time:
 *                         type: string
 *                         format: date-time
 *                       login_location:
 *                         type: string
 *                       logout_location:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       total_hrs:
 *                         type: string
 *                         description: Total hours logged in (HH:mm:ss)
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
user.route("/status-history").get(authenticate, statusHistory);

/**
 * @swagger
 * /user/user-details-by-parent:
 *   post:
 *     summary: Get user details by parent ID and other optional filters
 *     description: Returns user details from view_company_vendor_driver based on provided filter criteria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The ID of the user.
 *               user_type:
 *                 type: integer
 *                 description: The child user type ID.
 *               company_id:
 *                 type: integer
 *                 description: The ID of the company.
 *               user_type_id:
 *                 type: integer
 *                 description: The user type ID.
 *     responses:
 *       200:
 *         description: Successfully fetched user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Internal server error
 */
user.route("/details-by-parent").post(authenticate, getUserDetailByParentId);

/**
 * @swagger
 * /user/staff:
 *   post:
 *     summary: Get list of staff users under a parent user
 *     tags: [User]
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
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 101
 *               user_type_id:
 *                 oneOf:
 *                   - type: integer
 *                     example: 3
 *                   - type: array
 *                     items:
 *                       type: integer
 *                     example: [2, 3]
 *     responses:
 *       200:
 *         description: Staff users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Data fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                             example: 101
 *                           first_name:
 *                             type: string
 *                             example: John
 *                           last_name:
 *                             type: string
 *                             example: Doe
 *                           email:
 *                             type: string
 *                             example: john.doe@example.com
 *                           user_type_name:
 *                             type: string
 *                             example: Admin
 *                           # Add additional properties if needed
 *       400:
 *         description: Missing required user_id
 *       500:
 *         description: Server error
 */
user.route("/staff").post(authenticate, getUserStaff);

user.route("/users").post(authenticate, getUsers);
/**
 * @swagger
 * /user/staff-details:
 *   post:
 *     summary: Get detailed information of a user/staff by user ID
 *     tags: [User]
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
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user to fetch details for
 *     responses:
 *       200:
 *         description: Staff user details fetched successfully
 *       400:
 *         description: Missing user_id or invalid request
 *       404:
 *         description: No data found for given user_id
 *       500:
 *         description: Internal server error
 */
user.route("/staff-details").post(authenticate, getUserStaffDetails);

/**
 * @swagger
 * /user/update-duty-status:
 *   post:
 *     summary: Update duty status of a user
 *     tags: [User]
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
 *               - duty_status
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user
 *               duty_status:
 *                 type: boolean
 *                 description: New duty status (true/false)
 *     responses:
 *       200:
 *         description: Duty status updated successfully
 *       400:
 *         description: Missing user_id or duty_status
 *       404:
 *         description: No user found with given ID
 *       500:
 *         description: Internal server error
 */
user.route("/update-duty-status").post(authenticate, updateDutyStatus);

/**
 * @swagger
 * /user/update-staff:
 *   post:
 *     summary: Update staff details, role, and assigned modules sequentially
 *     tags: [User]
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
 *               - first_name
 *               - last_name
 *               - email
 *               - mobile
 *               - gender
 *               - role_id
 *               - department_id
 *               - assign_role_id
 *               - moduleids
 *             properties:
 *               user_id:
 *                 type: integer
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               gender:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               department_id:
 *                 type: integer
 *               assign_role_id:
 *                 type: integer
 *               moduleids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               created_by:
 *                 type: integer
 *               created_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
user.route("/update-staff").post(authenticate, updateStaffSequential);
/**
 * @swagger
 * /user/type/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
user.route("/type/:id").post(authenticate, getUserType);
/**
 * @swagger
 * /user/rating:
 *   post:
 *     summary: Add a user rating for a booking and driver
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking_id
 *               - driver_id
 *               - user_id
 *               - rating
 *             properties:
 *               booking_id:
 *                 type: integer
 *               driver_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Rating added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
user.route("/rating").post(authenticate, UserRating);
/**
 * @swagger
 * /user/hierarchy/{user_id}:
 *   get:
 *     summary: Get parent hierarchy for a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user whose hierarchy is to be retrieved
 *     responses:
 *       200:
 *         description: Hierarchy data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 parentData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       parent_id:
 *                         type: integer
 *                       user_grade:
 *                         type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
user.route("/hierarchy/:user_id").get(authenticate, getUserHierarchy);
/**
 * @swagger
 * /user/refer-earn:
 *   post:
 *     summary: Get referral details and SMS message for a user
 *     tags: [User]
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
 *               - user_type_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               user_type_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Referral data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 referral_key:
 *                   type: string
 *                 referral_amount:
 *                   type: number
 *                 refer_amount:
 *                   type: number
 *                 smstext:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
user.route("/refer-earn").get(authenticate, referEarn);
/**
 * @swagger
 * /user/pending-documents:
 *   post:
 *     summary: Get pending documents for a user
 *     tags: [User]
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
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Pending documents fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Document details
 *       404:
 *         description: No pending documents found
 *       500:
 *         description: Internal server error
 */
user.route("/pending-documents").get(authenticate, getUserPendingDoc);
/**
 * @swagger
 * /user/booking-type-mapping:
 *   post:
 *     summary: Fetch user booking type mapping based on filters
 *     tags: [User]
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
 *               booking_type:
 *                 type: string
 *                 description: Comma-separated package IDs (e.g. "1,2,3")
 *               state_id:
 *                 type: integer
 *               auto_id:
 *                 type: integer
 *               city_id:
 *                 type: integer
 *               country_id:
 *                 type: integer
 *               mapping_category:
 *                 type: string
 *               vehicle_type:
 *                 type: integer
 *               booking_type_mode:
 *                 type: integer
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mapping data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Booking type mapping details
 *       404:
 *         description: No record found
 *       500:
 *         description: Internal server error
 */
user
  .route("/booking-type-mapping")
  .post(authenticate, getUserBookingTypeMapping);

/**
 * @swagger
 * /user/credit-history/{user_id}:
 *   get:
 *     summary: Get user's credit/debit transaction history with running balance
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Credit history fetched successfully
 *       404:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */

user.route("/credit-history/:user_id").get(authenticate, userCreditHistory);
/**
 * @swagger
 * /user/upload-credit-balance/{user_id}:
 *   get:
 *     summary: Get user's total credit, debit, and balance
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Credit balance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Data fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 101
 *                         total_debits:
 *                           type: number
 *                           format: float
 *                           example: 150.00
 *                         total_credits:
 *                           type: number
 *                           format: float
 *                           example: 200.00
 *                         balance:
 *                           type: number
 *                           format: float
 *                           example: 50.00
 *       404:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */
user
  .route("/upload-credit-balance/:user_id")
  .get(authenticate, userUploadCreditBalance);
/**
 * @swagger
 * /user/all-credit-balances:
 *   get:
 *     summary: Get credit, debit, and balance for all users with non-zero balance
 *     tags: [User]
 *     responses:
 *       200:
 *         description: All user credit balances fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Credit balances fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         example: 101
 *                       debit_amount:
 *                         type: number
 *                         format: float
 *                         example: 120.50
 *                       credit_amount:
 *                         type: number
 *                         format: float
 *                         example: 200.00
 *                       balance:
 *                         type: number
 *                         format: float
 *                         example: 79.50
 *       404:
 *         description: No user credit balances found
 *       500:
 *         description: Internal server error
 */

user.route("/all-credit-balances").get(authenticate, allUserCreditBalance);
user.route("/user-credit-balance").get(authenticate, singleUserCreditBalance);
/**
 * @swagger
 * /user/city-name:
 *   post:
 *     summary: Search cities by partial name (uses Redis caching)
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 example: "Del"
 *                 description: Partial or full city name to search for
 *     responses:
 *       200:
 *         description: City data fetched successfully (from DB or cache)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     cityData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Internal server error
 */
user.route("/city-name").post(getCityName);

/**
 * @swagger
 * /user/country-name:
 *   post:
 *     summary: Search cities by partial name (uses Redis caching)
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 example: "Del"
 *                 description: Partial or full Country name to search for
 *     responses:
 *       200:
 *         description: Country data fetched successfully (from DB or cache)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     countryData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Internal server error
 */
user.route("/country-name").post(getCountryName);
/**
 * @swagger
 * /user/personal-info:
 *   post:
 *     summary: Submit or update user's personal information
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               father_name:
 *                 type: string
 *                 example: "John Doe Sr."
 *               alternate_email:
 *                 type: string
 *                 example: "alternate@example.com"
 *               alternate_mobile:
 *                 type: string
 *                 example: "9876543210"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, City"
 *               pincode:
 *                 type: string
 *                 example: "560001"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               mobile:
 *                 type: string
 *                 example: "9123456789"
 *               typeId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: User personal info updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: User or profile not found
 *       500:
 *         description: Internal server error
 */

user.route("/personal-info").post(userProfileInfoDetail);
/**
 * @swagger
 * /user/getUserModules:
 *   post:
 *     summary: Get modules associated with the user's license
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of modules fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 modules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       module_id:
 *                         type: integer
 *                       module_name:
 *                         type: string
 *       404:
 *         description: License not found
 *       500:
 *         description: Server error
 */

user.route("/getUserModules").post(getUserModules);
/**
 * @swagger
 * /user/{id}/photo:
 *   post:
 *     summary: Upload user profile photo
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Optional folder name for upload path
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded
 *       400:
 *         description: File missing
 *       500:
 *         description: Server error
 */

user
  .route("/:id/photo")
  .post(
    authenticate,
    requireFolderQuery,
    upload.single("file"),
    uploadUserProfilePhoto
  );
/**
 * @swagger
 * /user/user-documents:
 *   post:
 *     summary: Upload a user document for KYC
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Optional folder for upload path
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               doc_type_id:
 *                 type: integer
 *                 example: 1
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *       400:
 *         description: Missing file or doc_type_id
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

user
  .route("/user-documents")
  .post(
    authenticate,
    requireFolderQuery,
    upload.single("file"),
    uploadUserDocument
  );
/**
 * @swagger
 * /user/documents-list/{doc_level_name}:
 *   get:
 *     summary: Get list of document types for the given level
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doc_level_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Document level name
 *     responses:
 *       200:
 *         description: Document types retrieved
 *       404:
 *         description: No document types found
 *       500:
 *         description: Server error
 */

user
  .route("/documents-list/:doc_level_name")
  .get(authenticate, getDocumentList);

/**
 * @swagger
 * /user/get-recent-user-detail:
 *   post:
 *     summary: Get list of recently updated users
 *     tags: [User]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Partial name, email or mobile for search
 *               user_id:
 *                 type: integer
 *                 description: Parent ID to filter by
 *     responses:
 *       200:
 *         description: List of recent users
 *       500:
 *         description: Server error
 */

user.route("/get-recent-user-detail").post(authenticate, getRecentUserDetail);

user.route("/update-user-status").post(authenticate, updateUserStatus);
user
  .route("/add-relationship-manager")
  .post(authenticate, addRelationShipManager);
user
  .route("/update-relationship-manager")
  .post(authenticate, updateRelationShipManager);

user.route("/send-email-user").post(authenticate, sendStatusToUser);
user.route("/get-user-doc").post(authenticate, getUserUploadedDocument);
user.route("/gst-verification").post(gstNumberVerfied);
user.route("/department/get-all").get(authenticate, getDepartments);
user.route("/department/get/:id").get(authenticate, getDepartmentById);
user.route("/department/add").post(authenticate, addDepartment);
user.route("/department/update/:id").put(authenticate, updateDepartment);
user.route("/department/delete/:id").delete(authenticate, deleteDepartment);
user
  .route("/department/update-user-status")
  .post(authenticate, updateDepartmentStatus);
user.route("/booking-count").post(authenticate, getUserBookingCounts);
user
  .route("/update-booking-mapping-detail")
  .put(authenticate, updateBookingMappingDetail);

user
  .route("/add-user-booking-mapping-detail")
  .post(authenticate, addBookingTypeMappingDetail);

user.put("/card-update/:id", authenticate, updateCardDetail);

user.route("/insert-card").post(authenticate, bulkUpsertCards);
user.route("/get-user-cards").post(authenticate, getUserCards);
user.route("/delete-card").post(authenticate, deleteUserCard);
user.get("/get-user-info/:user_id", getUserInfo);
user.put("/user-info/:userId", updateUserInfoByUserId);
user.post("/edit", authenticate, editUser);
user.get("/signature/:id", authenticate, getUserSignature); // Get signature by user ID
user.get("/duty-info/:user_id", authenticate, getDutyInfo);
user.post("/duty-info/:user_id", authenticate, upsertDutyInfo);
user.post("/signature/:user_id", authenticate, createOrUpdateUserSignature);
user.post("/status/:userId", toggleLoginStatus);

user.delete("/kyc/record/:id", deleteKYCInfo);
user.put("/kyc/record/:id", editKyc); // id = userInfo.id
user.get("/kyc/record/:id", viewKyc);
user.post("/kyc/:id", kycController); // id = userid
user.get("/kyc/:id", getKycUserInfo); // id = userid

user.post("/get-template", getEmailTemp);

user.post("/get-template", getEmailTemp);

// Missing Apis
user.post("/getUserDataList", getUserDataList);

user.post("/saveLoginLogs", saveLoginLogs);

user.put("/update-wallet-amount", updateWalletAmount);

user.post("/change-password", changeUserPassword);
// POST /api/user/forgot-password
user.post("/forgot-password", forgotUserPassword);

user.post("/checkPassword", checkPassword);

user.post("/refer-and-earn", authenticate, referAndEarnSMS);

export default user;
