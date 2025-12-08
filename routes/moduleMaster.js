import express from "express";
import {
  savePermission,
  saveBulkPermissions,
  getPermissionsByUsertype,
  getModuleListNested,
  createModule,
  getModuleById,
  updateModule,
  deleteModule,
  getAllModules,
} from "../controllers/masterModuleController.js";

const router = express.Router();

/* ========================================================
   SWAGGER TAGS
======================================================== */
/**
 * @swagger
 * tags:
 *   name: Module API
 *   description: Module CRUD + Nested Menus
 */

/**
 * @swagger
 * tags:
 *   name: Permission API
 *   description: Role Wise Permission Management
 */

/* ========================================================
   MODULE ROUTES
======================================================== */

// Create module
router.post("/modules/create", createModule);

// All modules
router.get("/modules/list", getAllModules);

// Module details
router.get("/modules/detail/:id", getModuleById);

// Update module
router.put("/modules/update/:id", updateModule);

// Delete module
router.delete("/modules/delete/:id", deleteModule);

// Nested module list (with permissions)
router.get("/modules/nested", getModuleListNested);

/* ========================================================
   PERMISSION ROUTES
======================================================== */

// Save or update single permission
router.post("/permissions/save", savePermission);

// Bulk save permissions
router.post("/permissions/bulk", saveBulkPermissions);

// Get permissions for a usertype
router.get("/permissions/:usertype_id", getPermissionsByUsertype);

export default router;
