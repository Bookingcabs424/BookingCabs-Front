import express from "express";
import {
  getVehicleDetail,
  getAllVehicleDetails,
  addVehicleDetail,
  updateVehicleDetail,
  softDeleteVehicleDetail,
  getAllVehicleModels,
  getVehicleTypeList,
  updateVehicleType,
  addVehicleType,
  getVehicleNameList,
  updateVehicleName,
  addVehicleName,
  getVehicleAmenities,
  updateAmenitiesStatus,
  addAmenities,
  updateAmenitiesData,
  updateVehicleNameData,
  addUserVehicleDetails,
  getVehicleColorCombo,
  getUserVehicleList,
  updateUserVehicleStatus,
  mapUserVehicle,
  updateUserVehicleDetails,
  getAllVehicleTypeBySeatingCapacity,
  getVehicleTypeDetails,
  //  createHelicopterShift,
  //  updateHelicopterShift,
  //  softDeleteHelicopterShift,
  //  getAllActiveHelicopterShifts,
  //  toggleHelicopterShiftStatus,
} from "../controllers/vehicleMasterController.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { name } from "ejs";
const vehicleRouter = express.Router();

// const requireFolderQuery = (req, res, next) => {
//   if (!req.query.folder && !req.body.folder) {
//     return res
//       .status(400)
//       .json({ message: "Missing 'folder' query parameter" });
//   }
//   next();
// };

/**
 * @swagger
 * tags:
 *   name: VehicleMaster
 *   description: API for managing vehicle master data
 */

/**
 * @swagger
 * /api/vehicle:
 *   get:
 *     summary: Get vehicle details of logged-in user
 *     tags: [VehicleMaster]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicle detail fetched successfully
 *       404:
 *         description: Vehicle not found
 */
vehicleRouter.route("/").get(authenticate, getVehicleDetail);

/**
 * @swagger
 * /api/vehicle/all:
 *   get:
 *     summary: Get all vehicle details
 *     tags: [VehicleMaster]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicle details
 *       404:
 *         description: No data found
 */
vehicleRouter.route("/all").get(authenticate, getAllVehicleDetails);

/**
 * @swagger
 * /api/vehicle:
 *   post:
 *     summary: Add a new vehicle detail
 *     tags: [VehicleMaster]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_name:
 *                 type: string
 *               vehicle_type:
 *                 type: string
 *               registration_no:
 *                 type: string
 *               fuel_type:
 *                 type: string
 *               [other_fields...]:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle detail added
 *       400:
 *         description: Bad request
 */
vehicleRouter.route("/").post(authenticate, addVehicleDetail);

/**
 * @swagger
 * /api/vehicle/{id}:
 *   put:
 *     summary: Update vehicle detail by ID
 *     tags: [VehicleMaster]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_name:
 *                 type: string
 *               vehicle_type:
 *                 type: string
 *               registration_no:
 *                 type: string
 *               fuel_type:
 *                 type: string
 *               [other_fields...]:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle detail updated
 *       404:
 *         description: Vehicle not found
 */
vehicleRouter.route("/:id").put(authenticate, updateVehicleDetail);

/**
 * @swagger
 * /api/vehicle/{id}:
 *   delete:
 *     summary: Soft delete vehicle detail by ID
 *     tags: [VehicleMaster]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle detail soft deleted
 *       404:
 *         description: Vehicle not found
 */
vehicleRouter.route("/:id").delete(authenticate, softDeleteVehicleDetail);
// vehicleRouter.get("/get-vehicle-types",getAllVehicleTypeBySeatingCapacity)
vehicleRouter
  .route("/get-vehicle-types")
  .get(getAllVehicleTypeBySeatingCapacity);

vehicleRouter.route("/vehicle-model").get(authenticate, getAllVehicleModels);
vehicleRouter.route("/vehicle-type").get(authenticate, getVehicleTypeList);
vehicleRouter
  .route("/vehicle-type/update")
  .put(authenticate, updateVehicleType);

vehicleRouter
  .route("/vehicle-type/add")
  .post(authenticate, upload.single("file"), addVehicleType);

vehicleRouter.route("/vehicle-type/get-name").get(getVehicleNameList);

vehicleRouter
  .route("/vehicle-type/update-name")
  .put(authenticate, updateVehicleName);
vehicleRouter.route("/vehicle-type/update-name-data").put(
  authenticate,
  upload.fields([
    { name: "left", maxCount: 1 },
    { name: "right", maxCount: 1 },
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
    { name: "interior", maxCount: 1 },
  ]),
  updateVehicleNameData
);
vehicleRouter.route("/vehicle-type/add-name").post(
  authenticate,
  upload.fields([
    { name: "left", maxCount: 1 },
    { name: "right", maxCount: 1 },
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
    { name: "interior", maxCount: 1 },
  ]),
  addVehicleName
);

vehicleRouter.route("/vehicle-type/amenities").get(getVehicleAmenities);

vehicleRouter
  .route("/vehicle-type/update-amenities")
  .put(authenticate, updateAmenitiesStatus);

vehicleRouter
  .route("/vehicle-type/add-amenities")
  .post(authenticate, addAmenities);

vehicleRouter
  .route("/vehicle-type/update-amenities-data")
  .put(authenticate, updateAmenitiesData);

vehicleRouter
  .route("/vehicle-type/add-user-vehicle")
  .put(authenticate, addUserVehicleDetails);

vehicleRouter
  .route("/vehicle-type/vehicle-color-combo")
  .get(authenticate, getVehicleColorCombo);

vehicleRouter
  .route("/vehicle-type/user-vehicle-list")
  .get(authenticate, getUserVehicleList);

vehicleRouter
  .route("/vehicle-type/update-user-status")
  .put(authenticate, updateUserVehicleStatus);

vehicleRouter
  .route("/vehicle-type/map-user-vehicle")
  .put(authenticate, mapUserVehicle);
vehicleRouter
  .route("/vehicle-type/update-vehicle-detail")
  .put(authenticate, updateUserVehicleDetails);

// vehicleRouter.route('/get-vehicle-types').get(getAllVehicleTypeBySeatingCapacity)

vehicleRouter.route("/get-all-vehicle-type").get(getVehicleTypeDetails);

// vehicleRouter.post('/create-shift',authenticate, createHelicopterShift);
// vehicleRouter.put('/:id',authenticate, updateHelicopterShift);
// vehicleRouter.delete('/:id',authenticate, softDeleteHelicopterShift); // Using DELETE method for semantic correctness
// vehicleRouter.get('/fetchHelicopterShift', getAllActiveHelicopterShifts);
// vehicleRouter.patch('/:id/status', toggleHelicopterShiftStatus);

export default vehicleRouter;
