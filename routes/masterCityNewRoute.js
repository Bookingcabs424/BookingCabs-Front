import express from 'express';
import MasterCityNewController from '../controllers/masterCityNewController';

const router = express.Router();

// POST - Get cities with filters
router.post('/get-cities', MasterCityNewController.getCities);

// POST - Add new city
router.post('/add-city', MasterCityNewController.addCity);

// POST - Update city
router.post('/update-city', MasterCityNewController.updateCity);

// PUT - Update city status (multiple)
router.put('/update-city-status', MasterCityNewController.updateCityStatus);

// DELETE - Delete cities (multiple)
router.delete('/delete-cities', MasterCityNewController.deleteCities);

// POST - Search cities
router.post('/search-cities', MasterCityNewController.searchCities);

// POST - Get active cities for dropdown
router.post('/get-active-cities', MasterCityNewController.getActiveCities);

// POST - Get cities by service type
router.post('/get-cities-by-service-type', MasterCityNewController.getCitiesByServiceType);

export default router;