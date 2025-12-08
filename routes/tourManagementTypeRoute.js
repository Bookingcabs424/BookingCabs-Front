import express from 'express';
import MasterTourThemeController from '../controllers/tourManagementTypeController.js';

const router = express.Router();

// POST - Get tour themes with filters and joins
router.post('/get-tour-themes', MasterTourThemeController.getTourThemes);

// POST - Add new tour theme
router.post('/add-tour-theme', MasterTourThemeController.addTourTheme);

// POST - Update tour theme
router.post('/update-tour-theme', MasterTourThemeController.updateTourTheme);

// PUT - Update tour theme status (multiple)
router.put('/update-tour-theme-status', MasterTourThemeController.updateTourThemeStatus);

// DELETE - Delete tour themes (multiple)
router.delete('/delete-tour-themes', MasterTourThemeController.deleteTourThemes);

// PUT - Soft delete tour themes
router.put('/soft-delete-tour-themes', MasterTourThemeController.softDeleteTourThemes);

// POST - Get tour themes by tour type
router.post('/get-tour-themes-by-tour-type', MasterTourThemeController.getTourThemesByTourType);

// POST - Search tour themes
router.post('/search-tour-themes', MasterTourThemeController.searchTourThemes);

// POST - Get active tour themes for dropdown
router.post('/get-active-tour-themes', MasterTourThemeController.getActiveTourThemes);

// POST - Check if theme name exists
router.post('/check-theme-name-exists', MasterTourThemeController.checkThemeNameExists);

// GET - Get tour types for dropdown
router.get('/get-tour-types', MasterTourThemeController.getTourTypes);

export default router;