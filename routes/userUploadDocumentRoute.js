import express from "express";
import upload from "../middlewares/upload.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import {
  uploadUserDocument,
  getUserDocuments,
  getUserPendingDocuments,
  updateUserDocument,
  getAllUserDocuments,
  getAllUserPendingDocuments,
} from "../controllers/userUploadDocumentController.js";

const userUploadRoute = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User Documents
 *     description: Endpoints related to uploading and managing user documents
 */

/**
 * @swagger
 * /userDocument:
 *   post:
 *     summary: Upload a document for a user
 *     tags: [User Documents]
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
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
userUploadRoute
  .route("/")
  .post(authenticate, upload.single("file"), uploadUserDocument);

/**
 * @swagger
 * /userDocument:
 *   get:
 *     summary: Get all uploaded documents of a user
 *     tags: [User Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents
 *       401:
 *         description: Unauthorized
 */
userUploadRoute.route("/doc").get(authenticate, getUserDocuments);

/**
 * @swagger
 * /userDocument/get-all-user-documents:
 *   get:
 *     summary: Get all uploaded documents of all users (Admin only)
 *     tags: [User Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users' documents
 *       401:
 *         description: Unauthorized
 */
userUploadRoute
  .route("/get-all-user-documents")
  .get(authenticate, hasRole("admin"), getAllUserDocuments);

/**
 * @swagger
 * /userDocument/pending:
 *   get:
 *     summary: Get all pending documents of a user
 *     tags: [User Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending documents
 *       401:
 *         description: Unauthorized
 */
userUploadRoute.route("/pending").get(authenticate, getUserPendingDocuments);

/**
 * @swagger
 * /userDocument/get-all-user-pending-documents:
 *   get:
 *     summary: Get all pending documents of all users (Admin only)
 *     tags: [User Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all pending documents
 *       401:
 *         description: Unauthorized
 */
userUploadRoute
  .route("/get-all-user-pending-documents")
  .get(authenticate, hasRole("admin"), getAllUserPendingDocuments);

/**
 * @swagger
 * /userDocument/{upload_doc_id}:
 *   put:
 *     summary: Update an uploaded document
 *     tags: [User Documents]
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
userUploadRoute.route("/update").put(authenticate, updateUserDocument);

export default userUploadRoute;
