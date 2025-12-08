import {
  bookingMappingStatus,
  addBookingMappingDetail,
  updateBookingMappingDetail,
  bookingListSearch,
  getAllRecentlyViewedItems,
  addRecentlyViewedData,
  getUnassignedBookingList,
  getQuotationByItineraryId,
  reserveBooking,
  deleteRecentlyViewedBooking,
  changeRecentlyViewedBooking,
  bookingHistoryList,
  bookingFilter,
  bookingSearch,
  updateClientRating,
  updatePickupDateTime,
  smstoclient,
  // getvehicletype,
  getVehicleTypeData,
  markBookingAsNoShow,
  redispatchBooking,
  cancelBookingByDriver,
  getDriverDocuments,
  updateBookingStatus,
  updateUserStatus,
  getbookingbyitenearyid,
  getBookinglog,
  bookingInfoSequential,
  sendWhatsAppMessage,
  getDriverClaimList,
  getBookingTemplate,
  updateNewSattler,
  addquotationasync,
  createFinalBooking,
  listBookingData,
  quotationItineraryList,
  getItineraryShoppingCartCount,
  getItineraryDetails,
  addCartToQuotation,
  discardShoppingCartQuotation,
  finalquotationBooking,
  getRecentBookings,
  cancelBookingByUser,
  updateQuotationStatus,
} from "../controllers/bookingContoller.js";
import {
  quotationListData,
  quotationListSearch,
} from "../controllers/quotationHelper.js";
import {
  getStatmentOfAccount,
  getBilling,
  addInvoice,
  recetUnasignedBooking,
} from "../controllers/bookingContoller.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import express from "express";

const bookingRoute = express.Router();

/**
 * @swagger
 * /booking/booking-mapping-status:
 *   post:
 *     summary: Update the status of user booking type mappings
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
 *               - id
 *               - user_id
 *               - mapping_status
 *             properties:
 *               id:
 *                 type: string
 *                 example: "1,2,3"
 *                 description: Comma-separated IDs of the mappings to update
 *               user_id:
 *                 type: integer
 *               mapping_status:
 *                 type: integer
 *                 description: New status value to apply
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *       400:
 *         description: Invalid or missing input data
 *       500:
 *         description: Internal server error
 */
bookingRoute
  .route("/booking-mapping-status")
  .post(authenticate, bookingMappingStatus);
/**
 * @swagger
 * /booking/booking-mapping-detail:
 *   post:
 *     summary: Add a new booking mapping detail
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
 *               - mapping_category
 *               - user_id
 *               - booking_type
 *             properties:
 *               mapping_category:
 *                 type: string
 *                 example: "driver"
 *               country_id:
 *                 type: integer
 *                 example: 1
 *               state_id:
 *                 type: integer
 *                 example: 10
 *               city_id:
 *                 type: integer
 *                 example: 101
 *               user_id:
 *                 type: integer
 *                 example: 25
 *               vehicle_type:
 *                 type: integer
 *                 example: 2
 *               booking_type:
 *                 type: integer
 *                 example: 3
 *               booking_type_mode:
 *                 type: integer
 *                 example: 1
 *               ip:
 *                 type: string
 *                 example: "192.168.1.1"
 *               status:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Booking mapping created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insertId:
 *                   type: integer
 *       400:
 *         description: Invalid input or missing fields
 *       500:
 *         description: Internal server error
 */

bookingRoute
  .route("/booking-mapping-detail")
  .post(authenticate, addBookingMappingDetail);

/**
 * @swagger
 * /booking/booking-mapping-detail:
 *   put:
 *     summary: Update booking mapping detail
 *     tags: [User]
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
 *                 description: ID of the booking mapping to update
 *                 example: 123
 *               user_id:
 *                 type: integer
 *                 example: 25
 *               booking_type_mode:
 *                 type: integer
 *                 example: 1
 *               ip:
 *                 type: string
 *                 example: "192.168.1.1"
 *               status:
 *                 type: integer
 *                 example: 1
 *               modified_by:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Booking mapping updated successfully
 *       400:
 *         description: Invalid request or no records updated
 *       500:
 *         description: Internal server error
 */
bookingRoute
  .route("/booking-mapping-detail")
  .post(authenticate, updateBookingMappingDetail);

/**
 * @swagger
 * /booking/booking-list:
 *   post:
 *     summary: Search bookings from ViewRecentBooking with filters
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: string
 *               driver_id:
 *                 type: integer
 *               from_date:
 *                 type: string
 *                 format: date
 *               to_date:
 *                 type: string
 *                 format: date
 *               multi_status:
 *                 type: string
 *               page:
 *                 type: integer
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successful booking search
 *       404:
 *         description: No Record Found
 */
bookingRoute.route("/booking-list").post(bookingListSearch); // Need to add autheticate remove for testing only

/**
 * @swagger
 * /booking/recently-viewed:
 *   post:
 *     summary: Get all recently viewed items with pagination and filtering
 *     tags: [RecentlyViewed]
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
 *               user_type_id:
 *                 type: integer
 *                 example: 5
 *               page:
 *                 type: integer
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved recently viewed items
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
 *                         example: 456
 *                       master_package_id:
 *                         type: integer
 *                         example: 12
 *                       user_id:
 *                         type: integer
 *                         example: 123
 *                       first_name:
 *                         type: string
 *                         example: John
 *                       last_name:
 *                         type: string
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         example: john@example.com
 *                       mobile:
 *                         type: string
 *                         example: "9999999999"
 *                       RoleName:
 *                         type: string
 *                         example: Admin
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
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
 */
bookingRoute.route("/recently-viewed").post(getAllRecentlyViewedItems); // Need to add autheticate remove for testing only

/**
 * @swagger
 * /recently-viewed/add:
 *   post:
 *     summary: Add a new recently viewed item
 *     tags: [RecentlyViewed]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - city_id
 *               - booking_stage
 *               - booking_data
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 101
 *               city_id:
 *                 type: integer
 *                 example: 12
 *               temp_booking_id:
 *                 type: string
 *                 description: Optional temporary booking ID
 *                 example: TMP123456
 *               booking_stage:
 *                 type: string
 *                 example: "IN_PROGRESS"
 *               booking_data:
 *                 type: object
 *                 properties:
 *                   master_package_type:
 *                     type: integer
 *                     example: 5
 *                   package_id:
 *                     type: integer
 *                     example: 101
 *     responses:
 *       200:
 *         description: Recently viewed item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: string
 *                   description: Booking reference number or provided temp_booking_id
 *                   example: TM000123
 *       500:
 *         description: Server error or insertion failed
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
 *                   example: something went wrong
 */
bookingRoute
  .route("/recently-viewed/add")
  .post(authenticate, addRecentlyViewedData);
bookingRoute.route("/recently-unassigned-booking").post(recetUnasignedBooking); //need to add the authenticate
bookingRoute.route("/trip-details/:itineraryId").get(getQuotationByItineraryId);
bookingRoute.route("/reserve-booking").post(reserveBooking);
bookingRoute
  .route("/delete-recently-viewed")
  .delete(deleteRecentlyViewedBooking);
bookingRoute.route("/status-recently-viewed").put(changeRecentlyViewedBooking);
bookingRoute.get("/bookingHistoryList", bookingHistoryList);
bookingRoute.post("/bookingFilter", bookingFilter);
bookingRoute.post("/bookingSearch", bookingSearch);
bookingRoute.post("/updateClientRating", updateClientRating);
bookingRoute.post("/upateBookingStatus", updateBookingStatus);
bookingRoute.post("/cancelBookingDriver", cancelBookingByDriver);
bookingRoute.post("/executeNoShow", markBookingAsNoShow);
bookingRoute.post("/reDispatch", redispatchBooking);
bookingRoute.post("/updatePickupDateTime",authenticate, updatePickupDateTime);
bookingRoute.post("/smstoclient", smstoclient);
bookingRoute.post("/getvehicletype", getVehicleTypeData);
bookingRoute.post("/updateUserStatus", updateUserStatus);
bookingRoute.post("/getdiverdocuments", getDriverDocuments);
bookingRoute.post("/getbookingbyitenearyid", getbookingbyitenearyid);
bookingRoute.post("/bookingLogs", getBookinglog);
bookingRoute.post("/booking-info", bookingInfoSequential);
bookingRoute.post("/sendwhatsAppMessage", sendWhatsAppMessage);
bookingRoute.post("/getBookingTemplate", getBookingTemplate);
bookingRoute.route("/update-booking-sattler").get(updateNewSattler);
bookingRoute.post("/get-statment-account", getStatmentOfAccount);
bookingRoute.post("/get-billing", getBilling);
bookingRoute.post("/get-billing", addInvoice);
bookingRoute.post("/finalquotation", addquotationasync);
bookingRoute.post(
  "/finalquotationBooking",
  authenticate,
  finalquotationBooking
);
bookingRoute.post("/finalbooking", authenticate, createFinalBooking);
bookingRoute.post("/listBookingData", listBookingData);
bookingRoute.post("/listQuotationData", quotationListData);
bookingRoute.get(
  "/quotationItineraryList",
  authenticate,
  quotationItineraryList
);
bookingRoute.get(
  "/shopping-cart-count",
  authenticate,
  getItineraryShoppingCartCount
);
bookingRoute.post("/getItineraryDetails", getItineraryDetails);
bookingRoute.post("/addCartToQuotation", addCartToQuotation);
bookingRoute.post(
  "/discardShoppingCartQuotation",
  authenticate,
  discardShoppingCartQuotation
);
bookingRoute.get("/getRecentBookings", authenticate, getRecentBookings);
bookingRoute.post("/cancelBookingByUser", cancelBookingByUser);
const handleQuotationSearch = (req, res) => quotationListSearch(req, res);

bookingRoute.post("/quotation-list", handleQuotationSearch);

bookingRoute.post(
  "/updateQuotationStatus",
  authenticate,
  updateQuotationStatus
);
export default bookingRoute;
