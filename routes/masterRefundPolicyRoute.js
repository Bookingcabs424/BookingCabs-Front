import express from 'express';
import MasterRefundPolicyController from '../controllers/masterRefundPolicyController.js';

const router = express.Router();

router.post('/get-refund-policy-details', MasterRefundPolicyController.getRefundPolicyDetails);
router.post('/add-refund-policy-details', MasterRefundPolicyController.addRefundPolicyDetails);
router.post('/update-refund-policy-details', MasterRefundPolicyController.updateRefundPolicyDetails);
router.put('/refund-policy-status', MasterRefundPolicyController.refundPolicyStatus);

export default router;