import express from 'express';
import LocalPackageController from '../controllers/masterLocalPackageController.js';

const router = express.Router();

// GET - Get local packages 
router.post('/get-local-packages', LocalPackageController.getLocalPackages);

// POST - Add new local package
router.post('/add-local-package', LocalPackageController.addLocalPackage);

// POST - Update local package
router.post('/update-local-package', LocalPackageController.updateLocalPackage);

// PUT - Update local package status (multiple)
router.put('/update-local-package-status', LocalPackageController.updateMasterLocalPackageStatus);

// DELETE - Delete local packages (multiple)
router.delete('/delete-local-packages', LocalPackageController.deleteLocalPackages);

router.get("/get-booking-types-modes", LocalPackageController.getBookingTypesAndModes)
// PUT - Soft delete local packages
router.put('/soft-delete-local-packages', LocalPackageController.softDeleteLocalPackages);

// PUT - Reorder local packages
router.put('/reorder-local-packages', LocalPackageController.reorderLocalPackages);

// POST - Get packages by booking type and mode
router.post('/get-packages-by-booking-type-mode', LocalPackageController.getPackagesByBookingTypeAndMode);

// POST - Search local packages
router.post('/search-local-packages', LocalPackageController.searchLocalPackages);

// POST - Get active local packages for dropdown
router.post('/get-active-local-packages', LocalPackageController.getActiveLocalPackages);
export default router;