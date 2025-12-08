import express from "express";
import { getCountryUserPercentage } from "../controllers/userController.js";


const dashboardRouter = express.Router();

dashboardRouter.get("/country-percentage", getCountryUserPercentage);


export default dashboardRouter;