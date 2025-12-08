import express from "express";
import {
  addCompanyMarkup,
  cityActivePackage,
  deleteMarkup,
  fetchCityStateCountryByNameOrId,
  fetchStateCountByStateName,
  getAirportDataList,
  getCancellationPolicyDetails,
  getCities,
  getCompanyFareMarkup,
  getCompanyFareMarkupData,
  getCompanyMarkup,
  getCompanyMarkupLogs,
  getCountries,
  getDocumentationDetails,
  getItineraryDescriptionDetails,
  getLocalPackage,
  getRefundPolicyDetails,
  getStates,
  getTermConditionsDetails,
  getTourExclusionDetails,
  getTransferDetails,
  getUserMarkupDetails,
  getVehicleAmenities,
  packageCity,
  updateCompanyMarkup,
  updateMarkupStatus,
} from "../controllers/masterCityController.js";

const router = express.Router();
/**
 * @swagger
 * /city/packageCity:
 *   get:
 *     summary: Retrieve distinct cities based on city name and package ID
 *     tags:
 *       - CitySearch
 *     parameters:
 *       - in: query
 *         name: city_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the city to search (letters and spaces only)
 *       - in: query
 *         name: master_package_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID of the master package to filter base combinations
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: false
 *         description: Exact city name to match
 *     responses:
 *       200:
 *         description: Successful retrieval of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       city_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       north_east_latitude:
 *                         type: number
 *                       north_east_longitude:
 *                         type: number
 *                       south_west_latitude:
 *                         type: number
 *                       south_west_longitude:
 *                         type: number
 *                       state_name:
 *                         type: string
 *                       country_code:
 *                         type: string
 *                       country_id:
 *                         type: integer
 *       400:
 *         description: Invalid city name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Invalid city name.
 *       404:
 *         description: No city found matching the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: City not active send request manually!!
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.get("/packageCity", packageCity);
router.get("/city-active-package", cityActivePackage);
router.get("/cities", getCities);

router.post("/get-local-pkg", getLocalPackage);
router.post("/get-vehicle-amenities", getVehicleAmenities);
router.post("/get-payment-structure", getTourExclusionDetails);
router.post("/get-documentation-details", getDocumentationDetails);
router.post("/get-master-cancellation", getCancellationPolicyDetails);
router.post("/master-refund-policy", getRefundPolicyDetails);
router.post("/master-term-comdition", getTermConditionsDetails);
router.post("/get-transfer-master", getTransferDetails);
router.post("/get-airport-master", getAirportDataList);
router.post("/get-itenary-description", getItineraryDescriptionDetails);
router.post("/get-markup", getCompanyMarkup);
router.post("/add-company-markup", addCompanyMarkup);
router.post("/get-fare-markup", getCompanyFareMarkup);
router.post("/get-fare-markup-data", getCompanyFareMarkupData);
router.post("/update-markup", updateCompanyMarkup);
router.post("/update-markup-status", updateMarkupStatus);
router.post("/get-company-markup-log", getCompanyMarkupLogs);
router.post("/get-markup-detail", getUserMarkupDetails);
router.post("/delete-markup", deleteMarkup);
router.post("/get-cities", getCities);
router.post("/get-states", getStates);
router.post("/get-countries", getCountries);
router.post("/get-states-by-name", fetchStateCountByStateName);
router.post("/get-city-by-name", fetchCityStateCountryByNameOrId);
export default router;
