import MasterCancellationPolicyController from "../controllers/masterCancellationPolicyController.js";

import express from 'express';


const router = express.Router();

router.post('/get-cancellation-policy-details', MasterCancellationPolicyController.getCancellationPolicyDetails);
router.post('/add-cancellation-policy-details', MasterCancellationPolicyController.addCancellationPolicyDetails);
router.post('/update-cancellation-policy-details', MasterCancellationPolicyController.updateCancellationPolicyDetails);
router.put('/cancellation-policy-status', MasterCancellationPolicyController.cancellationPolicyStatus);

export default router;