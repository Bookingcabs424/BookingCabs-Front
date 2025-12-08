import express from 'express';
import MasterDocumentationController from '../controllers/masterDocumentationController.js';

const router = express.Router();

router.post('/get-documentation-details', MasterDocumentationController.getMasterDocumentation);
router.post('/add-documentation-details', MasterDocumentationController.addDocumentationDetails);
router.post('/update-documentation-details', MasterDocumentationController.updateDocumentationDetails);
router.put('/documentation-status', MasterDocumentationController.documentationStatus);

export default router;