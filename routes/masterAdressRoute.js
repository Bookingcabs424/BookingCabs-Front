import express from 'express';
import MasterAddressController from '../controllers/masterAdrssController.js';

const router = express.Router();

// POST - Get addresses with filters
router.post('/get-addresses', MasterAddressController.getAddresses);

// POST - Add new address with auto-geocoding
router.post('/add-address', MasterAddressController.addAddress);

// POST - Update address
router.post('/update-address', MasterAddressController.updateAddress);

// DELETE - Delete addresses (multiple)
router.delete('/delete-addresses', MasterAddressController.deleteAddresses);

// POST - Search addresses
router.post('/search-addresses', MasterAddressController.searchAddresses);

// POST - Get addresses by coordinates (nearby search)
router.post('/get-addresses-by-coordinates', MasterAddressController.getAddressesByCoordinates);

// POST - Get hotels only
router.post('/get-hotels', MasterAddressController.getHotels);

export default router;