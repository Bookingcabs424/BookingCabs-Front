import express from 'express';
import MasterTourExclusionController from '../controllers/masterTourExclusionController.js';

const router = express.Router();

// POST - Get tour exclusion details
router.post('/get-tour-exclusion-details', MasterTourExclusionController.getTourExclusionDetails);

// POST - Add tour exclusion details
router.post('/add-tour-exclusion-details', MasterTourExclusionController.addTourExclusionDetails);

// POST - Update tour exclusion details
router.post('/update-tour-exclusion-details', MasterTourExclusionController.updateTourExclusionDetails);

// PUT - Update tour exclusion status (multiple)
router.put('/tour-exclusion-status', MasterTourExclusionController.tourExclusionStatus);

// DELETE - Delete tour exclusions (multiple)
router.delete('/delete-tour-exclusions', MasterTourExclusionController.deleteTourExclusions);

// PUT - Soft delete tour exclusions
router.put('/soft-delete-tour-exclusions', MasterTourExclusionController.softDeleteTourExclusions);

export default router;