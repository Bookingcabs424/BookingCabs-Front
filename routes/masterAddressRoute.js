import { add } from 'date-fns';
import express from 'express';
import { getAddressData, getAirportAddresses } from '../controllers/addresssController.js';
const addressRouter = express.Router()

addressRouter.get('/get-address',getAddressData)

addressRouter.get('/get-airport-railway',getAirportAddresses)
export default addressRouter;