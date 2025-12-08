import express from 'express';
import NotificationController from '../controllers/notificationController.js';

const router = express.Router();

// Send claim booking SMS
router.post('/send-claim-booking-sms', NotificationController.sendClaimBookingSms);


export default router;