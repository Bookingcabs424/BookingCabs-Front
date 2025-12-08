import express from 'express';
import { get_location } from '../controllers/locationController.js';
const countryrouter = express.Router()

countryrouter.get('/get-country',get_country)

export default countryrouter