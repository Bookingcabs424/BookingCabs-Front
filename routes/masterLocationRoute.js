import express from 'express';
import MasterLocationController from '../controllers/masterLocationController.js';

const router = express.Router();

// POST - Get locations with filters
router.post('/get-locations', MasterLocationController.getLocations);

// POST - Add new location with auto-geocoding
router.post('/add-location', MasterLocationController.addLocation);

// POST - Update location
router.post('/update-location', MasterLocationController.updateLocation);

// DELETE - Delete locations (multiple)
router.delete('/delete-locations', MasterLocationController.deleteLocations);

// POST - Search locations
router.post('/search-locations', MasterLocationController.searchLocations);

// POST - Get locations by coordinates (nearby search)
router.post('/get-locations-by-coordinates', MasterLocationController.getLocationsByCoordinates);

export default router;