import express from 'express';
import MasterCityIntroductionController from '../controllers/masterCityIntroductionController.js';

const router = express.Router();

router.post('/get-city-introduction-details', MasterCityIntroductionController.getCityIntroductionDetails);
router.post('/add-city-introduction-details', MasterCityIntroductionController.addCityIntroductionDetails);
router.post('/update-city-introduction-details', MasterCityIntroductionController.updateCityIntroductionDetails);
router.put('/city-introduction-status', MasterCityIntroductionController.cityIntroductionStatus);

export default router;