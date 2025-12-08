import {
  createCampaignMaster,
  getAllCampaigns,
  deleteTemplate,
  updateTemplate,
  getSingleCampaign,
} from "../controllers/campaignMasterController.js";
import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";

const campaign = express.Router();

campaign.route("/").post(authenticate, createCampaignMaster);

campaign.route("/get-campaigns").get(authenticate, getAllCampaigns);

campaign.route("/").get(authenticate, getSingleCampaign);

campaign.route("/").put(authenticate, updateTemplate);

campaign.route("/").delete(authenticate, deleteTemplate);

export default campaign;
