import express from 'express';
import MasterPaymentStructureController from '../controllers/masterPaymentStructureController.js';

const router = express.Router();

router.post('/get-payment-structure-details', MasterPaymentStructureController.getPaymentStructureDetails);
router.post('/add-payment-structure-details', MasterPaymentStructureController.addPaymentStructureDetails);
router.post('/update-payment-structure-details', MasterPaymentStructureController.updatePaymentStructureDetails);
router.put('/payment-structure-status', MasterPaymentStructureController.paymentStructureStatus);

export default router;