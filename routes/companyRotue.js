import {
  getCompanyDetail,
  addCompanyDetail,
  updateCompanyDetail,
  softDeleteCompanyDetail,
  getAllCompanyDetail,
  getCompanyDetails,
  updateCompanyDataWhileRegstration,
  getCompanies,
  companyDocuments,
  companyKycDetailUpdate,
  getCompanyDetailById,
  getCompanyById,
  toggleCompanyBranch,
  getUserCompanyDetails,
} from "../controllers/companyController.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import express from "express";
import upload from "../middlewares/upload.js";
const company = express.Router();
const requireFolderQuery = (req, res, next) => {
  if (!req.query.folder) {
    return res
      .status(400)
      .json({ message: "Missing 'folder' query parameter" });
  }
  next();
};
/**
 * @swagger
 * tags:
 *   - name: Company
 *     description: Endpoints related to company management
 */


/**
 * @swagger
 * /company:
 *   get:
 *     summary: Get current user's company detail
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company detail fetched successfully
 *       401:
 *         description: Unauthorized
 */
company.route("/").get(authenticate, getCompanyDetail);

/**
 * @swagger
 * /company/all:
 *   get:
 *     summary: Get all company details (Admin only)
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all companies
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
company.route("/all").get(authenticate, hasRole("admin"), getAllCompanyDetail);

/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyDetail:
 *       type: object
 *       required:
 *         - company_name
 *         - contact_person_name
 *         - company_address
 *         - city_id
 *         - mobile_no
 *       properties:
 *         company_name:
 *           type: string
 *           description: Name of the company
 *         contact_person_name:
 *           type: string
 *           description: Name of the contact person
 *         company_address:
 *           type: string
 *           description: Full address of the company
 *         city_id:
 *           type: integer
 *           description: ID of the city
 *         mobile_no:
 *           type: string
 *           description: Contact mobile number
 *         email:
 *           type: string
 *           description: Official email of the company
 *         landline_no:
 *           type: string
 *           description: Landline number
 *         pancard_no:
 *           type: string
 *           description: PAN card number
 *         website_url:
 *           type: string
 *           description: Website URL
 *         country_id:
 *           type: integer
 *           description: ID of the country
 *         state_id:
 *           type: string
 *           description: ID of the state
 *         pincode:
 *           type: string
 *           description: Pincode
 *         service_tax_gst:
 *           type: string
 *           description: service_tax_gst
 *         Alternate email:
 *           type: string
 *           description: Alternate email
 *         brand_name:
 *           type: string
 *           description: Brand name
 */

/**
 * @swagger
 * /company/company-info:
 *   post:
 *     summary: Add a new company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyDetail'
 *     responses:
 *       200:
 *         description: Company created successfully
 *       401:
 *         description: Unauthorized
 */
company.route("/company-info").post(authenticate, addCompanyDetail);

/**
 * @swagger
 * /company/{id}:
 *   put:
 *     summary: Update a company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *                 description: Name of the company
 *               contact_person_name:
 *                 type: string
 *                 description: Name of the contact person
 *               company_address:
 *                 type: string
 *                 description: Full address of the company
 *               city_id:
 *                 type: integer
 *                 description: ID of the city
 *               mobile_no:
 *                 type: string
 *                 description: Contact mobile number
 *               email:
 *                 type: string
 *                 description: Official email of the company
 *               landline_no:
 *                 type: string
 *                 description: Landline number
 *               pancard_no:
 *                 type: string
 *                 description: PAN card number
 *               website_url:
 *                 type: string
 *                 description: Website URL
 *               state_id:
 *                 type: string
 *                 description: ID of the state
 *               pincode:
 *                 type: string
 *                 description: Pincode
 *               service_tax_gst:
 *                 type: string
 *                 description: Service tax or GST number
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       401:
 *         description: Unauthorized
 */
company.route("/:id").put(authenticate, updateCompanyDetail);

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     summary: Soft delete a company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company soft deleted
 *       401:
 *         description: Unauthorized
 */


company.route("/:id").delete(authenticate, softDeleteCompanyDetail);
company.route("/company-detail").post(getCompanyDetails);
company.route("/company-detail/:id").put(updateCompanyDataWhileRegstration);
company.get("/get-companies", authenticate,getCompanies);
company
  .route("/:id/photo")
  .post(
    authenticate,
    requireFolderQuery,
    upload.single("file"),
    companyDocuments
  );
company.route("/kyc_update/:id").patch(companyKycDetailUpdate);
company.get("/get/:id", authenticate, getCompanyById);

company.patch('/branch/toggle',authenticate,toggleCompanyBranch);

company.get("/get-company-detail",authenticate,getUserCompanyDetails);
company.route("/:id").get(getCompanyDetailById);



export default company;

