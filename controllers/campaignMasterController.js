import sequelize from "../config/clientDbManager.js";
import { MESSAGES } from "../constants/const.js";
import CampaignMaster from "../models/campaignMasterModel.js";
import EmailTemplate from "../models/emailTemplateModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

// export const createCampaignMaster = async (req, res) => {
//   const {
//     campaign_name,
//     campaign_id,
//     list_id,
//     template_id,
//     generate_url,
//     scheduled_date,
//     launch_date,
//     receipents,
//   } = req.body;

//   try {
//     const campaignData = await CampaignMaster.create({
//       campaign_name,
//       campaign_id,
//       list_id,
//       template_id,
//       generate_url,
//       scheduled_date,
//       launch_date,
//       receipents,
//     });
//     return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL, {
//       campaignData,
//     });
//   } catch (error) {
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error.message
//     );
//   }
// };

// export const getAllCampaigns = async (req, res) => {
//   const { company_id } = req.body;
//   try {
//     const campaigns = await CampaignMaster.findAll({
//       where: { company_id: company_id },
//     });
//     return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL, {
//       campaigns,
//     });
//   } catch (error) {
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error.message
//     );
//   }
// };


export const createCampaignMaster = async (req, res) => {
  const {
    campaign_name,
    company_id,        
    list_id,
    user_type_id,
    template_id,
    user_ids,         
    launch_status,     
    generate_url,
    scheduled_date,
    launch_date,
    recipients,       
    created_by,        
  } = req.body;

  try {
    // Validate required fields
    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "company_id is required",
      });
    }

    if (!campaign_name) {
      return res.status(400).json({
        success: false,
        message: "campaign_name is required",
      });
    }

    if (!list_id) {
      return res.status(400).json({
        success: false,
        message: "list_id is required",
      });
    }

    if (!template_id) {
      return res.status(400).json({
        success: false,
        message: "template_id is required",
      });
    }

    const campaignData = await CampaignMaster.create({
      company_id,           
      campaign_name,
      list_id,
      user_type_id,
      template_id,
      user_ids: user_ids || [],  
      launch_status: launch_status || "Pending", 
      generate_url,
      scheduled_date: scheduled_date || null,
      launch_date: launch_date || null,
      recipients: recipients || 0,  
      created_by,           
    });

    return res.status(200).json({
      success: true,
      message: "Campaign created successfully",
      data: campaignData,
    });
  } catch (error) {
    console.error("createCampaignMaster error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const { company_id } = req.query;

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "company_id is required",
      });
    }

    const query = `
      SELECT 
        c.id,
        c.campaign_name,
        c.user_ids,
        c.list_id,
        c.template_id,
        c.launch_status,
        c.scheduled_date,
        c.launch_date,
        c.recipients,
        t.name AS template_name,
        t.type AS template_type
      FROM campaign_master c
      LEFT JOIN email_templates t
        ON c.template_id = t.id
      WHERE c.company_id = :company_id
    `;

    const campaigns = await sequelize.query(query, {
      replacements: { company_id },
      type: sequelize.QueryTypes.SELECT,
    });
    
    return res.status(200).json({
      success: true,
      message: "Campaign list fetched successfully",
      data: campaigns,
    });
  } catch (error) {
    console.error("getAllCampaigns error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


export const getSingleCampaign = async (req, res) => {
  const { id } = req.query;
  try {
    const campaign = await CampaignMaster.findOne({
      where: { id: id },
    });
    return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL, {
      campaign,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};
// export const deleteTemplate = async (req, res) => {
//   try {
//     const { id } = req.body;

//     if (!id) {
//       return errorResponse(res, "Template ID is required");
//     }

//     const deletedTemplate = await CampaignMaster.findByIdAndDelete(id);

//     if (!deletedTemplate) {
//       return errorResponse(res, "Template not found");
//     }

//     return successResponse(res, "Template deleted successfully", deletedTemplate);
//   } catch (error) {
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error.message
//     );
//   }
// };

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return errorResponse(res, "Template ID is required");
    }

    const deletedRows = await CampaignMaster.destroy({ where: { id } });

    if (deletedRows === 0) {
      return errorResponse(res, "Template not found");
    }

    return successResponse(res, "Template deleted successfully");
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};
export const updateTemplate = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return errorResponse(res, "Template ID is required");
    }

    const [updatedRows] = await CampaignMaster.update(updateData, {
      where: { id },
    });

    if (updatedRows === 0) {
      return errorResponse(res, "Template not found or no changes made");
    }

    const updatedTemplate = await CampaignMaster.findOne({ where: { id } });

    return successResponse(
      res,
      "Template updated successfully",
      updatedTemplate
    );
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};
