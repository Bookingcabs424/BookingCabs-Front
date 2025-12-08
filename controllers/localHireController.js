import { MESSAGES, STATUS_CODE } from "../constants/const.js";
import { successResponse, errorResponse } from "../utils/response.js";
import sequelize from "../config/clientDbManager.js"; // Assuming this exports 'sequelize'
import { convertToMinutes } from "./fareCalculation.js";

export const getBookingInfo = async (bookingId, res) => {
  if (!bookingId) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      MESSAGES.GENERAL.MANDATORY_FIELD,
      STATUS_CODE.NOT_FOUND
    );
  }

  try {
    const [result] = await sequelize.query(`CALL wp_booking_info(:bookingId)`, {
      replacements: { bookingId },
    });

    if (result && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};
export const getPackageFareByPackageId = async (
  base_vehicle_id,
  local_pkg_id
) => {
  if (!base_vehicle_id || !local_pkg_id) {
    throw new Error(
      "Mandatory fields missing: base_vehicle_id or local_pkg_id"
    );
  }

  try {
    const results = await sequelize.query(
      `
        SELECT 
          lp.id AS local_pkg_id, 
          mpm.id AS package_mode_id, 
          mpm.package_mode,
          lpf.local_pkg_fare AS price, 
          lpf.local_pkg_fare_id AS local_package_id, 
          lp.name, 
          lp.hrs, 
          lp.km 
        FROM local_package AS lp 
        LEFT JOIN local_package_fare AS lpf ON lp.id = lpf.local_pkg_id 
        LEFT JOIN master_package_mode AS mpm ON lp.booking_mode = mpm.id 
        LEFT JOIN base_vehicle_type AS bvt ON lpf.base_vehicle_id = bvt.base_vehicle_id 
        LEFT JOIN base_combination AS bc ON bvt.base_comb_id = bc.id
        WHERE lpf.base_vehicle_id = :base_vehicle_id 
          AND lpf.local_pkg_id = :local_pkg_id 
          AND lp.status = 1
        `,
      {
        replacements: { base_vehicle_id, local_pkg_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return results&& results.length > 0 ? results[0] : null;
  } catch (error) {
    throw error;
  }
};

export const convertTime = async (time) => {
  var seconds = time * 3600;
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = seconds - h * 3600 - m * 60;
  var val = h + ":" + m + ":" + s;
  return val;
};

export const getFareByPackageModeId = async (packageModeId, baseVehicleId) => {
  if (!packageModeId || !baseVehicleId) {
    // return errorResponse(
    //   res,
    //   MESSAGES.GENERAL.MANDATORY_FIELD,
    //   MESSAGES.GENERAL.MANDATORY_FIELD,
    //   STATUS_CODE.NOT_FOUND
    // );
 throw new Error('Mandatory fields missing: packageModeId or baseVehicleId');
  }

  try {
    const [result] = await sequelize.query(
      `CALL wp_get_fare_mode(:packageModeId,:baseVehicleId)`,
      {
        replacements: { packageModeId, baseVehicleId },
      }
    );
console.log({result})
    if (result ) {
      return result
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
};

// export const getFareCalculation = async (param, fareData) => {
//   let data = {};
//   let {
//     master_package_type,
//     master_package_mode_id,
//     base_vehicle_id,
//     minimum_charge,
//     ignore_hrs,
//     ignore_km,
//     status,
//     distance,
//     total_days,
//     markupData,
//     duration,
//   } = param;
//   let { per_km_charge, per_hr_charge, minimum_distance, minimum_hrs } =
//     fareData;
// console.log(master_package_mode_id,"masterhu",status)
//   let markupPrice = 0,
//     minimumCharge,
//     estimatedPrice;

//   if (status == 1) {
//     if (master_package_mode_id == 1) {
//       ignore_hrs = 0;
//       ignore_km = minimum_distance ? minimum_distance : 0;
//       minimumCharge = fareData.minimum_charge ? fareData.minimum_charge : 0;
//     } else if (master_package_mode_id == 2) {
//       ignore_hrs = minimum_hrs ? minimum_hrs : 0;
//       ignore_km = 0;
//       minimumCharge = fareData.minimum_charge ? fareData.minimum_charge : 0;
//     } else if (master_package_mode_id == 3) {
//       ignore_hrs = minimum_hrs ? minimum_hrs : 0;
//       ignore_km = minimum_distance ? minimum_distance : 0;
//       minimumCharge = fareData.minimum_charge ? fareData.minimum_charge : 0;
//     } else if (master_package_mode_id == 4) {
//       ignore_hrs = 0;
//       ignore_km = minimum_distance ? minimum_distance : 0;
//       minimumCharge = fareData.minimum_charge ? fareData.minimum_charge : 0;
//     }
//   }

//   if (master_package_type == 4) {
//     ignore_km = ignore_km * total_days;
//     minimumCharge = minimumCharge * total_days;
//   }

//   if (master_package_mode_id == 1) {
//     let travel_hrs = ignore_hrs;
//     if (distance > ignore_km) {
//       let extraKM = distance - ignore_km;
//       let extraFare = extraKM * (per_km_charge ? per_km_charge : 0);
//       estimatedPrice = Number(extraFare) + Number(minimumCharge);
//     } else {
//       estimatedPrice = minimumCharge;
//     }
//     data.per_km_charge = per_km_charge ? per_km_charge : 0;
//     data.min_distance = ignore_km;
//     data.minimum_charge = minimumCharge;
//   } else if (master_package_mode_id == 2) {
//     let totalMint = parseInt(duration);
//     if (totalMint > ignore_hrs) {
//       let hourlyRate = (totalMint - ignore_hrs) * 60;
//       let rate_per_min = (per_hr_charge ? per_hr_charge : 0) / 60;
//       estimatedPrice = hourlyRate * rate_per_min;
//     } else {
//       estimatedPrice = minimumCharge;
//     }
//     estimatedPrice = Number(estimatedPrice) + Number(minimumCharge);

//     data.per_km_charge = 0;
//     data.per_hr_charge = per_hr_charge ? per_hr_charge : 0;
//     data.min_hour = ignore_hrs;
//     data.min_distance = ignore_km;
//     data.minimum_charge = minimumCharge;
//   } else if (master_package_mode_id == 3) {
//     let travel_hrs = parseInt(duration);
//     let distanceRate, hourlyRate;
//     if (distance < ignore_km) {
//       distanceRate = 0;
//     } else {
//       distanceRate =
//         (distance - ignore_km) * (per_km_charge ? per_km_charge : 0);
//     }
//     console.log({distanceRate})
// let rate_per_min;
//     if (travel_hrs < ignore_hrs) {
//       hourlyRate = 0;
//     } else {
//       console.log({per_hr_charge})
//       hourlyRate = (travel_hrs - ignore_hrs) * 60;
//       rate_per_min = per_hr_charge ? per_hr_charge : 0 / 60;
//       hourlyRate = hourlyRate * rate_per_min;
//     }

//     estimatedPrice =
//       Number(distanceRate) + Number(hourlyRate) + Number(minimumCharge);

//     data.min_distance = ignore_km;
//     data.minimum_charge = minimumCharge;
//     data.per_km_charge = per_km_charge ? per_km_charge : 0;
//     data.per_hr_charge = per_hr_charge ? per_hr_charge : 0;
//   } else if (master_package_mode_id == 4) {
//     if (distance > ignore_km) {
//       let extraKm = Number(distance) - Number(ignore_km);
//       let extraFare = extraKm * per_km_charge ? per_km_charge : 0;

//       estimatedPrice = Number(extraFare) + Number(minimumCharge);
//     } else {
//       estimatedPrice = minimumCharge;
//     }

//     data.per_km_charge = per_km_charge ? per_km_charge : 0;
//     data.per_hr_charge = per_hr_charge ? per_hr_charge : 0;
//     data.min_distance = ignore_km;
//     data.minimum_charge = minimumCharge;
//   }
//   data.totalbill = estimatedPrice;
//   data.min_pkg_hrs = ignore_hrs;
//   data.min_pkg_km = ignore_km;
//   data.markup_price = markupPrice;
//   return data;
// };

export const getFareCalculation=(param, fareData)=> {
        console.log({param});
        console.log({fareData}); //return true;

        return new Promise((resolve, reject) => {            
            var datam1 = {};
            var permntavr = 40 / 60;
            var markupPrice = 0;             // This markup price will be calculate on base fare//
            var markupData = param.markupData;
            var distance = param.distance;
            var duration = param.duration;
            var packagemodeid = param.master_package_mode_id;
            var status = param.status;
            var ignore_hrs = param.ignore_hrs;
            var ignore_km = param.ignore_km;
            if (param.master_package_type == 1) {
                var ignore_km = param.ignore_km;

            } else {
                var ignore_km = fareData.minimum_distance;
            }
            var minimumCharge = param?.minimumCharge||fareData?.minimumCharge;
            var master_package_type = param.master_package_type;
            var total_days = param.total_days;

            if (status == 1) {
                if (packagemodeid == 1) {
                    ignore_hrs = 0;
                    ignore_km = (typeof fareData.minimum_distance !== 'undefined') ? fareData.minimum_distance : 0;
                    minimumCharge = (typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
                } else if (packagemodeid == 2) {
                    ignore_hrs = (typeof fareData.minimum_hrs !== 'undefined') ? fareData.minimum_hrs : 0;
                    ignore_km = 0;
                    minimumCharge = (typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
                } else if (packagemodeid == 3) {
                    ignore_hrs = (typeof fareData.minimum_hrs !== 'undefined') ? fareData.minimum_hrs : 0;
                    ignore_km = (typeof fareData.minimum_distance !== 'undefined') ? fareData.minimum_distance : 0;
                    minimumCharge = (typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
                } else if (packagemodeid == 4) {
                    ignore_hrs = 0;
                    ignore_km = (typeof fareData.minimum_distance !== 'undefined') ? fareData.minimum_distance : 0;
                    minimumCharge = (typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
                }
            }

            if (master_package_type == "4") {
                ignore_km = ignore_km * total_days;
                minimumCharge = minimumCharge * total_days;
            }

            //console.log(distance);

            if (packagemodeid == 1) {
                //console.log(ignore_km);
                //console.log(distance); return true;

                var distance = distance;       // This will come from local package //

                //var ignore_hrs = 0;
                var travel_hrs = ignore_hrs;
                //var ignore_km = (typeof fareData.minimum_distance !== 'undefined') ? fareData.minimum_distance : 0;
                //var minimumCharge = (typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;

                if (distance > ignore_km) {
                    var ExtraKM = distance - ignore_km;
                    var ExtraFare = ExtraKM * ((typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0);
                    var EstimatedPrice = Number(ExtraFare) + Number(minimumCharge);
                } else {
                    var ExtraKM = 0;
                    var EstimatedPrice = minimumCharge;
                }

                datam1.per_km_charge = (typeof fareData.per_km_charge) ? fareData.per_km_charge : 0;
                //datam1.min_distance = ignore_km;
                if (distance > ignore_km) {
                    datam1.min_distance = distance;
                } else {
                    datam1.min_distance = ignore_km;
                }
                datam1.minimum_charge = minimumCharge;

            } else if (packagemodeid == 2) {      // Hourly mode Fare Calculation //
                var totalmint = parseInt(duration);
                var ignore_hrs = ignore_hrs;
                var ignore_km = 0;
                var minimumCharge = minimumCharge;//(typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;

                var ignore_first_hours = ignore_hrs * 60; //die;
                if (totalmint > ignore_hrs) {
                    var hourlyRate = (totalmint - ignore_hrs) * 60;

                    var rate_per_min = ((typeof fareData.per_hr_charge) ? fareData.per_hr_charge : 0) / 60;
                    var EstimatedPrice = hourlyRate * rate_per_min;

                } else {
                    var EstimatedPrice = minimumCharge;
                }
                //// In Case per Hourly Charge 120 Rs and If car is running 40 Km Per hrs then per km charge is 120/40 is 3 Rs per Km Charge
                var EstimatedPrice = Number(EstimatedPrice) + Number(minimumCharge);

                datam1.per_km_charge = 0;
                datam1.per_hr_charge = (typeof fareData.per_hr_charge !== 'undefined') ? fareData.per_hr_charge : 0;
                datam1.min_hour = ignore_hrs;
                datam1.min_distance = ignore_km;//ignore_hrs * 40;
                datam1.minimum_charge = minimumCharge;
                var ExtraKM = 0;

            } else if (packagemodeid == 3) {  
                console.log("thisObjectRun")
                // Distance + hour Mode        
                var ignore_hrs = ignore_hrs; //(typeof fareData.minimum_hrs !== 'undefined') ? fareData.minimum_hrs : 0;
                var ignore_hrs_key = Number(ignore_hrs) * 60;
                var ignore_km = ignore_km;//(typeof fareData.minimum_distance !== 'undefined') ? fareData.minimum_distance : 0;
                var minimumCharge = minimumCharge;//(typeof fareData.minimum_charge !== 'undefined') ? fareData.minimum_charge : 0;
                //var travel_hrs = parseInt(duration);        //come from travell distance hour//
                if(duration!=0){
                    var travel_hrs = convertToMinutes(duration)
                }else{
                    var travel_hrs = parseInt(duration);
                }
                
                if (distance < ignore_km) {
                    var distanceRate = 0;
                    var ExtraKM = 0;
                } else {
                    var ExtraKM = Number(distance) - Number(ignore_km);
                    console.log({distance},{ignore_km})
                    console.log({ExtraKM})
                    var distanceRate = ExtraKM * ((typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0);
                }
                if (travel_hrs < ignore_hrs_key) {
                    var hourlyRate = 0;
                } else {
                    //var hourlyRate = (travel_hrs - ignore_hrs) * 60;
                    //var rate_per_min = ((typeof fareData.per_hr_charge) ? fareData.per_hr_charge : 0) / 60;
                    var hourlyRate = Math.ceil((travel_hrs - ignore_hrs_key) / 60);
                    var rate_per_min = ((typeof fareData.per_hr_charge) ? fareData.per_hr_charge : 0);
                    var hourlyRate = hourlyRate * rate_per_min;
                }
                var EstimatedPrice = Number(distanceRate) + Number(hourlyRate) + Number(minimumCharge);
console.log(Number(distanceRate) , Number(hourlyRate) , Number(minimumCharge),"jaadu")
                //datam1.min_distance = ignore_km;
                if (distance > ignore_km) {
                    datam1.min_distance = distance;
                } else {
                    datam1.min_distance = ignore_km;
                }
                datam1.minimum_charge = minimumCharge;
                datam1.per_km_charge = (typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0;
                datam1.per_hr_charge = (typeof fareData.per_hr_charge !== 'undefined') ? fareData.per_hr_charge : 0;
                //var ExtraKM = 0;
                //console.log(datam1);

            } else if (packagemodeid == 4) {        //Distance + Waiting //
                //console.log(distance); //return false;
                var ignore_hrs = 0;
                var ignore_km = ignore_km;//(typeof fareData.minimum_distance) ? fareData.minimum_distance : 0;
                var minimumCharge = minimumCharge;//(typeof fareData.minimum_charge) ? fareData.minimum_charge : 0;
                //console.log(minimumCharge);return false;
                if (distance > ignore_km) {
                    var ExtraKM = Number(distance) - Number(ignore_km);
                    var ExtraFare = ExtraKM * ((typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0);
                    var EstimatedPrice = Number(ExtraFare) + Number(minimumCharge);
                } else {
                    var ExtraKM = 0;
                    var EstimatedPrice = minimumCharge;
                }

                datam1.per_km_charge = (typeof fareData.per_km_charge !== 'undefined') ? fareData.per_km_charge : 0;
                datam1.per_hr_charge = (typeof fareData.per_hr_charge !== 'undefined') ? fareData.per_hr_charge : 0;
                //datam1.min_distance = ignore_km;
                if (distance > ignore_km) {
                    datam1.min_distance = distance;
                } else {
                    datam1.min_distance = ignore_km;
                }
                datam1.minimum_charge = minimumCharge;
                //console.log(datam1);return false;
            }
            console.log({ExtraFare});
            datam1.totalbill = EstimatedPrice;
            datam1.min_pkg_hrs = ignore_hrs;
            datam1.min_pkg_km = ignore_km;
            datam1.markup_price = markupPrice;
            datam1.extraKm = ExtraKM;

            //console.log(datam1); return true;
            resolve(datam1);
        });
    }

 
export const getFareData = async (VehicleId, tableName) => {
  // Validate table name against a known list
  // const allowedTables = ['extras', 'taxes', 'markup', 'fares'];
  // if (!allowedTables.includes(tableName)) {
  //   throw new Error("Invalid table name");
  // }

  const query = `
    SELECT * FROM ${tableName}
    WHERE base_vehicle_id = :VehicleId AND status = 1
  `;

  const results = await sequelize.query(query, {
    replacements: { VehicleId },
    type: sequelize.QueryTypes.SELECT,
  });

  return results;
};


export const calculateCharges = async (
  pickupTime,
  rateBegins,
  rateEnds,
  chargeUnit,
  charges,
  totalbill
) => {
  const val = isInRange(pickupTime, rateBegins, rateEnds);
  let total_charges = 0;

  if (chargeUnit == "Rs") {
    total_charges = charges;
  } else {
    total_charges = (totalbill * charges) / 100;
  }
  return total_charges;
};

const toHmsString = (timeArr) => {
  const minutes = 60 + Number(timeArr[1]);
  const hours =
    Math.abs(timeArr[0]) < 10
      ? `0${Math.abs(timeArr[0])}`
      : `${Math.abs(timeArr[0])}`;
  const prefix = timeArr[0] < 0 ? "-" : "";
  return `${prefix}${hours}:${minutes}`;
};

export const isInRange = (pickupTime, rateBegins, rateEnds) => {
  const startTime = rateBegins ? rateBegins.split(":").map(Number) : [0, 0];
  const endTime = rateEnds ? rateEnds.split(":").map(Number) : [0, 0];

  let now = [0, 0];
  if (pickupTime && pickupTime !== "undefined") {
    now = pickupTime.split(":").map(Number);
  }

  if (endTime[0] < startTime[0] && now[0] < startTime[0]) {
    startTime[0] -= 24;
  } else if (startTime[0] > endTime[0]) {
    endTime[0] += 24;
  }

  const startString = toHmsString(startTime);
  const endString = toHmsString(endTime);
  const nowString = toHmsString(now);

  return startString < nowString && nowString < endString ? "TRUE" : "FALSE";
};

export const seqPurchasePrice = async (req, res) => {
  try {
    const purchasebillArr = [];
    const bookingId = req?.body?.booking_id;

    if (!bookingId) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        MESSAGES.GENERAL.MANDATORY_FIELD,
        STATUS_CODE.NOT_FOUND
      );
    }
    const bookingData = await getBookingInfo(bookingId);
    if (bookingData) {
      const {
        base_vehicle_id,
        master_package_mode_id,
        master_package_id,
        estimated_distance,
        package_id,
        night_rate_type,
        night_rate_value,
        night_rate_begins,
        night_rate_ends,
        pickup_time,
      } = bookingData;
      let total_tax = 0,
        status = 0;
      let min_pkg_km = 0,
        min_pkg_hrs = 0,
        peak_fare = 0,
        night_charges = 0,
        extra_charges = 0,
        ignore_hrs = 0,
        ignore_km = 0,
        minimumCharge = 0,
        distance = 0,
        local_pkg_fare_mode = "",
        totalbill = 0;
      if (master_package_id == 1 && local_package_id) {
        const localPkgData = await getPackageFareByPackageId(
          base_vehicle_id,
          local_package_id
        );

        const { km, hrs, price, package_mode_id } = localPkgData;

        if (localPkgData) {
          min_pkg_km = km;
          min_pkg_hrs = hrs;
          totalbill = price;
          ignore_hrs = hrs;
          ignore_km = km;
          minimumCharge = totalbill;
          distance = km;
          local_pkg_fare_mode = package_mode_id;
        }
        if (master_package_id == 1) {
          let estimated_time = await convertTime(req?.ignore_hrs);
          let duration = "";
        } else {
          let estimated_time = await convertTime(req?.estimated_time);
          let duration = req?.duration;
        }
      }

      const getModeFare = await getFareByPackageModeId(
        master_package_mode_id,
        base_vehicle_id
      );
      let param1 = {};
      if (getModeFare) {
        param1 = {
          master_package_type: master_package_id,
          master_package_mode_id: master_package_mode_id,
          base_vehicle_id: base_vehicle_id,
          minimum_charge: minimumCharge,
          ignore_hrs: ignore_hrs,
          ignore_km: ignore_km,
          status: status,
          distance: distance,
        };
        const fareCalculationData = await getFareCalculation(
          param1,
          getModeFare
        );

        let peakTimeData = await getFareData(
          base_vehicle_id,
          "peak_time_charge"
        );
        if (peakTimeData && peakTimeData.length > 0) {
          let peakValueArr1 = [];
          let peak_fare1 = 0;

          for (let i = 0; i < peakTimeData.length; i++) {
            const peakItem = peakTimeData[i];

            const peakValueArr = {
              start_time: peakItem.start_time,
              end_time: peakItem.end_time,
              peaktime_type: peakItem.peaktime_type,
              peaktime_value: peakItem.peaktime_value,
            };

            const peakFare = await calculateCharges(
              pickup_time,
              peakItem.start_time,
              peakItem.end_time,
              peakItem.peaktime_type,
              peakItem.peaktime_value,
              val.totalbill
            );

            peak_fare1 += peakFare;
            peakValueArr1.push(peakValueArr);
          }
        }

        let night_charge = await calculateCharges(
          pickup_time,
          night_rate_begins,
          night_rate_ends,
          night_rate_type,
          night_rate_value,
          peakTimeData.totalbill
        );
        let extras = await getFareData(base_vehicle_id, "extras");
        if (extras) {
          let extraValueArr1 = [];
          let extra_charges = 0;
          let extra_charges1 = 0;
          for (let i = 0; i < extras.length; i++) {
            let extraValueArr = {
              extras_name: extras[i].extras_master_id,
              extra_value_type: extras[i].extra_value_type,
              extra_value: extras[i].extra_value,
            };
            let extra_charges = await calculateExtraCharges(
              val.totalbill,
              extras[i].extra_value_type,
              extras[i].extra_value
            );
            extra_charges1 += extra_charges;
            extraValueArr1.push(extraValueArr);
          }
        } else {
          let extra_charges1 = 0;
          let extraValueArr1 = [];
        }

        let totalBill =
          Number(peak_fare1) +
          Number(night_charges) +
          Number(extra_charges1) +
          Number(val.totalBill);

        let total_tax =
          Number(bookingData.sgst_tax) +
          Number(bookingData.cgst_tax) +
          Number(bookingData.igst_tax);

        let taxPrice = Math.round((totalBill * Number(total_tax)) / 100);
        let totalbillVal = Number(totalBill) + Number(taxPrice);
        let estimated_price_before_markup = Number(totalBill);
        totalbillVal = Math.round(totalbill);

        fareCalculationData.booking_id = booking_id;
        fareCalculationData.estimated_time = bookingData.estimated_time;
        fareCalculationData.duration = bookingData.duration;
        fareCalculationData.estimated_distance = distance;
        fareCalculationData.estimated_price_before_markup =
          estimated_price_before_markup;
        fareCalculationData.total_price = totalbillVal;
        fareCalculationData.base_fare = Number(
          fareCalculationData.minimum_charge
        ).toFixed(2);
        fareCalculationData.per_km_price = Number(
          fareCalculationData.per_km_charge
        ).toFixed(2);
        fareCalculationData.running_amt = Number(
          fareCalculationData.totalbill
        ).toFixed(2);
        fareCalculationData.peak_time_price = Number(peak_fare1).toFixed(2);
        fareCalculationData.extra_charge = extra_charges1;
        fareCalculationData.tax_price = taxPrice;

        fareCalculationData.cgst_tax = bookingData.cgst_tax;
        fareCalculationData.igst_tax = bookingData.igst_tax;
        fareCalculationData.sgst_tax = bookingData.sgst_tax;

        fareCalculationData.night_charge = Number(night_charges).toFixed(2);
        fareCalculationData.night_rate_type = night_rate_type;
        fareCalculationData.night_rate_value = night_rate_value;
        fareCalculationData.night_rate_begins = night_rate_begins;
        fareCalculationData.night_rate_ends = night_rate_ends;

        fareCalculationData.master_package_mode_id =
          bookingData.master_packge_mode_id;

        fareCalculationData.approx_waiting_charge = "";
        fareCalculationData.approx_waiting_minute = "";
        fareCalculationData.created_date = dateFormat(
          new Date(),
          "yyyy-mm-dd HH:MM:ss"
        );

        delete fareCalculationData.minimum_charge;
        delete fareCalculationData.per_km_charge;
        delete fareCalculationData.totalbill;

        purchasebillArr.push(fareCalculationData);
        return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, {
          purchasebillArr,
        });
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

