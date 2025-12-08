import express from "express";
import upload from "../middlewares/upload.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import {
  uploadUserVehicleDocument,
  getUserVehicleDocuments,
  getUserPendingDocuments,
  updateUserVehicleDocument,
  getAllUserVehicleDocuments,
  getAllUserPendingDocuments,
} from "../controllers/userVehicleUploadDocumentController.js";

const userVehicleUploadRoute = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User Vehicle Documents
 *     description: Endpoints related to uploading and managing User Vehicle Documents
 */

/**
 * @swagger
 * /userVehicleDocument:
 *   post:
 *     summary: Upload a document for a user
 *     tags: [User Vehicle Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               parent_id:
 *                 type: integer
 *               document_type_id:
 *                 type: integer
 *               doc_approval_status:
 *                 type: boolean
 *               doc_default_status:
 *                 type: boolean
 *               vehicle_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
userVehicleUploadRoute
  .route("/")
  .post(authenticate, upload.single("file"), uploadUserVehicleDocument);

/**
 * @swagger
 * /userVehicleDocument:
 *   get:
 *     summary: Get all uploaded documents of a user
 *     tags: [User Vehicle Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents
 *       401:
 *         description: Unauthorized
 */
userVehicleUploadRoute.route("/").get(authenticate, getUserVehicleDocuments);

/**
 * @swagger
 * /userVehicleDocument/get-all-user-vehicle-documents:
 *   get:
 *     summary: Get all uploaded documents of all users (Admin only)
 *     tags: [User Vehicle Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users' documents
 *       401:
 *         description: Unauthorized
 */
userVehicleUploadRoute
  .route("/get-all-user-vehicle-documents")
  .get(authenticate, hasRole("admin"), getAllUserVehicleDocuments);

/**
 * @swagger
 * /userVehicleDocument/pending:
 *   get:
 *     summary: Get all pending documents of a user
 *     tags: [User Vehicle Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending documents
 *       401:
 *         description: Unauthorized
 */
userVehicleUploadRoute.route("/pending").get(authenticate, getUserPendingDocuments);

/**
 * @swagger
 * /userVehicleDocument/get-all-user-pending-documents:
 *   get:
 *     summary: Get all pending documents of all users (Admin only)
 *     tags: [User Vehicle Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all pending documents
 *       401:
 *         description: Unauthorized
 */
userVehicleUploadRoute
  .route("/get-all-user-pending-documents")
  .get(authenticate, hasRole("admin"), getAllUserPendingDocuments);

/**
 * @swagger
 * /userVehicleDocument/{upload_doc_id}:
 *   put:
 *     summary: Update an uploaded document
 *     tags: [User Vehicle Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: upload_doc_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the uploaded document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parent_id:
 *                 type: integer
 *               document_type_id:
 *                 type: integer
 *               doc_approval_status:
 *                 type: boolean
 *               doc_default_status:
 *                 type: boolean
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       401:
 *         description: Unauthorized
 */
userVehicleUploadRoute.route("/:upload_doc_id").put(authenticate, updateUserVehicleDocument);

export default userVehicleUploadRoute;
