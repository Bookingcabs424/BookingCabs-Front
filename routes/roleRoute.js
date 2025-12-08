import express from "express";
import {
  createRole,
  deleteRole,
  getAllRoles,
  updateRole,
  updateRoleStatus
} from "../controllers/roleController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const staffRouter = express.Router();

staffRouter.post("/", authenticate, createRole);

staffRouter.get("/all-roles", authenticate, getAllRoles);

staffRouter.put("/update", authenticate, updateRole);

staffRouter.put("/update-status", authenticate, updateRoleStatus);

staffRouter.put("/delete-role", authenticate, deleteRole);

export default staffRouter;
