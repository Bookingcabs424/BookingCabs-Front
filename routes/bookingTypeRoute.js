import express from 'express';
import { getAllBookingTypes } from '../controllers/bookingTypeController.js';
const router = express.Router();


router.get('/all-booking-types', getAllBookingTypes);
export default router;