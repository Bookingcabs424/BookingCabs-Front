import express from 'express'
import { editPackage, getLocalPackageFares, getLocalPackages, getLocalPackagesmaster, updateLocalPackageStatus, upsertLocalPackageFare, upsertLocalPackageFareArr } from '../controllers/LocalPackageController.js'
import { authenticate, hasRole } from '../middlewares/authMiddleware.js'
const localpkgrouter = express.Router() 
localpkgrouter.get('/get-local-package', getLocalPackages)

localpkgrouter.get('/get-local-package-master', getLocalPackagesmaster)
localpkgrouter.post('/update',authenticate,hasRole("isAdmin") ,updateLocalPackageStatus)
localpkgrouter.post('/edit',authenticate,hasRole("isAdmin") ,editPackage)
localpkgrouter.get('/get-local-package-fare',getLocalPackageFares)
localpkgrouter.post("/fare/upsert",authenticate, upsertLocalPackageFareArr);

export default localpkgrouter