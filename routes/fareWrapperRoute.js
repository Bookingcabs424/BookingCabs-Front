import express from "express";
import {
  applyCoupon,
  fareDataSeq,
  getCancellationFare,
  getFilterForVehicleListing,
  getSacCodeData,
} from "../controllers/fareWrapperController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { upsertDistanceHourFare } from '../controllers/LocalPackageController.js';

const router = express.Router();

// Example controller import
// const fareWrapperController = require('../controllers/fareWrapperController');

// Define your routes here
router.get("/", (req, res) => {
  res.json({ message: "Fare Wrapper API Root" });
});

// Example route
// router.post('/calculate', fareWrapperController.calculateFare);
/**
 * @swagger
 * /fare/get_filter_for_vehicle_listing:
 *   post:
 *     summary: Get vehicle listing filters based on search criteria
 *     description: |
 *       Retrieves dynamic filter options for vehicle listings based on the provided booking details.
 *       It processes vehicle type, fare data, and generates filter facets such as vehicle model, vendor, seating capacity, etc.
 *     tags:
 *       - Vehicle Listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pickup_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-21"
 *               pickup_time:
 *                 type: string
 *                 example: "10:00"
 *               master_booking_type_id:
 *                 type: integer
 *                 example: 1
 *               local_package_id:
 *                 type: integer
 *                 example: 2
 *               dropcity_id:
 *                 type: integer
 *                 example: 3
 *               city_id:
 *                 type: integer
 *                 example: 1
 *               master_package_id:
 *                 type: integer
 *                 example: 1
 *               seating_capacity:
 *                 type: integer
 *                 example: 4
 *               luggage:
 *                 type: integer
 *                 example: 2
 *               smallluggage:
 *                 type: integer
 *                 example: 1
 *               vehicle_type:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Filter data generated successfully
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
 *                   example: filter get successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     filter_labels:
 *                       type: object
 *                       description: Labels for each filter category
 *                     filter:
 *                       type: object
 *                       description: Filter data grouped by category with counts
 *       500:
 *         description: Server error
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
 *                   example: Error message
 *                 data:
 *                   type: array
 *                   items: {}
 */

router.post("/get_filter_for_vehicle_listing", getFilterForVehicleListing);
/**
 * @swagger
 * /fare/faredetails:
 *   post:
 *     summary: Description of the endpoint
 *     tags:
 *       - YourTag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city_id:
 *                 type: integer
 *               state_id:
 *                 type: integer
 *               country_id:
 *                 type: integer
 *               master_package_id:
 *                 type: integer
 *               seating_capacity:
 *                 type: integer
 *                 default: 0
 *               luggage:
 *                 type: integer
 *                 default: 0
 *               no_of_vehicles:
 *                 type: integer
 *                 default: 1
 *               total_days:
 *                 type: integer
 *                 default: 1
 *               pickup_date:
 *                 type: string
 *                 format: date
 *               pickup_time:
 *                 type: string
 *                 example: "10:00"
 *               company_id:
 *                 type: integer
 *               user_gstno:
 *                 type: string
 *               company_gstno:
 *                 type: string
 *               duration:
 *                 type: integer
 *                 default: 0
 *               parent_id:
 *                 type: integer
 *                 default: 0
 *               user_id:
 *                 type: integer
 *               user_grade:
 *                 type: string
 *               user_type:
 *                 type: string
 *               vehicle_type:
 *                 type: string
 *               currency:
 *                 type: integer
 *                 default: 1
 *               master_booking_type_id:
 *                 type: string
 *                 default: "Transport"
 *               cityList:
 *                 type: string
 *                 default: ""
 *               cityListToll:
 *                 type: string
 *                 default: ""
 *               module_type:
 *                 type: string
 *                 default: ""
 *               end_date:
 *                 type: string
 *                 format: date
 *                 default: ""
 *               end_time:
 *                 type: string
 *                 example: "18:00"
 *                 default: ""
 *               local_package_id:
 *                 type: string
 *                 default: "0"
 *               distance:
 *                 type: number
 *               smallluggage:
 *                 type: integer
 *               dropcity_id:
 *                 type: integer
 *               data_from:
 *                 type: integer
 *               data_limit:
 *                 type: integer
 *             required:
 *               - city_id
 *               - pickup_date
 *               - pickup_time
 *               - company_id
 *               - user_id
 *     responses:
 *       200:
 *         description: Successful operation
 */

router.post("/faredetails", authenticate, fareDataSeq);
router.post("/apply-coupon", applyCoupon);

router.post("/get-sac-code", getSacCodeData);


router.post('/distanceHourFare', upsertDistanceHourFare);
export default router;
