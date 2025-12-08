import express from 'express';
import MasterBookingTypeController from '../controllers/masterBookingTypeController.js';

const router = express.Router();

// GET - Get booking types with filters
router.post('/get-booking-types', MasterBookingTypeController.getAllBookingTypes);

// POST - Add new booking type
router.post('/add-booking-type', MasterBookingTypeController.addBookingType);

// POST - Update booking type
router.post('/update-booking-type', MasterBookingTypeController.updateBookingType);

// PUT - Update booking type status (multiple)
router.put('/update-booking-type-status', MasterBookingTypeController.updateBookingTypeStatus);

// DELETE - Delete booking types (multiple)
router.delete('/delete-booking-types', MasterBookingTypeController.deleteBookingTypes);

// PUT - Soft delete booking types
router.put('/soft-delete-booking-types', MasterBookingTypeController.softDeleteBookingTypes);

// PUT - Reorder booking types
router.put('/reorder-booking-types', MasterBookingTypeController.reorderBookingTypes);

export default router;