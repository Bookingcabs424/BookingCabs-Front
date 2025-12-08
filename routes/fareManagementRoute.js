import express from "express";
import {
  acceptCompanyFare,
  addDriverCancellationFare,
  addFare,
  addTaxDetail,
  addUserBasicFare,
  addUserCancellationFare,
  addUserCompanyShare,
  addUserFixRoute,
  addUserNightChare,
  addUserPeakTimeCharge,
  addUserPostalcodeFare,
  addUserPremiumsFare,
  addUserPreWaitingCharge,
  addUserShareDetail,
  addUserWaitingCharge,
  checkFareAccepted,
  fetchCabFareData,
  getAllFareListData,
  getCompanyPrice,
  getDriverCancellationFare,
  getFare,
  getFareDataArray,
  getFareListData,
  getFareListDataFilterCount,
  getPackageMode,
  getUserCancellationFare,
  getUserCompanyShare,
  getUserFixRoute,
  getUserNightCharge,
  getUserPeakTimeCharge,
  getUserPostalcodeFare,
  getUserPremiumsFare,
  getUserPreWaitingCharge,
  getUserTaxDetail,
  getUserTaxDetailData,
  getUserWaitingCharge,
  getVehicleName,
  getVendorFareInfo,
  getVendorFareListDataTableCount,
  getVendorFareListDataTableFilterCount,
  sequentialAddFare,
  updateCabFare,
  updateCabFareData,
  updateCancelFeesStatus,
  updateDispatchData,
  updateDriverCancelFeesStatus,
  updatefareStatus,
  updateFareStatus,
  updateNightFareStatus,
  updateTaxDetail,
  updateTaxDetailStatus,
  updateUserCancellationFare,
  updateUserFareSetting,
  updateUserFixRoute,
  updateUserNightCharge,
  updateUserPreWaitingFeesStatus,
  updateUserShareDetail,
} from "../controllers/fareManagementController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { addUpdateDistanceFareData, addUpdateDistanceHourFareData, addUpdateDistanceUptoRateData, addUpdateDistanceWaitingFareData, getDistanceFares, getDistanceHourFares, getDistanceUptoRates, getDistanceWaitingFares, getHourlyFares, getLocalPackageFares, upsertHourlyFare } from "../controllers/distanceController.js";
import { changeTaxDetailStatus, getBasicFareSettingsWithFilters, getTaxDetailData, upsertBasicFareSetting, upsertMasterPreWaiting, upsertMasterWaiting, upsertTaxDetailData } from "../controllers/codeController.js";
import { bulkUpsertCancellationFares, getCancellationFares, getMasterCancellations } from "../controllers/cancellationController.js";
import { bulkUpsertWaitingCharges, getPreWaitingCharges, getWaitingCharges, upsertPreWaitingCharges } from "../controllers/WaitingController.js";
import { bulkUpsertPostalCodeFares, getPostalCodeFares } from "../controllers/postalCodeController.js";
import { bulkUpsertCompanyShare, getCompanyShares } from "../controllers/companyController.js";
import { getPremiumsFare, upsertPremiumsFare } from "../controllers/premiumFareController.js";
import { getNightCharges, upsertNightCharge } from "../controllers/NightChargeController.js";
import { getPeakTimeCharges, upsertPeakTimeCharge } from "../controllers/peaktimeChargeController.js";
import { getExtras, upsertExtrasFare } from "../controllers/extrasController.js";
import { sendQuotationMail, sendQuotationSMS } from "../controllers/quotationHelper.js";
import { SendbookingEmail } from "../controllers/bookingHelperFunctions.js";
const fareManagementRouter = express.Router();
/**
 * @swagger
 * /fare-management:
 *   get:
 *     summary: Get a greeting message
 *     description: Returns a simple "hello" message (example endpoint)
 *     tags: [Fare Management]
 *     responses:
 *       200:
 *         description: Successful response with greeting
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "hello"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /fare_management/addfare:
 *   post:
 *     summary: Create a new fare configuration
 *     description: |
 *       Creates a complete fare configuration including:
 *       - Base combination
 *       - Vehicle type mapping
 *       - Dispatch location
 *       - One-way route package (if applicable)
 *     tags: [Fare Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_id
 *               - vendor_id
 *               - master_package_id
 *               - rate
 *             properties:
 *               company_id:
 *                 type: integer
 *                 example: 1
 *               vendor_id:
 *                 type: integer
 *                 example: 123
 *               client_id:
 *                 type: integer
 *                 example: 456
 *               country_id:
 *                 type: integer
 *                 example: 1
 *               state_id:
 *                 type: integer
 *                 example: 5
 *               city_id:
 *                 type: integer
 *                 example: 10
 *               master_package_id:
 *                 type: integer
 *                 enum: [1, 2, 3, 4, 5]
 *                 description: 5 indicates one-way package
 *               master_package_mode_id:
 *                 type: integer
 *               market_place:
 *                 type: string
 *               fare_date_from:
 *                 type: string
 *                 format: date
 *               fare_date_to:
 *                 type: string
 *                 format: date
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               rate:
 *                 type: number
 *                 format: float
 *                 example: 25.50
 *               rate_type:
 *                 type: string
 *               rate_value:
 *                 type: number
 *               week_days:
 *                 type: string
 *               created_by:
 *                 type: integer
 *               ip:
 *                 type: string
 *                 format: ipv4
 *               vehicle_type_id:
 *                 type: integer
 *                 description: Required for vehicle type mapping
 *               type_of_dispatch:
 *                 type: integer
 *               garage_type:
 *                 type: integer
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               pincode:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               city_distance_id:
 *                 type: integer
 *                 description: Required when master_package_id=5
 *     responses:
 *       201:
 *         description: Fare configuration created successfully
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
 *                   example: "Data created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     fare_id:
 *                       type: integer
 *                       example: 123
 *                     base_vehicle_id:
 *                       type: integer
 *                       example: 456
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
fareManagementRouter.post("/addfare", authenticate,sequentialAddFare);
fareManagementRouter.post ("/fare-status",authenticate,updatefareStatus)
/**
 * @swagger
 * /fare_management/updatecabfare:
 *   post:
 *     summary: Update cab fare configuration
 *     description: Updates fare configuration including base combination, vehicle type, and dispatch location
 *     tags: [Fare Management]
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
 *               - master_package_id
 *               - type_of_dispatch
 *               - user_id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the fare to update
 *                 example: 123
 *               company_id:
 *                 type: integer
 *                 example: 1
 *               vendor_id:
 *                 type: integer
 *                 example: 45
 *               client_id:
 *                 type: integer
 *                 example: 78
 *               country_id:
 *                 type: integer
 *                 example: 1
 *               state_id:
 *                 type: integer
 *                 example: 5
 *               city_id:
 *                 type: integer
 *                 example: 10
 *               master_package_id:
 *                 type: integer
 *                 enum: [1, 4, 7]
 *                 description: Special packages that affect dispatch type
 *               master_package_mode_id:
 *                 type: integer
 *               market_place:
 *                 type: string
 *               vehicle_type_id:
 *                 type: integer
 *                 description: Associated vehicle type
 *               type_of_dispatch:
 *                 type: integer
 *                 description: Will be converted to 3 for packages 1,4,7 if value is 1
 *               garage_type:
 *                 type: integer
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               pincode:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               user_id:
 *                 type: integer
 *                 description: ID of user making the update
 *               ip:
 *                 type: string
 *                 format: ipv4
 *     responses:
 *       200:
 *         description: Fare updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Fare updated successfully"
 *               data:
 *                 fare_id: 123
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
fareManagementRouter.post("/updatecabfare", updateCabFare);
/**
 * @swagger
 * /fare_management/getFare:
 *   post:
 *     summary: Get fare information with filters
 *     description: |
 *       Retrieves comprehensive fare data with multiple filtering options.
 *       Returns base combination, vehicle type, dispatch location, and route package information.
 *     tags: [Fare Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base_combination_id:
 *                 type: integer
 *                 description: ID of the base combination
 *               base_vehicle_id:
 *                 type: integer
 *                 description: ID of the base vehicle
 *               user_id:
 *                 type: integer
 *                 description: Vendor ID
 *               client_id:
 *                 type: integer
 *                 description: Client ID
 *               state_id:
 *                 type: integer
 *                 description: State ID
 *               city_id:
 *                 type: integer
 *                 description: City ID
 *               master_package_id:
 *                 type: integer
 *                 description: Master package ID
 *               master_package_mode_id:
 *                 type: integer
 *                 description: Master package mode ID
 *               status:
 *                 type: string
 *                 enum: ['0', '1', '2', '3']
 *                 description: Status filter
 *               company_id:
 *                 type: integer
 *                 description: Company ID
 *               vehicle_type_id:
 *                 type: integer
 *                 description: Vehicle type ID
 *               from_date:
 *                 type: string
 *                 format: date
 *                 description: Start date for filtering
 *               to_date:
 *                 type: string
 *                 format: date
 *                 description: End date for filtering
 *               weekdays:
 *                 type: string
 *                 description: Comma-separated weekdays filter (e.g., "1,2,3")
 *               currency:
 *                 type: string
 *                 description: Currency code
 *               created_by:
 *                 type: integer
 *                 description: Creator user ID
 *     responses:
 *       200:
 *         description: Successful response with fare data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FareData'
 *       400:
 *         description: Bad request (invalid parameters)
 *       404:
 *         description: No fares found matching criteria
 *       500:
 *         description: Internal server error
 * 
 * components:
 *   schemas:
 *     FareData:
 *       type: object
 *       properties:
 *         base_combination_id:
 *           type: integer
 *         client_id:
 *           type: integer
 *         master_package_mode_id:
 *           type: integer
 *         master_package_id:
 *           type: integer
 *         date_from:
 *           type: string
 *           format: date
 *         date_to:
 *           type: string
 *           format: date
 *         week_days:
 *           type: string
 *         market_place:
 *           type: integer
 *         bs_status:
 *           type: string
 *         base_vehicle_id:
 *           type: integer
 *         vehicle_type_id:
 *           type: integer
 *         vehicle_master_id:
 *           type: integer
 *         company_setup_name:
 *           type: string
 *         city_id:
 *           type: integer
 *         city_distance_id:
 *           type: integer
 *         distance_km:
 *           type: number
 *         city_name:
 *           type: string
 *         state_name:
 *           type: string
 *         country_code:
 *           type: string
 *         destination_city_name:
 *           type: string
 *         destination_state_name:
 *           type: string
 *         destination_country_code:
 *           type: string
 *         package_name:
 *           type: string
 *         package_mode:
 *           type: string
 *         vendor_name:
 *           type: string
 *         client_name:
 *           type: string
 *         vehicle_type:
 *           type: string
 *         currency_id:
 *           type: integer
 *         currency_city_name:
 *           type: string
 *         currency_city_code:
 *           type: string
 *         currency_city_symbol:
 *           type: string
 *         type_of_dispatch:
 *           type: integer
 *         garage_type:
 *           type: integer
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         pincode:
 *           type: string
 *         latitude:
 *           type: string
 *         longitude:
 *           type: string
 *         status:
 *           type: integer
 *         user_id:
 *           type: integer
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
fareManagementRouter.post('/getFare', getFare);
/**
 * @swagger
 * /fare_management/fareStatus:
 *   put:
 *     summary: Update fare status
 *     description: Update the status of a fare configuration
 *     tags: [Fare Management]
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
 *               - user_id
 *               - fare_status
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the fare to update (can be single ID or comma-separated list)
 *               user_id:
 *                 type: integer
 *                 description: ID of the user making the update
 *               fare_status:
 *                 type: string
 *                 enum: ['0', '1', '2', '3']
 *                 description: New status (0-Inactive, 1-Active, 2-Soft Delete, 3-Expiry)
 *     responses:
 *       200:
 *         description: Fare status updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.put('/fareStatus', authenticate, updateFareStatus);
/**
 * @swagger
 * /fare_management/companyPrice:
 *   get:
 *     summary: Get fare details by company, package, and vendor
 *     tags:
 *       - Fare Management
 *     parameters:
 *       - in: query
 *         name: company_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by company ID
 *       - in: query
 *         name: package_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by package ID
 *       - in: query
 *         name: vendor_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by vendor ID
 *     responses:
 *       200:
 *         description: A list of fare details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ViewVehicleFareDetails'
 *       500:
 *         description: Internal server error
 */

fareManagementRouter.get('/companyPrice',getCompanyPrice)
/**
 * @swagger
 * /fare_management/addtaxdetail:
 *   post:
 *     summary: Add a new tax detail
 *     tags:
 *       - Tax Detail
 *     description: Creates a new tax detail record with charge type, tax percentages, and applicable date range.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - master_booking_type_id
 *               - booking_type
 *               - sac_code
 *               - tax_type
 *               - from_date
 *               - to_date
 *               - created_by
 *               - modified_by
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 101
 *               master_booking_type_id:
 *                 type: integer
 *                 example: 1
 *               booking_type:
 *                 type: integer
 *                 example: 2
 *               charge_type:
 *                 type: string
 *                 example: "BASIC"
 *               sac_code:
 *                 type: integer
 *                 example: 998515
 *               tax_type:
 *                 type: string
 *                 example: "INTRA"
 *               sgst:
 *                 type: number
 *                 format: float
 *                 example: 9.0
 *               cgst:
 *                 type: number
 *                 format: float
 *                 example: 9.0
 *               igst:
 *                 type: number
 *                 format: float
 *                 example: 0.0
 *               from_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               to_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               ip:
 *                 type: string
 *                 example: "192.168.0.1"
 *               created_by:
 *                 type: integer
 *                 example: 1
 *               modified_by:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tax detail successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     insertId:
 *                       type: integer
 *                       example: 42
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 *                 error:
 *                   type: string
 *                   example: Error message details
 */

fareManagementRouter.post('/addtaxdetail',addTaxDetail)
/**
 * @swagger
 * /fare_management/updatetaxdetail:
 *   post:
 *     summary: Update an existing tax detail
 *     tags:
 *       - Tax Detail
 *     description: Updates an existing tax detail record by its `auto_id`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auto_id
 *               - modified_by
 *             properties:
 *               auto_id:
 *                 type: integer
 *                 description: ID of the tax detail record to update
 *                 example: 42
 *               user_id:
 *                 type: integer
 *                 example: 101
 *               master_booking_type_id:
 *                 type: integer
 *                 example: 1
 *               booking_type:
 *                 type: integer
 *                 example: 2
 *               charge_type:
 *                 type: string
 *                 example: "BASIC"
 *               sac_code:
 *                 type: integer
 *                 example: 998515
 *               tax_type:
 *                 type: string
 *                 example: "INTER"
 *               sgst:
 *                 type: number
 *                 format: float
 *                 example: 9.0
 *               cgst:
 *                 type: number
 *                 format: float
 *                 example: 9.0
 *               igst:
 *                 type: number
 *                 format: float
 *                 example: 0.0
 *               from_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               to_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               ip:
 *                 type: string
 *                 example: "192.168.1.1"
 *               modified_by:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Tax detail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Data updated successfully
 *       404:
 *         description: Record not found or no changes made
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Record not found or no changes made
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */

fareManagementRouter.post('/updatetaxdetail', updateTaxDetail);
// API TO GET THE USER TAX DETAILS
/**
 * @swagger
 * /fare_management/getusertaxdetail:
 *   get:
 *     summary: Get tax details for a user
 *     tags:
 *       - Tax Detail
 *     description: Retrieve tax details filtered by optional query parameters.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: User ID to filter tax details
 *       - in: query
 *         name: master_booking_type_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Master booking type ID to filter results
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         required: false
 *         description: Booking type to filter results
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Specific tax detail record ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         required: false
 *         description: Status of the record (e.g., 1 for active)
 *     responses:
 *       200:
 *         description: Tax details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TaxDetail'
 *       404:
 *         description: No record found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: No record found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */

fareManagementRouter.get('/getusertaxdetail', getUserTaxDetail)
/**
 * @swagger
 * /fare_management/getusertaxdetailData:
 *   get:
 *     summary: Get tax details for a user
 *     tags:
 *       - Tax Detail
 *     description: Retrieve tax details filtered by optional query parameters.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: User ID to filter tax details
 *       - in: query
 *         name: master_booking_type_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Master booking type ID to filter results
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         required: false
 *         description: Booking type to filter results
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Specific tax detail record ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         required: false
 *         description: Status of the record (e.g., 1 for active)
 *     responses:
 *       200:
 *         description: Tax details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TaxDetail'
 *       404:
 *         description: No record found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: No record found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */

fareManagementRouter.get('/getusertaxdetailData', getUserTaxDetailData)
/**
 * @swagger
 * /fare_management/adduserbasicfare:
 *   post:
 *     summary: Add a new user basic fare setting
 *     tags: [Fare Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - rounding
 *               - level
 *               - direction
 *               - created_by
 *               - status
 *               - ip
 *             properties:
 *               user_id:
 *                 type: integer
 *               rounding:
 *                 type: integer
 *                 description: 1 for Cash, 2 for Account/Credit Card
 *               level:
 *                 type: integer
 *                 description: 1-Normal, 2-Decimal, 3-Unit
 *               direction:
 *                 type: integer
 *                 description: 1-Nearest, 2-Next, 3-Previous
 *               created_by:
 *                 type: integer
 *               status:
 *                 type: integer
 *               ip:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully added fare setting
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *       500:
 *         description: Server error
 */

fareManagementRouter.post('/adduserbasicfare',addUserBasicFare)
/**
 * @swagger
 * /fare_management/updateuserfaresetting:
 *   post:
 *     summary: Update a user basic fare setting by ID (ID in body)
 *     tags: [Fare Management]
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
 *                 type: integer
 *                 description: ID of the fare setting to update
 *               user_id:
 *                 type: integer
 *               rounding:
 *                 type: integer
 *                 description: 1 for Cash, 2 for Account/Credit Card
 *               level:
 *                 type: integer
 *                 description: 1-Normal, 2-Decimal, 3-Unit
 *               direction:
 *                 type: integer
 *                 description: 1-Nearest, 2-Next, 3-Previous
 *               ip:
 *                 type: string
 *               modified_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Data updated successfully
 *       400:
 *         description: Missing ID in request body
 *       404:
 *         description: No matching record found
 *       500:
 *         description: Internal server error
 */

fareManagementRouter.post('/updateuserfaresetting',updateUserFareSetting)
/**
 * @swagger
 * /fare_management/addusernightcharge:
 *   post:
 *     summary: Add a new user night charge
 *     tags: [Fare Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - booking_type
 *               - night_rate_begins
 *               - night_rate_ends
 *               - night_rate_type
 *               - night_rate_value
 *               - from_date
 *               - to_date
 *               - created_by
 *             properties:
 *               user_id:
 *                 type: integer
 *               booking_type:
 *                 type: integer
 *               night_rate_begins:
 *                 type: string
 *                 format: time
 *                 example: "22:00:00"
 *               night_rate_ends:
 *                 type: string
 *                 format: time
 *                 example: "06:00:00"
 *               night_rate_type:
 *                 type: string
 *                 example: "1"
 *                 description: 1 for %, 2 for fixed value
 *               night_rate_value:
 *                 type: string
 *                 example: "100"
 *               from_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               to_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-31"
 *               created_by:
 *                 type: integer
 *               ip:
 *                 type: string
 *                 example: "192.168.0.1"
 *     responses:
 *       200:
 *         description: Successfully added the user night charge
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserNightCharge'
 *       500:
 *         description: Server error
 */

fareManagementRouter.post('/addusernightcharge',addUserNightChare)
/**
 * @swagger
 * /fare_management/getusernightcharge:
 *   get:
 *     summary: Retrieve user night charge records
 *     tags: [Fare Management]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID of the user
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         required: false
 *         description: Booking type identifier
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Record ID of the night charge
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         required: false
 *         description: Status of the record (e.g., 1 for active)
 *     responses:
 *       200:
 *         description: List of matching night charge records or a failure message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserNightCharge'
 *       500:
 *         description: Server error
 */

fareManagementRouter.get('/getusernightcharge',getUserNightCharge)
/**
 * @swagger
 * /fare_management/updateusernightcharge:
 *   post:
 *     summary: Update a user night charge record
 *     tags: [Fare Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auto_id
 *               - modified_by
 *             properties:
 *               auto_id:
 *                 type: integer
 *               booking_type:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               night_rate_begins:
 *                 type: string
 *                 format: time
 *               night_rate_ends:
 *                 type: string
 *                 format: time
 *               night_rate_type:
 *                 type: string
 *               night_rate_value:
 *                 type: string
 *               from_date:
 *                 type: string
 *                 format: date
 *               to_date:
 *                 type: string
 *                 format: date
 *               ip:
 *                 type: string
 *               modified_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Update result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

fareManagementRouter.post('/updateusernightcharge',updateUserNightCharge)/**
* @swagger
* /fare_management/getusercancellationfare:
*   get:
*     summary: Get user cancellation fare configuration
*     description: Retrieves user cancellation fare details with optional filters like user ID, booking type, etc.
*     tags:
*       - User Cancellation Fares
*     parameters:
*       - in: query
*         name: user_id
*         schema:
*           type: integer
*         description: User ID to filter fare rules
*       - in: query
*         name: master_booking_type_id
*         schema:
*           type: integer
*         description: Booking type ID
*       - in: query
*         name: booking_type
*         schema:
*           type: string
*         description: Booking type name (e.g., "immediate", "scheduled")
*       - in: query
*         name: vehicle_type
*         schema:
*           type: integer
*         description: Vehicle type ID
*     responses:
*       200:
*         description: Fare records found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: success
*                 data:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       id:
*                         type: integer
*                       cancellation_type:
*                         type: string
*                       cancellation_value:
*                         type: number
*                       from_date:
*                         type: string
*                         format: date
*                       to_date:
*                         type: string
*                         format: date
*                       status:
*                         type: boolean
*                       cancellation:
*                         type: object
*                         properties:
*                           name:
*                             type: string
*                           description:
*                             type: string
*                           order_by:
*                             type: integer
*                       currency:
*                         type: object
*                         properties:
*                           fa_icon:
*                             type: string
*       404:
*         description: No record found
*       500:
*         description: Server error
*/

fareManagementRouter.get('/getusercancellationfare',getUserCancellationFare)
/**
 * @swagger
 *
 * /fare_management/getusercancellationfare:
 *   get:
 *     tags:
 *       - Driver Cancellation Fares
 *     summary: Retrieve driver cancellation fares
 *     description: Returns cancellation fare information for a specific driver with optional filters
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the driver/user to retrieve fares for
 *       - in: query
 *         name: master_booking_type_id
 *         schema:
 *           type: integer
 *         description: Optional filter by master booking type ID
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         description: Optional filter by booking type
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DriverCancellationFare'
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: No record found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *
 * components:
 *   schemas:
 *     DriverCancellationFare:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 50
 *         currency_id:
 *           type: integer
 *           example: 1
 *         cancellation_master_id:
 *           type: integer
 *           example: 1
 *         booking_type:
 *           type: integer
 *           example: 1
 *         master_booking_type_id:
 *           type: integer
 *           example: 1
 *         cancellation_type:
 *           type: string
 *           enum: [Rs, %]
 *           example: Rs
 *         cancellation_value:
 *           type: number
 *           format: float
 *           example: 100
 *         from_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         to_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         created_by:
 *           type: integer
 *           example: 1538
 *         status:
 *           type: integer
 *           enum: [0, 1, 2]
 *           description: 0-Inactive, 1-Active, 2-Deleted
 *           example: 1
 *         days:
 *           type: string
 *           example: "0"
 *         hours:
 *           type: string
 *           example: "0"
 *         name:
 *           type: string
 *           description: Name from MasterCancellation
 *           example: "Standard Cancellation"
 *         description:
 *           type: string
 *           description: Description from MasterCancellation
 *           example: "Standard cancellation policy"
 *         currency_icon:
 *           type: string
 *           description: Icon from MasterCurrency
 *           example: "₹"
 */
fareManagementRouter.get('/getdrivercancellationfare',getDriverCancellationFare)
/**
 * @swagger
 * 
 * /fare_management/updateusercancellationfare:
 *   post:
 *     tags:
 *       - User Cancellation Fares
 *     summary: Update user cancellation fare
 *     description: Updates an existing user cancellation fare record
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - user_id
 *               - cancellation_master_id
 *               - cancellation_type
 *               - cancellation_value
 *               - modified_by
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 50
 *                 description: ID of the record to update
 *               user_id:
 *                 type: integer
 *                 example: 1538
 *                 description: ID of the user/driver
 *               cancellation_master_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the cancellation type
 *               cancellation_type:
 *                 type: string
 *                 enum: [Rs, %]
 *                 example: Rs
 *                 description: Type of cancellation fee
 *               cancellation_value:
 *                 type: number
 *                 format: float
 *                 example: 100
 *                 description: Value of the cancellation fee
 *               from_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: null
 *                 description: Start date of applicability
 *               to_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: null
 *                 description: End date of applicability
 *               modified_by:
 *                 type: integer
 *                 example: 1538
 *                 description: ID of the user making the update
 *     responses:
 *       200:
 *         description: Successfully updated the record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Data updated successfully
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Invalid input data
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Record not found or no changes made
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
fareManagementRouter.post('/updateusercancellationfare',updateUserCancellationFare)
/**
 * @swagger
 *
 * /fare_management/adduserwaitingcharge:
 *   post:
 *     tags:
 *       - User Waiting Charges
 *     summary: Add or update user waiting charges
 *     description: >
 *       Replaces all existing waiting charges for a specific user and booking type
 *       with new charges provided in the request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - booking_type
 *               - waitingfaredata
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1538
 *                 description: ID of the user/driver
 *               booking_type:
 *                 type: integer
 *                 example: 1
 *                 description: Type of booking (1=Standard, etc.)
 *               waitingfaredata:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - booking_type
 *                     - user_id
 *                     - waiting_minute_upto
 *                     - waiting_fees
 *                     - created_by
 *                   properties:
 *                     booking_type:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 1538
 *                     waiting_minute_upto:
 *                       type: string
 *                       maxLength: 5
 *                       example: "10"
 *                       description: Maximum waiting minutes before charges apply
 *                     waiting_fees:
 *                       type: string
 *                       maxLength: 5
 *                       example: "100"
 *                       description: Fee charged per waiting period
 *                     created_by:
 *                       type: integer
 *                       example: 1538
 *                       description: ID of user creating this record
 *                     ip:
 *                       type: string
 *                       example: "127.0.0.1"
 *                       description: IP address of requester
 *     responses:
 *       200:
 *         description: Waiting charges successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/SuccessResponseWithData'
 *                 - $ref: '#/components/schemas/SuccessResponseWithMessage'
 *       400:
 *         description: Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     SuccessResponseWithData:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             affectedRows:
 *               type: integer
 *               example: 2
 *     SuccessResponseWithMessage:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: No records inserted
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: failed
 *         message:
 *           type: string
 *           example: user_id and booking_type are required
 */
fareManagementRouter.post('/adduserwaitingcharge',addUserWaitingCharge)
/**
 * @swagger
 * /fare_management/getuserwaitingcharge:
 *   get:
 *     tags:
 *       - User Waiting Charges
 *     summary: Get user waiting charges
 *     description: Retrieve waiting charges for a user, optionally filtered by booking type
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve charges for
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         description: Optional booking type filter
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserWaitingCharge'
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: No record found
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.get('/getuserwaitingcharge',getUserWaitingCharge)
/**
 * @swagger
 * /fare_management/adduserprewaitingcharge:
 *   post:
 *     tags:
 *       - User Pre-Waiting Charges
 *     summary: Add or update user pre-waiting charges
 *     description: Replaces all pre-waiting charges for a user with new charges
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - booking_type
 *               - prewaitingfaredata
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1111
 *               booking_type:
 *                 type: integer
 *                 example: 1
 *               prewaitingfaredata:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - booking_type
 *                     - user_id
 *                     - pre_waiting_upto_minutes
 *                     - pre_waiting_fees
 *                     - created_by
 *                   properties:
 *                     booking_type:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     pre_waiting_upto_minutes:
 *                       type: string
 *                     pre_waiting_fees:
 *                       type: string
 *                     created_by:
 *                       type: integer
 *                     ip:
 *                       type: string
 *     responses:
 *       200:
 *         description: Successfully updated pre-waiting charges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.post('/adduserprewaitingcharge',addUserPreWaitingCharge)
/**
 * @swagger
 * /fare_management/getuserprewaitingcharge:
 *   get:
 *     tags:
 *       - User Pre-Waiting Charges
 *     summary: Get user pre-waiting charges
 *     description: Retrieve pre-waiting charges for a user, optionally filtered by booking type
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve charges for
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         description: Optional booking type filter
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserPreWaitingCharge'
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: No record found
 *       500:
 *         description: Internal server error
 */

fareManagementRouter.get('/getuserprewaitingcharge',getUserPreWaitingCharge)
/**
 * @swagger
 * /fare_mangement/adduserpremiumfare:
 *   post:
 *     tags:
 *       - User Premiums Fare
 *     summary: Add user premium fare
 *     description: Creates a new premium fare record for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - booking_type
 *               - premiums_type
 *               - premiums_value
 *               - created_by
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1538
 *               booking_type:
 *                 type: integer
 *                 example: 1
 *               premiums_type:
 *                 type: string
 *                 enum: ['1', '2', 'Value']
 *                 example: '1'
 *                 description: '1-% or 2-Value'
 *               premiums_value:
 *                 type: string
 *                 maxLength: 5
 *                 example: '200'
 *               from_date:
 *                 type: string
 *                 format: date
 *                 example: '2020-03-12'
 *               to_date:
 *                 type: string
 *                 format: date
 *                 example: '2020-03-30'
 *               created_by:
 *                 type: integer
 *                 example: 1538
 *               ip:
 *                 type: string
 *                 example: '127.0.0.1'
 *     responses:
 *       201:
 *         description: Premium fare created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserPremiumsFare'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.post('/adduserpremiumsfare',addUserPremiumsFare)
/**
 * @swagger
 * /fare_management/getuserpremiumsfare:
 *   get:
 *     tags:
 *       - User Premiums Fare
 *     summary: Get user premium fare
 *     description: Retrieve active premium fare for a user, optionally filtered by booking type
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve premium fare for
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         description: Optional booking type filter
 *     responses:
 *       200:
 *         description: Premium fare retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserPremiumsFare'
 *       404:
 *         description: No active premium fare found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: No record found
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.get('/getuserpremiumsfare',getUserPremiumsFare)
/**
 * @swagger
 * /fare_management/adduserpostalcode:
 *   post:
 *     tags:
 *       - User Postalcode Fares
 *     summary: Add or update user postalcode fares
 *     description: Replaces all postalcode fares for a user with new fares
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - postalcodedata
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1538
 *               postalcodedata:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - booking_type
 *                     - user_id
 *                     - pickup_postcode
 *                     - drop_postcode
 *                     - price
 *                     - created_by
 *                   properties:
 *                     booking_type:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 1538
 *                     pickup_postcode:
 *                       type: string
 *                       example: "110030"
 *                     drop_postcode:
 *                       type: string
 *                       example: "110034"
 *                     price:
 *                       type: string
 *                       example: "100"
 *                     created_by:
 *                       type: integer
 *                       example: 1538
 *                     ip:
 *                       type: string
 *                       example: "127.0.0.1"
 *     responses:
 *       200:
 *         description: Successfully updated postalcode fares
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.post('/adduserpostalcode',addUserPostalcodeFare)
/**
 * @swagger
 * /fare_management/getuserpostalcode:
 *   get:
 *     tags:
 *       - User Postalcode Fares
 *     summary: Get user postalcode fares
 *     description: Retrieve active postalcode fares for a user, optionally filtered by booking type
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve fares for
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         description: Optional booking type filter
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserPostalcodeFare'
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: No record found
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.get('/getuserpostalcode',getUserPostalcodeFare)

/**
 * @swagger
 * /fare_management/adduserfixroute:
 *   post:
 *     tags:
 *       - User Fix Routes
 *     summary: Add a user's fixed route
 *     description: Create a new fixed route record for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - booking_type
 *               - frequent_location
 *               - created_by
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1538
 *               booking_type:
 *                 type: integer
 *                 example: 1
 *               frequent_location:
 *                 type: string
 *                 example: "Home to Office"
 *               status:
 *                 type: integer
 *                 example: 1
 *                 description: "0-Inactive, 1-Active"
 *               created_by:
 *                 type: integer
 *                 example: 1538
 *               ip:
 *                 type: string
 *                 example: "127.0.0.1"
 *     responses:
 *       201:
 *         description: Fix route created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserFixRoute'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.post('/adduserfixroute',addUserFixRoute)
/**
 * @swagger
 * /fare_management/updateuserfixroute/{id}:
 *   post:
 *     tags:
 *       - User Fix Routes
 *     summary: Update a user's fixed route
 *     description: Update an existing fixed route record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the fix route to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1538
 *               booking_type:
 *                 type: integer
 *                 example: 1
 *               frequent_location:
 *                 type: string
 *                 example: "Updated Route Name"
 *               status:
 *                 type: integer
 *                 example: 1
 *                 description: "0-Inactive, 1-Active"
 *               modified_by:
 *                 type: integer
 *                 example: 1538
 *               ip:
 *                 type: string
 *                 example: "127.0.0.1"
 *     responses:
 *       200:
 *         description: Fix route updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Data updated successfully
 *       404:
 *         description: Record not found
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.post('/updateuserfixroute/:id',updateUserFixRoute)
/**
 * @swagger
 * /fare_management/getuserfixroute:
 *   get:
 *     tags:
 *       - User Fix Routes
 *     summary: Get user's fixed routes
 *     description: Retrieve active fixed routes for a user, optionally filtered by booking type
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve routes for
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         description: Optional booking type filter
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserFixRoute'
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: No record found
 *       500:
 *         description: Internal server error
 */

fareManagementRouter.get('/getuserfixroute',getUserFixRoute)
/**
 * @swagger
 * /fare_management/addusercancellationfare:
 *   post:
 *     tags:
 *       - User Cancellation Fares
 *     summary: Add/Update user cancellation fares
 *     description: Archives existing fares and replaces with new cancellation fares
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - booking_type
 *               - master_booking_type_id
 *               - vehicle_type
 *               - cancelfaredata
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 123
 *               booking_type:
 *                 type: integer
 *                 example: 1
 *               master_booking_type_id:
 *                 type: integer
 *                 example: 2
 *               vehicle_type:
 *                 type: integer
 *                 example: 3
 *               cancelfaredata:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - vehicle_type
 *                     - cancellation_master_id
 *                     - cancellation_type
 *                     - cancellation_value
 *                     - created_by
 *                   properties:
 *                     vehicle_type:
 *                       type: integer
 *                     cancellation_master_id:
 *                       type: integer
 *                     cancellation_type:
 *                       type: string
 *                     cancellation_value:
 *                       type: number
 *                     days:
 *                       type: string
 *                     hours:
 *                       type: string
 *                     created_by:
 *                       type: integer
 *                     ip:
 *                       type: string
 *     responses:
 *       200:
 *         description: Cancellation fares updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.post('/addusercancellationfare',addUserCancellationFare)
/**
 * @swagger
 * /fare_management/adddrivercancellationfare:
 *   post:
 *     summary: Add or update driver cancellation fares
 *     tags:
 *       - Driver Cancellation Fares
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currency_id
 *               - user_id
 *               - booking_type
 *               - master_driver_cancellation_id
 *               - cancelfaredata
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 123
 *               booking_type:
 *                 type: string
 *                 example: "local"
 *               master_driver_cancellation_id:
 *                 type: integer
 *                 example: 1
 *               cancelfaredata:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - cancellation_master_id
 *                     - cancellation_type
 *                     - cancellation_value
 *                   properties:
 *                     cancellation_master_id:
 *                       type: integer
 *                       example: 1
 *                     cancellation_type:
 *                       type: string
 *                       example: "time_based"
 *                     cancellation_value:
 *                       type: number
 *                       example: 50.0
 *                     days:
 *                       type: string
 *                       example: "1"
 *                     hours:
 *                       type: string
 *                       example: "2"
 *                     from_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-06T00:00:00Z"
 *                     to_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-06T00:00:00Z"
 *                     created_by:
 *                       type: integer
 *                       example: 123
 *                     modified_by:
 *                       type: integer
 *                       example: 123
 *                     ip:
 *                       type: string
 *                       example: "192.168.0.1"
 *                     status:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Driver cancellation fares updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     archivedCount:
 *                       type: integer
 *                       example: 5
 *                     createdCount:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Bad request (missing or invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

fareManagementRouter.post('/adddrivercancellationfare',addDriverCancellationFare)
/**
 * @swagger
 * /fare_management/adduserpeaktimecharge:
 *   post:
 *     summary: Update user peak time charges
 *     description: Deletes existing peak time charges and inserts new ones for a user
 *     tags: [Fare Management]
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
 *                 example: 123
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     booking_type:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     start_time:
 *                       type: string
 *                       format: time
 *                     end_time:
 *                       type: string
 *                       format: time
 *                     peaktime_type:
 *                       type: string
 *                     peaktime_value:
 *                       type: number
 *                     created_by:
 *                       type: integer
 *                     ip:
 *                       type: string
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
fareManagementRouter.post('/adduserpeaktimecharge',addUserPeakTimeCharge)
/**
 * @swagger
 * /fare_management/getuserpeaktimecharge:
 *   get:
 *     summary: Get user peak time charges
 *     description: Retrieves peak time charges for users with optional filters
 *     tags: [Fare Management]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: integer
 *         description: Filter by booking type
 *     responses:
 *       200:
 *         description: Successfully retrieved peak time charges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PeakTimeCharge'
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "No records found"
 *       500:
 *         description: Internal server error
 */

fareManagementRouter.get('/getuserpeaktimecharge',getUserPeakTimeCharge)
/**
 * @swagger
 * /fare_management/addusercompanyshare:
 *   post:
 *     summary: Add or update user's company share configuration.
 *     tags:
 *       - Fare Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking_type
 *               - share_type_id
 *               - share_value_type
 *               - share_value
 *               - created_by
 *               - status
 *               - ip
 *             properties:
 *               booking_type:
 *                 type: string
 *                 example: "rental"
 *               share_type_id:
 *                 type: integer
 *                 example: 2
 *               share_value_type:
 *                 type: string
 *                 enum: ["percentage", "fixed"]
 *                 example: "percentage"
 *               share_value:
 *                 type: number
 *                 format: float
 *                 example: 15.5
 *               created_by:
 *                 type: integer
 *                 example: 101
 *               status:
 *                 type: string
 *                 enum: ["active", "inactive"]
 *                 example: "active"
 *               ip:
 *                 type: string
 *                 example: "192.168.0.1"
 *     responses:
 *       201:
 *         description: Company share successfully created or updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Data created successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid user ID or missing required fields.
 *       500:
 *         description: Internal server error.
 */

fareManagementRouter.post('/addusercompanyshare',addUserCompanyShare)
/**
 * @swagger
 * /fare_management/getusercompanyshare:
 *   get:
 *     summary: Retrieve company share data for a user
 *     tags:
 *       - Fare Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of the user to fetch company share for
 *       - in: query
 *         name: booking_type
 *         schema:
 *           type: string
 *         description: Type of booking (e.g., rental, outstation, etc.)
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: Specific ID of a company share record
 *     responses:
 *       200:
 *         description: Company share data successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Data fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       id: 1
 *                       user_id: 123
 *                       booking_type: "rental"
 *                       share_type_id: 2
 *                       share_value_type: "percentage"
 *                       share_value: "15"
 *                       status: "active"
 *                       ip: "192.168.0.1"
 *       404:
 *         description: No records found
 *       500:
 *         description: Internal server error
 */

fareManagementRouter.get('/getusercompanyshare',getUserCompanyShare)
/**
 * @swagger
 * /fare_management/updateusersharedetail:
 *   post:
 *     summary: Update user company share details
 *     description: Updates the share configuration for a specific user/company record
 *     tags: [Fare Management]
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
 *                 description: ID of the record to update
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 description: Associated user ID
 *                 example: 123
 *               booking_type:
 *                 type: integer
 *                 description: Type of booking (1=Instant, 2=Reserved, etc.)
 *                 example: 2
 *               company_share_type:
 *                 type: integer
 *                 description: Type of company share calculation
 *                 example: 1
 *               company_share_value:
 *                 type: string
 *                 description: Company share value (percentage or fixed amount)
 *                 example: "15%"
 *               partner_share_type:
 *                 type: integer
 *                 description: Type of partner share calculation
 *                 example: 2
 *               partner_share_value:
 *                 type: string
 *                 description: Partner share value
 *                 example: "20%"
 *               driver_share_type:
 *                 type: integer
 *                 description: Type of driver share calculation
 *                 example: 3
 *               driver_share_value:
 *                 type: string
 *                 description: Driver share value
 *                 example: "65%"
 *               status:
 *                 type: boolean
 *                 description: Active/inactive status
 *                 example: true
 *               ip:
 *                 type: string
 *                 description: IP address of the requester
 *                 example: "192.168.1.100"
 *               modified_by:
 *                 type: integer
 *                 description: User ID of the modifier
 *                 example: 101
 *     responses:
 *       200:
 *         description: Successfully updated record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Data updated successfully"
 *       400:
 *         description: Bad request - missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "Record ID (auto_id) is required"
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "No record found with the specified ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
fareManagementRouter.post('/updateusersharedetail',updateUserShareDetail)
/**
 * @swagger
 * /fare_management/addusersharedeatil:
 *   post:
 *     summary: Create a new user share detail record
 *     description: Add a new entry for user's share details including company, partner, and driver share information
 *     tags:
 *       - User Share Details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - booking_type
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user
 *               booking_type:
 *                 type: string
 *                 description: Type of booking
 *                 enum: [ride, delivery, both]
 *               company_share_type:
 *                 type: string
 *                 description: Type of company share (percentage/fixed)
 *                 enum: [percentage, fixed]
 *               company_share_value:
 *                 type: number
 *                 description: Value of company share
 *               partner_share_type:
 *                 type: string
 *                 description: Type of partner share (percentage/fixed)
 *                 enum: [percentage, fixed]
 *               partner_share_value:
 *                 type: number
 *                 description: Value of partner share
 *               driver_share_type:
 *                 type: string
 *                 description: Type of driver share (percentage/fixed)
 *                 enum: [percentage, fixed]
 *               driver_share_value:
 *                 type: number
 *                 description: Value of driver share
 *               status:
 *                 type: boolean
 *                 description: Status of the record
 *               created_by:
 *                 type: integer
 *                 description: ID of the user who created this record
 *               ip:
 *                 type: string
 *                 description: IP address of the requester
 *     responses:
 *       201:
 *         description: User share detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserShareDetail'
 *       400:
 *         description: Bad request or something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Error message details
 * 
 * components:
 *   schemas:
 *     UserShareDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the share detail
 *         user_id:
 *           type: integer
 *           description: ID of the user
 *         booking_type:
 *           type: string
 *           description: Type of booking
 *         company_share_type:
 *           type: string
 *           description: Type of company share
 *         company_share_value:
 *           type: number
 *           description: Value of company share
 *         partner_share_type:
 *           type: string
 *           description: Type of partner share
 *         partner_share_value:
 *           type: number
 *           description: Value of partner share
 *         driver_share_type:
 *           type: string
 *           description: Type of driver share
 *         driver_share_value:
 *           type: number
 *           description: Value of driver share
 *         status:
 *           type: boolean
 *           description: Status of the record
 *         created_by:
 *           type: integer
 *           description: ID of the creator
 *         ip:
 *           type: string
 *           description: IP address of the requester
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of creation
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 */

fareManagementRouter.post('/addusersharedeatil',addUserShareDetail)
/**
 * @swagger
 * /fare_management/userTaxDetailStatus:
 *   put:
 *     summary: Add a user share detail
 *     tags:
 *       - UserCompanyShare
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 123
 *               booking_type:
 *                 type: string
 *                 example: "outstation"
 *               company_share_type:
 *                 type: string
 *                 example: "percentage"
 *               company_share_value:
 *                 type: number
 *                 example: 20
 *               partner_share_type:
 *                 type: string
 *                 example: "fixed"
 *               partner_share_value:
 *                 type: number
 *                 example: 50
 *               driver_share_type:
 *                 type: string
 *                 example: "percentage"
 *               driver_share_value:
 *                 type: number
 *                 example: 30
 *               status:
 *                 type: string
 *                 example: "active"
 *               created_by:
 *                 type: integer
 *                 example: 1
 *               ip:
 *                 type: string
 *                 example: "192.168.0.1"
 *     responses:
 *       201:
 *         description: User share detail successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserCompanyShare'
 *       400:
 *         description: Failed to create user share detail
 *       500:
 *         description: Internal server error
 */


fareManagementRouter.put('/userTaxDetailStatus',updateTaxDetailStatus)
/**
 * @swagger
 * /fare_management/userNightFareDetailStatus:
 *   put:
 *     summary: Update the status of one or more night fare entries
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - user_id
 *               - status
 *             properties:
 *               id:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: integer
 *                 description: ID(s) of the night fare entries (comma-separated string or array)
 *                 example: "1,2,3"
 *               user_id:
 *                 type: integer
 *                 description: ID of the user performing the update
 *                 example: 101
 *               status:
 *                 type: boolean
 *                 description: New status (true for active, false for inactive)
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated night fare status
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
 *                   example: Successfully updated 3 record(s)
 *                 data:
 *                   type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: No matching records found
 *       500:
 *         description: Internal server error
 */

fareManagementRouter.put('/userNightFareDetailStatus',updateNightFareStatus)
/**
 * @swagger
 * /fare_management/userCancelFeesStatus:
 *   put:
 *     summary: Update the status of one or more cancellation fee records
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - user_id
 *               - status
 *             properties:
 *               id:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: integer
 *                 description: ID(s) of the cancellation fee records to update (array or comma-separated string)
 *                 example: "5,6,7"
 *               user_id:
 *                 type: integer
 *                 description: ID of the user performing the update
 *                 example: 102
 *               status:
 *                 type: boolean
 *                 description: New status value (true for active, false for inactive)
 *                 example: false
 *     responses:
 *       200:
 *         description: Successfully updated cancellation fee status
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
 *                   example: Successfully updated 2 record(s)
 *                 affectedRows:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: No matching records found to update
 *       500:
 *         description: Failed to update cancellation fees
 */

fareManagementRouter.put('/userCancelFeesStatus',updateCancelFeesStatus)
/**
 * @swagger
 * /fare_management/driverCancelFeesStatus:
 *   put:
 *     summary: Update the status of one or more driver cancellation fee records
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - user_id
 *               - status
 *             properties:
 *               id:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: integer
 *                 description: ID(s) of the driver cancellation fee records (comma-separated or array)
 *                 example: "3,4,5"
 *               user_id:
 *                 type: integer
 *                 description: ID of the user performing the update
 *                 example: 201
 *               status:
 *                 type: boolean
 *                 description: New status value (true = active, false = inactive)
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated driver cancellation fee status
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
 *                   example: Successfully updated 3 record(s)
 *                 affectedRows:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: No records found to update
 *       500:
 *         description: Server error during update
 */

fareManagementRouter.put('/driverCancelFeesStatus',updateDriverCancelFeesStatus)


fareManagementRouter.put('/userPreWaitingFeesStatus',updateUserPreWaitingFeesStatus)
/**
 * @swagger
 * /fare_management/getVendorFareInfo:
 *   get:
 *     summary: Get fare information for vendors
 *     description: Retrieve fare details based on vehicle type or vehicle master ID
 *     tags:
 *       - Fare Management
 *     parameters:
 *       - in: query
 *         name: vehicle_type_id
 *         schema:
 *           type: integer
 *         description: ID of the vehicle type
 *         required: false
 *       - in: query
 *         name: vehicle_master_id
 *         schema:
 *           type: integer
 *         description: ID of the vehicle master
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully retrieved fare data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BaseVehicleType'
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: No Record Found
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Error details here
 *
 * components:
 *   schemas:
 *     BaseVehicleType:
 *       type: object
 *       properties:
 *         vehicle_type_id:
 *           type: integer
 *           description: Unique identifier for the vehicle type
 *         vehicle_master_id:
 *           type: integer
 *           description: Reference to the vehicle master record
 *         base_fare:
 *           type: number
 *           format: float
 *           description: Base fare amount
 *         per_km_rate:
 *           type: number
 *           format: float
 *           description: Rate per kilometer
 *         per_minute_rate:
 *           type: number
 *           format: float
 *           description: Rate per minute
 *         min_fare:
 *           type: number
 *           format: float
 *           description: Minimum fare amount
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was last updated
 *       example:
 *         vehicle_type_id: 1
 *         vehicle_master_id: 5
 *         base_fare: 40.00
 *         per_km_rate: 12.50
 *         per_minute_rate: 1.20
 *         min_fare: 80.00
 *         created_at: "2023-01-15T10:30:00Z"
 *         updated_at: "2023-01-15T10:30:00Z"
 */
fareManagementRouter.get('/getVendorFareInfo',getVendorFareInfo)
/**
 * @swagger
 * /fare_management/updateCabFareData:
 *   post:
 *     summary: Update cab fare data
 *     description: Update vehicle master association for a specific base combination
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCabFareRequest'
 *     responses:
 *       200:
 *         description: Fare data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */

fareManagementRouter.post('/updateCabFareData',updateCabFareData)
/**
 * @swagger
 * /fare_management/checkFareAccepted:
 *   post:
 *     summary: Check if fare is accepted for a given vendor/user
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user or vendor
 *                 example: 42
 *               base_comb_id:
 *                 type: integer
 *                 description: ID of the fare parent combination (base_combination.fare_parent_id)
 *                 example: 101
 *     responses:
 *       200:
 *         description: Successfully retrieved fare data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       vendor_id:
 *                         type: integer
 *                         example: 42
 *                       fare_parent_id:
 *                         type: integer
 *                         example: 101
 *                       created_by:
 *                         type: integer
 *                         example: 42
 *       404:
 *         description: No matching fare records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                   example: No Record Found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */

fareManagementRouter.post('/checkFareAccepted',checkFareAccepted)
/**
 * @swagger
 * /fare_management/fetchCabFareData:
 *   post:
 *     summary: Fetch cab fare and dispatch location details
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base_combination_id:
 *                 type: integer
 *                 description: ID of the base combination
 *                 example: 12
 *     responses:
 *       200:
 *         description: Fare data with associated vehicle types and dispatch locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       bvt:
 *                         type: object
 *                         properties:
 *                           base_comb_id:
 *                             type: integer
 *                           vehicle_type_id:
 *                             type: integer
 *                           dispatch_location:
 *                             type: object
 *                             properties:
 *                               type_of_dispatch:
 *                                 type: string
 *                               garage_type:
 *                                 type: string
 *                               address:
 *                                 type: string
 *                               city:
 *                                 type: string
 *                               pincode:
 *                                 type: string
 *                               latitude:
 *                                 type: number
 *                               longitude:
 *                                 type: number
 *       404:
 *         description: No matching records found
 *       500:
 *         description: Internal server error
 */

fareManagementRouter.post('/fetchCabFareData',fetchCabFareData)

fareManagementRouter.post('/acceptCompanyFare',acceptCompanyFare)
/**
 * @swagger
 * /fare_management/getFareDataArray:
 *   get:
 *     summary: Get fare data array based on filter criteria
 *     tags:
 *       - Fare Management
 *     parameters:
 *       - in: query
 *         name: city_id
 *         schema:
 *           type: integer
 *         description: ID of the city
 *       - in: query
 *         name: vehicle_type_id
 *         schema:
 *           type: integer
 *         description: ID of the vehicle type
 *       - in: query
 *         name: master_package_id
 *         schema:
 *           type: integer
 *         description: ID of the master package
 *       - in: query
 *         name: master_package_mode_id
 *         schema:
 *           type: integer
 *         description: ID of the master package mode
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of the user (vendor)
 *       - in: query
 *         name: company_id
 *         schema:
 *           type: integer
 *         description: ID of the company
 *       - in: query
 *         name: type_of_dispatch
 *         schema:
 *           type: integer
 *         description: Type of dispatch (1 - Point to Point, 2 - Garage to Garage)
 *       - in: query
 *         name: city_distance_id
 *         schema:
 *           type: integer
 *         description: ID of the city distance
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: integer
 *         description: ID of the client
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Status of the fare record (e.g., 0, 1)
 *       - in: query
 *         name: created_by
 *         schema:
 *           type: integer
 *         description: ID of the user who created the fare
 *       - in: query
 *         name: base_combination_id
 *         schema:
 *           type: integer
 *         description: ID of the base combination
 *     responses:
 *       200:
 *         description: Fare data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Fare details object
 *       404:
 *         description: No matching fare data found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                   example: No Record Found
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Server error while fetching fare data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */

fareManagementRouter.post('/getFareDataArray', getFareDataArray)
/**
 * @swagger
 * /fare_management/updateDispatchData:
 *   post:
 *     summary: Update dispatch location data for a base combination
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               master_package_id:
 *                 type: integer
 *                 example: 3
 *               type_of_dispatch:
 *                 type: string
 *                 example: "GARAGE"
 *               vendor_id:
 *                 type: integer
 *                 example: 15
 *               garage_type:
 *                 type: string
 *                 example: "PRIVATE"
 *               address:
 *                 type: string
 *                 example: "123 Street Name, Area"
 *               city:
 *                 type: string
 *                 example: "Mumbai"
 *               pincode:
 *                 type: string
 *                 example: "400001"
 *               latitude:
 *                 type: string
 *                 example: "19.0760"
 *               longitude:
 *                 type: string
 *                 example: "72.8777"
 *               user_id:
 *                 type: integer
 *                 example: 101
 *               ip:
 *                 type: string
 *                 example: "192.168.1.1"
 *               id:
 *                 type: integer
 *                 description: Base combination ID (base_comb_id)
 *                 example: 45
 *     responses:
 *       200:
 *         description: Dispatch location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fare Updated Successfully
 *                 code:
 *                   type: string
 *                   example: "200"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: No matching record found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No matching record found
 *                 code:
 *                   type: string
 *                   example: "404"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 code:
 *                   type: string
 *                   example: "500"
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */

fareManagementRouter.post('/updateDispatchData', updateDispatchData)
/**
 * @swagger
 * /fare_management/getallfarelistdata:
 *   post:
 *     summary: Retrieve a filtered list of fare data
 *     description: Fetches fare information based on various filter criteria such as combination ID, vehicle type, company, client, vendor, city, and date range.
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base_combination_id:
 *                 type: string
 *                 description: ID of the base combination
 *               base_vehicle_id:
 *                 type: string
 *                 description: ID of the base vehicle
 *               user_id:
 *                 type: string
 *                 description: ID of the vendor
 *               client_id:
 *                 type: string
 *               state_id:
 *                 type: string
 *               city_id:
 *                 type: string
 *               booking_type_id:
 *                 type: string
 *                 description: Master package ID
 *               master_package_mode_id:
 *                 type: string
 *               status:
 *                 type: string
 *               company_id:
 *                 type: string
 *               vehicle_type_id:
 *                 type: string
 *               from_date:
 *                 type: string
 *                 format: date
 *               to_date:
 *                 type: string
 *                 format: date
 *               weekdays:
 *                 type: string
 *               currency:
 *                 type: string
 *               created_by:
 *                 type: string
 *               limit:
 *                 type: integer
 *               offset:
 *                 type: integer
 *               searchValue:
 *                 type: string
 *     responses:
 *       200:
 *         description: A list of fare records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items: {}
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 error:
 *                   type: string
 */

fareManagementRouter.post('/getallfarelistdata', getAllFareListData)
/**
 * @swagger
 * /fare_management/getvendorfarelistdatatablecount:
 *   post:
 *     summary: Get count of vendor fare records
 *     description: Returns the total count of fare records from the base_combination table with joined data and filters.
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {}
 *     responses:
 *       200:
 *         description: Total fare count fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       total_count:
 *                         type: integer
 *                         example: 156
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                   example: No Record Found
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error during SQL execution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: SQL execution error message
 */

fareManagementRouter.post('/getvendorfarelistdatatablecount',getVendorFareListDataTableCount)
/**
 * @swagger
 * /fare_management/getvendorfarelistdatatablecount:
 *   post:
 *     summary: Get total fare count with filters
 *     description: Returns the total count of fare records based on multiple filters for vendor fare management.
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base_combination_id:
 *                 type: string
 *               base_vehicle_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *                 description: Vendor ID
 *               client_id:
 *                 type: string
 *               state_id:
 *                 type: string
 *               city_id:
 *                 type: string
 *               booking_type_id:
 *                 type: string
 *                 description: Master Package ID
 *               master_package_mode_id:
 *                 type: string
 *               status:
 *                 type: string
 *               company_id:
 *                 type: string
 *               vehicle_type_id:
 *                 type: string
 *               from_date:
 *                 type: string
 *                 format: date
 *               to_date:
 *                 type: string
 *                 format: date
 *               weekdays:
 *                 type: string
 *               currency:
 *                 type: string
 *               created_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       total_count:
 *                         type: integer
 *                         example: 42
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                   example: No Record Found
 *                 data:
 *                   type: array
 *                   items: {}
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 */

fareManagementRouter.post('/getvendorfarelistdatatablefiltercount',getVendorFareListDataTableFilterCount)
/**
 * @swagger
 * /fare_management/get_fare_list_data:
 *   post:
 *     summary: Get filtered fare list with pagination
 *     description: Retrieves a list of fare records based on multiple optional filters and supports pagination.
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base_combination_id:
 *                 type: string
 *               base_vehicle_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *                 description: Vendor ID
 *               client_id:
 *                 type: string
 *               state_id:
 *                 type: string
 *               city_id:
 *                 type: string
 *               master_package_id:
 *                 type: string
 *               booking_mode_type:
 *                 type: string
 *                 description: Master Package Mode ID
 *               status:
 *                 type: string
 *               company_id:
 *                 type: string
 *               vehicle_type_id:
 *                 type: string
 *               from_date:
 *                 type: string
 *                 format: date
 *               to_date:
 *                 type: string
 *                 format: date
 *               weekdays:
 *                 type: string
 *               currency:
 *                 type: string
 *               created_by:
 *                 type: string
 *               searchValue:
 *                 type: string
 *                 description: Raw SQL fragment for custom search logic
 *               limit:
 *                 type: integer
 *               offset:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Fare data row
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                   example: No Record Found
 *                 data:
 *                   type: array
 *                   items: {}
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 */

fareManagementRouter.post('/get_fare_list_data',getFareListData)

/**
 * @swagger
 * /fare_management/get_fare_list_data_filter_count:
 *   post:
 *     summary: Get filtered fare list data with count
 *     description: Returns the count and relevant fare data based on various filters like vehicle type, vendor, city, date range, etc.
 *     tags:
 *       - Fare Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base_combination_id:
 *                 type: string
 *               base_vehicle_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *                 description: Vendor ID
 *               client_id:
 *                 type: string
 *               state_id:
 *                 type: string
 *               city_id:
 *                 type: string
 *               master_package_id:
 *                 type: string
 *               master_package_mode_id:
 *                 type: string
 *               status:
 *                 type: string
 *               company_id:
 *                 type: string
 *               vehicle_type_id:
 *                 type: string
 *               from_date:
 *                 type: string
 *                 format: date
 *               to_date:
 *                 type: string
 *                 format: date
 *               weekdays:
 *                 type: string
 *               currency:
 *                 type: string
 *               created_by:
 *                 type: string
 *               searchValue:
 *                 type: string
 *                 description: Raw SQL string to append as extra filters (use with caution)
 *     responses:
 *       200:
 *         description: Success - Filtered data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       total_count:
 *                         type: integer
 *                         example: 10
 *                       base_combination_id:
 *                         type: string
 *                       client_id:
 *                         type: string
 *                       vendor_name:
 *                         type: string
 *                       vehicle_type:
 *                         type: string
 *                       package_name:
 *                         type: string
 *                       currency_city_symbol:
 *                         type: string
 *       404:
 *         description: No records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                   example: No Record Found
 *                 data:
 *                   type: array
 *                   items: {}
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 msg:
 *                   type: string
 *                 error:
 *                   type: string
 */

fareManagementRouter.post('/get_fare_list_data_filter_count',getFareListDataFilterCount)
/**
 * @swagger
 * /fare_management/get_vehicle_name:
 *   post:
 *     summary: Get vehicle name and model
 *     description: Returns the vehicle number and its associated model name based on vehicle_master_id.
 *     tags:
 *       - Fare Management
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
 *                 type: string
 *                 example: "abc123"
 *                 description: The vehicle_master_id of the vehicle
 *     responses:
 *       200:
 *         description: Successfully retrieved vehicle data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get vehicle name successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehicle_no:
 *                       type: string
 *                       example: MH12AB1234
 *                     model_name:
 *                       type: string
 *                       example: Swift Dzire
 *       400:
 *         description: Missing required id
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */

fareManagementRouter.post('/get_vehicle_name',getVehicleName)
fareManagementRouter.post('/getPackageMode',getPackageMode)
fareManagementRouter.post('/distance-waiting-add',authenticate,addUpdateDistanceWaitingFareData)
fareManagementRouter.post('/distance-hour-fare-update',authenticate,addUpdateDistanceHourFareData)
fareManagementRouter.post("/distance-fare-upto-add",authenticate,addUpdateDistanceUptoRateData)
fareManagementRouter.post("/distance-fare-add",authenticate,addUpdateDistanceFareData)
fareManagementRouter.post("/hourly-fare-upsert",authenticate,upsertHourlyFare)

// Manish
fareManagementRouter.post("/add-tax-detail",authenticate,upsertTaxDetailData)
fareManagementRouter.get("/add-tax-detail",authenticate,getTaxDetailData)
fareManagementRouter.post("/tax-detail-status",authenticate,changeTaxDetailStatus)
fareManagementRouter.post("/add-basic-fare-setting",authenticate,upsertBasicFareSetting)
fareManagementRouter.get("/get-basic-fare-setting",authenticate,getBasicFareSettingsWithFilters)
fareManagementRouter.post("/add-master-Waiting",authenticate,upsertMasterWaiting)
fareManagementRouter.post("/add-master-pre-Waiting",authenticate,upsertMasterPreWaiting)
fareManagementRouter.get("/get-cancellation-masters",authenticate,getMasterCancellations)
fareManagementRouter.get("/get-cancellation-fares",authenticate,getCancellationFares)

fareManagementRouter.post("/upsert-cancellation-fare",authenticate,bulkUpsertCancellationFares)
fareManagementRouter.get("/get-prewaiting-fare",authenticate,getPreWaitingCharges)

fareManagementRouter.post("/upsert-prewaiting-fare",authenticate,upsertPreWaitingCharges)
fareManagementRouter.get("/get-waiting-fare",authenticate,getWaitingCharges)

fareManagementRouter.post("/upsert-waiting-fare",authenticate,bulkUpsertWaitingCharges)
fareManagementRouter.get("/get-postal-code-fare",authenticate,getPostalCodeFares)

fareManagementRouter.post("/upsert-postal-code",authenticate,bulkUpsertPostalCodeFares)
fareManagementRouter.get("/get-company-share",authenticate,getCompanyShares)
fareManagementRouter.post("/upsert-company-share",authenticate,bulkUpsertCompanyShare)

fareManagementRouter.post("/upsert-premium-fare",authenticate,upsertPremiumsFare)
fareManagementRouter.get("/get-premium-fare",authenticate,getPremiumsFare)
fareManagementRouter.get("/get-night-fare",authenticate,getNightCharges)
fareManagementRouter.post("/upsert-night-fare",authenticate,upsertNightCharge)
fareManagementRouter.get("/get-peak-time-charge",authenticate,getPeakTimeCharges)

fareManagementRouter.post("/upsert-peak-time-charge",authenticate,upsertPeakTimeCharge)
fareManagementRouter.get("/get-extra-charge",authenticate,getExtras)

fareManagementRouter.post("/upsert-extra-charge",authenticate,upsertExtrasFare)

fareManagementRouter.get("/get-distance-fare",getDistanceFares)
fareManagementRouter.get("/get-distance-upto-rate",getDistanceUptoRates)
fareManagementRouter.get("/get-distance-hour-fare",getDistanceHourFares)
fareManagementRouter.get("/get-local-package-fare",getLocalPackageFares)
fareManagementRouter.get('/get-hourly-fare',getHourlyFares)
fareManagementRouter.get("/get-distance-waiting-fare",getDistanceWaitingFares)

fareManagementRouter.post("/send-quotation-mail",authenticate,sendQuotationMail)
fareManagementRouter.post("/send-booking-mail",authenticate,SendbookingEmail)
fareManagementRouter.post("/send-quotation-sms",authenticate,sendQuotationSMS)

// 
export default fareManagementRouter;