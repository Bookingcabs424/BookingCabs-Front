import express from 'express';
import MasterItineraryDescriptionController from '../controllers/masterIteniaryDescriptionController.js';

const router = express.Router();

// POST - Get itinerary description details
router.post('/get-itinerary-description-details', MasterItineraryDescriptionController.getItineraryDescriptionDetails);

// POST - Add itinerary description details
router.post('/add-itinerary-description-details', MasterItineraryDescriptionController.addItineraryDescriptionDetails);

// POST - Update itinerary description details
router.post('/update-itinerary-description-details', MasterItineraryDescriptionController.updateItineraryDescriptionDetails);

// PUT - Update itinerary description status (publish/unpublish/delete)
router.put('/itinerary-description-status', MasterItineraryDescriptionController.itineraryDescriptionStatus);

export default router;