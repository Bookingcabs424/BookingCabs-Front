import MasterAirportRailwayController from '../controllers/masterAirportRailwayController.js'; 
import express from 'express';

const router = express.Router();


router.post('/add', MasterAirportRailwayController.addAirportRailway);
router.put('/update', MasterAirportRailwayController.updateAirportRailway);
router.get('/:id', MasterAirportRailwayController.getAirportRailwayById);

router.post('/master-airport', MasterAirportRailwayController.masterAirport);
router.post('/get-airport-data', MasterAirportRailwayController.getAirportData);
router.put('/update-status', MasterAirportRailwayController.updateStatus);
router.get('/get-ajax-airport-list', MasterAirportRailwayController.getAjaxAirportList);
router.post('/get-airport-data-list', MasterAirportRailwayController.getAirportDataList);

export default router;