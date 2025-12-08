import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js";
import { createCityPage, deleteCityPage, getCityPageById, getCityPages } from "../controllers/cityPageController.js";

const cityPageRoute = express.Router();

// Get all city pages (with filters optional)
cityPageRoute.get("/get-city-pages", authenticate, getCityPages);

// Get single city page by ID
cityPageRoute.get("/get-city-page/:id", authenticate, getCityPageById);

// Create new city page
cityPageRoute.post("/add-city-page", authenticate, createCityPage);

// Delete (soft/hard depends on your controller)
cityPageRoute.delete("/delete-city-page/:id", authenticate, deleteCityPage);

export default cityPageRoute;
