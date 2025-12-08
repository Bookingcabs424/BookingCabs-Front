import Driver from "../models/driverModel.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import { successResponse, errorResponse } from "../utils/response.js";
import BookingRegistered from "../models/bookingRegistedModel.js";
import ApiCallInterval from "../models/apiCallIntervalModel.js";
import DriverBookingDataView from "../views/driverBookingDataView.js";
import Booking from "../models/bookingModel.js";
import { walletAmountService } from "./walletController.js";
import ViewDriverVehicleMap from "../views/viewDriverVechicleMapView.js";
import { getFareCalculation, seqPurchasePrice } from "./localHireController.js";
import { sendTemplatedSMS, processUploadedFile } from "../utils/helpers.js";
import sequelize from "../config/clientDbManager.js";
import BookingCharges from "../models/bookingChargesModel.js";
import BookingLogs from "../models/bookingLogsModel.js";
import dateFormat from "dateformat";
import MasterDocumentType from "../models/masterDocumentModel.js";

import DriverLocation from "../models/driverLocationModel.js";
import UserCurrentLocation from "../models/userCurrentLocationModel.js";
import BookingPickDropDetails from "../models/bookingPickDropDetailsModel.js";
import { Op } from "sequelize";
import VendorStatus from "../models/vendorStatusModel.js";
import BookingTracker from "../models/bookingTrackerModel.js";
import { userTransaction } from "./paymentController.js";
import TripComment from "../models/tripCommentModel.js";
import {
  bookingTravelDetails,
  addBookingActualDetails,
  addBookingActualPickDropDetails,
} from "./bookingContoller.js";
import DriverRating from "../models/driverRatingModel.js";
import User from "../models/userModel.js";
import UserUploadDocument from "../models/userUploadDocumentModel.js";
export const driverStatus = async (req, res) => {
  const { user_id } = req.user;
  try {
    const driverStatus = await Driver.findOne({ where: { user_id: user_id } });
    if (!driverStatus) {
      return errorResponse(
        res,
        MESSAGES.DRIVER.DRIVER_NOT_FOUND,
        MESSAGES.DRIVER.DRIVER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    return successResponse(res, MESSAGES.DRIVER.ONLINE_DRIVER_STATUS, {
      status: driverStatus?.status ?? null,
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

export const bookingReadStatus = async (req, res) => {
  try {
    const { user_id } = req.body;
    const booking = await BookingRegistered.findOne({
      where: { driverId: user_id },
    });

    if (!booking) {
      return errorResponse(
        res,
        MESSAGES.DRIVER.DRIVER_NOT_FOUND,
        MESSAGES.DRIVER.DRIVER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    const unreadCount = booking.unreadCount;

    return successResponse(res, MESSAGES.DRIVER.ONLINE_DRIVER_STATUS, {
      unreadCount,
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

export const apiCallInterval = async (req, res) => {
  const apiCallInterval = await ApiCallInterval.findAll({
    where: { package_id: 0 },
  });
  if (!apiCallInterval) {
    return errorResponse(
      res,
      MESSAGES.DRIVER.Api_Call_Interval_Not_Found,
      MESSAGES.DRIVER.Api_Call_Interval_Not_Found,
      STATUS_CODE.NOT_FOUND
    );
  }
  return successResponse(res, MESSAGES.DRIVER.Api_Call_Interval, {
    api_time: apiCallInterval.api_time,
    api_distance: apiCallInterval.api_distance,
  });
};

export const driverBookingData = async (req, res) => {
  try {
    const driverBookingData = await DriverBookingDataView.findAll();
    if (!driverBookingData) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    return successResponse(res, MESSAGES.DRIVER.ONLINE_DRIVER_STATUS, {
      booking_details: driverBookingData,
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

export const driverStatusSequential = async (req, res) => {
  try {
    const statusdata = await driverStatus(req, res);
    const unreaddata = await bookingReadStatus(req, res);
    const apicall = await apiCallInterval(req, res);
    const driverbookings = await driverBookingData(req, res);
    let finalObj = {};
    if (statusdata.driverStatus == 0) {
      finalObj = {
        status: "false",
        msg: "free",
        api_time: apicall.api_time,
        api_distance: apicall.api_distance,
      };
    } else {
      finalObj = {
        status: "true",
        msg: "hired",
        booking_details: driverbookings,
      };
    }
    finalObj.unreadCount = unreaddata.unreadCount;
    return successResponse(res, MESSAGES.DRIVER.SEQUENTIAL, {
      finalObj,
    });
  } catch (e) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      e.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const cancelDriverUpdateBookingStatus = async (req, res) => {
  try {
    const { booking_id, driver_id, status } = req.body;

    const [updatedRows] = await Booking.update(
      {
        status: status,
        driver_id: driver_id,
      },
      {
        where: {
          booking_id: booking_id,
        },
      }
    );

    if (updatedRows === 0) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    return successResponse(res, MESSAGES.DRIVER.DRIVER_UPDATED, {
      booking_id,
      status,
      driver_id,
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

export const updateDriverStatus = async (req, res) => {
  try {
    const { driver_id, status } = req.body;

    const [updatedRows] = await Driver.update(
      {
        status: status,
      },
      {
        where: {
          user_id: driver_id,
        },
      }
    );

    if (updatedRows === 0) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    return successResponse(res, MESSAGES.DRIVER.DRIVER_UPDATED, {
      user_id,
      status,
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

export const insertBookingRegistry = async (req, res) => {
  try {
    const { booking_id, driver_id, reason, status, type } = req.body;

    const newBookingRegistry = await BookingRegistered.create({
      bookingid: booking_id,
      driverId: driver_id,
      reason: reason,
      status: "C",
      type: type,
      updateOn: new Date(),
    });

    return successResponse(res, MESSAGES.DRIVER.DRIVER_UPDATED, {
      newBookingRegistry,
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

export const bookingStatus = async (req, res) => {
  const { booking_id } = req.body;
  try {
    const bookingStatus = await Booking.findOne({
      where: { booking_id: booking_id },
    });
    if (!bookingStatus) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    return successResponse(res, MESSAGES.DRIVER.ONLINE_DRIVER_STATUS, {
      status: bookingStatus?.status ?? null,
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

export const cancelDriverBookingStatus = async (req, res) => {
  try {
    const bookingStatusResult = await bookingStatus(req);

    if (bookingStatusResult.status === "success") {
      const currentStatus = bookingStatusResult?.data?.[0]?.status_id;

      if (currentStatus !== 10) {
        await cancelDriverUpdateBookingStatus(req);
        await updateDriverStatus(req);
        await insertBookingRegistry(req);

        return successResponse(res, MESSAGES.BOOKING.BOOKING_CANCELLED);
      } else {
        return errorResponse(
          res,
          MESSAGES.GENERAL.NOT_FOUND,
          MESSAGES.GENERAL.NOT_FOUND,
          STATUS_CODE.NOT_FOUND
        );
      }
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        MESSAGES.BOOKING.BOOKING_STATUS_FAILED,
        STATUS_CODE.BAD_REQUEST
      );
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

export const getBookingStatus = async (req, res, isInternalCall = false) => {
  try {
    const { booking_id } = req.body;

    const bookingStatus = await Booking.findOne({
      where: { booking_id },
      attributes: ["status"],
    });

    if (!bookingStatus) {
      const msg = MESSAGES.GENERAL.NOT_FOUND;
      return errorResponse(res, msg, msg, STATUS_CODE.NOT_FOUND);
    }

    const statusArray = [16, 17, 20];
    const bookingStatusId = bookingStatus.status;

    const isCancelled = statusArray.includes(bookingStatusId);

    if (isInternalCall) {
      return isCancelled;
    }

    return successResponse(
      res,
      isCancelled
        ? MESSAGES.BOOKING.BOOKING_CANCELLED
        : MESSAGES.BOOKING.BOOKING_CAN_ACCEPTED
    );
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const checkDriverBalance = async (req, res, isInternalCall = false) => {
  try {
    const id = isInternalCall ? req : req.user.id;
    let userCreditData = await walletAmountService(id);
    if (!userCreditData) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    if (userCreditData) {
      // userCreditData.credit_balance = 2000;
      if (userCreditData[0]?.credit_balance <= 500) {
        return { message: MESSAGES.WALLET.INSUCIENT_BALANCE };
      } else {
        return {
          message: MESSAGES.DRIVER.DRIVER_BALANCE,
          userCreditData,
        };
      }
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

export const getAcceptDriverBooking = async (
  req,
  res,
  isInternalCall = false
) => {
  const { booking_id, driver_id } = isInternalCall ? req : req.body;

  if (!booking_id || !driver_id) {
    return errorResponse(
      res,
      "Missing booking_id or driver_id",
      null,
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    // Step 0: Check if booking already has status 3 (already booked)
    const [bookingCheck] = await sequelize.query(
      `SELECT status FROM booking WHERE booking_id = :booking_id`,
      { replacements: { booking_id } }
    );
    if (bookingCheck.length && bookingCheck[0].status == "3") {
      const message = "Booking is already confirmed with a driver.";
      if (isInternalCall) return { error: message, status: false };
      return errorResponse(res, message, null, STATUS_CODE.BAD_REQUEST);
    }

    // Step 1: Update booking if it's unassigned and status = '1'
    await sequelize.query(
      `
      UPDATE booking b
      SET 
        b.driver_id = :driver_id,
        b.status = '3',
        b.is_updation_allow = 'FALSE'
      WHERE 
        b.booking_id = :booking_id
        AND b.driver_id = 0
        AND b.booking_status = '1'
      `,
      { replacements: { booking_id, driver_id } }
    );

    // Step 2: Fetch updated booking info along with driver name
    const [result] = await sequelize.query(
      `
      SELECT 
        b.booking_id,
        mp.name AS BookingTypeVal,
        mvt.vehicle_type AS vehicleType,
        u.first_name AS driverName,
        CASE WHEN b.driver_id = :driver_id THEN 1 ELSE 0 END AS is_stack
      FROM booking b
      LEFT JOIN master_package mp ON b.master_package_id = mp.id
      LEFT JOIN master_vehicle_type mvt ON b.master_vehicle_type_id = mvt.id
      LEFT JOIN user u ON u.id = b.driver_id
      WHERE b.booking_id = :booking_id
      `,
      { replacements: { booking_id, driver_id } }
    );
    console.log({ result });
    if (isInternalCall) {
      return result;
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
  } catch (error) {
    console.error("getAcceptDriverBooking Error:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const isCabTypedMacthed = async (req, res) => {
  const { driverId, booking_vehicle } = req.body;

  try {
    const [results] = await query(
      `
      SELECT mvt.vehicle_type AS cabType
      FROM user_vehicle_mapping uvm
      LEFT JOIN vehicle_master vm ON vm.id = uvm.vehicle_master_id
      LEFT JOIN master_vehicle_model mvm ON mvm.id = vm.vehicle_model_id
      LEFT JOIN master_vehicle_type mvt ON mvt.id = mvm.vehicle_type_id
      WHERE uvm.user_id = :driverId
      LIMIT 1;
    `,
      {
        replacements: { driverId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!results) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        error.message,
        STATUS_CODE.NOT_FOUND
      );
    }
    const matched = results.cabType === booking_vehicle;

    return successResponse(res, MESSAGES.DRIVER.CAB_TYPE_MACHED, {
      matched,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const bookingFetchInfo = async (req, res) => {
  const { booking_id } = req.body;

  try {
    const result = await sequelize.query(
      `CALL sp_book_fetch_info(:booking_id)`,
      {
        replacements: { booking_id },
      }
    );

    return result[0];
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const acceptBookingUpdateStatus = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  const { booking_id, id } = req.body;

  if (!booking_id || !id) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.INVALID_REQUEST,
      "booking_id and id are required",
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const procedureResult = await sequelize.query(
      `CALL accept_booking_status(:booking_id, :id)`,
      {
        replacements: { booking_id, id },
      }
    );

    if (!procedureResult || procedureResult.length === 0) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        "No result returned from stored procedure.",
        STATUS_CODE.NOT_FOUND
      );
    }
    if (isInternalCall) {
      return procedureResult;
    } else {
      return successResponse(
        res,
        MESSAGES.BOOKING.BOOKING_ACCEPTED,
        procedureResult
      );
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

export const getUserVehicleDetails = async (req, res) => {
  const { id: user_id } = req.user;

  if (!user_id) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.USER_ID_MANDATORY,
      MESSAGES.GENERAL.USER_ID_MANDATORY,
      STATUS_CODE.SERVER_ERROR
    );
  }

  try {
    // const vehicleDetails = await ViewDriverVehicleMap.findOne({
    //   where: { user_id },
    // });

    const vehicleDetails = await ViewDriverVehicleMap.findOne();

    if (!vehicleDetails) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.RECORD_NOT_FOUND,
        MESSAGES.GENERAL.RECORD_NOT_FOUND,
        STATUS_CODE.SERVER_ERROR
      );
    }

    return vehicleDetails;
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateDriverVehicle = async (req, res) => {
  const { vehicle_master_id, booking_id } = req.body;

  if (!vehicle_master_id || !booking_id) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const [updated] = await Booking.update(
      { vehicle_master_id },
      { where: { booking_id } }
    );

    if (updated === 0) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.BOOKING.BOOKING_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    return updated;
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
// route driverAcceptFutureBooking
export const driverAcceptFutureBooking = async (
  req,
  res,
  isInternalCall = false
) => {
  if (typeof isInternalCall === "function") {
    isInternalCall = false;
  }
  const {
    user_id,
    booking_id,
    start_time,
    end_time,
    created_by,
    created_date,
    ip,
  } = isInternalCall ? req : req.body;
  try {
    const insertSql = VendorStatus.create({
      user_id,
      booking_id,
      start_date: start_time,
      end_date: end_time,
      created_by: user_id,
      created_date: new Date(),
      modified_by: 0,
      modified_date: new Date(),
      vendor_status: 0,
      status: 0,
      ip,
    });

    if (!insertSql) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    if (isInternalCall) {
      return insertSql;
    }
    return successResponse(res, MESSAGES.DRIVER.DRIVER_FUTURE_ACCEPTED_JOB, {
      insertSql,
    });
  } catch (error) {
    if (insertSql) {
      throw error;
    }
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const isCabTypeMatched = async (driverId, booking_vehicle) => {
  const results = await sequelize.query(
    `
    SELECT 
      master_vehicle_type.id, 
      master_vehicle_type.vehicle_type AS CabType, 
      master_vehicle_model.name AS vehicle_name 
    FROM user_vehicle_mapping
    LEFT JOIN vehicle_master 
      ON vehicle_master.vehicle_master_id = user_vehicle_mapping.vehicle_master_id 
    LEFT JOIN master_vehicle_model 
      ON vehicle_master.id = master_vehicle_model.id 
    LEFT JOIN master_vehicle_type  
      ON master_vehicle_model.vehicle_type_id = master_vehicle_type.id 
    WHERE user_vehicle_mapping.user_id = :driverId
  `,
    {
      replacements: { driverId },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  if (!results || results.length === 0) return false;

  return results.some((vehicle) => vehicle.CabType === booking_vehicle);
};

export const updateVendorId = async (bookingId) => {
  try {
    const affectedRows = await Booking.update(
      { status: 3 },
      {
        where: { booking_id: bookingId },
      }
    );

    return affectedRows;
  } catch (err) {
    throw err;
  }
};

export const vendorAcceptJob = async (req, res) => {
  try {
    const { booking_id, id } = req.body;
    const bookingStatus = await getBookingStatus(req, res, true);
    if (!bookingStatus) {
      let booking = {};
      const result = await updateVendorId(booking_id);

      if (result) {
        const purchaseData = await seqPurchasePrice(req, res); // Use less method
        const driverBalance = await checkDriverBalance(id, res, true);
        if (driverBalance.message != MESSAGES.WALLET.INSUCIENT_BALANCE) {
          /*
          let bookingType = data[0].BookingTypeVal;
          let vehicleType = data[0].vehicleType;
          let isMatchedCabType = await isCabTypeMatched(id, vehicleType);
          let drivervehicle = isMatchedCabType.CabType;
          */

          const bookingFetchInfoData = await bookingFetchInfo(req, res);

          let pickUpDate = bookingFetchInfoData?.pickup_date
            ? dateFormat(bookingFetchInfoData?.pickup_date, "yyyy-mm-dd")
            : null;
          let dropDate = bookingFetchInfoData?.drop_date
            ? dateFormat(bookingFetchInfoData?.drop_date, "yyyy-mm-dd")
            : null;
          let dropTime =
            bookingFetchInfoData?.drop_time != null
              ? bookingFetchInfoData?.drop_time
              : "00:00:00";

          booking.PerKmCharges = String(bookingFetchInfoData?.approx_after_km);
          booking.ignore_km = String(bookingFetchInfoData?.approx_after_km);
          booking.ignore_hour = String(bookingFetchInfoData?.approx_after_hour);
          booking.per_km_charge = String(
            bookingFetchInfoData?.approx_distance_charge
          );
          booking.per_hr_charge = String(
            bookingFetchInfoData?.approx_hour_charge
          );
          booking.PerHrCharges = bookingFetchInfoData?.local_package_hrs;
          booking.NightChargesBy = bookingFetchInfoData?.night_rate_type;
          booking.booking_reference = bookingFetchInfoData?.ref;
          booking.name = bookingFetchInfoData?.user_name;
          booking.user_email = bookingFetchInfoData?.user_email;
          booking.booking_id = bookingFetchInfoData?.id;
          booking.booking_type = bookingFetchInfoData?.booking_type;
          booking.booking_type_id = bookingFetchInfoData?.booking_type_id;
          booking.configPackageNo = String(
            bookingFetchInfoData?.master_package_mode_id
          );
          booking.Sub_Package_Id = String(
            bookingFetchInfoData?.master_package_mode_id
          );
          booking.CarTypeValue = bookingFetchInfoData?.vehicle;
          booking.pickup_area = bookingFetchInfoData?.pickup_area;
          booking.pickup_address = bookingFetchInfoData?.pickup_address;
          booking.pickup_location = bookingFetchInfoData?.pickup_area;
          booking.drop_address = bookingFetchInfoData?.drop_address;
          booking.drop_location = bookingFetchInfoData?.drop_area;
          booking.pickup_latitude = bookingFetchInfoData?.pickup_latitude;
          booking.pickup_longitude = bookingFetchInfoData?.pickup_longitude;
          booking.drop_latitude = bookingFetchInfoData?.drop_latitude;
          booking.drop_longitude = bookingFetchInfoData?.drop_longitude;
          booking.pickup_date = pickUpDate;
          booking.pickup_time = bookingFetchInfoData?.pickup_time;
          booking.estimatedTime = bookingFetchInfoData?.pickup_time;
          booking.per_distance_charge = String(
            bookingFetchInfoData?.approx_distance_charge
          );
          booking.mobile_no = bookingFetchInfoData?.mobile;
          booking.drop_distance = String(
            bookingFetchInfoData?.estimated_distance
          );
          booking.estimatedTotalBill = String(
            bookingFetchInfoData?.estimated_final_price
          );
          booking.night_rate_begins = String(
            bookingFetchInfoData?.night_rate_begins
          );
          booking.night_rate_ends = String(
            bookingFetchInfoData?.night_rate_ends
          );
          booking.NightCharges = String(
            bookingFetchInfoData?.night_charge_price
          );
          booking.MinimumCharge = String(bookingFetchInfoData?.minimum_charge);
          booking.WaitingCharge_per_minute = String(
            bookingFetchInfoData?.approx_waiting_charge
          );
          booking.Waiting_minutes = String(
            bookingFetchInfoData?.approx_waiting_minute
          );
          booking.send_time = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
          booking.min_distance = String(bookingFetchInfoData?.approx_after_km);
          booking.basicTax = String(
            bookingFetchInfoData?.cgst_tax +
              bookingFetchInfoData?.igst_tax +
              bookingFetchInfoData?.sgst_tax
          );
          booking.pickup_distance = "";
          booking.booking_hours = bookingFetchInfoData?.local_package_id;
          booking.measure = "Km";
          booking.currency = "INR";
          booking.charge_type = bookingFetchInfoData?.charge_type;
          booking.extras = String(bookingFetchInfoData?.extras);
          booking.extraPrice = String(bookingFetchInfoData?.extra_price);
          booking.peakTimeValue = String(bookingFetchInfoData?.peak_time_value);
          booking.peakTimePrice = String(bookingFetchInfoData?.peak_time_price);
          booking.WaitingFreeMin = String(
            bookingFetchInfoData?.approx_waiting_minute
          );
          booking.WaitingAfterCharge = String(
            bookingFetchInfoData?.approx_waiting_charge
          );
          booking.WaitingBeforeCharge = "";
          booking.api_time = String(bookingFetchInfoData?.api_time);
          booking.api_distance = String(bookingFetchInfoData?.api_distance);
          booking.type_of_dispatch = bookingFetchInfoData?.type_of_dispatch;
          booking.type_of_dispatch_name =
            bookingFetchInfoData?.type_of_dispatch_name;
          booking.garage_type = bookingFetchInfoData?.garage_type;
          booking.garage_address = bookingFetchInfoData?.garage_address;
          booking.garage_latitude = bookingFetchInfoData?.garage_latitude;
          booking.garage_longitude = bookingFetchInfoData?.garage_longitude;

          let currentDate = dateFormat(new Date(), "yyyy-mm-dd");
          let trip_start_datetime =
            pickUpDate && bookingFetchInfoData?.pickup_time
              ? `${pickUpDate} ${bookingFetchInfoData?.pickup_time}`
              : null;
          let trip_end_datetime =
            dropDate && dropTime ? `${dropDate} ${dropTime}` : null;

          if (pickUpDate >= currentDate) {
            await acceptBookingUpdateStatus(req, res, true);
            let dParam = {
              user_id: id,
              booking_id: booking_id,
              start_time: trip_start_datetime,
              end_time: trip_end_datetime,
            };
            await driverAcceptFutureBooking(dParam, res, true);
            await sendTemplatedSMS({
              msg_sku: "accept",
              is_active: 1,
              to: bookingFetchInfoData?.mobile,
              variables: {
                username: bookingFetchInfoData?.user_name,
                driver_name: bookingFetchInfoData?.driver_name,
                driver_mobile: bookingFetchInfoData?.mobile,
                vehicle_no: bookingFetchInfoData?.vehicle_no,
                booking_ref_no: bookingFetchInfoData?.ref,
                pickup_time: trip_start_datetime,
                mobile_no: process.env.COMPANY_CUSTOMER_NUMBER,
              },
            });

            return successResponse(res, MESSAGES.DRIVER.SEQUENTIAL, {
              data: booking,
            });
          } else {
            booking.Is_Futuristic = true;
            return successResponse(res, MESSAGES.DRIVER.SEQUENTIAL, {
              data: booking,
            });
          }
        } else {
          return successResponse(res, MESSAGES.DRIVER.SEQUENTIAL, {
            driverBalance,
          });
        }
      } else {
        errorResponse(
          res,
          MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
          MESSAGES.BOOKING.BOOKING_ALREADY_ACCEPTED,
          STATUS_CODE.SERVER_ERROR
        );
      }
    } else {
      errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        MESSAGES.BOOKING.BOOKING_HAS_CANCELLED,
        STATUS_CODE.SERVER_ERROR
      );
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

export const driverAcceptBookingSeq = async (req, res) => {
  try {
    const { booking_id, id } = req.body;
    const bookingStatus = await getBookingStatus(req, res, true);
    if (!bookingStatus) {
      let booking = {};
      const driverBalance = await checkDriverBalance(req, res);
      const acceptJob = await getAcceptDriverBooking(req, res, true);
      console.log({ acceptJob });
      const vehicleData = await getUserVehicleDetails(req, res);

      if (vehicleData && vehicleData.vehicle_master_id) {
        req.vehicle_master_id = vehicleData.vehicle_master_id;
        let result = await updateDriverVehicle(req, res);
      }

      if (acceptJob && acceptJob[0].is_stack == 1) {
        const purchaseData = await seqPurchasePrice(req, res); // Use less method

        if (driverBalance.message != MESSAGES.WALLET.INSUCIENT_BALANCE) {
          let bookingType = data[0].BookingTypeVal;
          let vehicleType = data[0].vehicleType;
          let isMatchedCabType = await isCabTypeMatched(req.id, vehicleType);
          let drivervehicle = isMatchedCabType.CabType;

          const bookingFetchInfoData = await bookingFetchInfo(req, res);

          let pickUpDate = bookingFetchInfoData.pickup_date
            ? dateFormat(bookingFetchInfoData.pickup_date, "yyyy-mm-dd")
            : null;
          let dropDate = bookingFetchInfoData.drop_date
            ? dateFormat(bookingFetchInfoData.drop_date, "yyyy-mm-dd")
            : null;
          let dropTime =
            bookingFetchInfoData.drop_time != null
              ? bookingFetchInfoData.drop_time
              : "00:00:00";

          booking.PerKmCharges = String(bookingFetchInfoData.approx_after_km);
          booking.ignore_km = String(bookingFetchInfoData.approx_after_km);
          booking.ignore_hour = String(bookingFetchInfoData.approx_after_hour);
          booking.per_km_charge = String(
            bookingFetchInfoData.approx_distance_charge
          );
          booking.per_hr_charge = String(
            bookingFetchInfoData.approx_hour_charge
          );
          booking.PerHrCharges = bookingFetchInfoData.local_package_hrs;
          booking.NightChargesBy = bookingFetchInfoData.night_rate_type;
          booking.booking_reference = bookingFetchInfoData.ref;
          booking.name = bookingFetchInfoData.user_name;
          booking.user_email = bookingFetchInfoData.user_email;
          booking.booking_id = bookingFetchInfoData.id;
          booking.booking_type = bookingFetchInfoData.booking_type;
          booking.booking_type_id = bookingFetchInfoData.booking_type_id;
          booking.configPackageNo = String(
            bookingFetchInfoData.master_package_mode_id
          );
          booking.Sub_Package_Id = String(
            bookingFetchInfoData.master_package_mode_id
          );
          booking.CarTypeValue = bookingFetchInfoData.vehicle;
          booking.pickup_area = bookingFetchInfoData.pickup_area;
          booking.pickup_address = bookingFetchInfoData.pickup_address;
          booking.pickup_location = bookingFetchInfoData.pickup_area;
          booking.drop_address = bookingFetchInfoData.drop_address;
          booking.drop_location = bookingFetchInfoData.drop_area;
          booking.pickup_latitude = bookingFetchInfoData.pickup_latitude;
          booking.pickup_longitude = bookingFetchInfoData.pickup_longitude;
          booking.drop_latitude = bookingFetchInfoData.drop_latitude;
          booking.drop_longitude = bookingFetchInfoData.drop_longitude;
          booking.pickup_date = pickUpDate;
          booking.pickup_time = bookingFetchInfoData.pickup_time;
          booking.estimatedTime = bookingFetchInfoData.pickup_time;
          booking.per_distance_charge = String(
            bookingFetchInfoData.approx_distance_charge
          );
          booking.mobile_no = bookingFetchInfoData.mobile;
          booking.drop_distance = String(
            bookingFetchInfoData.estimated_distance
          );
          booking.estimatedTotalBill = String(
            bookingFetchInfoData.estimated_final_price
          );
          booking.night_rate_begins = String(
            bookingFetchInfoData.night_rate_begins
          );
          booking.night_rate_ends = String(
            bookingFetchInfoData.night_rate_ends
          );
          booking.NightCharges = String(
            bookingFetchInfoData.night_charge_price
          );
          booking.MinimumCharge = String(bookingFetchInfoData.minimum_charge);
          booking.WaitingCharge_per_minute = String(
            bookingFetchInfoData.approx_waiting_charge
          );
          booking.Waiting_minutes = String(
            bookingFetchInfoData.approx_waiting_minute
          );
          booking.send_time = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
          booking.min_distance = String(bookingFetchInfoData.approx_after_km);
          booking.basicTax = String(
            bookingFetchInfoData.cgst_tax +
              bookingFetchInfoData.igst_tax +
              bookingFetchInfoData.sgst_tax
          );
          booking.pickup_distance = "";
          booking.booking_hours = bookingFetchInfoData.local_package_id;
          booking.measure = "Km";
          booking.currency = "INR";
          booking.charge_type = bookingFetchInfoData.charge_type;
          booking.extras = String(bookingFetchInfoData.extras);
          booking.extraPrice = String(bookingFetchInfoData.extra_price);
          booking.peakTimeValue = String(bookingFetchInfoData.peak_time_value);
          booking.peakTimePrice = String(bookingFetchInfoData.peak_time_price);
          booking.WaitingFreeMin = String(
            bookingFetchInfoData.approx_waiting_minute
          );
          booking.WaitingAfterCharge = String(
            bookingFetchInfoData.approx_waiting_charge
          );
          booking.WaitingBeforeCharge = "";
          booking.api_time = String(bookingFetchInfoData.api_time);
          booking.api_distance = String(bookingFetchInfoData.api_distance);
          booking.type_of_dispatch = bookingFetchInfoData.type_of_dispatch;
          booking.type_of_dispatch_name =
            bookingFetchInfoData.type_of_dispatch_name;
          booking.garage_type = bookingFetchInfoData.garage_type;
          booking.garage_address = bookingFetchInfoData.garage_address;
          booking.garage_latitude = bookingFetchInfoData.garage_latitude;
          booking.garage_longitude = bookingFetchInfoData.garage_longitude;

          let currentDate = dateFormat(new Date(), "yyyy-mm-dd");
          let trip_start_datetime =
            pickUpDate && row.pickup_time
              ? `${pickUpDate} ${row.pickup_time}`
              : null;
          let trip_end_datetime =
            dropDate && dropTime ? `${dropDate} ${dropTime}` : null;

          if (pickUpDate >= currentDate) {
            await acceptBookingUpdateStatus(req, res, true);
            let dParam = {
              user_id: id,
              booking_id: booking_id,
              start_time: trip_start_datetime,
              end_time: trip_end_datetime,
            };
            await driverAcceptFutureBooking(dParam);

            await sendTemplatedSMS({
              msg_sku: "accept",
              is_active: 1,
              to: mobile,
              variables: {
                username: bookingFetchInfoData.user_name,
                driver_name: bookingFetchInfoData.driver_name,
                driver_mobile: bookingFetchInfoData.mobile,
                vehicle_no: bookingFetchInfoData.vehicle_no,
                booking_ref_no: bookingFetchInfoData.ref,
                pickup_time: trip_start_datetime,
                mobile_no: process.env.COMPANY_CUSTOMER_NUMBER,
              },
            });

            return successResponse(res, MESSAGES.DRIVER.SEQUENTIAL, {
              data: booking,
            });
          } else {
            booking.Is_Futuristic = true;
            return successResponse(res, MESSAGES.DRIVER.SEQUENTIAL, {
              data: booking,
            });
          }
        } else {
          return successResponse(res, MESSAGES.DRIVER.SEQUENTIAL, {
            driverBalance,
          });
        }
      } else {
        errorResponse(
          res,
          MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
          MESSAGES.BOOKING.BOOKING_ALREADY_ACCEPTED,
          STATUS_CODE.SERVER_ERROR
        );
      }
    } else {
      errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        MESSAGES.BOOKING.BOOKING_HAS_CANCELLED,
        STATUS_CODE.SERVER_ERROR
      );
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

export const driverStartTrip = async (req, res) => {
  try {
    const { booking_id, id: user_id, starting_meter } = req.body;

    if (!booking_id || !user_id || starting_meter === undefined) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        STATUS_CODE.SERVER_ERROR
      );
    }

    const [result] = await sequelize.query(
      `CALL wp_start_trip(:booking_id, :user_id, :starting_meter)`,
      {
        replacements: { booking_id, user_id, starting_meter },
      }
    );

    if (!result || Object.keys(result).length === 0) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    return successResponse(res, MESSAGES.DRIVER.DRIVER_STARTED_TRIP, {
      result,
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

export const addMeterImage = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    // const processData = await processUploadedFile(req, "meter-image");

    const processData = await uploadMeterFile(req, res);
    return successResponse(res, MESSAGES.DOCUMENT.UPLOADED, {
      processData,
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

export const uploadMeterFile = async (req, res) => {
  try {
    const { KeyName, imageURL, booking_id } = req.body;
    const imageKeyMap = {
      startingMeterImage: "starting_meter_image",
      closingMeterImage: "closing_meter_image",
      clientSignature: "client_signature",
      parkingImage: "parking_image",
      tollImage: "toll_image",
      extraImage: "extra_image",
      clientImage: "client_image",
    };

    const docLevelName = imageKeyMap[KeyName];
    const value = imageURL;
    if (!docLevelName || !value) {
      return res
        .status(400)
        .json({ error: "Invalid key name or missing imageURL." });
    }

    const fileUploadName = `${docLevelName}_${Date.now()}.jpeg`;
    const fullImagePath = `uploads/meter-image/${fileUploadName}`;
    // const uploadDocumentData = await uploadMeterImage();

    const uploadDocParam = {
      booking_id,
      doc_file_upload: fileUploadName,
      doc_column_name: docLevelName,
    };
    await uploadDocument(uploadDocParam, res);
    return successResponse(res, MESSAGES.DOCUMENT.UPLOADED, {
      fileUploadName,
      fullImagePath,
      KeyName,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadDocument = async (req, res) => {
  const { user_id, booking_id, doc_file_upload, doc_column_name } = req.body;

  const allowedColumns = [
    "starting_meter_image",
    "closing_meter_image",
    "client_signature",
    "parking_image",
    "toll_image",
    "extra_image",
    "client_image",
  ];

  if (!allowedColumns.includes(doc_column_name)) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      MESSAGES.GENERAL.INVALID_COLUMN_NAME,
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const [result] = await sequelize.query(
      `UPDATE booking SET ${doc_column_name} = :doc_file_upload WHERE BookingID = :booking_id`,
      {
        replacements: { doc_file_upload, booking_id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    return successResponse(res, MESSAGES.DOCUMENT.UPLOADED, {
      result,
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

export const uploadMeterImage = async (req, res) => {
  try {
    const path = req.filepath;
    const imgdata = req.base64image;

    if (!path || !imgdata) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields: filepath or base64image",
      });
    }
    const base64Data = imgdata.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const maxFileSize = 7 * 1024 * 1024; // 7 MB
    if (buffer.length > maxFileSize) {
      return res.status(400).json({
        status: "failed",
        message: "File size must not exceed 7 MB",
      });
    }

    fs.writeFileSync(path, base64Data, { encoding: "base64" });

    return res.status(200).json({
      status: "success",
      message: "File uploaded successfully.",
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

export const localPkgFareById = async (pkgId, basevehicleid) => {
  const result = await sequelize.query(
    `
    SELECT lpf.local_pkg_fare, lp.id, lp.hrs, lp.km
    FROM local_package_fare AS lpf
    INNER JOIN local_package AS lp ON lp.id = lpf.local_pkg_id
    WHERE lpf.local_pkg_id = :pkgId AND lpf.base_vehicle_id = :basevehicleid
    `,
    {
      replacements: { pkgId, basevehicleid },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return result;
};

export const airportAddressData = async (pickup_area) => {
  const result = await sequelize.query(
    `
    SELECT * FROM airport_address
    WHERE Fix_Point = :pickup_area
    LIMIT 1
    `,
    {
      replacements: { pickup_area },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return result.length > 0;
};

export const airportData = async (drop_address, fixpoint) => {
  const result = await sequelize.query(
    `
    SELECT * FROM airport_address
    WHERE :drop_address LIKE CONCAT('%', Address, '%')
    AND :fixpoint LIKE CONCAT('%', transfer_type, '%')
    LIMIT 1
    `,
    {
      replacements: { drop_address, fixpoint },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return result.length > 0;
};

export const bookingCompleteBillNotMatch = async (bookingId, bookingType) => {
  try {
    const result = await sequelize.query(
      `CALL wp_cab_booking_complete_bill_not_matched(:bookingId, :bookingType)`,
      {
        replacements: { bookingId, bookingType },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!result || result.length === 0) {
      throw new Error(MESSAGES.GENERAL.NOT_FOUND);
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const waitingTime = async (base_vehicle_id, delaytime) => {
  try {
    const result = await sequelize.query(
      `
      SELECT * FROM waiting_charge 
      WHERE base_vehicle_id = :base_vehicle_id AND status = 1
      ORDER BY waiting_minute_upto ASC
      `,
      {
        replacements: { base_vehicle_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    let minute_upto = 0;
    let waiting_fees = 0;

    for (const row of result) {
      if (delaytime >= row.waiting_minute_upto) {
        minute_upto = row.waiting_minute_upto;
        waiting_fees = row.waiting_fees;
      } else {
        break;
      }
    }

    if (delaytime > minute_upto && waiting_fees > 0) {
      const extraDelay = delaytime - minute_upto;
      const totalCharge = Math.ceil(extraDelay / 60) * waiting_fees;
      return totalCharge;
    }

    return 0;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const billCalculate = async (req, res, isInternalCall = false) => {
  try {
    const {
      distance,
      bookingId,
      startTime,
      endTime,
      address,
      lat,
      lon,
      delay_time,
      currentTime,
      totalAmount,
      totalTime,
      isMatching,
      pre_waiting_time,
      road_tax,
      tollTax,
      other_Tax,
    } = req.body;

    const chargesCount = await sequelize.query(
      `SELECT COUNT(*) as num FROM booking_charges 
       WHERE BookingID = :bookingId`,
      {
        replacements: { bookingId },
        type: sequelize.QueryTypes.SELECT,
      }
    );
// parseInt(chargesCount[0].num) === 0
    if (parseInt(chargesCount[0].num) === 0) {
      // Calculate trip duration
      const strtTime = new Date(startTime);
      const edTime = new Date(endTime);

      let diff = edTime - strtTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * 60 * 60 * 1000;
      const minutes = Math.floor(diff / (1000 * 60));

      const total_trip_hours = hours;
      const total_trip_minutes = minutes;
      const result = await sequelize.query(
        `SELECT 
            best.*, 
            booking.reference_number,
            booking.client_id AS ClientID,
            booking.master_package_id AS BookingType,
            booking.master_package_mode_id AS Sub_Package_Id,
            booking.package_id AS local_subpackage,
            booking.master_vehicle_type_id AS CarType,
            booking.base_vehicle_id,
            mvt.vehicle_type,
            booking.driver_id AS pickup,
            pickdrop.pickup_area AS PickUpArea,
            pickdrop.drop_area AS DropArea,
            pickdrop.drop_address AS DropAddress,
            SUM(user_transaction.amount) AS paid_amount,
            (best.estimated_final_price - SUM(user_transaction.amount)) AS balance_amount 
         FROM booking 
         INNER JOIN booking_estimation AS best ON booking.booking_id = best.booking_id 
         INNER JOIN booking_pickdrop_details AS pickdrop ON booking.booking_id = pickdrop.booking_id 
         LEFT JOIN master_vehicle_type AS mvt ON booking.master_vehicle_type_id = mvt.id 
         LEFT JOIN local_package_fare ON booking.package_id = local_package_fare.local_pkg_id 
           AND booking.base_vehicle_id = local_package_fare.base_vehicle_id 
         LEFT JOIN user_transaction ON booking.booking_id = user_transaction.booking_id 
           AND user_transaction.action_type = 'Credit' 
         WHERE booking.booking_id = :bookingId 
         GROUP BY booking.booking_id, best.booking_id, pickdrop.pickup_area, pickdrop.drop_area, pickdrop.drop_address, mvt.vehicle_type`,
        {
          replacements: { bookingId },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      if (result.length > 0) {
        result[0]["total_trip_hours"] = total_trip_hours;
        result[0]["total_trip_minutes"] = total_trip_minutes;
        if (isInternalCall) {
          return result;
        } else {
          return successResponse(res, MESSAGES.DOCUMENT.UPLOADED, {
            result,
          });
        }
      } else {
        if (result) {
          throw new Error(MESSAGES.BOOKING.BOOKING_NOT_FOUND);
        }
        return errorResponse(
          res,
          MESSAGES.BOOKING.BOOKING_NOT_FOUND,
          {},
          STATUS_CODE.FORBIDDEN
        );
      }
    } else {
      return errorResponse(
        res,
        MESSAGES.BOOKING.BILL_ALREADY_GENERATED,
        {},
        STATUS_CODE.FORBIDDEN
      );
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

export const bookingCompleteBillNew = async (bookingId, bookingType) => {
  try {
    const result = await sequelize.query(
      `CALL wp_cab_booking_complete_bill_new(:bookingId, :bookingType)`,
      {
        replacements: { bookingId, bookingType },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!result || result.length === 0) {
      throw new Error(MESSAGES.GENERAL.NOT_FOUND);
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insertBookingCharges = async (paramsOrReq, res) => {
  try {
    let params;

    // Determine if called internally or via API
    if (res) {
      // Called via API: extract from req.body
      params = paramsOrReq.body;
    } else {
      // Called internally: params object passed directly
      params = paramsOrReq;
    }

    const {
      tripCharge,
      waitingCharge,
      minimumCharge,
      BookingID,
      distance_rate,
      distance_charge,
      minimum_distance,
      total_tax_price,
      invoice_number,
      totalBill,
      tax_price,
      starting_rate,
      starting_charge,
      duration_charge,
      minimum_price,
      nightcharge_unit,
      nightcharge,
      nightcharge_price,
      night_rate_begins,
      night_rate_ends,
      extras,
      extraPrice,
      peak_time_price,
      peak_time_value,
      basic_tax,
      basic_tax_type,
      basic_tax_price,
      pre_waiting_time,
      pre_waiting_charge,
      waiting_time,
      estimated_price_before_markup,
      extracharges,
      toll_tax,
      state_tax,
      starting_meter,
      closing_meter,
      total_running_time,
      start_time,
      end_time,
      service_charge,
      description,
    } = params;

    const insertParam = {
      tripCharge: Number(tripCharge || 0),
      waitingCharge: Number(waitingCharge || 0),
      minimumCharge: Number(minimumCharge || 0),
      BookingID,
      AddedTime: dateFormat(new Date(), "yyyy-mm-dd"),
      distance_rate: Number(distance_rate || 0),
      distance_charge: Number(distance_charge || 0),
      minimum_distance: Number(minimum_distance || 0),
      total_tax_price: Number(total_tax_price || 0),
      currency: "RS",
      invoice_number,
      total_price: Number(totalBill || 0),
      tax_price: Number(tax_price || 0),
      starting_rate: Number(starting_rate || 0),
      starting_charge: Number(starting_charge || 0),
      duration_charge: Number(duration_charge || 0),
      minimum_price: Number(minimum_price || 0),
      nightcharge_unit,
      nightcharge: Number(nightcharge || 0),
      nightcharge_price: Number(nightcharge_price || 0),
      night_rate_begins,
      night_rate_ends,
      extras,
      extraPrice: Number(extraPrice || 0),
      peak_time_price: Number(peak_time_price || 0),
      peak_time_value: JSON.stringify(peak_time_value || []),
      basic_tax,
      basic_tax_type,
      basic_tax_price: Number(basic_tax_price || 0),
      pre_waiting_time: Number(pre_waiting_time || 0),
      pre_waiting_charge: Number(pre_waiting_charge || 0),
      waiting_time: Number(waiting_time || 0),
      waiting_charge: Number(waitingCharge || 0),
      estimated_price_before_markup: Number(estimated_price_before_markup || 0),
      extracharges: Number(extracharges || 0),
      is_paid: true,
      toll_tax: Number(toll_tax || 0),
      state_tax: Number(state_tax || 0),
      paid_at: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      starting_meter: Number(starting_meter || 0),
      closing_meter: Number(closing_meter || 0),
      total_running_time: Number(total_running_time || 0),
      start_time,
      end_time,
      service_charge,
      estimated_price_before_discount:params.estimated_price_before_discount || 0,
      local_estimateprice_before_discount:params.local_estimateprice_before_discount || 0,
      local_discount_price:params.local_discount_price || 0,
      min_per_km_charge:params.min_per_km_charge || 0,
      min_per_hr_charge:params.min_per_hr_charge || 0,
      min_minimum_charge:params.min_minimum_charge || 0,
      premiums_type:params.premiums_type || '',
      premiums_price:params.premiums_price || 0,
      booking_cancellation_rule:params.booking_cancellation_rule || '',
      price_before_tax:params.price_before_tax || 0,
      cgst_amount:params.cgst_amount || 0,
      sgst_amount:params.sgst_amount || 0,
      igst_amount:params.igst_amount || 0,
      service_charge_cgst:params.service_charge_cgst || 0,
      service_charge_sgst:params.service_charge_sgst || 0,
      service_charge_igst:params.service_charge_igst || 0,
      service_tax_price:params.service_tax_price || 0,
      service_charge_sac_code_id:params.service_charge_sac_code_id || 0,
      service_charge_sac_code_description:params.service_charge_sac_code_description || '',
      commi_type:params.commi_type || '',
      commi_value:params.commi_value || 0,
      rounding:params.rounding || 0,
      level:params.level || '',
      direction:params.direction || '',
      description: description || '',

    };
    // Remove undefined values
    Object.keys(insertParam).forEach((key) => {
      if (insertParam[key] === undefined) {
        delete insertParam[key];
      }
    });

    const result = await BookingCharges.create(insertParam);

    // If called via API, send response
    if (res) {
      return successResponse(res, MESSAGES.BOOKING.BOOKING_CHARGES_INSERTED, {
        result,
      });
    }

    // If called internally, just return the result
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
    throw new Error(`Insert Booking Charges Failed: ${error.message}`);
  }
};

export const bookingLogs = async (bookingId, driverId) => {
  try {
    let insertParam = {
      bookingid: bookingId,
      user_id: driverId,
      status: 8,
      message: "Completed",
      time: dateFormat(new Date(), "yyyy-mm-dd HH:mm:ss"),
    };
    const result = await BookingLogs.create(insertParam);
    console.log({result})
    return result.dataValues; // Return only dataValues
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addDriverLocation = async (paramsOrReq, res) => {
  try {
    let data;

    if (res) {
      // Called via API
      data = paramsOrReq.body;
    } else {
      // Internal call
      data = paramsOrReq;
    }

    const insertValues = {
      user_id: data.user_id,
      booking_id: data.bookingId,
      booking_status: 8,
      current_latitude: data.lat,
      current_longitude: data.lon,
      start_time: data.strtTime
        ? dateFormat(data.startTime, "yyyy-mm-dd HH:MM:ss")
        : Date.now(),
      distance: data.distance,
      duration: data.duration,
      WaitingTime: data.delay_time,
      pre_Waiting_time: data.pre_Waiting_time,
      tripRunnStatus: "Trip Done",
      current_time: data.currentTime
        ? dateFormat(data.currentTime, "yyyy-mm-dd HH:MM:ss")
        : undefined,
      time_stamp: data.time_stamp,
      speed: data.speed,
      accuracy: data.accuracy,
      provider: data.provider,
    };
console.log({insertValues},"Insertt")
    // Remove undefined values
    Object.keys(insertValues).forEach((key) => {
      if (insertValues[key] === undefined) {
        delete insertValues[key];
      }
    });

    const result = await DriverLocation.create(insertValues);

    if (res) {
      return successResponse(res, MESSAGES.DRIVER.DRIVER_LOCATION, { result });
    }

    // Internal call: just return the created record
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
    throw new Error(`Add Driver Location Failed: ${error.message}`);
  }
};

export const updateBookingStatus = async (bookingId) => {
  try {
    const [affectedRows] = await Booking.update(
      { status: 8 },
      {
        where: { booking_id: bookingId },
      }
    );
console.log({affectedRows,bookingId})
    if (affectedRows === 0) {
    return (MESSAGES.BOOKING.BOOKING_NOT_FOUND);
    }

    return affectedRows;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const driverLastLocation = async (driverId) => {
  try {
    const result = UserCurrentLocation.findOne({
      where: {
        user_id: driverId,
      },
      order: [["createdAt", "DESC"]],
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
function to_hms_string(timearr) {
  var minutes = 60 + timearr[1];
  var hours = "";
  if (Math.abs(timearr[0]) < 10) {
    hours = "0";
  }
  hours =
    timearr[0] < 0 ? "-" + hours + Math.abs(timearr[0]) : hours + timearr[0];
  return hours + ":" + minutes;
}
function isInRange(pickupTime, rateBegins, rateEnds) {
  //var st = '18:00';
  //var en = '20:00';
  if (rateBegins != null) {
    var start_time = rateBegins.split(":");
  } else {
    var start_time = [0, 0];
  }
  if (rateEnds !== null) {
    var end_time = rateEnds.split(":");
  } else {
    var end_time = [0, 0];
  }
  //We've got the two start times as an array of hours/minutes values.
  var dateObj = new Date(); //I just feel dirty making multiple calls to new Date().etc
  //var now 		= [dateObj.getHours(),dateObj.getMinutes()]; //Gets the current Hours/Minutes
  var now = [0, 0];
  if (pickupTime != "") {
    now = pickupTime.split(":");
  }

  if (end_time[0] < start_time[0] && now[0] < start_time[0]) {
    start_time[0] -= 24; //This is something I came up with because I do a lot of math.
  } else if (start_time[0] > end_time[0]) {
    end_time[0] += 24;
  }
  var start_string = to_hms_string(start_time); //the start string converted to a string format. Made comparisons easier.
  var end_string = to_hms_string(end_time); //See Above
  var now_string = to_hms_string(now); //Above
  //console.log(start_string, now_string, end_string);
  var status =
    start_string < now_string && now_string < end_string ? "TRUE" : "FALSE";
  return status;
}
const nightChargeCalculation = function (
  pickupTime,
  rateBegins,
  rateEnds,
  chargeUnit,
  charges,
  totalbill
) {
  return new Promise((resolve, reject) => {
    var val = isInRange(pickupTime, rateBegins, rateEnds);

    if (val == "FALSE") {
      var total_charges = 0;
    } else {
      if (chargeUnit == "Rs") {
        total_charges = charges;
      } else {
        total_charges = (totalbill * charges) / 100;
      }
    }
    resolve(total_charges);
  });
};

const peakTimeChargeCalculation = function (
  pickupTime,
  start_time,
  end_time,
  chargeUnit,
  charges,
  totalbill
) {
  return new Promise((resolve, reject) => {
    var val = isInRange(pickupTime, start_time, end_time);

    if (val == "FALSE") {
      var total_charges = 0;
    } else {
      if (chargeUnit == "Rs") {
        total_charges = charges;
      } else {
        total_charges = (totalbill * charges) / 100;
      }
    }
    resolve(total_charges);
  });
};
// Route name cabBillingComplete
export const driverBillSeq = async (req, res) => {
  try {
    const today = new Date();
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const currentDateTime = `${date} ${time}`;

    let {
      bookingId,
      distance,
      address: drop_address,
      endTime,
      strtTime,
      dropToPickupDist = "",
      dropToPickupGarageDist = "",
      garageToPickupDist = "",
      parking_charge = 0,
      toll_tax = 0,
      state_tax = 0,
      other_tax = 0,
      delay_time,
      totalTime,
      isMatching,
      starting_meter,
      id,
      closing_meter = 0,
      total_running_time = "00:00:00",
      start_time = "00:00:00",
      end_time = "00:00:00",
    } = req.body;
    const dateStr = dateFormat(today, "yyyy-mm-dd");
    const trip_endtime = dateFormat(
      new Date(`${dateStr} ${end_time}`),
      "HH:MM"
    );

    console.log({ trip_endtime });
    // ✅ Normalize delay_time to minutes
    if (typeof delay_time === "string" && delay_time.includes(":")) {
      const [hours, minutes] = delay_time.split(":").map(Number);
      delay_time = hours * 60 + minutes;
    }

    // ✅ Make sure to await if bookingTravelDetails is async
    const actualTravelDetail = await bookingTravelDetails(bookingId);

    if (Array.isArray(actualTravelDetail) && actualTravelDetail.length > 0) {
      const actual = actualTravelDetail[0];

      if (Number(actual.distance) > Number(distance)) {
        distance = actual.distance;
      }

      if (actual.strtTime) {
        const actualStart = new Date(actual.strtTime);
        const inputStart = new Date(strtTime);

        if (actualStart.getTime() > inputStart.getTime()) {
          strtTime = actual.strtTime;
        }
      }

      if (actual.endTime) {
        const actualEnd = new Date(actual.endTime);
        const inputEnd = new Date(endTime);

        if (actualEnd.getTime() > inputEnd.getTime()) {
          endTime = actual.endTime;
        }
      }

      if (actual.duration && Number(actual.duration) > Number(totalTime)) {
        totalTime = actual.duration;
      }
    }

    req.body = {
      bookingId,
      distance,
      drop_address,
      endTime,
      strtTime,
      dropToPickupDist,
      dropToPickupGarageDist,
      garageToPickupDist,
      parking_charge,
      toll_tax,
      state_tax,
      other_tax,
      delay_time,
      totalTime,
    };

    let bookingDetailsData = await billCalculate(req, res, true);
    if (bookingDetailsData) {
      let {
        BookingType,
        CarType,
        vehicle_type,
        pickup: pickupId,
        Sub_Package_Id,
        local_subpackage,
        base_vehicle_id,
        approx_after_km: ignore_km,
        approx_after_hour: ignore_hrs,
        minimum_charge: minimumCharge,
        approx_hour_charge: per_hr_charge,
        approx_distance_charge: per_km_charge,
        night_rate_begins,
        night_rate_ends,
        nightChargePrice,
        nightChargeUnit: night_rate_type,
        night_rate_value: nightcharge,
        paid_amount,
        peak_time_value,
        markup_price = 0,
        extras,
        extraPrice,
        estimated_price_before_markup = 0,
        markup_type = 0,
        markup_value = 0,
        cgst_tax,
        sgst_tax,
        igst_tax,
        reference_number,
        service_charge = 0,
        estimated_price_before_discount = 0,
        local_estimateprice_before_discount = 0,
        local_discount_price = 0,
        min_per_km_charge = 0,
        min_per_hr_charge = 0,
        min_minimum_charge = 0,
        premiums_type = "",
        premiums_price = 0,
        booking_cancellation_rule = "",
        price_before_tax = 0,
        cgst_amount = 0,
        sgst_amount = 0,
        igst_amount = 0,
        service_charge_cgst = 0,
        service_charge_sgst = 0,
        service_charge_igst = 0,
        service_tax_price = 0,
        service_charge_sac_code_id = 0,
        service_charge_sac_code_description = "",
        commi_type = "",
        commi_value = 0,
        rounding = 0,
        level = '',
        direction = '', 
        description=" ",
      } = bookingDetailsData?.[0];

      let total_days = 0,
        peak_time_price = 0,
        duration = totalTime; // need to verufy
      const waitingFeesData = await waitingTime(base_vehicle_id, delay_time);
      const isMatchedCabType = await isCabTypeMatched(pickupId, vehicle_type);
      console.log({isMatchedCabType})

      if (isMatchedCabType) {
        await bookingCompleteBillNew(bookingId, vehicle_type);
      } else {
        await bookingCompleteBillNotMatch(bookingId, vehicle_type);
      }

      let fareParam = {
        distance,
        duration,
        master_package_mode_id: Sub_Package_Id,
        status: 0,
        ignore_hrs,
        ignore_km,
        minimumCharge,
        master_package_type: BookingType,
        total_days,
        per_hr_charge,
        per_km_charge,
      };
      const fareCalculationData = await getFareCalculationdriver(fareParam); // need to check this method (same method localhire || here using from fare model)
      const {
        minimum_charge,
        per_km_charge: perKmCharge,
        min_distance: minDistance,
        totalbill,
      } = fareCalculationData;
      const { minute_upto, waiting_fees } = waitingFeesData;
      let extraDelay = Math.max(delay_time - minute_upto, 0);
      let waitingCharge = extraDelay * waiting_fees;
      let waiting_time = minute_upto;
      let tripCharge = totalbill;
      let TotalBill = totalbill;

      let night_charges = await nightChargeCalculation(
        trip_endtime,
        night_rate_begins,
        night_rate_ends,
        night_rate_type,
        nightcharge,
        totalbill
      );
console.log({night_charges})
      if (night_charges > 0) {
        nightChargePrice = night_charges;
        TotalBill = Number(totalbill) + Number(night_charges);
      }

      let extraCharges = 0;
      let extraPrice1 = 0;

      if (extraPrice > 0) {
        extraCharges = extraPrice;
        TotalBill = Number(totalbill) + Number(extraPrice);
      }

      TotalBill =
        Number(TotalBill) +
        Number(parking_charge) +
        Number(toll_tax) +
        Number(state_tax) +
        Number(other_tax);
      let extraValue =
        Number(parking_charge) +
        Number(toll_tax) +
        Number(state_tax) +
        Number(other_tax);
      extraCharges = Number(extraPrice) + Number(extraValue);

      if (peak_time_value) {
        let peakValueArr1 = [],
          peakFare = 0,
          totalPeakFareValue = 0,
          peakLength = peak_time_value.length;

        for (let p = 0; p < peakLength; p++) {
          // need to check below mention method which call from fareCalObj
          peakFare = await peakTimeChargeCalculation(
            trip_endtime,
            peak_time_value[p].start_time,
            peak_time_value[p].end_time,
            peak_time_value[p].peaktime_type,
            peak_time_value[p].peaktime_value,
            TotalBill
          );

          if (peakFare > 0) {
            let peakValueArr = {
              start_time: peak_time_value[p].start_time,
              end_time: peak_time_value[p].end_time,
              peaktime_type: peak_time_value[p].peaktime_type,
              peaktime_value: peak_time_value[p].peaktime_value,
            };
            totalPeakFareValue += peakFare;
            peakValueArr1.push(peakValueArr);
          }
        }

        peak_time_price = totalPeakFareValue;
        peak_time_value = peakValueArr1;
        TotalBill = Number(TotalBill) + Number(peak_time_price);
      }

      let pre_t = 0,
        preWaitingCharge = 0,
        basicTaxType = 0,
        basicTaxPrice = 0,
        basicTax = 0;

      basicTax = cgst_tax + sgst_tax + igst_tax;
      basicTaxPrice = Math.round((Number(TotalBill) * Number(basicTax)) / 100);
      TotalBill = Number(TotalBill) + Number(basicTaxPrice);

      let bookRef = "IN-" + reference_number;
      TotalBill = Math.round(TotalBill);
      let balanceAmount = TotalBill - paid_amount;

      let startingMeter = starting_meter ? starting_meter : 0;
      if (!startingMeter) {
        let getMeterReading = await getStartMeterReading(id, bookingId);
        startingMeter = getMeterReading.starting_meter;
      }
      let insertParam = {
        tripCharge,
        waitingCharge,
        minimumCharge,
        BookingID: bookingId,
        distance_rate: perKmCharge,
        distance_charge: tripCharge,
        minimum_distance: minDistance,
        total_tax_price: basicTaxPrice,
        invoice_number: bookRef,
        total_price: TotalBill,
        TotalBill,
        tax_price: basicTaxPrice,
        starting_rate: minDistance,
        starting_charge: minimumCharge,
        duration_charge: minDistance,
        minimum_price: minimumCharge,
        nightcharge_unit: night_rate_type,
        nightcharge,
        nightcharge_price: nightChargePrice,
        night_rate_begins,
        night_rate_ends,
        extras,
        extraPrice,
        peak_time_price,
        peak_time_value,
        basic_tax: basicTax,
        basic_tax_type: basicTaxType,
        basic_tax_price: basicTaxPrice,
        pre_waiting_time: pre_t,
        pre_waiting_charge: preWaitingCharge,
        waiting_time: waiting_time,
        waiting_charge: waitingCharge,
        estimated_price_before_markup,
        extracharges: extraCharges,
        toll_tax,
        state_tax,
        starting_meter,
        closing_meter,
        total_running_time,
        start_time,
        end_time,
        service_charge,
        estimated_price_before_discount,
        local_estimateprice_before_discount,
        local_discount_price,
        min_per_km_charge,
        min_per_hr_charge,
        min_minimum_charge,
        premiums_type,
        premiums_price,
        booking_cancellation_rule,
        price_before_tax,
        cgst_amount,
        sgst_amount,
        igst_amount,
        service_charge_cgst,
        service_charge_sgst,
        service_charge_igst,
        service_tax_price,
        service_charge_sac_code_id,
        service_charge_sac_code_description,
        commi_type,
        commi_value,
        rounding,
        level,
        direction ,
        description

      };
      await insertBookingCharges(insertParam);
      await bookingLogs(bookingId, pickupId);
            await updateBookingStatus(bookingId);

      let bookingParam = {
        booking_id: bookingId,
        actual_distance: distance,
        actual_time: totalTime,
        final_latitude: req?.lat,
        final_longitude: req?.long,
        actual_waiting_distance: "",
      };
      await addBookingActualDetails(bookingParam);

      var addPickupParam = {
        booking_id: bookingId,
        pickup_latitude: actualTravelDetail.pickup_latitude,
        pickup_longitude: actualTravelDetail.pickup_longitude,
        drop_address,
        drop_latitude: req?.lat,
        drop_longitude: req?.long,
      };

      await addBookingActualPickDropDetails(addPickupParam, res, true);

      let tripInfo = {
        totalbill,
        totalTax: basicTaxPrice,
        preWaitingTimeCharge: preWaitingCharge,
        extracharges: extraCharges,
        paid_amount: paid_amount,
        balance_amount: balanceAmount,
        distance,
        dropToPickupDist: dropToPickupDist,
        dropToPickupGarageDist: dropToPickupGarageDist,
        garageToPickupDist: garageToPickupDist,
      };

      let finalRequest = { ...req.body, user_id: pickupId };
      console.log({finalRequest})
      // await addDriverLocation(finalRequest);

      let userTransactionParam = {
        user_id: pickupid,
        booking_id: bookingId,
        payment_response_id: "",
        amount: paid_amount,
        current_balance: "0",
        action_type: "Credit",
        payment_type_id: "",
        payment_status: 1,
        created_date: currentDateTime,
        created_by: pickupid,
      };

      await userTransaction(userTransactionParam);

      return successResponse(res, MESSAGES.DRIVER.TRIP_INFO, { tripInfo });
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
export const getFareCalculationdriver = (param) => {
  return new Promise((resolve) => {
    let {
      distance,
      duration,
      master_package_mode_id: packagemodeid,
      ignore_hrs,
      ignore_km,
      minimumCharge,
      master_package_type,
      total_days,
      per_km_charge = 0,
      per_hr_charge = 0,
    } = param;

    const final = {};
    let EstimatedPrice = 0;

    // OUTSTATION (type 4)
    if (master_package_type == "4") {
      ignore_km = ignore_km * total_days;
    }

    // -----------------------------
    // MODE 1 → DISTANCE
    // -----------------------------
    if (packagemodeid == 1) {
      if (distance > ignore_km) {
        const extraKm = distance - ignore_km;
        EstimatedPrice = minimumCharge + extraKm * per_km_charge;
      } else {
        EstimatedPrice = minimumCharge;
      }

      final.per_km_charge = per_km_charge;
      final.per_hr_charge = per_hr_charge;
      final.min_distance = ignore_km;
      final.min_pkg_hrs = 0;
      final.minimum_charge = minimumCharge;
    }

    // -----------------------------
    // MODE 2 → HOURLY
    // -----------------------------
    else if (packagemodeid == 2) {
      const totalMinutes = Number(duration);
      const ignoreMinutes = ignore_hrs * 60;

      if (totalMinutes > ignoreMinutes) {
        const extraMinutes = totalMinutes - ignoreMinutes;
        const ratePerMinute = per_hr_charge / 60;
        EstimatedPrice = minimumCharge + extraMinutes * ratePerMinute;
      } else {
        EstimatedPrice = minimumCharge;
      }

      final.per_km_charge = 0;
      final.per_hr_charge = per_hr_charge;
      final.min_hour = ignore_hrs;
      final.min_distance = 0;
      final.minimum_charge = minimumCharge;
    }

    // -----------------------------
    // MODE 3 → DISTANCE + HOURLY
    // -----------------------------
    else if (packagemodeid == 3) {
      let distanceRate = 0;
      if (distance > ignore_km) {
        distanceRate = (distance - ignore_km) * per_km_charge;
      }

      const travelMinutes = Number(duration);
      const ignoreMinutes = ignore_hrs * 60;

      let hourRate = 0;
      if (travelMinutes > ignoreMinutes) {
        const extraMinutes = travelMinutes - ignoreMinutes;
        hourRate = (per_hr_charge / 60) * extraMinutes;
      }

      EstimatedPrice = minimumCharge + distanceRate + hourRate;

      final.per_km_charge = per_km_charge;
      final.per_hr_charge = per_hr_charge;
      final.min_distance = ignore_km;
      final.min_hour = ignore_hrs;
      final.minimum_charge = minimumCharge;
    }

    // -----------------------------
    // MODE 4 → DISTANCE + WAITING
    // -----------------------------
    else if (packagemodeid == 4) {
      if (distance > ignore_km) {
        const extraKm = distance - ignore_km;
        EstimatedPrice = minimumCharge + extraKm * per_km_charge;
      } else {
        EstimatedPrice = minimumCharge;
      }

      final.per_km_charge = per_km_charge;
      final.per_hr_charge = per_hr_charge;
      final.min_distance = ignore_km;
      final.minimum_charge = minimumCharge;
    }

    // -----------------------------

    final.totalbill = EstimatedPrice;
    final.min_pkg_hrs = ignore_hrs;
    final.min_pkg_km = ignore_km;

    resolve(final);
  });
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function getDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  }

  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(2));
}

export const addCurrentLocation = async (req, res) => {
  try {
    const { locData } = req.body;

    if (!locData) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        {},
        STATUS_CODE.BAD_REQUEST
      );
    }

    const dataArray = JSON.parse(locData);

    const insertData = dataArray.map((entry) => {
      const obj = {
        user_id: entry.driverId,
        current_latitude: entry.latitude,
        current_longitude: entry.longitude,
      };

      Object.keys(obj).forEach((key) => {
        if (obj[key] === undefined || obj[key] === "") {
          delete obj[key];
        }
      });

      return obj;
    });

    await UserCurrentLocation.bulkCreate(insertData);
    return successResponse(res, MESSAGES.GENERAL.DATA_ADDED);
  } catch (error) {
    errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const driverAllocation = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const [result] = await sequelize.query(`CALL sp_driver_alloc(:bookingId)`, {
      replacements: { bookingId },
    });

    return successResponse(
      res,
      MESSAGES.DRIVER.DRIVER_BOOKING_ALLOCATION_SUCCESSFULLY,
      { result }
    );
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getActiveDrivers = async (req, res) => {
  try {
    const filterData = req.body.filter_data
      ? JSON.parse(req.body.filter_data)
      : {};
    let conditionalsql = "";

    if (
      filterData.filter_supplier_name &&
      Object.keys(filterData.filter_supplier_name).length > 0
    ) {
      const supplier_id = Object.values(filterData.filter_supplier_name)
        .map((id) => `'${id}'`)
        .join(",");
      conditionalsql += ` AND user.id IN (${supplier_id})`;
    }

    if (
      filterData.filter_vehicle_color &&
      Object.keys(filterData.filter_vehicle_color).length > 0
    ) {
      const colors = Object.values(filterData.filter_vehicle_color)
        .map((c) => `'${c}'`)
        .join(",");
      conditionalsql += ` AND color.colour_name IN (${colors})`;
    }

    if (
      filterData.filter_fuel_type &&
      Object.keys(filterData.filter_fuel_type).length > 0
    ) {
      const fuels = Object.values(filterData.filter_fuel_type)
        .map((f) => `'${f}'`)
        .join(",");
      conditionalsql += ` AND fuel.fuel_type IN (${fuels})`;
    }

    if (
      filterData.filter_vehicle_model &&
      Object.keys(filterData.filter_vehicle_model).length > 0
    ) {
      const models = Object.values(filterData.filter_vehicle_model)
        .map((m) => `'${m}'`)
        .join(",");
      conditionalsql += ` AND vm.model IN (${models})`;
    }

    if (
      filterData.filter_vehicle_type &&
      Object.keys(filterData.filter_vehicle_type).length > 0
    ) {
      const types = Object.values(filterData.filter_vehicle_type)
        .map((str) => str.substring(0, 4))
        .join("|");
      conditionalsql += ` AND mvt.vehicle_type REGEXP '${types}'`;
    }

    if (
      filterData.filter_vehicle_name &&
      Object.keys(filterData.filter_vehicle_name).length > 0
    ) {
      const names = Object.values(filterData.filter_vehicle_name)
        .map((str) => str.substring(0, 4))
        .join("|");
      conditionalsql += ` AND mvm.name REGEXP '${names}'`;
    }

    const driversql = `
      SELECT user.id as user_id, user.wallet_amount, user.gcm_id, user.first_name, user.last_name, user.email, user.mobile,
        GROUP_CONCAT(DISTINCT mvt.id) as vehicle_type_id,
        GROUP_CONCAT(DISTINCT mvt.category_id) as category_id,
        GROUP_CONCAT(DISTINCT mvt.vehicle_type) as vehicle_type,
        GROUP_CONCAT(DISTINCT mvm.name) AS vehicle_name,
        GROUP_CONCAT(DISTINCT udp.package_id) as driver_package,
        GROUP_CONCAT(DISTINCT udpc.city_id) AS user_pref_city,
        GROUP_CONCAT(DISTINCT m_shift.working_shift_id) as working_shift_id,
        GROUP_CONCAT(DISTINCT m_shift.shift_time) as working_shift_time,
        GROUP_CONCAT(DISTINCT master_language.language_name) as user_language,
        GROUP_CONCAT(DISTINCT vm.model) as vehicle_model,
        GROUP_CONCAT(DISTINCT color.colour_name) as vehicle_color,
        GROUP_CONCAT(DISTINCT fuel.fuel_type) as fuel_type
      FROM user
      LEFT JOIN driver ON user.id = driver.user_id
      LEFT JOIN user_vehicle_mapping AS uvm ON user.id = uvm.user_id
      LEFT JOIN vehicle_master AS vm ON uvm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_colour AS color ON vm.color = color.colour_id
      LEFT JOIN master_fuel_type AS fuel ON vm.ignition_type_id = fuel.id
      LEFT JOIN master_vehicle_model AS mvm ON vm.id = mvm.id
      LEFT JOIN master_vehicle_type AS mvt ON mvm.vehicle_type_id = mvt.id
      LEFT JOIN user_duty_pref AS udp ON user.id = udp.user_id AND udp.status = 1
      LEFT JOIN user_pref_drive_city AS udpc ON user.id = udpc.user_id
      LEFT JOIN user_workingshift_mapping AS workshift ON user.id = workshift.user_id
      LEFT JOIN master_working_shift AS m_shift ON workshift.working_shift_id = m_shift.working_shift_id
      LEFT JOIN user_language AS language ON user.id = language.user_id AND language.status = 1
      LEFT JOIN master_language ON language.language_id = master_language.language_id
      WHERE user.is_active = 1
        AND driver.status = 0
        AND user.gcm_id IS NOT NULL
        AND user.gcm_id != ""
        ${conditionalsql}
      GROUP BY uvm.user_id
    `;

    const results = await sequelize.query(driversql, {
      type: QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return successResponse(res, MESSAGES.DRIVER.ACTIVE_DRIVER, { result });
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NOT_FOUND);
    }
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getBookingPicklatlong = async (
  req = {},
  res = null,
  bookingId = null,
  isInternalCall = false
) => {
  const id = isInternalCall ? bookingId : req.body?.bookingId;

  if (!id) {
    if (!isInternalCall) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        {},
        STATUS_CODE.BAD_REQUEST
      );
    } else {
      throw new Error(MESSAGES.BOOKING.BOOKING_ID_REQUIRED);
    }
  }
  try {
    const result = await BookingPickDropDetails.findAll({
      where: { booking_id: id },
    });

    if (result.length > 0) {
      if (isInternalCall) {
        return result;
      } else {
        return successResponse(res, MESSAGES.BOOKING.BOOKING_PICKUP_LOCATION, {
          result,
        });
      }
    } else {
      if (isInternalCall) {
        return null;
      } else {
        return errorResponse(
          res,
          MESSAGES.GENERAL.NOT_FOUND,
          {},
          STATUS_CODE.NOT_FOUND
        );
      }
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

export const getDriverLocation = async (bookingId, driverId) => {
  try {
    const whereClause = {};

    if (driverId) {
      whereClause.user_id = driverId;
    }

    if (bookingId) {
      whereClause.booking_id = bookingId;
    }

    const result = await DriverLocation.findOne({
      where: whereClause,
      order: [["id", "DESC"]],
      raw: true, // Optional: returns plain JS object instead of Sequelize instance
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
//route  waypoint
export const wayPointSeq = async (req, res) => {
  const { bookingId, driverId } = req.body;

  if (!bookingId || !driverId) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      {},
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const pickupResult = await getBookingPicklatlong(
      null,
      null,
      bookingId,
      true
    );

    const pickupResults = pickupResult?.[0]?.dataValues;

    if (
      !pickupResults ||
      !pickupResults.pickup_latitude ||
      !pickupResults.pickup_longitude
    ) {
      return errorResponse(
        res,
        MESSAGES.DRIVER.PICKUP_LOCATION_NOT_FOUND,
        {},
        STATUS_CODE.NOT_FOUND
      );
    }

    const driverLocation = await getDriverLocation(bookingId, driverId);
    console.log(driverLocation);

    if (!driverLocation) {
      return errorResponse(
        res,
        MESSAGES.DRIVER.DRIVER_LOCATION_NOT_FOUND,
        {},
        STATUS_CODE.NOT_FOUND
      );
    }

    return successResponse(res, MESSAGES.DRIVER.WAYPOINT, driverLocation);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getDriverList = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      {},
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const result = await ViewDriverVehicleMap.findAll({
      where: {
        driver_status: "Approved",
        gcm_id: {
          [Op.ne]: "",
        },
      },
    });

    if (result && result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result);
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        {},
        STATUS_CODE.NOT_FOUND
      );
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

export const addSetLocation = async (
  req = null,
  res = null,
  isInternalCall = false
) => {
  const locData = req?.body?.locData;

  if (!locData) {
    const error = {
      message: MESSAGES.GENERAL.MANDATORY_FIELD,
      code: STATUS_CODE.BAD_REQUEST,
    };
    return isInternalCall
      ? { status: "failed", ...error }
      : errorResponse(res, error.message, {}, error.code);
  }
  try {
    const dataArray =
      typeof locData === "string" ? JSON.parse(locData) : locData;

    const sanitizeData = (item) => {
      const values = {
        user_id: item.driverId,
        booking_id: item.book_id,
        booking_status: item.booking_status,
        start_latitude: item.start_latitude,
        start_longitude: item.start_longitude,
        current_latitude: item.current_latitude,
        current_longitude: item.current_longitude,
        start_time: item.start_time
          ? dateFormat(item.start_time, "yyyy-mm-dd HH:MM:ss")
          : undefined,
        datetime: item.current_time
          ? dateFormat(item.current_time, "yyyy-mm-dd HH:MM:ss")
          : undefined,
        distance: item.distance,
        duration: item.duration,
        WaitingTime: item.waiting_time,
        pre_Waiting_time: item.pre_Waiting_time,
        tripRunnStatus: item.tripRunnStatus,
        current_time: item.current_time,
        time_stamp: item.timeStamp,
        speed: item.speed,
        accuracy: item.accuracy,
        provider: item.provider,
      };

      return Object.fromEntries(
        Object.entries(values).filter(
          ([, value]) => value !== undefined && value !== ""
        )
      );
    };
    const bookingIds = [];
    await Promise.all(
      dataArray.map(async (item) => {
        const sanitized = sanitizeData(item);
        await DriverLocation.create(sanitized);
        if (item.book_id) bookingIds.push(item.book_id);
      })
    );
    return isInternalCall
      ? bookingIds
      : successResponse(res, MESSAGES.GENERAL.SUCCESS, bookingIds);
  } catch (err) {
    const errMsg = MESSAGES.GENERAL.SOMETHING_WENT_WRONG;
    const code = STATUS_CODE.SERVER_ERROR;

    if (isInternalCall) {
      throw new Error(errMsg);
    }

    return errorResponse(res, errMsg, err.message, code);
  }
};

export const driverRunningBillSeq = async (req, res) => {
  try {
    const insertDriverLocationData = await addSetLocation(req, res, true);
    if (insertDriverLocationData) {
      const bookingId = insertDriverLocationData.bookingIds; // Need to check if data comming into array will fix this
      let actualTravelDetail;
      if (bookingId) {
        actualTravelDetail = await bookingTravelDetails(bookingId);
      }

      if (actualTravelDetail) {
        let bookingEstData = actualTravelDetail[0];
        let running_distance = Number(bookingEstData.distance);
        let fareParams = {
          distance: running_distance,
          duration: bookingEstData.duration,
          master_package_type: "1",
          master_package_mode_id: "1",
          ignore_km: bookingEstData.approx_after_km,
          ignore_hr: bookingEstData.approx_after_hour,
          minimumCharge: bookingEstData.minimum_charge,
          per_km_charge: bookingEstData.approx_distance_charge,
          per_hr_charge: bookingEstData.approx_hour_charge,
        };
        let fareCalculation = await getfareCalculation(fareParams); // Neet to write in fare management
        let finalArr = {
          minimum_charge: fareCalculation.minimum_charge,
          running_distance: running_distance,
          min_distance: fareCalculation.min_distance,
          min_hour: fareCalculation.min_pkg_hrs,
          per_km_charge: fareCalculation.per_km_charge,
          per_hr_charge: fareCalculation.per_hr_charge,
          duration: bookingEstData.duration,
          pre_Waiting_time: bookingEstData.pre_Waiting_time,
          WaitingTime: bookingEstData.WaitingTime,
          running_amount: fareCalculation.totalbill,
          totalBill: fareCalculation.totalbill,
          state_tax: bookingEstData.state_tax,
          toll_tax: bookingEstData.toll_tax,
        };
        let tax =
          Number(bookingEstData.sgst_tax) +
          Number(bookingEstData.cgst_tax) +
          Number(bookingEstData.igst_tax);
        let taxPrice = Math.round((fareCalculation.totalbill * tax) / 100);
        let totalBill = Number(fareCalculation.totalbill) + Number(taxPrice);

        finalArr.tax = tax;
        finalArr.tax_price = taxPrice;
        finalArr.totalBill = totalBill;

        // Need to create this method into the fare management
        let night_charges = await nightChargeCalculation(
          bookingEstData.pickup_time,
          bookingEstData.night_rate_begins,
          bookingEstData.night_rate_ends,
          bookingEstData.night_rate_type,
          bookingEstData.night_rate_value,
          totalBill
        );

        if (night_charges > 0) {
          totalBill = Number(totalBill) + Number(night_charges);
          finalArr.night_charge = night_charges;
          finalArr.totalBill = totalBill;
        }

        if (bookingEstData.extras != "" && bookingEstData.extra_price > 0) {
          finalArr.extras_values = bookingEstData.extras;
          finalArr.extra_charge = bookingEstData.extra_price;
          totalBill = Number(totalBill) + Number(bookingEstData.extra_price);
          finalArr.totalBill = totalBill;
        }

        if (
          bookingEstData.peak_time_value != "" &&
          bookingEstData.peak_time_price > 0
        ) {
          finalArr.peak_time_value = bookingEstData.peak_time_value;
          finalArr.peak_time_charge = bookingEstData.peak_time_price;
          totalBill =
            Number(totalBill) + Number(bookingEstData.peak_time_price);
          finalArr.totalBill = totalBill;
        }

        return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
          data: finalArr,
        });
      }
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NOT_FOUND, {});
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

export const driverAvailabilityStatus = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      {},
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    const result = await VendorStatus.findAll({
      where: { user_id },
      include: [
        {
          model: Booking,
          attributes: ["reference_number"],
        },
      ],
      attributes: [
        "user_id",
        "booking_id",
        "vendor_status",
        [
          VendorStatus.sequelize.literal(
            "DATE_FORMAT(start_date,'%Y-%m-%d %H:%i:%s')"
          ),
          "trip_start_time",
        ],
        [
          VendorStatus.sequelize.literal(
            "DATE_FORMAT(end_date,'%Y-%m-%d %H:%i:%s')"
          ),
          "trip_end_time",
        ],
        "created_by",
      ],
      raw: true,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
        data: result,
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        {},
        STATUS_CODE.NOT_FOUND
      );
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

export const getDriverClaimList = async (req, res) => {
  try {
    const {
      vehicle_type_id,
      master_package_id,
      booking_amount,
      city_id,
      user_id,
      type,
    } = req.body;

    const conditions = [];

    if (vehicle_type_id) {
      conditions.push(`mvt.id >= ${vehicle_type_id}`);
    }

    if (master_package_id) {
      conditions.push(`udp.package_id = ${master_package_id}`);
      if (master_package_id == 2 && booking_amount) {
        conditions.push(`user.wallet_amount >= ${booking_amount}`);
      }
    }

    if (city_id) {
      conditions.push(
        `(udpc.city_id = '${city_id}' OR ui.city_id = '${city_id}')`
      );
    }

    if (user_id) {
      conditions.push(`user.parent_id = ${user_id}`);
    }

    if (type) {
      if (type === "Online-Active") {
        conditions.push(`(user.gcm_id IS NOT NULL AND user.gcm_id != '')`);
        conditions.push(`user.login_status = 1`);
        conditions.push(`user.isActive = 1`);
      } else if (type === "Online-InActive") {
        conditions.push(`(user.gcm_id IS NOT NULL AND user.gcm_id != '')`);
        conditions.push(`user.login_status = 1`);
        conditions.push(`user.isActive IN (4, 5)`);
      } else if (type === "Offline-Active") {
        conditions.push(`user.login_status = 0`);
        conditions.push(`user.isActive = 1`);
      } else if (type === "Offline-InActive") {
        conditions.push(`user.login_status = 0`);
        conditions.push(`user.isActive IN (4, 5)`);
      } else if (type === "All") {
        conditions.push(`user.login_status IN (0, 1)`);
        conditions.push(`user.isActive IN (1, 4, 5)`);
      }
    }

    conditions.push(`user.user_type_id IN (3, 4)`);

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `
      SELECT user.id AS user_id,
        MAX(user.wallet_amount) AS wallet_amount,
        MAX(user.gcm_id) AS gcm_id,
        MAX(user.first_name) AS first_name,
        MAX(user.last_name) AS last_name,
        MAX(user.email) AS email,
        MAX(user.mobile) AS mobile,
        MAX(user.parent_id) AS parent_id,
        MAX(user.user_type_id) AS user_type_id,
        MAX(ui.city_id) AS city_id,
        MAX(mvm.name) AS vehicle_model_name,
        GROUP_CONCAT(DISTINCT mvt.id) AS vehicle_type_id,
        GROUP_CONCAT(DISTINCT mvt.category_id) AS category_id,
        GROUP_CONCAT(DISTINCT mvt.vehicle_type) AS vehicle_type,
        GROUP_CONCAT(DISTINCT mvm.name) AS vehicle_name,
        GROUP_CONCAT(DISTINCT udp.package_id) AS driver_package,
        GROUP_CONCAT(DISTINCT udpc.city_id) AS user_pref_city,
        GROUP_CONCAT(DISTINCT m_shift.working_shift_id) AS working_shift_id,
        GROUP_CONCAT(DISTINCT m_shift.shift_time) AS working_shift_time,
        GROUP_CONCAT(DISTINCT master_language.language_name) AS user_language,
        GROUP_CONCAT(DISTINCT vm.model) AS vehicle_model,
        GROUP_CONCAT(DISTINCT color.colour_name) AS vehicle_color,
        GROUP_CONCAT(DISTINCT fuel.fuel_type) AS fuel_type,
        max(vm.vehicle_no) AS vehicle_no,
        max(vm.model) AS model_year
      FROM user
        INNER JOIN driver ON user.id = driver.user_id
        INNER JOIN user_info AS ui ON user.id = ui.user_id
        LEFT JOIN vendor_status AS vs ON user.id = vs.user_id
        LEFT JOIN user_vehicle_mapping AS uvm ON user.id = uvm.user_id
        LEFT JOIN vehicle_master AS vm ON uvm.vehicle_master_id = vm.vehicle_master_id
        LEFT JOIN master_colour AS color ON vm.color = color.colour_id
        LEFT JOIN master_fuel_type AS fuel ON vm.ignition_type_id = fuel.id
        LEFT JOIN master_vehicle_model AS mvm ON vm.id = mvm.id
        LEFT JOIN master_vehicle_type AS mvt ON mvm.vehicle_type_id = mvt.id
        LEFT JOIN user_duty_pref AS udp ON user.id = udp.user_id AND udp.status = 1
        LEFT JOIN user_pref_drive_city AS udpc ON user.id = udpc.user_id
        LEFT JOIN user_workingshift_mapping AS workshift ON user.id = workshift.user_id
        LEFT JOIN master_working_shift AS m_shift ON workshift.working_shift_id = m_shift.working_shift_id
        LEFT JOIN user_language AS language ON user.id = language.user_id AND language.status = 1
        LEFT JOIN master_language ON language.language_id = master_language.language_id
      ${whereClause}
      GROUP BY uvm.user_id
    `;

    const result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DRIVER_CLAIMED_LIST, {
        result,
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        {},
        STATUS_CODE.NOT_FOUND
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

export const getStartMeterReading = async (driverId, booking_id) => {
  try {
    const meterReadingData = await BookingTracker.findOne({
      where: {
        DriverId: driverId,
        BookingID: booking_id,
        CabStatus: "7",
      },
      attributes: ["starting_meter"],
    });
    return successResponse(res, MESSAGES.GENERAL.SUCCESS, { meterReadingData });
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const addTripComment = async (req, res) => {
  const { booking_id, commented_by_id, commenter_type, comment } = req.body;

  if (!booking_id || !commented_by_id || !commenter_type || !comment) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      {},
      STATUS_CODE.BAD_REQUEST
    );
  }

  if (!["client", "driver"].includes(commenter_type)) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.INVALID_COMMENT,
      {},
      STATUS_CODE.BAD_REQUEST
    );
  }

  try {
    await TripComment.create({
      booking_id,
      commented_by_id,
      commenter_type,
      comment,
      created_at: new Date(),
    });

    return successResponse(res, "Comment added successfully.");
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const allocationHistory = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { from_date, to_date } = req.query;

  if (!userId || !from_date || !to_date) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.INVALID_PARAMS
    );
  }

  const sql = `
    SELECT 
      DATE(updateOn) AS date,
      SUM(IF(status = 'A', 1, 0)) AS total_accepted,
      SUM(IF(status = 'C', 1, 0)) AS total_cancelled,
      SUM(IF(status = 'M', 1, 0)) AS total_missed,
      SUM(IF(status = 'R', 1, 0)) AS total_rejected
    FROM booking_register
    WHERE driverId = :userId
      AND updateOn BETWEEN :fromDate AND :toDate
    GROUP BY DATE(updateOn)
  `;

  try {
    const [results] = await sequelize.query(sql, {
      replacements: {
        userId,
        fromDate: from_date,
        toDate: to_date,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const allocationHistoryDetails = async (req, res) => {
  const userId = parseInt(req.query.driver_id);
  const { date, booking_status } = req.query;

  if (!userId || !date) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.INVALID_PARAMS
    );
  }

  const sql = `
    SELECT 
      br.*, 
      b.reference_number, 
      CONCAT(u.first_name, ' ', u.last_name) AS client_name,
      u.mobile, 
      u.email, 
      pd.pickup_address
    FROM booking_register AS br
    LEFT JOIN booking AS b ON br.bookingid = b.booking_id
    LEFT JOIN user AS u ON b.user_id = u.id
    LEFT JOIN booking_pickdrop_details AS pd ON b.booking_id = pd.booking_id
    WHERE br.driverId = :userId
      AND DATE(br.updateOn) = :date
      ${booking_status ? "AND br.status = :status" : ""}
    GROUP BY br.bookingid
  `;

  const replacements = {
    userId,
    date,
    ...(booking_status ? { status: booking_status } : {}),
  };

  try {
    const [results] = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const driverLedger = async (req, res) => {
  const userId = parseInt(req.query.user_id);
  const { from_date, to_date } = req.query;

  if (!userId || !from_date || !to_date) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.INVALID_PARAMS
    );
  }

  const sql = `
    SELECT 
      ut.user_id,
      book.reference_number,
      ut.created_date,
      ut.time,
      payment_type.pay_type_mode,
      COALESCE(CASE WHEN ut.action_type = "Debit" THEN ut.amount END, 0) AS debit_amount,
      COALESCE(CASE WHEN ut.action_type = "Credit" THEN ut.amount END, 0) AS credit_amount,
      COALESCE((
        (SELECT SUM(IF(action_type = "Credit", amount, 0)) 
         FROM user_transaction b 
         WHERE b.booking_trans_id <= ut.booking_trans_id AND user_id = :userId)
        -
        (SELECT SUM(IF(action_type = "Debit", amount, 0)) 
         FROM user_transaction b 
         WHERE b.booking_trans_id <= ut.booking_trans_id AND user_id = :userId)
      ), 0) AS balance
    FROM user_transaction AS ut
    LEFT JOIN booking AS book ON ut.booking_id = book.booking_id
    LEFT JOIN payment_type ON ut.payment_type_id = payment_type.payment_type_id
    WHERE ut.user_id = :userId
      AND DATE(ut.created_date) BETWEEN :fromDate AND :toDate
    ORDER BY ut.booking_trans_id DESC
  `;

  try {
    const [results] = await sequelize.query(sql, {
      replacements: {
        userId,
        fromDate: from_date,
        toDate: to_date,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getDriverTransactions = async (req, res) => {
  try {
    const { user_id, from_date, to_date } = req.body;

    if (!user_id) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.INVALID_PARAMS
      );
    }

    let whereClause = `WHERE dt.user_id = :user_id`;
    if (from_date && to_date) {
      whereClause += ` AND DATE(dt.time) >= :from_date AND DATE(dt.time) <= :to_date`;
    }

    const sql = `
      SELECT dt.id,
             DATE_FORMAT(dt.time, '%Y-%m-%d %H:%i:%s') AS time,
             dt.user_id,
             dt.amount AS deduction,
             bc.total_price,
             bc.driver_share_amt,
             bc.markup_value AS markup_price,
             dt.basic_tax_amount AS total_tax,
             (dt.amount + dt.basic_tax_amount) AS totaldeduction,
             dt.currentbalance,
             dt.status,
             dt.booking_ref,
             dt.reason,
             bpd.pickup_area AS pickuplocation,
             bpd.drop_area AS droplocation,
             mp.name AS booking_type,
             bc.invoice_number
      FROM driver_transaction AS dt
      LEFT JOIN booking_charges AS bc ON CONCAT("IN-", dt.booking_ref) = bc.invoice_number
      LEFT JOIN booking AS cb ON dt.user_id = cb.driver_id AND dt.booking_ref = cb.reference_number
      LEFT JOIN booking_pickdrop_details AS bpd ON cb.booking_id = bpd.booking_id
      LEFT JOIN master_package AS mp ON cb.master_package_id = mp.id
      ${whereClause}
      ORDER BY dt.id DESC
    `;

    const results = await sequelize.query(sql, {
      replacements: { user_id, from_date, to_date },
      type: QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { results });
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, {});
    }
  } catch (err) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      err.message
    );
  }
};

export const addDriverRating = async (req, res) => {
  try {
    const {
      user_id,
      driver_id,
      booking_id,
      rating,
      comment_desc,
      created_date,
      created_by,
    } = req.body;

    const data = {
      UID: user_id,
      DID: driver_id,
      BookingId: booking_id,
      rating,
      comment_desc,
      created_date,
      created_by,
    };

    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || data[key] === "") {
        delete data[key];
      }
    });

    const result = await DriverRating.create(data);

    return successResponse(res, MESSAGES.GENERAL.DATA_SAVED, { result });
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.DATA_NOT_SAVED,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getTotalDriverRating = async (req, res) => {
  const { driverId } = req.params;

  try {
    const [result] = await sequelize.query(
      `
      SELECT 
        DID,
        SUM(rating = 1) AS one_rating,
        SUM(rating = 2) AS two_rating,
        SUM(rating = 3) AS three_rating,
        SUM(rating = 4) AS four_rating,
        SUM(rating = 5) AS five_rating
      FROM driver_rating
      WHERE DID = :driverId
      GROUP BY DID
      `,
      {
        replacements: { driverId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (result) {
      return successResponse(res, MESSAGES.GENERAL.DATA_SAVED, { result });
    } else {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NO_DATA_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      err.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getDrivers = async (req, res) => {
  try {
    let {
      user_id,
      user_type_id,
      company_id,
      vendor_id,
      first_name,
      mobile,
      email,
      country_id,
      state_id,
      city_id,
      status,
      company,
      searchValue,
      sort_column,
      sort_order,
      limit = 10,
      offset,
    } = req.body;

    let sql = `
     SELECT
  u.id as user_id,
  u.parent_id,
  u.user_type_id,
  MAX(role.RoleName) as user_type,
  u.referral_key,
  CONCAT(u.first_name, ' ', u.last_name) as name,
  MAX(CONCAT(vendor.first_name, ' ', vendor.last_name)) as vendor_name,
  u.email,
  u.mobile,
  u.user_grade,
  MAX(ui.gender) as gender,
  u.isActive,
  u.login_time,
  MAX(driver.status) as duty_status,
  DATE_FORMAT(u.created_date, '%Y-%m-%d %h:%i:%s') as created_date,
  u.signup_status,
  MAX(ui.father_name) as father_name,
  MAX(ui.state_id) as state_id,
  MAX(ui.country_id) as country_id,
  MAX(ui.city_id) as city_id,
  MAX(mct.name) as city_name,
  MAX(mct.state_name) as state_name,
  MAX(mct.country_name) as country_name,
  MAX(driver.driving_license_no) as driving_license_no,
  MAX(ms2.name) as license_state,
  MAX(driver.pancard_no) as pancard_no,
  MAX(driver.license_validity) as license_validity,
  MAX(company.company_name) as company_name,
  MAX(company.company_address) as company_address,
  MAX(company.pincode) as pincode,
  MAX(company.contact_person_name) as contact_person_name,
  MAX(company.email) as company_email,
  MAX(company.alt_email) as company_alt_email,
  MAX(company.mobile_no) as company_mobile,
  MAX(company.landline_no) as landline_no,
  MAX(company.service_tax_gst) as service_tax_gst,
  MAX(company.pancard_no) as company_pancard_no,
  MAX(vehiclemodel.name) as vehicle_name,
  MAX(vehiclemodel.image) as vehicle_image,
  MAX(vehiclemaster.vehicle_no) as vehicle_no,
  MAX(vehiclemaster.permit_exp_date) as permit_exp_date,
  MAX(vehiclemaster.model) as model,
  MAX(fueltype.fuel_type) as fuel_type,
  GROUP_CONCAT(DISTINCT pkg.name SEPARATOR ', ') as duty_type,
  GROUP_CONCAT(DISTINCT dutycity.name SEPARATOR ',') as duty_pref_city,
  GROUP_CONCAT(DISTINCT masterwkshift.shift SEPARATOR ',') as working_shift,
  MAX(active.status_class) as status_class,
  MAX(cab_status.status_id) as driver_status_id,
  MAX(cab_status.status) as driver_status,
  u.login_status,
  COUNT(bk.driver_id) AS booking,
  MAX(signup_status.status_name) as status_name,
  MAX(signup_status.signup_status_class) as signup_status_class,
  u.active_by,
  MAX(CONCAT(u1.first_name, ' ', u1.last_name)) as activate_by,
  (
    SELECT GROUP_CONCAT(mdt.document_name SEPARATOR ',')
    FROM master_document_type mdt
    WHERE NOT EXISTS (
      SELECT 1
      FROM user_upload_document uud
      WHERE uud.document_type_id = mdt.doc_type_id
        AND uud.user_id = u.id
    )
  ) AS pending_doc
   FROM user u
   LEFT JOIN user_info ui ON u.id = ui.user_id
   LEFT JOIN user u1 ON u.active_by = u1.id
   LEFT JOIN master_city mct ON mct.id = ui.city_id AND mct.state_id = ui.state_id AND mct.country_id = ui.country_id
   LEFT JOIN user_role role ON u.user_type_id = role.Role_ID
   LEFT JOIN driver ON u.id = driver.user_id
   LEFT JOIN master_state ms2 ON driver.license_state = ms2.id
   LEFT JOIN company ON u.id = company.user_id
   LEFT JOIN user_vehicle_mapping vehicle ON u.id = vehicle.user_id
   LEFT JOIN vehicle_master vehiclemaster ON vehicle.vehicle_master_id = vehiclemaster.vehicle_master_id
   LEFT JOIN master_vehicle_model vehiclemodel ON vehiclemaster.id = vehiclemodel.id
   LEFT JOIN master_fuel_type fueltype ON vehiclemaster.ignition_type_id = fueltype.id
   LEFT JOIN user vendor ON vendor.parent_id = u.id
   LEFT JOIN user_duty_pref dutypref ON u.id = dutypref.user_id AND dutypref.status = 1
   LEFT JOIN master_package pkg ON dutypref.package_id = pkg.id
   LEFT JOIN user_pref_drive_city citypref ON u.id = citypref.user_id AND citypref.status = 1
   LEFT JOIN master_city dutycity ON citypref.city_id = dutycity.id
   LEFT JOIN user_workingshift_mapping wkshift ON u.id = wkshift.user_id AND wkshift.status = 1
   LEFT JOIN master_working_shift masterwkshift ON wkshift.working_shift_id = masterwkshift.working_shift_id
   LEFT JOIN booking bk ON u.id = bk.driver_id
   LEFT JOIN cab_status ON u.IsActive = cab_status.status_id AND cab_status.type = 'driverS'
   LEFT JOIN active ON u.IsActive = active.status_id
   LEFT JOIN signup_status ON u.signup_status = signup_status.signup_status_id
   WHERE 1=1
    `;

    const replacements = {};

    if (user_id) {
      sql += " AND u.id = :user_id";
      replacements.user_id = user_id;
    }
    if (user_type_id) {
      sql += ` AND u.user_type_id IN(${user_type_id})`;
    }
    if (company_id) {
      sql += " AND u.company_id = :company_id";
      replacements.company_id = company_id;
    }
    if (vendor_id) {
      sql += " AND u.parent_id = :vendor_id";
      replacements.vendor_id = vendor_id;
    }
    if (first_name) {
      sql += " AND u.first_name LIKE :first_name";
      replacements.first_name = `${first_name}%`;
    }
    if (mobile) {
      sql += " AND u.mobile = :mobile";
      replacements.mobile = mobile;
    }
    if (email) {
      sql += " AND u.email = :email";
      replacements.email = email;
    }
    if (country_id) {
      sql += " AND ui.country_id = :country_id";
      replacements.country_id = country_id;
    }
    if (state_id) {
      sql += " AND ui.state_id = :state_id";
      replacements.state_id = state_id;
    }
    if (city_id) {
      sql += " AND ui.city_id = :city_id";
      replacements.city_id = city_id;
    }
    if (status !== undefined && status !== "") {
      sql += " AND u.isActive = :status";
      replacements.status = status;
    }
    if (company) {
      sql += " AND company.company_name = :company";
      replacements.company = company;
    }
    if (searchValue) {
      sql += ` ${searchValue}`; // use with care
    }

    sql += " GROUP BY u.id";

    if (sort_column && sort_order) {
      sql += ` ORDER BY ${sort_column} ${sort_order}`;
    } else {
      sql += " ORDER BY u.id DESC";
    }

    if (limit && offset) {
      sql += " LIMIT :limit OFFSET :offset";
      replacements.limit = parseInt(limit);
      replacements.offset = parseInt(offset);
    }

    const results = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results);
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }
};


export const getRecentDrivers = async (req, res) => {
  try {
    let sql = `
     SELECT 
  u.id as user_id,
  u.parent_id,
  u.user_type_id,
  role.RoleName as user_type,
  u.referral_key,
  CONCAT(u.first_name, ' ', u.last_name) as name,
  MAX(CONCAT(vendor.first_name, ' ', vendor.last_name)) as vendor_name,
  u.email,
  u.mobile,
  u.user_grade,
  MAX(ui.gender) as gender,
  u.isActive,
  u.login_time,
  driver.status as duty_status,
  DATE_FORMAT(u.created_date, '%Y-%m-%d %h:%i:%s') as created_date,
  u.signup_status,
  MAX(ui.father_name) as father_name,
  MAX(ui.state_id) as state_id,
  MAX(ui.country_id) as country_id,
  MAX(ui.city_id) as city_id,
  mct.name as city_name,
  mct.state_name,
  mct.country_name,
  driver.driving_license_no,
  ms2.name as license_state,
  driver.pancard_no,
  driver.license_validity,
  company.company_name,
  company.company_address,
  company.pincode,
  company.contact_person_name,
  company.email as company_email,
  company.alt_email as company_alt_email,
  company.mobile_no as company_mobile,
  company.landline_no,
  company.service_tax_gst,
  company.pancard_no,
  vehiclemodel.name as vehicle_name,
  vehiclemodel.image as vehicle_image,
  vehiclemaster.vehicle_no,
  vehiclemaster.permit_exp_date,
  vehiclemaster.model,
  fueltype.fuel_type,
  GROUP_CONCAT(DISTINCT pkg.name SEPARATOR ', ') as duty_type,
  GROUP_CONCAT(DISTINCT dutycity.name SEPARATOR ',') as duty_pref_city,
  GROUP_CONCAT(DISTINCT masterwkshift.shift SEPARATOR ',') as working_shift,
  active.status_class,
  cab_status.status_id as driver_status_id,
  cab_status.status as driver_status,
  u.login_status,
  COUNT(bk.driver_id) AS booking,
  signup_status.status_name,
  signup_status.signup_status_class,
  u.active_by,
  CONCAT(u1.first_name, ' ', u1.last_name) as activate_by,
  (
    SELECT GROUP_CONCAT(mdt.document_name SEPARATOR ',')
    FROM master_document_type mdt
    WHERE NOT EXISTS (
      SELECT 1
      FROM user_upload_document uud
      WHERE uud.document_type_id = mdt.doc_type_id
        AND uud.user_id = u.id
    )
  ) AS pending_doc
   FROM user u
   LEFT JOIN user_info ui ON u.id = ui.user_id
   LEFT JOIN user u1 ON u.active_by = u1.id
   LEFT JOIN master_city mct ON mct.id = ui.city_id AND mct.state_id = ui.state_id AND mct.country_id = ui.country_id
   LEFT JOIN user_role role ON u.user_type_id = role.Role_ID
   LEFT JOIN driver ON u.id = driver.user_id
   LEFT JOIN master_state ms2 ON driver.license_state = ms2.id
   LEFT JOIN company ON u.id = company.user_id
   LEFT JOIN user_vehicle_mapping vehicle ON u.id = vehicle.user_id
   LEFT JOIN vehicle_master vehiclemaster ON vehicle.vehicle_master_id = vehiclemaster.vehicle_master_id
   LEFT JOIN master_vehicle_model vehiclemodel ON vehiclemaster.id = vehiclemodel.id
   LEFT JOIN master_fuel_type fueltype ON vehiclemaster.ignition_type_id = fueltype.id
   LEFT JOIN user vendor ON vendor.parent_id = u.id
   LEFT JOIN user_duty_pref dutypref ON u.id = dutypref.user_id AND dutypref.status = 1
   LEFT JOIN master_package pkg ON dutypref.package_id = pkg.id
   LEFT JOIN user_pref_drive_city citypref ON u.id = citypref.user_id AND citypref.status = 1
   LEFT JOIN master_city dutycity ON citypref.city_id = dutycity.id
   LEFT JOIN user_workingshift_mapping wkshift ON u.id = wkshift.user_id AND wkshift.status = 1
   LEFT JOIN master_working_shift masterwkshift ON wkshift.working_shift_id = masterwkshift.working_shift_id
   LEFT JOIN booking bk ON u.id = bk.driver_id
   LEFT JOIN cab_status ON u.IsActive = cab_status.status_id AND cab_status.type = 'driverS'
   LEFT JOIN active ON u.IsActive = active.status_id
   LEFT JOIN signup_status ON u.signup_status = signup_status.signup_status_id
   WHERE 1=1
    `;

    // Add any additional filters if needed (optional)
    // For example, if you only want active drivers:
    // sql += " AND u.isActive = 1";

    sql += " GROUP BY u.id";
    sql += " ORDER BY u.id DESC";
    sql += " LIMIT 5";

    const results = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      logging: console.log,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results);
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }
};

export const getdriverRating = async (driverId, bookingId) => {
  try {
    const result = await DriverRating.findOne({
      where: {
        DID: driverId,
        BookingId: bookingId,
        created_by: "user",
      },
      attributes: ["rating"],
    });
    return result;
  } catch (err) {
    console.error("Error in getdriverRating:", err);
    throw err;
  }
};

export const getDriverCombo = async (req, res) => {
  try {
    const user_id = req?.user?.id ?? 1;
    const user_type_id = req?.user?.role;

    let company_id = null;

    if (user_type_id !== 10) {
      const userData = await User.findByPk(user_id);
      company_id = userData?.company_id;
    }

    const whereClause = {
      user_type_id: 3,
      ...(company_id && { company_id }),
    };

    const driverData = await User.findAll({
      where: whereClause,
      attributes: ["id", "first_name", "last_name", "mobile"],
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, driverData);
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }
};

export const getUserDriverList = async (req, res) => {
  const { first_name } = req.body;
  try {
    let sql = `
      SELECT u.id, u.first_name, u.last_name, u.email, u.mobile 
      FROM user AS u
      LEFT JOIN user_role ur ON u.user_type_id = ur.Role_ID
      WHERE 1=1
    `;

    const replacements = {};

    if (first_name) {
      sql += " AND u.first_name LIKE :first_name";
      replacements.first_name = `%${first_name}%`;
    }

    sql += " ORDER BY u.id DESC";

    const results = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results);
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }
};

// export const updateDriverLicenseDetail = async(req,res) => {
//   const {
//     driving_license_no,
//     license_state,
//     pancard_no,
//     license_validity,
//     gps,
//   } = req.body;
//   console.log(req.body);
//   try {

//   } catch (error) {
//     return errorResponse(
//       res,
//       error.message,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG
//     );
//   }
// }

// export const updateDriverLicenseDetail = async (req, res) => {
//   const {
//     driving_license_no,
//     license_state,
//     pancard_no,
//     license_validity,
//     gps,

//     license_proof,
//     police_proof,
//     pancard_proof,
//     audit_proof,
//     bank_proof,
//   } = req.body;

//   console.log(req.body);
//   // return;

//   try {
//     // Try to find existing driver by user_id
//     const existingDriver = await Driver.findOne({
//       where: { user_id: Number(req.user.id) },
//     });

//     if (existingDriver) {
//       // Update existing record
//       await existingDriver.update({
//         driving_license_no,
//         license_state,
//         pancard_no,
//         license_validity, // should be a valid date string
//         gps,
//       });
//       console.log(existingDriver);

//       // return successResponse(
//       //   res,
//       //   existingDriver,
//       //   "Driver license details updated successfully"
//       // );
//     } else {
//       // Create new driver record
//       const newDriver = await Driver.create({
//         user_id: Number(req.user.id),
//         driving_license_no,
//         license_state,
//         pancard_no,
//         license_validity,
//         gps,
//         created_date: Date.now(),
//       });

//       // return successResponse(
//       //   res,
//       //   newDriver,
//       //   "Driver license details added successfully"
//       // );
//     }

//     //======================
//     // Map of labels -> path values from req.body
//     const documentMap = {
//       license_proof,
//       police_proof,
//       pancard_proof,
//       audit_proof,
//       bank_proof,
//     };

//     console.log(documentMap);

//     for (const [label, path] of Object.entries(documentMap)) {
//       if (!path) continue; // Skip if no path provided

//       // 1. Find the document type by label
//       const docType = await MasterDocumentType.findOne({
//         where: { doc_level_name: label },
//       });

//       console.log(docType?.dataValues);

//       if (!docType?.dataValues) continue; // Skip if label not found in master

//       const existingDoc = await UserUploadDocument.findOne({
//         where: {
//           user_id: req.user.id,
//           document_type_id: docType?.dataValues?.doc_type_id,
//         },
//       });

//       if (existingDoc) {
//         // 2. Update existing document
//         await existingDoc.update({
//           doc_file_upload: path,
//           updated_at: new Date(),
//           updated_by: req.user.id,
//         });
//       } else {
//         // 3. Create new document
//         await UserUploadDocument.create({
//           user_id: req.user.id,
//           document_type_id: docType?.dataValues?.doc_type_id,
//           doc_file_upload: path,
//           created_at: new Date(),
//           created_by: req.user.id,
//         });
//       }
//     }
//     //======================

//      return successResponse(
//         res,
//         newDriver,
//         "Driver license details added successfully"
//       );
//   } catch (error) {
//     console.error(error);
//     return errorResponse(
//       res,
//       error.message || "Unknown Error",
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG
//     );
//   }
// };

export const updateDriverLicenseDetail = async (req, res) => {
  const {
    driving_license_no,
    license_state,
    pancard_no,
    license_validity,
    gps,

    license_proof,
    police_proof,
    pancard_proof,
    audit_proof,
    bank_proof,
  } = req.body;

  try {
    let driverData;

    // Try to find existing driver by user_id
    const existingDriver = await Driver.findOne({
      where: { user_id: Number(req.user.id) },
    });

    if (existingDriver) {
      // Update existing record
      await existingDriver.update({
        driving_license_no,
        license_state,
        pancard_no,
        license_validity,
        gps,
      });

      driverData = existingDriver;
    } else {
      // Create new driver record
      driverData = await Driver.create({
        user_id: Number(req.user.id),
        driving_license_no,
        license_state,
        pancard_no,
        license_validity,
        gps,
        created_date: new Date(),
      });
    }

    //======================
    const documentMap = {
      license_proof,
      police_proof,
      pancard_proof,
      audit_proof,
      bank_proof,
    };

    console.log(documentMap);

    // for (const [label, path] of Object.entries(documentMap)) {
    //   if (!path) continue;

    //   const docType = await MasterDocumentType.findOne({
    //     where: { doc_level_name: label },
    //   });

    //   if (!docType) {
    //     continue;
    //   }

    //   const document_type_id = docType.doc_type_id;

    //   const existingDoc = await UserUploadDocument.findOne({
    //     where: {
    //       user_id: req.user.id,
    //       document_type_id,
    //     },
    //   });

    //   if (existingDoc) {
    //     // Update existing document
    //     await existingDoc.update({
    //       doc_file_upload: path,
    //       updated_at: new Date(),
    //       updated_by: req.user.id,
    //     });
    //   } else {
    //     // Create new document entry
    //     await UserUploadDocument.create({
    //       user_id: req.user.id,
    //       document_type_id,
    //       doc_file_upload: path,
    //       created_at: new Date(),
    //       created_by: req.user.id,
    //     });
    //   }
    // }
    //======================

    for (const [label, path] of Object.entries(documentMap)) {
      if (!path) continue;

      const docType = await MasterDocumentType.findOne({
        where: { doc_level_name: label },
      });

      if (!docType) {
        continue;
      }

      const document_type_id = docType.doc_type_id;

      const existingDoc = await UserUploadDocument.findOne({
        where: {
          user_id: req.user.id,
          document_type_id,
          status: 1,
        },
      });

      if (existingDoc) {
        await existingDoc.update({
          status: 0,
        });
      }

      // Create new document entry with doc_default = 1
      await UserUploadDocument.create({
        user_id: req.user.id,
        document_type_id,
        doc_file_upload: path,
        status: 1,
        created_date: new Date(),
        created_by: req.user.id,
      });
    }
    // ======================================================

    return successResponse(
      res,
      driverData,
      "Driver license details processed successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Unknown Error",
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }
};

// export const getDriverLicenseDetails = async (req, res) => {
//   const userId = Number(req.user.id);
//   const docIds = [3,4,5,7]; // Pass this list dynamically if needed

//   try {
//     const sql = `
//       SELECT
//         d.*,
//         ud.doc_file_upload,
//         ud.document_type_id
//       FROM
//         driver d
//       LEFT JOIN
//         user_upload_document ud
//       ON
//         d.user_id = ud.user_id
//       WHERE
//         d.user_id = :user_id
//         AND (ud.document_type_id IN (:doc_ids) OR ud.document_type_id IS NULL)
//     `;

//     const results = await sequelize.query(sql, {
//       replacements: { user_id: userId, doc_ids: docIds },
//       type: sequelize.QueryTypes.SELECT,
//     });

//     return successResponse(
//       res,
//       results,
//       "Driver license details fetched successfully"
//     );
//   } catch (error) {
//     console.error("❌ Error fetching driver details:", error);
//     return errorResponse(
//       res,
//       error.message || "Unknown Error",
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG
//     );
//   }
// };

export const getDriverLicenseDetails = async (req, res) => {
  const { id } = req.query;
  const userId = Number(req.user.id);
  const docIds = [3, 4, 5, 7, 28];

  try {
    const sql = `
      SELECT 
        d.*, 
        ud.doc_file_upload, 
        master_state.name,
        mdt.doc_level_name AS label
      FROM 
        driver d
      LEFT JOIN 
        user_upload_document ud 
      ON 
        d.user_id = ud.user_id
      LEFT JOIN 
        master_document_type mdt
      ON 
        ud.document_type_id = mdt.doc_type_id
      LEFT JOIN master_state ON master_state.id = d.license_state
      WHERE 
        d.user_id = :user_id
        AND (ud.document_type_id IN (:doc_ids) OR ud.document_type_id IS NULL)
    `;

    const results = await sequelize.query(sql, {
      replacements: { user_id: id || userId, doc_ids: docIds },
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length === 0) {
      return successResponse(res, {}, "No driver data found");
    }

    // Extract driver details from first row
    const {
      id,
      user_id,
      driving_license_no,
      license_state,
      pancard_no,
      license_validity,
      gps,
      created_date,
      name,
    } = results[0];

    // Build a document map
    const documentMap = {};
    results.forEach((row) => {
      if (row.label && row.doc_file_upload) {
        documentMap[row.label] = row.doc_file_upload;
      }
    });

    // Final response structure
    const response = {
      driver: {
        id,
        user_id,
        driving_license_no,
        license_state,
        pancard_no,
        license_validity,
        gps,
        created_date,
        name,
      },
      documents: documentMap,
    };

    return successResponse(
      res,
      response,
      "Driver license details fetched successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Unknown Error",
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }
};

export const deleteDriverDetails = async (req, res) => {
  try {
    const userId = Number(req.user.id); // Or from req.body or req.user

    const sql = `
      UPDATE driver
      SET is_functional = 0
      WHERE user_id = :user_id
    `;

    await sequelize.query(sql, {
      replacements: { user_id: userId },
      type: sequelize.QueryTypes.UPDATE,
    });

    return res.status(200).json({ message: "Driver marked as non-functional" });
  } catch (error) {
    console.error("Error updating driver:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const payload = req.body;
    const id = req.params;
    const DriverData = await Driver.update(payload, { where: { user_id: id } });
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, DriverData);
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }
};
export const getDriverById = async (req, res) => {
  try {
    const id = req.params.id;
    const DriverData = await Driver.findOne({ where: { user_id: id } });
    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, DriverData);
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }
};
export const UploadDocuments = async (req, res, isInternalCall = false) => {
  const { documentMap } = req.body || req;
  try {
    for (const [label, path] of Object.entries(documentMap)) {
      if (!path) continue;

      const docType = await MasterDocumentType.findOne({
        where: { doc_level_name: label },
      });

      if (!docType) {
        continue;
      }

      const document_type_id = docType.doc_type_id;

      let doc = await UserUploadDocument.findOne({
        where: {
          user_id: req.user.id,
          document_type_id,
          status: 1,
        },
      });

      if (doc) {
        await doc.update({
          status: 0,
        });
      }

      // Create new document entry with doc_default = 1
      doc = await UserUploadDocument.create({
        user_id: req.user.id,
        document_type_id,
        doc_file_upload: path,
        status: 1,
        created_date: new Date(),
        created_by: req.user.id,
      });
    }
    if (isInternalCall) return doc;
    else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, doc);
    }
  } catch (error) {
    if (isInternalCall) throw new Error(error);
    else {
      return errorResponse(
        res,
        error.message,
        MESSAGES.GENERAL.SOMETHING_WENT_WRONG
      );
    }
  }
};

export const getUploadedDocuments = async (
  req,
  res,
  isInternalCall = false
) => {
  const { documentList } = req.body;
  const user_id = Number(req.user.id);
  try {
    const sql = `
      SELECT 
        ud.document_type_id,
        ud.doc_file_upload,
        md.doc_level_name
      FROM 
        user_upload_document ud
      LEFT JOIN master_document_type md ON md.doc_type_id = ud.document_type_id 
      WHERE 
        ud.user_id = :user_id
        AND ud.document_type_id IN (:doc_ids)
        AND ud.status = 1
    `;

    let results = await sequelize.query(sql, {
      replacements: {
        user_id,
        doc_ids: documentList,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    if (isInternalCall) return results;
    else {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, results);
    }
  } catch (error) {
    if (isInternalCall) throw new Error(error);
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG
    );
  }
};
