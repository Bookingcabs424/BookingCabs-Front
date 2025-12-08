import express from 'express';
import MasterTermsConditionPolicyController from '../controllers/masterTermsAndConditionPolicyController.js';

const router = express.Router();

router.post('/get-term-conditions-details', MasterTermsConditionPolicyController.getTermConditionsDetails);
router.post('/add-term-conditions-details', MasterTermsConditionPolicyController.addTermConditionsDetails);
router.post('/update-term-conditions-details', MasterTermsConditionPolicyController.updateTermConditionsDetails);
router.put('/term-conditions-policy-status', MasterTermsConditionPolicyController.termConditionsPolicyStatus);

export default router;