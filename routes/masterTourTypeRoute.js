import express from 'express';
import TourTypeController from '../controllers/masterTourTypeController.js';

const tourBookingTypeRouter = express.Router();

// GET - Get all tour booking types
tourBookingTypeRouter.get('/', TourTypeController.GetAllTourBookingTypes);

export default tourBookingTypeRouter;