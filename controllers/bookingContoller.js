import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import { successResponse, errorResponse } from "../utils/response.js";
import BookingActualDetails from "../models/bookingActualDetailsModel.js";
import BookingActualPickdropDetails from "../models/bookingActualPickdropDetailsModel.js";
import dateFormat from "dateformat";
import UserBookingTypeMapping from "../models/userBookingTypeMappingModel.js";
import ViewBookingList from "../views/viewBookingList.js";
import RecentlyViewed from "../models/recentViewedModel.js";
import {
  deductWallet,
  getPrefDriveCityList,
  insertUserCreditNote,
  InsertWallet,
  updateWallet,
  userLoginList,
} from "../controllers/userController.js";
import { getDutyByUser } from "../controllers/userDutyPrefController.js";
import {
  getAcceptDriverBooking,
  getdriverRating,
} from "../controllers/driverController.js";
import BookingResecReassign from "../models/bookingResecReassignModel.js";
import Booking from "../models/bookingModel.js";
import BookingEstimation from "../models/bookingEstimationModel.js";
import BookingPickDropDetails from "../models/bookingPickDropDetailsModel.js";
import SightSeeingBookingDetails from "./sightSeeingBookingDetailsModel.js";
import TravellerDetails from "../models/travellerDetailsModel.js";
import CouponStatistics from "../models/couponStaticsModel.js";
import MasterLocation from "../models/masterlocationModel.js";
import MasterAddress from "../models/masterAddressModel.js";
import BookingMarkup from "../models/bookingMarkup.js";
import CompanySetup from "../models/companySetupModel.js";
import {
  generatePdf,
  // generatePlacCardPdf,
  getBookingRefNo,
  getLowestCancellationRule,
  sendTemplatedSMS,
  // transactionMail,  Method not exists
} from "../utils/helpers.js";
import {
  addBookingLogsData,
  addBookingTravellerDetails,
  addMultiBookingTravellerDetail,
  addSightSeeingTravellerDetail,
  bookingConfirmationEmail,
  copyBookingData,
  copyBookingEstimationData,
  copybookingMarkupData,
  copybookingPickDropData,
  copyItineraryData,
  // bookingListSearch,
  // bookingUnassignedData,
  dutyTypeList,
  fetchBookingData,
  getBookingInfo,
  getOutstationBookingDetails,
  getSightseeingBookingDetails,
  getStatementOfAccountCount,
  getStatementOfAccountFilterCount,
  getStatementOfAccountList,
  getTravellerBookingDetails,
  getUserData,
  prefDriveCityList,
} from "./bookingHelperFunctions.js";
import Quotation from "../models/quotationModel.js";
import BookingRegistered from "../models/bookingRegistedModel.js";
import BookingStack from "../models/bookingStackModel.js";
import BookingTracker from "../models/bookingTrackerModel.js";
import sequelize from "../config/clientDbManager.js";
import User from "../models/userModel.js";
import Client from "../models/clientModel.js";
import Company from "../models/companyModel.js";
import UserUploadDocument from "../models/userUploadDocumentModel.js";
import sendSMS from "../utils/sendSMS.js";
import { sendEmail } from "../utils/emailSender.js";
import {
  addItineraryData,
  addQuotationData,
  addQuotationEstimation,
  addQuotationMarkup,
  addQuotationPickdrop,
  addSightSeeingQuotationDetail,
  addSightSeeingQuotationTravellerDetail,
  updateItineraryData,
  updateItineraryReferenceNo,
  updateQuotationReferenceNo,
} from "./quotationHelper.js";
import { error } from "console";
import { tr } from "date-fns/locale";
import UserTransaction from "../models/userTransactionModel.js";
import { Sequelize } from "sequelize";
import UserCreditNote from "../models/userCreditNoteModel.js";
import BookingCharges from "../models/bookingChargesModel.js";
import UserRating from "../models/userRatingModel.js";
import Driver from "../models/driverModel.js";
import AgentWorkHistory from "../models/agentWorkHistoryModel.js";
import QuotationsTravellerDetails from "../models/quotationTravellerDetailModel.js";

export const companyInfo = async (companyId) => {
  try {
    const result = await CompanySetup.findOne({
      where: { id: companyId },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const bookingTravelDetails = async (bookingId) => {
  try {
    const results = await sequelize.query(
      `CALL booking_travel_detail(:bookingId)`,
      {
        replacements: { bookingId },
        raw: true,
      }
    );

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addBookingActualDetails = async (paramsOrReq, res) => {
  let params;

  if (res) {
    // Called via API
    params = paramsOrReq.body;
  } else {
    // Called internally
    params = paramsOrReq;
  }

  const {
    booking_id,
    arrival_time_pre,
    arrival_time_post,
    actual_waiting_distance,
    actual_distance,
    actual_time,
    actual_driven_duration,
    final_latitude,
    final_longitude,
  } = params;

  const created_date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  try {
    const insertParam = {
      booking_id,
      arrival_time_pre,
      arrival_time_post,
      actual_waiting_distance,
      actual_distance,
      actual_time,
      actual_driven_duration,
      final_latitude,
      final_longitude,
      created_date,
    };
    // Remove undefined or null values
    Object.keys(insertParam).forEach((key) => {
      if (insertParam[key] === undefined || insertParam[key] === null) {
        delete insertParam[key];
      }
    });

    const result = await BookingActualDetails.create(insertParam);
    if (res) {
      return successResponse(res, MESSAGES.BOOKING.BOOKING_DETAIL, { result });
    }

    // Internal call: return the inserted record
    return result;
  } catch (error) {
    if (res) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
    throw new Error(`Add Booking Actual Details Failed: ${error.message}`);
  }
};

export const addBookingActualPickDropDetails = async (
  req,
  res,
  isInternal = true
) => {
  const {
    booking_id,
    pickup_area,
    pickup_address,
    pickup_latitude,
    pickup_longitude,
    drop_area,
    drop_address,
    drop_latitude,
    drop_longitude,
  } = req||req?.body||{};

  const created_date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  try {
    const insertParam = {
      booking_id,
      pickup_area,
      pickup_address,
      pickup_latitude,
      pickup_longitude,
      drop_area,
      drop_address,
      drop_latitude,
      drop_longitude,
      created_date,
    };

    Object.keys(insertParam).forEach((key) => {
      if (insertParam[key] === undefined || insertParam[key] === null) {
        delete insertParam[key];
      }
    });
console.log(insertParam,"pickDrop")
    await BookingActualPickdropDetails.create(insertParam);
    if (isInternal) {
      return true;
    }
    return successResponse(res, MESSAGES.BOOKING.BOOKING_DETAIL);
  } catch (error) {
    if (isInternal) {
      throw new Error(error.message);
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const bookingMappingStatus = async (req, res) => {
  const { id, user_id, mapping_status } = req.body;

  try {
    if (!id || !user_id || mapping_status === undefined) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.DATA_NOT_VALID,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const idList = id
      .split(",")
      .map((x) => parseInt(x.trim()))
      .filter(Boolean);

    if (idList.length === 0) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.DATA_NOT_VALID,
        STATUS_CODE.BAD_REQUEST
      );
    }

    const [affectedRows] = await UserBookingTypeMapping.update(
      {
        status: mapping_status,
        modified_by: user_id,
      },
      {
        where: {
          id: idList,
        },
      }
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      affectedRows,
    });
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const addBookingMappingDetail = async (req, res) => {
  try {
    const {
      mapping_category,
      country_id,
      state_id,
      city_id,
      user_id,
      vehicle_type,
      booking_type,
      booking_type_mode,
      ip,
      status,
    } = req.body;
    const { id: created_by } = req.user;
    let insertData = {
      mapping_category,
      country_id,
      state_id,
      city_id,
      user_id,
      vehicle_type,
      master_package_id: booking_type,
      master_package_mode_id: booking_type_mode,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      ip,
      status,
      created_by,
    };
    Object.keys(insertData).forEach((key) => {
      if (insertData[key] === undefined || insertData[key] === "") {
        delete insertData[key];
      }
    });

    const result = await UserBookingTypeMapping.create(insertData);

    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, {
      insertId: result.id,
    });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateBookingMappingDetail = async (req, res) => {
  try {
    const { auto_id, user_id, booking_type_mode, ip, status, modified_by } =
      req.body;

    let updateData = {
      user_id,
      master_package_mode_id: booking_type_mode,
      ip,
      status,
      modified_by,
    };
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === "") {
        delete updateData[key];
      }
    });

    const [affectedRows] = await UserBookingTypeMapping.update(updateData, {
      where: { id: auto_id },
    });

    if (affectedRows > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        {},
        STATUS_CODE.BAD_REQUEST
      );
    }
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const bookingListSearch = async (req, res, isInternalCall = false) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    const {
      id,
      booking_id,
      agent_reference,
      booking_type,
      driver_name,
      from_date,
      to_date,
      client_first_name,
      client_last_name,
      client_id,
      client_email,
      client_mobile_no,
      driver_first_name,
      driver_last_name,
      driver_id,
      vendor_id,
      referral_key,
      driver_mobile_no,
      driver_email,
      vehicle_type,
      state_name,
      city_name,
      pickup_address,
      drop_address,
      booking_status,
      pickup_date,
      payment_type,
      pickup_time,
      unassigned_booking,
      user_id,
      user_mobile,
      vehicle_no,
      status,
      multi_status,
      booking_pickup_date,
      multi_booking_type,
      multi_vehicle_type,
      multi_city_name,
      partner_name,
      pickupaddress,
      drop_area,
      from_time,
      to_time,
      preferred_booking,
      ignition_type_id,
      vehicle_type_id,
      pref_city,
      page = 1,
      limit = 10,
    } = isInternalCall ? req : req.body;

    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM vw_booking_list WHERE 1=1`;

    const filters = {
      id,
      agent_reference,
      booking_type,
      driver_name,
      client_first_name,
      client_last_name,
      client_id,
      client_email,
      client_mobile_no,
      driver_first_name,
      driver_last_name,
      driver_id,
      vendor_id,
      referral_key,
      driver_mobile_no,
      driver_email,
      vehicle_type,
      state_name,
      city_name,
      pickup_address,
      drop_address,
      booking_status,
      pickup_date,
      payment_type,
      pickup_time,
      user_id,
      user_mobile,
      vehicle_no,
      status,
      partner_name,
      pickupaddress,
      drop_area,
      preferred_booking,
      ignition_type_id,
      vehicle_type_id,
    };

    // for (const [key, value] of Object.entries(filters)) {
    //   if (value !== undefined && value !== "") {
    //     sql += ` AND ${sequelize.escapeId(key)} = ${sequelize.escape(value)}`;
    //   }
    // }
    const columnsDesc = await sequelize.query("DESCRIBE vw_booking_list", {
      type: sequelize.QueryTypes.DESCRIBE,
    });
    const allowedColumns = Object.keys(columnsDesc);
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== "" && allowedColumns.includes(key)) {
        sql += ` AND \`${key}\` = ${sequelize.escape(value)}`;
      }
    }

    if (from_date && to_date) {
      sql += ` AND DATE(pickup_date) BETWEEN ${sequelize.escape(
        from_date
      )} AND ${sequelize.escape(to_date)}`;
    }
    if (multi_status && multi_status !== "") {
      if (multi_status === "222") {
        sql += ` AND pickup_date = ${sequelize.escape(booking_pickup_date)}`;
      } else if (multi_status === "111") {
        sql += ` AND pickup_date > ${sequelize.escape(booking_pickup_date)}`;
      } else {
        sql += ` AND status IN (${multi_status})`;
      }
    }

    if (multi_booking_type) {
      sql += ` AND master_package_id IN (${multi_booking_type})`;
    }

    if (multi_vehicle_type) {
      sql += ` AND master_vehicle_type_id IN (${multi_vehicle_type})`;
    }

    if (multi_city_name) {
      sql += ` AND pickup_city IN (${multi_city_name})`;
    }

    if (pref_city) {
      sql += ` OR pickup_city IN (${pref_city})`;
    }

    if (from_time && to_time) {
      sql += ` AND pickup_time BETWEEN ${sequelize.escape(
        from_time
      )} AND ${sequelize.escape(to_time)}`;
    }

    if (unassigned_booking == 1) {
      sql += ` AND driver_id = 0`;
    }

    sql += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

    const results = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      const enriched = results.map((item) => ({
        ...item,
        is_document_pending:
          item.client_signature === null ||
          item.starting_meter_image === null ||
          item.closing_meter_image === null ||
          item.client_image === null ||
          item.parking_image === null ||
          item.toll_image === null ||
          item.extra_image === null
            ? "YES"
            : "NO",
      }));

      if (isInternalCall) {
        return enriched;
      } else {
        return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
          data: enriched || [],
          page: Number(page),
          limit: Number(limit),
        });
      }
    } else {
      isInternalCall
        ? MESSAGES.GENERAL.NO_DATA_FOUND
        : errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    console.error("bookingListSearch error:", error);
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        error.message,
        STATUS_CODE.SERVER_ERROR
      );
    }
  }
};

export const getAllRecentlyViewedItems = async (req, res) => {
  try {
    const { auto_id, user_id, user_type_id, page = 1, limit = 10 } = req.body;

    const offset = (page - 1) * limit;

    let baseQuery = `
      SELECT rv.*,  u.first_name, u.last_name, u.email, u.mobile, r.rolename
            FROM
      recently_viewed AS rv
      LEFT JOIN user AS u ON
      u.id = rv.user_id
      LEFT JOIN user_assign_role AS ur ON
      ur.user_id = u.id
      LEFT JOIN user_role AS r ON
      r.Role_ID = ur.role_id
      WHERE 1 = 1
      LIMIT 10
    `;
    // need to uncomment below code only for testing commented the code

    /*
    if (typeof user_type_id !== "undefined" && user_type_id !== "") {
      if (user_type_id != 10 && user_type_id != 11) {
        baseQuery += ` AND rv.user_id = ${sequelize.escape(user_id)}`;
      }
    }

    baseQuery += `
      AND rv.created_date = (
        SELECT MAX(created_date)
        FROM recently_viewed
        WHERE user_id = rv.user_id AND master_package_id = rv.master_package_id
      )
      ORDER BY rv.created_date ASC
      LIMIT ${sequelize.escape(limit)} OFFSET ${sequelize.escape(offset)}
    `;
*/
    const results = await sequelize.query(baseQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        results: results,
        page: Number(page),
        limit: Number(limit),
      });
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, {});
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const addRecentlyViewedData = async (req, res) => {
  try {
    const {
      user_id,
      city_id,
      booking_stage,
      booking_data,
      temp_booking_id = "",
      ip,
    } = req.body;

    if (!user_id || !city_id || !booking_stage || !booking_data) {
      return errorResponse(res, MESSAGES.GENERAL.MANDATORY_FIELD);
    }

    const { master_package_type } = booking_data;
    const responseJson = JSON.stringify(booking_data);

    const insertValue = {
      user_id,
      city_id,
      temp_booking_id: temp_booking_id || null,
      booking_stage,
      booking_data: responseJson,
      master_package_id: master_package_type,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      ip: ip || req.ip,
      created_by: user_id,
    };
    const newRecord = await RecentlyViewed.create(insertValue);

    if (!newRecord) {
      return errorResponse(res, MESSAGES.GENERAL.SOMETHING_WENT_WRONG);
    }

    if (temp_booking_id) {
      return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, {
        temp_booking_id,
      });
    } else {
      const booking_ref_no = getBookingRefNo(newRecord.id, "TM");
      await newRecord.update({ temp_booking_id: booking_ref_no });
      return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, {
        booking_ref_no,
      });
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getUnassignedBookingList = async (req, res) => {
  try {
    const loginData = req.body;
    const {
      user_id: userId,
      user_type_id: userTypeId,
      preferred_booking,
      vehicle_type_id,
      city_id,
      ignition_type_id,
    } = loginData || {};

    const post = req.body;

    const draw = parseInt(post.draw);
    const row = parseInt(post.start);
    const rowperpage = parseInt(post.length);
    const columnIndex = post.order[0].column;
    const columnName = post.columns[columnIndex].data;
    const columnSortOrder = post.order[0].dir;
    const searchValue = post.search.value;

    const sort_column = columnName;
    const sort_order = columnSortOrder;

    const userPrefDriveCityList = await getPrefDriveCityList(userId, res, true);
    const userDutyTypeList = await getDutyByUser(userId, res, true);
    const userShiftLoginList = await userLoginList(userId, res, true);

    const pref_city = userPrefDriveCityList
      .map((x) => `'${x.city_id}'`)
      .join(",");

    let multi_booking_type = "";
    if (userDutyTypeList.length > 0) {
      multi_booking_type = userDutyTypeList.map((val) => `'${val}'`).join(",");
    }

    const shiftList = userShiftLoginList.map((x) => `'${x}'`).join(",");

    const filters = {
      unassigned_booking: 1,
      status: 1,
      pickup_date: new Date().toISOString().slice(0, 10),
      limit: rowperpage,
      offset: row,
      sort_column,
      sort_order,
      searchValue: "",
      driver_id: userId,
    };

    if (userTypeId !== 10 && userTypeId !== 11) {
      Object.assign(filters, {
        preferred_booking,
        vehicle_type_id,
        city_name: city_id,
        pref_city,
        multi_booking_type,
        ignition_type_id,
        driver_id: userId,
        vendor_id: userId,
      });
    }

    // If search term exists
    if (searchValue && searchValue.trim() !== "") {
      filters.searchValue = searchValue.trim();
    }

    // Fetch data
    const unassignedBookings = await fetchBookingDetails(filters, res, true);
    const unassignedBookingCount = await fetchBookingDetailsCount(
      filters,
      res,
      true
    );
    const unassignedBookingFilterCount = await fetchBookingDetailsFilterCount(
      filters,
      res,
      true
    );
    if (!unassignedBookings || unassignedBookings.length === 0) {
      return res.json({
        draw,
        iTotalRecords: 0,
        iTotalDisplayRecords: 0,
        data: [],
      });
    }

    const vehicleTypeIds = [
      ...new Set(
        unassignedBookings.map((item) => item.vehicle_type_id).filter(Boolean)
      ),
    ];

    const sql = `
      SELECT vehicle_type_id, GROUP_CONCAT(DISTINCT(name) SEPARATOR ', ') AS vehicle_model
      FROM master_vehicle_model
      WHERE vehicle_type_id IN (:vehicleTypeIds)
      GROUP BY vehicle_type_id
    `;

    const vehicleModelData = await sequelize.query(sql, {
      replacements: { vehicleTypeIds },
      type: sequelize.QueryTypes.SELECT,
    });

    const vehicleModelMap = {};
    vehicleModelData.forEach((row) => {
      vehicleModelMap[row.vehicle_type_id] = row.vehicle_model;
    });

    const enrichedBookings = unassignedBookings.map((booking) => ({
      ...booking,
      vehicle_model: vehicleModelMap[booking.vehicle_type_id] || null,
    }));

    return res.json({
      draw: draw,
      iTotalRecords: unassignedBookingCount[0]?.total_count || 0,
      iTotalDisplayRecords: unassignedBookingFilterCount[0]?.total_count || 0,
      data: enrichedBookings,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", msg: "Internal Server Error" });
  }
};

const fetchBookingDetails = async (req, res, isInternalCall = false) => {
  try {
    let preferred_booking = "";
    let ignition_type_id = "";
    let vehicle_type_id = "";
    let pref_city = "";
    let multi_booking_type = "";

    const { driver_id } = isInternalCall ? req : req.body;

    if (driver_id) {
      const userData = await getDriverPreferredBooking(driver_id, "", true);
      if (userData.length > 1) {
        const user = userData[0];
        preferred_booking = user.preferred_booking;
        ignition_type_id = user.ignition_type_id;
        vehicle_type_id = user.vehicle_type_id;
      }

      const prefData = await getPrefDriveCityList(driver_id, "", true);
      // need to test on real time
      if (Array.isArray(prefData)) {
        const cityIds = prefData.map((item) => item.city_id);
        pref_city = `'${cityIds.join("','")}'`;
      }

      const dutyData = await dutyTypeList(req, res, true);
      if (Array.isArray(dutyData)) {
        const packageIds = dutyData.map((item) => item.package_id);
        multi_booking_type = `'${packageIds.join("','")}'`;
      }
    }

    req.preferred_booking = preferred_booking;
    req.ignition_type_id = ignition_type_id;
    req.vehicle_type_id = vehicle_type_id;
    req.pref_city = pref_city;
    req.multi_booking_type = multi_booking_type;

    const bookingData = await bookingUnassignedData(req, res, true);
    if (isInternalCall) {
      return bookingData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        bookingData,
      });
    }
  } catch (err) {
    if (isInternalCall) {
      throw err;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        err.message
      );
    }
  }
};

const fetchBookingDetailsCount = async (req, res, isInternalCall = false) => {
  try {
    let preferred_booking = "";
    let ignition_type_id = "";
    let vehicle_type_id = "";
    let pref_city = "";
    let multi_booking_type = "";
    const driver_id = isInternalCall ? req?.driver_id : req?.body?.driver_id;
    let dutyData = [];
    let prefData = [];
    let userData = [];

    if (driver_id) {
      userData = await getDriverPreferredBooking(driver_id, "", true);
      if (userData.length > 1) {
        const user = userData;
        preferred_booking = user.preferred_booking;
        ignition_type_id = user.ignition_type_id;
        vehicle_type_id = user.vehicle_type_id;
      }

      prefData = await getPrefDriveCityList(driver_id, "", true);
      if (Array.isArray(prefData)) {
        const cityIds = prefData.map((item) => item.city_id);
        pref_city = `'${cityIds.join("','")}'`;
      }

      const dutyData = await dutyTypeList(req, res, true);
      if (Array.isArray(dutyData)) {
        const packageIds = dutyData.map((item) => item.package_id);
        multi_booking_type = `'${packageIds.join("','")}'`;
      }
    }

    req.preferred_booking = preferred_booking;
    req.ignition_type_id = ignition_type_id;
    req.vehicle_type_id = vehicle_type_id;
    req.pref_city = pref_city;
    req.multi_booking_type = multi_booking_type;

    const bookingData = await bookingUnassignedDataCount(req, res, true);
    if (isInternalCall) {
      return bookingData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        bookingData,
      });
    }
  } catch (err) {
    if (isInternalCall) {
      throw err;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        err.message
      );
    }
  }
};

const fetchBookingDetailsFilterCount = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    let preferred_booking = "";
    let ignition_type_id = "";
    let vehicle_type_id = "";
    let pref_city = "";
    let multi_booking_type = "";
    let userData = [];

    const { driver_id } = isInternalCall ? req?.driver_id : req?.body;
    if (driver_id) {
      userData = await getDriverPreferredBooking(driver_id, "", true);
      if (userData.length > 1) {
        const user = userData;
        preferred_booking = user.preferred_booking;
        ignition_type_id = user.ignition_type_id;
        vehicle_type_id = user.vehicle_type_id;
      }

      prefData = await getPrefDriveCityList(driver_id, "", true);
      if (Array.isArray(prefData)) {
        const cityIds = prefData.map((item) => item.city_id);
        pref_city = `'${cityIds.join("','")}'`;
      }

      const dutyData = await dutyTypeList(req, res, true);
      if (Array.isArray(dutyData)) {
        const packageIds = dutyData.map((item) => item.package_id);
        multi_booking_type = `'${packageIds.join("','")}'`;
      }
    }

    req.preferred_booking = preferred_booking;
    req.ignition_type_id = ignition_type_id;
    req.vehicle_type_id = vehicle_type_id;
    req.pref_city = pref_city;
    req.multi_booking_type = multi_booking_type;

    const bookingData = await bookingUnassignedDataFilterCount(req, res, true);

    if (isInternalCall) {
      return bookingData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        bookingData,
      });
    }
  } catch (error) {
    if (isInternalCall) {
      throw error;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        err.message
      );
    }
  }
};

const getDriverPreferredBooking = async (req, res, isInternalCall = false) => {
  try {
    const driver_id = isInternalCall ? req : req?.body?.driver_id;

    const result = await sequelize.query(
      `SELECT
        vm.ignition_type_id,
        mvm.vehicle_type_id,
        u.id,
        u.first_name,
        d.preferred_booking
      FROM user u
      JOIN user_vehicle_mapping uvm ON uvm.user_id = u.id
      JOIN vehicle_master vm ON uvm.user_vehicle_id = vm.id
      JOIN master_vehicle_model mvm ON vm.id = mvm.id
      JOIN driver d ON u.id = d.user_id
      WHERE u.id = :driver_id`,
      {
        replacements: { driver_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (isInternalCall) {
      return result;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { result });
    }
  } catch (err) {
    if (isInternalCall) {
      throw new Error(err.message);
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        err.message
      );
    }
  }
};

export const bookingUnassignedData = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    const {
      unassigned_booking,
      preferred_booking,
      ignition_type_id,
      vehicle_type_id,
      pref_city,
      multi_booking_type,
      searchValue,
      limit,
      offset,
    } = isInternalCall ? req : req?.body;

    let sql = `
      SELECT bk.booking_id AS id, bk.itinerary_id, bk.company_id,
        compset.com_name AS domain_name, compset.driver_min_balance,
        bk.driver_id, bk.reference_number AS ref, bk.status_c, bk.user_id,
        CONCAT(us.first_name, ' ', us.last_name) AS user_name, us.mobile AS user_mobile,
        bk.client_id, CONCAT(us2.first_name, ' ', us2.last_name) AS clientname,
        us2.mobile AS client_mobile, us.email AS user_email, us2.email AS client_email,
        CONCAT(driver.first_name, ' ', driver.last_name) AS driver_name, driver.gcm_id,
        vm.vehicle_no, vmodel.name AS vehicle_name, mpm.package_mode,
        bk.master_package_id AS booking_type_id, mp.name AS booking_type,
        mp.image AS booking_type_image, mp.icon AS booking_type_icon,
        payty.pay_type_mode AS charge_type, mvt.id AS vehicle_type_id,
        mvt.category_id AS vehicle_category_id, mvt.vehicle_type AS vehicle,
        bk.no_of_vehicles, mcoup.name AS coupon_name,
        DATE(bk.booking_date) AS booking_date, TIME(bk.booking_date) AS booking_time,
        DATE_FORMAT(bk.booking_release_date,'%Y-%m-%d %H:%i:%s') AS booking_release_date,
        bk.device_type, bk.filter_data, cs.status AS status,
        bkest.booking_estimation_id, bkest.approx_hour_charge, bkest.booking_id,
        bkest.estimated_time, bkest.estimated_distance, bkest.estimateprice_before_discount,
        bkest.discount_price, bkest.estimated_final_price, bkest.estimated_price_before_markup,
        bkest.approx_distance_charge, bkest.approx_after_km, bkest.approx_waiting_charge,
        bkest.approx_waiting_minute, bkest.night_rate_type, bkest.night_rate_value,
        bkest.night_rate_begins, bkest.night_rate_ends, bkest.night_charge_price,
        bkest.premiums_type, bkest.premiums_value, bkest.premiums_price, bkest.extras,
        bkest.extra_price, bkest.peak_time_value, bkest.peak_time_price,
        bkest.cgst_tax, bkest.igst_tax, bkest.sgst_tax, bkest.total_tax_price,
        bkest.rounding, bkest.level, bkest.direction, bkest.created_date,
        bkest.updated_date, bkest.estimated_final_price AS amount,
        bkest.min_per_km_charge, bkest.min_per_hr_charge,
        CONCAT(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
        bpd.pickup_area, bpd.pickup_address AS departure, bpd.drop_area,
        bpd.drop_address, bpd.adults, bpd.childs, bpd.luggages, bpd.pickup_country,
        bpd.pickup_state, bpd.pickup_city, bpd.pickup_latitude, bpd.pickup_longitude,
        bpd.pickup_zone, bpd.drop_date, bpd.drop_time, bpd.drop_country, bpd.drop_state,
        bpd.drop_city, bpd.drop_latitude, bpd.drop_longitude, bpd.drop_zone,
        mc.name AS city_name, booking_charges.driver_share_amt,
        booking_charges.comp_share_amt, booking_charges.partner_share_amt,
        ptr.mmp_txn, ptr.mer_txn, ptr.amt, ptr.prod, ptr.date, ptr.bank_txn,
        ptr.f_code, ptr.bank_name AS bankName, ptr.merchant_id, ptr.udf9,
        ptr.discriminator, ptr.surcharge, ptr.CardNumber, ptr.signature,
        local_package.name AS local_pkg_name
      FROM booking bk
      JOIN user us ON bk.user_id = us.id
      JOIN user us2 ON bk.client_id = us2.id
      LEFT JOIN user driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id AND vehm.user_id != 0
      LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model vmodel ON vm.id = vmodel.id
      JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
      JOIN master_package mp ON bk.master_package_id = mp.id
      JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
      JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
      JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN booking_estimation bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN payment_transaction_response ptr ON bk.reference_number = ptr.mer_txn
      LEFT JOIN company_setup compset ON bk.company_id = compset.id
      LEFT JOIN master_city mc ON bpd.pickup_city = mc.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      LEFT JOIN local_package ON bk.package_id = local_package.id
      WHERE (bk.status = 22 OR bk.status <= 8)
    `;

    if (unassigned_booking === "1") {
      sql += " AND (bk.driver_id = 0 OR bk.vendor_id = 0)";
    }

    if (preferred_booking && preferred_booking !== "BOTH") {
      sql += ` AND bk.preferred_booking = ${sequelize.escape(
        preferred_booking
      )}`;
    }

    if (ignition_type_id) {
      sql += ` AND (bk.ignition_type_id = ${sequelize.escape(
        ignition_type_id
      )} OR bk.ignition_type_id = 0)`;
    }

    if (vehicle_type_id) {
      sql += ` AND bk.master_vehicle_type_id <= ${sequelize.escape(
        vehicle_type_id
      )}`;
    }

    if (pref_city) {
      sql += ` AND bpd.pickup_city IN (${pref_city})`;
    }

    if (multi_booking_type) {
      sql += ` AND bk.master_package_id IN (${multi_booking_type})`;
    }

    if (searchValue) {
      sql += ` ${searchValue}`;
    }

    sql += ` AND bpd.pickup_date >= CURDATE() ORDER BY bk.booking_id DESC`;

    if (limit && offset) {
      sql += ` LIMIT ${sequelize.escape(limit)}, ${sequelize.escape(offset)}`;
    }

    const results = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (isInternalCall) {
      return results;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    }
  } catch (err) {
    if (isInternalCall) {
      throw new Error(err.message);
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        err.message
      );
    }
  }
};

export const bookingUnassignedDataCount = async (req, res, isInternalCall) => {
  try {
    const {
      unassigned_booking,
      preferred_booking,
      ignition_type_id,
      vehicle_type_id,
      pref_city,
      multi_booking_type,
    } = isInternalCall ? req : req.body;
    // This commented query will check again, new query is written below
    /*
    let sql = `
      SELECT COUNT(DISTINCT bk.itinerary_id) AS total_count,
             bk.itinerary_id, bk.company_id, compset.com_name AS domain_name, compset.driver_min_balance,
             bk.driver_id, bk.reference_number AS ref, bk.status_c, bk.user_id,
             CONCAT(us.first_name, ' ', us.last_name) AS user_name, us.mobile AS user_mobile,
             bk.client_id, CONCAT(us2.first_name, ' ', us2.last_name) AS clientname, us2.mobile AS client_mobile,
             us.email AS user_email, us2.email AS client_email,
             CONCAT(driver.first_name, ' ', driver.last_name) AS driver_name, driver.gcm_id,
             vm.vehicle_no, vmodel.name AS vehicle_name,
             mpm.package_mode, bk.master_package_id AS booking_type_id,
             mp.name AS booking_type, mp.image AS booking_type_image, mp.icon AS booking_type_icon,
             payty.pay_type_mode AS charge_type, mvt.id AS vehicle_type_id, mvt.category_id AS vehicle_category_id,
             mvt.vehicle_type AS vehicle, bk.no_of_vehicles,
             mcoup.name AS coupon_name, DATE(bk.booking_date) AS booking_date,
             TIME(bk.booking_date) AS booking_time,
             DATE_FORMAT(bk.booking_release_date,'%Y-%m-%d %H:%i:%s') AS booking_release_date,
             bk.device_type, bk.filter_data,
             cs.status, bkest.booking_estimation_id, bkest.approx_hour_charge, bkest.booking_id,
             bkest.estimated_time, bkest.estimated_distance, bkest.estimateprice_before_discount,
             bkest.discount_price, bkest.estimated_final_price, bkest.estimated_price_before_markup,
             bkest.approx_distance_charge, bkest.approx_after_km, bkest.approx_waiting_charge,
             bkest.approx_waiting_minute, bkest.night_rate_type, bkest.night_rate_value,
             bkest.night_rate_begins, bkest.night_rate_ends, bkest.night_charge_price,
             bkest.premiums_type, bkest.premiums_value, bkest.premiums_price, bkest.extras,
             bkest.extra_price, bkest.peak_time_value, bkest.peak_time_price, bkest.cgst_tax,
             bkest.igst_tax, bkest.sgst_tax, bkest.total_tax_price, bkest.rounding, bkest.level,
             bkest.direction, bkest.created_date, bkest.updated_date, bkest.estimated_final_price AS amount,
             bkest.min_per_km_charge, bkest.min_per_hr_charge,
             CONCAT(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
             bpd.pickup_area, bpd.pickup_address AS departure, bpd.drop_area, bpd.drop_address,
             bpd.adults, bpd.childs, bpd.luggages,
             bpd.pickup_country, bpd.pickup_state, bpd.pickup_city, bpd.pickup_latitude,
             bpd.pickup_longitude, bpd.pickup_zone,
             bpd.drop_date, bpd.drop_time, bpd.drop_country, bpd.drop_state, bpd.drop_city,
             bpd.drop_latitude, bpd.drop_longitude, bpd.drop_zone,
             mc.name AS city_name,
             booking_charges.driver_share_amt, booking_charges.comp_share_amt, booking_charges.partner_share_amt,
             ptr.mmp_txn, ptr.mer_txn, ptr.amt, ptr.prod, ptr.date, ptr.bank_txn, ptr.f_code,
             ptr.bank_name AS bankName, ptr.merchant_id, ptr.udf9, ptr.discriminator, ptr.surcharge,
             ptr.CardNumber, ptr.signature, local_package.name AS local_pkg_name
      FROM booking bk
      JOIN user us ON bk.user_id = us.id
      JOIN user us2 ON bk.client_id = us2.id
      LEFT JOIN user driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id AND vehm.user_id != 0
      LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model vmodel ON vm.id = vmodel.id
      JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
      JOIN master_package mp ON bk.master_package_id = mp.id
      JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
      JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
      JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN booking_estimation bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN payment_transaction_response ptr ON bk.reference_number = ptr.mer_txn
      LEFT JOIN company_setup compset ON bk.company_id = compset.id
      LEFT JOIN master_city mc ON bpd.pickup_city = mc.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      LEFT JOIN local_package ON bk.package_id = local_package.id
      WHERE (bk.status = 22 OR bk.status <= 8)
    `;*/

    let sql = `SELECT COUNT(DISTINCT bk.itinerary_id) AS total_count, bk.itinerary_id, MAX(bk.company_id) AS company_id,
    MAX(compset.com_name) AS domain_name, MAX(compset.driver_min_balance) AS driver_min_balance,
    MAX(bk.driver_id) AS driver_id,  MAX(bk.reference_number) AS ref,  MAX(bk.status_c) AS status_c, MAX(bk.user_id) AS user_id,
    MAX(CONCAT(us.first_name, ' ', us.last_name)) AS user_name, MAX(us.mobile) AS user_mobile, MAX(bk.client_id) AS client_id,
    MAX(CONCAT(us2.first_name, ' ', us2.last_name)) AS clientname, MAX(us2.mobile) AS client_mobile, MAX(us.email) AS user_email,
    MAX(us2.email) AS client_email, MAX(CONCAT(driver.first_name, ' ', driver.last_name)) AS driver_name,
    MAX(driver.gcm_id) AS gcm_id, MAX(vm.vehicle_no) AS vehicle_no, MAX(vmodel.name) AS vehicle_name, MAX(mpm.package_mode) AS package_mode,
    MAX(bk.master_package_id) AS booking_type_id, MAX(mp.name) AS booking_type, MAX(mp.image) AS booking_type_image,
    MAX(mp.icon) AS booking_type_icon, MAX(payty.pay_type_mode) AS charge_type, MAX(mvt.id) AS vehicle_type_id,
    MAX(mvt.category_id) AS vehicle_category_id, MAX(mvt.vehicle_type) AS vehicle, MAX(bk.no_of_vehicles) AS no_of_vehicles,
    MAX(mcoup.name) AS coupon_name, MAX(DATE(bk.booking_date)) AS booking_date, MAX(TIME(bk.booking_date)) AS booking_time,
    MAX(DATE_FORMAT(bk.booking_release_date, '%Y-%m-%d %H:%i:%s')) AS booking_release_date, MAX(bk.device_type) AS device_type,
    MAX(bk.filter_data) AS filter_data, MAX(cs.status) AS status, MAX(bkest.booking_estimation_id) AS booking_estimation_id,
    MAX(bkest.approx_hour_charge) AS approx_hour_charge, MAX(bkest.booking_id) AS estimation_booking_id, MAX(bkest.estimated_time) AS estimated_time,
    MAX(bkest.estimated_distance) AS estimated_distance, MAX(bkest.estimateprice_before_discount) AS estimateprice_before_discount, MAX(bkest.discount_price) AS discount_price,
    MAX(bkest.estimated_final_price) AS estimated_final_price, MAX(bkest.estimated_price_before_markup) AS estimated_price_before_markup,
    MAX(bkest.approx_distance_charge) AS approx_distance_charge, MAX(bkest.approx_after_km) AS approx_after_km, MAX(bkest.approx_waiting_charge) AS approx_waiting_charge,
    MAX(bkest.approx_waiting_minute) AS approx_waiting_minute, MAX(bkest.night_rate_type) AS night_rate_type, MAX(bkest.night_rate_value) AS night_rate_value,
    MAX(bkest.night_rate_begins) AS night_rate_begins, MAX(bkest.night_rate_ends) AS night_rate_ends,MAX(bkest.night_charge_price) AS night_charge_price,
    MAX(bkest.premiums_type) AS premiums_type, MAX(bkest.premiums_value) AS premiums_value, MAX(bkest.premiums_price) AS premiums_price,
    MAX(bkest.extras) AS extras, MAX(bkest.extra_price) AS extra_price, MAX(bkest.peak_time_value) AS peak_time_value, MAX(bkest.peak_time_price) AS peak_time_price,
    MAX(bkest.cgst_tax) AS cgst_tax, MAX(bkest.igst_tax) AS igst_tax, MAX(bkest.sgst_tax) AS sgst_tax, MAX(bkest.total_tax_price) AS total_tax_price,
    MAX(bkest.rounding) AS rounding, MAX(bkest.level) AS level, MAX(bkest.direction) AS direction, MAX(bkest.created_date) AS estimation_created_date,
    MAX(bkest.updated_date) AS estimation_updated_date, MAX(bkest.estimated_final_price) AS amount, MAX(bkest.min_per_km_charge) AS min_per_km_charge,
    MAX(bkest.min_per_hr_charge) AS min_per_hr_charge, MAX(CONCAT(bpd.pickup_date, ' ', bpd.pickup_time)) AS ordertime, MAX(bpd.pickup_area) AS pickup_area,
    MAX(bpd.pickup_address) AS departure, MAX(bpd.drop_area) AS drop_area, MAX(bpd.drop_address) AS drop_address, MAX(bpd.adults) AS adults,
    MAX(bpd.childs) AS childs, MAX(bpd.luggages) AS luggages, MAX(bpd.pickup_country) AS pickup_country, MAX(bpd.pickup_state) AS pickup_state,
    MAX(bpd.pickup_city) AS pickup_city, MAX(bpd.pickup_latitude) AS pickup_latitude, MAX(bpd.pickup_longitude) AS pickup_longitude,
    MAX(bpd.pickup_zone) AS pickup_zone, MAX(bpd.drop_date) AS drop_date, MAX(bpd.drop_time) AS drop_time, MAX(bpd.drop_country) AS drop_country,
    MAX(bpd.drop_state) AS drop_state, MAX(bpd.drop_city) AS drop_city, MAX(bpd.drop_latitude) AS drop_latitude, MAX(bpd.drop_longitude) AS drop_longitude,
    MAX(bpd.drop_zone) AS drop_zone, MAX(mc.name) AS city_name, MAX(booking_charges.driver_share_amt) AS driver_share_amt, MAX(booking_charges.comp_share_amt) AS comp_share_amt,
    MAX(booking_charges.partner_share_amt) AS partner_share_amt, MAX(ptr.mmp_txn) AS mmp_txn, MAX(ptr.mer_txn) AS mer_txn, MAX(ptr.amt) AS amt,
    MAX(ptr.prod) AS prod, MAX(ptr.date) AS payment_date, MAX(ptr.bank_txn) AS bank_txn, MAX(ptr.f_code) AS f_code, MAX(ptr.bank_name) AS bankName,
    MAX(ptr.merchant_id) AS merchant_id, MAX(ptr.udf9) AS udf9, MAX(ptr.discriminator) AS discriminator, MAX(ptr.surcharge) AS surcharge,
    MAX(ptr.CardNumber) AS CardNumber, MAX(ptr.signature) AS signature, MAX(local_package.name) AS local_pkg_name FROM booking bk
          JOIN user us ON bk.user_id = us.id
          JOIN user us2 ON bk.client_id = us2.id
          LEFT JOIN user driver ON bk.driver_id = driver.id
          LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id AND vehm.user_id != 0
          LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
          LEFT JOIN master_vehicle_model vmodel ON vm.id = vmodel.id
          JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
          JOIN master_package mp ON bk.master_package_id = mp.id
          JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
          LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
          JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
          JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
          LEFT JOIN booking_estimation bkest ON bk.booking_id = bkest.booking_id
          LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
          LEFT JOIN payment_transaction_response ptr ON bk.reference_number = ptr.mer_txn
          LEFT JOIN company_setup compset ON bk.company_id = compset.id
          LEFT JOIN master_city mc ON bpd.pickup_city = mc.id
          LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
          LEFT JOIN local_package ON bk.package_id = local_package.id
      WHERE
         (bk.status = 22 OR bk.status <= 8)`;

    if (unassigned_booking === "1") {
      sql += " AND bk.driver_id = 0 AND bk.vendor_id = 0";
    }

    if (preferred_booking) {
      sql += ` AND bk.preferred_booking = "${preferred_booking}"`;
    }

    if (ignition_type_id) {
      sql += ` AND bk.ignition_type_id = ${ignition_type_id}`;
    }

    if (vehicle_type_id) {
      sql += ` AND bk.master_vehicle_type_id <= ${vehicle_type_id}`;
    }

    if (pref_city) {
      sql += ` OR bpd.pickup_city IN (${pref_city})`;
    }

    if (multi_booking_type) {
      sql += ` AND bk.master_package_id IN (${multi_booking_type})`;
    }

    sql +=
      " AND bpd.pickup_date >= CURDATE() GROUP BY bk.itinerary_id ORDER BY MAX(bk.booking_id) DESC";
    const results = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });
    if (isInternalCall) {
      return results;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    }
  } catch (err) {
    if (isInternalCall) {
      throw err;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        err.message
      );
    }
  }
};

const bookingUnassignedDataFilterCount = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  try {
    let {
      searchValue,
      unassigned_booking,
      ignition_type_id,
      vehicle_type_id,
      pref_city,
      multi_booking_type,
      preferred_booking,
    } = isInternalCall ? req : req.body || "";
    let sql = `
      SELECT COUNT(DISTINCT bk.itinerary_id) AS total_count
      FROM booking AS bk
      JOIN user AS us ON bk.user_id = us.id
      JOIN user AS us2 ON bk.client_id = us2.id
      LEFT JOIN user AS driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping AS vehm ON bk.driver_id = vehm.user_id AND vehm.user_id != 0
      LEFT JOIN vehicle_master AS vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model AS vmodel ON vm.id = vmodel.id
      JOIN master_package_mode AS mpm ON bk.master_package_mode_id = mpm.id
      JOIN master_package AS mp ON bk.master_package_id = mp.id
      JOIN master_vehicle_type AS mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon AS mcoup ON bk.coupon_id = mcoup.id
      JOIN cab_status AS cs ON bk.status = cs.status_id AND cs.type = 'cab'
      JOIN payment_type AS payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN booking_estimation AS bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details AS bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN payment_transaction_response AS ptr ON bk.reference_number = ptr.mer_txn
      LEFT JOIN company_setup AS compset ON bk.company_id = compset.id
      LEFT JOIN master_city AS mc ON bpd.pickup_city = mc.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      LEFT JOIN local_package ON bk.package_id = local_package.id
      WHERE (bk.status = 22 OR bk.status <= 8)
    `;

    const replacements = {};

    if (searchValue && searchValue !== "") {
      sql += `
        AND (
          us.first_name LIKE :search
          OR us2.first_name LIKE :search
          OR bk.reference_number LIKE :search
        )
      `;
      replacements.search = `%${searchValue}%`;
    }

    if (unassigned_booking === "1") {
      sql += ` AND bk.driver_id = 0 AND bk.vendor_id = 0`;
    }

    if (preferred_booking && preferred_booking !== "") {
      sql += ` AND bk.preferred_booking = :preferred_booking`;
      replacements.preferred_booking = preferred_booking;
    }

    if (ignition_type_id && ignition_type_id !== "") {
      sql += ` AND bk.ignition_type_id = :ignition_type_id`;
      replacements.ignition_type_id = ignition_type_id;
    }

    if (vehicle_type_id && vehicle_type_id !== "") {
      sql += ` AND bk.master_vehicle_type_id <= :vehicle_type_id`;
      replacements.vehicle_type_id = vehicle_type_id;
    }

    if (pref_city && pref_city !== "") {
      const cityList = pref_city
        .split(",")
        .map((c) => `'${c.trim()}'`)
        .join(",");
      sql += ` OR (bpd.pickup_city IN (${cityList}))`;
    }

    if (multi_booking_type && multi_booking_type !== "") {
      const bookingTypes = multi_booking_type
        .split(",")
        .map((id) => `'${id.trim()}'`)
        .join(",");
      sql += ` AND bk.master_package_id IN (${bookingTypes})`;
    }

    sql += ` AND bpd.pickup_date >= CURDATE() ORDER BY bk.booking_id DESC`;

    const results = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (isInternalCall) {
      return results;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    }
  } catch (err) {
    if (isInternalCall) {
      throw err;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        err.message
      );
    }
  }
};

export const getQuotationByItineraryId = async (req, res) => {
  const itineraryId = req.params.itineraryId;
  if (!itineraryId) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      "Itinerary Id is mandatory"
    );
  }
  try {
    const sql = `
      SELECT
        city1.name AS pick_city_name,
        city2.name AS drop_city_name,
        obd.distance,
        obd.duration,
        obd.days,
        DATE_FORMAT(obd.pickup_date, '%Y-%m-%d') AS pickup_date,
        obd.pickup_address,
        obd.drop_address,
        obd.pickup_time,
        DATE_FORMAT(obd.drop_date, '%Y-%m-%d') AS drop_date,
        obd.drop_time
      FROM quotation_itinerary_details AS obd
      INNER JOIN master_city AS city1 ON obd.pickcity_id = city1.id
      INNER JOIN master_city AS city2 ON obd.dropcity_id = city2.id
      WHERE obd.itinerary_id = :itineraryId
      ORDER BY obd.id ASC
    `;

    const results = await sequelize.query(sql, {
      replacements: { itineraryId }, // ✅ Proper usage of replacements
      type: sequelize.QueryTypes.SELECT,
    });
    if (results.length === 0) {
      return successResponse(res, "No data found", { results: [] });
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    }
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const reserveBooking = async (req, res) => {
  try {
    const user_id = req?.user?.id;
    const { booking_id, driver_id } = req.body;
    const paramVal = {
      booking_id,
      driver_id,
    };
    console.log({ paramVal });
    const checkres = await getAcceptDriverBooking(paramVal, res, true);
    if (checkres && checkres.status === false) {
      return errorResponse(res, checkres.error, 404);
    }
    if (res.headersSent) return;
    const bookingParam = { id: booking_id };
    const bookingData = await bookingListSearch(bookingParam, "", true);
    // bookingData?.driver_id=64;
    // if (bookingData?.driver_id > 0) {
    if (bookingData) {
      const reAssignParam = {
        booking_id: bookingData.id,
        old_driver_id: bookingData.driver_id,
        new_driver_id: driver_id || 64,
        old_cab_status: bookingData.status_id,
        new_cab_status: 3,
        user_id: user_id || 0,
      };
      const reAssignData = await reAssignBooking(reAssignParam, "", true);
    }
    return successResponse(res, MESSAGES.BOOKING.BOOKING_ACCEPTED_SUCCESSFULLY);
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const reAssignBooking = async (req, res, isInternalCall) => {
  try {
    const {
      booking_id,
      old_driver_id,
      new_driver_id,
      old_cab_status,
      new_cab_status,
      user_id,
    } = isInternalCall ? req : req.body;
    const insertedData = await BookingResecReassign.create({
      booking_id,
      old_driver_id,
      new_driver_id,
      old_cab_status,
      new_cab_status,
      created_by: user_id,
    });
    if (isInternalCall) {
      return insertedData;
    } else {
      return successResponse(res, MESSAGES.GENERAL.DATA_ADDED, {
        insertedData,
      });
    }
  } catch (err) {
    if (isInternalCall) {
      throw err;
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        err.message
      );
    }
  }
};

export const deleteRecentlyViewedBooking = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return errorResponse(res, MESSAGES.GENERAL.MANDATORY_FIELD);
    }

    const deletedCount = await RecentlyViewed.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_DELETED, {});
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const changeRecentlyViewedBooking = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || typeof status === "undefined") {
      return errorResponse(res, MESSAGES.GENERAL.MANDATORY_FIELD);
    }

    const [updatedCount] = await RecentlyViewed.update(
      { status: !status },
      { where: { id } }
    );

    if (updatedCount === 0) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {});
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

const addBookingData = async (req, res) => {
  try {
    const {
      company_id,
      itinerary_id,
      agent_reference,
      booking_status,
      user_id,
      client_id,
      package_id: local_package_id,
      master_package_mode_id,
      driver_id,
      coupon_code_id,
      route_id,
      csr_id,
      no_of_vehicles,
      flight_number,
      flight_time,
      airport,
      master_package_type,
      module_type = "",
      vehicle_type_id,
      base_vehicle_id,
      device_type,
      sac_code_id,
      sac_code,
      sac_description,
      reschedule_date,
      booking_auto_relasedate,
      remark,
      booked_by_name,
      booked_by_contact,
      created_date,
      charge_type,
      filter_data,
      placcard_name,
      pickup_point,
      local_pickup,
      created_by,
    } = req.body;
    const pickup_type = local_pickup || "";

    const bookingPayload = {
      company_id,
      itinerary_id,
      agent_reference,
      status: booking_status,
      user_id,
      client_id,
      package_id: local_package_id,
      master_package_mode_id,
      driver_id,
      coupon_id: coupon_code_id,
      route_id,
      csr_id,
      no_of_vehicles,
      flight_number,
      flight_time,
      airport,
      master_package_id: master_package_type,
      outstation_module_type: module_type,
      master_vehicle_type_id: vehicle_type_id,
      base_vehicle_id,
      device_type,
      sac_code_id,
      sac_code,
      sac_description,
      reschedule_date,
      booking_release_date: booking_auto_relasedate,
      remark,
      booking_date: created_date,
      charge_type,
      filter_data,
      created_date,
      placcard_name,
      pickup_point,
      pickup_type,
      created_by,
      booked_by_name,
      booked_by_contact,
    };

    // Remove empty or undefined fields
    Object.keys(bookingPayload).forEach(
      (key) =>
        (bookingPayload[key] === undefined || bookingPayload[key] === "") &&
        delete bookingPayload[key]
    );

    const createdBooking = await Booking.create(bookingPayload);

    return createdBooking;
    // successResponse(res,MESSAGES.BOOKING.BOOKING_ADDED,createdBooking,201)
  } catch (error) {
    console.error("Error creating booking:", error);
    return errorResponse;
  }
};

const addbookingEstimation = async (req, res, internal = true) => {
  try {
    let user_markup = req.body.user_markup || 0.0;
    let service_charge = req.body.service_charge || 0.0;
    let state_tax = req.body.state_tax || 0.0;
    let toll_tax = req.body.toll_tax || 0.0;
    let user_markup_amount = req.body.user_markup_amount || "";
    let extra_price = 0;
    if (req.body.master_package_type == 6) {
      let extra_price = 0;
    } else {
      extra_price = Number(
        req.body.extra_price +
          Number(service_charge) +
          Number(state_tax) +
          Number(toll_tax)
      );
    }
    service_charge = user_markup_amount + "," + service_charge;
    let insertValues = {
      booking_id: req.body.insertId,
      estimated_time: req.body.estimated_time,
      estimated_distance: req.body.estimated_distance,
      estimateprice_before_discount: req.body.total_price,
      discount_price: req.body.total_discount,
      service_charge: service_charge,
      state_tax: req.body.state_tax,
      toll_tax: req.body.toll_tax,
      user_markup: user_markup,
      booking_amt_percentage: req.body.booking_amt_percentage,
      estimated_final_price: req.body.total_charge,
      estimated_price_before_markup: req.body.estimated_price_before_markup,
      approx_distance_charge: req.body.per_km_price,
      minimum_charge: req.body.base_fare,
      approx_after_km: req.body.min_distance,
      approx_after_hour: req.body.min_pkg_hr,
      approx_hour_charge: req.body.per_hr_charge || 0,
      approx_waiting_charge: req.body.approx_waiting_charge,
      approx_waiting_minute: req.body.approx_waiting_minute,
      night_rate_type: req.body.night_rate_type,
      night_rate_value: req?.body.night_rate_value,
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
      cgst_tax: req.body.cgst_tax,
      igst_tax: req.body.igst_tax,
      sgst_tax: req.body.sgst_tax,
      total_tax_price: req.body.tax_price,
      currency_id: req.body.currency_type,
      coupon_type: req.body.coupon_discount_type,
      package_id: req?.body?.package,
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
    console.log({ insertValues });
    let createdBookingEstimate = await BookingEstimation.create(insertValues);
    if (internal) return createdBookingEstimate;
    if (!res) return;
    return successResponse(
      res,
      MESSAGES.BOOKING.BOOKING_ADDED,
      createdBookingEstimate,
      201
    );
  } catch (error) {
    console.error(error);
    errorResponse(res, MESSAGES.GENERAL.SOMETHING_WENT_WRONG, error, 500);
  }
};

const addBookingPickDrop = async (req, res, isInternal = true) => {
  try {
    let insertValues = {
      booking_id: req.body.insertId,
      adults: req.body.adults,
      childs: req.body.children,
      luggages: req.body.luggages,
      smallluggage: req.body.smallluggage || 0,
      //"infants": req.body.infant,
      //"sr_citizens": req.body.sr_citizen,
      pickup_date: dateFormat(req.body?.from||req.body.pickup_date, "yyyy-mm-dd"),
      pickup_time: req.body.pickup_time,
      pickup_area: req.body.pickup_area,
      pickup_address: req.body.pickup_address,
      pickup_country: req.body.pickup_country,
      pickup_state: req.body.pickup_state,
      pickup_city: req.body.pickup_city,
      //"pickup_landmark"	: req.body.pickup_landmark,
      pickup_latitude: req.body.pickup_latitude,
      pickup_longitude: req.body.pickup_longitude,
      pickup_zone: req.body.pickup_zone,
      drop_date: req.body?.to||req.body.drop_date, //dateFormat(new Date(req.body.drop_date),"yyyy-mm-dd"),
      drop_time: req.body.drop_time,
      drop_area: req.body.drop_area,
      drop_address: req.body.drop_address,
      drop_country: req.body.drop_country,
      drop_state: req.body.drop_state,
      drop_city: req.body.drop_city,
      //"drop_landmark"       : req.body.drop_landmark,
      drop_latitude: req.body.drop_latitude,
      drop_longitude: req.body.drop_longitude,
      drop_zone: req.body.drop_zone,
      created_date: req.body.created_date,
    };
    console.log({ insertValues });
    const result = await BookingPickDropDetails.create(insertValues);
    if (isInternal) return result;
    return successResponse(res, MESSAGES.BOOKING.BOOKING_ADDED, result, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

const addSightSeeingDetails = async (req, res) => {
  try {
    const { booking_id, sightseeing_id, created_date, ip } = req.body;

    const insertValues = {
      booking_id,
      sightseeing_id,
      created_date,
      ip,
    };

    const result = await SightSeeingBookingDetails.create(insertValues);
    return successResponse(res, MESSAGES.BOOKING.BOOKING_ADDED, result, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

const addTravellerDetails = async (req, r) => {
  try {
    const { booking_id, name, dob, age, created_date, ip } = req.body;

    const insertValues = {
      booking_id,
      name,
      dob,
      age,
      created_date,
      ip,
    };

    const result = await TravellerDetails.create(insertValues);
    return successResponse(res, MESSAGES.BOOKING.BOOKING_ADDED, result, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

const addUserCouponApply = async (req) => {
  try {
    let couponVal = {
      master_coupon_id: req.body.coupon_id,
      user_id: req.body.user_id,
      device_type: req.body.device_type,
      app_type: req.body.app_type,
    };
    const couponStatistics = await CouponStatistics.create(couponVal);
    return couponStatistics;
  } catch (error) {
    console.error(error);
    return error;
  }
};
const addPickupLocation = async (req, res) => {
  try {
    let insertValues = {
      country_id: req.body.country_id,
      state_id: req.body.state_id,
      city_id: req.body.city_id,
      area: req.body.area,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };
    let result = await MasterLocation.create(insertValues);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};
const addDropLocation = async (req) => {
  try {
    const dropAreaVal = {
      country_id:
        req.body.drop_country || req.body.pickup_country || req.body.country_id,
      state_id: req.body.drop_state,
      city_id: req.body.drop_city,
      latitude: req.body.drop_latitude,
      longitude: req.body.drop_longitude,
      area: req.body.drop_area,
      zone: req.body.drop_zone,
    };

    Object.keys(dropAreaVal).forEach((key) => {
      if (dropAreaVal[key] === undefined || dropAreaVal[key] === "") {
        delete dropAreaVal[key];
      }
    });

    const result = await MasterLocation.create(dropAreaVal);
    return { status: "success", data: result };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const addPickupAddress = async (req) => {
  try {
    const pickupAreaVal = {
      country_id: req.body.country_id,
      state_id: req.body.state_id,
      city_id: req.body.city_id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      area: req.body.area,
      zone: req.body.zone,
    };

    Object.keys(pickupAreaVal).forEach((key) => {
      if (pickupAreaVal[key] === undefined || pickupAreaVal[key] === "") {
        delete pickupAreaVal[key];
      }
    });

    const [record, created] = await MasterAddress.findOrCreate({
      where: {
        address: pickupAreaVal.address || "Not Available",
      },
      defaults: pickupAreaVal,
    });
    return { status: "success", data: record || created };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
const addDropAddress = async (req) => {
  try {
    const dropAddrVal = {
      country_id: req.body.country_id,
      state_id: req.body.drop_state,
      city_id: req.body.drop_city,
      latitude: req.body.drop_latitude,
      longitude: req.body.drop_longitude,
      address: req.body.drop_address,
      zone: req.body.drop_zone,
    };

    Object.keys(dropAddrVal).forEach((key) => {
      if (dropAddrVal[key] === undefined || dropAddrVal[key] === "") {
        delete dropAddrVal[key];
      }
    });
    const [record, created] = await MasterAddress.findOrCreate({
      where: {
        address: dropAddrVal.address || "Not Available",
      },
      defaults: dropAddrVal,
    });

    return record || created;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const addBookingMarkup = async (req) => {
  try {
    const valArr = JSON.parse(req.body.user_markup);
    let result = null;
    if (valArr.length > 0) {
      const insertData = valArr.map((item) => ({
        booking_id: req.body.insertId,
        user_id: item.created_by,
        markup_amt_base: item.markup_amt_base,
        mark_amt_type: item.mark_amt_type,
        basic_amt: item.basic_amt,
        extra_km_markup: item.extra_km_markup,
        extra_hr_markup: item.extra_hr_markup,
        markup_amount: item.markup_amount,
        markup_cgst_amount: req.body.markup_cgst_amount,
        markup_igst_amount: req.body.markup_igst_amount,
        markup_sgst_amount: req.body.markup_sgst_amount,
        markup_cgst: req.body.markup_cgst,
        markup_igst: req.body.markup_igst,
        markup_sgst: req.body.markup_sgst,
        created_date: req.body.created_date,
      }));

      result = await BookingMarkup.bulkCreate(insertData);
    }
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const updatebookingReferenceNo = async function (req) {
  try {
    const booking_id = req.body.insertId;
    const company_id = req.body.company_id;

    const compresult = await companyInfo(company_id);
    if (compresult) {
      const companyData = compresult;
      let booking_prefix;

      if (req.body.booking_status == 22) {
        booking_prefix = companyData.hold_prefix;
      } else if (req.body.booking_status == 27) {
        booking_prefix = companyData.quote_prefix;
      } else {
        booking_prefix = companyData.booking_prefix;
      }

      const booking_ref_no = getBookingRefNo(booking_id, booking_prefix);

      const [affectedRows] = await Booking.update(
        { reference_number: booking_ref_no },
        { where: { booking_id } }
      );

      if (affectedRows === 1) {
        const sendmailParam = { booking_id };
        bookingConfirmationEmail(sendmailParam);

        return { message: "updated successfully", status: true };
      } else {
        return { message: "No record updated", status: false };
      }
    } else {
      throw new Error("Company information not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteBookingQuotation = async (req) => {
  try {
    const { quotation_id } = req;
    if (!quotation_id) {
      throw new Error("Quotation ID is required");
    }

    const result = await Quotation.destroy({
      where: { id: quotation_id },
    });

    if (result === 1) {
      return { message: "Deleted successfully", status: true };
    } else {
      return { message: "No record deleted", status: false };
    }
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const addBookingRegisterLog = async (req) => {
  try {
    const AddBookRegisterVal = {
      bookingid: req.body.insertId,
      driverId: req.body.user_id,
      status: "REG",
      type: "Booking created",
      updateOn: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    };

    Object.keys(AddBookRegisterVal).forEach((key) => {
      if (
        AddBookRegisterVal[key] === undefined ||
        AddBookRegisterVal[key] === ""
      ) {
        delete AddBookRegisterVal[key];
      }
    });

    const result = await BookingRegistered.create(AddBookRegisterVal);
    return { status: "success", data: result };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
export const addBookingStackData = async (req) => {
  try {
    const AddBookRegisterVal = {
      booking_id: req.body.insertId,
      latitude: req.body.pickup_latitude,
      longitude: req.body.pickup_longitude,
      status: "W",
      last_try: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    };

    Object.keys(AddBookRegisterVal).forEach((key) => {
      if (
        AddBookRegisterVal[key] === undefined ||
        AddBookRegisterVal[key] === ""
      ) {
        delete AddBookRegisterVal[key];
      }
    });

    const result = await BookingStack.create(AddBookRegisterVal);
    return { status: "success", data: result };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const addBookingTrackerData = async (req) => {
  try {
    const AddBookRegisterVal = {
      BookingID: req.body.insertId,
      Latitutude: req.body.pickup_latitude,
      Logitude: req.body.pickup_longitude,
      Date_Time: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      CabStatus: req.body.booking_status || 1,
    };

    Object.keys(AddBookRegisterVal).forEach((key) => {
      if (
        AddBookRegisterVal[key] === undefined ||
        AddBookRegisterVal[key] === ""
      ) {
        delete AddBookRegisterVal[key];
      }
    });

    const result = await BookingTracker.create(AddBookRegisterVal);
    return { status: "success", data: result };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

// addbookingquotationasync
export const finalquotationBooking = async (req, res, isInternal = true) => {
  try {
    const responsedata = await copyBookingData(req.body);
    deductWallet(req.user.id, req.body.booking_amt_paid);

    if (responsedata.booking_id) {
      req.body.insertId = responsedata.booking_id;
      console.log("responsedataBookingreq", req.body.insertId);

      var estimationRespdata = await copyBookingEstimationData(req.body);

      var pickdropResp = await copybookingPickDropData(req.body);

      var itinearyDetailsResp = await copyItineraryData(req.body);

      if (
        typeof req.body.user_markup !== "undefined" &&
        req.body.user_markup !== ""
      ) {
        //var markupresp = await Booking.addBookingMarkup(req);
        var markupresp = await copybookingMarkupData(req.body);
      }
      var updateBookingRefResp = await updatebookingReferenceNo(req);
      if (
        typeof req.body.quotation_id !== "undefined" &&
        req.body.quotation_id != ""
      ) {
        var deleteBookingQuotation = await deleteBookingQuotation(req.body);
      }

      await addBookingRegisterLog(req); // Booking Register in log
    }

    return successResponse(
      res,
      MESSAGES.BOOKING.BOOKING_ADDED,
      responsedata,
      201
    );
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};
const addbookingasync_new = async function (req, res) {
  try {
    let responsedata = await addBookingData(req);

    let insertId;
    if (responsedata.booking_id) {
      insertId = responsedata.booking_id;
      req.body.insertId = insertId;
    }

    await addbookingEstimation(req, res, true);

    if (req.master_package_type == 2) {
      req.drop_address = req.drop_area;
    }

    if (req.master_package_type == 4 || req.master_package_type == 5) {
      req.pickup_area = " ";
      req.drop_area = " ";
    }

    /* Fare mode is point-to-point drop location will be pickup address and charge will be both side in Locahire Package */
    if (
      (req.dispatch_type == 1 || req.dispatch_type == 2) &&
      req.master_package_type == 1
    ) {
      req.drop_area = req.pickup_area;
      req.drop_address = req.pickup_address;
      req.drop_latitude = req.pickup_latitude;
      req.drop_longitude = req.pickup_longitude;
    }

    await addBookingPickDrop(req, res, true);

    if (typeof req.coupon_code_id != "undefined" && req.coupon_code_id != "") {
      await addUserCouponApply(req);
    }

    if (
      typeof req.sightseeing_details !== "undefined" &&
      req.sightseeing_details != ""
    ) {
      await addSightSeeingDetails(req);
    }

    if (
      typeof req?.body?.travellerDetails !== "undefined" &&
      req?.body?.travellerDetails != ""
    ) {
      //console.log(req.travellerDetails); //return true;
      var ss_traveller_resp1 = await addMultiBookingTravellerDetail(req);
    } else {
      if (typeof req.first_name !== "undefined" && req.first_name != "") {
        var ss_traveller_resp1 = await addBookingTravellerDetails(req);
      }
    }

    if (
      typeof req.sightseeing_traveller_details !== "undefined" &&
      req.sightseeing_traveller_details != ""
    ) {
      await addSightSeeingTravellerDetail(req);
    }

    if (typeof req.pickup_area !== "undefined" && req.pickup_area != "") {
      await addPickupLocation(req);
    }

    if (typeof req.drop_area !== "undefined" && req.drop_area != "") {
      await addDropLocation(req);
    }

    if (typeof req.pickup_address !== "undefined" && req.pickup_address != "") {
      await addPickupAddress(req);
    }

    if (typeof req.drop_address !== "undefined" && req.drop_address != "") {
      await addDropAddress(req);
    }

    if (typeof req.user_markup !== "undefined" && req.user_markup !== "") {
      await addBookingMarkup(req);
    }

    await updatebookingReferenceNo(req);

    if (typeof req.quotation_id !== "undefined" && req.quotation_id != "") {
      await deleteBookingQuotation(req);
    }

    await addBookingRegisterLog(req); // Booking Register in log
    await addBookingLogsData(req); // Booking Register in log
    await addBookingStackData(req); // Booking Register in log
    await addBookingTrackerData(req); // Booking Register in log
    return responsedata;
  } catch (err) {
    console.log(err);
  }
};
export const getShoppingCartCount = async function (req, res) {
  try {
    const { itinerary_id, user_id } = req.body;

    if (!itinerary_id || !user_id) {
      return errorResponse(
        res,
        "itienary ID and user ID are required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const result = await Quotation.count({
      where: {
        itinerary_id,
        user_id,
        status: 28,
      },
    });

    if (result > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_FETCHED,
        { count: result },
        200
      );
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        result,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

export const getItineraryShoppingCartCount = async (req, res) => {
  try {
    const { status, user_id } = req.body;

    if (!status || !user_id) {
      return errorResponse(
        res,
        "Status and user ID are required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const result = await Quotation.count({
      where: {
        status,
        user_id,
      },
    });

    if (result > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_FETCHED,
        { count: result },
        200
      );
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        { count: 0 },
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const deleteShoppingCartQuotation = async (req, res) => {
  try {
    const { quotation_id } = req.query;

    if (!quotation_id) {
      return errorResponse(
        res,
        "Quotation ID is required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const result = await Quotation.destroy({
      where: { booking_id: quotation_id },
    });

    if (result > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_DELETED,
        { status: "success" },
        200
      );
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        { status: "failed", error: "No Record Found" },
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const addCartToQuotation = async (req, res) => {
  try {
    const { itinerary_id, status } = req.body;
    console.log({ itinerary_id, status });
    if (!itinerary_id || !status) {
      return errorResponse(
        res,
        "Itinerary ID and status are required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const affectedRows = await Quotation.update(
      { status: String(status) },
      { where: { itinerary_id } }
    );
    console.log({ affectedRows });
    if (affectedRows > 0) {
      return successResponse(
        res,
        "Quotation Updated Successfully",
        { status: "success" },
        200
      );
    } else {
      return errorResponse(
        res,
        "Some Internal Error Occurred",
        { status: "failed" },
        STATUS_CODE.SERVER_ERROR
      );
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const discardShoppingCartQuotation = async (req, res) => {
  try {
    const { itinerary_id } = req.body;
    console.log(req.user, "klklkl");
    let user_id = req.user.id;
    if (!itinerary_id || !user_id) {
      return errorResponse(
        res,
        "Itinerary ID and User ID are required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const result = await Quotation.destroy({
      where: {
        itinerary_id,
        user_id,
        status: 28,
      },
    });

    if (result > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_DELETED,
        { status: "success" },
        200
      );
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        { status: "failed", error: "No Record Found" },
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getItineraryDetails = async (req, res) => {
  try {
    const { itinerary_id, user_id, auto_id } = req.body;

    let sqlQuery = `
      SELECT 
        qi.*, 
        q.reference_number AS ref, 
        mc.name AS pickup_city, 
        mc1.name AS drop_city 
      FROM 
        quotation_itinerary_details AS qi 
      LEFT JOIN 
        master_city AS mc ON qi.pickcity_id = mc.id 
      LEFT JOIN 
        master_city AS mc1 ON qi.dropcity_id = mc1.id 
      LEFT JOIN 
        quotation AS q ON qi.booking_id = q.booking_id 
      WHERE 
        1=1
    `;

    if (itinerary_id) {
      sqlQuery += ` AND qi.itinerary_id = :itinerary_id `;
    }

    if (auto_id) {
      sqlQuery += ` AND qi.id = :auto_id `;
    }

    const results = await sequelize.query(sqlQuery, {
      replacements: { itinerary_id, auto_id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results[0]);
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        { status: "failed", error: "No Record Found" },
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const generateCard = async (req, res) => {
  try {
    const { booking_id } = req.body;

    const bookingData = await Booking.findOne({
      where: { id: booking_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name", "email", "mobile"],
        },
        {
          model: Client,
          as: "client",
          attributes: ["id", "name", "mobile"],
        },
        {
          model: CompanySetup,
          as: "company",
          attributes: [
            "com_name",
            "site_url",
            "email",
            "mobile",
            "phone",
            "gst_no",
            "pan_no",
            "comp_address",
            "bank_name",
            "ac_holder_name",
            "branch",
            "ifsc_code",
            "account_no",
          ],
        },
      ],
    });

    if (!bookingData) {
      return errorResponse(res, "Booking not found", {}, STATUS_CODE.NOT_FOUND);
    }

    const {
      user,
      client,
      company,
      reference_number,
      ordertime,
      booking_date,
      estimated_final_price,
      departure,
      drop_address,
      gst_registration_number,
      vehicle,
      adults,
      childs,
      luggages,
      minimum_charge,
      night_rate_begins,
      night_rate_ends,
      night_charge_price,
      premiums_price,
      extra_price,
      peak_time_price,
      discount_price,
      cgst_tax,
      sgst_tax,
      igst_tax,
      total_tax_price,
      remark,
    } = bookingData;

    const pickupDate = dateFormat(ordertime, "yyyy-mm-dd");
    const pickupTime = dateFormat(ordertime, "HH:MM:ss");
    const bookingDate = dateFormat(booking_date, "yyyy-mm-dd");
    const bookingTime = dateFormat(booking_date, "HH:MM");

    const bookingHoldParams = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      mobile_no: user.mobile,
      client_name: client.name,
      client_mobile: client.mobile,
      booking_ref_no: reference_number,
      estimated_price: estimated_final_price,
      booking_date: bookingDate,
      booking_time: bookingTime,
      pickup_address: departure,
      drop_address: drop_address,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      vehicle_type: vehicle,
      adults,
      childs,
      luggage: luggages,
      base_fare: minimum_charge,
      night_rate_begins,
      night_rate_ends,
      night_charge: night_charge_price,
      premiums_price,
      extra_price,
      peak_time_price,
      discount: discount_price,
      cgst_tax,
      sgst_tax,
      igst_tax,
      total_tax_price,
      remark,
      company_name: company.com_name,
      company_address: company.comp_address,
      company_phone: company.phone,
      company_mobile: company.mobile,
      company_gst_no: company.gst_no,
      company_pan_no: company.pan_no,
      company_bank_name: company.bank_name,
      company_ac_holder_name: company.ac_holder_name,
      company_account_branch: company.branch,
      company_ifsc_code: company.ifsc_code,
      company_account_no: company.account_no,
    };

    // Generate placard PDF
    const pdfResult = await generatePlacCardPdf({
      template_name: "plac_card",
      template_param: bookingHoldParams,
      file_name: `plac_card_${reference_number}`,
    });

    return successResponse(res, "Placard generated successfully", pdfResult);
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const generateDutySlipTemplate = async (req, res) => {
  try {
    const booking_id = req.body.booking_id;

    const bookingResult = bookingListSearch({ booking_id });

    if (!bookingResult)
      return res
        .status(404)
        .json({ status: "error", message: "Booking not found" });

    const bookingData = bookingResult;
    const { user_id, client_id } = bookingData;

    const users = await User.findAll({
      where: { id: [user_id, client_id] },
      include: [
        {
          model: CompanySetup,
          required: false,
        },
        {
          model: Company,
          required: false,
        },
        {
          model: UserUploadDocument,
          where: { document_type_id: 22, doc_default_status: 1 },
          required: false,
        },
      ],
    });

    if (!users.length)
      return res
        .status(404)
        .json({ status: "error", message: "Related users not found" });

    const userData = users[0]; // prioritize user_id entry

    let company_logo =
      process.env.B2B_URL + "images/logo-emailer-bookingcabs.png";
    if (
      userData.user_type_id === 7 &&
      userData.UserUploadDocuments?.[0]?.doc_file_upload
    ) {
      company_logo = `${process.env.B2B_UPLOAD_URL}${user_id}/${userData.UserUploadDocuments[0].doc_file_upload}`;
    }

    const bookingHoldParams1 = {
      first_name: bookingData.first_name,
      last_name: bookingData.last_name,
      email: bookingData.email,
      mobile_no: bookingData.user_mobile,
      alt_mobile_no: bookingData.user_alt_mobile,
      agent_reference: bookingData.agent_reference,
      gst_no: bookingData.gst_registration_number,
      nationality: bookingData.user_nationality,
      booking_ref_no: bookingData.ref,
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
        Number(bookingData.night_charge_price) +
        Number(bookingData.peak_time_price) +
        Number(bookingData.premiums_price) +
        Number(bookingData.extra_price),
      running_amount:
        Number(bookingData.minimum_charge) +
        Number(bookingData.night_charge_price) +
        Number(bookingData.peak_time_price) +
        Number(bookingData.premiums_price) +
        Number(bookingData.extra_price),
      cgst_tax: bookingData.cgst_tax,
      cgst_value: Math.floor(
        (Number(bookingData.estimated_final_price) *
          Number(bookingData.cgst_tax)) /
          100
      ),
      sgst_tax: bookingData.sgst_tax,
      sgst_value: Math.floor(
        (Number(bookingData.estimated_final_price) *
          Number(bookingData.sgst_tax)) /
          100
      ),
      igst_tax: bookingData.igst_tax,
      igst_value: Math.floor(
        (Number(bookingData.estimated_final_price) *
          Number(bookingData.igst_tax)) /
          100
      ),
      total_tax_price: bookingData.total_tax_price,
      amount_in_world: NumInWords(Number(bookingData.estimated_final_price)), // helper function
      remark: bookingData.remark,
      company_logo,
      company_gst_no:
        userData.Company?.service_tax_gst ||
        userData.CompanySetup?.gst_no ||
        "",

      user_bank_name: bookingData.user_bank_name,
      user_ac_no: bookingData.user_ac_no,
      user_ifsc_code: bookingData.user_ifsc_code,
      user_ac_holder: bookingData.user_beneficiary_name,
      user_bank_branch: bookingData.user_bank_branch,

      user_com_name:
        userData.Company?.company_name || userData.CompanySetup?.com_name,
      user_com_address:
        userData.Company?.company_address ||
        userData.CompanySetup?.company_address,
      user_comp_phone:
        userData.Company?.landline_no || userData.CompanySetup?.comp_phone,
      user_comp_mobile:
        userData.Company?.mobile_no || userData.CompanySetup?.comp_mobile,
      user_contact_person_name:
        userData.Company?.contact_person_name ||
        userData.CompanySetup?.first_name,
      user_pan_no:
        userData.Company?.pancard_no || userData.CompanySetup?.pan_no,
      user_email: userData.Company?.email || userData.email,
      user_website_url:
        userData.Company?.website_url || userData.CompanySetup?.site_url,
      user_gst_no: userData.Company?.service_tax_gst || "",

      booking_status: bookingData.status,
      itinerary_no: bookingData.itinerary_id,
      cancellation_rule: bookingData.booking_cancellation_rule || "{}",
      invoice_no: "",
      company_bank_name: userData.CompanySetup?.bank_name,
      company_ac_holder_name: userData.CompanySetup?.ac_holder_name,
      company_account_branch: userData.CompanySetup?.branch,
      company_ifsc_code: userData.CompanySetup?.ifsc_code,
      company_account_no: userData.CompanySetup?.account_no,
      flight_number: bookingData.flight_number,
      flight_time: bookingData.flight_time,
      user_com_city: bookingData.city_name,
      user_com_state: bookingData.state_name,
      user_com_pincode: bookingData.pincode,
      booking_type: bookingData.booking_type,
      booking_vehicle: bookingData.vehicle,
      driver_name: bookingData.driver_name,
      vehicle_no: bookingData.vehicle_no,
      comp_name: req.body.company,
      sac_code: bookingData.sac_code,
      sac_description: bookingData.sac_description,
    };

    await generatePdf({
      template_name: "duty_slip",
      template_param: bookingHoldParams1,
      file_name: `duty_slip_${bookingData.ref}`,
    });

    return successResponse(
      res,
      "Duty slip generated successfully",
      { status: "success" },
      200
    );
  } catch (err) {
    console.error("Error generating duty slip:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { booking_id, status } = req.body;

    if (!booking_id || status === undefined) {
      return errorResponse(
        res,
        "Booking ID and status are required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const bookingData = await Booking.findOne({
      where: { booking_id: booking_id },
    });

    if (!bookingData) {
      return errorResponse(res, "Booking not found", {}, STATUS_CODE.NOT_FOUND);
    }
    console.log({ bookingData });
    const client_mobile = bookingData.client_mobile;
    const client_name = bookingData.client_name;
    const client_email = bookingData.client_email;
    const booking_reference = bookingData.id;
    let pickupdatetime;
    let pickupData = await BookingPickDropDetails.findOne({
      where: { booking_id: booking_id },
    });
    if (pickupData.pickupdate && pickupData.pickuptime) {
      pickupdatetime = dateFormat(
        `${pickupData.pickupdate} ${pickupData.pickuptime}`,
        "dd-mm-yyyy HH:MM:ss"
      );
    } else {
      pickupdatetime = dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss");
    }
    const vehicle_no = bookingData.vehicle_no;
    const driver_name = bookingData.driver_name;
    const driver_mobile = bookingData.driver_mobile;

    const [affectedRows] = await Booking.update(
      { status },
      { where: { booking_id: booking_id } }
    );

    if (affectedRows > 0) {
      const smsTemplate = await sequelize.query(
        `SELECT * FROM sms_template WHERE msg_sku = :msg_sku AND is_active = 1 LIMIT 1`,
        {
          replacements: { msg_sku: status === 5 ? "reporting" : "accept" },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (smsTemplate.length > 0) {
        let smsMessage = smsTemplate[0].message;

        if (status === 5) {
          smsMessage = smsMessage.replace("{#username#}", client_name);
          smsMessage = smsMessage.replace("{#cab_no#}", vehicle_no);
          smsMessage = smsMessage.replace(
            "{#mobile#}",
            constants.COMPANY_PHONE_NO
          );

          const smsParams = { username: client_name, cab_no: vehicle_no };
          await sendTemplatedSMS({
            to: client_mobile,
            msg_sku: "reporting",
            variables: smsParams,
          });

          const mailParams = {
            username: client_name,
            booking_ref_no: booking_reference,
            pickup_time: pickupdatetime,
            vehicle_no,
            date: dateFormat(new Date(), "dd-mm-yyyy"),
            company_logo: "",
          };
          await transactionMail({
            to: client_email,
            template_name: "vehilce_reported",
            mailParams,
          });
        } else if (status === 3) {
          smsMessage = smsMessage
            .replace("{#username#}", client_name)
            .replace("{#driver_name#}", driver_name)
            .replace("{#driver_mobile#}", driver_mobile)
            .replace("{#vehicle_no#}", vehicle_no)
            .replace("{#booking_ref_no#}", booking_reference)
            .replace("{#pickup_time#}", pickupdatetime)
            .replace("{#mobile_no#}", constants.COMPANY_PHONE_NO);

          const smsParams = {
            username: client_name,
            driver_name,
            driver_mobile,
            vehicle_no,
            booking_ref_no: booking_reference,
            pickup_time: pickupdatetime,
            mobile_no: constants.COMPANY_PHONE_NO,
          };
          await sendTemplatedSMS({
            to: client_mobile,
            msg_sku: "accept",
            variables: smsParams,
          });
        }
      }

      return successResponse(res, "Status Updated Successfully");
    } else {
      return errorResponse(
        res,
        "Some Internal Error Occurred",
        {},
        STATUS_CODE.SERVER_ERROR
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
export const bookingListSearchDataListCount = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT COUNT(DISTINCT bk.itinerary_id) AS total_count, 
        bk.booking_id AS id,
        bk.base_vehicle_id AS base_vehicle_id,
        bk.sac_code AS sac_code,
        bk.sac_description AS sac_description,
        bk.flight_number AS flight_number,
        bk.flight_time AS flight_time,
        bk.itinerary_id AS itinerary_id,
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
        bk.status AS status_id,
        bk.user_id,
        us.first_name,
        us.last_name,
        CONCAT(us.first_name, ' ', us.last_name) AS user_name,
        us.email,
        us.mobile AS user_mobile,
        master_country.name AS user_nationality,
        user_info.alternate_mobile AS user_alt_mobile,
        user_info.gst_registration_number,
        cab_status.status AS driver_status,
        bk.client_id,
        CONCAT(us2.first_name, ' ', us2.last_name) AS clientname,
        us2.mobile AS client_mobile,
        us2.email AS client_email,
        us3.alternate_mobile AS client_alt_mobile,
        bk.driver_id,
        CONCAT(driver.first_name, ' ', driver.last_name) AS driver_name,
        driver.mobile,
        driver.duty_status,
        dmvt.vehicle_type AS driver_vehicle_type,
        dmvt.category_id AS vehicle_category_id,
        bank_details.name AS bank_name,
        bank_details.ac_no AS account_no,
        bank_details.ifsc_code,
        bank_details.ac_holder_name,
        bank_details.branch,
        user_bank_detail.name AS user_bank_name,
        user_bank_detail.ac_no AS user_ac_no,
        user_bank_detail.ifsc_code AS user_ifsc_code,
        user_bank_detail.ac_holder_name AS user_beneficiary_name,
        bank_details.branch AS user_bank_branch,
        ucompany.company_name,
        ucompany.mobile_no,
        ucompany.landline_no,
        compset.gst_no,
        user_company.service_tax_gst,
        vm.vehicle_no,
        vm.model AS year,
        vm.color,
        vmodel.name AS vehicle_name,
        mpm.package_mode AS package_mode,
        bk.master_package_id AS booking_type_id,
        mp.name AS booking_type,
        mp.image AS booking_type_image,
        mp.icon AS booking_type_icon,
        payty.pay_type_mode AS charge_type,
        mvt.vehicle_type AS vehicle,
        bk.no_of_vehicles AS no_of_vehicles,
        mcoup.name AS coupon_name,
        DATE(bk.booking_date) AS booking_date,
        TIME(bk.booking_date) AS booking_time,
        bk.device_type,
        DATE_FORMAT(bk.booking_release_date, '%Y-%m-%d %H:%i:%s') AS booking_release_date,
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
        bkest.service_charge AS service_charge,
        bkest.booking_cancellation_rule,
        bkest.service_charge_cgst_amount,
        bkest.service_charge_igst_amount,
        bkest.service_charge_sgst_amount,
        bkest.service_charge_cgst,
        bkest.service_charge_igst,
        bkest.service_charge_sgst,
        bkest.service_charge_sac_code_id,
        bkest.service_charge_sac_code,
        service_charge_sac_code_description,
        CONCAT(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
        bpd.pickup_area AS pickup_area,
        bpd.pickup_date,
        bpd.pickup_time,
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
        (bkest.estimated_final_price - ut.amount) AS booking_amt_balance,
        pt.pay_type_mode AS payment_type,
        mcity.name AS city_name,
        booking_charges.driver_share_amt,
        booking_charges.comp_share_amt,
        booking_charges.partner_share_amt,
        local_package.name AS local_pkg_name,
        ptr.mmp_txn,
        ptr.mer_txn,
        ptr.amt,
        ptr.prod,
        ptr.date,
        ptr.bank_txn,
        ptr.f_code,
        ptr.bank_name AS bankName,
        ptr.merchant_id,
        ptr.udf9,
        ptr.discriminator,
        ptr.surcharge,
        ptr.CardNumber,
        ptr.signature
      FROM booking bk
      JOIN user us ON bk.user_id = us.id
      JOIN user us2 ON bk.client_id = us2.id
      LEFT JOIN user driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id AND vehm.user_id != 0
      LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model vmodel ON vm.id = vmodel.id
      LEFT JOIN master_vehicle_type dmvt ON vmodel.id = dmvt.id
      JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
      JOIN master_package mp ON bk.master_package_id = mp.id
      JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
      JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
      JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN booking_estimation bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN payment_transaction_response ptr ON bk.reference_number = ptr.mer_txn
      LEFT JOIN bank_details ON driver.id = bank_details.user_id
      LEFT JOIN bank_details user_bank_detail ON bk.user_id = user_bank_detail.user_id
      LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type = 'driverS'
      LEFT JOIN company ucompany ON driver.id = ucompany.user_id
      LEFT JOIN company user_company ON us.id = user_company.user_id
      LEFT JOIN company_setup compset ON bk.company_id = compset.id
      LEFT JOIN user_info us3 ON bk.client_id = us3.user_id
      LEFT JOIN user_info ON bk.user_id = user_info.user_id
      LEFT JOIN user_transaction ut ON bk.booking_id = ut.booking_id AND ut.action_type = 'Credit'
      LEFT JOIN master_currency mc ON compset.currency_id = mc.id
      LEFT JOIN payment_type pt ON ut.payment_type_id = pt.payment_type_id
      LEFT JOIN master_city mcity ON bpd.pickup_city = mcity.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      LEFT JOIN local_package ON bk.package_id = local_package.id
      LEFT JOIN master_country ON us.nationality = master_country.id
      WHERE 1 = 1
    `;

    const result = await sequelize.query(sqlQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_FETCHED,
        { total_count: result[0].total_count },
        200
      );
    } else {
      return successResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        { total_count: 0 },
        200
      );
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const bookingListSearchDataFilterCount = async (req, res) => {
  try {
    let sqlQuery = `
      SELECT COUNT(DISTINCT bk.itinerary_id) AS total_count
      FROM booking bk
      JOIN user us ON bk.user_id = us.id
      JOIN user us2 ON bk.client_id = us2.id
      LEFT JOIN user driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id AND vehm.user_id != 0
      LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model vmodel ON vm.id = vmodel.id
      LEFT JOIN master_vehicle_type dmvt ON vmodel.id = dmvt.id
      JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
      JOIN master_package mp ON bk.master_package_id = mp.id
      JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
      JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
      JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN booking_estimation bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN payment_transaction_response ptr ON bk.reference_number = ptr.mer_txn
      LEFT JOIN bank_details ON driver.id = bank_details.user_id
      LEFT JOIN bank_details user_bank_detail ON bk.user_id = user_bank_detail.user_id
      LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type = 'driverS'
      LEFT JOIN company ucompany ON driver.id = ucompany.user_id
      LEFT JOIN company user_company ON us.id = user_company.user_id
      LEFT JOIN company_setup compset ON bk.company_id = compset.id
      LEFT JOIN user_info us3 ON bk.client_id = us3.user_id
      LEFT JOIN user_info ON bk.user_id = user_info.user_id
      LEFT JOIN user_transaction ut ON bk.booking_id = ut.booking_id AND ut.action_type = 'Credit'
      LEFT JOIN master_currency mc ON compset.currency_id = mc.id
      LEFT JOIN payment_type pt ON ut.payment_type_id = pt.payment_type_id
      LEFT JOIN master_city mcity ON bpd.pickup_city = mcity.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      LEFT JOIN local_package ON bk.package_id = local_package.id
      LEFT JOIN master_country ON us.nationality = master_country.id
      WHERE 1 = 1
    `;

    const replacements = {};

    if (req.body.booking_id) {
      sqlQuery += " AND bk.reference_number = :booking_id";
      replacements.booking_id = req.body.booking_id;
    }

    if (req.body.booking_type) {
      sqlQuery += " AND bk.master_package_id = :booking_type";
      replacements.booking_type = req.body.booking_type;
    }

    if (req.body.driver_first_name) {
      sqlQuery += " AND driver.first_name LIKE :driver_first_name";
      replacements.driver_first_name = `%${req.body.driver_first_name}%`;
    }

    if (req.body.driver_last_name) {
      sqlQuery += " AND driver.last_name LIKE :driver_last_name";
      replacements.driver_last_name = `%${req.body.driver_last_name}%`;
    }

    if (req.body.driver_id) {
      sqlQuery += " AND bk.driver_id = :driver_id";
      replacements.driver_id = req.body.driver_id;
    }

    if (req.body.referral_key) {
      sqlQuery += " AND driver.referral_key = :referral_key";
      replacements.referral_key = req.body.referral_key;
    }

    if (req.body.driver_email) {
      sqlQuery += " AND driver.email = :driver_email";
      replacements.driver_email = req.body.driver_email;
    }

    if (req.body.driver_mobile_no) {
      sqlQuery += " AND driver.mobile = :driver_mobile_no";
      replacements.driver_mobile_no = req.body.driver_mobile_no;
    }

    if (req.body.client_first_name) {
      sqlQuery += " AND us2.first_name LIKE :client_first_name";
      replacements.client_first_name = `%${req.body.client_first_name}%`;
    }

    if (req.body.client_last_name) {
      sqlQuery += " AND us2.last_name LIKE :client_last_name";
      replacements.client_last_name = `%${req.body.client_last_name}%`;
    }

    if (req.body.client_id) {
      sqlQuery += " AND us2.id = :client_id";
      replacements.client_id = req.body.client_id;
    }

    if (req.body.client_email) {
      sqlQuery += " AND us2.email = :client_email";
      replacements.client_email = req.body.client_email;
    }

    if (req.body.client_mobile_no) {
      sqlQuery += " AND us2.mobile = :client_mobile_no";
      replacements.client_mobile_no = req.body.client_mobile_no;
    }

    if (req.body.vehicle_type) {
      sqlQuery += " AND bk.master_vehicle_type_id = :vehicle_type";
      replacements.vehicle_type = req.body.vehicle_type;
    }

    if (req.body.vehicle_no) {
      sqlQuery += " AND vm.vehicle_no = :vehicle_no";
      replacements.vehicle_no = req.body.vehicle_no;
    }

    if (req.body.state_name) {
      sqlQuery += " AND bpd.pickup_state = :state_name";
      replacements.state_name = req.body.state_name;
    }

    if (req.body.city_name) {
      sqlQuery += " AND bpd.pickup_city = :city_name";
      replacements.city_name = req.body.city_name;
    }

    if (req.body.pickupaddress) {
      sqlQuery += " AND bpd.pickup_address LIKE :pickupaddress";
      replacements.pickupaddress = `%${req.body.pickupaddress}%`;
    }

    if (req.body.drop_area) {
      sqlQuery += " AND bpd.drop_area LIKE :drop_area";
      replacements.drop_area = `%${req.body.drop_area}%`;
    }

    if (req.body.booking_status) {
      sqlQuery += " AND bk.status = :booking_status";
      replacements.booking_status = req.body.booking_status;
    }

    if (req.body.from_time && req.body.to_time) {
      sqlQuery += " AND bpd.pickup_time BETWEEN :from_time AND :to_time";
      replacements.from_time = req.body.from_time;
      replacements.to_time = req.body.to_time;
    } else if (req.body.from_time) {
      sqlQuery += " AND HOUR(bpd.pickup_time) = :from_time";
      replacements.from_time = req.body.from_time;
    }

    if (req.body.payment_type) {
      sqlQuery += " AND bk.charge_type = :payment_type";
      replacements.payment_type = req.body.payment_type;
    }

    if (req.body.from_date && req.body.to_date) {
      sqlQuery += " AND bpd.pickup_date BETWEEN :from_date AND :to_date";
      replacements.from_date = req.body.from_date;
      replacements.to_date = req.body.to_date;
    } else if (req.body.from_date) {
      sqlQuery += " AND DATE(bpd.pickup_date) = :from_date";
      replacements.from_date = req.body.from_date;
    }

    if (req.body.pickup_time) {
      sqlQuery += " AND HOUR(bpd.pickup_time) = :pickup_time";
      replacements.pickup_time = req.body.pickup_time;
    }

    if (req.body.unassignedbooking === 1) {
      sqlQuery += " AND bk.driver_id = 0";
    }

    if (req.body.user_mobile) {
      sqlQuery += " AND us.mobile = :user_mobile";
      replacements.user_mobile = req.body.user_mobile;
    }

    if (req.body.status) {
      sqlQuery += " AND bk.status = :status";
      replacements.status = req.body.status;
    }

    if (req.body.multi_vehicle_type) {
      sqlQuery += " AND bk.master_vehicle_type_id IN (:multi_vehicle_type)";
      replacements.multi_vehicle_type = req.body.multi_vehicle_type.split(",");
    }

    if (req.body.multi_city_name) {
      sqlQuery += " AND bpd.pickup_city IN (:multi_city_name)";
      replacements.multi_city_name = req.body.multi_city_name.split(",");
    }

    if (req.body.partner_name) {
      sqlQuery += " AND compset.com_name = :partner_name";
      replacements.partner_name = req.body.partner_name;
    }

    const result = await sequelize.query(sqlQuery, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_FETCHED,
        { total_count: result[0].total_count },
        200
      );
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, {}, 200);
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const bookingListSearchDataList = async (req, res) => {
  try {
    let sqlQuery = `
      SELECT 
        bk.booking_id AS id,
        bk.base_vehicle_id AS base_vehicle_id,
        bk.sac_code AS sac_code,
        bk.sac_description AS sac_description,
        bk.flight_number AS flight_number,
        bk.flight_time AS flight_time,
        bk.itinerary_id AS itinerary_id,
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
        bk.status AS status_id,
        bk.user_id,
        us.first_name,
        us.last_name,
        CONCAT(us.first_name, ' ', us.last_name) AS user_name,
        us.email,
        us.mobile AS user_mobile,
        master_country.name AS user_nationality,
        user_info.alternate_mobile AS user_alt_mobile,
        user_info.gst_registration_number,
        cab_status.status AS driver_status,
        bk.client_id,
        CONCAT(us2.first_name, ' ', us2.last_name) AS clientname,
        us2.mobile AS client_mobile,
        us2.email AS client_email,
        us3.alternate_mobile AS client_alt_mobile,
        bk.driver_id,
        CONCAT(driver.first_name, ' ', driver.last_name) AS driver_name,
        driver.mobile,
        driver.duty_status,
        dmvt.vehicle_type AS driver_vehicle_type,
        dmvt.category_id AS vehicle_category_id,
        bank_details.name AS bank_name,
        bank_details.ac_no AS account_no,
        bank_details.ifsc_code,
        bank_details.ac_holder_name,
        bank_details.branch,
        user_bank_detail.name AS user_bank_name,
        user_bank_detail.ac_no AS user_ac_no,
        user_bank_detail.ifsc_code AS user_ifsc_code,
        user_bank_detail.ac_holder_name AS user_beneficiary_name,
        bank_details.branch AS user_bank_branch,
        ucompany.company_name,
        ucompany.mobile_no,
        ucompany.landline_no,
        compset.gst_no,
        user_company.service_tax_gst,
        vm.vehicle_no,
        vm.model AS year,
        vm.color,
        vmodel.name AS vehicle_name,
        mpm.package_mode AS package_mode,
        bk.master_package_id AS booking_type_id,
        mp.name AS booking_type,
        mp.image AS booking_type_image,
        mp.icon AS booking_type_icon,
        payty.pay_type_mode AS charge_type,
        mvt.vehicle_type AS vehicle,
        bk.no_of_vehicles AS no_of_vehicles,
        mcoup.name AS coupon_name,
        DATE(bk.booking_date) AS booking_date,
        TIME(bk.booking_date) AS booking_time,
        bk.device_type,
        DATE_FORMAT(bk.booking_release_date, '%Y-%m-%d %H:%i:%s') AS booking_release_date,
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
        bkest.service_charge AS service_charge,
        bkest.booking_cancellation_rule,
        bkest.service_charge_cgst_amount,
        bkest.service_charge_igst_amount,
        bkest.service_charge_sgst_amount,
        bkest.service_charge_cgst,
        bkest.service_charge_igst,
        bkest.service_charge_sgst,
        bkest.service_charge_sac_code_id,
        bkest.service_charge_sac_code,
        service_charge_sac_code_description,
        CONCAT(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
        bpd.pickup_area AS pickup_area,
        bpd.pickup_date,
        bpd.pickup_time,
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
        (bkest.estimated_final_price - ut.amount) AS booking_amt_balance,
        pt.pay_type_mode AS payment_type,
        mcity.name AS city_name,
        booking_charges.driver_share_amt,
        booking_charges.comp_share_amt,
        booking_charges.partner_share_amt,
        local_package.name AS local_pkg_name,
        ptr.mmp_txn,
        ptr.mer_txn,
        ptr.amt,
        ptr.prod,
        ptr.date,
        ptr.bank_txn,
        ptr.f_code,
        ptr.bank_name AS bankName,
        ptr.merchant_id,
        ptr.udf9,
        ptr.discriminator,
        ptr.surcharge,
        ptr.CardNumber,
        ptr.signature
      FROM booking bk
      JOIN user us ON bk.user_id = us.id
      JOIN user us2 ON bk.client_id = us2.id
      LEFT JOIN user driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id AND vehm.user_id != 0
      LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model vmodel ON vm.id = vmodel.id
      LEFT JOIN master_vehicle_type dmvt ON vmodel.id = dmvt.id
      JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
      JOIN master_package mp ON bk.master_package_id = mp.id
      JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
      JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
      JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN booking_estimation bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN payment_transaction_response ptr ON bk.reference_number = ptr.mer_txn
      LEFT JOIN bank_details ON driver.id = bank_details.user_id
      LEFT JOIN bank_details user_bank_detail ON bk.user_id = user_bank_detail.user_id
      LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type = 'driverS'
      LEFT JOIN company ucompany ON driver.id = ucompany.user_id
      LEFT JOIN company user_company ON us.id = user_company.user_id
      LEFT JOIN company_setup compset ON bk.company_id = compset.id
      LEFT JOIN user_info us3 ON bk.client_id = us3.user_id
      LEFT JOIN user_info ON bk.user_id = user_info.user_id
      LEFT JOIN user_transaction ut ON bk.booking_id = ut.booking_id AND ut.action_type = 'Credit'
      LEFT JOIN master_currency mc ON compset.currency_id = mc.id
      LEFT JOIN payment_type pt ON ut.payment_type_id = pt.payment_type_id
      LEFT JOIN master_city mcity ON bpd.pickup_city = mcity.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      LEFT JOIN local_package ON bk.package_id = local_package.id
      LEFT JOIN master_country ON us.nationality = master_country.id
      WHERE 1 = 1
    `;

    const replacements = {};

    if (req.body.booking_id) {
      sqlQuery += " AND bk.reference_number = :booking_id";
      replacements.booking_id = req.body.booking_id;
    }

    if (req.body.booking_type) {
      sqlQuery += " AND bk.master_package_id = :booking_type";
      replacements.booking_type = req.body.booking_type;
    }

    if (req.body.driver_first_name) {
      sqlQuery += " AND driver.first_name LIKE :driver_first_name";
      replacements.driver_first_name = `%${req.body.driver_first_name}%`;
    }

    if (req.body.driver_last_name) {
      sqlQuery += " AND driver.last_name LIKE :driver_last_name";
      replacements.driver_last_name = `%${req.body.driver_last_name}%`;
    }

    if (req.body.driver_id) {
      sqlQuery += " AND bk.driver_id = :driver_id";
      replacements.driver_id = req.body.driver_id;
    }

    if (req.body.referral_key) {
      sqlQuery += " AND driver.referral_key = :referral_key";
      replacements.referral_key = req.body.referral_key;
    }

    if (req.body.driver_email) {
      sqlQuery += " AND driver.email = :driver_email";
      replacements.driver_email = req.body.driver_email;
    }

    if (req.body.driver_mobile_no) {
      sqlQuery += " AND driver.mobile = :driver_mobile_no";
      replacements.driver_mobile_no = req.body.driver_mobile_no;
    }

    if (req.body.client_first_name) {
      sqlQuery += " AND us2.first_name LIKE :client_first_name";
      replacements.client_first_name = `%${req.body.client_first_name}%`;
    }

    if (req.body.client_last_name) {
      sqlQuery += " AND us2.last_name LIKE :client_last_name";
      replacements.client_last_name = `%${req.body.client_last_name}%`;
    }

    if (req.body.client_id) {
      sqlQuery += " AND us2.id = :client_id";
      replacements.client_id = req.body.client_id;
    }

    if (req.body.client_email) {
      sqlQuery += " AND us2.email = :client_email";
      replacements.client_email = req.body.client_email;
    }

    if (req.body.client_mobile_no) {
      sqlQuery += " AND us2.mobile = :client_mobile_no";
      replacements.client_mobile_no = req.body.client_mobile_no;
    }

    if (req.body.vehicle_type) {
      sqlQuery += " AND bk.master_vehicle_type_id = :vehicle_type";
      replacements.vehicle_type = req.body.vehicle_type;
    }

    if (req.body.vehicle_no) {
      sqlQuery += " AND vm.vehicle_no = :vehicle_no";
      replacements.vehicle_no = req.body.vehicle_no;
    }

    if (req.body.state_name) {
      sqlQuery += " AND bpd.pickup_state = :state_name";
      replacements.state_name = req.body.state_name;
    }

    if (req.body.city_name) {
      sqlQuery += " AND bpd.pickup_city = :city_name";
      replacements.city_name = req.body.city_name;
    }

    if (req.body.pickupaddress) {
      sqlQuery += " AND bpd.pickup_address LIKE :pickupaddress";
      replacements.pickupaddress = `%${req.body.pickupaddress}%`;
    }

    if (req.body.drop_area) {
      sqlQuery += " AND bpd.drop_area LIKE :drop_area";
      replacements.drop_area = `%${req.body.drop_area}%`;
    }

    if (req.body.booking_status) {
      sqlQuery += " AND bk.status = :booking_status";
      replacements.booking_status = req.body.booking_status;
    }

    if (req.body.from_time && req.body.to_time) {
      sqlQuery += " AND bpd.pickup_time BETWEEN :from_time AND :to_time";
      replacements.from_time = req.body.from_time;
      replacements.to_time = req.body.to_time;
    } else if (req.body.from_time) {
      sqlQuery += " AND HOUR(bpd.pickup_time) = :from_time";
      replacements.from_time = req.body.from_time;
    }

    if (req.body.payment_type) {
      sqlQuery += " AND bk.charge_type = :payment_type";
      replacements.payment_type = req.body.payment_type;
    }

    if (req.body.from_date && req.body.to_date) {
      sqlQuery += " AND bpd.pickup_date BETWEEN :from_date AND :to_date";
      replacements.from_date = req.body.from_date;
      replacements.to_date = req.body.to_date;
    } else if (req.body.from_date) {
      sqlQuery += " AND DATE(bpd.pickup_date) = :from_date";
      replacements.from_date = req.body.from_date;
    }

    if (req.body.pickup_time) {
      sqlQuery += " AND HOUR(bpd.pickup_time) = :pickup_time";
      replacements.pickup_time = req.body.pickup_time;
    }

    if (req.body.unassignedbooking === 1) {
      sqlQuery += " AND bk.driver_id = 0";
    }

    if (req.body.user_mobile) {
      sqlQuery += " AND us.mobile = :user_mobile";
      replacements.user_mobile = req.body.user_mobile;
    }

    if (req.body.status) {
      sqlQuery += " AND bk.status = :status";
      replacements.status = req.body.status;
    }

    if (req.body.multi_vehicle_type) {
      sqlQuery += " AND bk.master_vehicle_type_id IN (:multi_vehicle_type)";
      replacements.multi_vehicle_type = req.body.multi_vehicle_type.split(",");
    }

    if (req.body.multi_city_name) {
      sqlQuery += " AND bpd.pickup_city IN (:multi_city_name)";
      replacements.multi_city_name = req.body.multi_city_name.split(",");
    }

    if (req.body.partner_name) {
      sqlQuery += " AND compset.com_name = :partner_name";
      replacements.partner_name = req.body.partner_name;
    }

    if (req.body.itinerary_id) {
      sqlQuery += " AND bk.itinerary_id = :itinerary_id";
      replacements.itinerary_id = req.body.itinerary_id;
    }

    sqlQuery += " ORDER BY bk.booking_id DESC";

    if (req.body.limit && req.body.offset) {
      sqlQuery += " LIMIT :offset, :limit";
      replacements.offset = parseInt(req.body.offset, 10);
      replacements.limit = parseInt(req.body.limit, 10);
    }

    const result = await sequelize.query(sqlQuery, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result, 200);
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        { status: "failed", error: "No Record Found" },
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    console.error(err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getDriverDocuments = async (req, res) => {
  try {
    const { driver_id } = req.body;

    if (!driver_id) {
      return errorResponse(
        res,
        "Driver ID is required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const query = `
      SELECT
        uud.doc_file_upload,
        uud.upload_doc_id,
        mdt.doc_type_id,
        mdt.document_name,
        mdt.doc_level_name
      FROM user_upload_document AS uud
      LEFT JOIN master_document_type AS mdt ON mdt.doc_type_id = uud.document_type_id
      WHERE uud.user_id = :driver_id
    `;

    const documents = await sequelize.query(query, {
      replacements: { driver_id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (documents.length > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_FETCHED,
        documents,
        200
      );
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        { status: "failed", error: "No Record Found" },
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getBookingByItineraryId = async (req, res) => {
  try {
    const { itinerary_id } = req.body;

    if (!itinerary_id) {
      return errorResponse(
        res,
        "Invalid or missing itinerary ID",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const sqlQuery = `
      SELECT
        city1.name AS pick_city_name,
        city2.name AS drop_city_name,
        obd.distance,
        obd.duration,
        obd.days,
        obd.pickup_date,
        obd.pickup_address,
        obd.drop_address,
        obd.pickup_time,
        obd.drop_time
      FROM itinerary_details AS obd
      INNER JOIN master_city AS city1 ON obd.pickcity_id = city1.id
      INNER JOIN master_city AS city2 ON obd.dropcity_id = city2.id
      WHERE obd.itinerary_id = :itinerary_id
      ORDER BY obd.id ASC
    `;

    const results = await sequelize.query(sqlQuery, {
      replacements: { itinerary_id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return successResponse(res, "Data fetched successfully", results, 200);
    } else {
      return errorResponse(
        res,
        "No records found",
        { status: "failed" },
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getStatementOfAccount = async (req, res) => {
  try {
    const reqs = req.body;
    const limit = req.body.limit || 10;
    const offset = req.body.offset || 0;

    let joins = `
    FROM (((((((((((((booking bk join user us on((bk.user_id = us.id))) join user us2 on((bk.client_id = us2.id)))
    left join user driver on((bk.driver_id = driver.id)))
    LEFT JOIN user_vehicle_mapping as vehm ON (bk.driver_id = vehm.user_id AND vehm.user_id!=0)
    left join vehicle_master AS vm ON vehm.vehicle_master_id = vm.vehicle_master_id
    left join master_vehicle_model as vmodel ON vm.id= vmodel.id
    left join master_vehicle_type dmvt ON vmodel.id = dmvt.id join master_package_mode mpm on((bk.master_package_mode_id = mpm.id))) join master_package mp on((bk.master_package_id = mp.id))) join master_vehicle_type mvt on((bk.master_vehicle_type_id = mvt.id)))
    left join master_coupon mcoup on((bk.coupon_id = mcoup.id)))) join cab_status cs on(((bk.status = cs.status_id) and (cs.type = 'cab')))) join payment_type payty on((bk.charge_type = payty.payment_type_id)))
    left join booking_estimation bkest on((bk.booking_id = bkest.booking_id)))
    left join booking_pickdrop_details bpd on((bk.booking_id = bpd.booking_id)))
    left join payment_transaction_response ptr on((bk.reference_number = ptr.mer_txn)))
    LEFT JOIN bank_details ON driver.id = bank_details.user_id
    LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
    LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type='driverS'
    left join company as ucompany ON driver.id = ucompany.user_id
    LEFT JOIN company AS user_company ON us.id = user_company.user_id
    left join company_setup as compset ON bk.company_id= compset.id
    left join user_info as us3 ON bk.client_id= us3.user_id
    left join user_info ON bk.user_id= user_info.user_id
    left join user_transaction as ut ON bk.booking_id= ut.booking_id AND ut.action_type='Credit'
    left join master_currency as mc ON compset.currency_id= mc.id
    left join payment_type as pt ON ut.payment_type_id= pt.payment_type_id
    left join master_city as mcity ON bpd.pickup_city= mcity.id
    LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingId
    LEFT JOIN local_package ON bk.package_id =local_package.id
    LEFT JOIN master_country ON us.nationality = master_country.id  `;

    let sql = ` where (1=1)  `;
    const whereConditions = {};

    if (reqs.reference_number) {
      whereConditions.reference_number = reqs.reference_number;
    }

    if (reqs.booking_type) {
      whereConditions.master_package_id = reqs.booking_type;
    }

    if (reqs.client_first_name) {
      whereConditions["$client.first_name$"] = {
        [Op.like]: `%${reqs.client_first_name}%`,
      };
    }

    if (reqs.client_last_name) {
      whereConditions["$client.last_name$"] = {
        [Op.like]: `%${reqs.client_last_name}%`,
      };
    }

    if (reqs.vehicle_type) {
      whereConditions.master_vehicle_type_id = reqs.vehicle_type;
    }

    if (reqs.city_name) {
      whereConditions["$pickupDetails.pickup_city$"] = reqs.city_name;
    }

    if (reqs.booking_status) {
      whereConditions.status = reqs.booking_status;
    }

    if (reqs.from_date) {
      whereConditions["$pickupDetails.pickup_date$"] = {
        [Op.gte]: reqs.from_date,
        ...(reqs.to_date && { [Op.lte]: reqs.to_date }),
      };
    }

    if (reqs.multi_vehicle_type) {
      whereConditions.master_vehicle_type_id = {
        [Op.in]: reqs.multi_vehicle_type.split(","),
      };
    }

    if (reqs.multi_booking_type) {
      whereConditions.master_package_id = {
        [Op.in]: reqs.multi_booking_type.split(","),
      };
    }

    if (reqs.multi_city_name) {
      whereConditions["$pickupDetails.pickup_city$"] = {
        [Op.in]: reqs.multi_city_name.split(","),
      };
    }

    if (reqs.partner_name) {
      whereConditions["$companySetup.com_name$"] = reqs.partner_name;
    }

    const total_count = await getStatementOfAccountCount(req, sql, joins);

    const filter_count = await getStatementOfAccountFilterCount(
      req,
      sql,
      joins
    );

    const data = await getStatementOfAccountList(
      req,
      sql,
      joins,
      whereConditions
    );

    return successResponse(
      res,
      MESSAGES.GENERAL.DATA_FETCHED,
      { data, total_count, filter_count, limit_count: data.length },
      200
    );
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

// export const fetchBookingDetails = async (req) => {
//   try {
//     let userDataArray = [];
//     let prefDataArray = [];
//     let dutyDataArray = [];
//     let preferred_booking = "";
//     let ignition_type_id = "";
//     let vehicle_type_id = "";
//     let prefDataString = "";
//     let dutyDataString = "";

//     if (req.driver_id) {
//       // Fetch driver data
//       const userData = await getUserData(req);
//       if (userData.status === "success") {
//         userDataArray = userData.data[0];
//         preferred_booking = userDataArray.preferred_booking;
//         ignition_type_id = userDataArray.ignition_type_id;
//         vehicle_type_id = userDataArray.vehicle_type_id;
//       }

//       // Fetch driver preferred city data
//       const prefData = await prefDriveCityList(req);
//       if (prefData.status === "success") {
//         prefDataArray = prefData.data;
//         prefDataString = prefDataArray.map((item) => item.city_id).join(",");
//       }

//       // Fetch driver duty type list
//       const dutyData = await dutyTypeList(req);
//       if (dutyData.status === "success") {
//         dutyDataArray = dutyData.data;
//         dutyDataString = dutyDataArray.map((item) => item.package_id).join(",");
//       }
//     }

//     req.preferred_booking = preferred_booking;
//     req.ignition_type_id = ignition_type_id;
//     req.vehicle_type_id = vehicle_type_id;
//     req.pref_city = prefDataString;
//     req.multi_booking_type = dutyDataString;

//     // Fetch booking list data
//     const bookingData = await bookingUnassignedData(req);
//     if (bookingData.status === "success") {
//       return { status: "success", data: bookingData.data };
//     } else {
//       return { status: "failed", message: "No record found" };
//     }
//   } catch (error) {
//     console.error("Error fetching booking details:", error);
//     return { status: "failed", message: "An error occurred" };
//   }
// };

export const cancelBookingByDriver = async (req, res) => {
  try {
    const {
      client_wallet_amount,
      user_id,
      itinerary_id,
      booking_id,
      created_by,
      cancellationCharges,
      estimated_final_price,
      status,
      ip,
      driver_id,
      reason,
      type,
    } = req.body;
    const booking = await sequelize.query(
      `CALL sp_w_a_booking_information(:bookingId)`,
      {
        replacements: { bookingId: booking_id },
        type: sequelize.QueryTypes.RAW,
      }
    );
    if (!booking) {
      return errorResponse(res, MESSAGES.BOOKING.NOT_FOUND, 404);
    }
    if (String(booking[0].status_id) === "10") {
      return successResponse(res, MESSAGES.BOOKING.BOOKING_ALREADY_CANCELLED);
    }
    const validStatuses = ["20", "21", "16", "17", "24", "29", "30", "26"];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, MESSAGES.BOOKING.INVALID_STATUS, 400);
    }
    const cancellationCharge = Number(cancellationCharges);
    const creditNoteAmount = Number(estimated_final_price) - cancellationCharge;
    const creditNoteType =
      cancellationCharge > 0 ? "Partially Credit" : "Fully Credit";
    const currentDate = new Date();
    const creditNote = await UserCreditNote.create({
      user_id,
      booking_id,
      booking_amount: estimated_final_price,
      cancellation_charge: cancellationCharge,
      credit_note_amount: creditNoteAmount,
      credit_note_type: creditNoteType,
      created_by,
      created_date: currentDate,
      ip,
    });
    const companyInfo = await CompanySetup.findOne({
      where: { id: 1 },
    });
    const credit_note_ref_no = await getBookingRefNo(
      creditNote.id,
      companyInfo.credit_note_prefix
    );
    console.log(credit_note_ref_no, "credit_note_ref_no");
    await creditNote.update({ credit_note_ref_no });
    const wallet_amount = Number(client_wallet_amount) + creditNoteAmount;
    await UserTransaction.create({
      user_id,
      itinerary_id,
      booking_id,
      booking_transaction_no: credit_note_ref_no,
      action_type: "Credit",
      amount: creditNoteAmount,
      payment_type_id: "2",
      payment_status: "1",
      current_balance: wallet_amount,
      created_by,
      created_date: currentDate,
    });
    await Promise.all([
      Booking.update({ status, driver_id }, { where: { booking_id } }),
      Driver.update({ status: 0 }, { where: { user_id: driver_id } }),
      BookingRegistered.create({
        bookingid: booking_id,
        driverId: driver_id,
        updateOn: currentDate,
        reason: reason || "Already Booked New car",
        status: "C",
        type: type || "By Un-Assigned Booking",
        read_status: "0",
      }),
    ]);
    return successResponse(res, MESSAGES.BOOKING.BOOKING_HAS_CANCELLED);
  } catch (error) {
    console.log(error);
  }
};

export const bookingFilter = async (req, res) => {
  try {
    const {
      from_time,
      to_time,
      from_date,
      to_date,
      pickup_time,
      unassignedbooking,
      user_mobile,
      multi_vehicle_type,
      multi_city_name,
      // Add all possible search parameters
      booking_id,
      booking_type,
      driver_first_name,
      driver_last_name,
      driver_id,
      referral_key,
      driver_email,
      driver_mobile_no,
      client_first_name,
      client_last_name,
      client_id,
      client_email,
      client_mobile_no,
      vehicle_type,
      vehicle_no,
      state_name,
      city_name,
      pickupaddress,
      drop_area,
      booking_status,
      payment_type,
      status,
      partner_name,
      created_by,
      // Additional possible parameters
      package_mode,
      coupon_code,
      vehicle_model,
      company_name,
      user_nationality,
      currency,
      transaction_type,
      min_amount,
      max_amount,
      is_roundtrip,
      is_corporate,
      is_recurring,
    } = req.body;

    let sql = `
        SELECT count(DISTINCT bk.itinerary_id) as total_count
        FROM (((((((((((((booking bk join user us on((bk.user_id = us.id))) join user us2 on((bk.client_id = us2.id)))
        LEFT join user driver on((bk.driver_id = driver.id)))
        LEFT JOIN user_vehicle_mapping as vehm ON (bk.driver_id = vehm.user_id AND vehm.user_id!=0)
        LEFT join vehicle_master AS vm ON vehm.vehicle_master_id = vm.vehicle_master_id
        LEFT join master_vehicle_model as vmodel ON vm.id= vmodel.id
        LEFT join master_vehicle_type dmvt ON vmodel.id = dmvt.id join master_package_mode mpm on((bk.master_package_mode_id = mpm.id))) join master_package mp on((bk.master_package_id = mp.id))) join master_vehicle_type mvt on((bk.master_vehicle_type_id = mvt.id)))
        LEFT join master_coupon mcoup on((bk.coupon_id = mcoup.id)))) join cab_status cs on(((bk.status = cs.status_id) and (cs.type = 'cab')))) join payment_type payty on((bk.charge_type = payty.payment_type_id)))
        LEFT join booking_estimation bkest on((bk.booking_id = bkest.booking_id)))
        LEFT join booking_pickdrop_details bpd on((bk.booking_id = bpd.booking_id)))
        LEFT join payment_transaction_response ptr on((bk.reference_number = ptr.mer_txn)))
        LEFT JOIN bank_details ON driver.id = bank_details.user_id
        LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
        LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type='driverS'
        LEFT join company as ucompany ON driver.id = ucompany.user_id
        LEFT JOIN company AS user_company ON us.id = user_company.user_id
        LEFT join company_setup as compset ON bk.company_id= compset.id
        LEFT join user_info as us3 ON bk.client_id= us3.user_id
        LEFT join user_info ON bk.user_id= user_info.user_id
        LEFT join user_transaction as ut ON bk.booking_id= ut.booking_id AND ut.action_type='Credit'
        LEFT join master_currency as mc ON compset.currency_id= mc.id
        LEFT join payment_type as pt ON ut.payment_type_id= pt.payment_type_id
        LEFT join master_city as mcity ON bpd.pickup_city= mcity.id
        LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
        LEFT JOIN local_package ON bk.package_id =local_package.id
        LEFT JOIN master_country ON us.nationality = master_country.id
        where (1=1)
    `;

    const filters = [
      { field: "booking_id", sql: "bk.reference_number", exact: true },
      { field: "booking_type", sql: "bk.master_package_id", exact: true },
      { field: "driver_first_name", sql: "driver.first_name", like: true },
      { field: "driver_last_name", sql: "driver.last_name", like: true },
      { field: "driver_id", sql: "bk.driver_id", exact: true },
      { field: "referral_key", sql: "driver.referral_key", exact: true },
      { field: "driver_email", sql: "driver.email", exact: true },
      { field: "driver_mobile_no", sql: "driver.mobile", exact: true },
      { field: "client_first_name", sql: "us2.first_name", like: true },
      { field: "client_last_name", sql: "us2.last_name", like: true },
      { field: "client_id", sql: "us2.id", exact: true },
      { field: "client_email", sql: "us2.email", exact: true },
      { field: "client_mobile_no", sql: "us2.mobile", exact: true },
      { field: "vehicle_type", sql: "bk.master_vehicle_type_id", exact: true },
      { field: "vehicle_no", sql: "vm.vehicle_no", exact: true },
      { field: "state_name", sql: "bpd.pickup_state", exact: true },
      { field: "city_name", sql: "bpd.pickup_city", exact: true },
      { field: "pickupaddress", sql: "bpd.pickup_address", like: true },
      { field: "drop_area", sql: "bpd.drop_area", like: true },
      { field: "booking_status", sql: "bk.status", exact: true },
      { field: "payment_type", sql: "bk.charge_type", exact: true },
      { field: "status", sql: "bk.status", exact: true },
      { field: "partner_name", sql: "compset.com_name", exact: true },
      { field: "created_by", sql: "bk.created_by", exact: true },
      // Additional filters
      { field: "package_mode", sql: "bk.master_package_mode_id", exact: true },
      { field: "coupon_code", sql: "mcoup.coupon_code", exact: true },
      { field: "vehicle_model", sql: "vmodel.model_name", like: true },
      { field: "company_name", sql: "user_company.company_name", like: true },
      { field: "user_nationality", sql: "master_country.id", exact: true },
      { field: "currency", sql: "mc.id", exact: true },
      { field: "transaction_type", sql: "pt.payment_type_id", exact: true },
      { field: "is_roundtrip", sql: "bk.is_roundtrip", exact: true },
      { field: "is_corporate", sql: "bk.is_corporate", exact: true },
      { field: "is_recurring", sql: "bk.is_recurring", exact: true },
    ];

    filters.forEach(({ field, sql, exact, like }) => {
      if (req?.body?.[field]) {
        const value = like ? `%${req.body[field]}%` : req.body[field];
        sql += ` AND ${sql} ${like ? "LIKE" : "="} ${sequelize.escape(value)}`;
      }
    });

    // Special cases
    if (from_time) {
      sql += to_time
        ? ` AND bpd.pickup_time BETWEEN ${sequelize.escape(
            from_time
          )} AND ${sequelize.escape(to_time)}`
        : ` AND HOUR(bpd.pickup_time) = ${sequelize.escape(from_time)}`;
    }

    if (from_date) {
      sql += to_date
        ? ` AND bpd.pickup_date BETWEEN ${sequelize.escape(
            from_date
          )} AND ${sequelize.escape(to_date)}`
        : ` AND DATE(bpd.pickup_date) = ${sequelize.escape(from_date)}`;
    }

    if (pickup_time) {
      sql += ` AND HOUR(bpd.pickup_time) = ${sequelize.escape(pickup_time)}`;
    }

    if (unassignedbooking === "1") {
      sql += " AND bk.driver_id = 0";
    }

    if (user_mobile) {
      sql += ` AND us.mobile = ${sequelize.escape(user_mobile)}`;
    }

    if (multi_vehicle_type) {
      const vehicleTypes = multi_vehicle_type
        .split(",")
        .map((v) => sequelize.escape(v))
        .join(",");
      sql += ` AND bk.master_vehicle_type_id IN(${vehicleTypes})`;
    }

    if (multi_city_name) {
      const cities = multi_city_name
        .split(",")
        .map((c) => sequelize.escape(c))
        .join(",");
      sql += ` AND bpd.pickup_city IN(${cities})`;
    }

    // Amount range filter
    if (min_amount || max_amount) {
      if (min_amount && max_amount) {
        sql += ` AND bk.total_amount BETWEEN ${sequelize.escape(
          min_amount
        )} AND ${sequelize.escape(max_amount)}`;
      } else if (min_amount) {
        sql += ` AND bk.total_amount >= ${sequelize.escape(min_amount)}`;
      } else if (max_amount) {
        sql += ` AND bk.total_amount <= ${sequelize.escape(max_amount)}`;
      }
    }

    const [results] = await sequelize.query(sql);
    return results.length
      ? successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results)
      : errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const bookingHistoryList = async (req, res) => {
  try {
    const { created_by } = req.body;
    let sql = ` select count(DISTINCT bk.itinerary_id) as total_count, bk.booking_id AS id,
        bk.base_vehicle_id AS base_vehicle_id,
        bk.sac_code AS sac_code,
        bk.sac_description AS sac_description,
        bk.flight_number AS flight_number,
        bk.flight_time AS flight_time,
        bk.itinerary_id AS itinerary_id,
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
        concat(us.first_name, ' ', us.last_name) AS user_name,
        us.email,
        us.mobile as user_mobile,
        master_country.name as user_nationality ,
        user_info.alternate_mobile AS user_alt_mobile,
        user_info.gst_registration_number,
        cab_status.status as driver_status,
        bk.client_id,
        concat(us2.first_name, ' ', us2.last_name) AS clientname,
        us2.mobile as client_mobile,
        us2.email as client_email,
        us3.alternate_mobile as client_alt_mobile,
        bk.driver_id,
        concat(driver.first_name, ' ', driver.last_name) AS driver_name,
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
        payty.pay_type_mode AS charge_type,
        mvt.vehicle_type AS vehicle,
        bk.no_of_vehicles AS no_of_vehicles,
        mcoup.name AS coupon_name,
        DATE(bk.booking_date) AS booking_date,
        TIME(bk.booking_date) AS booking_time,
        bk.device_type,
        DATE_FORMAT(bk.booking_release_date, '%Y-%m-%d %H:%i:%s') as booking_release_date ,
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
        bkest.premiums_type ,
        bkest.premiums_value ,
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
        bkest.service_charge_cgst_amount,
        bkest.service_charge_igst_amount,
        bkest.service_charge_sgst_amount,
        bkest.service_charge_cgst,
        bkest.service_charge_igst,
        bkest.service_charge_sgst,
        bkest.service_charge_sac_code_id,
        bkest.service_charge_sac_code,
        service_charge_sac_code_description,
        concat(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
        bpd.pickup_area AS pickup_area,
        bpd.pickup_date,
        bpd.pickup_time,
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
        (bkest.estimated_final_price - ut.amount)  as booking_amt_balance ,
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
        ptr.signature from (((((((((((((booking bk join user us on((bk.user_id = us.id))) join user us2 on((bk.client_id = us2.id)))
        left join user driver on((bk.driver_id = driver.id)))
        LEFT JOIN user_vehicle_mapping as vehm ON (bk.driver_id = vehm.user_id AND vehm.user_id!=0)
        left join vehicle_master AS vm ON vehm.vehicle_master_id = vm.vehicle_master_id
        left join master_vehicle_model as vmodel ON vm.id= vmodel.id
        left join master_vehicle_type dmvt ON vmodel.id = dmvt.id join master_package_mode mpm on((bk.master_package_mode_id = mpm.id))) join master_package mp on((bk.master_package_id = mp.id))) join master_vehicle_type mvt on((bk.master_vehicle_type_id = mvt.id)))
        left join master_coupon mcoup on((bk.coupon_id = mcoup.id)))) join cab_status cs on(((bk.status = cs.status_id) and (cs.type = 'cab')))) join payment_type payty on((bk.charge_type = payty.payment_type_id)))
        left join booking_estimation bkest on((bk.booking_id = bkest.booking_id)))
        left join booking_pickdrop_details bpd on((bk.booking_id = bpd.booking_id)))
        left join payment_transaction_response ptr on((bk.reference_number = ptr.mer_txn)))
        LEFT JOIN bank_details ON driver.id = bank_details.user_id
        LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
        LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type='driverS'
        left join company as ucompany ON driver.id = ucompany.user_id
        LEFT JOIN company AS user_company ON us.id = user_company.user_id
        left join company_setup as compset ON bk.company_id= compset.id
        left join user_info as us3 ON bk.client_id= us3.user_id
        left join user_info ON bk.user_id= user_info.user_id
        left join user_transaction as ut ON bk.booking_id= ut.booking_id AND ut.action_type='Credit'
        left join master_currency as mc ON compset.currency_id= mc.id
        left join payment_type as pt ON ut.payment_type_id= pt.payment_type_id
        left join master_city as mcity ON bpd.pickup_city= mcity.id
        LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
        LEFT JOIN local_package ON bk.package_id =local_package.id
        LEFT JOIN master_country ON us.nationality = master_country.id
        where (1=1)
    `;
    if (created_by)
      sql += ` AND bk.created_by = ${sequelize.escape(created_by)}`;
    const [results] = await sequelize.query(sql);
    return results.length
      ? successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results)
      : errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const bookingSearch = async (req, res) => {
  let {
    booking_id,
    booking_type,
    driver_first_name,
    driver_id,
    from_date,
    to_date,
    limit = 10,
    pageNumber = 1,
    // Additional filter fields
    driver_last_name,
    referral_key,
    driver_email,
    driver_mobile_no,
    client_first_name,
    client_last_name,
    client_id,
    client_email,
    client_mobile_no,
    vehicle_type,
    vehicle_no,
    state_name,
    city_name,
    pickupaddress,
    drop_area,
    booking_status,
    payment_type,
    status,
    partner_name,
    created_by,
    package_mode,
    coupon_code,
    vehicle_model,
    company_name,
    user_nationality,
    currency,
    transaction_type,
    is_roundtrip,
    is_corporate,
    is_recurring,
    from_time,
  } = req.body || {};
  // Calculate offset - ensure pageNumber is at least 1
  pageNumber = Math.max(1, parseInt(pageNumber));
  limit = parseInt(limit);
  const offset = (pageNumber - 1) * limit;

  let replacements = {};

  // Base SQL query for data
  let dataSql = `
    SELECT bk.booking_id AS id,
        bk.base_vehicle_id AS base_vehicle_id,
        bk.sac_code AS sac_code,
        bk.sac_description AS sac_description,
        bk.flight_number AS flight_number,
        bk.flight_time AS flight_time,
        bk.itinerary_id AS itinerary_id,
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
        bk.outstation_module_type as module_type,
        us.first_name,
        us.last_name,
        us.referral_key,
        concat(us.first_name, ' ', us.last_name) AS user_name,
        us.email,
        us.mobile as user_mobile,
        master_country.name as user_nationality,
        user_info.alternate_mobile AS user_alt_mobile,
        user_info.gst_registration_number,
        cab_status.status as driver_status,
        bk.client_id,
        concat(us2.first_name, ' ', us2.last_name) AS clientname,
        us2.mobile as client_mobile,
        us2.email as client_email,
        us3.alternate_mobile as client_alt_mobile,
        bk.driver_id,
        concat(driver.first_name, ' ', driver.last_name) AS driver_name,
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
        ucompany.company_logo_path,
        ucompany.company_address,
        ucompany.pincode,
        compset.gst_no,
        user_company.service_tax_gst,
        vm.vehicle_no,
        vm.vehicle_master_id,
        vm.model as year,
        vm.color,
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
        DATE_FORMAT(bk.booking_release_date, '%Y-%m-%d %H:%i:%s') as booking_release_date,
        cs.status AS status,
        bkest.booking_estimation_id AS booking_estimation_id,
        bkest.booking_id AS booking_id,
        bkest.estimated_time AS estimated_time,
        bkest.estimated_distance AS estimated_distance,
        bkest.estimateprice_before_discount AS estimateprice_before_discount,
        bkest.discount_price AS discount_price,
        bkest.estimated_final_price AS estimated_final_price,
        bkest.booking_amt_percentage AS booking_amt_percentage,
        bkest.estimated_distance AS distance,
        bkest.min_per_km_charge AS per_km_charge,
        bkest.min_per_hr_charge AS per_hr_charge,
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
        bkest.service_charge_cgst_amount,
        bkest.service_charge_igst_amount,
        bkest.service_charge_sgst_amount,
        bkest.service_charge_cgst,
        bkest.service_charge_igst,
        bkest.service_charge_sgst,
        bkest.service_charge_sac_code_id,
        bkest.service_charge_sac_code,
        bkest.cgst_amount,
        bkest.cgst_tax,
        bkest.sgst_amount,
        bkest.sgst_tax,
        bkest.igst_amount,
        bkest.igst_tax,
        bkest.discount_price,
        bkest.service_charge_sac_code as sac_code,
        bkest.service_charge_sac_code_description as description,
        bkest.estimated_price_before_markup AS estimated_price_before_markup,
        concat(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
        bpd.pickup_area AS pickup_area,
        bpd.pickup_date,
        bpd.pickup_time,
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
        bc.driver_share_amt,
        bc.comp_share_amt,
        bc.partner_share_amt,
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
        ptr.signature,
        bc.starting_meter_image,
        bc.closing_meter_image,
        bc.parking_image,
        bc.toll_image,
        bc.extra_image,
        bc.client_image,
        bc.starting_meter,
        bc.closing_meter,
        bc.start_time,
        bc.end_time,
        bc.balance_amt,
        bc.nightcharge,
        bc.night_rate_begins,
        bc.night_rate_ends,
        bc.base_price,
        mcity.state_name,
        mcity.nationality,
        bapd.adults,
        bapd.childs,
        bapd.luggages,
        bapd.infants,
        bapd.sr_citizens
    FROM (((((((((((((booking bk join user us on((bk.user_id = us.id))) join user us2 on((bk.client_id = us2.id)))
        left join user driver on((bk.driver_id = driver.id)))
        LEFT JOIN user_vehicle_mapping as vehm ON (bk.driver_id = vehm.user_id AND vehm.user_id!=0)
        left join vehicle_master AS vm ON vehm.vehicle_master_id = vm.vehicle_master_id
        left join master_vehicle_model as vmodel ON vm.id= vmodel.id
        left join master_vehicle_type dmvt ON vmodel.id = dmvt.id join master_package_mode mpm on((bk.master_package_mode_id = mpm.id))) join master_package mp on((bk.master_package_id = mp.id))) join master_vehicle_type mvt on((bk.master_vehicle_type_id = mvt.id)))
        left join master_coupon mcoup on((bk.coupon_id = mcoup.id)))) join cab_status cs on(((bk.status = cs.status_id) and (cs.type = 'cab')))) join payment_type payty on((bk.charge_type = payty.payment_type_id)))
        left join booking_estimation bkest on((bk.booking_id = bkest.booking_id)))
        left join booking_pickdrop_details bpd on((bk.booking_id = bpd.booking_id)))
        left join payment_transaction_response ptr on((bk.reference_number = ptr.mer_txn)))
        LEFT JOIN bank_details ON driver.id = bank_details.user_id
        LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
        LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type='driverS'
        left join company as ucompany ON driver.id = ucompany.user_id
        LEFT JOIN company AS user_company ON us.id = user_company.user_id
        left join company_setup as compset ON bk.company_id= compset.id
        left join user_info as us3 ON bk.client_id= us3.user_id
        left join user_info ON bk.user_id= user_info.user_id
        left join user_transaction as ut ON bk.booking_id= ut.booking_id AND ut.action_type='Credit'
        left join master_currency as mc ON compset.currency_id= mc.id
        left join payment_type as pt ON ut.payment_type_id= pt.payment_type_id
        left join master_city as mcity ON bpd.pickup_city= mcity.id
        LEFT JOIN booking_charges bc ON bk.booking_id = bc.BookingId
        LEFT JOIN local_package ON bk.package_id =local_package.id
        LEFT JOIN master_country ON us.nationality = master_country.id
        LEFT JOIN booking_actual_pickdrop_details bapd ON bapd.booking_id = bk.booking_id
        LEFT JOIN master_sac_code msac ON msac.id = bkest.service_charge_sac_code_id
    WHERE (1=1)
  `;

  // Count SQL for getting total records
  let countSql = `
    SELECT COUNT(DISTINCT bk.booking_id) as total
    FROM booking bk
    JOIN user us ON bk.user_id = us.id
    JOIN user us2 ON bk.client_id = us2.id
    LEFT JOIN user driver ON bk.driver_id = driver.id
    LEFT JOIN user_vehicle_mapping as vehm ON (bk.driver_id = vehm.user_id AND vehm.user_id!=0)
    LEFT JOIN vehicle_master AS vm ON vehm.vehicle_master_id = vm.vehicle_master_id
    LEFT JOIN master_vehicle_model as vmodel ON vm.id= vmodel.id
    LEFT JOIN master_vehicle_type dmvt ON vmodel.id = dmvt.id
    JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
    JOIN master_package mp ON bk.master_package_id = mp.id
    JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
    LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
    JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
    JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
    LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
    WHERE (1=1)
  `;

  const filters = [
    {
      condition: booking_id,
      clause: "bk.booking_id = :booking_id",
      params: { booking_id },
    },
    {
      condition: booking_type,
      clause: "bk.master_package_id = :booking_type",
      params: { booking_type },
    },
    {
      condition: driver_first_name,
      clause: "driver.first_name LIKE :driver_first_name",
      params: { driver_first_name: `%${driver_first_name}%` },
    },
    {
      condition: driver_last_name,
      clause: "driver.last_name LIKE :driver_last_name",
      params: { driver_last_name: `%${driver_last_name}%` },
    },
    {
      condition: driver_id,
      clause: "bk.driver_id = :driver_id",
      params: { driver_id },
    },
    {
      condition: referral_key,
      clause: "driver.referral_key = :referral_key",
      params: { referral_key },
    },
    {
      condition: driver_email,
      clause: "driver.email = :driver_email",
      params: { driver_email },
    },
    {
      condition: driver_mobile_no,
      clause: "driver.mobile = :driver_mobile_no",
      params: { driver_mobile_no },
    },
    {
      condition: client_first_name,
      clause: "us2.first_name LIKE :client_first_name",
      params: { client_first_name: `%${client_first_name}%` },
    },
    {
      condition: client_last_name,
      clause: "us2.last_name LIKE :client_last_name",
      params: { client_last_name: `%${client_last_name}%` },
    },
    {
      condition: client_id,
      clause: "us2.id = :client_id",
      params: { client_id },
    },
    {
      condition: client_email,
      clause: "us2.email = :client_email",
      params: { client_email },
    },
    {
      condition: client_mobile_no,
      clause: "us2.mobile = :client_mobile_no",
      params: { client_mobile_no },
    },
    {
      condition: vehicle_type,
      clause: "bk.master_vehicle_type_id = :vehicle_type",
      params: { vehicle_type },
    },
    {
      condition: vehicle_no,
      clause: "vm.vehicle_no = :vehicle_no",
      params: { vehicle_no },
    },
    {
      condition: state_name,
      clause: "bpd.pickup_state = :state_name",
      params: { state_name },
    },
    {
      condition: city_name,
      clause: "bpd.pickup_city = :city_name",
      params: { city_name },
    },
    {
      condition: pickupaddress,
      clause: "bpd.pickup_address LIKE :pickupaddress",
      params: { pickupaddress: `%${pickupaddress}%` },
    },
    {
      condition: drop_area,
      clause: "bpd.drop_area LIKE :drop_area",
      params: { drop_area: `%${drop_area}%` },
    },
    {
      condition: booking_status,
      clause: "bk.status = :booking_status",
      params: { booking_status },
    },
    {
      condition: payment_type,
      clause: "bk.charge_type = :payment_type",
      params: { payment_type },
    },
    {
      condition: status,
      clause: "bk.status = :status",
      params: { status },
    },
    {
      condition: partner_name,
      clause: "compset.com_name = :partner_name",
      params: { partner_name },
    },
    {
      condition: created_by,
      clause: "bk.created_by = :created_by",
      params: { created_by },
    },
    {
      condition: package_mode,
      clause: "bk.master_package_mode_id = :package_mode",
      params: { package_mode },
    },
    {
      condition: coupon_code,
      clause: "mcoup.coupon_code = :coupon_code",
      params: { coupon_code },
    },
    {
      condition: vehicle_model,
      clause: "vmodel.model_name LIKE :vehicle_model",
      params: { vehicle_model: `%${vehicle_model}%` },
    },
    {
      condition: company_name,
      clause: "user_company.company_name LIKE :company_name",
      params: { company_name: `%${company_name}%` },
    },
    {
      condition: user_nationality,
      clause: "master_country.id = :user_nationality",
      params: { user_nationality },
    },
    {
      condition: currency,
      clause: "mc.id = :currency",
      params: { currency },
    },
    {
      condition: transaction_type,
      clause: "pt.payment_type_id = :transaction_type",
      params: { transaction_type },
    },
    {
      condition: is_roundtrip,
      clause: "bk.is_roundtrip = :is_roundtrip",
      params: { is_roundtrip },
    },
    {
      condition: is_corporate,
      clause: "bk.is_corporate = :is_corporate",
      params: { is_corporate },
    },
    {
      condition: is_recurring,
      clause: "bk.is_recurring = :is_recurring",
      params: { is_recurring },
    },
    {
      condition: from_date && to_date,
      clause: "bpd.pickup_date BETWEEN :from_date AND :to_date",
      params: { from_date, to_date },
    },
    {
      condition: from_date && !!from_date,
      clause: "bpd.pickup_date = :from_date",
      params: { from_date },
    },
    {
      condition: from_time && !!from_time,
      clause: "bpd.pickup_date = :from_date",
      params: { from_date },
    },
  ];

  // Apply filters to both queries
  filters.forEach(({ condition, clause, params }) => {
    if (condition) {
      dataSql += ` AND ${clause}`;
      countSql += ` AND ${clause}`;
      Object.assign(replacements, params);
    }
  });

  // Add ordering and pagination to the data query
  dataSql += " ORDER BY bk.booking_id DESC";
  dataSql += " LIMIT :offset, :limit";
  Object.assign(replacements, { offset, limit });

  try {
    // Get total count first
    const countResult = await sequelize.query(countSql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // Then get paginated results
    const results = await sequelize.query(dataSql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (!results.length) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }

    // Return response with pagination metadata
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
      data: results,
      pagination: {
        totalRecords: total,
        totalPages,
        currentPage: pageNumber,
        recordsPerPage: limit,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (err) {
    console.log({ err });
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const updateClientRating = async (req, res) => {
  try {
    const { booking_Id, driver_Id, user_Id, rating } = req.body;
    if (!booking_Id || !driver_Id || !user_Id || !rating) {
      return errorResponse(res, MESSAGES.BOOKING.NOT_VALID_RATING);
    }
    if (rating < 1 || rating > 5) {
      return errorResponse(res, MESSAGES.BOOKING.NOT_VALID_RATING);
    }
    const userRating = await UserRating.create({
      BookingId: booking_Id,
      DriverId: driver_Id,
      UserId: user_Id,
      Rating: rating,
      CreatedAt: new Date(),
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, userRating);
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const updatePickupDateTime = async (req, res) => {
  try {
    let { booking_id, pickup_date, pickup_time, user_id } = req.body;
    if (!user_id) user_id = req.user.id;
    console.log({ user_id: req.user.id });
    if (!booking_id)
      return errorResponse(res, MESSAGES.BOOKING.MISSING_REQUIRED_FIELDS);

    const updateData = { pickup_date, pickup_time };
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );
    const bookingInfo = await bookingInfoSequential(booking_id, "");
    if (bookingInfo.status !== "success")
      errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    const {
      pickupdate,
      pickuptime,
      booking_status,
      client_name,
      client_mobile,
      client_email,
    } = bookingInfo.data;
    const oldDateTime = `${pickupdate} ${pickuptime}`;
    const newDateTime = `${pickup_date} ${pickup_time}`;
    await sendTemplatedSMS({
      msg_sku: "resechdule",
      is_active: 1,
      to: client_mobile,
      variables: {
        username: client_name,
        booking_ref_no: booking_id,
        pickup_time: oldDateTime,
        reschedule_pickup_time: newDateTime,
      },
    });
    // Update database
    await BookingPickDropDetails.update(updateData, { where: { booking_id } });
    await BookingResecReassign.create({
      booking_id,
      old_pick_time: pickuptime,
      old_pick_date: pickupdate,
      new_pick_time: pickup_time,
      new_pick_date: pickup_date,
      old_cab_status: booking_status,
      created_by: user_id,
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
  } catch (err) {
    console.error("Error updating pickup date/time:", err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

const sendSms = async (req) => {
  try {
    const {
      mobile,
      sms_template_name: template,
      sms_template_param: params1,
      sms_body,
      msg_type,
      comp_id,
    } = req;
    // Fetch all required data in parallel
    const [smsTemplate, companyInfo, smsApi] = await Promise.all([
      SmsTemplate.findOne({
        where: { msg_sku: msg_type, company_id: comp_id },
      }),
      CompanySetup.findOne({
        where: {
          id: process.env.COMPANY_SETUP_ID,
        },
      }),
      SmsApi.findOne({
        where: {
          id: 1,
        },
      }),
    ]);
    if (!smsApi) {
      errorResponse(res, MESSAGES.AUTH.SMS_API_NOT_CONFIGURED);
    }
    // Prepare template parameters
    const defaultParams = {
      site_url: process.env.site_url,
      com_name: process.env.NOT_APPLICABLE,
      com_phone: process.env.NOT_APPLICABLE,
      app_link: process.env.APP_LINK,
      client_app_link: process.env.NOT_APPLICABLE,
    };
    const companyParams = companyInfo
      ? {
          site_url: companyInfo.short_code,
          com_name: companyInfo.site_title,
          com_phone: companyInfo.phone,
          app_link: companyInfo.driver_app_url,
          client_app_link: companyInfo.client_app_url,
        }
      : defaultParams;
    const templateParams = {
      ...params1,
      ...companyParams,
    };
    // Send SMS
    const smsResponse = await sendTemplatedSMS({
      msg_sku: msg_type,
      is_active: 1,
      to: mobile,
      variables: templateParams,
      template: smsTemplate?.template || sms_body,
    });
    return smsResponse
      ? successResponse(res, MESSAGES.GENERAL.MESSAGES_SENT)
      : successResponse(res, MESSAGES.GENERAL.MESSAGE_NOT_SENT);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const bookingInfoSequential = async (bookingId, res) => {
  try {
    let result;
    if (bookingId?.body?.booking_Id) {
      result = await getBookingInfo(bookingId?.body?.booking_Id);
    } else {
      result = await getBookingInfo(bookingId);
    }

    if (result) {
      const finalData = {};
      const driver_id = result.driver_id;
      let rating = 0;
      if (driver_id) {
        const result1 = await getdriverRating(driver_id, bookingId);
        if (result1 && result1.rating) {
          rating = result1.rating;
        }
      }
      const is_paid = result.is_paid == 1 ? "True" : "False";
      const is_corporate_booking = result.is_corportate == 1 ? "True" : "False";
      const paid_at = dateFormat(result.paid_at, "yyyy-mm-dd HH:MM:ss");
      // Populate finalData object
      finalData.currency = result.currency_n;
      finalData.waiting_type = "Minute";
      finalData.fair_text = result.minimum_distance;
      finalData.distance_rate = result.distance_rate;
      finalData.cabtype = result.CarType;
      finalData.user_id = result.user_id;
      finalData.client_id = result.client_id;
      finalData.client_name = result.clientname;
      finalData.client_email = result.client_email;
      finalData.client_mobile = result.client_mobile;
      finalData.driver_name = result.driver_name;
      finalData.driver_mobile = result.driver_mobile;
      finalData.driver_email = result.driver_email;
      finalData.driver_details = result.driver_details;
      finalData.vehicle_no = result.vehicle_no;
      finalData.vehicle_name = result.vehicle_name;
      finalData.is_paid = is_paid;
      finalData.paid_at = paid_at;
      finalData.invoice_number = result.invoice_number;
      finalData.payment_type = result.payment_type;
      finalData.fees = result.fees;
      finalData.total_price = result.total_price;
      finalData.total_tax_price = result.total_tax_price;
      finalData.duration_rate = result.duration_rate;
      finalData.starting_rate = result.starting_rate;
      finalData.base_price = result.base_price;
      finalData.tax_price = result.tax_price;
      finalData.duration_charge = result.duration_charge;
      finalData.distance_charge = result.distance_charge;
      finalData.minimum_price = result.minimumCharge;
      finalData.starting_charge = result.starting_charge;
      finalData.cancellation_price = result.cancellation_price;
      finalData.waiting_charge = result.approx_waiting_charge;
      finalData.waiting_minute = "";
      finalData.totalbill = result.totalBill;
      finalData.tripCharge = result.tripCharge;
      finalData.night_charge = result.night_charge;
      finalData.peakTimePrice = result.peakTimePrice;
      finalData.extracharges = result.extracharges;
      finalData.pickuparea = result.pickup_area;
      finalData.droparea = result.drop_area;
      finalData.pickupaddress = result.pickup_address;
      finalData.dropaddress = result.drop_address;
      finalData.estimated_distance = result.estimated_distance;
      finalData.estimated_time = result.estimated_time;
      finalData.estimated_final_price = result.estimated_final_price;
      finalData.booking_id = result.reference_number;
      finalData.useragent = "";
      finalData.bookingtype = result.BookingType;
      finalData.bookingdate = dateFormat(
        result.booking_date,
        "yyyy-mm-dd HH:MM:ss"
      );
      finalData.pickupdate = dateFormat(result.pickup_date, "yyyy-mm-dd");
      finalData.pickuptime = result.pickup_time;
      finalData.is_corporate_booking = is_corporate_booking;
      finalData.is_account_booking = "";
      finalData.voucher_id = "";
      finalData.voucher_type = "";
      finalData.arrival_time_pre = result.arrival_time_pre;
      finalData.arrival_time_post = result.arrival_time_post;
      finalData.arrival_time_actual = result.arrival_time_actual;
      finalData.expiration_time = result.booking_release_date;
      finalData.actual_driven_distance = result.actual_driven_distance;
      finalData.actual_waiting_distance = result.actual_waiting_distance;
      finalData.total_time = result.actual_time;
      finalData.total_distance = result.actual_distance;
      finalData.estimated_price = result.estimated_price;
      finalData.driver_rating = rating;
      finalData.client_rating = "";
      finalData.actual_driven_duration = result.actual_driven_duration;
      finalData.PickupLatitude = result.pickup_latitude;
      finalData.PickupLongtitude = result.pickup_longitude;
      finalData.address_is_added = "";
      finalData.minimum_distance = result.minimum_distance;
      finalData.booking_status_name = result.booking_status_name;
      finalData.driver_note = result.driver_note;
      finalData.client_note = result.client_note;
      finalData.features = result.features;
      finalData.booking_status = result.booking_status;
      finalData.type_of_dispatch = result.type_of_dispatch;
      finalData.type_of_dispatch_name = result.type_of_dispatch_name;
      finalData.garage_type = result.garage_type;
      finalData.garage_address = result.garage_address;
      finalData.garage_latitude = result.garage_latitude;
      finalData.garage_longitude = result.garage_longitude;
      finalData.remark = result.remark;
      const pendingDocuments = await BookingCharges.findOne({
        where: { BookingID: bookingId },
        attributes: [
          "BookingID",
          "starting_meter_image",
          "closing_meter_image",
          "client_signature",
          "parking_image",
          "toll_image",
          "extra_image",
          "client_image",
        ],
      });
      if (pendingDocuments) {
        const pendingDoc = pendingDocuments;
        const ductySlip = [];
        // Starting Meter Image
        ductySlip.push({
          KeyName: "startingMeterImage",
          status: pendingDoc.starting_meter_image ? "Success" : "Pending",
          imageURL: pendingDoc.starting_meter_image
            ? `${constants.B2B_UPLOAD_URL}meter-image/${pendingDoc.starting_meter_image}`
            : "",
          imageLabel: "Starting Meter Image",
        });
        // Closing Meter Image
        ductySlip.push({
          KeyName: "closingMeterImage",
          status: pendingDoc.closing_meter_image ? "Success" : "Pending",
          imageURL: pendingDoc.closing_meter_image
            ? `${constants.B2B_UPLOAD_URL}meter-image/${pendingDoc.closing_meter_image}`
            : "",
          imageLabel: "Closing Meter Image",
        });

        // Customer Signature
        ductySlip.push({
          KeyName: "clientSignature",
          status: pendingDoc.client_signature ? "Success" : "Pending",
          imageURL: pendingDoc.client_signature
            ? `${constants.B2B_UPLOAD_URL}meter-image/${pendingDoc.client_signature}`
            : "",
          imageLabel: "Customer Signature",
        });

        // Parking Image
        ductySlip.push({
          KeyName: "parkingImage",
          status: pendingDoc.parking_image ? "Success" : "Pending",
          imageURL: pendingDoc.parking_image
            ? `${constants.B2B_UPLOAD_URL}meter-image/${pendingDoc.parking_image}`
            : "",
          imageLabel: "Parking Image",
        });

        // Toll Image
        ductySlip.push({
          KeyName: "tollImage",
          status: pendingDoc.toll_image ? "Success" : "Pending",
          imageURL: pendingDoc.toll_image
            ? `${constants.B2B_UPLOAD_URL}meter-image/${pendingDoc.toll_image}`
            : "",
          imageLabel: "Toll Image",
        });

        // Extra Image
        ductySlip.push({
          KeyName: "extraImage",
          status: pendingDoc.extra_image ? "Success" : "Pending",
          imageURL: pendingDoc.extra_image
            ? `${constants.B2B_UPLOAD_URL}meter-image/${pendingDoc.extra_image}`
            : "",
          imageLabel: "Extra Image",
        });

        // Client Image
        ductySlip.push({
          KeyName: "clientImage",
          status: pendingDoc.client_image ? "Success" : "Pending",
          imageURL: pendingDoc.client_image
            ? `${constants.B2B_UPLOAD_URL}meter-image/${pendingDoc.client_image}`
            : "",
          imageLabel: "Client Image",
        });

        finalData.dutyImages = ductySlip;
      }

      if (!!bookingId?.body?.booking_Id) {
        return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, finalData);
      } else {
        return { status: "success", data: finalData };
      }
    } else {
      return { status: "failed", message: "No Record Found" };
    }
  } catch (err) {
    console.error("Error in bookingInfoSequential:", err);
    throw err;
  }
};

export const markBookingAsNoShow = async function (req, res) {
  try {
    const {
      booking_status,
      driver_id,
      user_id,
      mobile_no,
      booking_ref,
      reason_text,
      remark_text,
      booking_id,
    } = req.body;
    const bookingstatusArr = [3, 4, 5, 6];
    if (bookingstatusArr.includes(booking_status)) {
      const data = await AgentWorkHistory.create({
        AgentID: user_id,
        CallerId: mobile_no,
        BookingID: booking_ref,
        ActionType: reason_text,
        Date: new Date(),
        ActionDesc: remark_text,
      });
      const drivetdata = await Driver.update(
        { status: 0 },
        { where: { user_id: driver_id } }
      );
      if (!!data) {
        const status = 14;
        const result = await Booking.update(
          { status },
          { where: { booking_id } }
        );
        return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
      }
    } else {
      return errorResponse(res, MESSAGES.BOOKING.INVALID_STATUS);
    }
  } catch (error) {
    console.log({ error });
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};
export const redispatchBooking = async function (req, res) {
  try {
    const {
      booking_status,
      driver_id,
      booking_id,
      reason_text,
      remark_text,
      pick_lat,
      pick_long,
      user_id,
      mobile_no,
    } = req.body;
    const bookingstatusArr = [2, 3, 4, 5, 6, 7, 10];
    if (!bookingstatusArr.includes(booking_status)) {
      return errorResponse(res, MESSAGES.GENERAL.NOT_FOUND);
    }
    const bookingstatus = await Booking.update(
      { status: 1, driver_id: 0, reason: reason_text, remark: remark_text },
      { where: { booking_id: booking_id } }
    );
    if (bookingstatus.affectedRows <= 0) {
      return errorResponse(res, MESSAGES.GENERAL.SOMETHING_WENT_WRONG);
    }
    const currentDate = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    await BookingLogs.update(
      { status: 1, message: "Requesting car", time: currentDate },
      { where: { bookingid: booking_id } }
    );
    await BookingTracker.update(
      {
        Latitutude: pick_lat,
        Logitude: pick_long,
        Date_Time: currentDate,
        CabStatus: 1,
      },
      { where: { BookingID: booking_id } }
    );
    await AgentWorkHistory.create({
      AgentID: user_id,
      CallerId: mobile_no,
      BookingID: booking_id,
      ActionType: reason_text,
      Date: currentDate,
      ActionDesc: remark_text,
    });
    const driverupdateresult = await Driver.update(
      { status: 0 },
      { where: { user_id: driver_id } }
    );
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const smstoclient = async (req, res) => {
  try {
    const { type, clientInfo, post } = req.body;
    if (!type || !clientInfo || !post) {
      return errorResponse(res, MESSAGES.BOOKING.MISSING_REQUIRED_FIELDS);
    }

    let data;
    if (type === "booking") {
      data = {
        template_name: "booking",
        mobile: clientInfo.client_mobile,
        user_name: clientInfo.clientname,
        booking_ref_no: post.booking_id,
        pickup_time: clientInfo.ordertime,
        estimated_price: clientInfo.estimated_final_price,
        otp: "1234",
      };
    } else if (type === "driver") {
      data = {
        template_name: "booking",
        mobile: clientInfo.mobile,
        user_name: clientInfo.driver_name,
        booking_ref_no: post.booking_id,
        pickup_time: clientInfo.ordertime,
        estimated_price: clientInfo.estimated_final_price,
        otp: "1234",
      };
    }

    await sendTemplatedSMS({
      msg_sku: data.template_name,
      is_active: 1,
      to: data.mobile,
      variables: {
        username: data.user_name,
        booking_ref_no: data.booking_ref_no,
        pickup_time: data.pickup_time,
        estimated_price: data.estimated_price,
        otp: data.otp,
      },
    });

    return successResponse(res, MESSAGES.GENERAL.MESSAGES_SENT);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};
export const getVehicleTypeData = async (req, res) => {
  try {
    const { id } = req.body;
    const where = id ? { id } : {};
    const data = await MasterVehicleType.findAll({ where });
    if (!data.length) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    return successResponse(res, MESSAGES.DRIVER.VEHICLE_DETAILS_FETCHED, data);
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};
export const getDriverClaimList = async (req) => {
  try {
    const {
      vehicle_type_id,
      master_package_id,
      booking_amount,
      city_id,
      user_id,
      type,
    } = req.body;

    let sql = `
            SELECT
                user.id as user_id,
                user.wallet_amount,
                user.gcm_id,
                user.first_name,
                user.last_name,
                user.email,
                user.mobile,
                user.parent_id,
                user.user_type_id,
                ui.city_id,
                mvm.name as vehicle_model_name,
                GROUP_CONCAT(DISTINCT(mvt.id)) as vehicle_type_id,
                GROUP_CONCAT(DISTINCT(mvt.category_id)) as category_id,
                GROUP_CONCAT(DISTINCT(mvt.vehicle_type)) as vehicle_type,
                GROUP_CONCAT(DISTINCT(mvm.name)) AS vehicle_name,
                GROUP_CONCAT(DISTINCT(udp.package_id)) as driver_package,
                GROUP_CONCAT(DISTINCT(udpc.city_id)) AS user_pref_city,
                GROUP_CONCAT(DISTINCT(m_shift.working_shift_id)) as working_shift_id,
                GROUP_CONCAT(DISTINCT(m_shift.shift_time)) as working_shift_time,
GROUP_CONCAT(DISTINCT(master_language.language_name)) as user_language,
                GROUP_CONCAT(DISTINCT(vm.model)) as vehicle_model,
                GROUP_CONCAT(DISTINCT(color.colour_name)) as vehicle_color,
                GROUP_CONCAT(DISTINCT(fuel.fuel_type)) as fuel_type,
                vm.vehicle_no,
                vm.model as model_year
            FROM user
            INNER JOIN driver ON user.id = driver.user_id
            INNER JOIN user_info as ui ON user.id = ui.user_id
            LEFT JOIN vendor_status as vs ON user.id = vs.user_id
            LEFT JOIN user_vehicle_mapping as uvm ON user.id = uvm.user_id
            LEFT JOIN vehicle_master as vm ON uvm.vehicle_master_id = vm.vehicle_master_id
            LEFT JOIN master_colour as color ON vm.color = color.colour_id
            LEFT JOIN master_fuel_type as fuel ON vm.ignition_type_id = fuel.id
            LEFT JOIN master_vehicle_model as mvm ON vm.id = mvm.id
            LEFT JOIN master_vehicle_type as mvt ON mvm.vehicle_type_id = mvt.id
            LEFT JOIN user_duty_pref as udp ON user.id = udp.user_id AND udp.status = 1
            LEFT JOIN user_pref_drive_city as udpc ON user.id = udpc.user_id
            LEFT JOIN user_workingshift_mapping AS workshift ON user.id = workshift.user_id
            LEFT JOIN master_working_shift as m_shift ON workshift.working_shift_id = m_shift.working_shift_id
            LEFT JOIN user_language as language ON user.id = language.user_id AND language.status = 1
            LEFT JOIN master_language ON language.language_id = master_language.language_id
            WHERE user.user_type_id IN (3, 4)
        `;

    const params = [];

    // Add conditions with parameterized values
    if (vehicle_type_id) {
      sql += " AND mvt.id >= ?";
      params.push(vehicle_type_id);
    }

    if (master_package_id) {
      sql += " AND udp.package_id = ?";
      params.push(master_package_id);

      if (master_package_id == 2 && booking_amount) {
        sql += " AND user.wallet_amount >= ?";
        params.push(booking_amount);
      }
    }

    if (city_id) {
      sql += " AND (udpc.city_id = ? OR ui.city_id = ?)";
      params.push(city_id, city_id);
    }

    if (user_id) {
      sql += " AND user.parent_id = ?";
      params.push(user_id);
    }

    if (type) {
      switch (type) {
        case "Online-Active":
          sql +=
            " AND (user.gcm_id IS NOT NULL AND user.gcm_id != '') AND user.login_status = 1 AND user.is_active = 1";
          break;
        case "Online-InActive":
          sql +=
            " AND (user.gcm_id IS NOT NULL AND user.gcm_id != '') AND user.login_status = 1 AND user.is_active IN (4, 5)";
          break;
        case "Offline-Active":
          sql += " AND user.login_status = 0 AND user.is_active = 1";
          break;
        case "Offline-InActive":
          sql += " AND user.login_status = 0 AND user.is_active IN (4, 5)";
          break;
        case "All":
          sql +=
            " AND user.login_status IN (0, 1) AND user.is_active IN (1, 4, 5)";
          break;
      }
    }
    sql += " GROUP BY uvm.user_id";
    const [results] = await sequelize.query(sql, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT,
    });
    if (!results.length) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    return successResponse(res, MESSAGES.DRIVER.DRIVER_CLAIMED_LIST, data);
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};
export const updateUserStatus = async (req, res) => {
  try {
    const { id, userId, userStatus } = req.body;
    if (!id || !userId || userStatus === undefined) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    const updateData = {
      is_active: userStatus,
      [userStatus == 1 ? "active_by" : "modified_by"]: userId,
    };
    const [affectedRows] = await User.update(updateData, {
      where: { id },
    });
    if (affectedRows === 0) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    return successResponse(res, MESSAGES.USER.USER_STATUS_UPDATE);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getbookingbyitenearyid = async (req, res) => {
  try {
    const { itenary_Id } = req.body;
    if (!itenary_Id) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    let query = `
             SELECT
             city1.name as pick_city_name,
             city2.name as drop_city_name,
             obd.distance,
             obd.duration,
             obd.days,
             DATE_FORMAT(obd.pickup_date,'%Y-%m-%d') as pickup_date,
             obd.pickup_address,
             obd.drop_address,
             obd.pickup_time,
             DATE_FORMAT(obd.drop_date,'%Y-%m-%d') as drop_date
             FROM itinerary_details as obd
             INNER JOIN master_city as city1 ON obd.pickcity_id= city1.id
             INNER JOIN master_city as city2 ON obd.dropcity_id = city2.id
             WHERE obd.itinerary_id = :itenary_Id order by obd.id asc
    `;
    const rows = await sequelize.query(query, {
      replacements: { itenary_Id },
      type: sequelize.QueryTypes.SELECT,
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, rows);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getBookinglog = async (req, res) => {
  try {
    const { booking_id } = req.body;
    if (!booking_id) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    const query = `
    Select * from booking_logs LEFT JOIN cab_status ON booking_logs.status= cab_status.status_id AND cab_status.type = "cab" WHERE booking_logs.bookingid = :booking_id;
    `;
    const [rows] = await sequelize.query(query, {
      replacements: { booking_id },
      type: sequelize.QueryTypes.SELECT,
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, rows);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const sendWhatsAppMessage = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    const sendMessage = await sendTemplateMessage(req);
    return successResponse(res, MESSAGES.GENERAL.MESSAGES_SENT, sendMessage);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.response?.data || error.message,
      error.response?.status || 500
    );
  }
};

export const getBookingTemplate = async (req, res) => {
  try {
    const { template_name, company_id } = req.body;

    if (!template_name || !company_id) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }

    const template = await WhatsAppTemplate.findOne({
      where: {
        template_name,
        company_id,
        is_active: 1,
        status: "APPROVED",
      },
      attributes: [
        "id",
        "template_name",
        "template_category",
        "language_code",
        "header_type",
        "header_text",
        "body_text",
        "footer_text",
        "created_at",
        "updated_at",
      ],
    });

    if (!template) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, template);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.response?.data || error.message,
      error.response?.status || 500
    );
  }
};

export const updateNewSattler = async (req, res) => {
  try {
    const { email, status } = req.query;
    if (!email) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    if (status !== "0" && status !== "1") {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    const condition = email ? { email } : {};
    const updatedUser = await User.update(
      { newsletter_subscription: Number(status) },
      { where: condition }
    );
    if (!updatedUser) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, updatedUser);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.response?.data || error.message,
      error.response?.status || 500
    );
  }
};

//Send Ahmedabad Email
export const sendBookingEmailAhmedabad = async () => {
  try {
    const getUsers = await User.findAll({
      where: {
        is_active: 1,
      },
      attributes: ["email", "first_name"],
    });

    if (!getUsers || getUsers.length === 0) {
      return false;
    }
    const validUsers = getUsers.filter((user) => user.email);
    if (validUsers.length === 0) {
      return false;
    }
    const BATCH_SIZE = 50;
    const DELAY_BETWEEN_BATCHES = 5000;
    for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
      const batch = validUsers.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map((user) => {
        const subscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
          user.email
        )}&status=1`;
        const unsubscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
          user.email
        )}&status=0`;
        const name = user.first_name || "there";
        return Promise.all([
          sendEmail("ahmedabad", user.email, {
            name: name,
            subscribe: subscribeUrl,
            unsubscribe: unsubscribeUrl,
          }),
        ]);
      });
      await Promise.all(batchPromises);
      console.log(
        `Sent batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
          validUsers.length / BATCH_SIZE
        )}`
      );
      if (i + BATCH_SIZE < validUsers.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES)
        );
      }
    }
    return true;
  } catch (error) {
    console.error("Bulk email error:", error);
    return false;
  }
};

//send Bangalore Email
export const sendBookingEmailBangalore = async (req, res) => {
  try {
    const getUsers = await User.findAll({
      where: {
        is_active: 1,
        email: "php1@hello42cabs.com",
      },
      attributes: ["email", "first_name"],
    });
    if (!getUsers || getUsers.length === 0) {
      return false;
    }
    const validUsers = getUsers.filter((user) => user.email);
    if (validUsers.length === 0) {
      return false;
    }
    console.log(`Preparing to send emails to ${validUsers.length} recipients`);
    const BATCH_SIZE = 50;
    const DELAY_BETWEEN_BATCHES = 5000;
    for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
      const batch = validUsers.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map((user) => {
        const subscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
          user.email
        )}&status=1`;
        const unsubscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
          user.email
        )}&status=0`;
        const name = user.first_name || "there";
        return Promise.all([
          sendEmail("bangalore", user.email, {
            name: name,
            subscribe: subscribeUrl,
            unsubscribe: unsubscribeUrl,
          }),
        ]);
      });
      await Promise.all(batchPromises);
      console.log(
        `Sent batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
          validUsers.length / BATCH_SIZE
        )}`
      );
      if (i + BATCH_SIZE < validUsers.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES)
        );
      }
    }
    return true;
  } catch (error) {
    console.error("Bulk email error:", error);
    return false;
  }
};
export const sendBookingDhanteras = async () => {
  try {
    const getUsers = await User.findAll({
      where: {
        is_active: 1,
        email: "php1@hello42cabs.com",
      },
      attributes: ["email", "first_name"],
    });
    if (!getUsers || getUsers.length === 0) {
      return false;
    }
    const validUsers = getUsers.filter((user) => user.email);
    if (validUsers.length === 0) {
      return false;
    }
    console.log(`Preparing to send emails to ${validUsers.length} recipients`);
    const BATCH_SIZE = 50;
    const DELAY_BETWEEN_BATCHES = 5000;
    for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
      const batch = validUsers.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map((user) => {
        const subscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
          user.email
        )}&status=1`;
        const unsubscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
          user.email
        )}&status=0`;
        const name = user.first_name || "there";
        return Promise.all([
          sendEmail("bangalore", user.email, {
            name: name,
            subscribe: subscribeUrl,
            unsubscribe: unsubscribeUrl,
          }),
        ]);
      });
      await Promise.all(batchPromises);
      console.log(
        `Sent batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
          validUsers.length / BATCH_SIZE
        )}`
      );
      if (i + BATCH_SIZE < validUsers.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES)
        );
      }
    }
    return true;
  } catch (error) {
    console.error("Bulk email error:", error);
    return false;
  }
};

export const quotationList = function (req, cb) {
  const {
    pickup_date,
    pickup_time,
    unassigned_booking: unassignedbooking,
    assignedbooking,
    driver_id,
    user_id,
    from_date: fromDate,
    to_date: toDate,
    booking_type,
    booking_id,
    user_mobile,
    status,
  } = req;

  let sql = `
    SELECT 
      bk.booking_id AS id,
      bk.itinerary_id AS itinerary_id,
      bk.company_id AS company_id,
      compset.com_name AS domain_name,
      compset.driver_min_balance,
      bk.driver_id AS driver_id,
      bk.reference_number AS ref,
      bk.status_c,
      bk.user_id,
      CONCAT(us.first_name, ' ', us.last_name) AS user_name, 
      us.mobile as user_mobile,
      bk.client_id, 
      CONCAT(us2.first_name, ' ', us2.last_name) AS clientname,
      us2.mobile as client_mobile,
      us.email as user_email,
      us2.email as client_email,
      bk.driver_id,
      CONCAT(driver.first_name, ' ', driver.last_name) AS driver_name,
      driver.gcm_id,
      vm.vehicle_no,
      vmodel.name as vehicle_name, 
      mpm.package_mode AS package_mode,
      bk.master_package_id as booking_type_id,
      mp.name AS booking_type,
      mp.image as booking_type_image,
      mp.icon as booking_type_icon,
      payty.pay_type_mode AS charge_type,
      mvt.id AS vehicle_type_id,
      mvt.category_id AS vehicle_category_id,
      mvt.vehicle_type AS vehicle,
      bk.no_of_vehicles AS no_of_vehicles,
      mcoup.name AS coupon_name,
      DATE(bk.booking_date) AS booking_date,
      TIME(bk.booking_date) AS booking_time,
      DATE_FORMAT(bk.booking_release_date,'%Y-%m-%d %H:%m:%s') as booking_release_date,
      bk.device_type,
      bk.filter_data,
      cs.status AS status,
      bkest.booking_estimation_id AS booking_estimation_id,
      bkest.booking_id AS booking_id,
      bkest.estimated_time AS estimated_time,
      bkest.estimated_distance AS estimated_distance,
      bkest.estimateprice_before_discount AS estimateprice_before_discount,
      bkest.discount_price AS discount_price,
      bkest.estimated_final_price AS estimated_final_price,
      bkest.estimated_price_before_markup AS estimated_price_before_markup,
      bkest.approx_distance_charge AS approx_distance_charge,
      bkest.approx_after_km AS approx_after_km,
      bkest.approx_waiting_charge AS approx_waiting_charge,
      bkest.approx_waiting_minute AS approx_waiting_minute,
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
      mc.name AS city_name,
      booking_charges.driver_share_amt,
      booking_charges.comp_share_amt,
      booking_charges.partner_share_amt,
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
    FROM quotation bk
    JOIN user us ON bk.user_id = us.id
    JOIN user us2 ON bk.client_id = us2.id
    LEFT JOIN user driver ON bk.driver_id = driver.id
    LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id AND vehm.user_id != 0
    LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
    LEFT JOIN master_vehicle_model vmodel ON vm.id = vmodel.id
    JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
    JOIN master_package mp ON bk.master_package_id = mp.id
    JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
    LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
    JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
    JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
    LEFT JOIN quotation_estimation bkest ON bk.booking_id = bkest.booking_id
    LEFT JOIN quotation_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
    LEFT JOIN payment_transaction_response ptr ON bk.reference_number = ptr.mer_txn
    LEFT JOIN company_setup compset ON bk.company_id = compset.id
    LEFT JOIN master_city mc ON bpd.pickup_city = mc.id
    LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
    WHERE (bk.status = 27 OR bk.status <= 8)
  `;

  // Add filters
  if (pickup_date) {
    sql += ` AND bpd.pickup_date = '${pickup_date}'`;
  } else if (fromDate && toDate) {
    sql += ` AND DATE(bpd.pickup_date) >= '${fromDate}' AND DATE(bpd.pickup_date) <= '${toDate}'`;
  } else {
    sql += ` AND bpd.pickup_date >= CURDATE()`;
  }

  if (pickup_time) {
    sql += ` AND HOUR(bpd.pickup_time) = '${pickup_time}'`;
  }

  if (unassignedbooking === "1") {
    sql += ` AND bk.driver_id = 0`;
  }

  if (assignedbooking === "1") {
    sql += ` AND bk.driver_id > 0`;
  }

  if (driver_id) {
    sql += ` AND bk.driver_id = '${driver_id}'`;
  }

  if (user_id) {
    sql += ` AND bk.user_id = '${user_id}'`;
  }

  if (booking_type) {
    sql += ` AND bk.master_package_id = '${booking_type}'`;
  }

  if (booking_id) {
    sql += ` AND bk.reference_number = '${booking_id}'`;
  }

  if (user_mobile) {
    sql += ` AND us.mobile = '${user_mobile}'`;
  }

  if (status) {
    sql += ` AND bk.status = '${status}'`;
  }

  sql += ` AND bk.quotation_status = 1 ORDER BY bk.booking_id DESC`;

  // Execute the raw query using Sequelize
  Booking.sequelize
    .query(sql, {
      type: Booking.sequelize.QueryTypes.SELECT,
      model: Booking,
      mapToModel: true,
    })
    .then((result) => {
      if (result && result.length > 0) {
        cb(null, { status: "success", data: result });
      } else {
        cb(null, { error: "No Record Found", status: "failed" });
      }
    })
    .catch((err) => {
      console.error(err);
      cb(err);
    });
};
export const updateQuotationStatus = async (req, res) => {
  try {
    const { auto_id, status } = req.body;

    // Validate input
    if (!auto_id || !status) {
      return res.status(400).json({
        status: "failed",
        message: "auto_id and status are required",
      });
    }

    // Convert auto_id to array if it's not already
    const bookingIds = Array.isArray(auto_id) ? auto_id : [auto_id];

    // Update using Sequelize
    const [affectedRows] = await Quotation.update(
      { quotation_status: status },
      {
        where: {
          booking_id: bookingIds,
        },
      }
    );

    if (affectedRows > 0) {
      return res.status(200).json({
        status: "success",
        message: "Quotation updated successfully",
        affectedRows,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "No quotations found with the provided booking IDs",
      });
    }
  } catch (err) {
    console.error("Error updating quotation status:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export async function sendTestEmail() {
  try {
    const email = "ytabhay207@gmail.com";
    if (!email) {
      throw new Error("Email address is required for testing");
    }
    const subscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
      email
    )}&status=1`;
    const unsubscribeUrl = `https://api.bookingcabs.com/api/booking/update-booking-sattler?email=${encodeURIComponent(
      email
    )}&status=0`;
    await sendEmail("ahmedabad", "ytabhay207@gmail.com", {
      name: "Ahmedabad",
      subscribe: subscribeUrl,
      unsubscribe: unsubscribeUrl,
    });

    await sendEmail("bangalore", "ytabhay207@gmail.com", {
      name: "Bangalore",
      subscribe: subscribeUrl,
      unsubscribe: unsubscribeUrl,
    });

    console.log("All test emails sent successfully");
    return true;
  } catch (error) {
    console.error("Error in test email sequence:", error);
    return false;
  }
}
// Manage Statement of Account

export const getStatmentOfAccount = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      reference_number,
      booking_type,
      client_first_name,
      client_last_name,
      vehicle_type,
      city_name,
      booking_status,
      from_date,
      multi_vehicle_type,
      multi_booking_type,
      multi_city_name,
      partner_name,
      offset,
    } = req.body;
    let joins = `
                FROM (((((((((((((booking bk join user us on((bk.user_id = us.id))) join user us2 on((bk.client_id = us2.id)))
                left join user driver on((bk.driver_id = driver.id)))
                LEFT JOIN user_vehicle_mapping as vehm ON (bk.driver_id = vehm.user_id AND vehm.user_id!=0)
                left join vehicle_master AS vm ON vehm.vehicle_master_id = vm.vehicle_master_id
                left join master_vehicle_model as vmodel ON vm.id= vmodel.id
                left join master_vehicle_type dmvt ON vmodel.id = dmvt.id join master_package_mode mpm on((bk.master_package_mode_id = mpm.id))) join master_package mp on((bk.master_package_id = mp.id))) join master_vehicle_type mvt on((bk.master_vehicle_type_id = mvt.id)))
                left join master_coupon mcoup on((bk.coupon_id = mcoup.id)))) join cab_status cs on(((bk.status = cs.status_id) and (cs.type = 'cab')))) join payment_type payty on((bk.charge_type = payty.payment_type_id)))
                left join booking_estimation bkest on((bk.booking_id = bkest.booking_id)))
                left join booking_pickdrop_details bpd on((bk.booking_id = bpd.booking_id)))
                left join payment_transaction_response ptr on((bk.reference_number = ptr.mer_txn)))
                LEFT JOIN bank_details ON driver.id = bank_details.user_id
                LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
                LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type='driverS'
                left join company as ucompany ON driver.id = ucompany.user_id
                LEFT JOIN company AS user_company ON us.id = user_company.user_id
                left join company_setup as compset ON bk.company_id= compset.id
                left join user_info as us3 ON bk.client_id= us3.user_id
                left join user_info ON bk.user_id= user_info.user_id
                left join user_transaction as ut ON bk.booking_id= ut.booking_id AND ut.action_type='Credit'
                left join master_currency as mc ON compset.currency_id= mc.id
                left join payment_type as pt ON ut.payment_type_id= pt.payment_type_id
                left join master_city as mcity ON bpd.pickup_city= mcity.id
                LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingId
                LEFT JOIN local_package ON bk.package_id =local_package.id
                LEFT JOIN master_country ON us.nationality = master_country.id  `;
    let sql = ` where (1=1)  `;

    let wheres = `
                bk.booking_id AS id,
                bk.base_vehicle_id AS base_vehicle_id,
                bk.sac_code AS sac_code,
                bk.sac_description AS sac_description,
                bk.flight_number AS flight_number,
                bk.flight_time AS flight_time,
                bk.itinerary_id AS itinerary_id,
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
                concat(us.first_name, ' ', us.last_name) AS user_name,
                us.email,
                us.mobile as user_mobile,
                master_country.name as user_nationality ,
                user_info.alternate_mobile AS user_alt_mobile,
                user_info.gst_registration_number,
                cab_status.status as driver_status,
                bk.client_id,
                concat(us2.first_name, ' ', us2.last_name) AS clientname,
                us2.mobile as client_mobile,
                us2.email as client_email,
                us3.alternate_mobile as client_alt_mobile,
                bk.driver_id,
                concat(driver.first_name, ' ', driver.last_name) AS driver_name,
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
                payty.pay_type_mode AS charge_type,
                mvt.vehicle_type AS vehicle,
                bk.no_of_vehicles AS no_of_vehicles,
                mcoup.name AS coupon_name,
                DATE(bk.booking_date) AS booking_date,
                TIME(bk.booking_date) AS booking_time,
                bk.device_type,
                DATE_FORMAT(bk.booking_release_date, '%Y-%m-%d %H:%i:%s') as booking_release_date ,
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
                bkest.premiums_type ,
                bkest.premiums_value ,
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
                bkest.service_charge_cgst_amount,
                bkest.service_charge_igst_amount,
                bkest.service_charge_sgst_amount,
                bkest.service_charge_cgst,
                bkest.service_charge_igst,
                bkest.service_charge_sgst,
                bkest.service_charge_sac_code_id,
                bkest.service_charge_sac_code,
                service_charge_sac_code_description,
                concat(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
                bpd.pickup_area AS pickup_area,
                bpd.pickup_date,
                bpd.pickup_time,
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
                (bkest.estimated_final_price - ut.amount)  as booking_amt_balance ,
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
                ptr.signature   `;
    let total_count = await getStatementOfAccountCount(req, sql, joins);
    if (reference_number) {
      sql += ' AND bk.reference_number = "' + reference_number + '" ';
    }

    if (!!booking_type && booking_type && booking_type.length > 0) {
      sql += ' AND bk.master_package_id = "' + booking_type + '" ';
    }

    if (client_first_name) {
      sql += ' AND us2.first_name LIKE "%' + client_first_name + '%" ';
    }
    if (client_last_name) {
      sql += ' AND us2.last_name LIKE "%' + client_last_name + '%" ';
    }

    if (!!vehicle_type && vehicle_type && vehicle_type.length > 0) {
      sql += ' AND bk.master_vehicle_type_id= "' + vehicle_type + '" ';
    }

    if (city_name) {
      sql += ' AND bpd.pickup_city= "' + city_name + '" ';
    }

    if (booking_status) {
      sql += ' AND bk.status= "' + Number(booking_status) + '" ';
      console.log(booking_status);
    }

    if (from_date) {
      if (to_date) {
        sql +=
          ' AND bpd.pickup_date BETWEEN "' +
          from_date +
          '" AND "' +
          to_date +
          '"';
      } else {
        sql += ' AND date(bpd.pickup_date) >="' + from_date + '"';
      }
    }

    console.log(multi_vehicle_type, multi_vehicle_type, "multi_vehicle_type");

    if (!!multi_vehicle_type && multi_vehicle_type) {
      sql += " AND bk.master_vehicle_type_id IN(" + multi_vehicle_type + ") ";
    }

    if (!!multi_booking_type && multi_booking_type) {
      sql += " AND bk.master_package_id IN(" + multi_booking_type + ") ";
    }

    if (!!multi_city_name && multi_city_name) {
      sql += " AND bpd.pickup_city IN(" + multi_city_name + ") ";
    }

    if (partner_name) {
      sql += ' AND compset.com_name= "' + partner_name + '" ';
    }
    sql += " GROUP BY bk.itinerary_id";
    sql += " order by bk.booking_id desc";

    let filter_count = await getStatementOfAccountFilterCount(req, sql, joins);

    if (offset && limit) {
      sql += ` LIMIT ${Number(offset)}, ${Number(limit)}`;
    }

    let data = await getStatementOfAccountList(req, sql, joins, wheres);
    if (total_count <= 0) {
      total_count = 0;
    }
    if (filter_count <= 0) {
      filter_count = 0;
    }
    if (data.status !== "success") {
      data.data = [];
    }
    const resData = {
      data: data?.data,
      total_count: total_count?.data ? total_count?.data : 0,
      filter_count: filter_count?.data ? filter_count?.data : 0,
      limit_count: data?.data.length,
    };
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, resData);
  } catch (err) {
    console.log(err);
    return errorResponse(res, MESSAGES.GENERAL.DATA_UPDATED, err.message);
  }
};

export const getBilling = async (req, res) => {
  try {
    const {
      user_id,
      user_type_id,
      booking_id,
      payment_status,
      from_date: fromDate,
      to_date: toDate,
      billing_id,
    } = req.body;
    let sql = "SELECT * from view_booking_charge where 1=1 ";
    if (booking_id) {
      sql += ' AND reference_number = "' + booking_id + '" ';
    }

    if (user_id) {
      sql += ' AND user_id = "' + user_id + '" ';
    }
    if (user_type_id) {
      sql += ' AND user_type_id = "' + user_type_id + '" ';
    }

    if (billing_id) {
      sql += " AND id IN (" + billing_id + ")";
    }

    if (payment_status) {
      sql += ' AND is_paid = "' + payment_status + '" ';
    }

    if (fromDate && toDate) {
      sql +=
        ' AND date(AddedTime) >="' +
        fromDate +
        '" AND date(AddedTime) <="' +
        toDate +
        '"';
    } else if (fromDate) {
      sql += ' AND date(AddedTime) >="' + fromDate + '"';
    } else if (toDate) {
      sql += ' AND date(AddedTime) <="' + toDate + '"';
    }

    const [results] = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!results.length) {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
    return successResponse(res, MESSAGES.DRIVER.DRIVER_CLAIMED_LIST, data);
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const addInvoice = async (req, res) => {
  try {
    const insertedData = await addBookInvoice(req, res);
    const lastInsertId = insertedData.insertId;
    req.bookingInvoiceId = lastInsertId;
    const data = await addInvoiceBill(req, res);
    const updateInvoice = await updateInvoiceNo(req);
    return successResponse(res, MESSAGES.GENERAL.DATA_ADDED, data);
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const addBookInvoice = async (req, res) => {
  const { year, user_id, prefix, invoice_no, created_by, created_date } =
    req.body;

  try {
    const sql = `
      INSERT INTO booking_invoice
      (year, user_id, prefix, invoice_no, created_by, created_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await sequelize.query(sql, {
      replacements: [
        year,
        user_id,
        prefix,
        invoice_no,
        created_by,
        created_date,
      ],
      type: sequelize.QueryTypes.INSERT,
    });

    return { insertId: result };
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const addInvoiceBill = async (req, res) => {
  const { created_by, created_date, invoicebills } = req.body;
  const booking_invoice_id = req.bookingInvoiceId;

  try {
    if (!invoicebills || typeof invoicebills !== "string") {
      throw new Error("Missing or invalid invoicebills");
    }

    const billIds = invoicebills.split(",");
    const insertValues = [];

    for (let i = 0; i < billIds.length; i++) {
      insertValues.push([
        booking_invoice_id,
        billIds[i].trim(),
        created_by,
        created_date,
      ]);
    }

    const insertSql = `
      INSERT INTO booking_invoice_bill
      (booking_invoice_id, booking_charge_id, created_by, created_date)
      VALUES ?
    `;

    const insertedData = await sequelize.query(insertSql, {
      replacements: [insertValues],
      type: sequelize.QueryTypes.INSERT,
    });

    return insertedData;
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const updateInvoiceNo = async (req, res) => {
  const { invoicebills, invoice_number_format } = req.body;

  if (!invoicebills || typeof invoicebills !== "string") {
    return errorResponse(res, "Invalid or missing invoicebills.");
  }

  try {
    const billIds = invoicebills.split(",").map((id) => id.trim());
    let data = "";
    for (const id of billIds) {
      const sql = `UPDATE booking_charges SET invoice_number = ? WHERE id = ?`;

      data = await sequelize.query(sql, {
        replacements: [invoice_number_format, id],
        type: sequelize.QueryTypes.UPDATE,
      });
    }

    return data;
  } catch (err) {
    return errorResponse(res, "Failed to update invoice numbers.", err.message);
  }
};

export const updateBookingStatusData = async (req, res) => {
  try {
    const { booking_id, status_c } = req.body;

    if (!booking_id || status_c === undefined) {
      return errorResponse(
        res,
        "Booking ID and status are required",
        STATUS_CODE.BAD_REQUEST
      );
    }

    const updateData = { status: status_c };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const [affectedRows] = await Booking.update(updateData, {
      where: { booking_id },
    });

    if (affectedRows > 0) {
      return successResponse(res, "Booking status updated successfully");
    } else {
      return errorResponse(res, "No record updated", {}, STATUS_CODE.NOT_FOUND);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

// export const fetchBookingDetails = async (req) => {
//   try {
//     let userDataArray = [];
//     let prefDataArray = [];
//     let dutyDataArray = [];
//     let preferred_booking = "";
//     let ignition_type_id = "";
//     let vehicle_type_id = "";
//     let prefDataString = "";
//     let dutyDataString = "";

//     if (req.driver_id) {
//       // Fetch driver data
//       const userData = await getUserData(req);
//       if (userData.status === "success") {
//         userDataArray = userData.data[0];
//         preferred_booking = userDataArray.preferred_booking;
//         ignition_type_id = userDataArray.ignition_type_id;
//         vehicle_type_id = userDataArray.vehicle_type_id;
//       }

//       // Fetch driver preferred city data
//       const prefData = await prefDriveCityList(req);
//       if (prefData.status === "success") {
//         prefDataArray = prefData.data;
//         prefDataString = prefDataArray.map((item) => item.city_id).join(",");
//       }

//       // Fetch driver duty type list
//       const dutyData = await dutyTypeList(req);
//       if (dutyData.status === "success") {
//         dutyDataArray = dutyData.data;
//         dutyDataString = dutyDataArray.map((item) => item.package_id).join(",");
//       }
//     }

//     req.preferred_booking = preferred_booking;
//     req.ignition_type_id = ignition_type_id;
//     req.vehicle_type_id = vehicle_type_id;
//     req.pref_city = prefDataString;
//     req.multi_booking_type = dutyDataString;

//     // Fetch booking list data
//     const bookingData = await bookingUnassignedData(req);
//     if (bookingData.status === "success") {
//       return { status: "success", data: bookingData.data };
//     } else {
//       return { status: "failed", message: "No record found" };
//     }
//   } catch (error) {
//     console.error("Error fetching booking details:", error);
//     return { status: "failed", message: "An error occurred" };
//   }
// };

export const addquotationasync = async (req, res) => {
  let body = req.body;
  // req.body.user_id= req.user.id

  //console.log(req); return true;
  try {
    console.log("before addQuotation");
    var responsedata = await addQuotationData(req);
    console.log("after addQuotation");
    console.log({ responsedata: responsedata.booking_id });
    if (responsedata.booking_id) {
      var insertId = responsedata.booking_id;
      req.body.insertId = insertId;
            let travellerDetails = await addQuotationTravellerDetails(req);

      console.log({ insertId });
      var estimationRespdata = await addQuotationEstimation(req);

      if (!body.itinerary_id) {
        var responseItinerarydata = await addItineraryData(req);
        if (responseItinerarydata.id) {
          var insertId = responseItinerarydata.id;
          body.insertItineraryId = insertId;
          var updateBookingRefResp = await updateItineraryReferenceNo(req);
        }
      }
      console.log({ updateBookingRefResp });
      if (body.master_package_type == 2) {
        body.drop_address = body.drop_area;
      }

      /* Fare mode is point-to-point drop location will be pickup address and charge will be both side in Locahire Package */
      if (
        (body.dispatch_type == 1 || body.dispatch_type == 2) &&
        body.master_package_type == 1
      ) {
        body.drop_area = body.pickup_area;
        body.drop_address = body.pickup_address;
        body.drop_latitude = body.pickup_latitude;
        body.drop_longitude = body.pickup_longitude;
      }

      var pickdropResp = await addQuotationPickdrop(req);
      console.log({ pickdropResp });
      if (
        typeof body.coupon_code_id != "undefined" &&
        body.coupon_code_id != ""
      ) {
        var couponResp = await addUserCouponApply(req);
      }

      if (
        typeof body.sightseeing_details !== "undefined" &&
        body.sightseeing_details != ""
      ) {
        var s_seingResp = await addSightSeeingQuotationDetail(req);
      }

      if (
        typeof body.sightseeing_traveller_details !== "undefined" &&
        body.sightseeing_traveller_details != ""
      ) {
        var ss_traveller_resp = await addSightSeeingQuotationTravellerDetail(
          req
        );
      }

      if (typeof body.pickup_area !== "undefined" && body.pickup_area != "") {
        var m_location_resp = await addPickupLocation(req);
      }

      if (typeof body.drop_area !== "undefined" && body.drop_area != "") {
        var m_drop_resp = await addDropLocation(req);
      }

      if (
        typeof body.pickup_address !== "undefined" &&
        body.pickup_address != ""
      ) {
        var m_location_resp = await addPickupAddress(req);
      }

      if (typeof body.drop_address !== "undefined" && body.drop_address != "") {
        var m_location_resp = await addDropAddress(req);
      }

      if (typeof body.user_markup !== "undefined" && body.user_markup !== "") {
        var markupresp = await addQuotationMarkup(body);
      }

      var updateBookingRefResp2 = await updateQuotationReferenceNo(body);
      console.log({ responsedata });
      //await Booking.addBookingRegisterLog(req);   // Booking Register in log
    }
    return res
      .status(200)
      .json({ responsedata, updateBookingRefResp, ...updateBookingRefResp2 });
  } catch (err) {
    console.log(err);
  }
};
export const addQuotationTravellerDetails = async (req) => {
  try {
    console.log("objectHiiiiiiii")
    const { travellerDetails } = req.body;
    console.log({travellerDetails},"LLL")
    let booking_id = req.body.insertId;
    travellerDetails?.map(async (element) => {
      delete element.id;

   let resultraveler= await QuotationsTravellerDetails.create({...element,booking_id,ip:req.ip});
    console.log({resultraveler})
  })
  } catch (error) {
    console.error("Error adding quotation traveller details:", error);
    throw error;
  }
};
export const createFinalBooking = async (req, res) => {
  try {
    let itineraryId = "";
    if (req.body.quotation_itinerary_id) {
      itineraryId = req.body.quotation_itinerary_id;
    } else {
      itineraryId = "";
    }
    req.body.itinerary_id = itineraryId;
    if (req.body.useWallet == true) {
      deductWallet(req.user.id, req.body.booking_amt_paid);
    }
    let responsedata = {};
    if (!req.body.quotation_itinerary_id) {
      // Assuming addItineraryData and updateItineraryReferenceNo are imported helpers
      const responseItinerarydata = await addItineraryData(req);
      console.log(
        { responseItinerarydata: responseItinerarydata?.id },
        " addItineraryData response"
      );
      if (responseItinerarydata.id) {
        req.body.insertItineraryId = responseItinerarydata.id;
        const s = await updateItineraryData(req.body);

        req.body.itinerary_id = s?.data?.itinerary_id
          ? s.data.itinerary_id
          : "";
      }
    }

    let pickupDateTime = `${req.body.pickup_date} ${req.body.pickup_time}`;
    let dropDateTime = `${req.body.drop_date} ${req.body.drop_time}`;
    let day_count = 0;

    // Helper to add hours to a date
    function addHours(date, h) {
      return new Date(date.getTime() + h * 60 * 60 * 1000);
    }
    console.log(req.body.master_package_type, "master_package_type");
    if (req.body.master_package_type === 1) {
      const calDate = addHours(
        new Date(pickupDateTime),
        Number(req.body.min_pkg_hrs)
      );
      console.log({ pickupDateTime });
      req.body.drop_date = dateFormat(calDate, "yyyy-mm-dd");
      req.body.drop_time = dateFormat(calDate, "HH:MM:ss");
      if (req.body.local_pickup == 4) {
        day_count = req.body.local_no_of_days;
      } else {
        const pickup = new Date(pickupDateTime).getTime();
        const drop = new Date(
          `${req.body.drop_date} ${req.body.drop_time}`
        ).getTime();
        day_count = Math.round((drop - pickup) / (24 * 60 * 60 * 1000)) || 1;
      }
    } else if (
      req.body.master_package_type === 4 ||
      req.body.master_package_type === 3
    ) {
      day_count = 1;
    }
    console.log({ day_count });
    // Loop for days and vehicles
    if (day_count > 0) {
      for (let j = 0; j < day_count; j++) {
        if (req.body.no_of_vehicles > 1) {
          for (let i = 0; i < req.body.no_of_vehicles; i++) {
            responsedata = await addbookingasync_new(req, res);
          }
        } else {
          responsedata = await addbookingasync_new(req, res);
        }
      }
    } else {
      if (req.body.no_of_vehicles > 1) {
        for (let i = 0; i < req.body.no_of_vehicles; i++) {
          responsedata = await addbookingasync_new(req, res);
        }
      } else {
        responsedata = await addbookingasync_new(req, res);
      }
    }
    console.log({ responsedata });
    return successResponse(
      res,
      "Bookings created successfully",
      responsedata,
      200
    );
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      "Error creating multiple bookings",
      error.message,
      500
    );
  }
};
export const bookingList = async (req, res) => {
  try {
    const {
      pickup_date,
      pickup_time,
      unassigned_booking,
      assignedbooking,
      driver_id,
      user_id,
      from_date,
      to_date,
      booking_type,
      booking_id,
      user_mobile,
      status,
    } = req.body;

    let sql = `
      SELECT 
        bk.booking_id AS id,
        bk.itinerary_id AS itinerary_id,
        bk.company_id AS company_id,
        compset.com_name AS domain_name,
        compset.driver_min_balance,
        bk.driver_id AS driver_id,
        bk.reference_number AS ref,
        bk.status_c,
        bk.user_id,
        CONCAT(us.first_name, ' ', us.last_name) AS user_name,
        us.mobile AS user_mobile,
        bk.client_id,
        CONCAT(us2.first_name, ' ', us2.last_name) AS clientname,
        us2.mobile AS client_mobile,
        us.email AS user_email,
        us2.email AS client_email,
        bk.driver_id,
        CONCAT(driver.first_name, ' ', driver.last_name) AS driver_name,
        driver.gcm_id,
        vm.vehicle_no,
        vmodel.name AS vehicle_name,
        mpm.package_mode AS package_mode,
        bk.master_package_id AS booking_type_id,
        mp.name AS booking_type,
        mp.image AS booking_type_image,
        mp.icon AS booking_type_icon,
        payty.pay_type_mode AS charge_type,
        mvt.id AS vehicle_type_id,
        mvt.category_id AS vehicle_category_id,
        mvt.vehicle_type AS vehicle,
        bk.no_of_vehicles AS no_of_vehicles,
        mcoup.name AS coupon_name,
        DATE(bk.booking_date) AS booking_date,
        TIME(bk.booking_date) AS booking_time,
        DATE_FORMAT(bk.booking_release_date,'%Y-%m-%d %H:%i:%s') as booking_release_date,
        bk.device_type,
        bk.filter_data,
        cs.status AS status,
        bkest.booking_estimation_id AS booking_estimation_id,
        bkest.booking_id AS booking_id,
        bkest.estimated_time AS estimated_time,
        bkest.estimated_distance AS estimated_distance,
        bkest.estimateprice_before_discount AS estimateprice_before_discount,
        bkest.discount_price AS discount_price,
        bkest.estimated_final_price AS estimated_final_price,
        bkest.estimated_price_before_markup AS estimated_price_before_markup,
        bkest.approx_distance_charge AS approx_distance_charge,
        bkest.approx_after_km AS approx_after_km,
        bkest.approx_waiting_charge AS approx_waiting_charge,
        bkest.approx_waiting_minute AS approx_waiting_minute,
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
        mc.name AS city_name,
        booking_charges.driver_share_amt,
        booking_charges.comp_share_amt,
        booking_charges.partner_share_amt,
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
      FROM booking bk
      JOIN user us ON bk.user_id = us.id
      JOIN user us2 ON bk.client_id = us2.id
      LEFT JOIN user driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id AND vehm.user_id != 0
      LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model vmodel ON vm.id = vmodel.id
      JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
      JOIN master_package mp ON bk.master_package_id = mp.id
      JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
      JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
      JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN booking_estimation bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN payment_transaction_response ptr ON bk.reference_number = ptr.mer_txn
      LEFT JOIN company_setup compset ON bk.company_id = compset.id
      LEFT JOIN master_city mc ON bpd.pickup_city = mc.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      WHERE ((bk.status = 22 OR bk.status <= 8))
    `;

    const replacements = {};

    if (pickup_date) {
      sql += " AND bpd.pickup_date = :pickup_date";
      replacements.pickup_date = pickup_date;
    } else if (from_date && to_date) {
      sql +=
        " AND DATE(bpd.pickup_date) >= :from_date AND DATE(bpd.pickup_date) <= :to_date";
      replacements.from_date = from_date;
      replacements.to_date = to_date;
    } else {
      sql += " AND bpd.pickup_date >= CURDATE()";
    }

    if (pickup_time) {
      sql += " AND HOUR(bpd.pickup_time) = :pickup_time";
      replacements.pickup_time = pickup_time;
    }

    if (status) {
      sql += " AND cs.status_id = :status";
      replacements.status = status;
    }

    if (unassigned_booking === 1 || unassigned_booking === "1") {
      sql += " AND bk.driver_id = 0";
    }

    if (assignedbooking === 1 || assignedbooking === "1") {
      sql += " AND bk.driver_id > 0";
    }

    if (driver_id) {
      sql += " AND bk.driver_id = :driver_id";
      replacements.driver_id = driver_id;
    }

    if (user_id) {
      sql += " AND bk.user_id = :user_id";
      replacements.user_id = user_id;
    }

    if (booking_type) {
      sql += " AND bk.master_package_id = :booking_type";
      replacements.booking_type = booking_type;
    }

    if (booking_id) {
      sql += " AND bk.reference_number = :booking_id";
      replacements.booking_id = booking_id;
    }

    if (user_mobile) {
      sql += " AND us.mobile = :user_mobile";
      replacements.user_mobile = user_mobile;
    }

    if (typeof req.body.status !== "undefined") {
      sql += " AND bk.status = :req_status";
      replacements.req_status = req.body.status;
    }

    sql += " ORDER BY bk.booking_id DESC";

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return res.json({ status: "success", data: result });
    } else {
      return res.json({ error: "No Record Found", status: "failed" });
    }
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message, status: "failed" });
  }
};

export const bookingListData = async (req, res) => {
  try {
    const { id, ref_no, pickup_date, user_id } = req.body;

    let sql = `
      SELECT 
        bk.booking_id AS id,
        bk.itinerary_id AS itinerary_id,
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
        CONCAT(us.first_name,' ',us.last_name) AS user_name,
        us.email,
        us.mobile as user_mobile,
        master_country.name as user_nationality,
        user_info.alternate_mobile AS user_alt_mobile,
        user_info.gst_registration_number,
        cab_status.status as driver_status,
        bk.client_id,
        CONCAT(us2.first_name,' ',us2.last_name) AS clientname,
        us2.mobile as client_mobile,
        us2.email as client_email,
        mcn.nationality as client_nationality,
        us3.alternate_mobile as client_alt_mobile,
        bk.driver_id,
        CONCAT(driver.first_name,' ',driver.last_name) AS driver_name,
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
        payty.pay_type_mode AS charge_type,
        mvt.vehicle_type AS vehicle,
        bk.no_of_vehicles AS no_of_vehicles,
        mcoup.name AS coupon_name,
        DATE_FORMAT(bk.booking_date,'%Y-%m-%d %H:%i:%s') AS booking_date,
        TIME(bk.booking_date) AS booking_time,
        bk.device_type,
        DATE_FORMAT(bk.booking_release_date,'%Y-%m-%d %H:%i:%s') as booking_release_date,
        bk.placcard_name,
        bk.pickup_point,
        bk.inclusions_data,
        bk.exclusions_data,
        bk.fare_rule_data,
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
        bkest.service_charge AS service_charge,
        bkest.booking_cancellation_rule,
        CONCAT(bpd.pickup_date,' ',bpd.pickup_time) AS ordertime,
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
        booking_charges.driver_share_amt,
        booking_charges.comp_share_amt,
        booking_charges.partner_share_amt,
        local_package.name as local_pkg_name
      FROM booking bk
      LEFT JOIN user us ON bk.user_id = us.id
      LEFT JOIN user us2 ON bk.client_id = us2.id
      LEFT JOIN user driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping vehm ON bk.driver_id = vehm.user_id
      LEFT JOIN vehicle_master vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model vmodel ON vm.id= vmodel.id
      LEFT JOIN master_vehicle_type dmvt ON vmodel.id = dmvt.id
      LEFT JOIN master_package_mode mpm ON bk.master_package_mode_id = mpm.id
      LEFT JOIN master_package mp ON bk.master_package_id = mp.id
      LEFT JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon mcoup ON bk.coupon_id = mcoup.id
      LEFT JOIN cab_status cs ON bk.status = cs.status_id AND cs.type = 'cab'
      LEFT JOIN company_setup compset ON bk.company_id= compset.id
      LEFT JOIN master_currency mc ON compset.currency_id= mc.id
      LEFT JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN booking_estimation bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN bank_details ON driver.id = bank_details.user_id
      LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
      LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type='driverS'
      LEFT JOIN company as ucompany ON driver.id = ucompany.user_id
      LEFT JOIN company AS user_company ON us.id = user_company.user_id
      LEFT JOIN user_info as us3 ON bk.client_id= us3.user_id
      LEFT JOIN user_info ON bk.user_id= user_info.user_id
      LEFT JOIN user_transaction as ut ON bk.booking_id= ut.booking_id
      LEFT JOIN payment_type as pt ON ut.payment_type_id= pt.payment_type_id
      LEFT JOIN master_city as mcity ON bpd.pickup_city= mcity.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      LEFT JOIN local_package ON bk.package_id =local_package.id
      LEFT JOIN master_country ON us.nationality = master_country.id
      LEFT JOIN master_country as mcn ON us2.nationality = mcn.id
      WHERE 1=1
    `;

    const replacements = {};

    if (id) {
      sql += " AND bk.booking_id = :id";
      replacements.id = id;
    }
    if (pickup_date) {
      sql += " AND bpd.pickup_date = :pickup_date";
      replacements.pickup_date = pickup_date;
    }
    if (ref_no) {
      sql += " AND bk.reference_number = :ref_no";
      replacements.ref_no = ref_no;
    }
    if (user_id) {
      sql += " AND bk.user_id = :user_id";
      replacements.user_id = user_id;
    }

    sql += " GROUP BY bk.booking_id ORDER BY bk.booking_id DESC";

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return res.json({ status: "success", data: result });
    } else {
      return res.json({ error: "No Record Found", status: "failed" });
    }
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message, status: "failed" });
  }
};

export const listBookingData = async function (req, res) {
  try {
    var bookingrecord = await fetchBookingData(req.body);
    if (bookingrecord.status === "success") {
      var result = bookingrecord.data;
      //console.log(result); return true;
      //var resp = result[0];
      var resp = result;
              var travellerDetails = await getTravellerBookingDetails(result[0].id);
console.log({travellerDetails})
      if (resp.booking_type_id === 4) {
        var outstationDetails = await getOutstationBookingDetails(result[0].id);
        if (outstationDetails.status === "success") {
          resp.traveller_details = outstationDetails;
        }
      }
      if (resp.booking_type_id === 6) {
        var travellerDetails = getTravellerBookingDetails(result[0].id);
        if (travellerDetails.status === "success") {
          resp.traveller_details = travellerDetails;
        }
        var sightseeingDetails = await getSightseeingBookingDetails(
          result[0].id
        );
        if (sightseeingDetails.status === "success") {
          resp.sightseeing_details = sightseeingDetails;
        }
      }
      resp[0].travellerDetails = travellerDetails?.data;
      var respdata = { status: "success", ...resp,travellerDetails:travellerDetails?.data };
      return successResponse(res, "SUCCESS", resp, 200);
    } else {
      // var respdata = { status: 'failed', 'message': 'No record found' };
      return errorResponse(res, MESSAGES.GENERAL.NOT_FOUND, null, 404);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, MESSAGES.GENERAL.SOMETHING_WENT_WRONG, null, 500);
  }
};
export const quotationItineraryList = async (req, res) => {
  try {
    let { status, itinerary_id } = req.query;
    let user_id = req.user.id;
    if (!status) status = 28;
    console.log({ user_id });
    let sql = `
      SELECT 
        bk.booking_id AS id,
        bk.itinerary_id AS itinerary_id,
        bk.outstation_module_type AS module_type,
        bk.reference_number AS ref,
        DATE(bk.booking_date) AS booking_date,
        TIME(bk.booking_date) AS booking_time,
        CONCAT(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
        bk.master_package_id AS booking_type_id,
        mp.name AS booking_type,
        bkest.estimated_final_price AS amount,
        mc.name AS city_name,
        bk.master_package_id AS booking_type_id,
        mvt.vehicle_type AS vehicle
      FROM quotation AS bk
      LEFT JOIN quotation_pickdrop_details AS bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN quotation_estimation AS bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN master_package AS mp ON bk.master_package_id = mp.id
      LEFT JOIN master_city AS mc ON bpd.pickup_city = mc.id
      LEFT JOIN master_vehicle_type AS mvt ON bk.master_vehicle_type_id = mvt.id
      WHERE 1=1
    `;

    const replacements = {};

    if (user_id) {
      sql += " AND bk.user_id = :user_id";
      replacements.user_id = user_id;
    }

    if (typeof status !== "undefined" && status !== "") {
      sql += " AND bk.status = :status";
      replacements.status = status;
    }

    if (itinerary_id) {
      sql += " AND bk.itinerary_id = :itinerary_id";
      replacements.itinerary_id = itinerary_id;
    }

    sql += " AND bk.quotation_status = 1 ORDER BY bk.booking_id ASC";

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return res.json({ status: "success", data: result });
    } else {
      return res.json({ error: "No Record Found", status: "failed" });
    }
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message, status: "failed" });
  }
};

export const getRecentBookings = async (req, res) => {
  try {
    let { id, pickup_date, user_id } = req.query;
    user_id = req.user.id;
    let sql = `
      SELECT 
        bk.booking_id AS id,
        bk.itinerary_id AS itinerary_id,
        bk.reference_number AS ref,
        CONCAT(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
        bk.master_package_id AS booking_type_id,
        mp.name AS booking_type,
        bpd.pickup_address AS departure,
        bpd.drop_area,
        cs.status AS status,
        mvt.vehicle_type AS vehicle,
        local_package.name AS local_pkg_name
      FROM booking bk
      LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN master_package mp ON bk.master_package_id = mp.id
      LEFT JOIN cab_status cs ON (bk.status = cs.status_id AND cs.type = 'cab')
      LEFT JOIN master_vehicle_type mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN user us ON bk.user_id = us.id
      LEFT JOIN local_package ON bk.package_id = local_package.id
      WHERE 1=1
    `;
    const replacements = {};

    if (typeof id !== "undefined") {
      sql += " AND bk.booking_id = :id";
      replacements.id = id;
    }
    if (typeof pickup_date !== "undefined" && pickup_date !== "") {
      sql += " AND bpd.pickup_date >= CURDATE()";
    }
    if (typeof user_id !== "undefined" && user_id !== "") {
      sql += " AND (bk.user_id = :user_id OR us.parent_id = :user_id)";
      replacements.user_id = user_id;
    }

    sql += " ORDER BY bpd.pickup_date DESC LIMIT 0,20";

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return res.json({ status: "success", data: result });
    } else {
      return res.json({ error: "No Record Found", status: "failed" });
    }
  } catch (err) {
    console.error(err);
    return res.json({ error: err.message, status: "failed" });
  }
};
export const cancelBookingByUser = async (req, res) => {
  try {
    let {
      client_wallet_amount,
      user_id,
      itinerary_id,
      booking_id,
      created_by,
      cancellationCharges,
      estimated_final_price,
      status,
      ip,
      // driver_id,
      reason,
      type,
    } = req.body;
    status = String(status);
    const booking = await sequelize.query(
      `CALL sp_w_a_booking_information(:bookingId)`,
      {
        replacements: { bookingId: booking_id },
        type: sequelize.QueryTypes.RAW,
      }
    );
    console.log(booking, "booking");
    if (!booking) {
      return errorResponse(res, MESSAGES.BOOKING.NOT_FOUND, 404);
    }
    if (String(booking[0].status_id) === "10") {
      return successResponse(res, "BOOKING_ALREADY_CANCELLED");
    }
    const validStatuses = ["20", "16", "17", "24", "29", "30"];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, MESSAGES.BOOKING.INVALID_STATUS, 400);
    }
    let [bookingDetail] = await getBookingInfo(booking_id);
    const cancellationCharge = await getLowestCancellationRule(
      bookingDetail?.booking_cancellation_rule
    );
    console.log({ cancellationCharge });
    const creditNoteAmount =
      Number(bookingDetail.estimated_final_price) - cancellationCharge;
    // let creditNoteAmount = bookingDetail.estimated_final_price;

    // const creditNoteType = "Fully Credit";
    const creditNoteType =
      cancellationCharge > 0 ? "Partially Credit" : "Fully Credit";
    const currentDate = new Date();
    const creditNote = await UserCreditNote.create({
      user_id: bookingDetail.user_id,
      booking_id,
      booking_amount: bookingDetail.estimated_final_price,
      cancellation_charge: cancellationCharge,
      credit_note_amount: creditNoteAmount,
      credit_note_type: creditNoteType,
      booking_amount: bookingDetail?.estimated_final_price,
      created_by: bookingDetail?.user_id,
      created_date: new Date(),
      ip: req.ip,
      cancellation_charge: cancellationCharge,
    });
    // const creditNote = await insertUserCreditNote({user_id:bookingDetail.user_id,booking_id,booking_amount:bookingDetail.estimated_final_price,cancellation_charge:cancellationCharge,credit_note_amount:creditNoteAmount,credit_note_type:creditNoteType,booking_amount:bookingDetail?.estimated_final_price,created_by:bookingDetail?.user_id,created_date:new Date(),ip:req.ip,cancellation_charge:cancellationCharge});
    console.log({ creditNote });
    const companyInfo = await CompanySetup.findOne({
      where: { id: 1 },
    });
    let booking_transaction_no = bookingDetail.reference_number;
    created_by = bookingDetail.user_id;
    user_id = bookingDetail.user_id;
    console.log({ yser: bookingDetail.user_id });
    const wallet = await User.findOne({
      where: { id: bookingDetail.user_id },
      attributes: [
        "wallet_amount",
        [
          Sequelize.literal(`(
                       SELECT 
                           SUM(CASE WHEN ut.action_type = 'Credit' THEN ut.amount ELSE 0 END)
                           - SUM(CASE WHEN ut.action_type = 'Debit' THEN ut.amount ELSE 0 END)
                       FROM user_transaction ut
                       WHERE ut.user_id = user.id
                   )`),
          "credit_balance",
        ],
      ],
      raw: true, // This returns plain JavaScript object instead of Sequelize model instance
    });
    console.log({ wallet: wallet.wallet_amount });
    const credit_note_ref_no = await getBookingRefNo(
      creditNote,
      companyInfo.credit_note_prefix
    );
    console.log(credit_note_ref_no, "credit_note_ref_no");
    await creditNote.update({ credit_note_ref_no });

    const wallet_amount = Number(wallet.wallet_amount) + creditNoteAmount;
    await UserTransaction.create({
      user_id,
      itinerary_id,
      booking_id,
      booking_transaction_no: credit_note_ref_no,
      action_type: "Credit",
      amount: creditNoteAmount,
      payment_type_id: "2",
      payment_status: "1",
      current_balance: wallet_amount,
      created_by,
      created_date: Date.now().toLocaleString(),
    });
    InsertWallet(bookingDetail.user_id, creditNoteAmount);
    await Promise.all([
      Booking.update({ status }, { where: { booking_id } }),
      // Driver.update({ status: 0 }, { where: { user_id: driver_id } }),
      // BookingRegistered.create({
      //   bookingid: booking_id,
      //   driverId: driver_id,
      //   updateOn: currentDate,
      //   reason: reason || "Already Booked New car",
      //   status: "C",
      //   type: type || "By Un-Assigned Booking",
      //   read_status: "0",
      // }),
    ]);
    return successResponse(res, MESSAGES.BOOKING.BOOKING_HAS_CANCELLED);
  } catch (error) {
    console.log(error);
  }
};

export const recetUnasignedBooking = async (req, res) => {
  try {
    let sql = `SELECT * FROM vw_booking_list WHERE pickup_date >= curdate() ORDER BY id`;

    const enrichedBookings = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    return res.json({
      draw: [],
      iTotalRecords: [],
      iTotalDisplayRecords: [],
      data: enrichedBookings,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export async function sendNewsletter() {
  try {
    const email = req.user.email;
    const first_name = req.user.first_name;
    const last_name = req.user.last_name;
    if (!email) {
      throw new Error("Email address is required for testing");
    }
    const subscribeUrl = `https://localhost:5000/api/newsletter/subscribe-email-for-mail?email=${encodeURIComponent(
      email
    )}`;
    const unsubscribeUrl = `https://localhost:5000/api/newsletter/subscribe-email-for-mail?email=${encodeURIComponent(
      email
    )}`;
    await sendEmail("ahmedabad", "ytabhay207@gmail.com", {
      name: "Ahmedabad",
      subscribe: subscribeUrl,
      unsubscribe: unsubscribeUrl,
    });

    await sendEmail("bangalore", "ytabhay207@gmail.com", {
      name: "Bangalore",
      subscribe: subscribeUrl,
      unsubscribe: unsubscribeUrl,
    });

    console.log("All test emails sent successfully");
    return true;
  } catch (error) {
    console.error("Error in test email sequence:", error);
    return false;
  }
}
