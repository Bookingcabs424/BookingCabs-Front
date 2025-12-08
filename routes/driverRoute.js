import express, { Router } from "express";
import {
  driverStatus,
  bookingReadStatus,
  apiCallInterval,
  driverBookingData,
  driverStatusSequential,
  cancelDriverUpdateBookingStatus,
  updateDriverStatus,
  insertBookingRegistry,
  bookingStatus,
  cancelDriverBookingStatus,
  getBookingStatus,
  checkDriverBalance,
  getAcceptDriverBooking,
  isCabTypedMacthed,
  acceptBookingUpdateStatus,
  getUserVehicleDetails,
  vendorAcceptJob,
  driverAcceptBookingSeq,
  driverStartTrip,
  addMeterImage,
  uploadDocument,
  billCalculate,
  insertBookingCharges,
  addDriverLocation,
  driverAllocation,
  getActiveDrivers,
  wayPointSeq,
  getBookingPicklatlong,
  getDriverList,
  addTripComment,
  driverBillSeq,
  addCurrentLocation,
  driverRunningBillSeq,
  allocationHistory,
  allocationHistoryDetails,
  driverLedger,
  addDriverRating,
  getTotalDriverRating,
  bookingFetchInfo,
  addSetLocation,
  driverAvailabilityStatus,
  getDriverClaimList,
  getDriverTransactions,
  getDrivers,
  getDriverCombo,
  getUserDriverList,
  updateDriverLicenseDetail,
  getDriverLicenseDetails,
  deleteDriverDetails,
  getDriverById,
  updateDriver,
  getRecentDrivers,
} from "../controllers/driverController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { get } from "http";
const driverRouter = express.Router();


driverRouter.post('/get-driver-list',authenticate,getUserDriverList);


/**
 * @swagger
 * tags:
 *   - name: Driver
 *     description: Endpoints related to driver operations
 */

/**
 * @swagger
 * /driver/status:
 *   get:
 *     summary: Get driver status
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver status retrieved
 *       404:
 *         description: Driver not found
 */
driverRouter.get("/status", authenticate, driverStatus);

driverRouter.put('/update-license',authenticate,updateDriverLicenseDetail);


/**
 * @swagger
 * /driver/booking-unread-count:
 *   post:
 *     summary: Get booking unread count for driver
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Unread booking count retrieved
 */
driverRouter.post("/booking-unread-count", authenticate, bookingReadStatus);

/**
 * @swagger
 * /driver/api-call-interval:
 *   get:
 *     summary: Get API call interval settings
 *     tags: [Driver]
 *     responses:
 *       200:
 *         description: API interval settings fetched
 */
driverRouter.get("/api-call-interval", apiCallInterval);

/**
 * @swagger
 * /driver/booking-data:
 *   get:
 *     summary: Get booking data for driver
 *     tags: [Driver]
 *     responses:
 *       200:
 *         description: Booking data retrieved
 */
driverRouter.get("/booking-data", driverBookingData);

/**
 * @swagger
 * /driver/status-sequential:
 *   get:
 *     summary: Get all driver status-related data sequentially
 *     tags: [Driver]
 *     responses:
 *       200:
 *         description: Sequential data retrieved
 */
driverRouter.get("/status-sequential", authenticate, driverStatusSequential);

/**
 * @swagger
 * /driver/cancel-driver-update-booking:
 *   put:
 *     summary: Cancel driver booking and update status
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *               driver_id:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking status updated
 */
driverRouter.put(
  "/cancel-driver-update-booking",
  authenticate,
  cancelDriverUpdateBookingStatus
);

/**
 * @swagger
 * /driver/update-status:
 *   put:
 *     summary: Update driver status
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driver_id:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver status updated
 */
driverRouter.put("/update-status", authenticate, updateDriverStatus);

/**
 * @swagger
 * /driver/register-booking:
 *   post:
 *     summary: Insert booking registry entry for driver
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *               driver_id:
 *                 type: integer
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking registered
 */
driverRouter.post("/register-booking", authenticate, insertBookingRegistry);

/**
 * @swagger
 * /driver/booking-status:
 *   post:
 *     summary: Get current status of a booking
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Successfully fetched the booking status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Accepted"
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
driverRouter.post("/booking-status", authenticate, bookingStatus);

/**
 * @swagger
 * /driver/cancel-booking-status:
 *   post:
 *     summary: Cancel a booking if current status allows
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       404:
 *         description: Booking not found or already completed
 *       500:
 *         description: Server error
 */
driverRouter.post(
  "/cancel-booking-status",
  authenticate,
  cancelDriverBookingStatus
);

/**
 * @swagger
 * /driver/get-booking-status:
 *   post:
 *     summary: Get the current booking status
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking status returned
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
driverRouter.post("/get-booking-status", authenticate, getBookingStatus);

/**
 * @swagger
 * /driver/check-balance:
 *   post:
 *     summary: Check if driver has sufficient balance
 *     tags: [Driver]
 *     responses:
 *       200:
 *         description: Balance information
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Server error
 */
driverRouter.post("/check-balance", authenticate, checkDriverBalance);

/**
 * @swagger
 * /driver/accept-booking:
 *   post:
 *     summary: Accept a booking for a driver
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookid:
 *                 type: integer
 *               driverId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking accepted
 *       500:
 *         description: Server error
 */
driverRouter.post("/accept-booking", authenticate, getAcceptDriverBooking);

/**
 * @swagger
 * /driver/check-cabtype:
 *   post:
 *     summary: Verify if driver's cab type matches the booking
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: integer
 *               booking_vehicle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cab type match result
 *       404:
 *         description: Vehicle info not found
 *       500:
 *         description: Server error
 */
driverRouter.post("/check-cabtype", authenticate, isCabTypedMacthed);

/**
 * @swagger
 * /driver/booking-info:
 *   post:
 *     summary: Fetch booking information
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking info returned
 *       500:
 *         description: Server error
 */
driverRouter.post("/booking-info", authenticate, bookingFetchInfo);

/**
 * @swagger
 * /driver/update-booking-status:
 *   post:
 *     summary: Update booking status on acceptance
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking status updated
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
driverRouter.post(
  "/update-booking-status",
  authenticate,
  acceptBookingUpdateStatus
);

/**
 * @swagger
 * /driver/vehicle-details:
 *   get:
 *     summary: Get vehicle details for the logged-in driver
 *     tags: [Driver]
 *     responses:
 *       200:
 *         description: Vehicle details returned
 *       500:
 *         description: Server error or user ID missing
 */
driverRouter.get("/vehicle-details", authenticate, getUserVehicleDetails);
/**
 * @swagger
 * /driver/accept-job-old:
 *   post:
 *     summary: Driver accepts a booking sequentially (old logic)
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 1234
 *               id:
 *                 type: integer
 *                 example: 5678
 *     responses:
 *       200:
 *         description: Booking accepted or information returned
 *       400:
 *         description: Validation error or missing parameters
 *       500:
 *         description: Server error or failed to accept booking
 */
driverRouter.post("/vendor-accept-job", authenticate, vendorAcceptJob);
/**
 * @swagger
 * /driver/accept-job:
 *   post:
 *     summary: Driver accepts a booking sequentially (old logic)
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 1234
 *               id:
 *                 type: integer
 *                 example: 5678
 *     responses:
 *       200:
 *         description: Booking accepted or information returned
 *       400:
 *         description: Validation error or missing parameters
 *       500:
 *         description: Server error or failed to accept booking
 */
driverRouter.post("/accept-job", authenticate, driverAcceptBookingSeq);

/**
 * @swagger
 * /driver/start-trip:
 *   post:
 *     summary: Start a trip for a booking
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking_id
 *               - id
 *               - starting_meter
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 123
 *               id:
 *                 type: integer
 *                 description: Driver's user ID
 *                 example: 456
 *               starting_meter:
 *                 type: number
 *                 description: Starting meter reading
 *                 example: 10.5
 *     responses:
 *       200:
 *         description: Trip started successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
driverRouter.post("/start-trip", authenticate, driverStartTrip);

/**
 * @swagger
 * /driver/upload-booking-images:
 *   post:
 *     summary: Upload a meter image for the trip
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               meter-image:
 *                 type: string
 *                 format: binary
 *                 description: Meter image file to upload
 *               KeyName:
 *                 type: string
 *                 description: Type of the image (e.g., startingMeterImage, closingMeterImage)
 *               imageURL:
 *                 type: string
 *                 description: Optional URL if image is already hosted
 *               booking_id:
 *                 type: string
 *                 description: ID of the booking this image is related to
 *               folder:
 *                 type: string
 *                 description: Optional folder name where the file should be uploaded
 *     responses:
 *       200:
 *         description: Meter image uploaded successfully
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
 *                   example: Meter image uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     fileUploadName:
 *                       type: string
 *                     fullImagePath:
 *                       type: string
 *                     KeyName:
 *                       type: string
 *       500:
 *         description: Server error during file upload
 */

driverRouter.post(
  "/upload-booking-images",
  authenticate,
  upload.single("meter-image"),
  addMeterImage
);

/**
 * @swagger
 * /driver/upload-document:
 *   post:
 *     summary: Upload a document for a booking
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 description: The booking ID for which the document is being uploaded
 *               doc_column_name:
 *                 type: string
 *                 description: The column name for the document field (e.g., "starting_meter_image")
 *                 enum:
 *                   - starting_meter_image
 *                   - closing_meter_image
 *                   - client_signature
 *                   - parking_image
 *                   - toll_image
 *                   - extra_image
 *                   - client_image
 *               doc_file_upload:
 *                 type: string
 *                 format: binary
 *                 description: The document file to be uploaded
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   description: The result of the update operation
 *       400:
 *         description: Invalid column name provided
 *       500:
 *         description: Server error during document upload
 */
driverRouter.post("/upload-document", authenticate, uploadDocument);

/**
 * @swagger
 * /driver/calculate-bill:
 *   post:
 *     summary: Calculate the final bill and balance for a booking
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - startTime
 *               - endTime
 *             properties:
 *               bookingId:
 *                 type: integer
 *               distance:
 *                 type: number
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               address:
 *                 type: string
 *               lat:
 *                 type: number
 *               lon:
 *                 type: number
 *               delay_time:
 *                 type: number
 *               currentTime:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               totalTime:
 *                 type: string
 *               isMatching:
 *                 type: boolean
 *               pre_waiting_time:
 *                 type: number
 *               road_tax:
 *                 type: number
 *               tollTax:
 *                 type: number
 *               other_Tax:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bill calculated successfully
 *       403:
 *         description: Booking not found or bill already generated
 *       500:
 *         description: Server error
 */
driverRouter.post("/calculate-bill", authenticate, billCalculate);
/**
 * @swagger
 * /driver/insert-booking-charges:
 *   post:
 *     summary: Insert final booking charges after trip completion
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripCharge:
 *                 type: number
 *               waiting_charges:
 *                 type: number
 *               MinimumChrage:
 *                 type: number
 *               BookingId_i:
 *                 type: integer
 *               Per_Km_Charge:
 *                 type: number
 *               Min_Distance:
 *                 type: number
 *               basic_tax_price:
 *                 type: number
 *               book_ref:
 *                 type: string
 *               TotalBill:
 *                 type: number
 *               total_tax_price:
 *                 type: number
 *               nightcharge_unit:
 *                 type: number
 *               nightcharge:
 *                 type: number
 *               nightcharge_price:
 *                 type: number
 *               night_rate_begins:
 *                 type: string
 *               night_rate_ends:
 *                 type: string
 *               extras:
 *                 type: string
 *               extraPrice:
 *                 type: number
 *               peak_time_price:
 *                 type: number
 *               peak_time_value:
 *                 type: object
 *               basic_tax:
 *                 type: number
 *               basic_tax_type:
 *                 type: string
 *               pre_waiting_time:
 *                 type: number
 *               pre_waiting_charge:
 *                 type: number
 *               waiting_time:
 *                 type: number
 *               waiting_charge:
 *                 type: number
 *               estimated_price_before_markup:
 *                 type: number
 *               extracharges:
 *                 type: number
 *               toll_tax:
 *                 type: number
 *               state_tax:
 *                 type: number
 *               starting_meter:
 *                 type: number
 *               closing_meter:
 *                 type: number
 *               total_running_time:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking charges inserted successfully
 *       500:
 *         description: Server error during insert
 */

driverRouter.post(
  "/insert-booking-charges",
  authenticate,
  insertBookingCharges
);

/**
 * @swagger
 * /driver/add-driver-location:
 *   post:
 *     summary: Add a driver's current location and trip metadata
 *     tags: [Driver]
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
 *               - bookingId
 *             properties:
 *               user_id:
 *                 type: integer
 *               bookingId:
 *                 type: integer
 *               lat:
 *                 type: number
 *               lon:
 *                 type: number
 *               strtTime:
 *                 type: string
 *                 format: date-time
 *               distance:
 *                 type: number
 *               duration:
 *                 type: string
 *               waiting_time:
 *                 type: number
 *               pre_Waiting_time:
 *                 type: number
 *               currentTime:
 *                 type: string
 *                 format: date-time
 *               time_stamp:
 *                 type: string
 *               speed:
 *                 type: number
 *               accuracy:
 *                 type: number
 *               provider:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver location added successfully
 *       500:
 *         description: Server error
 */
driverRouter.post("/add-driver-location", authenticate, addDriverLocation);

/**
 * @swagger
 * /driver/add-current-location:
 *   post:
 *     summary: Add bulk current locations for driver(s)
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locData:
 *                 type: string
 *                 description: JSON stringified array of location data
 *                 example: '[{"driverId":1,"latitude":12.9716,"longitude":77.5946}]'
 *     responses:
 *       200:
 *         description: Locations added successfully
 *       400:
 *         description: Missing locData in request
 *       500:
 *         description: Server error
 */

driverRouter.post("/add-current-location", authenticate, addCurrentLocation);

/**
 * @swagger
 * /driver/driver-allocation:
 *   post:
 *     summary: Allocate a driver to a booking using stored procedure
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Driver allocated successfully
 *       500:
 *         description: Server error
 */
driverRouter.post("/driver-allocation", authenticate, driverAllocation);

/**
 * @swagger
 * /driver/get-active-drivers:
 *   post:
 *     summary: Get list of active drivers with filtering options
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter_data:
 *                 type: string
 *                 description: JSON stringified filter object for driver filters
 *     responses:
 *       200:
 *         description: List of active drivers
 *       404:
 *         description: No drivers found
 *       500:
 *         description: Server error
 */

driverRouter.post("/get-active-drivers", authenticate, getActiveDrivers);

/**
 * @swagger
 * /driver/get-booking-pick-latlong:
 *   post:
 *     summary: Get pickup and drop latitude/longitude for a booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking location data
 *       400:
 *         description: Missing or invalid booking ID
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

driverRouter.post(
  "/get-booking-pick-latlong",
  authenticate,
  getBookingPicklatlong
);

/**
 * @swagger
 * /driver/way-point-seq:
 *   post:
 *     summary: Get waypoint sequence for a driver and booking
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - driverId
 *             properties:
 *               bookingId:
 *                 type: string
 *               driverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Waypoint sequence retrieved successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Pickup or driver location not found
 *       500:
 *         description: Internal server error
 */

driverRouter.post("/way-point-seq", authenticate, wayPointSeq);

/**
 * @swagger
 * /driver/get-driver-list:
 *   post:
 *     summary: Get list of approved drivers
 *     tags: [Driver]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: List fetched
 *       404:
 *         description: No drivers found
 *       500:
 *         description: Server error
 */
driverRouter.post("/get-driver-list", authenticate, getDriverList);

/**
 * @swagger
 * /driver/add-set-location:
 *   post:
 *     summary: Add or update driver's current trip location
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locData:
 *                 type: array
 *                 description: Array of driver location data
 *                 items:
 *                   type: object
 *                   properties:
 *                     driverId:
 *                       type: integer
 *                     book_id:
 *                       type: integer
 *                     booking_status:
 *                       type: integer
 *                     start_latitude:
 *                       type: number
 *                     start_longitude:
 *                       type: number
 *                     current_latitude:
 *                       type: number
 *                     current_longitude:
 *                       type: number
 *                     start_time:
 *                       type: string
 *                       format: date-time
 *                     current_time:
 *                       type: string
 *                       format: date-time
 *                     distance:
 *                       type: number
 *                     duration:
 *                       type: number
 *                     waiting_time:
 *                       type: number
 *                     pre_Waiting_time:
 *                       type: number
 *                     tripRunnStatus:
 *                       type: string
 *                     timeStamp:
 *                       type: string
 *                     speed:
 *                       type: number
 *                     accuracy:
 *                       type: number
 *                     provider:
 *                       type: string
 *     responses:
 *       200:
 *         description: Location data added successfully
 *       400:
 *         description: locData field is missing
 *       500:
 *         description: Server error
 */

driverRouter.post("/add-set-location", authenticate, addSetLocation);

/**
 * @swagger
 * /driver/availability-status:
 *   post:
 *     summary: Get driver's availability status and trip info
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the driver
 *     responses:
 *       200:
 *         description: Driver availability status fetched successfully
 *       400:
 *         description: user_id is required
 *       404:
 *         description: No availability records found
 *       500:
 *         description: Server error
 */

driverRouter.post(
  "/availability-status",
  authenticate,
  driverAvailabilityStatus
);

/**
 * @swagger
 * /driver/claim-list:
 *   post:
 *     summary: Get list of drivers eligible for claim based on filters
 *     tags: [Driver]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_type_id:
 *                 type: integer
 *               master_package_id:
 *                 type: integer
 *               booking_amount:
 *                 type: number
 *               city_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [Online-Active, Online-InActive, Offline-Active, Offline-InActive, All]
 *     responses:
 *       200:
 *         description: Driver claim list fetched successfully
 *       404:
 *         description: No drivers found
 *       500:
 *         description: Server error
 */

driverRouter.post("/claim-list", getDriverClaimList);
/**
 * @swagger
 * /driver/add-comment:
 *   post:
 *     summary: Add comment on a trip from client or driver
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking_id
 *               - commented_by_id
 *               - commenter_type
 *               - comment
 *             properties:
 *               booking_id:
 *                 type: integer
 *               commented_by_id:
 *                 type: integer
 *               commenter_type:
 *                 type: string
 *                 enum: [client, driver]
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *       500:
 *         description: Server error
 */
driverRouter.post("/add-comment", authenticate, addTripComment);

/**
 * @swagger
 * /driver/cab-billing-complete:
 *   post:
 *     summary: Calculate and store driver billing details
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               distance:
 *                 type: number
 *               address:
 *                 type: string
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               strtTime:
 *                 type: string
 *                 format: date-time
 *               dropToPickupDist:
 *                 type: number
 *                 default: 0
 *               dropToPickupGarageDist:
 *                 type: number
 *                 default: 0
 *               garageToPickupDist:
 *                 type: number
 *                 default: 0
 *               parking_charge:
 *                 type: number
 *                 default: 0
 *               toll_tax:
 *                 type: number
 *                 default: 0
 *               state_tax:
 *                 type: number
 *                 default: 0
 *               other_tax:
 *                 type: number
 *                 default: 0
 *               delay_time:
 *                 type: string
 *                 example: "01:15"
 *               totalTime:
 *                 type: string
 *                 example: "02:30"
 *               isMatching:
 *                 type: boolean
 *               starting_meter:
 *                 type: number
 *               closing_meter:
 *                 type: number
 *                 default: 0
 *               total_running_time:
 *                 type: string
 *                 default: "00:00:00"
 *               start_time:
 *                 type: string
 *                 default: "00:00:00"
 *               end_time:
 *                 type: string
 *                 default: "00:00:00"
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Billing calculated successfully
 *       500:
 *         description: Internal server error
 */
driverRouter.post("/cab-billing-complete", authenticate, driverBillSeq);

/**
 * @swagger
 * /driver/running-bill-seq:
 *   post:
 *     summary: Get the running fare details for an active booking
 *     tags: [Driver]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driver_id:
 *                 type: string
 *                 description: Unique ID of the driver
 *               latitude:
 *                 type: number
 *                 description: Current latitude of the driver
 *               longitude:
 *                 type: number
 *                 description: Current longitude of the driver
 *               speed:
 *                 type: number
 *                 description: Current speed of the vehicle
 *               battery_level:
 *                 type: number
 *                 description: Driver’s device battery percentage
 *               accuracy:
 *                 type: number
 *                 description: Accuracy of the location in meters
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp of the location capture
 *     responses:
 *       200:
 *         description: Running fare details calculated successfully
 *       404:
 *         description: Booking or location data not found
 *       500:
 *         description: Internal server error
 */
driverRouter.post("/running-bill-seq", authenticate, driverRunningBillSeq);

/**
 * @swagger
 * /driver/allocation-history:
 *   get:
 *     summary: Get booking summary by status for a driver over a date range
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the driver
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Booking summary fetched successfully
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
 *                       date:
 *                         type: string
 *                         format: date
 *                       total_accepted:
 *                         type: integer
 *                       total_cancelled:
 *                         type: integer
 *                       total_missed:
 *                         type: integer
 *                       total_rejected:
 *                         type: integer
 *       400:
 *         description: Missing or invalid query parameters
 *       500:
 *         description: Internal server error
 */
driverRouter.get("/allocation-history", authenticate, allocationHistory);

/**
 * @swagger
 * /driver/allocation-history-details:
 *   get:
 *     summary: Get allocation history for a driver on a specific date
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: driver_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the driver
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Specific date to fetch records for (YYYY-MM-DD)
 *       - in: query
 *         name: booking_status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter results by booking status
 *     responses:
 *       200:
 *         description: Allocation history fetched successfully
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
 *                       bookingid:
 *                         type: integer
 *                       updateOn:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                       reference_number:
 *                         type: string
 *                       client_name:
 *                         type: string
 *                       mobile:
 *                         type: string
 *                       email:
 *                         type: string
 *                       pickup_address:
 *                         type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */

driverRouter.get(
  "/allocation-history-details",
  authenticate,
  allocationHistoryDetails
);
/**
 * @swagger
 * /driver/ledger:
 *   get:
 *     summary: Get driver ledger history within a date range
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the driver
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Ledger details fetched successfully
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
 *                       user_id:
 *                         type: integer
 *                       reference_number:
 *                         type: string
 *                       created_date:
 *                         type: string
 *                         format: date
 *                       time:
 *                         type: string
 *                       pay_type_mode:
 *                         type: string
 *                       debit_amount:
 *                         type: number
 *                       credit_amount:
 *                         type: number
 *                       balance:
 *                         type: number
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
driverRouter.get("/ledger", authenticate, driverLedger);



/**
 * @swagger
 * /driver/get-driver-transactions:
 *   post:
 *     summary: Get transaction history for a driver
 *     tags: [Driver]
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
 *                 description: Driver's user ID
 *               from_date:
 *                 type: string
 *                 format: date
 *                 description: Start date for filtering (optional)
 *               to_date:
 *                 type: string
 *                 format: date
 *                 description: End date for filtering (optional)
 *     responses:
 *       200:
 *         description: List of driver transactions fetched successfully
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */
driverRouter.post(
  "/get-driver-transactions",
  authenticate,
  getDriverTransactions
);
/**
 * @swagger
 * /driver/rating:
 *   post:
 *     summary: Add a driver rating by a user
 *     tags: [Driver]
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
 *               - driver_id
 *               - booking_id
 *               - rating
 *             properties:
 *               user_id:
 *                 type: integer
 *               driver_id:
 *                 type: integer
 *               booking_id:
 *                 type: integer
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *               comment_desc:
 *                 type: string
 *               created_date:
 *                 type: string
 *                 format: date-time
 *               created_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rating added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
driverRouter.post("/rating", authenticate, addDriverRating);

/**
 * @swagger
 * /driver/rating-summary/{driverId}:
 *   get:
 *     summary: Get total rating counts (1 to 5 stars) for a driver
 *     tags: [Driver]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the driver
 *     responses:
 *       200:
 *         description: Driver rating summary fetched successfully
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
 *                   example: Data saved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     DID:
 *                       type: integer
 *                       example: 42
 *                     one_rating:
 *                       type: integer
 *                       example: 3
 *                     two_rating:
 *                       type: integer
 *                       example: 5
 *                     three_rating:
 *                       type: integer
 *                       example: 12
 *                     four_rating:
 *                       type: integer
 *                       example: 18
 *                     five_rating:
 *                       type: integer
 *                       example: 32
 *       404:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */

driverRouter.get(
  "/driver-rating/:driverId",
  authenticate,
  getTotalDriverRating
);
driverRouter.post("/driver-list", authenticate, getDrivers);
driverRouter.post("/recent-drivers", authenticate, getRecentDrivers);
driverRouter.get("/driver-combo", authenticate, getDriverCombo);
driverRouter.put("/driver-update/:id", authenticate, updateDriver);

driverRouter.get('/get-driver-details',authenticate,getDriverLicenseDetails);
driverRouter.get("/get-driver/:id", authenticate, getDriverById);

driverRouter.delete('/delete-driver',authenticate,deleteDriverDetails)
export default driverRouter;
