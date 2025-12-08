import express from 'express';
import MasterTourInclusionController from '../controllers/masterTourInclusionController.js';

const router = express.Router();

// POST - Get tour inclusion details
router.post('/get-tour-inclusion-details', MasterTourInclusionController.getTourInclusionDetails);

// POST - Add tour inclusion details
router.post('/add-tour-inclusion-details', MasterTourInclusionController.addTourInclusionDetails);

// POST - Update tour inclusion details
router.post('/update-tour-inclusion-details', MasterTourInclusionController.updateTourInclusionDetails);

// PUT - Update tour inclusion status (multiple)
router.put('/tour-inclusion-status', MasterTourInclusionController.tourInclusionStatus);

// DELETE - Delete tour inclusions (multiple)
router.delete('/delete-tour-inclusions', MasterTourInclusionController.deleteTourInclusions);

// PUT - Soft delete tour inclusions
router.put('/soft-delete-tour-inclusions', MasterTourInclusionController.softDeleteTourInclusions);

export default router;