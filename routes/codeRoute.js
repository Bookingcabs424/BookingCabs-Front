import express from "express";
import { createBasicTax, getBasicTaxesWithFilters, getSacCodeDetails } from "../controllers/codeController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const codeRoute = express.Router();
codeRoute.get("/get-sac-codes",getSacCodeDetails)
codeRoute.post("/add-basic-tax",createBasicTax)
codeRoute.get("/get-basic-tax",authenticate,getBasicTaxesWithFilters)
export default codeRoute