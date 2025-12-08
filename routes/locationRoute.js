import express from 'express';
import { get_location } from '../controllers/locationController.js';
const locationrouter = express.Router()

locationrouter.get('/get-location',get_location)

export default locationrouter