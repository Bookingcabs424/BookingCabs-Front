import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import CityPagesModel from "../models/cityPagesModel.js";
import BaseCombination from "../models/baseCombinationModel.js";
import BaseVehicleType from "../models/baseVehicleTypeModel.js";
import DispatchLocation from "../models/dispatchLocationModel.js";
import OnewayCityRoutePackage from "../models/oneWayCityRoutePackage.js";
import dateFormat from "dateformat";
import { query } from "express-validator";
import { Op, QueryTypes } from "sequelize";
import MasterVehicleType from "../models/masterVehicleTypeModel.js";
import MasterPackage from "../models/masterPackageModel.js";
import CityDistanceList from "../models/cityDistanceModel.js";
import MasterCity from "../models/masterCityModel.js";
import MasterPackageMode from "../models/masterPackageModeModel.js";
import User from "../models/userModel.js";
import MasterCurrency from "../models/masterCurrencyModel.js";
import CompanySetup from "../models/companySetupModel.js";
import sequelize from "../config/clientDbManager.js";
import ViewVehicleFareDetails from "../models/viewVehicleFareDetailsModel.js";
import TaxDetail from "../models/taxDetailModel.js";
import UserBasicFareSetting from "../models/userBasicFareSettingModel.js";
import UserNightCharge from "../models/userNightChargeModel.js";
import { format } from "date-fns";
import MasterCancellation from "../models/masterCancellationModel.js";
import UserCancellationFare from "../models/userCancellationFareModel.js";
import DriverCancellationFare from "../models/driverCancellationModel.js";
import UserWaitingCharge from "../models/userWaitingChargeModel.js";
import UserPreWaitingCharge from "../models/userPreWaitingChargesModel.js";
import UserPremiumsFare from "../models/userPremiumModel.js";
import UserPostalcodeFare from "../models/userPostalCodeFareModel.js";
import UserFixRoute from "../models/userFixRouteModel.js";
import UserCancellationFareLog from "../models/UserCancellationFareLogsModel.js";
import DriverCancellationFareLog from "../models/DriverCancellationFareLogModel.js";
import UserPeakTimeCharge from "../models/UserPeakTimeChargeModel.js";
import CompanyShare from "../models/companyShareModel.js";
import UserCompanyShare from "../models/userCompanyShareModel.js";
import { copybasecombination, copyBasicTaxData, copybasicTaxFareSettingData, copyCancellationFareData, copyCompanyShareData, copyDispatchLocation, copyDistanceFareData, copyDistanceHourFareData, copyDistanceUptoFareData, copyDistanceWaitingFareData, copyExtrasFareData, copyFixRouteFareData, copyHourlyFareData, copyNightChargeFareData, copyOnewayRouteCity, copyPeakTimeFareData, copyPostalCodeFareData, copyPremiumsFareData, copyPreWaitingFareData, copyWaitingFareData, updateFareAcceptedStatus } from "./acceptCompanyFareControllers.js";
import UserExtras from "../models/userExtrasModel.js";
import { is } from "date-fns/locale";

export const addcityPages = async (req, res) => {
  try {
    const {
      company_setup_id,
      user_id,
      city_id,
      master_package_id,
      created_date,
      ip,
      created_by,
    } = req;
    const checkExistingCity = await CityPagesModel.findOne({
      where: {
        user_id: created_by,
        city_id: city_id,
        master_package_id: master_package_id,
      },
    });
    if (!checkExistingCity) {
      return await CityPagesModel.create({
        company_setup_id,
        user_id,
        city_id,
        master_package_id,
        created_date,
        ip,
        created_by,
      });
    }
  } catch (error) {
    throw error;
  }
};
// Add Base combination
// export const addbasecombination = async (values, res) => {
//   try {
//     const {
//       company_id,
//       vendor_id,
//       client_id,
//       country_id,
//       state_id,
//       city_id,
//       master_package_id,
//       master_package_mode_id,
//       market_place,
//       created_date,
//       created_by,
//       ip,
//     } = values;
//     if (master_package_id == 1 && type_of_dispatch == 1) {
//       type_of_dispatch = 3;
//     }

//     if (master_package_id == 4 && type_of_dispatch == 1) {
//       type_of_dispatch = 3;
//     }

//     if (master_package_id == 7 && type_of_dispatch == 1) {
//       type_of_dispatch = 3;
//     }
//     let insertValues = {
//       company_id,
//       vendor_id,
//       client_id,
//       country_id,
//       state_id,
//       city_id,
//       master_package_id,
//       master_package_mode_id,
//       market_place,
//       created_date,
//       created_by,
//       ip,
//       status: "1",
//     };
//     Object.keys(insertValues).forEach((key) => {
//       if (insertValues[key] === undefined || insertValues[key] === "") {
//         delete insertValues[key];
//       }
//     });
//     const response = await BaseCombination.create(insertValues);
//     let lastInsertId = response.lastInsertId;
//     if (lastInsertId != "") {
//       let insertInfoValues = {
//         base_comb_id: lastInsertId,
//         vehicle_type_id: req.vehicle_type_id,
//         created_date: created_date,
//         created_by: req.created_by,
//         ip: req.ip,
//       };
//       Object.keys(insertInfoValues).forEach((key) => {
//         if (
//           insertInfoValues[key] === undefined ||
//           insertInfoValues[key] === ""
//         ) {
//           delete insertInfoValues[key];
//         }
//       });
//       const baseCombinationresponse = await BaseVehicleType.create(
//         insertInfoValues
//       );
//       let base_vehicle_id = baseCombinationresponse.insertId;
//     }
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
// Add vehicle type  //

export const addBaseVehicleType = async (
  req
) => {
  let {vehicle_list,
  lastInsertId,
  created_date,
  created_by,
  ip} = req;
  let vendor_vehicle_list = vehicle_list;
  if (typeof vendor_vehicle_list !== "undefined" && vendor_vehicle_list != "") {
    //for(var key in vendor_vehicle_list){
    var vehicletypekey = vendor_vehicle_list;
    var vehicletypearr = vehicletypekey.split("_");
    var vehicle_type_id = vehicletypearr[0];
    var vehicle_master_id = vehicletypearr[1];
    //console.log(vehicle_master_id); return true;

    var insertInfoValues = {
      base_comb_id: lastInsertId,
      vehicle_type_id: vehicle_type_id,
      vehicle_master_id: vehicle_master_id,
      created_date: created_date,
      created_by: created_by,
      ip: ip,
    };
    let promisesarr = [];
    promisesarr.push(BaseVehicleType.create(insertInfoValues));
    //}
    return Promise.all(promisesarr);
  }
};
export const addFare = async (req, res) => {
  try {
    let created_date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let insertValues = {
      company_id: req.body.company_id,
      vendor_id: req.body.vendor_id,
      client_id: req.body.client_id,
      country_id: req.body.country_id,
      state_id: req.body.state_id,
      city_id: req.body.city_id,
      master_package_id: req.body.master_package_id,
      master_package_mode_id: req.body.master_package_mode_id,
      market_place: req.body.market_place,
      date_from: req.body.fare_date_from,
      date_to: req.body.fare_date_to,
      currency: req.body.currency,
      rate: req.body.rate,
      rate_type: req.body.rate_type,
      rate_value: req.body.rate_value,
      week_days: req.body.week_days,
      created_date: created_date,
      created_by: req.body.created_by,
      status: "1",
      ip: req.body.ip,
    };

    const response = await BaseCombination.create(insertValues);
    let lastInsertId = response.id;
    console.log({ lastInsertId });
    if (lastInsertId != "") {
      let insertInfoValues = {
        base_comb_id: lastInsertId,
        vehicle_type_id: req.body.vehicle_type_id,
        created_date: created_date,
        created_by: req.body.created_by,
        ip: req.body.ip,
      };
      Object.keys(insertInfoValues).forEach((key) => {
        if (
          insertInfoValues[key] === undefined ||
          insertInfoValues[key] === ""
        ) {
          delete insertInfoValues[key];
        }
      });
      const baseCombinationresponse = await BaseVehicleType.create(
        insertInfoValues
      );
      console.log({ baseCombinationresponse });
      let base_vehicle_id = baseCombinationresponse.base_vehicle_id;
      let dispatchValue = {
        user_id: req.body.vendor_id,
        base_comb_id: lastInsertId,
        type_of_dispatch: req.body.type_of_dispatch,
        garage_type: req.body.garage_type,
        address: req.body.address,
        city: req.body.city,
        pincode: req.body.pincode,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        created_date: req.body.created_date,
        created_by: req.body.created_by,
        ip: req.body.ip,
      };
      Object.keys(dispatchValue).forEach((key) => {
        if (dispatchValue[key] === undefined || dispatchValue[key] === "") {
          delete dispatchValue[key];
        }
      });
      let dispatchResponse = await DispatchLocation.create(dispatchValue);
      console.log("dispatch");
      // Add oneway city distance Route package //
      if (insertValues.master_package_id == 5) {
        let insertonewayValues = {
          base_vehicle_id: base_vehicle_id,
          city_distance_id: req.body.city_distance_id,
          created_date: created_date,
          created_by: req.body.created_by,
        };
        Object.keys(insertonewayValues).forEach((key) => {
          if (
            insertonewayValues[key] === undefined ||
            insertonewayValues[key] === ""
          ) {
            delete insertonewayValues[key];
          }
        });
        await OnewayCityRoutePackage.create(insertonewayValues);
        console.log("success");
      }
      return successResponse(
        res,
        MESSAGES.FARE.ADDED,
        { fare_id: lastInsertId, base_vehicle_id: base_vehicle_id },
        201
      );
    }
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateCabFare = async (req, res) => {
  try {
    const { master_package_id, type_of_dispatch, user_id, id, vendor_id, ip } =
      req.body;

    // Adjust type_of_dispatch based on business rules
    let adjustedDispatchType = type_of_dispatch;
    if ([1, 4, 7].includes(master_package_id) && type_of_dispatch === 1) {
      adjustedDispatchType = 3;
    }

    // Update base_combination
    const baseCombUpdate = {
      company_id: req.body.company_id,
      vendor_id: req.body.vendor_id,
      client_id: req.body.client_id,
      country_id: req.body.country_id,
      state_id: req.body.state_id,
      city_id: req.body.city_id,
      master_package_id: req.body.master_package_id,
      master_package_mode_id: req.body.master_package_mode_id,
      market_place: req.body.market_place,
      modified_by: user_id,
      status: "1",
      ip: ip,
    };

    // Remove empty/undefined values
    Object.keys(baseCombUpdate).forEach((key) => {
      if (baseCombUpdate[key] === undefined || baseCombUpdate[key] === "") {
        delete baseCombUpdate[key];
      }
    });

    await BaseCombination.update(baseCombUpdate, {
      where: { id },
    });

    // Update base_vehicle_type
    const vehicleTypeUpdate = {
      vehicle_type_id: req.body.vehicle_type_id,
      modified_by: user_id,
      ip: ip,
    };

    Object.keys(vehicleTypeUpdate).forEach((key) => {
      if (
        vehicleTypeUpdate[key] === undefined ||
        vehicleTypeUpdate[key] === ""
      ) {
        delete vehicleTypeUpdate[key];
      }
    });

    await BaseVehicleType.update(vehicleTypeUpdate, {
      where: { base_comb_id: id },
    });

    // Update dispatch_location
    const dispatchLocationUpdate = {
      user_id: vendor_id,
      type_of_dispatch: adjustedDispatchType,
      garage_type: req.body.garage_type,
      address: req.body.address,
      city: req.body.city,
      pincode: req.body.pincode,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      modified_by: user_id,
      status: "1",
      ip: ip,
    };

    await DispatchLocation.update(dispatchLocationUpdate, {
      where: { base_comb_id: id },
    });
    return successResponse(res, MESSAGES.FARE.UPDATED, { fare_id: id }, 200);
  } catch (error) {
    console.error("Error updating cab fare:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getFare = async (req, res) => {
  try {
    const {
      base_combination_id,
      base_vehicle_id,
      user_id: vendor_id,
      client_id,
      state_id,
      city_id,
      master_package_id,
      master_package_mode_id,
      status,
      company_id,
      vehicle_type_id,
      from_date,
      to_date,
      weekdays,
      currency,
      created_by,
    } = req.body;

    // Build the base where clause
    const whereClause = {
      status: { [Op.ne]: "2" },
      fare_type: "NORMAL",
    };

    // Add filters based on provided parameters
    if (base_combination_id) whereClause.id = base_combination_id;
    if (company_id) whereClause.company_id = company_id;
    if (vendor_id) whereClause.vendor_id = vendor_id;
    if (client_id) whereClause.client_id = client_id;
    if (state_id) whereClause.state_id = state_id;
    if (city_id) whereClause.city_id = city_id;
    if (master_package_id) whereClause.master_package_id = master_package_id;
    if (master_package_mode_id)
      whereClause.master_package_mode_id = master_package_mode_id;
    if (status) whereClause.status = status;
    if (currency) whereClause.currency = currency;
    if (created_by) whereClause.created_by = created_by;

    // Date range filter
    if (from_date && to_date) {
      whereClause[Op.or] = [
        {
          date_from: {
            [Op.between]: [from_date, to_date],
          },
        },
        {
          date_to: {
            [Op.between]: [from_date, to_date],
          },
        },
      ];
    }

    // Weekdays filter
    if (weekdays) {
      whereClause.week_days = {
        [Op.in]: weekdays.split(","),
      };
    }

    // Build the vehicle type where clause if needed
    const vehicleTypeWhere = vehicle_type_id ? { vehicle_type_id } : {};
    const baseVehicleWhere = base_vehicle_id ? { base_vehicle_id } : {};

    const fares = await BaseCombination.findAll({
      where: whereClause,
      include: [
        {
          model: BaseVehicleType,
          as: "baseVehicleTypes",
          where: { ...vehicleTypeWhere, ...baseVehicleWhere },
          required: true,
          include: [
            {
              model: OnewayCityRoutePackage,
              as: "onewayRoutePackage",
              include: [
                {
                  model: CityDistanceList,
                  as: "cityDistance",
                  include: [
                    {
                      model: MasterCity,
                      as: "destinationCity",
                      attributes: ["name", "state_name", "country_code"],
                    },
                  ],
                },
              ],
            },
            {
              model: MasterVehicleType,
              as: "vehicleType",
              attributes: ["vehicle_type"],
            },
          ],
        },
        {
          model: DispatchLocation,
          as: "dispatchLocation",
        },
        {
          model: CompanySetup,
          as: "company",
          attributes: ["site_title"],
        },
        {
          model: MasterCity,
          as: "city",
          attributes: ["name", "state_name", "country_code"],
        },
        {
          model: MasterPackage,
          as: "masterPackage",
          attributes: ["name"],
        },
        {
          model: MasterPackageMode,
          as: "masterPackageMode",
          attributes: ["package_mode"],
        },
        {
          model: User,
          as: "vendor",
          attributes: [
            [
              sequelize.fn(
                "CONCAT",
                sequelize.col("vendor.first_name"),
                " ",
                sequelize.col("vendor.last_name")
              ),
              "vendor_name",
            ],
          ],
        },
        {
          model: User,
          as: "client",
          attributes: [
            [
              sequelize.fn(
                "CONCAT",
                sequelize.col("client.first_name"),
                " ",
                sequelize.col("client.last_name")
              ),
              "client_name",
            ],
          ],
        },
        {
          model: MasterCurrency,
          as: "currencyDetails",
          attributes: ["id", "country_name", "name", "symbol"],
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!fares || fares.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No fares found",
        data: [],
      });
    }

    // Format the response to match your original structure
    const formattedFares = fares.map((fare) => {
      const fareJson = fare.toJSON();
      const baseVehicle = fareJson.baseVehicleTypes[0]; // Assuming one-to-many but your SQL suggests one-to-one

      return {
        base_combination_id: fareJson.id,
        client_id: fareJson.client_id,
        master_package_mode_id: fareJson.master_package_mode_id,
        master_package_id: fareJson.master_package_id,
        date_from: fareJson.date_from,
        date_to: fareJson.date_to,
        week_days: fareJson.week_days,
        market_place: fareJson.market_place,
        bs_status: fareJson.status,
        base_vehicle_id: baseVehicle?.base_vehicle_id,
        vehicle_type_id: baseVehicle?.vehicle_type_id,
        vehicle_master_id: baseVehicle?.vehicle_master_id,
        company_setup_name: fareJson.company?.site_title,
        city_id: fareJson.city?.id,
        city_distance_id: baseVehicle?.onewayRoutePackage?.cityDistance?.id,
        distance_km: baseVehicle?.onewayRoutePackage?.cityDistance?.distance_km,
        city_name: fareJson.city?.name,
        state_name: fareJson.city?.state_name,
        country_code: fareJson.city?.country_code,
        destination_city_name:
          baseVehicle?.onewayRoutePackage?.cityDistance?.destinationCity?.name,
        destination_state_name:
          baseVehicle?.onewayRoutePackage?.cityDistance?.destinationCity
            ?.state_name,
        destination_country_code:
          baseVehicle?.onewayRoutePackage?.cityDistance?.destinationCity
            ?.country_code,
        package_name: fareJson.masterPackage?.name,
        package_mode: fareJson.masterPackageMode?.package_mode,
        vendor_name: fareJson.vendor?.vendor_name,
        client_name: fareJson.client?.client_name,
        vehicle_type: baseVehicle?.vehicleType?.vehicle_type,
        currency_id: fareJson.currencyDetails?.id,
        currency_city_name: fareJson.currencyDetails?.country_name,
        currency_city_code: fareJson.currencyDetails?.name,
        currency_city_symbol: fareJson.currencyDetails?.symbol,

        ...fareJson.dispatchLocation,
      };
    });

    return successResponse(
      res,
      MESSAGES.GENERAL.DATA_FETCHED,
      formattedFares,
      200
    );
    // res.status(200).json({
    //   status: 'success',
    //   data: formattedFares
    // });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

export const updateFareStatus = async (req, res) => {
  try {
    const { id, fare_status } = req.body;
    const { user_id } = req.user;

    // Validate input
    if (!id || !user_id || fare_status === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: id, user_id, fare_status",
      });
    }

    // Convert id to array if it's a comma-separated string
    const ids = id
      .toString()
      .split(",")
      .map((id) => parseInt(id.trim()));

    // Update the fare status
    const [affectedRows] = await BaseCombination.update(
      {
        status: fare_status,
        modified_by: user_id,
        modified_date: new Date(), // Assuming you want to update this automatically
      },
      {
        where: {
          id: { [Op.in]: ids },
        },
      }
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "No fares found with the provided IDs",
      });
    }
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, data, 200);
  } catch (error) {
    console.error("Error updating fare status:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};
export const getCompanyPrice = async (req, res) => {
  try {
    const { company_id, package_id, vendor_id } = req.query;

    const query = `
      SELECT * FROM view_vehicle_fare_details 
      WHERE bs_status != '2'
      ${company_id ? `AND company_id = ${company_id}` : ""}
      ${vendor_id ? `AND vendor_id = ${vendor_id}` : ""}
      ${package_id ? `AND master_package_id = ${package_id}` : ""}
    `;

    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    successResponse(res, MESSAGES.GENERAL.FETCHED, results, 200);
  } catch (err) {
    console.error("Error:", err);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

export const addTaxDetail = async (req, res) => {
  try {
    const {
      user_id,
      master_booking_type_id,
      booking_type,
      charge_type = "BASIC", // Default value from your schema
      sac_code,
      from_date,
      to_date,
      tax_type,
      sgst = 0, // Default value from your schema
      cgst = 0, // Default value from your schema
      igst = 0, // Default value from your schema
      ip,
      created_by,
      modified_by,
    } = req.body;

    // Prepare the data object
    const taxData = {
      user_id,
      master_booking_type_id,
      booking_type,
      charge_type,
      sac_code,
      from_date: dateFormat(from_date, "yyyy-mm-dd"),
      to_date: dateFormat(to_date, "yyyy-mm-dd"),
      tax_type,
      sgst,
      cgst,
      igst,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      ip,
      created_by,
      modified_by,
      status: 1, // Default status from your schema
    };

    // Remove undefined or empty values
    Object.keys(taxData).forEach((key) => {
      if (taxData[key] === undefined || taxData[key] === "") {
        delete taxData[key];
      }
    });

    // Create the record using Sequelize
    const newTaxDetail = await TaxDetail.create(taxData);

    successResponse(res, MESSAGES.GENERAL.DATA_ADDED, newTaxDetail, 201);
  } catch (error) {
    console.error("Error adding tax detail:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

export const updateTaxDetail = async (req, res) => {
  try {
    const {
      auto_id, // ID of the record to update
      user_id,
      master_booking_type_id,
      booking_type,
      charge_type,
      sac_code,
      from_date,
      to_date,
      tax_type,
      sgst,
      cgst,
      igst,
      ip,
      modified_by,
    } = req.body;

    // Prepare the update data object
    const updateData = {
      user_id,
      master_booking_type_id,
      booking_type,
      charge_type,
      sac_code,
      from_date: from_date ? dateFormat(from_date, "yyyy-mm-dd") : undefined,
      to_date: to_date ? dateFormat(to_date, "yyyy-mm-dd") : undefined,
      tax_type,
      sgst,
      cgst,
      igst,
      ip,
      modified_by,
      modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    };

    // Remove undefined or empty values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === "") {
        delete updateData[key];
      }
    });

    // Update the record using Sequelize
    const [affectedRows] = await TaxDetail.update(updateData, {
      where: { id: auto_id },
    });

    if (affectedRows > 0) {
      successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, affectedRows[0], 200);
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, error, 404);
    }
  } catch (error) {
    console.error("Error updating tax detail:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

export const getUserTaxDetail = async (req, res, isInternalCall=false) => {
  try {
    const { user_id, master_booking_type_id, booking_type, id, status } =
      req.query||req
console.log({isInternalCall})
    // Build the where clause
    const whereClause = {
      charge_type: "BASIC",
      company_id: process.env.COMPANY_SETUP_ID, //Company Upgrade
    };

    if (master_booking_type_id) {
      whereClause.master_booking_type_id = master_booking_type_id;
    }

    if (booking_type) {
      whereClause.booking_type = booking_type;
    }

    if (user_id) {
      whereClause.user_id = user_id;
    }

    if (id) {
      whereClause.id = id;
    }

    if (status) {
      whereClause.status = status;
    }

    // Query using Sequelize
    const result = await TaxDetail.findAll({
      where: whereClause,
    });

    if(isInternalCall) return result
    if (result.length > 0) {
return  successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result, 200);
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, result, 404);
    }
  } catch (error) {
    console.error("Error fetching tax details:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};
export const getUserTaxDetailData = async (req, res) => {
  try {
    const { user_id, master_booking_type_id, booking_type, id, status } =
      req.query;

    // Build the where clause
    const whereClause = {};

    if (master_booking_type_id) {
      whereClause.master_booking_type_id = master_booking_type_id;
    }

    if (booking_type) {
      whereClause.booking_type = booking_type;
    }

    if (user_id) {
      whereClause.user_id = user_id;
    }

    if (id) {
      whereClause.id = id;
    }

    if (status) {
      whereClause.status = status;
    }

    // Query using Sequelize
    const result = await TaxDetail.findAll({
      where: whereClause,
    });

    if (result.length > 0) {
      successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result, 200);
    } else {
      errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    console.error("Error fetching tax details:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};
export const addUserBasicFare = async (req, res) => {
  try {
    const { user_id, rounding, level, direction, created_by, status, ip } =
      req.body;

    const result = await UserBasicFareSetting.create({
      user_id,
      rounding,
      level,
      direction,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      created_by,
      status,
      ip,
    });
    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, result, 201);
  } catch (error) {
    console.log({ error });
    errorResponse(res, MESSAGES.GENERAL.SOMETHING_WENT_WRONG, error, 500);
  }
};
export const updateUserFareSetting = async (req, res) => {
  try {
    const { id, user_id, rounding, level, direction, ip, modified_by } =
      req.body;

    // Clean input by removing undefined or empty values
    const updateFields = {};
    const allowedFields = [
      "user_id",
      "rounding",
      "level",
      "direction",
      "ip",
      "modified_by",
    ];
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        updateFields[key] = req.body[key];
      }
    });

    const result = await UserBasicFareSetting.update(updateFields, {
      where: { id },
    });
    if (result[0] === 0) {
      // Sequelize update returns an array where first element is number of affected rows
      return res.status(404).json({
        status: "failed",
        msg: "No matching record found or no change in data",
      });
    }
    if (result) {
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, result, 200);
    }
  } catch (error) {
    console.error("Error updating fare setting:", error);
    errorResponse(res, MESSAGES.GENERAL.SOMETHING_WENT_WRONG, error, 500);
  }
};
export const addUserNightChare = async (req, res) => {
  try {
    const {
      booking_type,
      user_id,
      night_rate_begins,
      night_rate_ends,
      night_rate_type,
      night_rate_value,
      from_date,
      to_date,
      created_by,
      ip,
    } = req.body;

    const insertData = {
      booking_type,
      user_id,
      night_rate_begins,
      night_rate_ends,
      night_rate_type,
      night_rate_value,
      from_date: format(new Date(from_date), "yyyy-MM-dd"),
      to_date: format(new Date(to_date), "yyyy-MM-dd"),
      created_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      created_by,
      ip,
    };

    // Clean out undefined or empty fields
    Object.keys(insertData).forEach((key) => {
      if (insertData[key] === undefined || insertData[key] === "") {
        delete insertData[key];
      }
    });

    const result = await UserNightCharge.create(insertData);
    return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, result, 201);
  } catch (error) {
    console.error("Insert error:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

export const getUserNightCharge = async (req, res,isInternalCall=false) => {
  try {
    const { user_id, booking_type, id, status } = req.query||req||req.body;
console.log({isInternalCall})
    // Build a dynamic where clause
    const where = {};
    if (user_id) where.user_id = user_id;
    if (booking_type) where.booking_type = booking_type;
    if (id) where.id = id;
    if (status) where.status = status;

    const result = await UserNightCharge.findAll({ where });

    if(isInternalCall) return result
    if (result.length > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, result, 200);
      // res.json({ status: 'success', data: result });
    } else {
      return successResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND, result, 400);
      // res.json({ status: 'failed', message: 'No record found' });
    }
  } catch (error) {
    console.error("Query error:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};
export const updateUserNightCharge = async (req, res) => {
  try {
    const {
      auto_id, // Primary key
      booking_type,
      user_id,
      night_rate_begins,
      night_rate_ends,
      night_rate_type,
      night_rate_value,
      from_date,
      to_date,
      ip,
      modified_by,
    } = req.body;

    if (!auto_id) {
      return errorResponse(res, "auto_id is required", null, 400);
      // return res.status(400).json({ status: 'failed', message: 'auto_id is required' });
    }

    const updateData = {
      booking_type,
      user_id,
      night_rate_begins,
      night_rate_ends,
      night_rate_type,
      night_rate_value,
      from_date: from_date
        ? format(new Date(from_date), "yyyy-MM-dd")
        : undefined,
      to_date: to_date ? format(new Date(to_date), "yyyy-MM-dd") : undefined,
      ip,
      modified_by,
    };

    // Remove undefined or empty values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === "") {
        delete updateData[key];
      }
    });

    const [affectedRows] = await UserNightCharge.update(updateData, {
      where: { id: auto_id },
    });

    if (affectedRows > 0) {
      return successResponse(
        res,
        MESSAGES.GENERAL.DATA_UPDATED,
        affectedRows,
        200
      );
      res.json({ status: "success", message: "Data updated successfully" });
    } else {
      return errorResponse(res, MESSAGES.GENERAL.RECORD_NOT_FOUND, null, 400);
      res.json({
        status: "failed",
        message: "Something went wrong or record not found",
      });
    }
  } catch (error) {
    console.error("Update error:", error);
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};
export const getUserCancellationFare = async (req) => {
  const { user_id, master_booking_type_id, booking_type, vehicle_type } =
    req

    console.log({user_id, master_booking_type_id, booking_type, vehicle_type})
  try {
    const whereClause = {};

    if (user_id) whereClause.user_id = user_id;
    if (master_booking_type_id)
      whereClause.master_booking_type_id = master_booking_type_id;
    if (booking_type) whereClause.booking_type = booking_type;
    if (vehicle_type) whereClause.vehicle_type = vehicle_type;

    const results = await UserCancellationFare.findAll({
      where: whereClause,
      include: [
        {
          model: MasterCancellation,
          as: "cancellation",
          attributes: ["name", "description", "order_by"],
          required: false,
        },
        {
          model: MasterCurrency,
          as: "currency",
          attributes: ["fa_icon"],
          required: false,
        },
      ],
      order: [
        [{ model: MasterCancellation, as: "cancellation" }, "order_by", "ASC"],
      ],
    });

    if (results.length > 0) {
return results
    } else {
   return []
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching cancellation fare", err);
  
  }
};

export const getDriverCancellationFare = async (req, res) => {
  try {
    const { user_id, master_booking_type_id, booking_type } = req.query;

    // Build the where condition
    const whereCondition = {
      user_id: user_id,
    };

    if (master_booking_type_id !== undefined && master_booking_type_id !== "") {
      whereCondition.master_booking_type_id = master_booking_type_id;
    }

    if (booking_type !== undefined && booking_type !== "") {
      whereCondition.booking_type = booking_type;
    }

    // Query using Sequelize
    const result = await DriverCancellationFare.findAll({
      where: whereCondition,
      include: [
        {
          model: MasterCancellation,
          as: "cancellation",
          required: false, // LEFT JOIN
        },
        {
          model: MasterCurrency,
          as: "currency",
          required: false, // LEFT JOIN
        },
      ],
      attributes: [
        "id",
        "currency_id",
        "cancellation_master_id",
        "booking_type",
        "master_booking_type_id",
        "cancellation_type",
        "cancellation_value",
        "from_date",
        "to_date",
        "created_by",
        "status",
        "days",
        "hours",
        [sequelize.col("cancellation.name"), "name"],
        [sequelize.col("cancellation.description"), "description"],
        [sequelize.col("currency.fa_icon"), "currency_icon"],
      ],
      order: [[sequelize.col("cancellation.order_by"), "ASC"]],
    });

    if (result.length > 0) {
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "No record found",
      });
    }
  } catch (err) {
    console.error("Error fetching driver cancellation fare:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
export const updateUserCancellationFare = async (req, res) => {
  try {
    const {
      user_id,
      cancellation_master_id,
      cancellation_type,
      cancellation_value,
      from_date,
      to_date,
      modified_by,
      id,
    } = req.body;

    // Prepare update object
    const updateData = {
      user_id,
      cancellation_master_id,
      cancellation_type,
      cancellation_value,
      from_date: from_date || null,
      to_date: to_date || null,
      ip: req.ip,
      modified_by,
      modified_date: new Date(),
    };
    console.log({ updateData });
    // Remove undefined or empty values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === "") {
        delete updateData[key];
      }
    });

    // Update record using Sequelize
    const [affectedRows] = await UserCancellationFare.update(updateData, {
      where: { id },
    });

    if (affectedRows > 0) {
      return res.status(200).json({
        affectedRows,
        status: "success",
        message: "Data updated successfully",
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "Record not found or no changes made",
      });
    }
  } catch (err) {
    console.error("Error updating user cancellation fare:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
export const addUserWaitingCharge = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { user_id, booking_type, waitingfaredata } = req.body;

    // Validate required fields
    if (!user_id || !booking_type) {
      await transaction.rollback();
      return res.status(400).json({
        status: "failed",
        message: "user_id and booking_type are required",
      });
    }

    // Delete existing charges for this user and booking type
    await UserWaitingCharge.destroy({
      where: {
        user_id,
        booking_type,
      },
      transaction,
    });

    // Prepare new charges
    const chargesToCreate =
      waitingfaredata?.map((row) => ({
        booking_type: row.booking_type,
        user_id: row.user_id,
        waiting_minute_upto: row.waiting_minute_upto,
        waiting_fees: row.waiting_fees,
        from_date: new Date(), // Set current date as from_date
        to_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default to 1 year validity
        created_by: row.created_by,
        ip: row.ip || req.ip,
        created_date: new Date(),
        modified_date: new Date(),
        status: 1,
      })) || [];

    // Insert new charges
    let result;
    if (chargesToCreate.length > 0) {
      result = await UserWaitingCharge.bulkCreate(chargesToCreate, {
        transaction,
      });
    }

    await transaction.commit();

    if (chargesToCreate.length > 0) {
      return res.status(200).json({
        status: "success",
        data: {
          affectedRows: result.length,
        },
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "No records inserted",
      });
    }
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating user waiting charges:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
export const getUserWaitingCharge = async (req, res,isInternalCall=false) => {
  try {
    const { user_id, booking_type } = req.query||req||req.body;

    // Build where condition
    const whereCondition = {};

    if (user_id) {
      whereCondition.user_id = user_id;
    }

    if (booking_type) {
      whereCondition.booking_type = booking_type;
    }

    // Query using Sequelize
    const result = await UserWaitingCharge.findAll({
      where: whereCondition,
      order: [["waiting_minute_upto", "ASC"]], // Sort by waiting minutes
    });
    if (result.length > 0) {
      return ({
        status: "success",
        data: result,
      });
    } else {
      return ({
        status: "failed",
        message: "No record found",
      });
    }
  } catch (err) {
    console.error("Error fetching user waiting charges:", err);
    return ({
      status: "error",
      message: "Internal server error",
    });
  }
};
export const addUserPreWaitingCharge = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { user_id, booking_type, prewaitingfaredata } = req.body;

    // Validate required fields
    if (!user_id || !booking_type) {
      await transaction.rollback();
      return res.status(400).json({
        status: "failed",
        message: "user_id and booking_type are required",
      });
    }

    // Delete existing charges for this user and booking type
    await UserPreWaitingCharge.destroy({
      where: {
        user_id,
        booking_type,
      },
      transaction,
    });

    // Prepare new charges
    const chargesToCreate =
      prewaitingfaredata?.map((row) => ({
        booking_type: row.booking_type,
        user_id: row.user_id,
        pre_waiting_upto_minutes: row.pre_waiting_upto_minutes,
        pre_waiting_fees: row.pre_waiting_fees,
        from_date: new Date(), // Current date as from_date
        to_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year validity
        created_by: row.created_by,
        ip: row.ip || req.ip,
        created_date: new Date(),
        modified_date: new Date(),
        status: 1,
      })) || [];

    // Insert new charges
    let result;
    if (chargesToCreate.length > 0) {
      result = await UserPreWaitingCharge.bulkCreate(chargesToCreate, {
        transaction,
      });
    }

    await transaction.commit();

    if (chargesToCreate.length > 0) {
      return res.status(200).json({
        status: "success",
        data: {
          affectedRows: result.length,
        },
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "No records inserted",
      });
    }
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating user pre-waiting charges:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getUserPreWaitingCharge = async (req, res) => {
  try {
    const { user_id, booking_type } = req.query;

    // Build where condition
    const whereCondition = {};

    if (user_id) {
      whereCondition.user_id = user_id;
    }

    if (booking_type) {
      whereCondition.booking_type = booking_type;
    }

    // Query using Sequelize
    const result = await UserPreWaitingCharge.findAll({
      where: whereCondition,
      order: [["pre_waiting_upto_minutes", "ASC"]], // Sort by waiting minutes
    });

    if (result.length > 0) {
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "No record found",
      });
    }
  } catch (err) {
    console.error("Error fetching user pre-waiting charges:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
export const addUserPremiumsFare = async (req, res) => {
  try {
    const {
      user_id,
      booking_type,
      premiums_type,
      premiums_value,
      from_date,
      to_date,
      created_by,
      ip,
    } = req.body;

    // Validate required fields
    if (
      !user_id ||
      !booking_type ||
      !premiums_type ||
      !premiums_value ||
      !created_by
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields",
      });
    }

    // Create premium fare record
    const premiumFare = await UserPremiumsFare.create({
      user_id,
      booking_type,
      premiums_type,
      premiums_value,
      from_date: from_date || new Date(),
      to_date:
        to_date ||
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      created_date: new Date(),
      modified_date: new Date(),
      created_by,
      modified_by: created_by, // Assuming same user is modifying
      status: 1,
      ip: ip || req.ip,
    });

    return res.status(201).json({
      status: "success",
      data: premiumFare,
    });
  } catch (err) {
    console.error("Error creating user premium fare:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
export const getUserPremiumsFare = async (req, res,isInternalCall=false) => {
  try {
    const { user_id, booking_type } = req.query||req||req.body;

    // Build where condition
    const whereCondition = { status: 1 }; // Only active records

    if (user_id) {
      whereCondition.user_id = user_id;
    }

    if (booking_type) {
      whereCondition.booking_type = booking_type;
    }

    // Query using Sequelize
    const result = await UserPremiumsFare.findOne({
      where: whereCondition,
      order: [["created_date", "DESC"]], // Get most recent record
    });
if(isInternalCall) return ({
        status: "success",
        data: result,
      });
    if (result) {
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "No record found",
      });
    }
  } catch (err) {
    console.error("Error fetching user premium fare:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const addUserPostalcodeFare = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { user_id, postalcodedata } = req.body;

    // Validate required fields
    if (!user_id) {
      await transaction.rollback();
      return res.status(400).json({
        status: "failed",
        message: "user_id is required",
      });
    }

    // Delete existing fares for this user
    await UserPostalcodeFare.destroy({
      where: { user_id },
      transaction,
    });

    // Prepare new fares
    const faresToCreate =
      postalcodedata?.map((row) => ({
        booking_type: row.booking_type,
        user_id: row.user_id,
        pickup_postcode: row.pickup_postcode,
        drop_postcode: row.drop_postcode,
        price: row.price,
        created_date: new Date(),
        modified_date: new Date(),
        created_by: row.created_by,
        modified_by: row.created_by, // Assuming same user is modifying
        status: 1,
        ip: row.ip || req.ip,
      })) || [];

    // Insert new fares
    let result;
    if (faresToCreate.length > 0) {
      result = await UserPostalcodeFare.bulkCreate(faresToCreate, {
        transaction,
      });
    }

    await transaction.commit();

    if (faresToCreate.length > 0) {
      return res.status(200).json({
        status: "success",
        data: {
          affectedRows: result.length,
        },
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "No records inserted",
      });
    }
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating user postalcode fares:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getUserPostalcodeFare = async (req, res) => {
  try {
    const { user_id, booking_type } = req.query;

    // Build where condition
    const whereCondition = { status: 1 }; // Only active records

    if (user_id) {
      whereCondition.user_id = user_id;
    }

    if (booking_type) {
      whereCondition.booking_type = booking_type;
    }

    // Query using Sequelize
    const result = await UserPostalcodeFare.findAll({
      where: whereCondition,
      order: [["created_date", "DESC"]], // Get most recent records first
    });

    if (result.length > 0) {
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "No record found",
      });
    }
  } catch (err) {
    console.error("Error fetching user postalcode fares:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
export const addUserFixRoute = async (req, res) => {
  try {
    const {
      user_id,
      booking_type,
      frequent_location,
      status = 1,
      created_by,
      ip,
    } = req.body;

    // Validate required fields
    if (!user_id || !booking_type || !frequent_location || !created_by) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields",
      });
    }

    // Create new fix route record
    const fixRoute = await UserFixRoute.create({
      booking_type,
      user_id,
      frequent_location,
      status,
      created_date: new Date(),
      modified_date: new Date(),
      created_by,
      modified_by: created_by, // Same as created_by
      ip: ip || req.ip,
    });

    return res.status(201).json({
      status: "success",
      data: fixRoute,
    });
  } catch (err) {
    console.error("Error creating user fix route:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateUserFixRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      booking_type,
      frequent_location,
      status,
      modified_by,
      ip,
    } = req.body;

    // Prepare update data
    const updateData = {
      user_id,
      booking_type,
      frequent_location,
      status,
      modified_by,
      ip: ip || req.ip,
      modified_date: new Date(),
    };

    // Remove undefined or empty values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === "") {
        delete updateData[key];
      }
    });

    // Update record
    const [affectedRows] = await UserFixRoute.update(updateData, {
      where: { id },
    });

    if (affectedRows > 0) {
      return res.status(200).json({
        status: "success",
        message: "Data updated successfully",
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "Record not found or no changes made",
      });
    }
  } catch (err) {
    console.error("Error updating user fix route:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getUserFixRoute = async (req, res) => {
  try {
    const { user_id, booking_type } = req.query;

    // Build where condition
    const whereCondition = { status: 1 }; // Only active records

    if (user_id) {
      whereCondition.user_id = user_id;
    }

    if (booking_type) {
      whereCondition.booking_type = booking_type;
    }

    // Query using Sequelize
    const result = await UserFixRoute.findOne({
      where: whereCondition,
      order: [["created_date", "DESC"]], // Get most recent record
    });

    if (result) {
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "No record found",
      });
    }
  } catch (err) {
    console.error("Error fetching user fix routes:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const addUserCancellationFare = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      user_id,
      booking_type,
      master_booking_type_id,
      vehicle_type,
      cancelfaredata,
    } = req.body;

    // Validate required fields
    if (
      !user_id ||
      !booking_type ||
      !master_booking_type_id ||
      !vehicle_type ||
      !cancelfaredata
    ) {
      await transaction.rollback();
      return res.status(400).json({
        status: "failed",
        message: "Missing required fields",
      });
    }

    // 1. Archive existing fares
    await UserCancellationFareLog.bulkCreate(
      await UserCancellationFare.findAll({
        where: {
          user_id,
          booking_type,
          master_booking_type_id,
          vehicle_type: cancelfaredata[0].vehicle_type,
        },
        raw: true,
      }),
      { transaction }
    );

    // 2. Delete existing fares
    await UserCancellationFare.destroy({
      where: {
        user_id,
        booking_type,
        master_booking_type_id,
        vehicle_type: cancelfaredata[0].vehicle_type,
      },
      transaction,
    });

    // 3. Insert new fares
    const faresToCreate = cancelfaredata.map((row) => ({
      master_booking_type_id,
      booking_type,
      vehicle_type: row.vehicle_type,
      user_id,
      cancellation_master_id: row.cancellation_master_id,
      cancellation_type: row.cancellation_type,
      cancellation_value: row.cancellation_value,
      days: row.days || "0",
      hours: row.hours || "0",
      from_date: new Date(),
      created_date: new Date(),
      created_by: row.created_by,
      ip: row.ip || req.ip,
      status: 1,
    }));

    const result = await UserCancellationFare.bulkCreate(faresToCreate, {
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      status: "success",
      data: {
        affectedRows: result.length,
      },
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating cancellation fares:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
export const addDriverCancellationFare = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      user_id,
      booking_type,
      master_driver_cancellation_id,
      currency_id,
      cancelfaredata,
    } = req.body;

    // Validate required fields
    if (
      !user_id ||
      !booking_type ||
      !master_driver_cancellation_id ||
      !cancelfaredata
    ) {
      await transaction.rollback();
      return res.status(400).json({
        status: "failed",
        message:
          "Missing required fields (user_id, booking_type, master_driver_cancellation_id, or cancelfaredata)",
      });
    }

    // Validate each cancellation fare item
    const invalidItems = cancelfaredata.filter(
      (item) =>
        !item.cancellation_master_id ||
        !item.cancellation_type ||
        item.cancellation_value === undefined
    );

    if (invalidItems.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: "failed",
        message:
          "Each cancellation fare item requires cancellation_master_id, cancellation_type, and cancellation_value",
      });
    }

    // 1. Archive existing fares to logs
    const existingFares = await DriverCancellationFare.findAll({
      where: {
        user_id,
        booking_type,
        master_driver_cancellation_id,
      },
      transaction,
    });

    if (existingFares.length > 0) {
      await DriverCancellationFareLog.bulkCreate(
        existingFares.map((fare) => fare.get({ plain: true })),
        { transaction }
      );
    }

    // 2. Delete existing fares
    await DriverCancellationFare.destroy({
      where: {
        user_id,
        booking_type,
        master_driver_cancellation_id,
      },
      transaction,
    });

    // 3. Create new fares with proper validation
    const faresToCreate = cancelfaredata.map((row) => {
      // Set default values for all required fields
      return {
        master_driver_cancellation_id,
        booking_type,
        user_id,
        currency_id,
        cancellation_master_id: row.cancellation_master_id,
        cancellation_type: row.cancellation_type,
        cancellation_value: row.cancellation_value,
        days: row.days || "0",
        hours: row.hours || "0",
        from_date: row.from_date || new Date(),
        to_date:
          row.to_date ||
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        created_date: new Date(),
        modified_date: new Date(),
        created_by: row.created_by || req.user?.id || 0,
        modified_by: row.modified_by || row.created_by || req.user?.id || 0,
        ip: row.ip || req.ip,
        status: row.status !== undefined ? row.status : 1,
      };
    });

    const createdRecords = await DriverCancellationFare.bulkCreate(
      faresToCreate,
      {
        validate: true,
        transaction,
      }
    );

    await transaction.commit();

    return res.status(200).json({
      status: "success",
      data: {
        archivedCount: existingFares.length,
        createdCount: createdRecords.length,
      },
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating driver cancellation fares:", err);

    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "failed",
        message: "Validation error",
        errors: err.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};

export const addUserPeakTimeCharge = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { user_id, data: peaktimevalueArr } = req.body;

    // Validate user_id
    if (!user_id || isNaN(user_id) || user_id <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: "failed",
        message: "Valid user_id is required",
      });
    }

    // Delete existing records
    await UserPeakTimeCharge.destroy({
      where: { user_id },
      transaction,
    });

    // Insert new records if provided
    if (peaktimevalueArr && peaktimevalueArr.length > 0) {
      const recordsToInsert = peaktimevalueArr.map((rowdata) => ({
        booking_type: rowdata.booking_type,
        user_id: rowdata.user_id,
        start_time: rowdata.start_time,
        end_time: rowdata.end_time,
        peaktime_type: rowdata.peaktime_type,
        peaktime_value: rowdata.peaktime_value,
        created_date: new Date(),
        created_by: rowdata.created_by,
        ip: rowdata.ip || req.ip,
      }));

      const result = await UserPeakTimeCharge.bulkCreate(recordsToInsert, {
        transaction,
        validate: true,
      });

      await transaction.commit();
      return res.json({
        status: "success",
        data: {
          affectedRows: result.length,
        },
      });
    }

    await transaction.commit();
    return res.json({
      status: "success",
      message: "No records inserted",
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error in addUserPeakTimeCharge:", err);

    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "failed",
        message: "Validation error",
        errors: err.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getUserPeakTimeCharge = async (req, res,isInternalCall=false) => {
  try {
    const { user_id, booking_type } = req.query||req||req.body; 

    // Build the where clause
    const where = { status: 1 };

    if (user_id) {
      where.user_id = parseInt(user_id);
    }

    if (booking_type) {
      where.booking_type = parseInt(booking_type);
    }

    // Query the database
    const peakTimeCharges = await UserPeakTimeCharge.findAll({
      where,
      order: [["created_date", "DESC"]], // Optional: order by creation date
    });
if(isInternalCall) return ({
        status: "success",
        data: peakTimeCharges,
      });
    if (peakTimeCharges.length > 0) {
      return res.status(200).json({
        status: "success",
        data: peakTimeCharges,
      });
    }

    return res.status(404).json({
      status: "failed",
      message: "No records found",
    });
  } catch (err) {
    console.error("Error in getUserPeakTimeCharge:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const addUserCompanyShare = async (req, res) => {
  let finalArr = [];
  try {
    const transaction = await sequelize.transaction();
    const {
      booking_type,
      share_type_id,
      share_value_type,
      share_value,
      created_by,
      status,
      ip,
    } = req.body;
    let deleteUserId = req.body.user_id;
    if (!deleteUserId || isNaN(deleteUserId)) {
      await transaction.rollback();
      return res.status(400).json({
        status: "failed",
        message: "Valid user_id is required",
      });
    }

    if (deleteUserId) {
      // Delete existing records
      await UserCompanyShare.destroy({
        where: { user_id: deleteUserId },
        transaction,
      });
      const result = await UserCompanyShare.create(
        {
          booking_type,
          share_type_id,
          share_value_type,
          share_value,
          created_by,
          status,
          ip,
          user_id: deleteUserId,
          company_share_value: req.body.company_share_value || null,
          driver_share_value: req.body.driver_share_value || null,
          partner_share_value: req.body.partner_share_value || null,
        },
        { transaction, validate: true }
      );
      await transaction.commit();

      return successResponse(res, MESSAGES.GENERAL.DATA_CREATED, result, 201);
    }
  } catch (error) {
    await transaction.rollback()
    console.log({ error });
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error,
      500
    );
  }
};

export const getUserCompanyShare = async (req, res,isInternalCall=false) => {
  try {
    
    const { user_id, booking_type, id } = req.query||req||req.body;
    let where = {};
    if (user_id) {
    where.user_id = parseInt(user_id);
  }
  if (id) {
    where.id = parseInt(id);
  }
  if(booking_type){
    where.booking_type= booking_type
  }
  const result = await UserCompanyShare.findAll({where})
  if(result.length>0){
   if(isInternalCall) return ({
        status: "success",
        data: result,
      }); 
    return successResponse(res,MESSAGES.GENERAL.DATA_FETCHED,result,200)
  }
  
  else return (!isInternalCall)&& errorResponse(res,MESSAGES.GENERAL.RECORD_NOT_FOUND,result,404)
  
} catch (error) {
console.log({error})
return errorResponse(res,MESSAGES.GENERAL.SOMETHING_WENT_WRONG,error,500)  
}
};


export const updateUserShareDetail = async (req, res) => {
  try {
    const { 
      auto_id, // This is the ID of the record to update
      user_id,
      booking_type,
      company_share_type,
      company_share_value,
      partner_share_type,
      partner_share_value,
      driver_share_type,
      driver_share_value,
      status,
      ip,
      modified_by
    } = req.body;

    // Validate required fields
    if (!auto_id) {
      return res.status(400).json({
        status: 'failed',
        message: 'Record ID (auto_id) is required'
      });
    }

    // Prepare update object
    const updateData = {
      user_id,
      booking_type,
      company_share_type,
      company_share_value,
      partner_share_type,
      partner_share_value,
      driver_share_type,
      driver_share_value,
      status,
      ip,
      modified_by
    };

    // Remove undefined or empty values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });

    // Perform the update
    const [affectedRows] = await UserCompanyShare.update(updateData, {
      where: { id: auto_id }
    });

    if (affectedRows > 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Data updated successfully'
      });
    } else {
      return res.status(404).json({
        status: 'failed',
        message: 'No record found with the specified ID'
      });
    }
  } catch (err) {
    console.error('Error updating user share details:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message
    });
  }
};

export const addUserShareDetail = async (req, res) => {
  try {
      // Prepare the data for creation
      const shareData = {
          user_id: req.body.user_id,
          share_value_type:req.body.share_value_type,
          share_value:req.body.share_value,
          share_type_id:req.body.share_type_id,
          booking_type: req.body.booking_type,
          company_share_type: req.body.company_share_type,
          company_share_value: req.body.company_share_value,
          partner_share_type: req.body.partner_share_type,
          partner_share_value: req.body.partner_share_value,
          driver_share_type: req.body.driver_share_type,
          driver_share_value: req.body.driver_share_value,
          status: req.body.status,
          created_by: req.body.created_by,
          ip: req.body.ip
      };

      // Remove undefined or empty values
      Object.keys(shareData).forEach(key => {
          if (shareData[key] === undefined || shareData[key] === '') {
              delete shareData[key];
          }
      });

      // Create the record using Sequelize
      const result = await UserCompanyShare.create(shareData);

      if (result) {
          return res.status(201).json({
              status: 'success',
              data: result
          });
      } else {
          return res.status(400).json({
              status: 'failed',
              message: 'Something went wrong'
          });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
          status: 'error',
          message: 'Internal server error',
          error: error.message
      });
  }
};

export const updateTaxDetailStatus = async (req, res) => {
  try {
      const { id, user_id, status } = req.body;

      // Validate required fields
      if (!id || !user_id || status === undefined) {
          return res.status(400).json({
              status: 'failed',
              message: 'id, user_id, and status are required'
          });
      }

      // Convert id to array if it's a comma-separated string
      const ids = Array.isArray(id) ? id : id.split(',').map(Number);

      // Update records using Sequelize
      const [affectedRows] = await TaxDetail.update(
          {
              status,
              modified_by: user_id,
              modified_on: sequelize.literal('CURRENT_TIMESTAMP')
          },
          {
              where: {
                  id: ids
              }
          }
      );

      if (affectedRows > 0) {
          return res.status(200).json({
              status: 'success',
              message: `${affectedRows} record(s) updated successfully`
          });
      } else {
          return res.status(404).json({
              status: 'failed',
              message: 'No records found to update'
          });
      }
  } catch (error) {
      console.error('Error updating tax detail status:', error);
      return res.status(500).json({
          status: 'error',
          message: 'Internal server error',
          error: error.message
      });
  }
};


export const updateNightFareStatus = async (req, res) => {
  try {
      // Extract parameters from request
      const { id, user_id, status } = req.body;

      // Validate required parameters
      if (!id || !user_id || status === undefined) {
          return res.status(400).json({
              success: false,
              message: 'Missing required parameters: id, user_id, or status'
          });
      }

      // Convert id to array (handles both comma-separated string and array)
      const ids = Array.isArray(id) ? id : id.split(',').map(id => parseInt(id.trim()));

      // Update records using Sequelize
      const [affectedRows] = await UserNightCharge.update(
          {
              status,
              modified_by: user_id,
              modified_on: new Date() // Sequelize will automatically handle timestamp
          },
          {
              where: {
                  id: ids
              }
          }
      );

      if (affectedRows > 0) {
          return res.status(200).json({
              success: true,
              message: `Successfully updated ${affectedRows} record(s)`,
              data: { affectedRows }
          });
      } else {
          return res.status(404).json({
              success: false,
              message: 'No records found matching the provided IDs'
          });
      }
  } catch (error) {
      console.error('Error updating night fare status:', error);
      return res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: error.message
      });
  }
};
export const updateCancelFeesStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
      const { id, user_id, status } = req.body;
console.log({id, user_id, status })
      // Input validation
      if (!id || !user_id || status==undefined) {
          await transaction.rollback();
          return res.status(400).json({
              success: false,
              message: 'id, user_id, and status are required fields'
          });
      }

      // Convert id to array (handles both comma-separated string and array)
      const ids = Array.isArray(id) ? id : id.split(',').map(id => parseInt(id.trim()));

      // Update records
      const [affectedRows] = await UserCancellationFare.update(
          {
              status,
              modified_by: user_id,
              modified_at: sequelize.literal('CURRENT_TIMESTAMP')
          },
          {
              where: { id: ids },
              transaction
          }
      );

      await transaction.commit();

      if (affectedRows === 0) {
          return res.status(404).json({
              success: false,
              message: 'No matching records found to update'
          });
      }

      return res.status(200).json({
          success: true,
          message: `Successfully updated ${affectedRows} record(s)`,
          affectedRows
      });

  } catch (error) {
      await transaction.rollback();
      console.error('Error updating cancellation fees status:', error);
      return res.status(500).json({
          success: false,
          message: 'Failed to update cancellation fees',
          error: error.message
      });
  }
};

export const updateDriverCancelFeesStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
      const { id, user_id, status } = req.body;

      // Input validation
      if (!id || !user_id || status === undefined) {
          await transaction.rollback();
          return res.status(400).json({
              success: false,
              message: 'id, user_id, and status are required fields'
          });
      }

      // Convert id to array (handles both comma-separated string and array)
      const ids = Array.isArray(id) ? id : id.split(',').map(id => parseInt(id.trim()));

      // Update records
      const [affectedRows] = await DriverCancellationFare.update(
          {
              status,
              modified_by: user_id,
              modified_at: sequelize.literal('CURRENT_TIMESTAMP')
          },
          {
              where: { id: ids },
              transaction
          }
      );

      await transaction.commit();

      if (affectedRows === 0) {
          return res.status(404).json({
              success: false,
              message: 'No matching records found to update'
          });
      }

      return res.status(200).json({
          success: true,
          message: `Successfully updated ${affectedRows} record(s)`,
          affectedRows
      });

  } catch (error) {
      await transaction.rollback();
      console.error('Error updating driver cancellation fees status:', error);
      return res.status(500).json({
          success: false,
          message: 'Failed to update driver cancellation fees',
          error: error.message
      });
  }
};


export const updateUserPreWaitingFeesStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
      const { id, user_id, status } = req.body;

      // Validate required parameters
      if (!id || !user_id || status === undefined) {
          await transaction.rollback();
          return res.status(400).json({
              success: false,
              message: 'id, user_id, and status are required parameters',
              error: 'Missing required fields'
          });
      }

      // Convert id to array (handles both comma-separated string and array)
      const ids = Array.isArray(id) ? id : id.split(',').map(id => {
          const num = parseInt(id.trim());
          if (isNaN(num)) {
              throw new Error('Invalid ID format');
          }
          return num;
      });

      // Update records
      const [affectedRows] = await UserPreWaitingCharge.update(
          {
              status,
              modified_by: user_id,
              modified_at: sequelize.literal('CURRENT_TIMESTAMP')
          },
          {
              where: { id: ids },
              transaction,
              validate: true
          }
      );

      await transaction.commit();

      return res.status(200).json({
          success: true,
          message: `Successfully updated ${affectedRows} record(s)`,
          affectedRows,
          updatedIds: ids
      });

  } catch (error) {
      await transaction.rollback();
      console.error('Error updating user pre-waiting fees status:', error);
      
      const statusCode = error.message.includes('Invalid ID format') ? 400 : 500;
      
      return res.status(statusCode).json({
          success: false,
          message: 'Failed to update pre-waiting fees status',
          error: error.message
      });
  }
};



export const getVendorFareInfo = async (req, res) => {
    try {
        const { vehicle_type_id, vehicle_master_id } = req.query;

        // Build the where condition dynamically
        const whereCondition = {};
        
        if (vehicle_type_id !== undefined && vehicle_type_id !== '') {
            whereCondition.vehicle_type_id = vehicle_type_id;
        }
        
        if (vehicle_master_id !== undefined && vehicle_master_id !== '') {
            whereCondition.vehicle_master_id = vehicle_master_id;
        }

        // Query using Sequelize
        const faredata = await BaseVehicleType.findAll({
            where: whereCondition
        });

        if (faredata.length > 0) {
            return res.status(200).json({
                status: 'success',
                data: faredata
            });
        } else {
            return res.status(404).json({
                status: 'failed',
                message: 'No Record Found',
                data: []
            });
        }
    } catch (err) {
        console.error('Error in getVendorFareInfo:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: err.message
        });
    }
};

export const updateCabFareData = async (req, res) => {
  try {
      const { base_combination_id } = req.body;
      const { vehicle_master_id } = req.body;

      // Validate input
      if (!base_combination_id) {
          return res.status(400).json({
              status: 'failed',
              msg: 'base_combination_id is required'
          });
      }

      // Prepare update data
      const updateData = {};
      if (vehicle_master_id !== undefined && vehicle_master_id !== '') {
          updateData.vehicle_master_id = vehicle_master_id;
      }

      // Check if we have anything to update
      if (Object.keys(updateData).length === 0) {
          return res.status(400).json({
              status: 'failed',
              msg: 'No valid fields provided for update'
          });
      }

      // Perform update
      const [affectedRows] = await BaseVehicleType.update(updateData, {
          where: { base_comb_id: base_combination_id }
      });

      if (affectedRows > 0) {
          return res.status(200).json({
              status: 'success',
              msg: 'Data updated successfully'
          });
      } else {
          return res.status(400).json({
              status: 'failed',
              msg: 'No records were updated - combination ID may not exist'
          });
      }
  } catch (err) {
      console.error('Error updating cab fare:', err);
      return res.status(500).json({
          status: 'error',
          message: 'Internal server error',
          error: err.message
      });
  }
};



export const checkFareAccepted = async (req, res) => {
  try {
    const { user_id, base_comb_id } = req.body;

    const whereClause = {};

    if (user_id !== undefined && user_id !== '') {
      whereClause.vendor_id = user_id;
      whereClause.created_by = user_id;
    }

    if (base_comb_id !== undefined && base_comb_id !== '') {
      whereClause.fare_parent_id = base_comb_id;
    }

    const fareData = await BaseCombination.findAll({ where: whereClause });

    if (fareData.length > 0) {
      return res.status(200).json({
        status: 'success',
        data: fareData
      });
    } else {
      return res.status(404).json({
        status: 'failed',
        msg: 'No Record Found'
      });
    }

  } catch (error) {
    console.error('Error checking fare:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};



export const fetchCabFareData = async (req, res) => {
  try {
    const { base_combination_id } = req.body;

    const whereClause = {};
    if (base_combination_id !== undefined && base_combination_id !== '') {
      whereClause.id = base_combination_id;
    }

    const fareData = await BaseCombination.findAll({
      where: whereClause,
      include: [
        {
          model: BaseVehicleType,
          as: 'baseVehicleTypes',
          attributes: ['base_comb_id', 'vehicle_type_id'],
        },
        {
          model: DispatchLocation,
          as: 'dispatchLocation', // ✅ Correctly associated
          attributes: [
            'type_of_dispatch',
            'garage_type',
            'address',
            'city',
            'pincode',
            'latitude',
            'longitude'
          ]
        }
      ]
    });

    if (fareData.length > 0) {
      return res.status(200).json({ status: 'success', data: fareData });
    } else {
      return res.status(404).json({ status: 'failed', msg: 'No Record Found', data: [] });
    }
  } catch (error) {
    console.error('Error fetching cab fare data:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};


export const acceptCompanyFare = async function (req, res) {
  try {
      const base_vehicle_ids = [];
      const created_date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

      // Step 1: Copy Base Combination
      const basecombresp = await copybasecombination(req);

      req.body.created_date = created_date;
      req.body.lastInsertId = basecombresp.insertId;
      req.body.vehicle_type_id = basecombresp.vehicle_type_id;
      req.body.vehicle_master_id = basecombresp.vehicle_master_id;
      req.body.parent_base_vehicle_id = basecombresp.base_vehicle_id;
      req.body.master_package_id = basecombresp.master_package_id;
      req.body.master_package_mode_id = basecombresp.master_package_mode_id;

      const lastInsertId = basecombresp.insertId;

      // Step 2: Update fare acceptance status
      await updateFareAcceptedStatus(req);

      // Step 3: Add base vehicle type
      const basevehicleResp = await addBaseVehicleType(req);
      for (const key in basevehicleResp) {
          const basevehicleinsertId = basevehicleResp[key].insertId;
          base_vehicle_ids.push(basevehicleinsertId);
      }

      req.base_vehicle_id = base_vehicle_ids[base_vehicle_ids.length - 1];

      // Step 4: Copy Dispatch location
      await copyDispatchLocation(req);

      if (req.base_vehicle_id) {
          if (req.master_package_id === '5') {
              await copyOnewayRouteCity(req);
          }

          await copyBasicTaxData(req);
          await copybasicTaxFareSettingData(req);

          switch (req.master_package_mode_id) {
              case 1:
                  await copyDistanceFareData(req);
                  break;
              case 2:
                  await copyDistanceHourFareData(req);
                  break;
              case 3:
                  await copyHourlyFareData(req);
                  break;
              case 4:
                  await copyDistanceWaitingFareData(req);
                  break;
          }

          await copyFixRouteFareData(req);
          await copyNightChargeFareData(req);
          await copyPremiumsFareData(req);
          await copyDistanceUptoFareData(req);
          await copyCancellationFareData(req);
          await copyWaitingFareData(req);
          await copyPreWaitingFareData(req);
          await copyPostalCodeFareData(req);
          await copyPeakTimeFareData(req);
          await copyExtrasFareData(req);
          await copyCompanyShareData(req);
      }

      // Final response
      res.status(200).json({
          message: 'Fare Added Successfully',
          fare_id: lastInsertId,
          base_vehicle_id: base_vehicle_ids,
          code: "200",
          status: "success"
      });

  } catch (error) {
      console.error('Error in sequentialAcceptfare:', error);
      res.status(500).json({
          message: 'Internal Server Error',
          error: error.message,
          code: "500",
          status: "failed"
      });
  }
};


export const getFareDataArray = async (req, res) => {
    try {
        const {
            city_id,
            vehicle_type_id,
            master_package_id,
            master_package_mode_id,
            user_id,
            company_id,
            type_of_dispatch,
            city_distance_id,
            client_id,
            status,
            created_by,
            base_combination_id,
        } = req.body; // or req.query if coming from GET

        // Determine fare table
        let tableFare;
        switch (master_package_mode_id) {
            case 1: tableFare = 'distance_fare'; break;
            case 2: tableFare = 'hourly_fare'; break;
            case 3: tableFare = 'distance_hour_fare'; break;
            case 4: tableFare = 'distance_waiting_fare'; break;
            default: tableFare = 'distance_fare';
        }

        // Base SQL query
        let sql = `
            SELECT 
                bs.id as base_combination_id,
                bs.client_id,
                bs.master_package_mode_id,
                bs.master_package_id,
                bs.status as bs_status,
                bvt.base_vehicle_id,
                bvt.vehicle_type_id,
                bvt.vehicle_master_id,
                master_city.id as city_id,
                cdl.destination_city,
                cdl.id as city_distance_id,
                master_package.name as package_name,
                master_package_mode.package_mode as package_mode,
                master_vehicle_type.vehicle_type,
                oneway.city_distance_id,
                DATE_FORMAT(faretable.date_from,'%Y-%m-%d') AS from_date,
                DATE_FORMAT(faretable.date_to,'%Y-%m-%d') AS to_date,
                faretable.week_days,
                dl.*  
            FROM base_combination AS bs
            JOIN base_vehicle_type AS bvt ON bs.id = bvt.base_comb_id
            LEFT JOIN dispatch_location dl ON bs.id = dl.base_comb_id
            LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
            LEFT JOIN ${tableFare} AS faretable ON bvt.base_vehicle_id = faretable.base_vehicle_id
            LEFT JOIN city_distance_list AS cdl ON oneway.city_distance_id = cdl.id
            LEFT JOIN company_setup ON bs.company_id = company_setup.id
            LEFT JOIN master_city ON bs.city_id = master_city.id
            LEFT JOIN master_city AS destination_city ON cdl.destination_city = destination_city.id
            LEFT JOIN master_package ON bs.master_package_id = master_package.id
            LEFT JOIN master_package_mode ON bs.master_package_mode_id = master_package_mode.id
            LEFT JOIN user AS vendor ON bs.vendor_id = vendor.id
            LEFT JOIN user AS client ON bs.client_id = client.id
            LEFT JOIN master_vehicle_type ON bvt.vehicle_type_id = master_vehicle_type.id
            WHERE bs.status != '2' AND bs.fare_type = 'NORMAL'
        `;

        // Dynamic filters
        if (company_id) sql += ` AND bs.company_id = ${company_id}`;
        if (user_id) sql += ` AND bs.vendor_id = ${user_id}`;
        if (client_id) sql += ` AND bs.client_id = ${client_id}`;
        if (city_id) sql += ` AND bs.city_id = ${city_id}`;
        if (master_package_id) sql += ` AND bs.master_package_id = ${master_package_id}`;
        if (master_package_mode_id) sql += ` AND bs.master_package_mode_id = ${master_package_mode_id}`;
        if (status) sql += ` AND bs.status = '${status}'`;
        if (vehicle_type_id) sql += ` AND bvt.vehicle_type_id = ${vehicle_type_id}`;
        if (type_of_dispatch) sql += ` AND dl.type_of_dispatch = '${type_of_dispatch}'`;
        if (created_by) sql += ` AND bs.created_by = ${created_by}`;
        if (city_distance_id) sql += ` AND oneway.city_distance_id = ${city_distance_id}`;
        if (base_combination_id) sql += ` AND bs.id = ${base_combination_id}`;

        sql += ' ORDER BY bs.id DESC LIMIT 1';

        // Execute raw query
        const faredata = await sequelize.query(sql, { type: QueryTypes.SELECT });

        if (faredata && faredata.length > 0) {
            res.json({ status: 'success', data: faredata[0] });
        } else {
            res.json({ status: 'failed', msg: 'No Record Found', data: [] });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', msg: 'Internal Server Error', error: err.message });
    }
};


export const updateDispatchData = async (req, res) => {
  try {
    const {
      master_package_id,
      type_of_dispatch,
      vendor_id,
      garage_type,
      address,
      city,
      pincode,
      latitude,
      longitude,
      user_id,
      ip,
      id, // base_comb_id
    } = req.body;

    // Prepare the update data
    const updateData = {
      user_id: vendor_id,
      type_of_dispatch,
      garage_type,
      address,
      city,
      pincode,
      latitude,
      longitude,
      modified_by: user_id,
      status: "1",
      ip,
    };

    // Remove undefined or empty values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === "") {
        delete updateData[key];
      }
    });

    // Update the dispatch location
    const [affectedRows] = await DispatchLocation.update(updateData, {
      where: { base_comb_id: id },
    });

    if (affectedRows > 0) {
      return res.status(200).json({
        message: "Fare Updated Successfully",
        code: "200",
        status: true,
      });
    } else {
      return res.status(404).json({
        message: "No matching record found",
        code: "404",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error updating dispatch data:", error);
    return res.status(500).json({
      message: "Internal server error",
      code: "500",
      status: false,
      error: error.message,
    });
  }
};


export const getAllFareListData = async (req, res) => {
  try {
    const {
      base_combination_id,
      base_vehicle_id,
      user_id: vendor_id,
      client_id,
      state_id,
      city_id,
      booking_type_id: masterPackageId,
      master_package_mode_id: masterPackageModeId,
      status,
      company_id,
      vehicle_type_id,
      from_date,
      to_date,
      weekdays,
      currency,
      created_by,
      limit,
      offset,
      searchValue,
    } = req.body;

    const sqlParts = [];

    sqlParts.push(`
      SELECT 
        bs.id AS base_combination_id,
        bs.client_id,
        bs.master_package_mode_id,
        bs.master_package_id,
        bs.date_from,
        bs.date_to,
        bs.week_days,
        bs.market_place,
        bs.status AS bs_status,
        bvt.base_vehicle_id,
        bvt.vehicle_type_id,
        bvt.vehicle_master_id,
        company_setup.site_title AS company_setup_name,
        master_city.id AS city_id,
        cdl.destination_city,
        cdl.id AS city_distance_id,
        cdl.distance_km,
        master_city.name AS city_name,
        master_city.state_name,
        master_city.country_code,
        destination_city.name AS destination_city_name,
        destination_city.state_name AS destination_state_name,
        destination_city.country_code AS destination_country_code,
        master_package.name AS package_name,
        master_package_mode.package_mode,
        CONCAT(vendor.first_name, ' ', vendor.last_name) AS vendor_name,
        CONCAT(client.first_name, ' ', client.last_name) AS client_name,
        master_vehicle_type.vehicle_type,
        master_currency.id AS currency_id,
        master_currency.country_name AS currency_city_name,
        master_currency.name AS currency_city_code,
        master_currency.symbol AS currency_city_symbol,
        dl.*
      FROM base_combination AS bs
      JOIN base_vehicle_type AS bvt ON bs.id = bvt.base_comb_id
      LEFT JOIN dispatch_location dl ON bs.id = dl.base_comb_id
      LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
      LEFT JOIN city_distance_list AS cdl ON oneway.city_distance_id = cdl.id
      LEFT JOIN company_setup ON bs.company_id = company_setup.id
      LEFT JOIN master_city ON bs.city_id = master_city.id
      LEFT JOIN master_city AS destination_city ON cdl.destination_city = destination_city.id
      LEFT JOIN master_package ON bs.master_package_id = master_package.id
      LEFT JOIN master_package_mode ON bs.master_package_mode_id = master_package_mode.id
      LEFT JOIN user AS vendor ON bs.vendor_id = vendor.id
      LEFT JOIN user AS client ON bs.client_id = client.id
      LEFT JOIN master_vehicle_type ON bvt.vehicle_type_id = master_vehicle_type.id
      LEFT JOIN master_currency ON bs.currency = master_currency.id
      WHERE bs.status != '2' AND bs.fare_type = 'NORMAL'
    `);

    // Add dynamic conditions
    if (base_combination_id) sqlParts.push(`AND bs.id = "${base_combination_id}"`);
    if (base_vehicle_id) sqlParts.push(`AND bvt.base_vehicle_id = "${base_vehicle_id}"`);
    if (company_id) sqlParts.push(`AND bs.company_id = "${company_id}"`);
    if (vendor_id) sqlParts.push(`AND bs.vendor_id = "${vendor_id}"`);
    if (client_id) sqlParts.push(`AND bs.client_id = "${client_id}"`);
    if (state_id) sqlParts.push(`AND bs.state_id = "${state_id}"`);
    if (city_id) sqlParts.push(`AND bs.city_id = "${city_id}"`);
    if (masterPackageId) sqlParts.push(`AND bs.master_package_id = "${masterPackageId}"`);
    if (masterPackageModeId) sqlParts.push(`AND bs.master_package_mode_id = "${masterPackageModeId}"`);
    if (status) sqlParts.push(`AND bs.status = "${status}"`);
    if (vehicle_type_id) sqlParts.push(`AND bvt.vehicle_type_id = "${vehicle_type_id}"`);
    if (from_date && to_date) {
      sqlParts.push(`
        AND (
          bs.date_from BETWEEN "${from_date}" AND "${to_date}" 
          OR bs.date_to BETWEEN "${from_date}" AND "${to_date}"
        )
      `);
    }
    if (weekdays) sqlParts.push(`AND bs.week_days IN ("${weekdays}")`);
    if (currency) sqlParts.push(`AND bs.currency = "${currency}"`);
    if (created_by) sqlParts.push(`AND bs.created_by = "${created_by}"`);
    if (searchValue) sqlParts.push(searchValue);

    sqlParts.push(`ORDER BY bs.id DESC`);

    if (limit && offset) {
      sqlParts.push(`LIMIT ${limit} OFFSET ${offset}`);
    }

    const finalQuery = sqlParts.join(" ");

    const fareData = await sequelize.query(finalQuery, {
      type: QueryTypes.SELECT,
    });

    if (fareData.length > 0) {
      return res.status(200).json({
        status: "success",
        data: fareData,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        msg: "No Record Found",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching fare data:", error);
    return res.status(500).json({
      status: "failed",
      msg: "Internal server error",
      error: error.message,
    });
  }
};



export const getVendorFareListDataTableCount = async (req, res) => {
  try {
    const sql = `
      SELECT 
        COUNT(*) AS total_count
      FROM base_combination AS bs 
      JOIN base_vehicle_type AS bvt ON bs.id = bvt.base_comb_id
      LEFT JOIN dispatch_location dl ON bs.id = dl.base_comb_id
      LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
      LEFT JOIN city_distance_list AS cdl ON oneway.city_distance_id = cdl.id
      LEFT JOIN company_setup ON bs.company_id = company_setup.id
      LEFT JOIN master_city ON bs.city_id = master_city.id
      LEFT JOIN master_city AS destination_city ON cdl.destination_city = destination_city.id
      LEFT JOIN master_package ON bs.master_package_id = master_package.id
      LEFT JOIN master_package_mode ON bs.master_package_mode_id = master_package_mode.id
      LEFT JOIN user AS vendor ON bs.vendor_id = vendor.id
      LEFT JOIN user AS client ON bs.client_id = client.id
      LEFT JOIN master_vehicle_type ON bvt.vehicle_type_id = master_vehicle_type.id
      LEFT JOIN master_currency ON bs.currency = master_currency.id
      WHERE 1=1
      AND bs.status != '2'
      AND bs.fare_type = 'NORMAL'
    `;

    const result = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 'failed',
        msg: 'No Record Found',
        data: [],
      });
    }

  } catch (error) {
    console.error('SQL execution error:', error);
    return res.status(500).json({
      status: 'failed',
      msg: 'Internal Server Error',
      error: error.message,
    });
  }
};


export const getVendorFareListDataTableFilterCount = async (req, res) => {
  try {
    const {
      base_combination_id,
      base_vehicle_id,
      user_id: vendor_id,
      client_id,
      state_id,
      city_id,
      booking_type_id: master_package_id,
      master_package_mode_id,
      status,
      company_id,
      vehicle_type_id,
      from_date,
      to_date,
      weekdays,
      currency,
      created_by
    } = req.body; // or req.query depending on frontend method

    let sql = `
      SELECT COUNT(*) AS total_count
      FROM base_combination AS bs
      JOIN base_vehicle_type AS bvt ON bs.id = bvt.base_comb_id
      LEFT JOIN dispatch_location dl ON bs.id = dl.base_comb_id
      LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
      LEFT JOIN city_distance_list AS cdl ON oneway.city_distance_id = cdl.id
      LEFT JOIN company_setup ON bs.company_id = company_setup.id
      LEFT JOIN master_city ON bs.city_id = master_city.id
      LEFT JOIN master_city AS destination_city ON cdl.destination_city = destination_city.id
      LEFT JOIN master_package ON bs.master_package_id = master_package.id
      LEFT JOIN master_package_mode ON bs.master_package_mode_id = master_package_mode.id
      LEFT JOIN user AS vendor ON bs.vendor_id = vendor.id
      LEFT JOIN user AS client ON bs.client_id = client.id
      LEFT JOIN master_vehicle_type ON bvt.vehicle_type_id = master_vehicle_type.id
      LEFT JOIN master_currency ON bs.currency = master_currency.id
      WHERE bs.status != '2' AND bs.fare_type = 'NORMAL'
    `;

    const conditions = [];

    if (base_combination_id) conditions.push(`bs.id = '${base_combination_id}'`);
    if (base_vehicle_id) conditions.push(`bvt.base_vehicle_id = '${base_vehicle_id}'`);
    if (vendor_id) conditions.push(`bs.vendor_id = '${vendor_id}'`);
    if (client_id) conditions.push(`bs.client_id = '${client_id}'`);
    if (state_id) conditions.push(`bs.state_id = '${state_id}'`);
    if (city_id) conditions.push(`bs.city_id = '${city_id}'`);
    if (master_package_id) conditions.push(`bs.master_package_id = '${master_package_id}'`);
    if (master_package_mode_id) conditions.push(`bs.master_package_mode_id = '${master_package_mode_id}'`);
    if (status) conditions.push(`bs.status = '${status}'`);
    if (company_id) conditions.push(`bs.company_id = '${company_id}'`);
    if (vehicle_type_id) conditions.push(`bvt.vehicle_type_id = '${vehicle_type_id}'`);
    if (currency) conditions.push(`bs.currency = '${currency}'`);
    if (created_by) conditions.push(`bs.created_by = '${created_by}'`);

    if (from_date && to_date) {
      conditions.push(`(bs.date_from BETWEEN '${from_date}' AND '${to_date}' OR bs.date_to BETWEEN '${from_date}' AND '${to_date}')`);
    }

    if (weekdays) {
      conditions.push(`bs.week_days IN ('${weekdays}')`);
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }

    const result = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 'failed',
        msg: 'No Record Found',
        data: [],
      });
    }

  } catch (error) {
    console.error('SQL execution error:', error);
    return res.status(500).json({
      status: 'failed',
      msg: 'Internal Server Error',
      error: error.message,
    });
  }
};



// export const getFareListData = async (req, res) => {
//   try {
//     const {
//       base_combination_id,
//       base_vehicle_id,
//       user_id: vendor_id,
//       client_id: clientId,
//       state_id: stateId,
//       city_id: cityId,
//       master_package_id: masterPackageId,
//       booking_mode_type: masterPackageModeId,
//       status,
//       company_id,
//       vehicle_type_id,
//       from_date,
//       to_date,
//       weekdays,
//       currency,
//       created_by,
//       searchValue,
//       limit,
//       offset
//   } = req?.body||req.query||{} // or req.query based on your client request

// let sql =`SELECT 
//     bs.id as base_combination_id,
//     bs.client_id,
//     bs.master_package_mode_id,
//     bs.master_package_id,
//     bs.date_from,
//     bs.date_to,
//     bs.week_days,
//     bs.market_place,
//     bs.status as bs_status,
//     bvt.base_vehicle_id,
//     bvt.vehicle_type_id,
//     bvt.vehicle_master_id,
//     nc.night_rate_begins, 
//     nc.night_rate_ends, 
//     nc.night_rate_type, 
//     nc.night_rate_value, 
//     company_setup.site_title as company_setup_name,
//     master_city.id as city_id,
//     cdl.destination_city,
//     cdl.id as city_distance_id,
//     cdl.distance_km as distance_km,
//     master_city.name as city_name,
//     master_city.state_name as state_name,
//     master_city.country_code as country_code,
//     destination_city.name as destination_city_name,
//     destination_city.state_name as destination_state_name,
//     destination_city.country_code as destination_country_code,
//     master_package.name as package_name,
//     master_package_mode.package_mode as package_mode,
//     CONCAT(vendor.first_name, ' ', vendor.last_name) as vendor_name,
//     CONCAT(client.first_name, ' ', client.last_name) as client_name,
//     master_vehicle_type.vehicle_type,
//     master_currency.id AS currency_id,
//     master_currency.country_name AS currency_city_name,
//     master_currency.name AS currency_city_code,
//     master_currency.symbol AS currency_city_symbol,
//     oneway.city_distance_id,
//     dl.*,
    
//     -- Use CASE statements to handle different package modes
//     CASE 
//         WHEN bs.master_package_mode_id = 1 THEN df.base_fare
//         WHEN bs.master_package_mode_id = 2 THEN hf.hourly_rate
//         WHEN bs.master_package_mode_id = 3 THEN dhf.base_fare
//         WHEN bs.master_package_mode_id = 4 THEN dwf.base_fare
//         ELSE NULL
//     END AS base_fare,
    
//     CASE 
//         WHEN bs.master_package_mode_id = 1 THEN df.rate_per_km
//         WHEN bs.master_package_mode_id = 3 THEN dhf.rate_per_km
//         WHEN bs.master_package_mode_id = 4 THEN dwf.rate_per_km
//         ELSE NULL
//     END AS rate_per_km,
    
//     CASE 
//         WHEN bs.master_package_mode_id = 2 THEN hf.min_hours
//         WHEN bs.master_package_mode_id = 3 THEN dhf.min_hours
//         ELSE NULL
//     END AS min_hours,
    
//     CASE 
//         WHEN bs.master_package_mode_id = 4 THEN dwf.waiting_rate_per_min
//         ELSE NULL
//     END AS waiting_rate_per_min,
    
//     CASE 
//         WHEN bs.master_package_mode_id = 1 THEN 'Distance Fare'
//         WHEN bs.master_package_mode_id = 2 THEN 'Hourly Fare'
//         WHEN bs.master_package_mode_id = 3 THEN 'Distance Hourly Fare'
//         WHEN bs.master_package_mode_id = 4 THEN 'Distance Waiting Fare'
//         ELSE 'Unknown'
//     END AS fare_type_description

// FROM base_combination bs
// LEFT JOIN base_vehicle_type bvt ON bs.id = bvt.base_comb_id
// LEFT JOIN dispatch_location dl ON bs.id = dl.base_comb_id
// LEFT JOIN oneway_city_route_package oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
// LEFT JOIN night_charge nc ON bvt.base_vehicle_id = nc.base_vehicle_id
// LEFT JOIN city_distance_list cdl ON oneway.city_distance_id = cdl.id
// LEFT JOIN company_setup ON bs.company_id = company_setup.id
// LEFT JOIN master_city ON bs.city_id = master_city.id
// LEFT JOIN master_city destination_city ON cdl.destination_city = destination_city.id
// LEFT JOIN master_package ON bs.master_package_id = master_package.id
// LEFT JOIN master_package_mode ON bs.master_package_mode_id = master_package_mode.id
// LEFT JOIN user vendor ON bs.vendor_id = vendor.id
// LEFT JOIN user client ON bs.client_id = client.id
// LEFT JOIN master_vehicle_type ON bvt.vehicle_type_id = master_vehicle_type.id
// LEFT JOIN master_currency ON bs.currency = master_currency.id

// -- Join all fare tables regardless of package mode
// LEFT JOIN distance_fare df ON bvt.base_vehicle_id = df.base_vehicle_id
// LEFT JOIN hourly_fare hf ON bvt.base_vehicle_id = hf.base_vehicle_id
// LEFT JOIN distance_hourly_fare dhf ON bvt.base_vehicle_id = dhf.base_vehicle_id
// LEFT JOIN distance_waiting_fare dwf ON bvt.base_vehicle_id = dwf.base_vehicle_id

// WHERE 1 = 1 
// AND bs.status != '2' 
// AND bs.fare_type = 'NORMAL';`
//  let filters=[]
// if (base_combination_id) {
//   filters.push(`bs.id = :base_combination_id`);
//   replacements.base_combination_id = base_combination_id;
// }    if (base_vehicle_id) filters.push(`bvt.base_vehicle_id = '${base_vehicle_id}'`);
//     if (company_id) filters.push(`bs.company_id = '${company_id}'`);
//     if (vendor_id) filters.push(`bs.vendor_id = '${vendor_id}'`);
//     if (clientId) filters.push(`bs.client_id = '${clientId}'`);
//     if (stateId) filters.push(`bs.state_id = '${stateId}'`);
//     if (cityId) filters.push(`bs.city_id = '${cityId}'`);
//     if (masterPackageId) filters.push(`bs.master_package_id = '${masterPackageId}'`);
//     if (masterPackageModeId) filters.push(`bs.master_package_mode_id = '${masterPackageModeId}'`);
//     if (status) filters.push(`bs.status = '${status}'`);
//     if (vehicle_type_id) filters.push(`bvt.vehicle_type_id = '${vehicle_type_id}'`);
//     if (currency) filters.push(`bs.currency = '${currency}'`);
//     if (created_by) filters.push(`bs.created_by = '${created_by}'`);

//     if (from_date && to_date) {
//       filters.push(`(bs.date_from BETWEEN '${from_date}' AND '${to_date}' OR bs.date_to BETWEEN '${from_date}' AND '${to_date}')`);
//     }

//     if (weekdays) {
//       filters.push(`bs.week_days IN ('${weekdays}')`);
//     }

//     if (filters?.length > 0) {
//       sql += ' AND ' + filters.join(' AND ');
//     }

//     if (searchValue) {
//       sql += ` ${searchValue}`;
//     }

//     sql += ` ORDER BY bs.id DESC`;

//     if (limit !== undefined && offset !== undefined) {
//       sql += ` LIMIT ${parseInt(limit)}, ${parseInt(offset)}`;
//     }

// const fareData = await sequelize.query(sql, { 
//   type: QueryTypes.SELECT,
//   // replacements: replacements
// });
//     if (fareData.length > 0) {
//       return res.status(200).json({
//         status: 'success',
//         data: fareData,
//       });
//     } else {
//       return res.status(404).json({
//         status: 'failed',
//         msg: 'No Record Found',
//         data: [],
//       });
//     }

//   } catch (error) {
//     console.error('Error fetching fare list:', error);
//     return res.status(500).json({
//       status: 'failed',
//       msg: 'Internal Server Error',
//       error: error.message,
//     });
//   }
// };




export const getFareListData = async (req, res) => {
  try {
    const {
      base_combination_id,
      base_vehicle_id,
      user_id: vendor_id,
      client_id: clientId,
      state_id: stateId,
      city_id: cityId,
      master_package_id: masterPackageId,
      booking_mode_type: masterPackageModeId,
      status,
      company_id,
      vehicle_type_id,
      from_date,
      to_date,
      weekdays,
      currency,
      created_by,
      searchValue,
      limit,
      offset
    } = req?.body || req.query || {};

    let sql = `
      SELECT 
          bs.id AS base_combination_id,
          bs.client_id,
          bs.master_package_mode_id,
          bs.master_package_id,
          df.id AS distance_fare_id,
          df.created_date AS date_cherck,
          df.base_vehicle_id AS checkkkkkkk,
          bs.week_days,
          bs.market_place,
          bs.status AS bs_status,
          bvt.base_vehicle_id,
          bvt.vehicle_type_id,
          bvt.vehicle_master_id,
          nc.night_rate_begins, 
          bs.ip,
          nc.night_rate_ends, 
          nc.night_rate_type, 
          nc.night_rate_value, 
          city.name AS creator_city,
          company_setup.site_title AS company_setup_name,
          master_city.id AS city_id,
          cdl.destination_city,
          cdl.id AS city_distance_id,
          cdl.distance_km AS distance_km,
          master_city.name AS city_name,
          master_city.state_name AS state_name,
          master_city.country_code AS country_code,
          destination_city.name AS destination_city_name,
          destination_city.state_name AS destination_state_name,
          destination_city.country_code AS destination_country_code,
          master_package.name AS package_name,
          master_package_mode.package_mode AS package_mode,
          CONCAT(vendor.first_name, ' ', vendor.last_name) AS vendor_name,
          CONCAT(client.first_name, ' ', client.last_name) AS client_name,
          master_vehicle_type.vehicle_type,
          master_currency.id AS currency_id,
          vmd.name AS vehicle_model,
          master_currency.country_name AS currency_city_name,
          master_currency.name AS currency_city_code,
          master_currency.symbol AS currency_city_symbol,
          oneway.city_distance_id,

          -- Rental fields (sample single row)
          lpf.local_pkg_fare_id,
          lpf.local_pkg_fare AS rental_fare_amount,
          lp.id AS rental_package_id,
          lp.name AS rental_package_name,
          lp.hrs AS rental_hours,
          lp.km AS rental_kms,

          -- Club all rental packages under one vehicle
          GROUP_CONCAT(
            CONCAT(
              lp.hrs, 'Hrs - ',
              lp.km, 'km : '
              ,
              lpf.local_pkg_fare
            )
            ORDER BY lp.hrs ASC
            SEPARATOR ' | '
          ) AS rental_slabs,

          dl.*,
          bs.created_date ,

          -- Creator info
          creator.id AS created_by_user_id,
          CONCAT(creator.first_name, ' ', creator.last_name) AS created_by_user_name,
          creator.email AS created_by_user_email,


          -- Base fare logic
          CASE 
              WHEN master_package.id = 1 THEN lpf.local_pkg_fare    -- Rental
              WHEN bs.master_package_mode_id = 1 THEN df.minimum_charge
              WHEN bs.master_package_mode_id = 2 THEN hf.minimum_charge
              WHEN bs.master_package_mode_id = 3 THEN dhf.minimum_charge
              WHEN bs.master_package_mode_id = 4 THEN dwf.minimum_charge
              ELSE NULL
          END AS base_fare,

          CASE 
              WHEN bs.master_package_mode_id = 1 THEN df.per_km_charge
              WHEN bs.master_package_mode_id = 3 THEN dhf.per_km_charge
              WHEN bs.master_package_mode_id = 4 THEN dwf.per_km_charge
              ELSE NULL
          END AS rate_per_km,
     CASE 
              WHEN bs.master_package_mode_id = 1 THEN df.minimum_distance
              WHEN bs.master_package_mode_id = 3 THEN dhf.minimum_distance
              WHEN bs.master_package_mode_id = 4 THEN dwf.minimum_distance
              ELSE NULL
          END AS minimum_distance,
           CASE 
              WHEN bs.master_package_mode_id = 1 THEN df.minimum_charge
              WHEN bs.master_package_mode_id = 2 THEN hf.minimum_charge
              WHEN bs.master_package_mode_id = 3 THEN dhf.minimum_charge
              WHEN bs.master_package_mode_id = 4 THEN dwf.minimum_charge
              ELSE NULL
          END AS minimum_charge,
          CASE 
              WHEN bs.master_package_mode_id = 2 THEN hf.minimum_hrs
              WHEN bs.master_package_mode_id = 3 THEN dhf.minimum_hrs
              ELSE NULL
          END AS min_hours,

          CASE 
              WHEN bs.master_package_mode_id = 4 THEN dwf.fees_per_minute
              ELSE NULL
          END AS waiting_rate_per_min,

          CASE 
              WHEN master_package.id = 1 THEN 'Rental Fare'
              WHEN bs.master_package_mode_id = 1 THEN 'Distance Fare'
              WHEN bs.master_package_mode_id = 2 THEN 'Hourly Fare'
              WHEN bs.master_package_mode_id = 3 THEN 'Distance Hourly Fare'
              WHEN bs.master_package_mode_id = 4 THEN 'Distance Waiting Fare'
              ELSE 'Unknown'
          END AS fare_type_description,

          CASE 
              WHEN bs.master_package_mode_id = 1 THEN df.date_from
              WHEN bs.master_package_mode_id = 2 THEN hf.date_from
              WHEN bs.master_package_mode_id = 3 THEN dhf.date_from
              WHEN bs.master_package_mode_id = 4 THEN dwf.date_from
              ELSE NULL
          END AS date_from,

          CASE 
              WHEN bs.master_package_mode_id = 1 THEN df.date_to
              WHEN bs.master_package_mode_id = 2 THEN hf.date_to
              WHEN bs.master_package_mode_id = 3 THEN dhf.date_to
              WHEN bs.master_package_mode_id = 4 THEN dwf.date_to
              ELSE NULL
          END AS date_to
      FROM base_vehicle_type bvt
      JOIN base_combination bs ON bs.id = bvt.base_comb_id
      LEFT JOIN dispatch_location dl ON bs.id = dl.base_comb_id
      LEFT JOIN oneway_city_route_package oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
      LEFT JOIN night_charge nc ON bvt.base_vehicle_id = nc.base_vehicle_id
      LEFT JOIN city_distance_list cdl ON oneway.city_distance_id = cdl.id
      LEFT JOIN company_setup ON bs.company_id = company_setup.id
      LEFT JOIN master_city ON bs.city_id = master_city.id
      LEFT JOIN master_city destination_city ON cdl.destination_city = destination_city.id
      LEFT JOIN master_package ON bs.master_package_id = master_package.id
      LEFT JOIN master_package_mode ON bs.master_package_mode_id = master_package_mode.id
      LEFT JOIN user vendor ON bs.vendor_id = vendor.id
      LEFT JOIN user client ON bs.client_id = client.id
      LEFT JOIN master_vehicle_type ON bvt.vehicle_type_id = master_vehicle_type.id
      LEFT JOIN master_currency ON bs.currency = master_currency.id

      -- Rental join
      LEFT JOIN local_package_fare lpf 
        ON bvt.base_vehicle_id = lpf.base_vehicle_id
       AND lpf.status = 1
      LEFT JOIN local_package lp 
        ON lpf.local_pkg_id = lp.id

      -- Other fare tables
      LEFT JOIN distance_fare df ON bvt.base_vehicle_id = df.base_vehicle_id
      LEFT JOIN hourly_fare hf ON bvt.base_vehicle_id = hf.base_vehicle_id
      LEFT JOIN distance_hour_fare dhf ON bvt.base_vehicle_id = dhf.base_vehicle_id
      LEFT JOIN distance_waiting_fare dwf ON bvt.base_vehicle_id = dwf.base_vehicle_id
      LEFT JOIN master_vehicle_model vmd ON vmd.id= bvt.vehicle_master_id 
      -- New join: who created the base_combination
      LEFT JOIN user creator ON bs.modified_by = creator.id
      LEFT JOIN master_city city ON city.id= creator.city
      WHERE 1=1 
        AND bs.status != '2'
    `;

    let filters = [];
    let replacements = {};

    if (base_combination_id) {
      filters.push(`bs.id = :base_combination_id`);
      replacements.base_combination_id = base_combination_id;
    }
    if (base_vehicle_id) {
      filters.push(`bvt.base_vehicle_id = :base_vehicle_id`);
      replacements.base_vehicle_id = base_vehicle_id;
    }
    if (company_id) {
      filters.push(`bs.company_id = :company_id`);
      replacements.company_id = company_id;
    }
    if (vendor_id) {
      filters.push(`bs.vendor_id = :vendor_id`);
      replacements.vendor_id = vendor_id;
    }
    if (clientId) {
      filters.push(`bs.client_id = :clientId`);
      replacements.clientId = clientId;
    }
    if (stateId) {
      filters.push(`bs.state_id = :stateId`);
      replacements.stateId = stateId;
    }
    if (cityId) {
      filters.push(`bs.city_id = :cityId`);
      replacements.cityId = cityId;
    }
    if (masterPackageId) {
      filters.push(`bs.master_package_id = :masterPackageId`);
      replacements.masterPackageId = masterPackageId;
    }
    if (masterPackageModeId) {
      filters.push(`bs.master_package_mode_id = :masterPackageModeId`);
      replacements.masterPackageModeId = masterPackageModeId;
    }
    if (status) {
      filters.push(`bs.status = :status`);
      replacements.status = status;
    }
    if (vehicle_type_id) {
      filters.push(`bvt.vehicle_type_id = :vehicle_type_id`);
      replacements.vehicle_type_id = vehicle_type_id;
    }
    if (currency) {
      filters.push(`bs.currency = :currency`);
      replacements.currency = currency;
    }
    if (created_by) {
      filters.push(`bs.created_by = :created_by`);
      replacements.created_by = created_by;
    }
    if (from_date && to_date) {
      filters.push(`(bs.date_from BETWEEN :from_date AND :to_date OR bs.date_to BETWEEN :from_date AND :to_date)`);
      replacements.from_date = from_date;
      replacements.to_date = to_date;
    }
    if (weekdays) {
      filters.push(`FIND_IN_SET(:weekdays, bs.week_days) > 0`);
      replacements.weekdays = weekdays;
    }

    if (filters.length > 0) {
      sql += " AND " + filters.join(" AND ");
    }

    if (searchValue?.trim()) {
      sql += ` AND (master_city.name LIKE :searchValue 
                 OR destination_city.name LIKE :searchValue 
                 OR master_package.name LIKE :searchValue)`;
      replacements.searchValue = `%${searchValue}%`;
    }

    // group by because of group_concat
    sql += ` GROUP BY bs.id`;

    sql += ` ORDER BY bs.id DESC`;

    if (limit !== undefined && offset !== undefined) {
      sql += ` LIMIT :limit OFFSET :offset`;
      replacements.limit = parseInt(limit);
      replacements.offset = parseInt(offset);
    }

    const fareData = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements,
    });

    return res.status(200).json({
      status: fareData.length > 0 ? "success" : "failed",
      msg: fareData.length > 0 ? "Records found" : "No Record Found",
      data: fareData,
      total: fareData.length,
    });
  } catch (error) {
    console.error("Error fetching fare list:", error);
    return res.status(500).json({
      status: "failed",
      msg: "Internal Server Error",
      error: error.message,
      data: [],
    });
  }
};





// export const getFareListData = async (req, res) => {
//   try {
//     const {
//       base_combination_id,
//       base_vehicle_id,
//       user_id: vendor_id,
//       client_id: clientId,
//       state_id: stateId,
//       city_id: cityId,
//       master_package_id: masterPackageId,
//       booking_mode_type: masterPackageModeId,
//       status,
//       company_id,
//       vehicle_type_id,
//       from_date,
//       to_date,
//       weekdays,
//       currency,
//       created_by,
//       searchValue,
//       limit,
//       offset
//     } = req?.body || req.query || {};

//     // Explicitly list all dispatch_location columns instead of using dl.*
// //     let sql = `SELECT 
// //         bs.id as base_combination_id,
// //         bs.client_id,
// //         bs.master_package_mode_id,
// //         bs.master_package_id,
// //         df.date_from,
// //         df.date_to,
// //         df.id as distance_fare_id,
// //         df.created_date as date_cherck,
// //         df.base_vehicle_id as checkkkkkkk,
// //         bs.week_days,
// //         bs.market_place,
// //         bs.status as bs_status,
// //         bvt.base_vehicle_id,
// //         bvt.vehicle_type_id,
// //         bvt.vehicle_master_id,
// //         nc.night_rate_begins, 
// //         nc.night_rate_ends, 
// //         nc.night_rate_type, 
// //         nc.night_rate_value, 
// //         company_setup.site_title as company_setup_name,
// //         master_city.id as city_id,
// //         cdl.destination_city,
// //         cdl.id as city_distance_id,
// //         cdl.distance_km as distance_km,
// //         master_city.name as city_name,
// //         master_city.state_name as state_name,
// //         master_city.country_code as country_code,
// //         destination_city.name as destination_city_name,
// //         destination_city.state_name as destination_state_name,
// //         destination_city.country_code as destination_country_code,
// //         master_package.name as package_name,
// //         master_package_mode.package_mode as package_mode,
// //         CONCAT(vendor.first_name, ' ', vendor.last_name) as vendor_name,
// //         CONCAT(client.first_name, ' ', client.last_name) as client_name,
// //         master_vehicle_type.vehicle_type,
// //         master_currency.id AS currency_id,
// //         master_currency.country_name AS currency_city_name,
// //         master_currency.name AS currency_city_code,
// //         master_currency.symbol AS currency_city_symbol,
// //         oneway.city_distance_id,
// //         lpf.local_pkg_fare_id,
// // lpf.local_pkg_fare AS rental_fare_amount,
// // lp.id AS rental_package_id,
// // lp.name AS rental_package_name,   -- e.g. "4Hrs - 40km"
// // lp.hrs AS rental_hours,
// // lp.km AS rental_kms,
// //        dl.*,
        
// //         -- Use CASE statements to handle different package modes
// //         CASE 
// //             WHEN bs.master_package_mode_id = 1 THEN df.minimum_charge
// //             WHEN bs.master_package_mode_id = 2 THEN hf.minimum_charge
// //             WHEN bs.master_package_mode_id = 3 THEN dhf.minimum_charge
// //             WHEN bs.master_package_mode_id = 4 THEN dwf.minimum_charge
// //             ELSE NULL
// //         END AS base_fare,
        
// //         CASE 
// //             WHEN bs.master_package_mode_id = 1 THEN df.per_km_charge
// //             WHEN bs.master_package_mode_id = 3 THEN dhf.per_km_charge
// //             WHEN bs.master_package_mode_id = 4 THEN dwf.per_km_charge
// //             ELSE NULL
// //         END AS rate_per_km,
        
// //         CASE 
// //             WHEN bs.master_package_mode_id = 2 THEN hf.minimum_hrs
// //             WHEN bs.master_package_mode_id = 3 THEN dhf.minimum_hrs
// //             ELSE NULL
// //         END AS min_hours,
        
// //         CASE 
// //             WHEN bs.master_package_mode_id = 4 THEN dwf.fees_per_minute
// //             ELSE NULL
// //         END AS waiting_rate_per_min,
        
// // CASE 
// //     WHEN master_package.id = 1 THEN 'Rental Fare'
// //     WHEN bs.master_package_mode_id = 1 THEN 'Distance Fare'
// //     WHEN bs.master_package_mode_id = 2 THEN 'Hourly Fare'
// //     WHEN bs.master_package_mode_id = 3 THEN 'Distance Hourly Fare'
// //     WHEN bs.master_package_mode_id = 4 THEN 'Distance Waiting Fare'
// //     ELSE 'Unknown'
// // END AS fare_type_description
// //     FROM base_combination bs
// //     LEFT JOIN base_vehicle_type bvt ON bs.id = bvt.base_comb_id
// //     LEFT JOIN dispatch_location dl ON bs.id = dl.base_comb_id
// //     LEFT JOIN oneway_city_route_package oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
// //     LEFT JOIN night_charge nc ON bvt.base_vehicle_id = nc.base_vehicle_id
// //     LEFT JOIN city_distance_list cdl ON oneway.city_distance_id = cdl.id
// //     LEFT JOIN company_setup ON bs.company_id = company_setup.id
// //     LEFT JOIN master_city ON bs.city_id = master_city.id
// //     LEFT JOIN master_city destination_city ON cdl.destination_city = destination_city.id
// //     LEFT JOIN master_package ON bs.master_package_id = master_package.id
// //     LEFT JOIN master_package_mode ON bs.master_package_mode_id = master_package_mode.id
// //     LEFT JOIN user vendor ON bs.vendor_id = vendor.id
// //     LEFT JOIN user client ON bs.client_id = client.id
// //     LEFT JOIN master_vehicle_type ON bvt.vehicle_type_id = master_vehicle_type.id
// //     LEFT JOIN master_currency ON bs.currency = master_currency.id
// // LEFT JOIN local_package_fare lpf 
// //   ON bvt.base_vehicle_id = lpf.base_vehicle_id
// // LEFT JOIN local_package lp 
// //   ON lpf.local_pkg_id = lp.id

// //     -- Join all fare tables regardless of package mode
// //     LEFT JOIN distance_fare df ON bvt.base_vehicle_id = df.base_vehicle_id
// //     LEFT JOIN hourly_fare hf ON bvt.base_vehicle_id = hf.base_vehicle_id
// //     LEFT JOIN distance_hour_fare dhf ON bvt.base_vehicle_id = dhf.base_vehicle_id
// //     LEFT JOIN distance_waiting_fare dwf ON bvt.base_vehicle_id = dwf.base_vehicle_id

// //     WHERE 1 = 1 
// //     AND bs.status != '2' 
// //     `;
// let sql =`SELECT 
//     bs.id AS base_combination_id,
//     bs.client_id,
//     bs.master_package_mode_id,
//     bs.master_package_id,
//     df.date_from,
//     df.date_to,
//     df.id AS distance_fare_id,
//     df.created_date AS date_cherck,
//     df.base_vehicle_id AS checkkkkkkk,
//     bs.week_days,
//     bs.market_place,
//     bs.status AS bs_status,
//     bvt.base_vehicle_id,
//     bvt.vehicle_type_id,
//     bvt.vehicle_master_id,
//     nc.night_rate_begins, 
//     nc.night_rate_ends, 
//     nc.night_rate_type, 
//     nc.night_rate_value, 
//     company_setup.site_title AS company_setup_name,
//     master_city.id AS city_id,
//     cdl.destination_city,
//     cdl.id AS city_distance_id,
//     cdl.distance_km AS distance_km,
//     master_city.name AS city_name,
//     master_city.state_name AS state_name,
//     master_city.country_code AS country_code,
//     destination_city.name AS destination_city_name,
//     destination_city.state_name AS destination_state_name,
//     destination_city.country_code AS destination_country_code,
//     master_package.name AS package_name,
//     master_package_mode.package_mode AS package_mode,
//     CONCAT(vendor.first_name, ' ', vendor.last_name) AS vendor_name,
//     CONCAT(client.first_name, ' ', client.last_name) AS client_name,
//     master_vehicle_type.vehicle_type,
//     master_currency.id AS currency_id,
//     master_currency.country_name AS currency_city_name,
//     master_currency.name AS currency_city_code,
//     master_currency.symbol AS currency_city_symbol,
//     oneway.city_distance_id,

//     -- Rental fields
//     lpf.local_pkg_fare_id,
//     lpf.local_pkg_fare AS rental_fare_amount,
//     lp.id AS rental_package_id,
//     lp.name AS rental_package_name,
//     lp.hrs AS rental_hours,
//     lp.km AS rental_kms,

//     dl.*,

//     -- Base fare logic
//     CASE 
//         WHEN master_package.id = 1 THEN lpf.local_pkg_fare    -- Rental
//         WHEN bs.master_package_mode_id = 1 THEN df.minimum_charge
//         WHEN bs.master_package_mode_id = 2 THEN hf.minimum_charge
//         WHEN bs.master_package_mode_id = 3 THEN dhf.minimum_charge
//         WHEN bs.master_package_mode_id = 4 THEN dwf.minimum_charge
//         ELSE NULL
//     END AS base_fare,

//     CASE 
//         WHEN bs.master_package_mode_id = 1 THEN df.per_km_charge
//         WHEN bs.master_package_mode_id = 3 THEN dhf.per_km_charge
//         WHEN bs.master_package_mode_id = 4 THEN dwf.per_km_charge
//         ELSE NULL
//     END AS rate_per_km,

//     CASE 
//         WHEN bs.master_package_mode_id = 2 THEN hf.minimum_hrs
//         WHEN bs.master_package_mode_id = 3 THEN dhf.minimum_hrs
//         ELSE NULL
//     END AS min_hours,

//     CASE 
//         WHEN bs.master_package_mode_id = 4 THEN dwf.fees_per_minute
//         ELSE NULL
//     END AS waiting_rate_per_min,

//     CASE 
//         WHEN master_package.id = 1 THEN 'Rental Fare'
//         WHEN bs.master_package_mode_id = 1 THEN 'Distance Fare'
//         WHEN bs.master_package_mode_id = 2 THEN 'Hourly Fare'
//         WHEN bs.master_package_mode_id = 3 THEN 'Distance Hourly Fare'
//         WHEN bs.master_package_mode_id = 4 THEN 'Distance Waiting Fare'
//         ELSE 'Unknown'
//     END AS fare_type_description

// FROM base_vehicle_type bvt
// JOIN base_combination bs ON bs.id = bvt.base_comb_id
// LEFT JOIN dispatch_location dl ON bs.id = dl.base_comb_id
// LEFT JOIN oneway_city_route_package oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
// LEFT JOIN night_charge nc ON bvt.base_vehicle_id = nc.base_vehicle_id
// LEFT JOIN city_distance_list cdl ON oneway.city_distance_id = cdl.id
// LEFT JOIN company_setup ON bs.company_id = company_setup.id
// LEFT JOIN master_city ON bs.city_id = master_city.id
// LEFT JOIN master_city destination_city ON cdl.destination_city = destination_city.id
// LEFT JOIN master_package ON bs.master_package_id = master_package.id
// LEFT JOIN master_package_mode ON bs.master_package_mode_id = master_package_mode.id
// LEFT JOIN user vendor ON bs.vendor_id = vendor.id
// LEFT JOIN user client ON bs.client_id = client.id
// LEFT JOIN master_vehicle_type ON bvt.vehicle_type_id = master_vehicle_type.id
// LEFT JOIN master_currency ON bs.currency = master_currency.id

// -- Rental join
// LEFT JOIN local_package_fare lpf 
//   ON bvt.base_vehicle_id = lpf.base_vehicle_id
// LEFT JOIN local_package lp 
//   ON lpf.local_pkg_id = lp.id

// -- All fare tables
// LEFT JOIN distance_fare df ON bvt.base_vehicle_id = df.base_vehicle_id
// LEFT JOIN hourly_fare hf ON bvt.base_vehicle_id = hf.base_vehicle_id
// LEFT JOIN distance_hour_fare dhf ON bvt.base_vehicle_id = dhf.base_vehicle_id
// LEFT JOIN distance_waiting_fare dwf ON bvt.base_vehicle_id = dwf.base_vehicle_id

// WHERE 1=1 
//   AND bs.status != '2'
// `
//     // AND bs.fare_type = 'NORMAL'

//     let filters = [];
//     let replacements = {};

//     // Add filters with parameterized queries to prevent SQL injection
//     if (base_combination_id) {
//       filters.push(`bs.id = :base_combination_id`);
//       replacements.base_combination_id = base_combination_id;
//     }
//     if (base_vehicle_id) {
//       filters.push(`bvt.base_vehicle_id = :base_vehicle_id`);
//       replacements.base_vehicle_id = base_vehicle_id;
//     }
//     if (company_id) {
//       filters.push(`bs.company_id = :company_id`);
//       replacements.company_id = company_id;
//     }
//     if (vendor_id) {
//       filters.push(`bs.vendor_id = :vendor_id`);
//       replacements.vendor_id = vendor_id;
//     }
//     if (clientId) {
//       filters.push(`bs.client_id = :clientId`);
//       replacements.clientId = clientId;
//     }
//     if (stateId) {
//       filters.push(`bs.state_id = :stateId`);
//       replacements.stateId = stateId;
//     }
//     if (cityId) {
//       filters.push(`bs.city_id = :cityId`);
//       replacements.cityId = cityId;
//     }
//     if (masterPackageId) {
//       filters.push(`bs.master_package_id = :masterPackageId`);
//       replacements.masterPackageId = masterPackageId;
//     }
//     if (masterPackageModeId) {
//       filters.push(`bs.master_package_mode_id = :masterPackageModeId`);
//       replacements.masterPackageModeId = masterPackageModeId;
//     }
//     if (status) {
//       filters.push(`bs.status = :status`);
//       replacements.status = status;
//     }
//     if (vehicle_type_id) {
//       filters.push(`bvt.vehicle_type_id = :vehicle_type_id`);
//       replacements.vehicle_type_id = vehicle_type_id;
//     }
//     if (currency) {
//       filters.push(`bs.currency = :currency`);
//       replacements.currency = currency;
//     }
//     if (created_by) {
//       filters.push(`bs.created_by = :created_by`);
//       replacements.created_by = created_by;
//     }

//     if (from_date && to_date) {
//       filters.push(`(bs.date_from BETWEEN :from_date AND :to_date OR bs.date_to BETWEEN :from_date AND :to_date)`);
//       replacements.from_date = from_date;
//       replacements.to_date = to_date;
//     }

//     if (weekdays) {
//       filters.push(`FIND_IN_SET(:weekdays, bs.week_days) > 0`);
//       replacements.weekdays = weekdays;
//     }

//     if (filters.length > 0) {
//       sql += ' AND ' + filters.join(' AND ');
//     }

//     if (searchValue) {
//       sql += ` AND (master_city.name LIKE :searchValue OR destination_city.name LIKE :searchValue OR master_package.name LIKE :searchValue)`;
//       replacements.searchValue = `%${searchValue}%`;
//     }

//     sql += ` ORDER BY bs.id DESC`;

//     if (limit !== undefined && offset !== undefined) {
//       sql += ` LIMIT :limit, :offset`;
//       replacements.limit = parseInt(limit);
//       replacements.offset = parseInt(offset);
//     }

//     const fareData = await sequelize.query(sql, { 
//       type: QueryTypes.SELECT,
//       replacements: replacements
//     });

//     if (fareData.length > 0) {
//       return res.status(200).json({
//         status: 'success',
//         data: fareData,
//         total: fareData.length
//       });
//     } else {
//       return res.status(404).json({
//         status: 'failed',
//         msg: 'No Record Found',
//         data: [],
//         total: 0
//       });
//     }

//   } catch (error) {
//     console.error('Error fetching fare list:', error);
//     return res.status(500).json({
//       status: 'failed',
//       msg: 'Internal Server Error',
//       error: error.message,
//       data: []
//     });
//   }
// };

export const getFareListDataFilterCount = async (req, res) => {
  try {
    const {
      base_combination_id,
      base_vehicle_id,
      user_id: vendor_id,
      client_id: clientId,
      state_id: stateId,
      city_id: cityId,
      master_package_id: masterPackageId,
      master_package_mode_id: masterPackageModeId,
      status,
      company_id,
      vehicle_type_id,
      from_date,
      to_date,
      weekdays,
      currency,
      created_by,
      searchValue
    } = req.body;

    let sql = `
      SELECT COUNT(*) AS total_count
      FROM base_combination AS bs
      LEFT JOIN base_vehicle_type AS bvt ON bs.id = bvt.base_comb_id
      LEFT JOIN dispatch_location dl ON bs.id = dl.base_comb_id
      LEFT JOIN oneway_city_route_package AS oneway ON bvt.base_vehicle_id = oneway.base_vehicle_id
      LEFT JOIN city_distance_list AS cdl ON oneway.city_distance_id = cdl.id
      LEFT JOIN company_setup ON bs.company_id = company_setup.id
      LEFT JOIN master_city ON bs.city_id = master_city.id
      LEFT JOIN master_city AS destination_city ON cdl.destination_city = destination_city.id
      LEFT JOIN master_package ON bs.master_package_id = master_package.id
      LEFT JOIN master_package_mode ON bs.master_package_mode_id = master_package_mode.id
      LEFT JOIN user AS vendor ON bs.vendor_id = vendor.id
      LEFT JOIN user AS client ON bs.client_id = client.id
      LEFT JOIN master_vehicle_type ON bvt.vehicle_type_id = master_vehicle_type.id
      LEFT JOIN master_currency ON bs.currency = master_currency.id
      WHERE 1=1
        AND bs.status != '2'
        AND bs.fare_type = 'NORMAL'
    `;

    const conditions = [];

    if (base_combination_id) conditions.push(`bs.id = '${base_combination_id}'`);
    if (base_vehicle_id) conditions.push(`bvt.base_vehicle_id = '${base_vehicle_id}'`);
    if (company_id) conditions.push(`bs.company_id = '${company_id}'`);
    if (vendor_id) conditions.push(`bs.vendor_id = '${vendor_id}'`);
    if (clientId) conditions.push(`bs.client_id = '${clientId}'`);
    if (stateId) conditions.push(`bs.state_id = '${stateId}'`);
    if (cityId) conditions.push(`bs.city_id = '${cityId}'`);
    if (masterPackageId) conditions.push(`bs.master_package_id = '${masterPackageId}'`);
    if (masterPackageModeId) conditions.push(`bs.master_package_mode_id = '${masterPackageModeId}'`);
    if (status) conditions.push(`bs.status = '${status}'`);
    if (vehicle_type_id) conditions.push(`bvt.vehicle_type_id = '${vehicle_type_id}'`);
    if (currency) conditions.push(`bs.currency = '${currency}'`);
    if (created_by) conditions.push(`bs.created_by = '${created_by}'`);
    if (from_date && to_date) {
      conditions.push(`(bs.date_from BETWEEN '${from_date}' AND '${to_date}' OR bs.date_to BETWEEN '${from_date}' AND '${to_date}')`);
    }
    if (weekdays) conditions.push(`bs.week_days IN ('${weekdays}')`);
    if (searchValue) sql += ` ${searchValue}`; // searchValue should be well-validated before use

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }

    const result = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 'failed',
        msg: 'No Record Found',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error in getFareListDataFilterCount:', error);
    return res.status(500).json({
      status: 'failed',
      msg: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getVehicleName = async (req, res) => {
  try {
    // Try getting ID from both body and query
    const { id } = req.body || req.query;

    if (!id) {
      return res.status(400).json({
        status: 'failed',
        message: 'No cab id provided!',
      });
    }

    const sql = `
      SELECT vm.vehicle_no,
            mvm.name
      FROM vehicle_master vm
      LEFT JOIN master_vehicle_model mvm ON mvm.id = vm.id  
      WHERE vm.id = :id OR vm.vehicle_master_id = :id 
    `;

    const result = await sequelize.query(sql, {
      replacements: { id },
      type: QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Get vehicle name successfully',
        data: result[0],
      });
    } else {
      return res.status(404).json({
        status: 'failed',
        message: 'No Record Found for the provided ID!',
      });
    }
  } catch (error) {
    console.error('Error fetching vehicle name:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


async function getFareSettingDetail(user_id) {
  try {
    const whereClause = { status: '1' };
    if (user_id !== undefined && user_id !== '') {
      whereClause.user_id = user_id;
    }

    const result = await UserBasicFareSetting.findOne({ where: whereClause });

    if (result) {
      return { status: 'success', data: result };
    } else {
      return { status: 'failed', message: 'No record found' };
    }
  } catch (err) {
    console.error('Sequelize error:', err);
    throw err;
  }
}


async function getUserExtras(user_id, booking_type) {
  try {
    const whereClause = { status: 1 };

    if (user_id !== undefined && user_id !== '') {
      whereClause.user_id = user_id;
    }

    if (booking_type !== undefined && booking_type !== '') {
      whereClause.booking_type = booking_type;
    }

    const result = await UserExtras.findAll({ where: whereClause });
    console.log({result})
    if (result.length > 0) {
      return { status: 'success', data: result };
    } else {
      return { status: 'failed', message: 'No record found' };
    }
  } catch (err) {
    console.error('Sequelize error:', err);
    throw err;
  }
}


export const sequentialgetallfare = async  (req)=> {
        var user_id = req.user_id;
        var booking_type = req.booking_type;
        var vehicle_type = req.vehicle_type;
        var master_booking_type_id = req.master_booking_type_id;
        console.log("function",{user_id, booking_type, vehicle_type, master_booking_type_id})
        var status = 1;
        var usertaxdetails = await getUserTaxDetail({user_id, booking_type, master_booking_type_id, status},null ,true);
        usertaxdetails = usertaxdetails;

        var faresettingdetails = await getFareSettingDetail(user_id);
        faresettingdetails = faresettingdetails.data;

        var userNightChargeData = await getUserNightCharge({user_id, booking_type, status},null,true);
        userNightChargeData = userNightChargeData.data;

        var getusercancellation = await getUserCancellationFare({user_id, booking_type, master_booking_type_id, vehicle_type});
        getusercancellation = getusercancellation;
console.log({getusercancellation})
        var getuserwaitingchargeResp = await getUserWaitingCharge({user_id, booking_type},null,true);
        getuserwaitingchargeResp = (getuserwaitingchargeResp.status == 'success') ? getuserwaitingchargeResp.data : '';

        var getuserpremiumsfareResp = await getUserPremiumsFare({user_id, booking_type},null,true);
        getuserpremiumsfareResp = (getuserpremiumsfareResp.status == 'success') ? getuserpremiumsfareResp.data : '';

        var getuserpeaktimechargeResp = await getUserPeakTimeCharge({user_id, booking_type},null,true);
        getuserpeaktimechargeResp = (getuserpeaktimechargeResp.status == 'success') ? getuserpeaktimechargeResp.data : '';

        var getuserextrachargeResp = await getUserExtras(user_id, booking_type);
        getuserextrachargeResp = (getuserextrachargeResp.status == 'success') ? getuserextrachargeResp.data : '';

        var getusercompanyshareResp = await getUserCompanyShare({user_id, booking_type},null,true);
        getusercompanyshareResp = (getusercompanyshareResp.status == 'success') ? getusercompanyshareResp.data : '';

        return {
            'userTaxDetailData': usertaxdetails,
            'userFareSettingData': faresettingdetails,
            'userNightChargeData': userNightChargeData,
            'userCancellationfareData': getusercancellation,
            'userWaitingChargeData': getuserwaitingchargeResp,
            'userPremiumsFareData': getuserpremiumsfareResp,
            'userPeakTimeChargeData': getuserpeaktimechargeResp,
            'userExtrasChargeData': getuserextrachargeResp,
            'userCompanyShareData': getusercompanyshareResp
        }



    };




export const getPackageMode = async (req, res) => {
  try {
    const {
      city_id,
      state_id,
      country_id,
      booking_type,   // maps to ubtm.master_package_id
      vehicle_type,   // maps to ubtm.vehicle_type
    } = req.body || req.query || {};
console.log(req.body, req.query,)
    // Build replacements for safe parameter binding
    const replacements = {
      city_id: city_id || null,
      state_id: state_id || null,
      country_id: country_id || null,
      booking_type: booking_type || null,
      vehicle_type: vehicle_type || null,
    };

    const sqlQuery = `
      WITH city_level AS (
          SELECT ubtm.*, mpm.package_mode,
                 'city' AS source
          FROM user_booking_type_mapping AS ubtm
          LEFT JOIN master_package_mode mpm ON ubtm.master_package_mode_id = mpm.id
          WHERE mapping_category = 3
            AND (:city_id IS NULL OR ubtm.city_id = :city_id)
            AND (:booking_type IS NULL OR ubtm.master_package_id = :booking_type)
            AND ((:vehicle_type IS NULL AND ubtm.vehicle_type IS NULL) OR ubtm.vehicle_type = :vehicle_type)
      ),
      state_level AS (
          SELECT ubtm.*, mpm.package_mode,
                 'state' AS source
          FROM user_booking_type_mapping AS ubtm
          LEFT JOIN master_package_mode mpm ON ubtm.master_package_mode_id = mpm.id
          WHERE mapping_category = 2
            AND (:state_id IS NULL OR ubtm.state_id = :state_id)
            AND ubtm.city_id IS NULL
            AND ubtm.country_id IS NULL
            AND (:booking_type IS NULL OR ubtm.master_package_id = :booking_type)
            AND ((:vehicle_type IS NULL AND ubtm.vehicle_type IS NULL) OR ubtm.vehicle_type = :vehicle_type)
      ),
      country_level AS (
          SELECT ubtm.*, mpm.package_mode,
                 'country' AS source
          FROM user_booking_type_mapping AS ubtm
          LEFT JOIN master_package_mode mpm ON ubtm.master_package_mode_id = mpm.id
          WHERE mapping_category = 1
            AND (:country_id IS NULL OR ubtm.country_id = :country_id)
            AND ubtm.city_id IS NULL
            AND ubtm.state_id IS NULL
            AND (:booking_type IS NULL OR ubtm.master_package_id = :booking_type)
            AND ((:vehicle_type IS NULL AND ubtm.vehicle_type IS NULL) OR ubtm.vehicle_type = :vehicle_type)
      )

      SELECT * FROM city_level
      UNION ALL
      SELECT * FROM state_level
      WHERE NOT EXISTS (SELECT 1 FROM city_level)
      UNION ALL
      SELECT * FROM country_level
      WHERE NOT EXISTS (SELECT 1 FROM city_level)
        AND NOT EXISTS (SELECT 1 FROM state_level)
      ORDER BY 
        CASE 
          WHEN source = 'city' THEN 1
          WHEN source = 'state' THEN 2
          WHEN source = 'country' THEN 3
        END ASC,
        master_package_mode_id ASC
    `;

    const result = await sequelize.query(sqlQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return res.status(200).json({
        status: "success",
        count: result.length,
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        error: "No Record Found",
      });
    }
  } catch (err) {
    console.error("Error in getPackageMode:", err);
    return res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};


export const addbasecombination = async (req) => {
  let { master_package_id, type_of_dispatch } = req;

  // Business rules
  if ([1, 4, 7].includes(master_package_id) && type_of_dispatch == 1) {
    type_of_dispatch = 3;
  }

  // Prepare insert values
  const insertValues = {
    company_id: req.company_id,
    vendor_id: req.vendor_id,
    client_id: req.client_id,
    country_id: req.country_id,
    state_id: req.state_id,
    city_id: req.city_id,
    master_package_id: req.master_package_id,
    master_package_mode_id: req.master_package_mode_id,
    market_place: req.market_place,
    created_date: Date.now(),
    created_by: req.created_by,
    status: "1",
    ip: req.ip,
  };

  // Remove undefined or empty fields
  Object.keys(insertValues).forEach((key) => {
    if (insertValues[key] === undefined || insertValues[key] === "") {
      delete insertValues[key];
    }
  });

  const baseComb = await BaseCombination.create(insertValues);

  // Mimic original response structure { insertId: ... }
  // console.log({lastInsertId:baseComb.id })
  return { insertId: baseComb.id };
};

export const addDispatchLocation = async (req) => {
  const dispatchValue = {
    user_id: req.vendor_id,
    base_comb_id: req.lastInsertId, // coming from addbasecombination
    type_of_dispatch: req.type_of_dispatch,
    garage_type: req.garage_type,
    address: req.address,
    city: req.city,
    pincode: req.pin_code,
    latitude: req.latitude||"",
    longitude: req.longitude||"",
    created_date: Date.now(),
    created_by: req?.user?.id||"",
    ip: req.ip||"",
  };

  // Clean undefined/empty fields
  // Object.keys(dispatchValue).forEach((key) => {
  //   if (dispatchValue[key] === undefined || dispatchValue[key] === "") {
  //     delete dispatchValue[key];
  //   }
  // });

  // Insert with Sequelize
  const result = await DispatchLocation.create(dispatchValue);

  // Mimic old return structure
  return { insertId: result.dispatch_location_id };
};

export const addOnewayRouteCity = async (req) => {
  const insertonewayValues = {
    base_vehicle_id: req.base_vehicle_id,
    city_distance_id: req.city_distance_id,
    created_date: req.created_date,
    created_by: req.created_by,
  };

  // Clean undefined/empty values
  Object.keys(insertonewayValues).forEach((key) => {
    if (insertonewayValues[key] === undefined || insertonewayValues[key] === "") {
      delete insertonewayValues[key];
    }
  });

  // Insert with Sequelize
  const result = await OnewayCityRoutePackage.create(insertonewayValues);

  // Mimic old response
  return { insertId: result.route_id };
};
export const sequentialAddFare = async (req, res) => {
  try {
    console.log("sequentialAddFare called with:", req.user.id);
    let base_vehicle_ids = [];
    let created_date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    // 1. Add City Pages
    const citypages = await addcityPages(req.body);

    // 2. Add Base Combination
    const basecombresp = await addbasecombination(req.body);
    req.body.created_date = created_date;
    req.body.lastInsertId = basecombresp.insertId;
    const lastInsertId = basecombresp.insertId;

    // 3. Update Fare Accepted Status
    await updateFareAcceptedStatus(req);

    // 4. Add Base Vehicle Type
    const basevehicleResp = await addBaseVehicleType(req.body);
    let basevehicleinsertId;
    for (let key in basevehicleResp) {
      basevehicleinsertId = basevehicleResp[key].base_vehicle_id;
      base_vehicle_ids.push(basevehicleinsertId);
    }
    req.body.base_vehicle_id = basevehicleinsertId;

    // 5. Add Dispatch Location
    await addDispatchLocation(req.body);

    // 6. Add Oneway Route City if master_package_id == 5
    if (req.body.master_package_id == "5") {
      await addOnewayRouteCity(req.body);
    }

    // 7. Prepare Response
    const responsedata = {
      message: "Fare Added Successfully",
      fare_id: lastInsertId,
      base_vehicle_id: req.body.base_vehicle_id,
      booking_type:req.body.master_package_id,
      code: 200,
      status: "success",
    };

    return res.json(responsedata);
  } catch (error) {
    console.log({error})
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      code: 500,
      status: "error",
    });
  }
};

export const updatefareStatus = async (req, res) => {
  const { status, id } = req.body;
  const userId = req?.user?.id ?? 0;
console.log({status})
  try {
    const updatedCount = await BaseCombination.update(
      { status, modified_by: userId },
      { where: { id } }
    );

    if (updatedCount > 0) {
      return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
        updatedRows: updatedCount,
      });
    } else {
      return errorResponse(res, MESSAGES.GENERAL.NO_DATA_FOUND);
    }
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const disableExpiredFares = async () => {
  try {
    const currentDate = new Date();

    const [updatedCount] = await BaseCombination.update(
      { status: '2' }, // Set status to '2' (disabled)
      {
        where: {
          date_to: {
            [Op.lt]: currentDate, // date_to is less than current date
          },
          status: {
            [Op.ne]: '2', // Only update if status is not already '2'
          },
        },
      }
    );

    console.log(`Disabled ${updatedCount} expired fares.`);
  } catch (error) {
    console.error('Error disabling expired fares:', error);
  }
};