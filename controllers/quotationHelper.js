import dateFormat from "dateformat"; // Ensure dateformat is installed
import Quotation from "../models/quotationModel.js";
import QuotationEstimation from "../models/quotationEstimationModel.js";
import Itinerary from "../models/itineraryModel.js";
import CompanySetup from "../models/companySetupModel.js";
import QuotationPickDropDetails from "../models/quotation_pickdrop_detailsModel.js";
import CouponStatistics from "../models/couponStaticsModel.js";
import SightSeeingBookingDetails from "./sightSeeingBookingDetailsModel.js";
import QuotationsTravellerDetails from "../models/quotationTravellerDetailModel.js";
import MasterLocation from "../models/masterlocationModel.js";
import QuotationMarkup from "../models/quotationMarkupModel.js";
import {
  generatePdf,
  getBookingRefNo,
  getCurrentDateTime,
} from "../utils/helpers.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { MESSAGES } from "../constants/const.js";
import { ca, da } from "date-fns/locale";
import EmailTemplate, {
  getEmailTemplate,
} from "../models/emailTemplateModel.js";
import { sendEmail, sendEmailWithAttachment } from "../utils/emailSender.js";
import ejs from "ejs";
import SmsTemplate from "../models/smsTemplateModel.js";
import sendSMS from "../utils/sendSMS.js";
import Company from "../models/companyModel.js";

export const addQuotationData = async (req) => {
  // Set default values using ES7 destructuring and nullish coalescing
  req.body.module_type ??= "";
  req.body.pickup_type = req.body.local_pickup ?? "";
  req.body.inclusions_data ??= "";
  req.body.exclusions_data ??= "";
  req.body.fare_rule_data ??= "";
  req.body.preferred_booking ??= "LEISURE";

  const bookingVariable = {
    company_id: req.body.company_id,
    itinerary_id: req.body.itinerary_id,
    agent_reference: req.body.agent_reference,
    status: req.body.booking_status,
    user_id: req?.user?.id || req.body.user_id,
    client_id: req.body.client_id,
    package_id: req.body.local_package_id,
    master_package_mode_id: req.body.master_package_mode_id,
    driver_id: req.body.driver_id,
    coupon_id: req.body.coupon_code_id,
    route_id: req.body.route_id,
    csr_id: req.body.csr_id,
    no_of_vehicles: req.body.no_of_vehicles,
    flight_number: req.body.flight_number,
    flight_time: req.body.flight_time,
    airport: req.body.airport,
    master_package_id: req.body.master_package_id,
    outstation_module_type: req.body.module_type,
    master_vehicle_type_id: req.body.vehicle_type_id,
    base_vehicle_id: req.body.base_vehicle_id,
    device_type: req.body.device_type,
    reschedule_date: req.body.reschedule_date,
    booking_release_date: req.body?.to || req.body.booking_auto_relasedate,
    sac_code_id: req.body.sac_code_id,
    sac_code: req.body.sac_code,
    sac_description: req.body.sac_description,
    remark: req.body.remark,
    booking_date: dateFormat(
      req.body?.from || new Date(),
      "yyyy-mm-dd HH:MM:ss"
    ),
    charge_type: req.body.charge_type,
    filter_data: req.body.filter_data,
    created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    placcard_name: req.body.placcard_name,
    pickup_point: req.body.pickup_point,
    pickup_type: req.body.pickup_type,
    inclusions_data: req.body.inclusions_data,
    exclusions_data: req.body.exclusions_data,
    fare_rule_data: req.body.fare_rule_data,
    created_by: req.body.created_by,
    // ignition_type_id: req.body.ignition_type_id,
    preferred_booking: req.body.preferred_booking,
  };

  // Remove undefined or empty string values
  Object.keys(bookingVariable).forEach((key) => {
    if (bookingVariable[key] === undefined || bookingVariable[key] === "") {
      delete bookingVariable[key];
    }
  });

  // Insert using Sequelize
  try {
    const responsedata = await Quotation.create(bookingVariable);
    return responsedata;
  } catch (err) {
    throw err;
  }
};

export const addQuotationEstimation = async (req) => {
  const user_markup =
    typeof req.body.user_markup !== "undefined" && req.body.user_markup !== ""
      ? req.body.user_markup
      : 0.0;
  const service_charge =
    typeof req.body.service_charge !== "undefined" &&
    req.body.service_charge !== ""
      ? req.body.service_charge
      : 0.0;
  const state_tax =
    typeof req.body.state_tax !== "undefined" && req.body.state_tax !== ""
      ? req.body.state_tax
      : 0.0;
  const toll_tax =
    typeof req.body.toll_tax !== "undefined" && req.body.toll_tax !== ""
      ? req.body.toll_tax
      : 0.0;

  const extra_price =
    req.body.master_package_type == 6
      ? 0
      : Number(req.body.extra_charge) +
        Number(service_charge) +
        Number(state_tax) +
        Number(toll_tax);

  const bookingEstVariable = {
    booking_id: req.body.insertId,
    estimated_time: req.body.estimated_time,
    estimated_distance: req.body.estimated_distance,
    estimateprice_before_discount: req.body.total_price,
    discount_price: req.body.total_discount,
    service_charge: req.body.service_charge,
    state_tax: req.body.state_tax,
    toll_tax: req.body.toll_tax,
    user_markup: user_markup,
    booking_amt_percentage: req.body.booking_amt_percentage,
    estimated_final_price: req.body.total_charge,
    estimated_price_before_markup: req.body.estimated_price_before_markup,
    approx_distance_charge: req.body.per_km_price,
    minimum_charge: req.body.base_fare,
    min_per_km_charge: req.body.min_per_km_charge,
    min_per_hr_charge: req.body.min_per_hr_charge,
    min_minimum_charge: req.body.min_minimum_charge,
    approx_after_km: req.body.min_distance,
    approx_after_hour: req.body.min_pkg_hr,
    approx_hour_charge: req.body.per_hr_charge,
    approx_waiting_charge: req.body.approx_waiting_charge,
    approx_waiting_minute: req.body.approx_waiting_minute,
    night_rate_type: req.body.night_rate_type,
    night_rate_value: req.body.night_rate_value,
    night_rate_begins: req.body.night_rate_begins,
    night_rate_ends: req.body.night_rate_ends,
    night_charge_price: req.body.night_charge,
    premiums_type: req.body.premiums_type,
    premiums_value: req.body.premiums_value,
    premiums_price: req.body.premiums_price,
    extras: req.body.extras,
    extra_price: extra_price,
    peak_time_value: req.body.peakFare,
    peak_time_price: req.body.peak_time_price,
    booking_cancellation_rule: req.body.cancellation_fare_rule,
    price_before_tax: req.body.price_before_tax,
    cgst_tax: req.body.cgst_tax,
    igst_tax: req.body.igst_tax,
    sgst_tax: req.body.sgst_tax,
    total_tax_price: req.body.tax_price,
    currency_id: req.body.currency_type,
    coupon_type: req.body.coupon_discount_type,
    service_charge_cgst_amount: req.body.service_charge_cgst_amount,
    service_charge_igst_amount: req.body.service_charge_igst_amount,
    service_charge_sgst_amount: req.body.service_charge_sgst_amount,
    service_charge_cgst: req.body.service_cgst_tax,
    service_charge_igst: req.body.service_igst_tax,
    service_charge_sgst: req.body.service_sgst_tax,
    service_tax_percentage: req.body.service_tax_percentage,
    service_tax_price: req.body.service_tax_price,
    service_charge_sac_code_id: req.body.sac_code_id_service,
    service_charge_sac_code: req.body.sac_code_service,
    service_charge_sac_code_description: req.body.sac_description_service,
    company_share_type: req.body.company_share_type,
    company_share_value: req.body.company_share_value,
    partner_share_type: req.body.partner_share_type,
    partner_share_value: req.body.partner_share_value,
    driver_share_type: req.body.driver_share_type,
    driver_share_value: req.body.driver_share_value,
    created_date: req.body.created_date,
  };

  Object.keys(bookingEstVariable).forEach((key) => {
    if (
      bookingEstVariable[key] === undefined ||
      bookingEstVariable[key] === ""
    ) {
      delete bookingEstVariable[key];
    }
  });

  try {
    await QuotationEstimation.create(bookingEstVariable);
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const addItineraryData = async (req) => {
  console.log("objectss");
  try {
    const itineraryVariable = {
      itinerary_id: req?.body?.itinerary_id,
      created_date: getCurrentDateTime(),
      created_by: req.body.user_id,
      ip: req.body.ip,
    };
    console.log({ itineraryVariable });
    // Object.keys(itineraryVariable).forEach((key) => {
    //   if (itineraryVariable[key] === undefined || itineraryVariable[key] === "") {
    //     delete itineraryVariable[key];
    //   }
    // });
    const responsedata = await Itinerary.create(itineraryVariable);
    console.log(responsedata, "hiiiii");
    return responsedata;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateItineraryReferenceNo = async (req) => {
  const {
    insertId: booking_id,
    insertItineraryId: itinerary_id,
    company_id,
  } = req.body;

  // Fetch company info
  const companyData = await await CompanySetup.findOne({
    where: { id: company_id },
  });
  if (!companyData) {
    return { message: "Company not found", status: false };
  }

  const booking_prefix = companyData.itinerary_prefix;
  var booking_ref_no = getBookingRefNo(itinerary_id, booking_prefix);

  // Update itinerary table
  const [itineraryUpdateCount] = await Itinerary.update(
    { itinerary_id: booking_ref_no },
    { where: { id: itinerary_id } }
  );

  if (itineraryUpdateCount == 1) {
    // Update quotation table
    // await Quotation.update(
    //   { itinerary_id: booking_ref_no },
    //   { where: { booking_id } }
    // );
    let data = await Quotation.findOne({ where: { booking_id } });
    data.itinerary_id = booking_ref_no; // your new value
    await data.save(); // save changes
    console.log({ booking_ref_no });
    return data;
  } else {
    return { message: "No record updated", status: false };
  }
};

// export const getBookingRefNo = async (bookingId) => {
//     if (!bookingId) {
//         return { status: 'failed', error: 'No bookingId provided' };
//     }
//     try {
//         const result = await Quotation.findAll({
//             attributes: [
//                 ['reference_number', 'ref'],
//                 ['itinerary_id', 'itinerary_id'],
//                 'user_id'
//             ],
//             where: { booking_id: bookingId }
//         });
//         if (result && result.length > 0) {
//             return { status: 'success', data: result[0] };
//         } else {
//             return { status: 'failed', error: 'No Record Found' };
//         }
//     } catch (err) {
//         return { status: 'failed', error: err.message };
//     }
// };

export const addQuotationPickdrop = async (req) => {
  const infant =
    typeof req.body.infant !== "undefined" && req.body.infant !== ""
      ? req.body.infant
      : 0;
  const sr_citizen =
    typeof req.body.sr_citizen !== "undefined" && req.body.sr_citizen !== ""
      ? req.body.sr_citizen
      : 0;
  const insertValues = {
    booking_id: req.body.insertId,
    adults: req.body.adults,
    childs: req.body.childs,
    luggages: req.body.luggages,
    smallluggage: req.body.smallluggage || 0,
    pickup_date: req.body.pickup_date
      ? dateFormat(req.body.pickup_date, "yyyy-mm-dd")
      : undefined,
    pickup_time: req.body.pickup_time,
    pickup_area: req.body.pickup_address,
    pickup_address: req.body.pickup_location,
    pickup_country: req.body.pickup_country,
    pickup_state: req.body.pickup_state,
    pickup_city: req.body.pickup_city,
    pickup_latitude: req.body.pickup_latitude,
    pickup_longitude: req.body.pickup_longitude,
    pickup_zone: req.body.pickup_zone,
    drop_date: req.body.drop_date || req.body.pickup_date,
    drop_time: req.body.drop_time || req.body.pickup_time,
    drop_area: req?.body?.drop_address,
    drop_address: req.body.drop_location || req.body.pickup_location,
    drop_country: req.body.drop_country,
    drop_state: req.body.drop_state,
    drop_city: req.body.drop_city,
    drop_latitude: req.body.drop_latitude,
    drop_longitude: req.body.drop_longitude,
    drop_zone: req.body.drop_zone,
    created_date: req.body.created_date,
  };

  Object.keys(insertValues).forEach((key) => {
    if (insertValues[key] === undefined || insertValues[key] === "") {
      delete insertValues[key];
    }
  });

  try {
    let result = await QuotationPickDropDetails.create(insertValues);
    console.log({ result });

    return result;
  } catch (err) {
    throw err;
  }
};

export const addUserCouponApply = async (req) => {
  const couponVal = {
    master_coupon_id: req.coupon_code_id,
    user_id: req.user_id,
    device_type: req.device_type,
    created_date: req.created_date,
  };

  // Remove undefined or empty string values
  Object.keys(couponVal).forEach((key) => {
    if (couponVal[key] === undefined || couponVal[key] === "") {
      delete couponVal[key];
    }
  });

  try {
    await CouponStatistics.create(couponVal);
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const addSightSeeingQuotationDetail = async (req) => {
  const sightseeingDetails = req.body.sightseeing_details;
  if (!Array.isArray(sightseeingDetails) || sightseeingDetails.length === 0) {
    return { status: "failed", message: "No sightseeing details provided" };
  }

  const records = sightseeingDetails.map((item) => {
    const record = {
      booking_id: req.body.insertId,
      sightseeing_id: item.s_id,
      created_date: req.body.created_date,
      ip: req.body.ip,
    };
    Object.keys(record).forEach((key) => {
      if (record[key] === undefined || record[key] === "") {
        delete record[key];
      }
    });
    return record;
  });

  try {
    await SightSeeingBookingDetails.bulkCreate(records);
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const addMultiQuotationTravellerDetail = async (req) => {
  const travellerDetails = req.travellerDetails;
  if (!Array.isArray(travellerDetails) || travellerDetails.length === 0) {
    return { status: "failed", message: "No traveller details provided" };
  }

  const records = travellerDetails.map((traveller) => {
    const record = {
      booking_id: req.insertId,
      first_name: traveller.first_name,
      last_name: traveller.last_name,
      gender: traveller.gender,
      date_of_birth: traveller.date_of_birth,
      age: traveller.age,
      email: traveller.email,
      mobile: traveller.mobile,
      alt_mobile_number: traveller.alt_mobile_number,
      gst_no: traveller.gst_no,
      gst_company_name: traveller.gst_company_name,
      nationality: traveller.nationality,
      agent_reference: req.agent_reference,
      placcard_name: req.placcard_name,
      id_proof: traveller.id_proof,
      created_by: traveller.created_by,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      ip: traveller.ip,
    };
    // Remove undefined or empty string values
    Object.keys(record).forEach((key) => {
      if (record[key] === undefined || record[key] === "") {
        delete record[key];
      }
    });
    return record;
  });

  try {
    await QuotationsTravellerDetails.bulkCreate(records);
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const addSightSeeingQuotationTravellerDetail = async (req) => {
  const travellerDetails = req.body.sightseeing_traveller_details;
  if (
    !travellerDetails ||
    !travellerDetails.name ||
    !Array.isArray(travellerDetails.name) ||
    travellerDetails.name.length === 0
  ) {
    return {
      status: "failed",
      message: "No sightseeing traveller details provided",
    };
  }

  const records = travellerDetails.name.map((name, idx) => {
    const record = {
      booking_id: req.insertId,
      name: name,
      age: travellerDetails.age ? travellerDetails.age[idx] : undefined,
      dob: travellerDetails.dob ? travellerDetails.dob[idx] : undefined,
      created_date: req.created_date,
      ip: req.ip,
    };
    Object.keys(record).forEach((key) => {
      if (record[key] === undefined || record[key] === "") {
        delete record[key];
      }
    });
    return record;
  });

  try {
    await QuotationsTravellerDetails.bulkCreate(records);
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const addPickupLocation = async (req) => {
  const pickAreaVal = {
    country_id: req.pickup_country,
    state_id: req.pickup_state,
    city_id: req.city_id,
    latitude: req.pickup_latitude,
    longitude: req.pickup_longitude,
    area: req.pickup_area,
    zone: req.pickup_zone,
  };

  Object.keys(pickAreaVal).forEach((key) => {
    if (pickAreaVal[key] === undefined || pickAreaVal[key] === "") {
      delete pickAreaVal[key];
    }
  });

  try {
    // Use findOrCreate to mimic INSERT IGNORE
    await MasterLocation.findOrCreate({
      where: pickAreaVal,
      defaults: pickAreaVal,
    });
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const addDropLocation = async (req) => {
  const dropAreaVal = {
    country_id: req.drop_country,
    state_id: req.drop_state,
    city_id: req.drop_city,
    latitude: req.drop_latitude,
    longitude: req.drop_longitude,
    area: req.drop_area,
    zone: req.drop_zone,
  };

  Object.keys(dropAreaVal).forEach((key) => {
    if (dropAreaVal[key] === undefined || dropAreaVal[key] === "") {
      delete dropAreaVal[key];
    }
  });

  try {
    // Use findOrCreate to mimic INSERT IGNORE
    await MasterLocation.findOrCreate({
      where: dropAreaVal,
      defaults: dropAreaVal,
    });
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const addPickupAddress = async (req) => {
  const pickAddrVal = {
    country_id: req.pickup_country,
    state_id: req.pickup_state,
    city_id: req.city_id,
    latitude: req.pickup_latitude,
    longitude: req.pickup_longitude,
    address: req.pickup_address,
    zone: req.pickup_zone,
  };

  Object.keys(pickAddrVal).forEach((key) => {
    if (pickAddrVal[key] === undefined || pickAddrVal[key] === "") {
      delete pickAddrVal[key];
    }
  });

  try {
    // Use findOrCreate to mimic INSERT IGNORE
    await MasterLocation.findOrCreate({
      where: pickAddrVal,
      defaults: pickAddrVal,
    });
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const addDropAddress = async (req) => {
  const dropAddrVal = {
    country_id: req.drop_country,
    state_id: req.drop_state,
    city_id: req.drop_city,
    latitude: req.drop_latitude,
    longitude: req.drop_longitude,
    address: req.drop_address,
    zone: req.drop_zone,
  };

  Object.keys(dropAddrVal).forEach((key) => {
    if (dropAddrVal[key] === undefined || dropAddrVal[key] === "") {
      delete dropAddrVal[key];
    }
  });

  try {
    // Use findOrCreate to mimic INSERT IGNORE
    await MasterLocation.findOrCreate({
      where: dropAddrVal,
      defaults: dropAddrVal,
    });
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const addQuotationMarkup = async (req, QuotationMarkupModel) => {
  let valArr;
  try {
    valArr = JSON.parse(req.user_markup);
  } catch (e) {
    return { status: "failed", message: "Invalid user_markup JSON" };
  }
  if (!Array.isArray(valArr) || valArr.length === 0) {
    return { status: "failed", message: "No markup data provided" };
  }

  const records = valArr.map((insertData) => {
    const record = {
      booking_id: req.insertId,
      user_id: insertData.created_by,
      markup_amt_base: insertData.markup_amt_base,
      mark_amt_type: insertData.mark_amt_type,
      basic_amt: insertData.basic_amt,
      extra_km_markup: insertData.extra_km_markup,
      extra_hr_markup: insertData.extra_hr_markup,
      markup_amount: insertData.markup_amount,
      created_date: req.created_date,
    };
    Object.keys(record).forEach((key) => {
      if (record[key] === undefined || record[key] === "") {
        delete record[key];
      }
    });
    return record;
  });

  try {
    await QuotationMarkup.bulkCreate(records);
    return { status: "success" };
  } catch (err) {
    throw err;
  }
};

export const updateQuotationReferenceNo = async (
  req,
  commonObj,
  BookingModel
) => {
  const booking_id = req.insertId;
  const company_id = req.company_id;
  const booking_status = req.booking_status;
  console.log({ booking_id, company_id, booking_status });
  // Fetch company info
  const companyDataArr = await CompanySetup.findAll({
    where: { id: company_id },
  });
  if (!companyDataArr || !companyDataArr[0]) {
    return { message: "Company not found", status: false };
  }
  const companyData = companyDataArr[0];

  let booking_prefix;
  if (booking_status == 22) {
    booking_prefix = companyData.hold_prefix;
  } else if (booking_status == 27) {
    booking_prefix = companyData.quote_prefix;
  } else {
    booking_prefix = companyData.booking_prefix;
  }

  // Generate booking_ref_no using provided commonObj
  const booking_ref_no = getBookingRefNo(booking_id, booking_prefix);

  // Update quotation table
  const [affectedRows] = await Quotation.update(
    { reference_number: booking_ref_no },
    { where: { booking_id } }
  );

  if (affectedRows === 1) {
    // Optionally send email if BookingModel and bookingQuotationEmail are provided
    if (
      BookingModel &&
      typeof BookingModel.bookingQuotationEmail === "function"
    ) {
      try {
        await BookingModel.bookingQuotationEmail({ booking_id });
      } catch (e) {
        // Log or handle email error if needed
      }
    }
    return { message: "updated successfully", status: true };
  } else {
    return { message: "No record updated", status: false };
  }
};

export const bookingQuotationEmail = async (req) => {
  const { booking_id } = req;
  const params = { id: booking_id };

  // Get booking data
  const result = await quotationListSearch(params, null, true);
  if (!result || result.length === 0) {
    return { status: "failed", message: "Booking not found" };
  }
  const bookingData = result[0].dataValues;

  // Get user and client info
  const userIds = [bookingData.user_id, bookingData.client_id].filter(Boolean);
  const users = await Quotation.sequelize.query(
    `SELECT user.id as user_id,user.user_type_id,user.first_name,user.last_name,user.username,user.email,user.mobile,user.is_active,company_setup.com_name,company_setup.site_url,company_setup.email as comp_email,company_setup.mobile as comp_mobile,company_setup.phone as comp_phone,company_setup.global_email,company_setup.gst_no AS companysetup_gst_no,company_setup.pan_no AS companysetup_pan_no,company_setup.first_name AS company_first_name,company_setup.last_name AS company_last_name,company_setup.comp_address AS company_address,company_setup.bank_name AS company_bank_name,company_setup.ac_holder_name AS company_ac_holder_name,company_setup.branch AS company_account_branch,company_setup.ifsc_code AS company_ifsc_code,company_setup.account_no AS company_account_no,com.company_name as user_company_name,com.contact_person_name,com.website_url,com.company_address as user_company_address,com.pincode as user_company_pincode,com.email as user_company_email,com.alt_email as user_company_alt_email,com.country_prefix_mob as user_company_prefix_mobile,com.mobile_no as user_company_mobile_no,com.country_prefix_land as user_company_landline_prefix,com.landline_no as user_company_landline_no, com.service_tax_gst AS user_gst_no, com.pancard_no as company_pancard_no,udoc.doc_file_upload as company_logo FROM user left join company_setup ON user.company_id = company_setup.id left join user_upload_document as udoc ON user.id = udoc.user_id AND udoc.document_type_id = 22 AND udoc.doc_default_status=1 LEFT JOIN company as com ON user.id = com.user_id  WHERE user.id IN(:userIds) order by udoc.upload_doc_id DESC`,
    { replacements: { userIds }, type: Quotation.sequelize.QueryTypes.SELECT }
  );

  if (!users || users.length === 0) {
    return { status: "failed", message: "User(s) not found" };
  }

  // Prepare email params (simplified, adjust as needed)
  const user = users[0];
  const company_logo =
    user.user_type_id == 7 && user.company_logo
      ? (process.env.B2B_UPLOAD_URL || "") +
        user.user_id +
        "/" +
        user.company_logo
      : (process.env.B2B_URL || "") + "images/logo-emailer-bookingcabs.png";

  const bookingHoldParams1 = {
    first_name: bookingData.first_name,
    last_name: bookingData.last_name,
    email: bookingData.email,
    mobile_no: bookingData.user_mobile,
    alt_mobile_no: bookingData.user_alt_mobile,
    agent_reference: bookingData.agent_reference,
    gst_no: bookingData.gst_registration_number,
    nationality: bookingData.user_nationality,
    booking_ref_no: bookingData.reference_number,
    estimated_price: bookingData.estimated_final_price,
    booking_date: dateFormat(bookingData.booking_date, "yyyy-mm-dd"),
    booking_time: dateFormat(bookingData.booking_date, "HH:MM"),
    booking_release_date: bookingData.booking_release_date,
    pickup_address: bookingData.departure,
    drop_address: bookingData.drop_address,
    pickup_date: dateFormat(bookingData.ordertime, "yyyy-mm-dd"),
    pickup_time: dateFormat(bookingData.ordertime, "HH:MM:ss"),
    local_pkg_name: bookingData.local_pkg_name,
    distance: bookingData.estimated_distance,
    per_km_price: bookingData.approx_after_km,
    per_hr_charge: bookingData.approx_after_hour,
    vehicle_type: bookingData.vehicle,
    adults: bookingData.adults,
    childs: bookingData.childs,
    luggage: bookingData.luggages,
    base_fare: bookingData.minimum_charge,
    night_rate_begins: bookingData.night_rate_begins,
    night_rate_ends: bookingData.night_rate_ends,
    night_charge: bookingData.night_charge_price,
    premiums_price: bookingData.premiums_price,
    extra_price: bookingData.extra_price,
    peak_time_price: bookingData.peak_time_price,
    discount: bookingData.discount_price,
    other_charges:
      Number(bookingData.night_charge_price || 0) +
      Number(bookingData.peak_time_price || 0) +
      Number(bookingData.premiums_price || 0) +
      Number(bookingData.extra_price || 0),
    running_amount:
      Number(bookingData.minimum_charge || 0) +
      Number(bookingData.night_charge_price || 0) +
      Number(bookingData.peak_time_price || 0) +
      Number(bookingData.premiums_price || 0) +
      Number(bookingData.extra_price || 0),
    cgst_tax: bookingData.cgst_tax,
    cgst_value: Math.floor(
      (Number(bookingData.estimated_final_price || 0) *
        Number(bookingData.cgst_tax || 0)) /
        100
    ),
    sgst_tax: bookingData.sgst_tax,
    sgst_value: Math.floor(
      (Number(bookingData.estimated_final_price || 0) *
        Number(bookingData.sgst_tax || 0)) /
        100
    ),
    igst_tax: bookingData.igst_tax,
    igst_value: Math.floor(
      (Number(bookingData.estimated_final_price || 0) *
        Number(bookingData.igst_tax || 0)) /
        100
    ),
    total_tax_price: bookingData.total_tax_price,
    amount_in_world: "", // Implement NumInWords if needed
    remark: bookingData.remark,
    company_logo: company_logo,
    company_gst_no: user.companysetup_gst_no,
    user_bank_name: bookingData.user_bank_name,
    user_ac_no: bookingData.user_ac_no,
    user_ifsc_code: bookingData.user_ifsc_code,
    user_ac_holder: bookingData.user_beneficiary_name,
    user_bank_branch: bookingData.user_bank_branch,
    user_com_name: user.user_company_name || user.com_name,
    user_com_address: user.user_company_address || user.company_address,
    user_comp_phone: user.user_company_landline_no || user.comp_phone,
    user_comp_mobile: user.user_company_mobile_no || user.comp_mobile,
    user_contact_person_name:
      user.contact_person_name ||
      user.company_first_name + " " + user.company_last_name,
    user_pan_no: user.company_pancard_no || user.companysetup_pan_no,
    user_email: user.user_company_email || user.email,
    user_website_url: user.website_url || user.site_url,
    user_gst_no: user.user_gst_no,
    booking_status: bookingData.status,
    itinerary_no: bookingData.itinerary_id,
    cancellation_rule: bookingData.booking_cancellation_rule
      ? JSON.parse(bookingData.booking_cancellation_rule)
      : [],
    invoice_no: "",
    company_bank_name: user.company_bank_name,
    company_ac_holder_name: user.company_ac_holder_name,
    company_account_branch: user.company_account_branch,
    company_ifsc_code: user.company_ifsc_code,
    company_account_no: user.company_account_no,
    flight_number: bookingData.flight_number,
    flight_time: bookingData.flight_time,
  };

  // Send SMS (if needed)
  const [smsApi] = await Quotation.sequelize.query(
    "SELECT * FROM sms_api WHERE active = 1 LIMIT 1",
    { type: Quotation.sequelize.QueryTypes.SELECT }
  );
  if (smsApi) {
    const [smsTemp] = await Quotation.sequelize.query(
      "SELECT * FROM sms_template WHERE msg_sku='quotation' AND is_active = 1 LIMIT 1",
      { type: Quotation.sequelize.QueryTypes.SELECT }
    );
    if (smsTemp) {
      let smsMessage = smsTemp.message;
      const bookingdate = dateFormat(bookingData.booking_date, "dd-mm-yyyy");
      const pickupdatetime = dateFormat(
        bookingData.ordertime,
        "dd-mm-yyyy HH:MM:ss"
      );
      const cutoff_date = dateFormat(
        bookingData.booking_release_date,
        "dd-mm-yyyy HH:MM:ss"
      );
      smsMessage = smsMessage.replace(
        "{#username#}",
        bookingData.client_name || ""
      );
      smsMessage = smsMessage.replace(
        "{#booking_type#}",
        bookingData.booking_type || ""
      );
      smsMessage = smsMessage.replace(
        "{#booking_ref#}",
        bookingData.reference_number || ""
      );
      smsMessage = smsMessage.replace("{#cutoff_date#}", cutoff_date);
      smsMessage = smsMessage.replace("{#web_link#}", "bookingcabs.com");
      smsMessage = smsMessage.replace("{#mobile#}", user.comp_mobile || "");

      // Implement your SMS sending logic here
      // Example: await sendSms({ mobile: bookingData.user_mobile, message: smsMessage });
    }
  }

  // Implement your email sending logic here if needed

  return { status: "success", data: bookingHoldParams1 };
};

export const quotationListSearch = async (req, res, isInternalCall = false) => {
  const body = Object.fromEntries(
    Object.entries(req.body || {}).filter(
      ([_, v]) => v !== undefined && v !== ""
    )
  );
  let {
    id,
    pickup_date,
    pickup_time,
    unassigned_booking,
    driver_id,
    user_id,
    from_date,
    to_date,
    booking_type,
    booking_id,
    agent_reference,
    user_mobile,
    driver_name,
    client_first_name,
    client_last_name,
    client_id,
    client_mobile_no,
    client_email,
    driver_first_name,
    driver_last_name,
    referral_key,
    driver_mobile_no,
    driver_email,
    vehicle_type,
    vehicle_no,
    state_name,
    city_name,
    pickup,
    pickup_address,
    drop_address,
    booking_status,
    payment_type,
    status,
    multi_status,
    multi_booking_type,
    multi_vehicle_type,
    multi_city_name,
    booking_pickup_date,
    partner_name,
    pickupaddress,
    drop_area,
    from_time,
    to_time,
    isInternal = true,
    page = 1, // Default to page 1
    pageSize = 10,
  } = body;
  console.log(req.body, "llllllllllll");
  const offset = (page - 1) * pageSize;

  console.log({ isInternalCall });
  let sql = `
    select 
        bk.booking_id AS id,
        bk.itinerary_id AS itinerary_id,
        bk.company_id AS company_id,
        compset.com_name AS domain_name,
        compset.currency_id,
        mc.name AS currency,
        bk.driver_id AS driver_id,
        bk.reference_number AS ref,
        bk.agent_reference,
        bk.remark,
        bk.status_c,
        bk.status as status_id,
        bk.user_id,
        us.first_name,
        us.last_name,
        concat(us.first_name,' ',us.last_name) AS user_name,
        us.email,
        us.mobile as user_mobile,
        master_country.name as user_nationality,
        user_info.alternate_mobile AS user_alt_mobile,
        user_info.gst_registration_number,
        cab_status.status as driver_status,
        bk.client_id,
        concat(us2.first_name,' ',us2.last_name) AS clientname,
        us2.mobile as client_mobile,
        us2.email as client_email,
        us3.alternate_mobile as client_alt_mobile,
        bk.driver_id,
        concat(driver.first_name,' ',driver.last_name) AS driver_name,
        driver.mobile,
        driver.duty_status,
        dmvt.vehicle_type AS driver_vehicle_type,
        dmvt.category_id AS vehicle_category_id,
        bank_details.name as bank_name,
        bank_details.ac_no as account_no,
        bank_details.ifsc_code,
        bank_details.ac_holder_name,
        bank_details.branch,
        user_bank_detail.name as user_bank_name,
        user_bank_detail.ac_no as user_ac_no,
        user_bank_detail.ifsc_code as user_ifsc_code,
        user_bank_detail.ac_holder_name as user_beneficiary_name,
        bank_details.branch as user_bank_branch,
        ucompany.company_name,
        ucompany.mobile_no,
        ucompany.landline_no,
        compset.gst_no,
        user_company.service_tax_gst,
        vm.vehicle_no,
        vm.model as year,
        vm.color,
        bk.reference_number,
        vmodel.name as vehicle_name,
        mpm.package_mode AS package_mode,
        bk.master_package_id as booking_type_id,
        mp.name AS booking_type,
        mp.image as booking_type_image,
        mp.icon as booking_type_icon,
        payty.pay_type_mode AS charge_type,
        mvt.vehicle_type AS vehicle,
        bk.no_of_vehicles AS no_of_vehicles,
        mcoup.name AS coupon_name,
        DATE(bk.booking_date) AS booking_date,
        TIME(bk.booking_date) AS booking_time,
        bk.device_type,
        DATE_FORMAT(bk.booking_release_date,'%Y-%m-%d %H:%i:%s') as booking_release_date,
        cs.status AS status,
        bkest.booking_estimation_id AS booking_estimation_id,
        bkest.booking_id AS booking_id,
        bkest.estimated_time AS estimated_time,
        bkest.estimated_distance AS estimated_distance,
        bkest.estimateprice_before_discount AS estimateprice_before_discount,
        bkest.discount_price AS discount_price,
        bkest.estimated_final_price AS estimated_final_price,
        bkest.booking_amt_percentage AS booking_amt_percentage,
        bkest.estimated_price_before_markup AS estimated_price_before_markup,
        bkest.estimateprice_before_discount AS estimateprice_before_discount,
        bkest.total_tax_price AS total_tax_price,
        bkest.discount_price AS discount_price,
        bkest.approx_distance_charge AS approx_distance_charge,
        bkest.approx_after_km AS approx_after_km,
        bkest.approx_after_hour,
        bkest.approx_hour_charge,
        bkest.approx_waiting_charge AS approx_waiting_charge,
        bkest.approx_waiting_minute AS approx_waiting_minute,
        bkest.minimum_charge,
        bkest.night_rate_type AS night_rate_type,
        bkest.night_rate_value AS night_rate_value,
        bkest.night_rate_begins AS night_rate_begins,
        bkest.night_rate_ends AS night_rate_ends,
        bkest.night_charge_price AS night_charge_price,
        bkest.premiums_type,
        bkest.premiums_value,
        bkest.premiums_price,
        bkest.extras AS extras,
        bkest.extra_price AS extra_price,
        bkest.peak_time_value AS peak_time_value,
        bkest.peak_time_price AS peak_time_price,
        bkest.cgst_tax AS cgst_tax,
        bkest.igst_tax AS igst_tax,
        bkest.sgst_tax AS sgst_tax,
        bkest.total_tax_price AS total_tax_price,
        bkest.rounding AS rounding,
        bkest.level AS level,
        bkest.direction AS direction,
        bkest.created_date AS created_date,
        bkest.updated_date AS updated_date,
        bkest.estimated_final_price AS amount,
        bkest.booking_cancellation_rule,
        bkest.price_before_tax,
        concat(bpd.pickup_date,' ',bpd.pickup_time) AS ordertime,
        bpd.pickup_area AS pickup_area,
        bpd.pickup_address AS departure,
        bpd.drop_area,
        bpd.drop_address,
        bpd.adults AS adults,
        bpd.childs AS childs,
        bpd.luggages AS luggages,
        bpd.pickup_country AS pickup_country,
        bpd.pickup_state AS pickup_state,
        bpd.pickup_city AS pickup_city,
        bpd.pickup_latitude AS pickup_latitude,
        bpd.pickup_longitude AS pickup_longitude,
        bpd.pickup_zone AS pickup_zone,
        bpd.drop_date AS drop_date,
        bpd.drop_time AS drop_time,
        bpd.drop_country AS drop_country,
        bpd.drop_state AS drop_state,
        bpd.drop_city AS drop_city,
        bpd.drop_latitude AS drop_latitude,
        bpd.drop_longitude AS drop_longitude,
        bpd.drop_zone AS drop_zone,
        ut.created_date AS created_at,
        ut.payment_status AS is_paid,
        ut.time AS paid_at,
        ut.booking_transaction_no,
        ut.payment_type_id,
        ut.amount AS booking_amt_paid,
        (bkest.estimated_final_price - ut.amount) as booking_amt_balance,
        pt.pay_type_mode AS payment_type,
        mcity.name AS city_name,
        booking_charges.driver_share_amt,
        booking_charges.comp_share_amt,
        booking_charges.partner_share_amt,
        local_package.name as local_pkg_name,
        ptr.mmp_txn,
        ptr.mer_txn,
        ptr.amt,
        ptr.prod,
        ptr.date,
        ptr.bank_txn,
        ptr.f_code,
        ptr.bank_name as bankName,
        ptr.merchant_id,
        ptr.udf9,
        ptr.discriminator,
        ptr.surcharge,
        ptr.CardNumber,
        ptr.signature
    from quotation bk
        join user us on bk.user_id = us.id
        join user us2 on bk.client_id = us2.id
        left join user driver on bk.driver_id = driver.id
        LEFT JOIN user_vehicle_mapping vehm ON (bk.driver_id = vehm.user_id AND vehm.user_id!=0)
        left join vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
        left join master_vehicle_model vmodel ON vm.id= vmodel.id
        left join master_vehicle_type dmvt ON vmodel.id = dmvt.id
        join master_package_mode mpm on bk.master_package_mode_id = mpm.id
        join master_package mp on bk.master_package_id = mp.id
        join master_vehicle_type mvt on bk.master_vehicle_type_id = mvt.id
        left join master_coupon mcoup on bk.coupon_id = mcoup.id
        join cab_status cs on (bk.status = cs.status_id and cs.type = 'cab')
        join payment_type payty on bk.charge_type = payty.payment_type_id
        left join quotation_estimation bkest on bk.booking_id = bkest.booking_id
        left join quotation_pickdrop_details bpd on bk.booking_id = bpd.booking_id
        left join payment_transaction_response ptr on bk.reference_number = ptr.mer_txn
        LEFT JOIN bank_details ON driver.id = bank_details.user_id
        LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
        LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type='driverS'
        left join company as ucompany ON bk.company_id = ucompany.user_id
        LEFT JOIN company AS user_company ON us.id = user_company.user_id
        left join company_setup as compset ON bk.company_id= compset.id
        left join user_info as us3 ON bk.client_id= us3.user_id
        left join user_info ON bk.user_id= user_info.user_id
        left join user_transaction as ut ON bk.booking_id= ut.booking_id
        left join master_currency as mc ON compset.currency_id= mc.id
        left join payment_type as pt ON ut.payment_type_id= pt.payment_type_id
        left join master_city as mcity ON bpd.pickup_city= mcity.id
        LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
        LEFT JOIN local_package ON bk.package_id =local_package.id
        LEFT JOIN master_country ON us.nationality = master_country.id
    where 1=1
    `;

  // Dynamic filters
  if (id !== undefined) sql += ` AND bk.booking_id = :id `;
  if (booking_id !== undefined)
    sql += ` AND bk.reference_number = :booking_id `;
  if (agent_reference !== undefined)
    sql += ` AND bk.agent_reference = :agent_reference `;
  if (booking_type !== undefined && booking_type !== "")
    sql += ` AND bk.master_package_id = :booking_type `;
  if (driver_name !== undefined)
    sql += ` AND driver.first_name = :driver_name `;
  if (from_date !== undefined && to_date !== undefined)
    sql += ` AND date(bpd.pickup_date) >= :from_date AND date(bpd.pickup_date) <= :to_date `;
  if (client_first_name !== undefined)
    sql += ` AND us2.first_name LIKE :client_first_name `;
  if (client_last_name !== undefined)
    sql += ` AND us2.last_name LIKE :client_last_name `;
  if (client_id !== undefined) sql += ` AND us2.id = :client_id `;
  if (client_email !== undefined) sql += ` AND us2.email = :client_email `;
  if (client_mobile_no !== undefined)
    sql += ` AND us2.mobile = :client_mobile_no `;
  if (driver_first_name !== undefined)
    sql += ` AND driver.first_name = :driver_first_name `;
  if (driver_last_name !== undefined)
    sql += ` AND driver.last_name = :driver_last_name `;
  if (driver_id !== undefined) sql += ` AND bk.driver_id = :driver_id `;
  if (referral_key !== undefined)
    sql += ` AND driver.referral_key = :referral_key `;
  if (driver_mobile_no !== undefined)
    sql += ` AND driver.mobile = :driver_mobile_no `;
  if (driver_email !== undefined) sql += ` AND driver.email = :driver_email `;
  if (vehicle_type !== undefined)
    sql += ` AND bk.master_vehicle_type_id = :vehicle_type `;
  if (state_name !== undefined) sql += ` AND bpd.pickup_state = :state_name `;
  if (city_name !== undefined) sql += ` AND bpd.pickup_city = :city_name `;
  if (pickup_address !== undefined)
    sql += ` AND bpd.pickup_address = :pickup_address `;
  if (drop_address !== undefined)
    sql += ` AND bpd.drop_address = :drop_address `;
  if (booking_status !== undefined) sql += ` AND bk.status = :booking_status `;
  if (pickup_date !== undefined) sql += ` AND bpd.pickup_date = :pickup_date `;
  if (payment_type !== undefined) sql += ` AND bk.charge_type = :payment_type `;
  if (pickup_time !== undefined)
    sql += ` AND hour(bpd.pickup_time) = :pickup_time `;
  if (unassigned_booking !== undefined && unassigned_booking == 1)
    sql += ` AND bk.driver_id = 0 `;
  if (user_id !== undefined) sql += ` AND bk.user_id = :user_id `;
  if (user_mobile !== undefined) sql += ` AND us.mobile = :user_mobile `;
  if (vehicle_no !== undefined) sql += ` AND vm.vehicle_no = :vehicle_no `;
  if (status !== undefined) sql += ` AND bk.status = :status `;
  if (multi_status !== undefined && multi_status !== "") {
    if (multi_status == "222") {
      sql += ` AND bpd.pickup_date = :booking_pickup_date `;
    } else if (multi_status == "111") {
      sql += ` AND bpd.pickup_date > :booking_pickup_date `;
    } else {
      sql += ` AND bk.status IN(${multi_status}) `;
    }
  }
  if (multi_booking_type !== undefined && multi_booking_type !== "")
    sql += ` AND bk.master_package_id IN(${multi_booking_type}) `;
  if (multi_vehicle_type !== undefined && multi_vehicle_type !== "")
    sql += ` AND bk.master_vehicle_type_id IN(${multi_vehicle_type}) `;
  if (multi_city_name !== undefined && multi_city_name !== "")
    sql += ` AND bpd.pickup_city IN(${multi_city_name}) `;
  if (partner_name !== undefined && partner_name !== "")
    sql += ` AND compset.com_name = :partner_name `;
  if (pickupaddress !== undefined)
    sql += ` AND bpd.pickup_address LIKE :pickupaddress `;
  if (drop_area !== undefined) sql += ` AND bpd.drop_area LIKE :drop_area `;
  if (from_time !== undefined && to_time !== undefined)
    sql += ` AND bpd.pickup_time BETWEEN :from_time AND :to_time `;

  sql += ` 
      AND bk.quotation_status = 1 
      GROUP BY (ut.booking_id) 
      ORDER BY bk.booking_id DESC
      LIMIT :limit OFFSET :offset
    `;
  let countSql = `
      SELECT COUNT(DISTINCT bk.booking_id) as total
      FROM quotation bk
join user us on bk.user_id = us.id
        join user us2 on bk.client_id = us2.id
        left join user driver on bk.driver_id = driver.id
        LEFT JOIN user_vehicle_mapping vehm ON (bk.driver_id = vehm.user_id AND vehm.user_id!=0)
        left join vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
        left join master_vehicle_model vmodel ON vm.id= vmodel.id
        left join master_vehicle_type dmvt ON vmodel.id = dmvt.id
        join master_package_mode mpm on bk.master_package_mode_id = mpm.id
        join master_package mp on bk.master_package_id = mp.id
        join master_vehicle_type mvt on bk.master_vehicle_type_id = mvt.id
        left join master_coupon mcoup on bk.coupon_id = mcoup.id
        join cab_status cs on (bk.status = cs.status_id and cs.type = 'cab')
        join payment_type payty on bk.charge_type = payty.payment_type_id
        left join quotation_estimation bkest on bk.booking_id = bkest.booking_id
        left join quotation_pickdrop_details bpd on bk.booking_id = bpd.booking_id
        left join payment_transaction_response ptr on bk.reference_number = ptr.mer_txn
        LEFT JOIN bank_details ON driver.id = bank_details.user_id
        LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
        LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type='driverS'
        left join company as ucompany ON driver.id = ucompany.user_id
        LEFT JOIN company AS user_company ON us.id = user_company.user_id
        left join company_setup as compset ON bk.company_id= compset.id
        left join user_info as us3 ON bk.client_id= us3.user_id
        left join user_info ON bk.user_id= user_info.user_id
        left join user_transaction as ut ON bk.booking_id= ut.booking_id
        left join master_currency as mc ON compset.currency_id= mc.id
        left join payment_type as pt ON ut.payment_type_id= pt.payment_type_id
        left join master_city as mcity ON bpd.pickup_city= mcity.id
        LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
        LEFT JOIN local_package ON bk.package_id =local_package.id
        LEFT JOIN master_country ON us.nationality = master_country.id      WHERE 1=1
    `;
  // Prepare replacements for named parameters
  const replacements = {};
  if (id !== undefined) replacements.id = id;
  if (booking_id !== undefined) replacements.booking_id = booking_id;
  if (agent_reference !== undefined)
    replacements.agent_reference = agent_reference;
  if (booking_type !== undefined && booking_type !== "")
    replacements.booking_type = booking_type;
  if (driver_name !== undefined) replacements.driver_name = driver_name;
  if (from_date !== undefined && to_date !== undefined) {
    replacements.from_date = from_date;
    replacements.to_date = to_date;
  }
  if (client_first_name !== undefined)
    replacements.client_first_name = `%${client_first_name}%`;
  if (client_last_name !== undefined)
    replacements.client_last_name = `%${client_last_name}%`;
  if (client_id !== undefined) replacements.client_id = client_id;
  if (client_email !== undefined) replacements.client_email = client_email;
  if (client_mobile_no !== undefined)
    replacements.client_mobile_no = client_mobile_no;
  if (driver_first_name !== undefined)
    replacements.driver_first_name = driver_first_name;
  if (driver_last_name !== undefined)
    replacements.driver_last_name = driver_last_name;
  if (driver_id !== undefined) replacements.driver_id = driver_id;
  if (referral_key !== undefined) replacements.referral_key = referral_key;
  if (driver_mobile_no !== undefined)
    replacements.driver_mobile_no = driver_mobile_no;
  if (driver_email !== undefined) replacements.driver_email = driver_email;
  if (vehicle_type !== undefined) replacements.vehicle_type = vehicle_type;
  if (state_name !== undefined) replacements.state_name = state_name;
  if (city_name !== undefined) replacements.city_name = city_name;
  if (pickup_address !== undefined)
    replacements.pickup_address = pickup_address;
  if (drop_address !== undefined) replacements.drop_address = drop_address;
  if (booking_status !== undefined)
    replacements.booking_status = booking_status;
  if (pickup_date !== undefined) replacements.pickup_date = pickup_date;
  if (payment_type !== undefined) replacements.payment_type = payment_type;
  if (pickup_time !== undefined) replacements.pickup_time = pickup_time;
  if (user_id !== undefined) replacements.user_id = user_id;
  if (user_mobile !== undefined) replacements.user_mobile = user_mobile;
  if (vehicle_no !== undefined) replacements.vehicle_no = vehicle_no;
  if (status !== undefined) replacements.status = status;
  if (multi_status !== undefined && multi_status !== "") {
    if (multi_status == "222" || multi_status == "111") {
      replacements.booking_pickup_date = booking_pickup_date;
    }
  }
  if (partner_name !== undefined && partner_name !== "")
    replacements.partner_name = partner_name;
  if (pickupaddress !== undefined)
    replacements.pickupaddress = `%${pickupaddress}%`;
  if (drop_area !== undefined) replacements.drop_area = `%${drop_area}%`;
  if (from_time !== undefined && to_time !== undefined) {
    replacements.from_time = from_time;
    replacements.to_time = to_time;
  }
  replacements.limit = pageSize;
  replacements.offset = offset;
  try {
    const [result, countResult] = await Promise.all([
      Quotation.sequelize.query(sql, {
        replacements,
        type: Quotation.sequelize.QueryTypes.SELECT,
      }),
      Quotation.sequelize.query(countSql, {
        replacements: Object.fromEntries(
          Object.entries(replacements).filter(
            ([key]) => key !== "limit" && key !== "offset"
          )
        ),
        type: Quotation.sequelize.QueryTypes.SELECT,
      }),
    ]);
    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / pageSize);
    if (result?.length > 0) {
      if (isInternalCall) {
        return {
          result,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
          },
        }; // Return raw data for internal calls
      } else {
        return res.status(200).json({
          status: "success",
          result,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
          },
          message: "Data fetched successfully",
        });
      }
    } else {
      if (isInternalCall) {
        return null; // Or throw an error if preferred
      } else {
        return res.status(404).json({
          status: "failed",
          message: "No records found",
          data: [],
        });
      }
    }
  } catch (err) {
    console.error("Error in quotationListSearch:", err);

    if (isInternalCall) {
      throw err; // Let the internal caller handle the error
    } else {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
};

export const updateItineraryData = async (req, commonObj) => {
  const booking_id = req?.insertId;
  const itinerary_id = req.insertItineraryId;
  const company_id = req.company_id;

  // Fetch company info
  const companyDataArr = await CompanySetup.findAll({
    where: { id: company_id },
  });
  if (!companyDataArr || !companyDataArr[0]) {
    return { message: "Company not found", status: false };
  }
  const companyData = companyDataArr[0];
  const booking_prefix = companyData.itinerary_prefix;

  // Generate booking_ref_no using provided commonObj
  const booking_ref_no = await getBookingRefNo(itinerary_id, booking_prefix);
  console.log({ booking_ref_no, booking_prefix, itinerary_id });
  // Update itinerary table
  const itineraryUpdateCount = await Itinerary.update(
    { itinerary_id: booking_ref_no },
    { where: { id: itinerary_id } }
  );

  if (itineraryUpdateCount[0] === 1) {
    // Update booking table
    await Quotation.update(
      { itinerary_id: booking_ref_no },
      { where: { booking_id: itinerary_id } }
    );
    return {
      message: "updated successfully",
      status: true,
      data: { itinerary_id: booking_ref_no || itinerary_id },
    };
  } else {
    return { message: "No record updated", status: false };
  }
};

export const quotationListData = async (req, res) => {
  const { id, quotation_id, itinerary_id } = req?.body;

  let sql = `
    SELECT 
      bk.booking_id AS id,
      bk.itinerary_id AS itinerary_id,
      bk.charge_type AS charge_type,
      bk.master_package_id AS master_package_type,
      bk.company_id AS company_id,
      compset.com_name AS domain_name,
      compset.currency_id,
      mc.name AS currency,
      mc.symbol AS currency_symbol,
      bk.driver_id AS driver_id,
      bk.reference_number AS ref,
      bk.agent_reference,
      bk.remark,
      bk.status_c,
      bk.status as status_id,
      bk.user_id,
      us.first_name,
      us.last_name,
      CONCAT(us.first_name, ' ', us.last_name) AS user_name,
      us.email,
      us.mobile as user_mobile,
      master_country.name as user_nationality,
      user_info.alternate_mobile AS user_alt_mobile,
      user_info.gst_registration_number,
      cab_status.status as driver_status,
      bk.client_id,
      CONCAT(us2.first_name, ' ', us2.last_name) AS clientname,
      us2.mobile as client_mobile,
      us2.email as client_email,
      us3.alternate_mobile as client_alt_mobile,
      bk.driver_id,
      CONCAT(driver.first_name, ' ', driver.last_name) AS driver_name,
      driver.mobile,
      driver.duty_status,
      dmvt.vehicle_type AS driver_vehicle_type,
      dmvt.category_id AS vehicle_category_id,
      bank_details.name as bank_name,
      bank_details.ac_no as account_no,
      bank_details.ifsc_code,
      bank_details.ac_holder_name,
      bank_details.branch,
      user_bank_detail.name as user_bank_name,
      user_bank_detail.ac_no as user_ac_no,
      user_bank_detail.ifsc_code as user_ifsc_code,
      user_bank_detail.ac_holder_name as user_beneficiary_name,
      bank_details.branch as user_bank_branch,
      ucompany.company_name,
      ucompany.mobile_no,
      ucompany.landline_no,
      compset.gst_no,
      user_company.service_tax_gst,
      vm.vehicle_no,
      vm.model as year,
      vm.color,
      vmodel.name as vehicle_name,
      mpm.package_mode AS package_mode,
      bk.master_package_id as booking_type_id,
      mp.name AS booking_type,
      mp.image as booking_type_image,
      mp.icon as booking_type_icon,
      payty.pay_type_mode AS charge_type_name,
      mvt.vehicle_type AS vehicle,
      bk.no_of_vehicles AS no_of_vehicles,
      mcoup.name AS coupon_name,
      DATE(bk.booking_date) AS booking_date,
      TIME(bk.booking_date) AS booking_time,
      bk.device_type,
      DATE_FORMAT(bk.booking_release_date,'%Y-%m-%d %H:%i:%s') as booking_release_date,
      cs.status AS status,
      bkest.price_before_tax,
      bkest.booking_estimation_id AS booking_estimation_id,
      bkest.booking_id AS booking_id,
      bkest.estimated_time AS estimated_time,
      bkest.estimated_distance AS estimated_distance,
      bkest.estimateprice_before_discount AS estimateprice_before_discount,
      bkest.discount_price AS discount_price,
      bkest.extra_price AS extra_charge,
      bkest.service_charge AS service_charge,
      bkest.state_tax AS state_tax,
      bkest.toll_tax AS toll_tax,
      bkest.estimated_final_price AS estimated_final_price,
      bkest.booking_amt_percentage AS booking_amt_percentage,
      bkest.estimated_price_before_markup AS estimated_price_before_markup,
      bkest.estimateprice_before_discount AS estimateprice_before_discount,
      bkest.total_tax_price AS total_tax_price,
      bkest.discount_price AS discount_price,
      bkest.approx_distance_charge AS approx_distance_charge,
      bkest.approx_after_km AS approx_after_km,
      bkest.approx_after_hour,
      bkest.approx_hour_charge,
      bkest.approx_waiting_charge AS approx_waiting_charge,
      bkest.approx_waiting_minute AS approx_waiting_minute,
      bkest.minimum_charge,
      bkest.night_rate_type AS night_rate_type,
      bkest.night_rate_value AS night_rate_value,
      bkest.night_rate_begins AS night_rate_begins,
      bkest.night_rate_ends AS night_rate_ends,
      bkest.night_charge_price AS night_charge_price,
      bkest.premiums_type,
      bkest.premiums_value,
      bkest.premiums_price,
      bkest.extras AS extras,
      bkest.extra_price AS extra_price,
      bkest.peak_time_value AS peak_time_value,
      bkest.peak_time_price AS peak_time_price,
      bkest.cgst_tax AS cgst_tax,
      bkest.igst_tax AS igst_tax,
      bkest.sgst_tax AS sgst_tax,
      bkest.total_tax_price AS total_tax_price,
      bkest.rounding AS rounding,
      bkest.level AS level,
      bkest.direction AS direction,
      bkest.created_date AS created_date,
      bkest.updated_date AS updated_date,
      bkest.estimated_final_price AS amount,
      bkest.service_charge AS service_charge,
      bkest.booking_cancellation_rule,
      bpd.pickup_date AS pickup_date,
      bpd.pickup_time AS pickup_time,
      CONCAT(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
      bpd.pickup_area AS pickup_area,
      bpd.pickup_address AS departure,
      bpd.drop_area,
      bpd.drop_address,
      bpd.adults AS adults,
      bpd.childs AS childs,
      bpd.luggages AS luggages,
      bpd.pickup_country AS pickup_country,
      bpd.pickup_state AS pickup_state,
      bpd.pickup_city AS pickup_city,
      bpd.pickup_latitude AS pickup_latitude,
      bpd.pickup_longitude AS pickup_longitude,
      bpd.pickup_zone AS pickup_zone,
      bpd.drop_date AS drop_date,
      bpd.drop_time AS drop_time,
      bpd.drop_country AS drop_country,
      bpd.drop_state AS drop_state,
      bpd.drop_city AS drop_city,
      bpd.drop_latitude AS drop_latitude,
      bpd.drop_longitude AS drop_longitude,
      bpd.drop_zone AS drop_zone,
      ut.created_date AS created_at,
      ut.payment_status AS is_paid,
      ut.time AS paid_at,
      ut.booking_transaction_no,
      ut.payment_type_id,
      SUM(ut.amount) AS booking_amt_paid,
      (bkest.estimated_final_price - SUM(ut.amount)) as booking_amt_balance,
      pt.pay_type_mode AS payment_type,
      mcity.name AS city_name,
      quotation_charges.driver_share_amt,
      quotation_charges.comp_share_amt,
      quotation_charges.partner_share_amt,
      local_package.name as local_pkg_name
    FROM quotation bk
      LEFT JOIN user us ON bk.user_id = us.id
      LEFT JOIN user us2 ON bk.client_id = us2.id
      LEFT JOIN user driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id
      LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model vmodel ON vm.id = vmodel.id
      LEFT JOIN master_vehicle_type dmvt ON vmodel.id = dmvt.id
      LEFT JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
      LEFT JOIN master_package mp ON bk.master_package_id = mp.id
      LEFT JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
      LEFT JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
      LEFT JOIN company_setup compset ON bk.company_id = compset.id
      LEFT JOIN master_currency mc ON compset.currency_id = mc.id
      LEFT JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN quotation_estimation bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN quotation_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN bank_details ON driver.id = bank_details.user_id
      LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
      LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type='driverS'
      LEFT JOIN company ucompany ON driver.id = ucompany.user_id
      LEFT JOIN company AS user_company ON us.id = user_company.user_id
      LEFT JOIN user_info us3 ON bk.client_id = us3.user_id
      LEFT JOIN user_info ON bk.user_id = user_info.user_id
      LEFT JOIN user_transaction ut ON bk.booking_id = ut.booking_id
      LEFT JOIN payment_type pt ON ut.payment_type_id = pt.payment_type_id
      LEFT JOIN master_city mcity ON bpd.pickup_city = mcity.id
      LEFT JOIN quotation_charges ON bk.booking_id = quotation_charges.BookingID
      LEFT JOIN local_package ON bk.package_id = local_package.id
      LEFT JOIN master_country ON us.nationality = master_country.id
    WHERE 1=1
  `;
  const replacements = {};

  if (typeof id !== "undefined") {
    sql += " AND bk.booking_id = :id ";
    replacements.id = id;
  }
  if (typeof itinerary_id !== "undefined" && itinerary_id !== "") {
    sql += " AND bk.itinerary_id = :itinerary_id ";
    replacements.itinerary_id = itinerary_id;
  }
  if (typeof quotation_id !== "undefined") {
    sql += " AND bk.reference_number = :quotation_id ";
    replacements.quotation_id = quotation_id;
  }

  sql += " GROUP BY bk.booking_id ORDER BY bk.booking_id DESC";

  try {
    const result = await Quotation.sequelize.query(sql, {
      replacements,
      type: Quotation.sequelize.QueryTypes.SELECT,
    });
    console.log({ result });
    if (result?.length > 0) {
      const travellers = await QuotationsTravellerDetails.findAll({
        where: { booking_id: result[0].id },
      });
      result[0].travellerDetails = travellers;
      return await successResponse(
        res,
        MESSAGES.GENERAL.DATA_FETCHED,
        result[0],
        200
      );
      // return res.status(200).json({result,message:"success"})
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, result, 404);

      // return { error: "No Record Found", status: "failed" };
    }
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: err.message, status: "failed" });
  }
};

// safely render stored HTML with defaults
export const safeRender = (templateHtml, data = {}) => {
  try {
    // define defaults so template doesn't break
    const defaults = {
      company_logo: null,
      server_name: "bookingcabs.com",
      itinerary_id: "",
      booking_ref_no: "",
      booking_date: "",
      booking_time: "",
      booking_release_date: null,
      user_name: "Team BookingCabs",
      cityName: "",
      mobilePrefix: "+91",
      mobile: "",
      travellerDetails: [],
      items: [],
      dropDataArray: null,
      currency: "INR",
      currency_symbol: "₹",
      price_before_tax: 0,
      entanceFees: 0,
      discount_price: 0,
      total_tax_price: 0,
      total_price: 0,
      per_km_price: 0,
      per_hr_charge: 0,
      inclusionsData: null,
      exclusionsData: null,
      fareRuleData: null,
      tripContentData: "",
      night_rate_begins: "23:00",
      night_rate_ends: "05:00",
      night_rate_value: 0,
      base_fare: "",
      local_pkg_name: "",
      no_of_days: "",
      vehicle_type: "",
      vehicle: "",
      no_of_vehicles: 1,
      approx_after_km: 0,
      adults: 0,
      childs: 0,
      luggage: 0,
      pickup_date: "",
      pickup_time: "",
      pickup_address: "",
      dropDate: "",
      travel_days: "",
      estimated_distance: "",
      master_package_type: 0,
      module_type: 0,
      company_logo: "",
      comp_name: "",
      company_name: "",
      com_pan: "",
      com_gst_no: "",

      // Booking Information
      type: "",
      ref: "",
      booking_ref_no: "",
      itinerary_no: "",
      booking_status: "Confirmed",
      booking_type: "",
      formattedDate: "",
      booking_date: "",
      booking_time: "",

      // Client Information
      first_name: "",
      last_name: "",
      client_name: "",
      clientname: "",
      user_com_name: "",
      user_com_address: "",
      user_com_state: "",
      user_com_pincode: "",
      user_comp_mobile: "",
      user_comp_phone: "",
      user_gst_no: "",
      user_pan_no: "",
      email: "",

      // Vehicle Information
      vehicle: "",
      booking_vehicle: "",
      vehicle_type: "",
      vehicle_no: "",
      driver_name: "",

      // Location Information
      pickup_address: "",
      pickup_area: "",
      drop_address: "",
      from: "",
      to: "",
      address: "",

      // Timing Information
      start_time: "",
      starting_time: "",
      end_time: "",
      closing_time: "",
      reporting_time: "",
      pickup_date: "",

      // Package Information
      package: "",
      name: "",
      transfer: "",
      outstation: "",
      lum_sum: "",

      // Meter Readings
      starting_meter: "",
      closing_meter: "",
      releasing_meter: "",

      // Distance and Units
      distance: "",
      total_km: "",
      totalHours: "",
      total_hr: "",
      unit: "",
      extra_km: "",
      extra_hr: "",

      // Pricing Information
      per_km_price: "0",
      rate: "0",
      base_fare: "0",
      amount: "0",
      extras: "0",
      booking_amt_paid: "0",
      booking_amt_balance: "0",
      advance: "0",
      balance: "0",
      running_amount: "0",
      discount: "0",
      tax: "0",
      tax_amount: "0",
      estimated_price: "0",

      // Additional Fields
      sac_code: "",
      ref_no: "",
    };

    // merge defaults with real data
    const safeData = { ...defaults, ...data };

    // also protect arrays
    if (!Array.isArray(safeData.travellerDetails)) {
      safeData.travellerDetails = [];
    }
    if (!Array.isArray(safeData.items)) {
      safeData.items = [];
    }
    return  ejs.render(templateHtml, safeData);
  } catch (err) {
    console.error("EJS Render Failed:", err);
    return `<p style="color:red;">Template render failed. Error: ${err.message}</p>`;
  }
};

export const sendQuotationMail = async (req, res) => {
  const { booking_id, email, type } = req?.body;
  if (typeof booking_id === "undefined" || booking_id === "") {
    return errorResponse(res, "Booking ID is required", {}, 400);
  }
  if (typeof email === "undefined" || email === "") {
    return errorResponse(res, "Email is required", {}, 400);
  }
  try {
    let result = await quotationListSearch(
      { body: { id: booking_id } },
      null,
      true
    );
    let companyDetails = await Company.findOne({
      where: { user_id: req.user.id },
    });

    let data = result?.result ? result.result[0] : null;
    data = {
      ...data,
      company_logo: companyDetails?.company_logo_path,
      user_name: companyDetails?.contact_person_name,
      user_mobile: companyDetails?.mobile_no,
    };
    console.log(data?.company_logo, "tyyyyyyyyyyyyyyyyyy");
    let template = await EmailTemplate.findOne({ where: { name: type } });
    console.log({ data });
    console.log({ template });
    !data.upIdImagePath &&
      (data.upIdImagePath = `https://b2b.bookingcabs.com/upload/${data.company_id}/paytm_upi.jpeg`);
    console.log({ url: data.upIdImagePath });
    // data.company_logo = "https://bookingcabs.in/images/logo.png";
    let pdf = await generatePdf({
      template_name: "email_quotation1",
      template_param: data,
      file_name: `Quotation${data.ref}`,
    });

    const compiledHtml = await safeRender(template?.description, data);
    // console.log({compiledHtml})
    let email = await sendEmailWithAttachment(
      "manish.bookingcabs@gmail.com",
      "Quotation",
      compiledHtml,
      pdf,
      `Quotation${data.ref}.pdf`
    );

    if (!data) {
      return errorResponse(res, "No Record Found", {}, 404);
    }
    return res.json({
      status: "success",
      message: "Quotation sent successfully",
      data: result,
      template,
      url: data?.upIdImagePath,
      email,
    });
  } catch (err) {
    console.log({ err });
    return errorResponse(res, "Internal server error", err.message, 500);
  }
};

export const sendQuotationSMS = async (req, res) => {
  const { booking_id, phone } = req?.body;
  if (typeof booking_id === "undefined" || booking_id === "") {
    return errorResponse(res, "Booking ID is required", {}, 400);
  }
  if (typeof phone === "undefined" || phone === "") {
    return errorResponse(res, "Phone is required", {}, 400);
  }
  try {
    let result = await quotationListSearch(
      { body: { id: booking_id } },
      null,
      true
    );
    let data = result?.result ? result.result[0] : null;
    let template = await SmsTemplate.findOne({
      where: { msg_type: "Quotation" },
    });
    console.log({ data });

    !data.upIdImagePath &&
      (data.upIdImagePath = `https://b2b.bookingcabs.com/upload/${data.company_id}/paytm_upi.jpeg`);
    console.log({ url: data.upIdImagePath });
    let msg = template?.message
      .replace(/{#username#}/g, data.user_name || "")
      .replace(/{#booking_type#}/g, data.booking_type || "")
      .replace(/{#booking_ref#}/g, data.ref || "")
      .replace(/{#last_date#}/g, data.booking_date || "")
      // .replace(/{#web_link#}/g, "www.bookingcabs.in" || "")
      .replace(/{#mobile#}/g, data?.mobile_no || "");
    // .replace(
    //   /{#web_link#}/g,
    //   `booking_id=${data?.booking_id}` ||
    //     ""
    // );

    // http://localhost:3000/quotation-details?booking_id=
    // const compiledHtml = await safeRender(template?.description, data);
    console.log({ msg });
    let sms = await sendSMS(phone, msg);

    if (!data) {
      return errorResponse(res, "No Record Found", {}, 404);
    }
    return res.json({
      status: "success",
      message: "Quotation sent successfully",
      data: result,
      template,
      url: data?.upIdImagePath,
      sms,
    });
  } catch (err) {
    console.log({ err });
    return errorResponse(res, "Internal server error", err.message, 500);
  }
};
