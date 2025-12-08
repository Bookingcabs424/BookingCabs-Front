import express from "express";
import MasterPackageController from "../controllers/masterPackageController.js";


const packageRouter = express.Router();

packageRouter.get("/", MasterPackageController.getAllPackage);
packageRouter.post("/get-packages", MasterPackageController.getPackages);
packageRouter.post("/add-packages", MasterPackageController.addPackage);
packageRouter.post("/update-package", MasterPackageController.updatePackage);
packageRouter.put("/update-package-status", MasterPackageController.updatePackageStatus);
packageRouter.delete("/delete-packages", MasterPackageController.deletePackages);
packageRouter.post("/search-packages", MasterPackageController.searchPackages);


export default packageRouter;