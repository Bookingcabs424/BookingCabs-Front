import express from "express";
import {
  getBidding,
  getKilometer,
  biddingSequential,
  addVendorBaseVehicleType,
  addOnewayCity,
  addDistanceFare,
  addPackageActiveTime,
  addPackageActiveWeekdays,
  addTollTax,
  addDriverAllowance,
  lowestOneWayFare,
  getLowestBiddingFare,
  lowestFareSeq,
  getLowestOneWayFare,
  lowestBiddingFare,
  deleteBidding,
  updateBidding,
  getActiveBidding,
  updateBiddingData,
  updateBaseVehicleTypeData,
  updateOnewayCity,
  updateDistanceFare,
  updateTollTaxFare,
  updateDriverFare,
  biddingSequentialData
} from "../controllers/biddingController.js";

import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const biddingRouter = express.Router();

/**
 * @swagger
 * /bidding/get-bidding:
 *   post:
 *     summary: Get bidding data with filters and pagination
 *     tags: [Bidding]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city_distance_id:
 *                 type: integer
 *               route_id:
 *                 type: integer
 *               driver_id:
 *                 type: integer
 *               source_city:
 *                 type: integer
 *               destination_city:
 *                 type: integer
 *               multi_vehicle_type:
 *                 type: string
 *                 example: "1,2,3"
 *               from_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-01"
 *               to_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-10"
 *               user_id:
 *                 type: integer
 *               page:
 *                 type: integer
 *                 default: 1
 *               limit:
 *                 type: integer
 *                 default: 10
 *     responses:
 *       200:
 *         description: Bidding data retrieved successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       404:
 *         description: No Record Found
 *       500:
 *         description: Internal Server Error
 */

biddingRouter.post("/get-bidding", authenticate,getBidding); //need to add authenticate
biddingRouter.post("/add", authenticate, biddingSequential);
biddingRouter.post("/get-distance", authenticate, getKilometer);

biddingRouter.post(
  "/add-vendor-vehicle-type",
  authenticate,

  addVendorBaseVehicleType
);
biddingRouter.post("/add-one-way-city", authenticate, addOnewayCity);
biddingRouter.post("/add-distance-fare", authenticate, addDistanceFare);

biddingRouter.post("/add-package-timing", authenticate, addPackageActiveTime);
biddingRouter.post(
  "/add-package-weekdays",
  authenticate,
  addPackageActiveWeekdays
);
biddingRouter.post("/add-toll-tax", authenticate, addTollTax);

biddingRouter.post("/add-driver-allowance", authenticate, addDriverAllowance);
biddingRouter.post("/lowest-one-way-fare", authenticate, lowestOneWayFare);
biddingRouter.post(
  "/get-lowest-bidding-fare",
  authenticate,
  getLowestBiddingFare
);

biddingRouter.post("/lowest-fare-sequence", authenticate, lowestFareSeq);
biddingRouter.post(
  "/get-lowest-one-way-fare",
  authenticate,
  getLowestOneWayFare
);
biddingRouter.post("/lowest-bidding-fare", authenticate, lowestBiddingFare);

biddingRouter.post("/delete-bidding", authenticate, deleteBidding);
biddingRouter.post("/update-bidding",  biddingSequentialData); //updated bidding
biddingRouter.post("/get-active-bidding", authenticate, getActiveBidding);

biddingRouter.post("/update-bidding-data", authenticate, updateBiddingData);
biddingRouter.post(
  "/update-base-vehicle-type-data",
  authenticate,
  updateBaseVehicleTypeData
);
biddingRouter.post("/update-one-way-city", authenticate, updateOnewayCity);

biddingRouter.post("/update-distance-fare", authenticate, updateDistanceFare);
biddingRouter.post("/update-toll-tax-fare", authenticate, updateTollTaxFare);
biddingRouter.post("/update-driver-fare", authenticate, updateDriverFare);

export default biddingRouter;
