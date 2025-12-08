import express from "express";
import MasterActivityController from "../controllers/masterCityActivityController.js";

const router = express.Router();


router.post('/get-city-activity-details', MasterActivityController.getCityActivityDetails);
router.post('/add-city-activity-details', MasterActivityController.addCityActivityDetails);
router.post('/update-city-activity-details', MasterActivityController.updateCityActivityDetails);
router.put('/city-activity-status', MasterActivityController.cityActivityStatus);
router.post('/get-activity-fare', MasterActivityController.getActivityFare);
router.post('/add-activity-fare', MasterActivityController.addActivityFare);
router.post('/get-activity-fare-list', MasterActivityController.getActivityFareList);



export default router;

