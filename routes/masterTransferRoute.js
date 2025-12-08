import express from 'express';
import MasterTransferController from '../controllers/masterTransferMasterController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();
router.post('/upload-image', upload.single('thumb_image'), MasterTransferController.uploadImage)
router.post('/get-transfer-details', MasterTransferController.getTransferDetails);
router.post('/add-transfer-details', MasterTransferController.addTransferDetails);
router.post('/update-transfer-details', MasterTransferController.updateTransferDetails);
router.put('/transfer-status', MasterTransferController.transferStatus);

export default router;