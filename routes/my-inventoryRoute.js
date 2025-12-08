import MyInventory from "../controllers/myinventory.controller.js";


import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
const myinventoryRouter = express.Router();


myinventoryRouter.get('/vehicle-types', MyInventory.getAllVehicleTypesWithCount);
myinventoryRouter.get("/models/:typeId", MyInventory.getModelsByType)
myinventoryRouter.get("/vehicles",  MyInventory.getAllVehiclesTableData);
myinventoryRouter.post("/add", authenticate , MyInventory.addVehicle);
myinventoryRouter.get("/unique-models", MyInventory.getVehicleModels);
myinventoryRouter.delete("/vehicles/delete", authenticate , MyInventory.deleteVehicles);

export default myinventoryRouter;