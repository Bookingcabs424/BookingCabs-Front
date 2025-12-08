import { ar, ca, es, ta, tr } from "date-fns/locale";
import sequelize from "../config/clientDbManager.js";
import LocalPackage from "../models/localPackageModel.js";
import MasterBookingType from "../models/masterBookingTypeModel.js";
import {
  bookCanRuleDateArr,
  calAutoExpiryDate,
  calDateExist,
  extractNumberFromString,
  getVehicleImages,
} from "../utils/helpers.js";
import MasterCurrency from "../models/masterCurrencyModel.js";
import { getAllAdminMarkup } from "./markupsController.js";
import {
  getUserCancellationFare,
  getUserPremiumsFare,
  sequentialgetallfare,
} from "./fareManagementController.js";
import {
  calculateCharges,
  getFareByPackageModeId,
  getFareCalculation,
  getFareData,
  getPackageFareByPackageId,
} from "./localHireController.js";
import CompanyShare from "../models/companyShareModel.js";
import { companyShareCalculation } from "./fareCalculation.js";
import UserPremiumsFare from "../models/userPremiumModel.js";
import PremiumsFare from "../models/premiumFareModel.js";
import MasterSacCode from "../models/MasterSacCodeModel.js";
import RtoStateTax from "../models/RtoStateTaxModel.js";
import TollTax from "../models/TollTaxModel.js";
import { successResponse } from "../utils/response.js";
import { MESSAGES } from "../constants/const.js";
import TaxDetail from "../models/taxDetailModel.js";
import MasterWeekDay from "../models/masterWeekDayModel.js";
import { NUMBER, Op } from "sequelize";
import dateFormat from "dateformat";
import masterCoupon from "../models/masterCoupon.js";
// Helper Functions

/**
 * Get vehicle type data by city, package, and other filters using Sequelize (raw query).
 * @param {Object} req - Request object with required params.
 * @returns {Promise<Object>} - Vehicle type data and counts.
 */
export const get_vehicle_type_data_id = async (req) => {
  const {
    city_id,
    master_package_id,
    local_package_id,
    pickup_date,
    seating_capacity,
    luggage,
  } = req;

  let sql,
    replacements = {
      city_id,
      master_package_id,
      local_package_id,
      pickup_date,
      seating_capacity,
      luggage,
    };

  if (master_package_id === 1) {
    sql = `
            SELECT DISTINCT
                bvt.vehicle_type_id, 
                bc.status,
                mvt.display_order
            FROM base_combination as bc 
            LEFT JOIN base_vehicle_type as bvt ON bvt.base_comb_id=bc.id
            LEFT JOIN master_vehicle_type as mvt ON bvt.vehicle_type_id= mvt.id
            LEFT JOIN master_vehicle_model as vmodel ON vmodel.vehicle_type_id=bvt.vehicle_type_id
            LEFT JOIN vehicle_master AS vm ON  vm.id=vmodel.id 
            LEFT JOIN local_package_fare AS lpf ON bvt.base_vehicle_id = lpf.base_vehicle_id AND lpf.local_pkg_fare!=0
            LEFT join local_package AS lp ON lpf.local_pkg_id = lp.id
            LEFT JOIN distance_fare as df ON bvt.base_vehicle_id = df.base_vehicle_id 
                AND (date(df.date_from) <= :pickup_date AND date(df.date_to) >= :pickup_date  AND date(df.date_from) IS NOT NULL AND date(df.date_to) IS NOT NULL)
            LEFT JOIN  distance_hour_fare as dhf ON bvt.base_vehicle_id = dhf.base_vehicle_id 
                AND (date(dhf.date_from) <= :pickup_date AND date(dhf.date_to) >= :pickup_date  AND date(dhf.date_from) IS NOT NULL AND date(dhf.date_to) IS NOT NULL)
            LEFT JOIN distance_waiting_fare as dwf ON bvt.base_vehicle_id = dwf.base_vehicle_id 
                AND (date(dwf.date_from) <= :pickup_date AND date(dwf.date_to) >= :pickup_date AND date(dwf.date_from) IS NOT NULL AND date(dwf.date_to) IS NOT NULL)
            LEFT JOIN hourly_fare as hf ON bvt.base_vehicle_id = hf.base_vehicle_id 
                AND (date(hf.date_from) <= :pickup_date AND date(hf.date_to) >= :pickup_date AND date(hf.date_from) IS NOT NULL AND date(hf.date_to) IS NOT NULL)
            WHERE 1=1
                AND bc.city_id=:city_id
                AND bc.status='1' 
                AND mvt.status='1' 
                AND bc.master_package_id=:master_package_id
                AND bvt.base_vehicle_id IS NOT NULL 
                AND lpf.local_pkg_id=:local_package_id
                AND vm.passenger >= :seating_capacity
                AND vm.small_suitcase >= :luggage
                AND vm.large_suitcase>= :luggage
            GROUP by bvt.vehicle_type_id, vm.id
            ORDER by mvt.display_order ASC
        `;
  } else {
    sql = `
            SELECT DISTINCT
                bvt.vehicle_type_id, 
                bc.status,
                    mvt.display_order
            FROM base_combination as bc 
            LEFT JOIN base_vehicle_type as bvt ON bvt.base_comb_id=bc.id
            LEFT JOIN master_vehicle_type as mvt ON bvt.vehicle_type_id= mvt.id
            LEFT JOIN master_vehicle_model as vmodel ON vmodel.vehicle_type_id=bvt.vehicle_type_id
            LEFT JOIN vehicle_master AS vm ON  vm.id=vmodel.id 
            LEFT JOIN distance_fare as df ON bvt.base_vehicle_id = df.base_vehicle_id 
                AND (date(df.date_from) <= :pickup_date AND date(df.date_to) >= :pickup_date  AND date(df.date_from) IS NOT NULL AND date(df.date_to) IS NOT NULL)
            LEFT JOIN  distance_hour_fare as dhf ON bvt.base_vehicle_id = dhf.base_vehicle_id 
                AND (date(dhf.date_from) <= :pickup_date AND date(dhf.date_to) >= :pickup_date  AND date(dhf.date_from) IS NOT NULL AND date(dhf.date_to) IS NOT NULL)
            LEFT JOIN distance_waiting_fare as dwf ON bvt.base_vehicle_id = dwf.base_vehicle_id 
                AND (date(dwf.date_from) <= :pickup_date AND date(dwf.date_to) >= :pickup_date AND date(dwf.date_from) IS NOT NULL AND date(dwf.date_to) IS NOT NULL)
            LEFT JOIN hourly_fare as hf ON bvt.base_vehicle_id = hf.base_vehicle_id 
                AND (date(hf.date_from) <= :pickup_date AND date(hf.date_to) >= :pickup_date AND date(hf.date_from) IS NOT NULL AND date(hf.date_to) IS NOT NULL)
            WHERE 1=1
                AND bc.city_id=:city_id
                AND bc.status='1'
                AND mvt.status='1' 
                AND bc.master_package_id=:master_package_id
                AND bvt.base_vehicle_id IS NOT NULL 
                AND vm.passenger >= :seating_capacity
                AND vm.small_suitcase >= :luggage
                AND vm.large_suitcase>= :luggage
            GROUP by bvt.vehicle_type_id, vm.id
            ORDER by mvt.display_order ASC
        `;
  }

  try {
    const [result] = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    if (result && result.length > 0) {
      let new_count = [];
      let vehicle_type_id_list = [];

      for (let i = 0; i < result.length; i++) {
        let vehicle_type_id = result[i]?.vehicle_type_id;
        vehicle_type_id_list.push(vehicle_type_id);
        let s = await Farewrapper.get_vehicle_list_count(
          city_id,
          master_package_id,
          vehicle_type_id
        );
        new_count.push(s?.data);
      }

      return {
        status: "success",
        data: new_count,
        vehicle_type_list: vehicle_type_id_list,
      };
    } else {
      return { status: "failed", message: "No record found", data: [] };
    }
  } catch (err) {
    throw err;
  }
};

export const getFareDataByCityIdPackageId = async (arrobj) => {
  const {
    cityid,
    dropcity_id,
    masterpackageid,
    seating_capacity,
    luggage,
    smallluggage,
    masterpackagemodeid,
    local_pkg_id,
    pickup_date_time,
    pickup_date,
    vehicle_type,
    data_from = 0,
    data_limit = 2,
  } = arrobj;
  let sqlquery = "";
  let replacements = {};

  if (masterpackageid == 1) {
    sqlquery = `
            CALL sp_fare_details(
                :cityid, :masterpackageid, :local_pkg_id, :seating_capacity, :luggage,
                :pickup_date_time, :masterpackagemodeid, :pickup_date, :vehicle_type, :smallluggage
            )
        `;
    replacements = {
      cityid,
      masterpackageid,
      local_pkg_id,
      seating_capacity,
      luggage,
      pickup_date_time,
      masterpackagemodeid,
      pickup_date,
      vehicle_type,
      smallluggage,
    };
  } else if (masterpackageid == 5) {
    sqlquery = `
            CALL sp_oneway_fare_details(
                :cityid, :dropcity_id, :masterpackageid, :seating_capacity, :luggage,
                :pickup_date_time, :pickup_date, :vehicle_type, :smallluggage
            )
        `;
    replacements = {
      cityid,
      dropcity_id,
      masterpackageid,
      seating_capacity,
      luggage,
      pickup_date_time,
      pickup_date,
      vehicle_type,
      smallluggage,
    };
  } else {

    sqlquery = `
            CALL sp_fare_details_booking(
                :cityid, :masterpackageid, :seating_capacity, :luggage,
                :pickup_date_time, :pickup_date, :vehicle_type, :smallluggage
            )
        `;
    replacements = {
      cityid,
      masterpackageid,
      seating_capacity,
      luggage,
      pickup_date_time,
      pickup_date,
      vehicle_type,
      smallluggage,
    };
  }

  try {
    const result = await sequelize.query(sqlquery, {
      replacements,
      type: sequelize.QueryTypes.RAW,
      raw: true,
    });
    return result;
  } catch (err) {
    throw err;
  }
};

let VehicleListingFilter = async function (data) {
  let filter = {};

  let vehicle_type_filter = [];
  let vendor_detail_filter = [];
  let vehicle_model_filter = [];
  let vehicle_color_filter = [];
  let vehicle_name_filter = [];
  let rating_filter = [];
  let amenities_filter = [];
  let seating_capacity_filter = [];
  let cancellation_fare_rule_filter = [];
  let fuel_type = [];

  let billArr = data ? data : [];

  if (billArr?.length > 0) {
    for (let i = 0; i < billArr.length; i++) {
      let x = billArr[i];

      vehicle_type_filter.push({
        vehicle_type_name: x?.vehicle_type || null,
        id: x?.master_vehicle_type_id || null,
      });

      vendor_detail_filter.push({
        vendor_name: x?.vendor_name || null,
        id: x?.vendor_id || null,
      });
      vehicle_model_filter.push({
        vehicle_model: x?.model || null,
        id: x?.model || null,
      });
      vehicle_color_filter.push({
        vehicle_color_name: x?.vehicle_color_name || null,
        id: x?.vehicle_colour_id || null,
      });
      vehicle_name_filter.push({
        vehicle_name: x?.vehicle_model_name || null,
        vehicle_type_id: x?.master_vehicle_type_id || null,
        id: x?.vehicle_id || null,
      });
      rating_filter.push({
        rating: x?.rating || null,
        id: x?.rating || null,
      });
      amenities_filter.push({
        amenities_name: x?.amenities_name || null,
        id: x?.amenities_id || null,
      });
      seating_capacity_filter.push({
        seating_capacity: x?.seating_capacity || null,
        id: x?.seating_capacity || null,
      });
      cancellation_fare_rule_filter.push({
        cancellation_fare_rule_name: x?.cancellation_fare_rule || null,
        id: x?.cancellation_fare_rule || null,
      });

      fuel_type.push({
        fuel_name: x?.ignition_type_name || null,
        id: x?.ignition_type_id || null,
      });
    }
  }

  filter.fuel_type = [
    ...fuel_type
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  filter.vehicle_type_filter = [
    ...vehicle_type_filter
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  filter.vendor_detail_filter = [
    ...vendor_detail_filter
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  filter.vehicle_model_filter = [
    ...vehicle_model_filter
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  filter.vehicle_color_filter = [
    ...vehicle_color_filter
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  filter.vehicle_name_filter = [
    ...vehicle_name_filter
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  filter.rating_filter = [
    ...rating_filter
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  filter.amenities_filter = [
    ...amenities_filter
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  filter.seating_capacity_filter = [
    ...seating_capacity_filter
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  filter.cancellation_fare_rule_filter = [
    ...cancellation_fare_rule_filter
      .reduce((mp, o) => {
        if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
        mp.get(o.id).count++;
        return mp;
      }, new Map())
      .values(),
  ];

  // console.log(filter);
  let filter_labels = {
    vehicle_type_filter_label: "Vehicle Type",
    vendor_detail_filter_label: "Vender Detail",
    vehicle_model_filter_label: "Vehicle Model",
    vehicle_color_filter_label: "Vehicle Color",
    vehicle_name_filter_label: "Vehicle Name",
    rating_filter_label: "Rating",
    amenities_filter_label: "Amenities",
    seating_capacity_filter_label: "Seating Capacity",
    cancellation_fare_rule_filter_label: "Cancellation Fare",
    fuel_type_label: "Fuel Type",
  };

  let res = { filter_labels: filter_labels, filter: filter };

  return res;
};

// Helper Functions

export const getFilterForVehicleListing = async (req, res) => {
  try {
    const {
      pickup_date,
      pickup_time,
      master_booking_type_id,
      local_package_id,
      dropcity_id,
      city_id,
      master_package_id,
      seating_capacity,
      luggage,
      vehicle_type,
      smallluggage,
    } = req.body;

    const pickup_date_time = `${pickup_date} ${pickup_time}`;

    // Get booking type data
    const bookingTypeData = await MasterBookingType.findOne({
      where: {
        booking_type: master_booking_type_id,
        status: 1,
      },
      attributes: ["id"],
    });
    let masterbookingTypeId = "";
    if (bookingTypeData?.status === "success") {
      masterbookingTypeId = bookingTypeData.data[0]?.id || "";
    }

    // Get booking mode id if local_package_id is present
    let master_booking_mode_id = "";
    if (local_package_id) {
      const localPackageModeData = await LocalPackage.findByPk(
        local_package_id
      );

      if (localPackageModeData?.status === "success") {
        master_booking_mode_id =
          localPackageModeData.data[0]?.booking_mode || "";
      }
    }

    // Get vehicle type data
    const sddd = await get_vehicle_type_data_id(req.body);

    let data = [];
    const dropCityId = dropcity_id || "";

    if (city_id && master_package_id) {
      let arrparam = {
        cityid: city_id,
        dropcity_id: dropCityId,
        masterpackageid: master_package_id,
        local_pkg_id: local_package_id,
        seating_capacity,
        luggage,
        pickup_date_time,
        masterpackagemodeid: master_booking_mode_id,
        pickup_date,
        vehicle_type,
        smallluggage,
      };

      if (sddd.vehicle_type_list !== undefined) {
        for (let i = 0; i < sddd.vehicle_type_list.length; i++) {
          arrparam.vehicle_type = sddd.vehicle_type_list[i];
          let faredata = await getFareDataByCityIdPackageId(arrparam);
          if (faredata[0]) {
            for (let j = 0; j < faredata[0].length; j++) {
              data.push(faredata[0][j]);
            }
          }
        }
      }
    }

    const filter = await VehicleListingFilter(data);

    if (filter) {
      return res.json({
        status: "success",
        message: "filter get successfully",
        data: filter,
      });
    } else {
      return res.json({
        status: "failed",
        message: "filter get failed",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error in getFilterForVehicleListing:", error);
    return res
      .status(500)
      .json({ status: "error", message: error.message, data: [] });
  }
};

export async function getBiddingFareDataByCityIdPackageId(arrobj) {
  const {
    cityid,
    dropcity_id,
    masterpackageid,
    seating_capacity,
    luggage,
    smallluggage,
    masterpackagemodeid,
    local_pkg_id,
    pickup_date_time,
    pickup_date,
    vehicle_type,
    data_from = 0,
    data_limit = 2,
  } = arrobj;

  const sqlquery = `
        CALL sp_bidding_fare_details(
            :cityid, 
            :dropcity_id, 
            :masterpackageid, 
            :seating_capacity, 
            :luggage, 
            :pickup_date_time, 
            :pickup_date, 
            :vehicle_type, 
            :smallluggage
        )
    `;

  try {
    const result = await sequelize.query(sqlquery, {
      replacements: {
        cityid,
        dropcity_id,
        masterpackageid,
        seating_capacity,
        luggage,
        pickup_date_time,
        pickup_date,
        vehicle_type,
        smallluggage,
      },
      type: sequelize.QueryTypes.RAW,
    });

    return result;
  } catch (err) {
    throw err;
  }
}

// Main route handler
export const fareDataSeq = async (req, res) => {
  try {
    let user_id = req.user.id;
    // Extract request parameters
    let {
      city_id: cityid,
      state_id,
      country_id,
      master_package_id,
      seating_capacity = 0,
      big_luggage: luggage = 0,
      no_of_vehicles: no_of_vehicles = 1,
      pickup_date,
      pickup_time,
      company_id,
      user_gstno,
      company_gstno,
      duration = 0,
      parent_id = 0,
      user_grade,
      vehicle_type,
      currency = 1,
      master_booking_type_id = "Transport",
      cityList = "",
      cityListToll = "",
      module_type = "",
      end_date,
      to,
      end_time: endTime = "",
      local_package_id = "0",
      distance,
      small_luggage: smallluggage,
      dropcity_id,
      data_from,
      data_limit,
      total_days,
      from
    } = req.body;
    if(Number(master_package_id) == 4){
      distance = distance * 2
    }
    // console.log("distance--------------->", distance);Per Hr Price
    
    // Normalize end date value from possible properties 'end_date' or 'to'
    let endDate = end_date || to || "";
    let user_type = String(req.user.role);
    seating_capacity = Number(seating_capacity);
    let total_travel_days = total_days || 1;
    // if (master_package_id == 4 || master_package_id == 5) {
    //   total_travel_days = cityList.reduce(
    //     (sum, item) => sum + (item.days || 0),
    //     0
    //   );
    //   // total_days = cityList.reduce((sum, item) => sum + (item.days || 0), 0);
    // }

    const pickup_date_time = `${pickup_date} ${pickup_time}`;
    const end_date_time = `${endDate} ${endTime}`;
    let billArr = [];

    const AutoRelaseDateObj = await calAutoExpiryDate(pickup_date_time);
    const {
      beforeExpiryDate: bookingAutoRelaseDate,
      travel_days,
      travel_hour,
    } = AutoRelaseDateObj;
    let master_booking_mode_id;
    if (local_package_id && local_package_id !== "0") {
      console.log({ local_package_id });
      const localPackageModeData = await LocalPackage.findOne({
        // attributes: ["booking_mode"],
        where: {
          id: Number(local_package_id),
          status: 1,
        },
      });
      master_booking_mode_id = localPackageModeData.booking_mode;
    }
    // Get currency data
    const currencyData = await MasterCurrency.findOne({
      where: { id: currency },
    });
    const currency_exchange = currencyData?.exchange_rate || 1;
    const currency_faicon = currencyData?.fa_icon || "";

    // Get booking type data
    const bookingTypeData = await MasterBookingType.findOne({
      where: { booking_type: master_booking_type_id },
      attributes: ["id"],
    });
    const masterbookingTypeId = bookingTypeData?.id || "";
    if (Number(master_package_id) < 3) {
      if (!cityid || !master_package_id) {
        return res.status(400).json({
          status: "failed",
          msg: "city id and master package id can't be null",
        });
      }
    }
    const arrparam = {
      cityid,
      masterpackageid: master_package_id,
      local_pkg_id: local_package_id || "0",
      seating_capacity,
      luggage,
      pickup_date_time,
      masterpackagemodeid: master_booking_mode_id,
      pickup_date,
      vehicle_type,
      data_from,
      data_limit,
      smallluggage,
      dropcity_id: dropcity_id,
    };
    let faredata = [];
    if (master_package_id == 5) {
      const lowestOneWayData = await getFareDataByCityIdPackageId(arrparam);
      const lowestBiddingData = await getBiddingFareDataByCityIdPackageId(
        arrparam
      );
      faredata = [...lowestOneWayData, ...lowestBiddingData];
    } else {
      faredata = await getFareDataByCityIdPackageId(arrparam);


    }
    if (!faredata || faredata.length === 0) {
      return successResponse(res, "No Record Found", [], 200);
      // res.status(404).json({ status: "failed", msg: "No Record Found" });
    }

    // Get markup data
    let markupdataArr = 0;
    if (user_id) {
      const markupparam = {
        user_id,
        user_grade,
        created_by: 1,
        master_package_id,
        city_id: cityid,
        master_booking_type: masterbookingTypeId,
        state_id,
        country_id,
        vehicle_type_id: vehicle_type,
      };
      markupdataArr = await getAllAdminMarkup(markupparam);
    }
    let markupdataArrUser = [];
    if (user_id) {
      const parentId = parent_id === 0 ? user_id : parent_id;
      const markupparamUser = {
        user_id: parentId,
        user_grade,
        created_by: parentId,
        master_package_id,
        city_id: cityid,
        master_booking_type: masterbookingTypeId,
        state_id,
        country_id,
      };
      markupdataArrUser = await getAllAdminMarkup(markupparamUser);
    }
    let fareArr = faredata;
    let markupData = 0;
    let markupAmt = 0;
    let local_pkg_name = "";
    let local_pkg_fare_mode = "";
    let status = 1;

    for (const fare of fareArr) {
      if (!fare) {
        console.warn("Skipping undefined fare entry", fare);
        continue;
      }
      const base_vehicle_id = fare.base_vehicle_id || "";
      const vendor_id = fare.vendor_id || "";

      // Get user fare settings
      const settingparam = {
        user_id: vendor_id,
        booking_type: master_package_id,
        master_booking_type_id: masterbookingTypeId,
        vehicle_type: fare?.master_vehicle_type_id,
      };
      const userFareSettingDetails = await sequentialgetallfare(settingparam);
      const userServiceChargeDetails = await getServiceChargeDetails(
        master_package_id,
        masterbookingTypeId
      );

      // Initialize tax letiables
      let sgst = 0;
      let cgst = 0;
      let igst = 0;
      let sac_code = "";

      let service_sgst = 0;
      let service_cgst = 0;
      let service_igst = 0;
      let service_charge_cgst_amount = 0;
      let service_charge_igst_amount = 0;
      let service_charge_sgst_amount = 0;

      let markup_cgst_amount = 0;
      let markup_igst_amount = 0;
      let markup_sgst_amount = 0;

      let markup_cgst = 0;
      let markup_igst = 0;
      let markup_sgst = 0;
      let service_sac_code = "";
      let sac_code_id_service = "";
      let sac_description_service = "";
      let sac_codee_service = "";
      let sac_code_id = "";
      let sac_description = "";
      let sac_codee = "";
      sgst = Number(fare?.sgst) > 0 ? fare.sgst : sgst;
      cgst = Number(fare?.cgst) > 0 ? fare.cgst : cgst;
      igst = Number(fare?.igst) > 0 ? fare.igst : igst;
      sac_code = Number(fare?.sac_code) > 0 ? fare.sac_code : sac_code;

      // Apply user fare setting tax details if available
      if (userFareSettingDetails?.userTaxDetailData) {
        const userTaxValue = userFareSettingDetails.userTaxDetailData[0];
        sgst = userTaxValue?.sgst || sgst;
        cgst = userTaxValue?.cgst || cgst;
        igst = userTaxValue?.igst || igst;
        sac_code = userTaxValue?.sac_code || sac_code;
        console.log({userTaxValue});
      }

      // Apply service charge details if available
      if (userServiceChargeDetails && userServiceChargeDetails?.length > 0) {
        let userSeriviceValue = userServiceChargeDetails[0];

        service_sgst = userSeriviceValue.sgst;
        service_cgst = userSeriviceValue.cgst;
        service_igst = userSeriviceValue.igst;
        markup_sgst = userSeriviceValue.sgst;
        markup_cgst = userSeriviceValue.cgst;
        markup_igst = userSeriviceValue.igst;
        service_sac_code = userSeriviceValue.sac_code;
      }

      // Get night charge details
      let night_rate_type = fare?.night_rate_type || null;
      let night_rate_value = fare?.night_rate_value || null;
      let night_rate_begins = fare?.night_rate_begins || null;
      let night_rate_ends = fare?.night_rate_ends || null;

      if (userFareSettingDetails?.userNightChargeData) {
        const userNightChargeValue = userFareSettingDetails.userNightChargeData;
        night_rate_type =
          userNightChargeValue.night_rate_type || night_rate_type;
        night_rate_value =
          userNightChargeValue.night_rate_value || night_rate_value;
        night_rate_begins =
          userNightChargeValue.night_rate_begins || night_rate_begins;
        night_rate_ends =
          userNightChargeValue.night_rate_ends || night_rate_ends;
      }

      // Get other charge details
      const userExtraChargeValue =
        userFareSettingDetails?.userExtrasChargeData || [];
      const userPeaktimeChargeValue =
        userFareSettingDetails?.userPeakTimeChargeData || [];
      const userCompanyShareValue =
        userFareSettingDetails?.userCompanyShareData || [];
      const userCancellationDefaultValue =
        userFareSettingDetails?.userCancellationfareData || [];
      const userPremiumsFareValue =
        userFareSettingDetails?.userPremiumsFareData || "";

      if (
        !userExtraChargeValue &&
        !userPeaktimeChargeValue &&
        !userCompanyShareValue &&
        !userPremiumsFareValue
      ) {
        let userCancellationDefaultValue = await getUserCancellationFare({
          user_id: "1",
          master_booking_type_id: master_package_id,
          booking_type: master_booking_type_id,
        });
      }
      // Get local package data if available
      let local_pkg_name = "";
      let local_pkg_fare_mode = "";
      let status = 1;
      let min_pkg_km = "";
      let min_pkg_hrs = "";
      let totalbill = 0;
      let ignore_hrs = 0;
      let ignore_km = 0;
      let minimumCharge = 0;
      let distanceCalc = 0;
      let localpkgData;
      if (local_package_id) {
        localpkgData = await getPackageFareByPackageId(
          base_vehicle_id,
          local_package_id
        );
        if (localpkgData) {
          min_pkg_km = localpkgData.km;
          min_pkg_hrs = localpkgData.hrs;
          totalbill = localpkgData.price;
          ignore_hrs = localpkgData.hrs;
          ignore_km = localpkgData.km;
          minimumCharge = totalbill;
          distanceCalc = localpkgData.km;
          local_pkg_fare_mode = localpkgData.package_mode_id;
          local_pkg_name = localpkgData.name;
          status = 0;
        } else {
          let ignore_hrs = 0;
          let ignore_km = 0;
          let minimumCharge = 0;
          let distance = "0";
          let local_pkg_fare_mode = "";
        }
      }
      // Calculate estimated time
      let estimated_time =
        master_package_id === "1"
          ? await convertTime(ignore_hrs)
          : await req.body.duration;

      // Calculate distance if not local package
      console.log({ master_package_id });
      if (Number(master_package_id) !== 1) {
        distanceCalc =
          module_type === 1 ? req.body.distance * 2 : req.body.distance;
      }

      // Get fare mode data
      const fareModeParam = {
        master_package_mode_id:
          local_pkg_fare_mode || fare.master_package_mode_id,
        base_vehicle_id,
      };
      let getmodeFare;
      if (fare.fare_type === "BIDDING") {
        getmodeFare = await getBiddingFareByPackagemodeId(
          fareModeParam.master_package_mode_id,
          fareModeParam.base_vehicle_id
        );
      } else {
        getmodeFare = await getFareByPackageModeId(
          fareModeParam.master_package_mode_id,
          fareModeParam.base_vehicle_id
        );
      }
      if (getmodeFare) {
        const modeFare = getmodeFare;

        // Check date validity
        if (modeFare.date_from && modeFare.date_to) {
          const dateValid = await calDateExist(
            pickup_date,
            modeFare.date_from,
            modeFare.date_to
          );
          if (!dateValid) break;
          let week_days = modeFare.week_days
            ? modeFare.week_days
            : "1,2,3,4,5,6,7";

          // Check day of week
          const dayOfWeek = new Date(pickup_date).getDay();
          let weak_days = "'" + week_days.split(",").join("','") + "'";
          weak_days = weak_days.split(",").map((day) => day.replace(/'/g, "")); // → ['1', '2', ..., '7']

          const weekDays = await MasterWeekDay.findAll({
            where: {
              id: {
                [Op.in]: weak_days,
              },
            },
          });
          let result = weekDays.map(function (a) {
            return a.day_id;
          });
          const weekDaysValid = result.includes(dayOfWeek);
          if (weekDaysValid) {
          }
          // Calculate fare
          const fareCalcParam = {
            master_package_type: master_package_id,
            master_package_mode_id: fareModeParam.master_package_mode_id,
            base_vehicle_id,
            minimumCharge,
            ignore_hrs,
            ignore_km,
            status,
            distance: distanceCalc,
            duration,
            markupData: markupdataArr,
            total_days,
          };
          if (master_package_id == "1") {
            distance = distanceCalc;
            estimated_time = localpkgData.hrs;
          }
          if (master_package_id === "4") {
            fareCalcParam.total_days = total_travel_days;
          }
          const val = await getFareCalculation(fareCalcParam, modeFare);

          // Set min charges
          val.min_per_km_charge = modeFare.per_km_charge || 0;
          val.min_per_hr_charge = modeFare.per_hr_charge || 0;
          val.min_minimum_charge = localpkgData
            ? localpkgData.price
            : modeFare.minimum_charge || 0;

          // Calculate night charges
          let night_charges = 0;
          if (night_rate_begins && night_rate_ends) {
            const nightRateBeginsDateTime = `${pickup_date}T${night_rate_begins}`;
            const nightRateEndsDateTime = `${endDate}T${night_rate_ends}`;
            const pickupDateTime = `${pickup_date}T${pickup_time}`;
            const endDateTime = `${endDate}T${endTime}`;

            const night_charges_start = await calculateNightCharges(
              "start",
              pickupDateTime,
              nightRateBeginsDateTime,
              nightRateEndsDateTime,
              night_rate_type,
              night_rate_value,
              val.totalbill
            );

            if (["1", "3", "5"].includes(master_package_id)) {
              const end_night_charges = await calculateNightCharges(
                "end",
                endDateTime,
                nightRateBeginsDateTime,
                nightRateEndsDateTime,
                night_rate_type,
                night_rate_value,
                val.totalbill
              );
              night_charges =
                Number(night_charges_start) + Number(end_night_charges);
            } else {
              night_charges = Number(night_charges_start);
            }
          }

          if (master_package_id === "4") {
            night_charges = night_rate_value * total_travel_days;
          }

          // Calculate extra charges
          let extra_charges1 = 0;
          let extraValueArr1 = [];
          const extras = await getFareData(base_vehicle_id, "extras");
          const extrasToUse = extras.length > 0 ? extras : userExtraChargeValue;
          if (extrasToUse && extrasToUse.length > 0) {
            for (const extra of extrasToUse) {
              const extra_charges = await calculateExtraCharges(
                val.totalbill,
                extra.extra_value_type,
                extra.extra_value
              );
              extra_charges1 += extra_charges;
              extraValueArr1.push({
                extras_name: extra.extras_master_id,
                extra_value_type: extra.extra_value_type,
                extra_value: extra.extra_value,
              });
            }
          }

          // Calculate company share
          let companysharedata = await CompanyShare.findAll({
            where: {
              base_vehicle_id,
              status: "1",
            },
          });
          companysharedata =
            companysharedata.length > 0
              ? companysharedata
              : userCompanyShareValue;
          const companyShareCalculateValue = await companyShareCalculation(
            companysharedata,
            val.totalbill
          );
          const driverShareValue = companyShareCalculateValue.data;

          // Calculate premiums fare
          let premiumsFareData = await PremiumsFare.findAll({
            where: {
              base_vehicle_id,
              status: "1",
            },
          });
          premiumsFareData =
            premiumsFareData.length > 0
              ? premiumsFareData[0]
              : userPremiumsFareValue;
          const premiumsFareValue = await PremiumsFareCalculation(
            premiumsFareData,
            val.totalbill
          );
          // Get cancellation rules
          let cancellationRuleDate = await getCancellationFare(base_vehicle_id);
          if (
            cancellationRuleDate.status !== "success" &&
            userCancellationDefaultValue
          ) {
            cancellationRuleDate = userCancellationDefaultValue;
          } else {
            cancellationRuleDate = cancellationRuleDate.data || [];
          }
          // Calculate estimated amount without markup
          const estimated_amt_without_markup = val.totalbill;
          // Apply markup if available
          let markup_amount = 0;
          let markup_cgst_amount = 0;
          let markup_igst_amount = 0;
          let markup_sgst_amount = 0;

          if (markupdataArr && markupdataArr.length > 0) {
            for (const markupdata of markupdataArr) {
              if (markupdata.markup_amt_base === 1) {
                if (markupdata.mark_amt_type === "%") {
                  const minimumchargewithmarkup =
                    (val.minimum_charge * Number(markupdata.basic_amt)) / 100;

                  const perKmchargewithmarkup =
                    (val.per_km_charge * Number(markupdata.basic_amt)) / 100;
                  const perHrchargewithmarkup =
                    (val.per_hr_charge * Number(markupdata.basic_amt)) / 100;
                  const totalbillwithmarkup =
                    (val.totalbill * Number(markupdata.basic_amt)) / 100;
                  val.minimum_charge += Number(minimumchargewithmarkup);
                  val.per_km_charge += perKmchargewithmarkup;
                  if (val.per_hr_charge)
                    val.per_hr_charge += perHrchargewithmarkup;
                  val.totalbill += totalbillwithmarkup;
                  markup_amount = minimumchargewithmarkup;
                } else {
                  val.minimum_charge += Number(markupdata.basic_amt);
                  val.totalbill += Number(markupdata.basic_amt);
                  markup_amount = markupdata.basic_amt;
                }
              } else if (markupdata.markup_amt_base === 2) {
                if (markupdata.mark_amt_type === "%") {
                  const minimumchargewithmarkup =
                    (val.minimum_charge * Number(markupdata.basic_amt)) / 100;
                  const perKmchargewithmarkup =
                    (val.per_km_charge * markupdata.extra_km_markup) / 100;
                  const perHrchargewithmarkup =
                    (val.per_hr_charge * markupdata.extra_hr_markup) / 100;
                  val.minimum_charge += minimumchargewithmarkup;
                  val.per_km_charge += perKmchargewithmarkup;
                  val.per_hr_charge += perHrchargewithmarkup;
                  const extraKmMarkup = val.extraKm * perKmchargewithmarkup;
                  val.totalbill += minimumchargewithmarkup + extraKmMarkup;
                  markup_amount = minimumchargewithmarkup;
                } else {
                  const basic_amt =
                    master_package_id === "4"
                      ? Number(markupdata.basic_amt) * Number(total_travel_days)
                      : Number(markupdata.basic_amt);
                  val.minimum_charge =
                    Number(val.minimum_charge) + Number(basic_amt);
                  val.per_km_charge += Number(markupdata.extra_km_markup);
                  val.per_hr_charge += Number(markupdata.extra_hr_markup);
                  const extraKmMarkup =
                    val.extraKm * Number(markupdata.extra_km_markup);
                  val.totalbill += Number(basic_amt) + Number(extraKmMarkup);
                  markup_amount = markupdata.basic_amt;
                }
              }

              // Calculate markup taxes
              let total_markup_tax_service;
              if (markup_amount && markup_amount > 0) {
                if (!user_gstno || user_gstno === company_gstno) {
                  total_markup_tax_service =
                    Number(service_cgst) + Number(service_sgst);
                  markup_cgst_amount = Math.round(
                    (markup_amount * service_cgst) / 100
                  );
                  markup_sgst_amount = Math.round(
                    (markup_amount * service_sgst) / 100
                  );
                  markup_igst_amount = 0;
                } else {
                  total_markup_tax_service = Number(service_igst);
                  markup_cgst_amount = 0;
                  markup_sgst_amount = 0;
                  markup_igst_amount = Math.round(
                    (markup_amount * service_igst) / 100
                  );
                }
                if (
                  total_markup_tax_service !== undefined &&
                  total_markup_tax_service > 0
                ) {
                  //console.log(total_tax_service); return false;
                  var markupTaxPrice = Math.round(
                    (markup_amount * total_markup_tax_service) / 100
                  );
                  markup_amount =
                    Number(markup_amount) + Number(markupTaxPrice);
                }
              }

              markupdata.markup_amount = markup_amount;
              val.markup_amount = markup_amount;
            }
          }

          // Apply user markup if available
          let markupUser_amount = 0;
          if (markupdataArrUser && markupdataArrUser.length > 0) {
            for (const markupdataUser of markupdataArrUser) {
              if (markupdataUser.markup_amt_base === "1") {
                if (markupdataUser.mark_amt_type === "%") {
                  const minimumchargewithmarkup =
                    (val.minimum_charge * markupdataUser.basic_amt) / 100;
                  const perKmchargewithmarkup =
                    (val.per_km_charge * markupdataUser.basic_amt) / 100;
                  const perHrchargewithmarkup =
                    (val.per_hr_charge * markupdataUser.basic_amt) / 100;
                  const totalbillwithmarkup =
                    (val.totalbill * markupdataUser.basic_amt) / 100;

                  val.minimum_charge += minimumchargewithmarkup;
                  val.per_km_charge += perKmchargewithmarkup;
                  val.per_hr_charge += perHrchargewithmarkup;
                  val.totalbill += totalbillwithmarkup;
                  markupUser_amount = minimumchargewithmarkup;
                } else {
                  val.minimum_charge += Number(markupdataUser.basic_amt);
                  val.totalbill += Number(markupdataUser.basic_amt);
                  markupUser_amount = markupdataUser.basic_amt;
                }
              } else if (markupdataUser.markup_amt_base === "2") {
                if (markupdataUser.mark_amt_type === "%") {
                  const minimumchargewithmarkup =
                    (val.minimum_charge * markupdataUser.basic_amt) / 100;
                  const perKmchargewithmarkup =
                    (val.per_km_charge * markupdataUser.extra_km_markup) / 100;
                  const perHrchargewithmarkup =
                    (val.per_hr_charge * markupdataUser.extra_hr_markup) / 100;

                  val.minimum_charge += minimumchargewithmarkup;
                  val.per_km_charge += perKmchargewithmarkup;
                  val.per_hr_charge += perHrchargewithmarkup;
                  val.totalbill += minimumchargewithmarkup;
                  markupUser_amount = minimumchargewithmarkup;
                } else {
                  val.minimum_charge += Number(markupdataUser.basic_amt);
                  val.per_km_charge += Number(markupdataUser.extra_km_markup);
                  val.per_hr_charge += Number(markupdataUser.extra_hr_markup);
                  val.totalbill += Number(markupdataUser.basic_amt);
                  markupUser_amount = Number(markupdataUser.basic_amt);
                }
              }

              markupdataUser.markupUser_amount = markupUser_amount;
              val.user_markup_amount = Number(markupUser_amount) || 0;
            }
          }

          // Get SAC code data
          const sacCodeData = await MasterSacCode.findOne({
            where: { id: sac_code, status: 1 },
          });
          const sacCodeDataService = await MasterSacCode.findOne({
            where: { code: service_sac_code, status: 1 },
          });

          if (sacCodeData) {
            sac_code_id = sacCodeData.id;
            sac_codee = sacCodeData.code;
            sac_description = sacCodeData.name;
          } else {
            sac_code_id = "";
            sac_codee = "";
            sac_description = "";
          }

          if (sacCodeDataService) {
            sac_code_id_service = sacCodeDataService.id;
            sac_codee_service = sacCodeDataService.code;
            sac_description_service = sacCodeDataService.name;
          } else {
            sac_code_id_service = "";
            sac_codee_service = "";
            sac_description_service = "";
          }

          // Calculate peak time charges
          let peak_fare1 = 0;
          let peakValueArr1 = [];
          const peaks = await getFareData(base_vehicle_id, "peak_time_charge");
          const peaksToUse = peaks.length > 0 ? peaks : userPeaktimeChargeValue;

          if (peaksToUse && peaksToUse.length > 0) {
            for (const peak of peaksToUse) {
              const peak_fare = await calculateCharges(
                pickup_time,
                peak.start_time,
                peak.end_time,
                peak.peaktime_type,
                peak.peaktime_value,
                val.totalbill
              );
              peak_fare1 += peak_fare;
              peakValueArr1.push({
                start_time: peak.start_time,
                end_time: peak.end_time,
                peaktime_type: peak.peaktime_type,
                peaktime_value: peak.peaktime_value,
              });
            }
          }

          // Calculate state tax and toll tax
          let state_tax1 = 0;
          let toll_tax1 = 0;
          let service_charge = 0;
          if (master_package_id == 4) {
        
            if (module_type == "1") {
              if (cityList && cityList.length > 0) {
                const period_id = 1;
                const days = Number(cityList[0].days);
                const state_tax = await RtoStateTax.findOne({
                  where: {
                    state_id: cityList[0].drop_state1,
                    vehicle_type_id,
                    // seating_capacity: String(vehicleSeatingCapacity),
                    period_id,
                  },
                });
                if (state_tax && state_tax.period_id === 1) {
                  state_tax1 = Number(state_tax.amount * days);
                }
              }
console.log({state_tax1})
              if (cityListToll && cityListToll.length > 0) {
                let sumToll = 0;
                for (const toll of cityListToll) {
                  const toll_tax = await getTollTax(
                    toll.pickcity_id,
                    toll.dropcity_id
                  );
                  if (toll_tax.total_tax > 0) {
                    sumToll += parseInt(toll_tax.total_tax);
                  }
                }
                toll_tax1 = sumToll;
              }
            } else {
              
              if (cityList && cityList.length > 0) {
                console.log(master_package_id,";;;;sadas;;;;;;;;;;asds;;;;;;;;;;;;;;;;;;;")
                let state_tax_days = 0;
                let state_tax_weekly = 0;
                let state_tax_monthly = 0;

                // const statesSame = areAllDropStateIdsSame(cityList);
                if (true) {
                  const filteredTrips = cityList
                  // filter(
                  //   (trip) => trip.pickstate_id !== trip.dropstate_id
                  // );

                  for (const trip of cityList) {
                    console.log("asssssssssssssssssssssssssssssssssss")
                     total_days = total_days||1;
                    if (trip.nights !== 0) total_days += 1;

                    const state_tax = await RtoStateTax.findAll({
                      where: {
                        state_id: trip.drop_state1||trip.drop_state2,
                        vehicle_type_id:vehicle_type,
                        // seating_capacity: String(vehicleSeatingCapacity),
                        // user_type,
                        // user_id,
                      },
                        raw: true,

                    });
console.log({state_tax})
                    if (state_tax && state_tax.length > 0) {
                      for (const tax of state_tax) {
                        if (tax.period_id == 1) {
                          state_tax_days += Number(Number(tax.amount) * total_days||1);
                        } else if (tax.period_id === 2) {
                          const no_of_week = Math.ceil(total_days / 7);
                          state_tax_weekly += Number(tax.amount * no_of_week);
                        } else if (tax.period_id === 3) {
                          const no_of_month = Math.ceil(total_days / 30);
                          state_tax_monthly += Number(tax.amount * no_of_month);
                        }
                        console.log(state_tax_days,"====================================")
                      }
console.log({   state_tax_days,total_days,
                        state_tax_weekly,
                        state_tax_monthly})
                      state_tax1 = Math.max(
                        state_tax_days,
                        state_tax_weekly,
                        state_tax_monthly
                      );
                    }
                  }
                }console.log({state_tax1})

                // Calculate toll tax
                let sum = 0;
                for (const trip of cityList) {
                  const toll_tax = await TollTax.findAll({
                    attributes: [
                      [
                        TollTax.sequelize.fn(
                          "SUM",
                          TollTax.sequelize.col("tag_cost_daily")
                        ),
                        "total_tax",
                      ],
                    ],
                    where: {
                      start_city_id: trip.pickcity_id,
                      end_city_id: trip.dropcity_id,
                      status: 1,
                    },
                    raw: true,
                  });

                  if (toll_tax.total_tax > 0) {
                    sum += parseInt(toll_tax.total_tax);
                  }
                }
                toll_tax1 = sum;
              }
            }
          } else {
            // var vehicle_type_id = fare.master_vehicle_type_id;
            if (req.body.drop_state_id) {
              const period_id = 1;
              const state_tax = await RtoStateTax.findOne({
                where: {
                  state_id: req.body.drop_state_id,
                  vehicle_type_id:vehicle_type,
                  seating_capacity: fare.seating_capacity,
                  period_id,
                },
              });
              if (state_tax && state_tax.period_id === 1) {
                state_tax1 = Number(state_tax.amount);
              }
            }

            if (cityList && cityList.length > 0) {
              let sum = 0;
              for (const trip of cityList) {
                const toll_tax = await getTollTax(
                  trip.pickup_city_id,
                  trip.drop_city_id
                );
                if (toll_tax.total_tax > 0) {
                  sum += parseInt(toll_tax.total_tax);
                }
              }
              toll_tax1 = sum;
            }

            if (cityListToll && cityListToll.length > 0) {
              let sumToll = 0;
              for (const toll of cityListToll) {
                const toll_tax = await getTollTax(
                  toll.pickcity_id,
                  toll.dropcity_id
                );
                if (toll_tax.total_tax > 0) {
                  sumToll += parseInt(toll_tax.total_tax);
                }
              }
              toll_tax1 = sumToll;
            }
          }

          // Calculate estimated price before markup
          let estimated_price_before_markup =
            Number(estimated_amt_without_markup) +
            Number(peak_fare1) +
            Number(night_charges) +
            Number(extra_charges1) +
            Number(state_tax1) +
            Number(toll_tax1);
          
          // Calculate total bill
          let totalallbill =
            Number(peak_fare1) +
            Number(night_charges) +
            Number(extra_charges1) +
            Number(val.totalbill) +
            Number(state_tax1) +
            Number(toll_tax1);
          // Apply currency exchange
          val.minimum_charge = Math.ceil(
            val.minimum_charge * currency_exchange
          );
          extra_charges1 = Math.ceil(extra_charges1 * currency_exchange);
          night_charges = Math.ceil(night_charges * currency_exchange);
          peak_fare1 = Math.ceil(peak_fare1 * currency_exchange);

          val.totalbill = Math.ceil(val.totalbill * currency_exchange);

          let totalbill =
            Number(peak_fare1) +
            Number(night_charges) +
            Number(extra_charges1) +
            Number(val.totalbill) +
            Number(state_tax1) +
            Number(toll_tax1);
          val.price_before_tax = totalbill;

          // Calculate taxes
          const userGstState = user_gstno?.substring(0, 2);
          const companyGstState = company_gstno?.substring(0, 2);

          let total_tax, cgstTax, sgstTax, igstTax;
          if (!user_gstno ) {
            total_tax = Number(cgst) + Number(sgst);
            cgstTax = cgst;
            sgstTax = sgst;
            igstTax = "";
          } else {
            total_tax = Number(igst);
            cgstTax = "";
            sgstTax = "";
            igstTax = igst;
          }

          // Calculate service charge taxes
          let total_tax_service,
            service_cgstTax,
            service_sgstTax,
            service_igstTax;
          if (!user_gstno || userGstState === companyGstState) {
            total_tax_service = Number(service_cgst) + Number(service_sgst);
            service_charge_cgst_amount = Math.round(
              (service_charge * service_cgst) / 100
            );
            service_charge_sgst_amount = Math.round(
              (service_charge * service_sgst) / 100
            );
            service_charge_igst_amount = 0;
            service_cgstTax = service_cgst;
            service_sgstTax = service_sgst;
            service_igstTax = service_igst;
          } else {
            total_tax_service = Number(service_igst);
            service_charge_cgst_amount = 0;
            service_charge_sgst_amount = 0;
            service_charge_igst_amount = Math.round(
              (service_charge * service_igst) / 100
            );
            service_cgstTax = service_cgst;
            service_sgstTax = service_sgst;
            service_igstTax = service_igst;
          }

          if (total_tax_service > 0) {
            const serviceTaxPrice = Math.round(
              (service_charge * total_tax_service) / 100
            );
            service_charge += serviceTaxPrice;
          }
        
          // Calculate main tax
          const taxPrice = Math.round((totalallbill * total_tax) / 100);
          totalallbill += taxPrice;
          const roundedTaxPrice = Math.ceil(taxPrice * currency_exchange);
          totalbill += roundedTaxPrice;
          // console.log({ totalallbill });
          // Apply cancellation rules
          // cancellationRuleDate = bookCanRuleDateArr(
          //   pickup_date_time,
          //   cancellationRuleDate,
          //   totalbill
          // );

          totalbill = Math.round(totalbill);
          seating_capacity = fare.seating_capacity;
          var ignition_type = fare.ignition_type_name;
          // Prepare the final fare object
          const host = `${req.protocol}://${req.get("host")}`;
          let model = fare.vehicle_model_name
            .split(",")
            .map((item) => item.trim());
          let images =[fare.left_image, fare.right_image, fare.back_image, fare.front_image, fare.interior_image,fare.interior_image];
          //  getVehicleImages(host, model[0]);

          const fareObj = {
            images,
            fare,
            left_image:fare?.left_image,
            right_image:fare?.right_image,
            back_image:fare?.back_image,
            front_image:fare?.front_image,
            interior_image:fare?.interior_image,
            doors: fare.doors,
            airbags: fare.airbags,
            total_travel_days: total_travel_days,
            no_of_vehicles: no_of_vehicles,
            vehicle_type_id:vehicle_type,
            base_vehicle_id,
            master_package_id: fare.master_package_id,
            master_package_mode_id: fare.master_package_mode_id,
            master_vehicle_type_id: fare.master_vehicle_type_id,
            vehicle_category_id: fare.vehicle_category_id,
            vendor_id,
            amenities_id: fare?.amenities_id,
            ignition_type_id: fare?.ignition_type_id,
            vmodel_id: fare?.vmodel_id,
            vehicle_colour_id: fare.vehicle_colour_id,
            vehicle_display_order: fare.vehicle_display_order,
            fule_ignition_type_id: fare.fule_ignition_type_id,
            vehicle_id: fare.vehicle_id,
            vehicle_ac_nonac: fare.vehicle_ac_nonac,
            vmodel_vehicle_ac_nonac: fare.vmodel_vehicle_ac_nonac,
            vmodel_luggage: fare.vmodel_luggage,
            smallluggage: fare.smallluggage,
            vmodel_smallluggage: fare.vmodel_smallluggage,
            seating_capacity: fare.seating_capacity,
            vmodel_seating_capacity: fare.vmodel_seating_capacity,
            vehicle_image: fare.vehicle_image,
            vehicle_type: fare.vehicle_type,
            vehicle_name: fare.vehicle_name,
            vehicle_model: fare.vmodel_model,
            vehicle_color: fare.vehicle_color_name,
            ignition_type: fare.ignition_type_name,
            base_fare: Number(val.minimum_charge),
            per_km_charge: Number(val.per_km_charge),
            per_hr_charge: Number(val.per_hr_charge),
            running_amt: Number(val.totalbill),
            peak_time_price: Number(peak_fare1),
            night_charge: Number(night_charges),
            extra_charge: Number(extra_charges1),
            tax_percentage: total_tax,
            tax_price: taxPrice,
            estimated_price_before_markup: Number(
              estimated_price_before_markup
            ),
            markup_base: markupData.markup_amt_base,
            markup_type: markupData.mark_amt_type,
            markup_value: markupData.basic_amt,
            markup_price: markupAmt,
            total_price:
              fare.master_package_id === 4
                ? Number(totalallbill) * Number(no_of_vehicles)
                : Number(totalbill) *
                  Number(total_travel_days || 1) *
                  Number(no_of_vehicles || 1),
            no_of_booking_vehicles:
              fare.master_package_id === 4
                ? Number(no_of_vehicles) * Number(no_of_vehicles)
                : Number(total_travel_days) * Number(no_of_vehicles),
            single_vehicle_charge: Number(totalbill),
            vehicle_baggage: fare.luggage,
            vehicle_ignition_type: fare.vehicle_ac_nonac,
            seating_capacity: seating_capacity,
            luggage: luggage,
            amenities: fare.amenities,
            vehicle_master_id: fare?.vehicle_master_id,
            base_comb_id: fare?.base_comb_id,
            // vehicle_type_id : fareArr[i]?.vehicle_type_id,
            amenities_name: fare?.amenities_name,
            vehicle_color_name: fare?.vehicle_color_name,
            night_rate_type: night_rate_type,
            night_rate_value: night_rate_value,
            night_rate_begins: night_rate_begins,
            night_rate_ends: night_rate_ends,
            peakFare: JSON.stringify(peakValueArr1),
            cgst_tax: cgst,
            igst_tax: igst,
            sgst_tax: sgst,
            sac_code_id: sac_code_id,
            sac_code: sac_codee,
            sac_description: sac_description,
            extras: JSON.stringify(extraValueArr1), // Need To Check
            master_package_mode_id: fare.master_package_mode_id,
            package_mode: fare.package_mode,
            estimated_time: estimated_time,
            duration: duration,
            estimated_distance: distance || distanceCalc,
            approx_waiting_charge: 0,
            approx_waiting_minute: 0,
            local_pkg_name: local_pkg_name,
            vendor_id: vendor_id,
            vendor_name: fare.vendor_name,
            vendor_email: fare.vendor_email,
            vendor_mobile: fare.vendor_mobile,
            premiums_type: fare.premiums_type,
            premiums_value: fare.premiums_value,
            premiums_price: premiumsFareValue.premiums_price,
            user_markup: JSON.stringify(markupdataArr),
            start_date: dateFormat(from, "yyyy-mm-dd"),
            end_date: end_date_time,
            start_time: fare.start_time,
            end_time: fare.end_time,
            dispatch_type: fare.type_of_dispatch,
            garage_type: fare.garage_type,
            garage_address: fare.garage_address,
            garage_pincode: fare.garage_pincode,
            garage_latitude: fare.garage_latitude,
            garage_longitude: fare.garage_longitude,
            company_share_type: driverShareValue.company_share_type,
            company_share_value: driverShareValue.company_share,
            driver_share_type: driverShareValue.driver_share_type,
            driver_share_value: driverShareValue.driver_share,
            partner_share_type: driverShareValue.partner_share_type,
            partner_share_value: driverShareValue.partner_share,
            premiums_type: premiumsFareValue.premiums_type,
            premiums_value: premiumsFareValue.premiums_value,
            premiums_price: premiumsFareValue.premiums_price,
            user_rating: fare.rating,
            cancellation_fare_rule: cancellationRuleDate,
            //cancellation_fare_ruleArray : cancellationRuleDate,
            booking_auto_relasedate: bookingAutoRelaseDate,
            travel_days: travel_days,
            travel_hour: travel_hour,
            currency_faicon: currency_faicon,
            created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
            state_tax: state_tax1,
            toll_tax: toll_tax1,
            service_charge: service_charge,
            rating: fare.rating,
            vehicle_category: fare.vehicle_category,
            show_service_charge:
              user_type == "7" || user_type == "9" || user_type == "11" ? 1 : 0,
            sac_code_id_service: sac_code_id_service,
            sac_code_service: sac_codee_service,
            sac_description_service: sac_description_service,
            service_tax_percentage: total_tax_service,
            service_cgst_tax: service_cgst,
            service_igst_tax: service_igst,
            service_sgst_tax: service_sgst,
            service_tax_price: Math.round(
              (service_charge * total_tax_service) / 100
            ),
            service_charge_cgst_amount: service_charge_cgst_amount,
            service_charge_igst_amount: service_charge_igst_amount,
            service_charge_sgst_amount: service_charge_sgst_amount,
            markup_cgst: markup_cgst,
            markup_igst: markup_igst,
            markup_sgst: markup_sgst,
            markup_cgst_amount: markup_cgst_amount,
            markup_igst_amount: markup_igst_amount,
            markup_sgst_amount: markup_sgst_amount,
            basePath: process.env.B2B_URL + "images/car_model/",
            vmodel_id: fare.vmodel_id,
            ignition_type: fare.ignition_type_name,
            amenities_id: fare.amenities_id,
            vehicle_colour_id: fare.vehicle_colour_id,
            vehicle_display_order: fare.vehicle_display_order,
            booking_status: "",
            client_id: user_id || "",
            driver_id: "",
            is_updation_allow: "1",
            min_pkg_km: min_pkg_km || 0,
            min_minimum_charge: val.minimum_charge || 0,
            markup_amount: markup_amount || 0,
            price_before_tax: val.price_before_tax,
            vehicle_name: fare.vehicle_model_name,
            vehicle_type: fare.vehicle_type,
            vehicle_model: fare.model,
            ignition_type: fare.ignition_type,
            running_amt_display: val.totalbill,
            pickup_latitude: req.body.pickup_latitude || "",
            pickup_longitude: req.body.pickup_longitude || "",
            drop_date: endDate || "",
            drop_time: endTime || "",
            gst_no: user_gstno || "",
            gst_name: "",
            ip: req.ip || "",
            booking_address: req.body.pickup_address || "",
            peak_time_price: peak_fare1 || 0,
            agree_terms: 0,
            remark: "",
            send_email: 1,
            agent_reference: "",
            guest_first_name: req.body.guest_first_name || "",
            guest_last_name: req.body.guest_last_name || "",
            guest_email: req.body.guest_email || "",
            guest_mobile: req.body.guest_mobile || "",
            guest_alt_mobile: req.body.guest_alt_mobile || "",
            guest_gender: req.body.guest_gender || "",
            email: req.body.email || "",
            alt_mobile_number: req.body.alt_mobile_number || "",
            book_vehicle_user: user_id || "",
            airport: req.body.airport || "",
            flight_number: req.body.flight_number || "",
            device_type: req.body.device_type || "",
            drop_area: req.body.drop_area || "",
            drop_address: req.body.drop_address || "",
            drop_country: req.body.drop_country || "",
            drop_state: req.body.drop_state || "",
            drop_city: req.body.drop_city || "",
            drop_landmark: req.body.drop_landmark || "",
            drop_latitude: req.body.drop_latitude || "",
            drop_longitude: req.body.drop_longitude || "",
            drop_zone: req.body.drop_zone || "",
            pickup_zone: req.body.pickup_zone || "",
            pickup_landmark: req.body.pickup_landmark || "",
            pickup_country: req.body.pickup_country || "",
            pickup_state: req.body.pickup_state || "",
            filter_vehicle_model: fare.vmodel_model || "",
            filter_vehicle_name: fare.vehicle_name || "",
            filter_vehicle_type: fare.vehicle_type || "",
            filter_fuel_type: fare.ignition_type || "",
            filter_amenities: fare.amenities_name || "",
            filter_supplier_name: fare.vendor_name || "",
            total_charge: totalbill,
            edit_total_value:
              fare.master_package_id === 4
                ? Number(totalallbill) * Number(no_of_vehicles)
                : Number(totalbill) *
                  Number(total_travel_days || 1) *
                  Number(no_of_vehicles || 1),
            no_of_booking_vehicles:
              fare.master_package_id === 4
                ? Number(no_of_vehicles) * Number(no_of_vehicles)
                : Number(total_travel_days) * Number(no_of_vehicles),
            coupon_discount_type: "",
            coupon_discount_value: 0,
            total_discount: 0,
            coupon_code: "",
            coupon_code_id: "",
            selected_vehicle: "",
            city_latitude: req.body.city_latitude || "",
            city_longitude: req.body.city_longitude || "",
            city_northeast_latitude: req.body.city_northeast_latitude || "",
            city_northeast_longitude: req.body.city_northeast_longitude || "",
            city_southwest_latitude: req.body.city_southwest_latitude || "",
            city_southwest_longitude: req.body.city_southwest_longitude || "",
            form_type: req.body.form_type || "",
            luggages: luggage || 0,
            childs: req.body.childs || 0,
            adults: req.body.adults || 0,
            local_from_date: req.body.local_from_date || "",
            local_from_time: req.body.local_from_time || "",
            local_to_date: req.body.local_to_date || "",
            local_to_time: req.body.local_to_time || "",
            local_no_of_days: req.body.local_no_of_days || 0,
            days: req?.body?.total_days || 0,
            pickup_multiple_selected: req.body.pickup_multiple_selected || 0,
            pickup_later_selected: req.body.pickup_later_selected || 0,
            pickup_now_selected: req.body.pickup_now_selected || 0,
            local_pickup: req.body.local_pickup || "",
            pickup_area_value: req.body.pickup_area_value || "",
            booking_auto_relasedate: bookingAutoRelaseDate,
          };

          billArr.push(fareObj);
        }
      }
    }
    let userVehicleTypeAvailObj = {};
    let userVehicleNameAvailObj = {};
    let usercolorAvailObj = {};
    let userModelAvailObj = {};
    let userFuletypeAvailObj = {};
    let vehicleAmenitiesAvailObj = {};
    let vendornameObj = {};
    let vehicleSeatingCapacityAvailObj = {};
    let cancellationfareruleAvailObj = {};
    let userRatingAvailObj = {};

    let filter = {
      vehicle_type: [],
      vendor_detail: [],
      vehicle_model: [],
      vehicle_color: [],
      vehicle_name: [],
      rating_filter: [],
      amenities_filter: [],
      seating_capacity: [],
      cancellation_fare_rule: [],
    };
    let vehicleTypeobj = {};
    let filteredArr = billArr.sort((a, b) =>
      a.total_price < b.total_price ? -1 : 1
    );
    if (filteredArr.length > 0) {
      for (const filter of filteredArr) {
        if (vehicleTypeobj[filter.vehicle_type_id]) {
          let temp = vehicleTypeobj[filter.vehicle_type_id];
          temp.push(filter);
          vehicleTypeobj[filter.vehicle_type_id] = temp;
        } else {
          let temp = [];
          temp.push(filter);
          vehicleTypeobj[filter.vehicle_type_id] = temp;
        }
        //////////// CODE FOR FILTERING DATA STARTS HERE ///////////////

        let vehicle_type_id = filter.vehicle_type_id;
        vehicle_type = filter.vehicle_type;
        let vehicle_name = filter.vehicle_name;
        let vehicle_color = filter.vehicle_color_name;
        let model_year = filter.vehicle_model;
        // let ignition_type = filter.ignition_type;
        let vendor_name = filter.vendor_name;
        user_id = filter.vendor_id;
        let amenities_name = filter.amenities_name;
        seating_capacity = filter.seating_capacity;
        let cancellation_fare_rule = filter.cancellation_fare_rule;
        let rating = filter.rating;

        if (filter.amenities_name) {
          vehicleAmenitiesAvailObj.hasOwnProperty(amenities_name)
            ? (vehicleAmenitiesAvailObj[amenities_name] += 1)
            : (vehicleAmenitiesAvailObj[amenities_name] = 1);
        }

        if (filter.rating) {
          userRatingAvailObj.hasOwnProperty(rating)
            ? (userRatingAvailObj[rating] += 1)
            : (userRatingAvailObj[rating] = 1);
        }

        if (filter.cancellation_fare_rule) {
          let countnum = 0;
          for (const [_, vehicleArray] of Object.entries(
            cancellation_fare_rule
          )) {
            if (Array.isArray(vehicleArray)) {
              for (const fare of vehicleArray) {
                const masterId = fare.cancellation_master_id;
                const vendorId = fare.vendor_id;

                if (cancellationfareruleAvailObj?.hasOwnProperty(vendorId)) {
                  countnum += 1;
                }

                cancellationfareruleAvailObj[masterId] = {
                  id: masterId,
                  name: fare.name,
                  count: countnum,
                };
              }
            }
          }
        }

        userVehicleTypeAvailObj.hasOwnProperty(vehicle_type)
          ? (userVehicleTypeAvailObj[vehicle_type] += 1)
          : (userVehicleTypeAvailObj[vehicle_type] = 1);
        usercolorAvailObj.hasOwnProperty(vehicle_color)
          ? (usercolorAvailObj[vehicle_color] += 1)
          : (usercolorAvailObj[vehicle_color] = 1);
        userModelAvailObj.hasOwnProperty(model_year)
          ? (userModelAvailObj[model_year] += 1)
          : (userModelAvailObj[model_year] = 1);
        userFuletypeAvailObj.hasOwnProperty(ignition_type)
          ? (userFuletypeAvailObj[ignition_type] += 1)
          : (userFuletypeAvailObj[ignition_type] = 1);
      }
      if (filter.seating_capacity != null) {
        if (vehicleSeatingCapacityAvailObj.hasOwnProperty(seating_capacity)) {
          vehicleSeatingCapacityAvailObj[seating_capacity] += 1;
        } else {
          vehicleSeatingCapacityAvailObj[seating_capacity] = 1;
        }
      }
      if (!userVehicleNameAvailObj[vehicle_type])
        userVehicleNameAvailObj[vehicle_type] = {};
      if (
        userVehicleNameAvailObj[vehicle_type].hasOwnProperty(
          filter.vehicle_name
        )
      ) {
        userVehicleNameAvailObj[vehicle_type][vehicle_name] += 1;
      } else {
        userVehicleNameAvailObj[vehicle_type][filter.vehicle_name] = 1;
      }

      filter.vehicle_type = userVehicleTypeAvailObj;
      filter.vehicle_model = userModelAvailObj;
      filter.vehicle_color = usercolorAvailObj;
      filter.vehicle_name_filter = userVehicleNameAvailObj;
      filter.rating_filter = userRatingAvailObj;
      filter.fuel_type = userFuletypeAvailObj;
      filter.amenities_filter = vehicleAmenitiesAvailObj;
      filter.seating_capacity = vehicleSeatingCapacityAvailObj;
      filter.cancellation_fare_rule = cancellationfareruleAvailObj;

      filter.vehicle_type_label = "Vehicle Type";
      filter.vehicle_model_label = "Vehicle Model";
      filter.vehicle_color_label = "Vehicle Color";
      filter.amenities_label = "Amenities";
      filter.fuel_label = "Fuel Type";
      filter.cancellation_policy_label = "Cancellation Policy";
      filter.rating_label = "Rating";
      filter.seating_capacity_label = "Seating Capacity";
      filter.supplier_label = "Suppliers";

      if (user_type === "10" || user_type === "11" || user_type === "7") {
        var countnum = 0;
        for (const [key, value] of Object.entries(vehicleTypeobj)) {
          if (Array.isArray(vehicleTypeobj[key])) {
            let vehicledata = vehicleTypeobj[key];

            for (let value of vehicledata) {
              if (vendornameObj.hasOwnProperty(value.vendor_id)) {
                countnum = countnum + 1;
                vendornameObj[value.vendor_id] = {
                  id: value.vendor_id,
                  name: value.vendor_name,
                  count: countnum,
                };
              } else {
                vendornameObj[value.vendor_id] = {
                  id: value.vendor_id,
                  name: value.vendor_name,
                  count: countnum,
                };
              }
              filter.vendor_detail = vendornameObj;
            }
          }
        }
      }
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_FETCHED,
        { billArr, filter },
        200
      );
    }
  } catch (error) {
    console.error("Error in fareWrapperController:", error);
    return res
      .status(409)
      .json({ status: "failed", msg: "Internal Server Error", error: error });
  }
};

export async function getBiddingFareByPackagemodeId(
  packagemodeid,
  basevehicleid
) {
  if (packagemodeid && basevehicleid) {
    const sqlquery = "CALL wp_get_bidding_mode(:packagemodeid, :basevehicleid)";
    try {
      const result = await sequelize.query(sqlquery, {
        replacements: { packagemodeid, basevehicleid },
        type: sequelize.QueryTypes.RAW,
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}

const isInNightRange = async (
  type,
  dutyDateTime,
  rateBeginsDateTime,
  rateEndsDateTime
) => {
  let status = "FALSE";
  dutyDateTime = new Date(dutyDateTime);
  rateBeginsDateTime = new Date(rateBeginsDateTime);
  rateEndsDateTime = new Date(rateEndsDateTime);

  if (type == "start" && rateBeginsDateTime !== "" && rateEndsDateTime !== "") {
    if (
      (rateBeginsDateTime <= dutyDateTime &&
        rateEndsDateTime >= dutyDateTime) ||
      (dutyDateTime <= rateBeginsDateTime && dutyDateTime <= rateEndsDateTime)
    ) {
      let status = "TRUE";
    } else {
      let status = "FALSE";
    }
  }

  if (type == "end" && rateBeginsDateTime !== "" && rateEndsDateTime !== "") {
    if (
      (rateBeginsDateTime <= dutyDateTime &&
        rateEndsDateTime >= dutyDateTime) ||
      (dutyDateTime >= rateBeginsDateTime && dutyDateTime >= rateEndsDateTime)
    ) {
      let status = "TRUE";
    } else {
      let status = "FALSE";
    }
  }
  return status;
};
const calculateNightCharges = (
  type,
  pickupTime,
  rateBegins,
  rateEnds,
  chargeUnit,
  charges,
  totalbill
) => {
  return new Promise((resolve, reject) => {
    let val = isInNightRange(type, pickupTime, rateBegins, rateEnds);
    //let val = isInRange(pickupTime, rateBegins, rateEnds) ? 'TRUE' : 'FALSE';
    let total_charges = 0;
    if (val == "FALSE") {
      total_charges = 0;
    } else {
      if (chargeUnit == "Value") {
        total_charges = charges;
      } else {
        total_charges = (totalbill * charges) / 100;
      }
    }
    resolve(total_charges);
  });
};

function calculateExtraCharges(totalbill, extras_type, extras_value) {
  let extra_charges = 0;
  if (extras_type == "Rs") {
    extra_charges = extras_value;
  } else if (extras_type == "%") {
    extra_charges = (totalbill * extras_value) / 100;
  }
  return extra_charges;
}
const PremiumsFareCalculation = (premiumsArr, totalbill) => {
  return new Promise((resolve, reject) => {
    let premiumsFareData = premiumsArr;
    let premiums_price = 0;
    let premiumsResp = {};
    if (premiumsFareData != "") {
      let premiums_type = premiumsFareData.premiums_type;
      let premiums_value = premiumsFareData.premiums_value;

      if (premiums_type == "Value") {
        premiums_price = premiums_value;
      } else {
        premiums_price = (totalbill * premiums_value) / 100;
      }

      premiumsResp = {
        premiums_type: premiums_type,
        premiums_value: premiums_value,
        premiums_price: premiums_price,
      };
    } else {
      premiumsResp = {
        premiums_type: "",
        premiums_value: "",
        premiums_price: premiums_price,
      };
    }
    resolve(premiumsResp);
  });
};

export const getCancellationFare = async (basevehicleid) => {
  if (!basevehicleid) {
    return {
      status: "failed",
      message: "Base vehicle id is required",
      data: [],
    };
  }

  const sqlquery = `
        SELECT 
          cf.id,
          cf.cancellation_master_id,
          cf.cancellation_type,
          cf.cancellation_value,
          mc.id as master_cancellation_id,
          mc.name,
          mc.description,
          cf.days,
          cf.hours,
          master_currency.fa_icon as currency_icon
        FROM cancellation_fare as cf
        LEFT JOIN master_cancellation as mc ON cf.cancellation_master_id = mc.id
        LEFT JOIN master_currency ON cf.currency_id = master_currency.id
        WHERE cf.base_vehicle_id = :basevehicleid
          AND cf.status = 1
        ORDER BY mc.order_by ASC
      `;

  try {
    const result = await sequelize.query(sqlquery, {
      replacements: { basevehicleid },
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    if (result && result.length > 0) {
      return { status: "success", data: result };
    } else {
      return { status: "failed", message: "No record found", data: [] };
    }
  } catch (err) {
    throw err;
  }
};

function areAllDropStateIdsSame(arr) {
  // Extract the dropstate_id of the first element
  const firstDropStateId = arr[0].dropstate_id;

  // Check if all other elements have the same dropstate_id
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].dropstate_id !== firstDropStateId) {
      return false; // Return false if any dropstate_id doesn't match
    }
  }

  return true; // All dropstate_ids are the same
}

async function getTollTax(start_city, end_city) {
  const where = { status: 1 };

  if (start_city) {
    where.start_city_id = start_city;
  }

  if (end_city) {
    where.end_city_id = end_city;
  }

  try {
    const result = await TollTax.findOne({
      attributes: [
        [
          TollTax.sequelize.fn("SUM", TollTax.sequelize.col("tag_cost_daily")),
          "total_tax",
        ],
      ],
      where,
      raw: true,
    });

    return result;
  } catch (error) {
    return Promise.reject(error);
  }
}

export const getServiceChargeDetails = async (
  booking_type,
  master_booking_type_id
) => {
  const where = {
    charge_type: "SERVICE-CHARGE",
    status: 1,
  };

  if (
    typeof master_booking_type_id !== "undefined" &&
    master_booking_type_id !== ""
  ) {
    where.master_booking_type_id = master_booking_type_id;
  }
  if (typeof booking_type !== "undefined" && booking_type !== "") {
    where.booking_type = booking_type;
  }

  try {
    const result = await TaxDetail.findAll({
      where,
      limit: 1,
      raw: true,
    });
    return result;
  } catch (err) {
    throw err;
  }
};

function convertTime(time) {
  var seconds = time * 3600;
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = seconds - h * 3600 - m * 60;
  var val = h + ":" + m + ":" + s;
  return val;
}

export const applyCoupon = async (req, res) => {
  try {
    const {
      coupon_code,
      total_price,
      price_before_tax,
      tax_percentage,
      tax_price,
      no_of_booking_vehicles,
      total_charge,
      single_vehicle_charge,
      master_package_id,
      company_id,
    } = req.body;
    console.log(coupon_code);
    const start_date = dateFormat(new Date(), "yyyy-mm-dd");

    // Build where clause for Sequelize
    const where = {
      valid_from_date: { [Op.lte]: start_date },
      valid_to_date: { [Op.gte]: start_date },
    };
    if (coupon_code) where.name = coupon_code;
    if (company_id) where.company_id = company_id;
    if (master_package_id) where.master_package_id = master_package_id;

    // Query master_coupon table
    const coupon = await masterCoupon.findOne({ where, raw: true });
    if (coupon) {
      let msg = "Coupon Code is Valid";
      let coupon_id = coupon.id;
      let coupon_discount_type = coupon.discount_type;
      let coupon_discount_value = coupon.discount_amount;
      let couponDiscount = 0;
      let priceBeforeTax = price_before_tax;

      if (coupon.discount_type === "Value") {
        couponDiscount = coupon.discount_amount;
        priceBeforeTax = price_before_tax - couponDiscount;
      } else {
        couponDiscount = (price_before_tax * coupon.discount_amount) / 100;
        priceBeforeTax = price_before_tax - couponDiscount;
      }

      const taxPrice = Math.round((priceBeforeTax * tax_percentage) / 100);
      const totalPrice = priceBeforeTax + taxPrice;
      const singleVehicleCharge = totalPrice;
      const totalCharge = singleVehicleCharge * no_of_booking_vehicles;
      console.log("ji");
      return res.status(200).json({
        status: "success",
        data: {
          msg,
          total_price: totalPrice,
          coupon_discount: couponDiscount,
          coupon_id,
          coupon_discount_type,
          coupon_discount_value,
          tax_price: taxPrice,
          total_charge: totalCharge,
          single_vehicle_charge: singleVehicleCharge,
          price_before_tax: priceBeforeTax,
        },
      });
    } else {
      return res.status(400).json({
        status: "failed",
        data: {
          msg: "Coupon code is In-Valid",
          total_price,
          coupon_discount: 0,
          coupon_id: "",
          coupon_discount_type: "",
          coupon_discount_value: "",
          tax_price,
          total_charge,
          single_vehicle_charge,
          price_before_tax,
        },
      });
    }
  } catch (err) {
    return { status: "failed", error: err.message };
  }
};
export const getSacCodeData = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    console.log("NO ID");
    return res.status(400).json({
      status: "failed",
      message: "No ID Found",
      data: [],
    });
  }

  const sqlquery =
    "SELECT * FROM master_sac_code WHERE code = :id AND status = 1";

  try {
    const result = await sequelize.query(sqlquery, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    if (result.length > 0) {
      return res.status(200).json({ status: "success", data: result });
    } else {
      return res
        .status(404)
        .json({ status: "failed", message: "No Record found", data: [] });
    }
  } catch (err) {
    console.error("Error querying SAC code:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      data: [],
    });
  }
};
