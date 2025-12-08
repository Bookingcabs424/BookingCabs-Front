import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import CompanyDetail from "../models/companyDetailModel.js";
import MasterCity from "../models/masterCityModel.js";
import User from "../models/userModel.js";
import companyDetailView from "../views/viewCompanyDetail.js";
import GstVerification from "../models/gstVerificationModel.js";
import Company from "../models/companyModel.js";
import path from "path";
import UserInfo from "../models/userInfoModel.js";
import CompanyShare from "../models/companyShareModel.js";
import { Op } from "sequelize";
import sequelize from "../config/clientDbManager.js";
import UserUploadDocument from "../models/userUploadDocumentModel.js";

// export const getCompanyDetail = async (req, res) => {
//   const { id: user_id } = req.user;
//   const companyData = await Company.findAll({
//     where: { user_id },
//   });

//   const companyId = companyData?.[0]?.dataValues?.id;
//   console.log(companyData);

//   const GSTData = await GstVerification.findAll({
//     where: { company_id: companyId },
//   });

//   const gstData = GSTData?.dataValues;

//   const combinedData = {companyData,gstData}

//   try {
//     return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL_FETCHED, {
//         companyData,
//         gstData
//     });
//   } catch (error) {
//     return errorResponse(
//       res,
//       MESSAGES.COMPANY.COMPANY_NOT_FOUND,
//       error.message,
//       STATUS_CODE.NOT_FOUND
//     );
//   }
// };

export const getCompanyDetail = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    // Fetch all companies for the user
    const companies = await Company.findAll({
      where: { user_id },
    });

    if (!companies || companies.length === 0) {
      return res.status(200).json({ success: true, message: "No companies found", data: [] });
    }

    // For each company, fetch GST verification data
    const companyWithGstData = await Promise.all(
      companies.map(async (company) => {
        const companyId = company.id;

        const gstVerifications = await GstVerification.findAll({
          where: { company_id: companyId },
        });

        return {
          companyData: company,
          gstData: gstVerifications || [],
        };
      })
    );

    return successResponse(
      res,
      MESSAGES.COMPANY.COMPANY_DETAIL_FETCHED,
      companyWithGstData
    );
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.COMPANY.COMPANY_NOT_FOUND,
      error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};
export const getAllCompanyDetail = async (req, res) => {
  const companyData = await CompanyDetail.findAll({});
  try {
    return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL_FETCHED, {
      companyData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.AUTH.MISSING_FIELD,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

// export const addCompanyDetail = async (req, res) => {
//   const data = req.body;
//   const user_id = req.user.id;
//   // console.log(req.body);
//   // return;
//   // console.log('------------------------------------------------')
//   // console.log(data);
//   // console.log(data.company_address);
//   try {
//     const { company_name, company_size, gst } = data;
//
//     const user = await UserInfo.findOne({
//       where: {
//         user_id: Number(user_id),
//       },
//     });
//
//     const userD = await User.findOne({
//       where: {
//         id: Number(user_id),
//       },
//     });
//
//     if (!user) {
//       return errorResponse(
//         res,
//         MESSAGES.USER.USER_NOT_FOUND,
//         MESSAGES.USER.USER_NOT_FOUND
//       );
//     }
//     const stateAndCountryId = await MasterCity.findOne({
//       where: { id: Number(user.city_id) },
//     });
//
//     // const companyData = await CompanyDetail.create({
//     //   company_name: company_name,
//     //   company_size: company_size,
//     //   service_tax_gst: gst,
//     //   user_id,
//     //   added_by: user_id,
//     //   country: stateAndCountryId.country_id,
//     //   state: stateAndCountryId.state_id,
//     //   city_id: user.city_id,
//     //   company_address: "Not Provided",
//     //   contact_person_name: "Not Provided",
//     //   mobile_no: "",
//     //   company_logo_path: "Not Provided",
//     //   company_pancard_path: "Not Provided",
//     // });
//
//     const companyData = await Company.create({
//       company_name: company_name,
//       company_size: company_size,
//       gst: gst,
//       user_id,
//       added_by: user_id,
//       country: stateAndCountryId.country_id,
//       state: stateAndCountryId.state_id,
//       city: user.city_id ?? Number(data?.payload?.city),
//       company_address: data?.payload?.company_address ?? "Not Provided",
//       contact_person_name: data?.payload?.contact_person_name ?? "Not Provided",
//       mobile_no: data?.mobile,
//       company_logo_path: data?.payload?.company_logo_path ?? "Not Provided",
//       company_pancard_path:
//         data?.payload?.company_pancard_path ?? "Not Provided",
//       address_proof_path: data?.payload?.address_proof_path ?? "Not Provided",
//       gst_proof_path: data?.payload?.gst_proof_path ?? "Not Provided",
//       company_size: null,
//       createdAt: Date.now(),
//       branch: data?.payload?.branch,
//       company_size: data?.payload?.company_size,
//       pincode: data?.payload?.pincode || null,
//       website_url: data?.payload?.website_url || null,
//       email: data?.payload?.email || null,
//       mobile_no: data?.payload?.mobile_no || null,
//       landline_no: data?.payload?.landline_no || null,
//       pancard_no: data?.payload?.pancard_no || null,
//     });
//     data.user_email = userD.email;
//     data.user_mobile = userD.mobile;
//     data.cId = companyData.id;
//     // await updateCompanyDataWhileRegstration(data, res, true);
//     return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL, {
//       companyData,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error.message
//     );
//   }
// };


// export const addCompanyDetail = async (req, res) => {
//     const data = req.body;
//     const user_id = req.user.id;
//
//     try {
//         const { company_name, company_size, gst } = data;
//
//         const user = await UserInfo.findOne({
//             where: { user_id: Number(user_id) },
//         });
//
//         const userD = await User.findOne({
//             where: { id: Number(user_id) },
//         });
//
//         if (!user) {
//             return errorResponse(
//                 res,
//                 MESSAGES.USER.USER_NOT_FOUND,
//                 MESSAGES.USER.USER_NOT_FOUND
//             );
//         }
//
//         const stateAndCountryId = await MasterCity.findOne({
//             where: { id: Number(user.city_id) },
//         });
//
//         const payload = data?.payload || data; // fallback if frontend sends plain object
//
//         const companyData = await Company.create({
//             company_name: payload.company_name ?? company_name ?? "Not Provided",
//             company_size: payload.company_size ?? company_size ?? null,
//             service_tax_gst: payload.gst ?? gst ?? null,
//             user_id,
//             added_by: user_id,
//
//             // ✅ Payload values take precedence, fallback to user's city details
//             country: payload.country
//                 ? Number(payload.country)
//                 : stateAndCountryId?.country_id ?? null,
//
//             state: payload.state
//                 ? Number(payload.state)
//                 : stateAndCountryId?.state_id ?? null,
//
//             city: payload.city
//                 ? Number(payload.city)
//                 : user.city_id ?? null,
//
//             company_address: payload.company_address ?? "Not Provided",
//             contact_person_name: payload.contact_person_name ?? "Not Provided",
//             mobile_no: payload.mobile_no ?? userD.mobile ?? null,
//             company_logo_path: payload.company_logo_path ?? "Not Provided",
//             company_pancard_path: payload.company_pancard_path ?? "Not Provided",
//             address_proof_path: payload.address_proof_path ?? "Not Provided",
//             gst_proof_path: payload.gst_proof_path ?? "Not Provided",
//
//             branch: payload.branch ?? null,
//             pincode: payload.pincode ?? null,
//             website_url: payload.website_url ?? null,
//             email: payload.email ?? userD.email ?? null,
//             landline_no: payload.landline_no ?? null,
//             pancard_no: payload.pancard_no ?? null,
//
//             createdAt: new Date(),
//         });
//
//         // Add user details in response if needed
//         data.user_email = userD.email;
//         data.user_mobile = userD.mobile;
//         data.cId = companyData.id;
//
//         return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL, {
//             companyData,
//         });
//     } catch (error) {
//         console.error("Error adding company details:", error);
//         return errorResponse(
//             res,
//             MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//             error.message
//         );
//     }
// };

export const addCompanyDetail = async (req, res) => {
    const data = req.body;
    const user_id = req.user.id;

    const transaction = await sequelize.transaction(); // optional, ensures atomicity

    try {
        const { company_name, company_size, gst } = data;

        const user = await UserInfo.findOne({ where: { user_id: Number(user_id) } });
        const userD = await User.findOne({ where: { id: Number(user_id) } });

        if (!user) {
            return errorResponse(
                res,
                MESSAGES.USER.USER_NOT_FOUND,
                MESSAGES.USER.USER_NOT_FOUND
            );
        }

        const stateAndCountryId = await MasterCity.findOne({
            where: { id: Number(user.city_id) },
        });

        const payload = data?.payload || data; // supports both nested or flat body

        /** --------------------------
         * 1️⃣ Create Company Entry
         * -------------------------- */
        const companyData = await Company.create(
            {
                company_name: payload.company_name ?? company_name ?? "Not Provided",
                company_size: payload.company_size ?? company_size ?? null,
                service_tax_gst: payload.gst ?? null,
                user_id,
                added_by: user_id,

                country: payload.country
                    ? Number(payload.country)
                    : stateAndCountryId?.country_id ?? null,

                state: payload.state
                    ? Number(payload.state)
                    : stateAndCountryId?.state_id ?? null,

                city: payload.city ? Number(payload.city) : user.city_id ?? null,

                company_address: payload.company_address ?? "Not Provided",
                contact_person_name: payload.contact_person_name ?? "Not Provided",
                mobile_no: payload.mobile_no ?? userD.mobile ?? null,
                company_logo_path: payload.company_logo_path ?? "Not Provided",
                company_pancard_path: payload.company_pancard_path ?? "Not Provided",
                address_proof_path: payload.address_proof_path ?? "Not Provided",
                gst_proof_path: payload.gst_proof_path ?? "Not Provided",

                branch: payload.branch ?? null,
                pincode: payload.pincode ?? null,
                website_url: payload.website_url ?? null,
                email: payload.email ?? userD.email ?? null,
                landline_no: payload.landline_no ?? null,
                pancard_no: payload.pancard_no ?? null,

                createdAt: new Date(),
            },
            { transaction }
        );

        /** --------------------------
         * 2️⃣ Create GST Verification Entry
         * -------------------------- */
        const gstVerificationData = await GstVerification.create(
            {
                company_id: companyData.id, // FK link
                active: payload.active,
                einvoice_enabled: payload.einvoice_enabled,
                valid: true,
                gst_number: payload.gst_number ?? null,
                trade_name: payload.trade_name ?? null,
                state_code: payload.state_code ?? null,
                state: payload.state ?? null,
                pan: payload.pan ?? null,
                center_code: payload.center_code ?? null,
                constitution: payload.constitution ?? null,
                filings: payload.filings ?? null,
                gst_type: payload.gst_type ?? null,
                expiry_date: payload.gst_expiry_date
                    ? new Date(payload.gst_expiry_date)
                    : null,
                last_updated_on: payload.last_updated_on
                    ? new Date(payload.last_updated_on)
                    : null,
                nature_of_business: payload.nature_of_business ?? null,
                legal_name: payload.legal_name ?? null,
                primary_address: payload.primary_address ?? null,
                registered_on: payload.registered_on
                    ? new Date(payload.registered_on)
                    : null,
            },
            { transaction }
        );

        await transaction.commit();

        /** --------------------------
         * 3️⃣ Send Success Response
         * -------------------------- */
        return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL, {
            companyData,
            gstVerificationData,
        });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Error adding company details:", error);
        return errorResponse(
            res,
            MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
            error.message
        );
    }
};

export const updateCompanyDetail = async (req, res) => {
  const updateData = req.body;
  const { id: user_id } = req.user;
  const id = req.params.id;
  try {
    const existing = await CompanyDetail.findOne({
      where: {
        id,
        user_id,
        is_active: true,
      },
    });
    if (!existing) {
      return errorResponse(
        res,
        MESSAGES.COMPANY.COMPANY_NOT_FOUND,
        MESSAGES.COMPANY.COMPANY_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    await existing.update(updateData);
    return successResponse(res, MESSAGES.COMPANY.COMPANY_UPDATED);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.COMPANY.COMPANY_NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const softDeleteCompanyDetail = async (req, res) => {
  const { id: user_id } = req.user;
  const id = req.params.id;

  try {
    const companyDetail = await CompanyDetail.findOne({
      where: {
        id,
        user_id,
        isDeleted: false,
      },
    });

    if (!companyDetail) {
      return errorResponse(
        res,
        MESSAGES.COMPANY.COMPANY_NOT_FOUND,
        MESSAGES.COMPANY.COMPANY_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    await companyDetail.update({ isDeleted: true });

    return successResponse(res, MESSAGES.COMPANY.COMPANY_UPDATED);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.COMPANY.COMPANY_NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

export const getCompanyDetails = async (req, res) => {
  const { company_id } = req.body;
  const companyData = await CompanyDetail.findAll({
    where: { id:company_id },
  });
  try {
    return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL_FETCHED, {
      companyData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.COMPANY.COMPANY_NOT_FOUND,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const addCompanyDetailWhileRegister = async (
  req,
  res,
  isInternalCall = false
) => {
  const { city, company_name, company_size, email, gst, mobile, user_type_id } =
    req.body;

  try {
    const stateAndCountryId = await MasterCity.findOne({
      where: { id: Number(city) },
    });

    const user = await User.findOne({
      attributes: ["id", "signup_status"],
      where: {
        email,
        mobile,
        user_type_id,
      },
    });

    // ---------- USER NOT FOUND ----------
    if (!user) {
      if (isInternalCall) {
        return { success: false, message: MESSAGES.USER.USER_NOT_FOUND };
      }
      return errorResponse(
        res,
        MESSAGES.USER.USER_NOT_FOUND,
        MESSAGES.USER.USER_NOT_FOUND
      );
    }

    const user_id = user.id;

    const companyData = await CompanyDetail.create({
      company_name,
      company_size,
      service_tax_gst: gst,
      user_id,
      added_by: user_id,
      country: stateAndCountryId.country_id,
      state: stateAndCountryId.state_id,
      city_id: city,
      company_address: "Not Provided",
      contact_person_name: "Not Provided",
      mobile_no: "",
      company_logo_path: "Not Provided",
      company_pancard_path: "Not Provided",
    });

    // ---------- INTERNAL CALL RETURNS ONLY DATA ----------
    if (isInternalCall) {
      return { success: true, data: companyData };
    }

    // ---------- NORMAL FLOW RETURNS RESPONSE ----------
    return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL, {
      companyData,
    });
  } catch (error) {
    if (isInternalCall) {
      return { success: false, message: error.message };
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updateCompanyDataWhileRegstration = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  const {
    company_name,
    company_address,
    contact_person_name,
    email,
    landline_no,
    mobile_no,
    pancard_no,
    pincode,
    service_tax_gst,
    website_url,
    active: rawActive,
    center,
    center_code,
    constitution,
    einvoice_enabled: rawEnabled,
    expiry_date: rawExpiry,
    filings,
    gst_type,
    last_updated_on: lastOn,
    legal_name,
    nature_of_business,
    pan,
    primary_address,
    raw_response,
    registered_on: register,
    state,
    country,
    state_code,
    trade_name,
    valid: rawValid,
    user_email,
    user_mobile,
    cId,
    city,
    gst,
    branch,
    company_logo_path,
    company_pancard_path,
    address_proof_path,
    gst_proof_path,
    company_size,
  } = req.body;

  // console.log("req.body", req.body);

  const active = rawActive === "" || rawActive === undefined ? 1 : rawActive;
  const einvoice_enabled =
    rawEnabled === "" || rawEnabled === undefined ? 1 : rawEnabled;
  const valid = rawValid === "" || rawValid === undefined ? 1 : rawValid;
  const expiry_date =
    rawExpiry === "" || rawExpiry === undefined
      ? new Date().toISOString().split("T")[0]
      : rawExpiry;

  const registered_on =
    register === "" || register === undefined
      ? new Date().toISOString().split("T")[0]
      : register;
  const last_updated_on =
    lastOn === "" || lastOn === undefined
      ? new Date().toISOString().split("T")[0]
      : lastOn;
  const id = req?.params?.id ?? cId;

  try {
    const existing = await Company.findOne({
      where: {
        id,
        // is_active: true,
      },
    });

    if (!existing) {
      return errorResponse(
        res,
        MESSAGES.COMPANY.COMPANY_NOT_FOUND,
        MESSAGES.COMPANY.COMPANY_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    await existing.update({
      company_name,
      company_address,
      contact_person_name,
      email,
      landline_no,
      mobile_no,
      pancard_no,
      pincode,
      website_url,
      branch,
      state: Number(state),
      city: Number(city),
      country: Number(country),
      company_logo_path,
      company_pancard_path,
      address_proof_path,
      gst_proof_path,
      company_size,
    });

    const userData = await User.findOne({
      where: {
        email: user_email,
        mobile: user_mobile,
      },
    });

    if (userData) {
      if (userData.signup_status === 3) {
        await User.update(
          { company_id: id, signup_status: 4 },
          {
            where: {
              email: user_email,
              mobile: user_mobile,
            },
          }
        );
      } else {
        await User.update(
          { company_id: id },
          {
            where: {
              email: user_email,
              mobile: user_mobile,
            },
          }
        );
      }
    } else {
      console.log("User not found");
    }

    const gstVerificationData = await GstVerification.findOne({
      where: {
        gst_number: service_tax_gst ?? gst,
      },
    });
    if (!gstVerificationData) {
      await GstVerification.create({
        active,
        center,
        center_code,
        company_id: id,
        constitution,
        einvoice_enabled,
        expiry_date,
        filings,
        gst_number: service_tax_gst ?? gst,
        gst_type,
        last_updated_on,
        legal_name,
        nature_of_business,
        pan,
        primary_address,
        raw_response,
        registered_on,
        state,
        state_code,
        trade_name,
        valid,
      });
    } else {
      await gstVerificationData.update({
        active,
        center,
        center_code,
        constitution,
        einvoice_enabled,
        expiry_date,
        filings,
        gst_type,
        last_updated_on,
        legal_name,
        nature_of_business,
        pan,
        primary_address,
        raw_response,
        registered_on,
        state,
        state_code,
        trade_name,
        valid,
      });
    }
    if (isInternalCall) {
      return true;
    } else {
      return successResponse(res, MESSAGES.COMPANY.COMPANY_UPDATED, existing);
    }
  } catch (error) {
    if (isInternalCall) {
      throw new Error(error.message || MESSAGES.GENERAL.SOMETHING_WENT_WRONG);
    } else {
      return errorResponse(
        res,
        error.message,
        MESSAGES.COMPANY.SOMETHING_WENT_WRONG,
        STATUS_CODE.BAD_REQUEST
      );
    }
  }
};

export const companyDocuments = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.FILE_MANDATORY,
        STATUS_CODE.NOT_FOUND
      );
    }

    const { id } = req.params;
    const { folder, type } = req.query;
    const file = req.file;
    const filePath = path.join("uploads", folder || "documents", file.filename);

    const companyData = await Company.findByPk(id);
    if (!companyData) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        "Company not found",
        STATUS_CODE.NOT_FOUND
      );
    }

    if (folder) {
      switch (folder) {
        case "company_logo":
          companyData.company_logo_path = filePath;
          break;
        case "company_pan":
          companyData.company_pancard_path = filePath;
          break;
        default:
          return errorResponse(
            res,
            MESSAGES.GENERAL.BAD_REQUEST,
            "Invalid document type",
            STATUS_CODE.BAD_REQUEST
          );
      }
    }

    await companyData.save();

    return successResponse(res, MESSAGES.GENERAL.FILE_UPLOADED, {
      id,
      filename: file.filename,
      path: filePath,
    });
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const companyKycDetailUpdate = async (req, res) => {
  try {
    const {
      company_address,
      msme_number,
      service_tax_gst,
      pincode,
      pancard_no,
      id: company_id,
    } = req.body;

    const companyData = await Company.findByPk(company_id);
    if (!companyData) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        "Company not found",
        STATUS_CODE.NOT_FOUND
      );
    }
    await companyData.update({
      company_address,
      msme_number,
      service_tax_gst,
      pincode,
      pancard_no,
    });
    const gst = await GstVerification.findOne({
      where: { company_id },
    });

    if (gst) {
      await GstVerification.update(
        { gst_number: service_tax_gst },
        { where: { company_id } }
      );
    }

    return successResponse(res, "Company KYC details updated successfully", {});
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const upsertCompanyShare = async (req, res) => {
  try {
    const {
      id, // optional
      base_vehicle_id,
      share_type_id,
      share_value_type,
      share_value,
      created_by,
      modified_by,
      ip,
    } = req.body;

    // if id is passed → update, else create
    if (id) {
      const existing = await CompanyShare.findByPk(id);
      if (!existing) {
        return res.status(404).json({ message: "CompanyShare not found" });
      }

      await existing.update({
        base_vehicle_id,
        share_type_id,
        share_value_type,
        share_value,
        modified_by,
        ip,
        modified_date: new Date(),
      });

      return res.json({
        message: "CompanyShare updated successfully",
        data: existing,
      });
    } else {
      const newShare = await CompanyShare.create({
        base_vehicle_id,
        share_type_id,
        share_value_type,
        share_value,
        created_by,
        modified_by,
        ip,
        created_date: new Date(),
        modified_date: new Date(),
      });

      return res.json({
        message: "CompanyShare created successfully",
        data: newShare,
      });
    }
  } catch (error) {
    console.error("Error in upsertCompanyShare:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const bulkUpsertCompanyShare = async (req, res) => {
  try {
    const { base_vehicle_id, shares, ip } = req.body;
    let created_by = req.user.id;
    let modified_by = req.user.id;
    /**

     * shares = [
     *   { id: 1, share_type_id: 1//company , share_value_type: 1 //%, share_value: "10" },
     *   { id: null, share_type_id: 2 //partner, share_value_type: 2//INR , share_value: "500" },
     *   { id: 5, share_type_id: 3//driver , share_value_type: 1 //%, share_value: "40" },
     * ]
     */

    if (!base_vehicle_id || !Array.isArray(shares)) {
      return res
        .status(400)
        .json({ message: "base_vehicle_id and shares[] are required" });
    }

    const results = [];

    for (const share of shares) {
      if (share.id) {
        // Update existing
        const existing = await CompanyShare.findByPk(share.id);
        if (existing) {
          await existing.update({
            base_vehicle_id,
            share_type_id: share.share_type_id,
            share_value_type: share.share_value_type,
            share_value: share.share_value,
            modified_by,
            ip,
            modified_date: new Date(),
          });
          results.push({ ...existing.get(), action: "updated" });
        }
      } else {
        // Create new
        const newShare = await CompanyShare.create({
          base_vehicle_id,
          share_type_id: share.share_type_id,
          share_value_type: share.share_value_type,
          share_value: share.share_value,
          created_by,
          modified_by,
          ip,
          created_date: new Date(),
          modified_date: new Date(),
        });
        results.push({ ...newShare.get(), action: "created" });
      }
    }

    return res.json({
      message: "Bulk upsert completed successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error in bulkUpsertCompanyShare:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const getCompanyShares = async (req, res) => {
  try {
    const {
      id,
      base_vehicle_id,
      share_type_id,
      share_value_type,
      share_value,
      created_date,
      modified_date,
      created_by,
      modified_by,
      status,
      ip,
    } = req.query;

    // build dynamic filter
    const where = {};
    if (id) where.id = id;
    if (base_vehicle_id) where.base_vehicle_id = base_vehicle_id;
    if (share_type_id) where.share_type_id = share_type_id;
    if (share_value_type) where.share_value_type = share_value_type;
    if (share_value) where.share_value = share_value;
    if (created_date) where.created_date = created_date;
    if (modified_date) where.modified_date = modified_date;
    if (created_by) where.created_by = created_by;
    if (modified_by) where.modified_by = modified_by;
    if (status) where.status = status;
    if (ip) where.ip = ip;

    const shares = await CompanyShare.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return successResponse(res, shares, "Company shares fetched successfully");
  } catch (error) {
    console.error("Error fetching company shares:", error);
    return errorResponse(res, error.message || "Something went wrong");
  }
};

export const getCompanyDetailById = async (req, res) => {
  const user_id = req.params.id;
  const companyData = await companyDetailView.findAll({
    where: { user_id },
  });

  try {
    return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL_FETCHED, {
      companyData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.COMPANY.COMPANY_NOT_FOUND,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const getCompanies = async (req, res) => {
  try {
    const { id, user_id, company_name, brand_name, state, city, is_active } =
      req.query;

    const where = {};

    if (id) {
      where.id = id;
    }

    if (user_id) {
      where.user_id = user_id;
    }

    if (company_name) {
      where.company_name = { [Op.like]: `%${company_name}%` };
    }

    if (brand_name) {
      where.brand_name = { [Op.like]: `%${brand_name}%` };
    }

    if (state) {
      where.state = state;
    }

    if (city) {
      where.city = city;
    }

    if (is_active !== undefined) {
      where.is_active = is_active === "true"; // converts query param to boolean
    }

    const data = await Company.findAll({ where });

    const sql = `
       SELECT
         ud.doc_file_upload,
         ud.document_type_id,
         md.document_name
       FROM
         driver d
       LEFT JOIN
         user_upload_document ud
       ON
         d.user_id = ud.user_id
        LEFT JOIN master_document_type md ON md.doc_type_id = ud.document_type_id
       WHERE
         d.user_id = :user_id
         AND (ud.document_type_id IN (:doc_ids))
     `;

    const results = await sequelize.query(sql, {
      replacements: {
        user_id: req.user.id,
        doc_ids: [2, 21, 24, 32, 33, 34, 35],
      },
      type: sequelize.QueryTypes.SELECT,
    });

    const images = results.reduce((acc, curr) => {
      acc[curr.document_name] = curr.doc_file_upload;
      return acc;
    }, {});

    // console.log("Images", results);

    return res.status(200).json({
      success: true,
      data: { ...data, images },
    });
  } catch (error) {
    console.error("Error Fetching Companies", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getCompanyById = async (req, res) => {
  const { id } = req.params;
  const companyId = Number(id);
  
  try {
    // Validate that id is a valid positive number
    if (!companyId || companyId <= 0 || isNaN(companyId)) {
      return errorResponse(
        res,
        MESSAGES.COMPANY.COMPANY_NOT_FOUND,
        "Invalid company ID",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const companyData = await Company.findOne({
      where: { id: companyId },
    });

    console.log(companyData);

    if (!companyData) {
      return errorResponse(
        res,
        MESSAGES.COMPANY.COMPANY_NOT_FOUND,
        "Company not found",
        STATUS_CODE.NOT_FOUND
      );
    }

    const gstData = await GstVerification.findOne({
      where: { company_id: companyId },
    });

    return successResponse(res, MESSAGES.COMPANY.COMPANY_DETAIL_FETCHED, {
      companyData,
      gstData,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.COMPANY.COMPANY_NOT_FOUND,
      error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

export const toggleCompanyBranch = async (req, res) => {
  const { branch, id } = req.body;

  console.log(id, branch);

  try {
    // 1. Find the company to update
    const findCompany = await Company.findOne({
      where: {
        id: id,
        added_by: req.user.id,
      },
    });

    if (!findCompany) {
      return errorResponse(
        res,
        MESSAGES.COMPANY.COMPANY_NOT_FOUND,
        "Company not found",
        STATUS_CODE.NOT_FOUND
      );
    }

    // 2. If setting as HEAD OFFICE (branch = 1)
    if (branch == 1) {
      // Find and update any other HEAD OFFICE for this user
      await Company.update(
        { branch: "0" },
        {
          where: {
            branch: 1,
            added_by: req.user.id,
            id: { [Op.ne]: id }, // Exclude current company
          },
        }
      );
    }

    // 3. Update the target company
    await Company.update(
      { branch: String(branch) },
      {
        where: { id: id },
      }
    );

    // 4. Return success response
    return successResponse(
      res,
      MESSAGES.COMPANY.BRANCH_UPDATED,
      {
        companyId: id,
        newBranchStatus: branch,
      },
      STATUS_CODE.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.COMPANY.COMPANY_NOT_FOUND,
      error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

export const getUserCompanyDetails = async (req, res) => {
  const { id } = req.user;
  console.log(id);

  try {
    const sql = `
  SELECT 
    company.*, 
    master_city.name,
    master_city.state_name,
    master_city.country_name
  FROM company
  LEFT JOIN master_city ON master_city.id = company.city
  WHERE company.user_id = :id
`;

    const results = await sequelize.query(sql, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    console.log(results);

    return successResponse(
      res,
      MESSAGES.COMPANY.DATA_FETCHED,
      results,
      STATUS_CODE.OK
    );
  } catch (error) {
    console.error("Error fetching company details:", error);
    return errorResponse(
      res,
      "MESSAGES.COMPANY.COMPANY_NOT_FOUND",
      error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};
