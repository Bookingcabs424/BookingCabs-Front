import express from "express";
import {
  createRole,
  updateRole,
  softDeleteRole,
  addUserAssignedRole,
  getUserRoleList
} from "../controllers/userRoleController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const roleRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role management endpoints
 */

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles
 *       401:
 *         description: Unauthorized
 */
roleRouter.route("/").get(getUserRoleList);

/**
 * @swagger
 * /role/create:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_name
 *             properties:
 *               role_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
roleRouter.route("/create").post(authenticate, createRole);

/**
 * @swagger
 * /role/update:
 *   put:
 *     summary: Update an existing role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - role_name
 *             properties:
 *               id:
 *                 type: integer
 *               role_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 *       401:
 *         description: Unauthorized
 */
roleRouter.route("/update").put(authenticate, updateRole);

/**
 * @swagger
 * /role/delete:
 *   post:
 *     summary: Soft delete a role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       401:
 *         description: Unauthorized
 */
roleRouter.route("/delete").post(authenticate, softDeleteRole);

/**
 * @swagger
 * /role/assignRole:
 *   post:
 *     summary: Assign one or more roles to a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_roles
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user
 *               user_roles:
 *                 type: string
 *                 description: Comma-separated role IDs (e.g., "1,2,3")
 *               ip:
 *                 type: string
 *                 description: IP address from which the request originated
 *     responses:
 *       201:
 *         description: Roles assigned successfully
 *       400:
 *         description: Bad request or missing required fields
 *       500:
 *         description: Internal server error
 */
roleRouter.post("/assignRole", authenticate, addUserAssignedRole);

export default roleRouter;
