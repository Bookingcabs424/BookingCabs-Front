import BaseCombination from "../models/baseCombinationModel.js";
import BasicFareSetting from "../models/basicFareSettingModel.js";
import BasicTax from "../models/basicTaxModel.js";
import CancellationFare from "../models/cancellationChargeModel.js";
import CompanyShare from "../models/companyShareModel.js";
import DispatchLocation from "../models/dispatchLocationModel.js";
import DistanceFare from "../models/distanceFareModel.js";
import DistanceHourFare from "../models/distanceHourFareModel.js";
import DistanceUptoRate from "../models/distanceUptoRatesModel.js";
import DistanceWaitingFare from "../models/distanceWaitingFare.js";
import Extras from "../models/extrasModel.js";
import FixRoute from "../models/fixRouteModel.js";
import HourlyFare from "../models/hourlyFareModel.js";
import NightCharge from "../models/nightChargeModel.js";
import OnewayCityRoutePackage from "../models/oneWayCityRoutePackage.js";
import PeakTimeCharge from "../models/peakTimeChargeModel.js";
import PostalCodeFare from "../models/postalCodeFareModel.js";
import PremiumsFare from "../models/premiumFareModel.js";
import PreWaitingCharge from "../models/preWaitingChargeModel.js";
import User from "../models/userModel.js";
import WaitingCharge from "../models/WaitingChargesModel.js";

export const copybasecombination= async(req,res)=>{
    try {
        
        let id = req.body.fare_id;
        let user_id = req.body.user_id;
        let ip = req.body.ip;
        let result_base_data=  await BaseCombination.findOne({
            where:{
                id:id
            }
        })
        let created_date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        if(result_base_data){
            let insertValues = {
                'fare_parent_id': result_base_data.id,
                'fare_type': result_base_data.fare_type,
                'company_id': result_base_data.company_id,
                'vendor_id': user_id,
                'country_id': result_base_data.country_id,
                'state_id': result_base_data.state_id,
                'city_id': result_base_data.city_id,
                'master_package_id': result_base_data.master_package_id,
                'master_package_mode_id': result_base_data.master_package_mode_id,
                'market_place': result_base_data.market_place,
                'created_date': created_date,
                'created_by': user_id,
                'status': '1',
                'ip': ip
            };
     let result=   await BaseCombination.create(insertValues)   
        return result
        }
    }
    catch (error) {
       console.error(error)
   }

}


export const copyDispatchLocation= async(req)=> {
    try {
        const { fare_id, user_id, ip, lastInsertId, created_by } = req.body;
        
        // Find the existing dispatch location
        const existingLocation = await DispatchLocation.findOne({
            where: { base_comb_id: fare_id }
        });

        if (!existingLocation) {
            return { 
                error: "No Record Found", 
                status: 'failed' 
            };
        }

        // Create new dispatch location
        const newLocation = await DispatchLocation.create({
            user_id: user_id,
            base_comb_id: lastInsertId,
            type_of_dispatch: existingLocation.type_of_dispatch,
            garage_type: existingLocation.garage_type,
            address: existingLocation.address,
            city: existingLocation.city,
            pincode: existingLocation.pincode,
            latitude: existingLocation.latitude,
            longitude: existingLocation.longitude,
            created_date: new Date(),
            created_by: created_by,
            ip: ip
        });

        return newLocation;

    } catch (error) {
        console.error('Error in copyDispatchLocation:', error);
        throw error; // Let the calling function handle the error
    }
}
export const copyOnewayRouteCity=async(req)=> {
    try {
        const { parent_base_vehicle_id, base_vehicle_id, created_date, created_by } = req.body;

        // Find existing route packages
        const existingRoute = await OnewayCityRoutePackage.findOne({
            where: { base_vehicle_id: parent_base_vehicle_id }
        });

        if (!existingRoute) {
            return { 
                error: "No Record Found", 
                status: 'failed' 
            };
        }

        // Create new route packages (handles multiple records)
const created=    await OnewayCityRoutePackage.create({
                base_vehicle_id: base_vehicle_id,
                city_distance_id: existingRoute.city_distance_id,
                created_date: created_date || new Date(),
                created_by: created_by
            });


        return created;

    } catch (error) {
        console.error('Error in copyOnewayRouteCity:', error);
        throw error; // Let the calling function handle the error
    }
}

export const copyBasicTaxData = async (req) => {
    try {
        const { 
            parent_base_vehicle_id, 
            base_vehicle_id, 
            created_by,
            ip,
            created_date = new Date().toISOString()
        } = req.body;

        // Find existing tax records
        const existingTax = await BasicTax.findOne({
            where: { 
                base_vehicle_id: parent_base_vehicle_id 
            },
            raw: true
        });

        if (!existingTax) {
            return { 
                error: "No tax records found", 
                status: 'failed' 
            };
        }

        // Create new tax record
        const newTax = await BasicTax.create({
            base_vehicle_id,
            vendor_id: created_by,
            tax_type: existingTax.tax_type,
            sgst: existingTax.sgst,
            cgst: existingTax.cgst,
            igst: existingTax.igst,
            created_date,
            created_by,
            ip
        });

        return newTax.get({ plain: true });

    } catch (error) {
        console.error(`[TaxCopyError] ${error.message}`);
        throw new Error(`Failed to copy tax data: ${error.message}`);
    }
};


export const copybasicTaxFareSettingData = async (requestData) => {
    try {
        const { 
            parent_base_vehicle_id, 
            base_vehicle_id, 
            created_by,
            ip,
            created_date = new Date().toISOString()
        } = requestData.body;

        // Find existing fare settings
        const existingSettings = await BasicFareSetting.findOne({
            where: { 
                base_vehicle_id: parent_base_vehicle_id 
            },
            raw: true
        });

        if (!existingSettings) {
            return { 
                error: "No fare settings found", 
                status: 'failed' 
            };
        }

        // Create new fare settings
        const newSettings = await BasicFareSetting.create({
            base_vehicle_id,
            vendor_id: created_by,
            rounding: existingSettings.rounding,
            level: existingSettings.level,
            direction: existingSettings.direction,
            created_date,
            created_by,
            ip
        });

        return newSettings.get({ plain: true });

    } catch (error) {
        console.error(`[FareSettingsCopyError] ${error.message}`);
        throw new Error(`Failed to copy fare settings: ${error.message}`);
    }
};



export const copyDistanceFareData = async (requestData) => {
     try {
        const { 
            parent_base_vehicle_id, 
            base_vehicle_id, 
            created_by,
            ip,
            created_date = new Date().toISOString()
        } = requestData.body;

        // Find existing distance fare
        const existingFare = await DistanceFare.findOne({
            where: { 
                base_vehicle_id: parent_base_vehicle_id 
            },
            raw: true
        });

        if (!existingFare) {
            return { 
                error: "No distance fare records found", 
                status: 'failed' 
            };
        }

        // Create new distance fare
        const newFare = await DistanceFare.create({
            base_vehicle_id,
            minimum_charge: existingFare.minimum_charge,
            minimum_distance: existingFare.minimum_distance,
            per_km_charge: existingFare.per_km_charge,
            round_up_km: existingFare.round_up_km,
            accumulated_instance: existingFare.accumulated_instance,
            date_from: existingFare.date_from,
            date_to: existingFare.date_to,
            currency: existingFare.currency,
            rate: existingFare.rate,
            rate_type: existingFare.rate_type,
            rate_value: existingFare.rate_value,
            week_days: existingFare.week_days,
            created_date,
            created_by,
            ip
        });

        return newFare.get({ plain: true });

    } catch (error) {
        console.error(`[DistanceFareCopyError] ${error.message}`);
        throw new Error(`Failed to copy distance fare data: ${error.message}`);
    }
};

export const copyHourlyFareData = async (req, res) => {
    const {
      parent_base_vehicle_id,
      base_vehicle_id,
      user_id,
      ip,
      created_date,
      created_by,
    } = req.body;
  
    try {
      const sourceFare = await HourlyFare.findOne({
        where: { base_vehicle_id: parent_base_vehicle_id },
      });
  
      if (!sourceFare) {
        return res.status(404).json({ error: 'No Record Found', status: 'failed' });
      }
  
      const newFareData = {
        base_vehicle_id,
        minimum_charge: sourceFare.minimum_charge,
        minimum_hrs: sourceFare.minimum_hrs,
        per_hr_charge: sourceFare.per_hr_charge,
        date_from: sourceFare.date_from,
        date_to: sourceFare.date_to,
        currency: sourceFare.currency,
        rate: sourceFare.rate,
        rate_type: sourceFare.rate_type,
        rate_value: sourceFare.rate_value,
        week_days: sourceFare.week_days,
        created_date,
        created_by,
        ip,
      };
  
      const insertedFare = await HourlyFare.create(newFareData);
  
      return res.status(201).json(insertedFare);
    } catch (error) {
        console.error(`[DistanceFareCopyError] ${error.message}`);
        throw new Error(`Failed to copy distance fare data: ${error.message}`);

    }
  };



export const copyDistanceWaitingFareData = async (req,) => {
  const {
    parent_base_vehicle_id,
    base_vehicle_id,
    user_id,
    ip,
    created_by,
    created_date,
  } = req.body;

  try {
    const sourceFare = await DistanceWaitingFare.findOne({
      where: { base_vehicle_id: parent_base_vehicle_id },
    });

    if (!sourceFare) {
      return ({ error: 'No Record Found', status: 'failed' });
    }

    const newFareData = {
      base_vehicle_id,
      minimum_charge: sourceFare.minimum_charge,
      minimum_distance: sourceFare.minimum_distance,
      minutes_upto: sourceFare.minutes_upto,
      fees: sourceFare.fees,
      fees_per_minute: sourceFare.fees_per_minute,
      date_from: sourceFare.date_from,
      date_to: sourceFare.date_to,
      currency: sourceFare.currency,
      rate: sourceFare.rate,
      rate_type: sourceFare.rate_type,
      rate_value: sourceFare.rate_value,
      week_days: sourceFare.week_days,
      created_date,
      created_by,
      ip,
    };

    const newFare = await DistanceWaitingFare.create(newFareData);

    return (newFare);
  } catch (error) {
    console.error('Error copying distance waiting fare:', error);
    return ({ error: 'Internal Server Error' });
  }
};

export const copyFixRouteFareData = async (req, res) => {
    try {
      const { parent_base_vehicle_id, base_vehicle_id, user_id, ip } = req.body;
  
      if (!parent_base_vehicle_id || !base_vehicle_id || !user_id) {
        return res.status(400).json({
          status: 'failed',
          message: 'Missing required fields: parent_base_vehicle_id, base_vehicle_id, user_id',
        });
      }
  
      // Fetch the source fix_route record
      const parentFixRoute = await FixRoute.findOne({
        where: { base_vehicle_id: parent_base_vehicle_id },
      });
  
      if (!parentFixRoute) {
        return res.status(404).json({
          status: 'failed',
          message: 'No record found for the provided parent_base_vehicle_id',
        });
      }
  
      // Prepare new record data
      const newFixRouteData = {
        base_vehicle_id: base_vehicle_id,
        frequent_location: parentFixRoute.frequent_location,
        created_date: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        created_by: user_id,
        ip: ip,
      };
  
      // Insert new record
      const newRecord = await FixRoute.create(newFixRouteData);
  
      
      
      return  newRecord;
    } 
    catch (error) {
      console.error('Error copying fix route fare data:', error);
      return ({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
    
  }


export const copyNightChargeFareData = async (
    req
  ) => {
    const {
      parent_base_vehicle_id,
      base_vehicle_id,
      created_by,
      ip,
    } = req;
  
    try {
      const source = await NightCharge.findOne({
        where: { base_vehicle_id: parent_base_vehicle_id }
      });
  
      if (!source) {
        return { error: 'No Record Found', status: 'failed' };
      }
  
      const created_date = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
      const inserted = await NightCharge.create({
        base_vehicle_id,
        night_rate_begins: source.night_rate_begins,
        night_rate_ends: source.night_rate_ends,
        night_rate_type: source.night_rate_type,
        night_rate_value: source.night_rate_value,
        created_date,
        created_by,
        ip,
      });
  
      return inserted;
    } catch (err) {
      console.error('Error in copyNightChargeFareData:', err);
      throw err;
    }
  };



export const copyPremiumsFareData = async function (req) {
  const {
    parent_base_vehicle_id,
    base_vehicle_id,
    user_id,
    created_date,
    created_by,
    ip
  } = req.body;

  try {
    const sourceFare = await PremiumsFare.findOne({
      where: { base_vehicle_id: parent_base_vehicle_id }
    });

    if (!sourceFare) {
      return { error: 'No Record Found', status: 'failed' };
    }

    const newFare = await PremiumsFare.create({
      base_vehicle_id,
      premiums_type: sourceFare.premiums_type,
      premiums_value: sourceFare.premiums_value,
      created_date: created_date || new Date(),
      created_by: created_by || user_id,
      ip
    });

    return newFare;
  } catch (error) {
    console.error('Error in copyPremiumsFareData:', error);
    throw error;
  }
};


export const copyDistanceUptoFareData = async function (req) {
    const {
      parent_base_vehicle_id,
      base_vehicle_id,
      user_id,
      created_date = new Date(),
      created_by = user_id,
      ip
    } = req.body;
  
    try {
      const existingRecords = await DistanceUptoRate.findAll({
        where: { base_vehicle_id: parent_base_vehicle_id }
      });
  
      if (existingRecords.length === 0) {
        return { error: 'No Record Found', status: 'failed' };
      }
  
      const now = new Date();
      const insertPayload = existingRecords.map(record => ({
        base_vehicle_id,
        km_upto: record.km_upto,
        rate_per_km: record.rate_per_km,
        created_date,
        modified_date: now,
        created_by,
        modified_by: 0,
        status: 1,
        ip
      }));
  
      const response = await DistanceUptoRate.bulkCreate(insertPayload);
      return { status: 'success', inserted: response.length };
  
    } catch (error) {
      console.error('Error in copyDistanceUptoFareData:', error);
      throw error;
    }
  };

  export const copyCancellationFareData = async function (req) {
    const {
      parent_base_vehicle_id,
      base_vehicle_id,
      user_id,
      ip,
      created_date = new Date(),
      created_by = user_id
    } = req.body;
  
    try {
      const existingRecords = await CancellationFare.findAll({
        where: { base_vehicle_id: parent_base_vehicle_id }
      });
  
      if (existingRecords.length === 0) {
        return { error: 'No Record Found', status: 'failed' };
      }
  
      const now = new Date();
      const insertPayload = existingRecords.map(record => ({
        base_vehicle_id,
        currency_id: record.currency_id,
        cancellation_master_id: record.cancellation_master_id,
        cancellation_type: record.cancellation_type,
        cancellation_value: record.cancellation_value,
        round_off: record.round_off,
        days: record.days,
        hours: record.hours,
        created_date,
        modified_date: now,
        created_by,
        modified_by: 0,
        status: 1,
        ip
      }));
  
      const result = await CancellationFare.bulkCreate(insertPayload);
      return { status: 'success', inserted: result.length };
  
    } catch (error) {
      console.error('Error in copyCancellationFareData:', error);
      throw error;
    }
  };


 export const copyWaitingFareData = async function (req) {
    const {
      parent_base_vehicle_id,
      base_vehicle_id,
      user_id,
      ip,
      created_date = new Date(),
      created_by = user_id
    } = req.body;
  
    try {
      const existingRecords = await WaitingCharge.findAll({
        where: { base_vehicle_id: parent_base_vehicle_id }
      });
  
      if (existingRecords.length === 0) {
        return { error: 'No Record Found', status: 'failed' };
      }
  
      const now = new Date();
  
      const insertPayload = existingRecords.map(record => ({
        base_vehicle_id,
        waiting_minute_upto: record.waiting_minute_upto,
        waiting_fees: record.waiting_fees,
        created_date,
        modified_date: now,
        created_by,
        modified_by: 0,
        status: 1,
        ip
      }));
  
      const result = await WaitingCharge.bulkCreate(insertPayload);
      return { status: 'success', inserted: result.length };
  
    } catch (error) {
      console.error('Error in copyWaitingFareData:', error);
      throw error;
    }
  };



export const copyPreWaitingFareData = async function (req) {
  try {
      const parentBaseVehicleId = req.parent_base_vehicle_id;
      const baseVehicleId = req.base_vehicle_id;

      // Fetch data from parent vehicle
      const preWaitingCharges = await PreWaitingCharge.findAll({
          where: { base_vehicle_id: parentBaseVehicleId }
      });

      if (preWaitingCharges.length === 0) {
          return { error: "No Record Found", status: 'failed' };
      }

      const createdDate = new Date(); // Assuming Sequelize handles formatting
      const createdBy = req.created_by;
      const ip = req.ip;

      // Prepare array of new records
      const newCharges = preWaitingCharges.map(charge => ({
          base_vehicle_id: baseVehicleId,
          pre_waiting_upto_minutes: charge.pre_waiting_upto_minutes,
          pre_waiting_fees: charge.pre_waiting_fees,
          created_date: createdDate,
          created_by: createdBy,
          ip: ip
      }));

      // Bulk insert new records
      const inserted = await PreWaitingCharge.bulkCreate(newCharges);

      return inserted;
  } catch (error) {
      console.error(error);
      throw error;
  }
};


export const copyPostalCodeFareData = async function (req) {
    try {
        const { parent_base_vehicle_id, base_vehicle_id, created_by, ip } = req;

        // Step 1: Fetch all postalcode fare records for the parent base vehicle
        const parentFares = await PostalCodeFare.findAll({
            where: { base_vehicle_id: parent_base_vehicle_id }
        });

        if (parentFares.length === 0) {
            return { error: "No Record Found", status: 'failed' };
        }

        const created_date = new Date();

        // Step 2: Prepare new records
        const newFares = parentFares.map(fare => ({
            base_vehicle_id: base_vehicle_id,
            pickup_postcode: fare.pickup_postcode,
            drop_postcode: fare.drop_postcode,
            price: fare.price,
            created_date,
            created_by,
            ip
        }));

        // Step 3: Insert into postalcode_fare table
        const insertedFares = await PostalCodeFare.bulkCreate(newFares);

        return insertedFares;

    } catch (err) {
        console.error(err);
        throw err;
    }
};


export  const copyPeakTimeFareData = async function (req) {
  try {
      const { parent_base_vehicle_id, base_vehicle_id, created_by, ip } = req;

      // Step 1: Get all peak time charge records from the parent base vehicle
      const peakTimeCharges = await PeakTimeCharge.findAll({
          where: { base_vehicle_id: parent_base_vehicle_id }
      });

      if (peakTimeCharges.length === 0) {
          return { error: "No Record Found", status: 'failed' };
      }

      const created_date = new Date();

      // Step 2: Map records for new base_vehicle_id
      const newCharges = peakTimeCharges.map(item => ({
          base_vehicle_id,
          start_time: item.start_time,
          end_time: item.end_time,
          peaktime_type: item.peaktime_type,
          peaktime_value: item.peaktime_value,
          created_date,
          created_by,
          ip
      }));

      // Step 3: Bulk insert into peak_time_charge
      const inserted = await PeakTimeCharge.bulkCreate(newCharges);

      return inserted;

  } catch (error) {
      console.error(error);
      throw error;
  }
};

export const copyExtrasFareData = async (req) => {
    try {
        const {
            parent_base_vehicle_id,
            base_vehicle_id,
            created_by,
            ip
        } = req;

        const existingExtras = await Extras.findAll({
            where: { base_vehicle_id: parent_base_vehicle_id }
        });

        if (existingExtras.length === 0) {
            return { error: 'No Record Found', status: 'failed' };
        }

        const created_date = new Date();

        const newExtras = existingExtras.map(extra => ({
            base_vehicle_id,
            extras_master_id: extra.extras_master_id,
            extra_value_type: extra.extra_value_type,
            extra_value: extra.extra_value,
            created_date,
            created_by,
            ip
        }));

        const inserted = await Extras.bulkCreate(newExtras);

        return inserted;
    } catch (err) {
        console.error('Error copying extras data:', err);
        throw err;
    }
};


export const copyCompanyShareData = async (req) => {
  try {
      const {
          parent_base_vehicle_id,
          base_vehicle_id,
          created_by,
          ip
      } = req;

      // Fetch original records
      const existingShares = await CompanyShare.findAll({
          where: { base_vehicle_id: parent_base_vehicle_id }
      });

      if (existingShares.length === 0) {
          return { error: 'No Record Found', status: 'failed' };
      }

      const created_date = new Date();

      // Prepare new entries
      const newShares = existingShares.map(share => ({
          base_vehicle_id,
          share_type_id: share.share_type_id,
          share_value_type: share.share_value_type,
          share_value: share.share_value,
          created_date,
          created_by,
          ip
      }));

      // Bulk insert
      const inserted = await CompanyShare.bulkCreate(newShares);

      return inserted;
  } catch (err) {
      console.error('Error copying company share data:', err);
      throw err;
  }
};

export const copyDistanceHourFareData = async (req) => {
  try {
    const {
      parent_base_vehicle_id,
      base_vehicle_id,
      created_by,
      ip,
      created_date = new Date().toISOString(),
    } = req.body;

    // Fetch the existing distance hour fare record
    const existingFare = await DistanceHourFare.findOne({
      where: { base_vehicle_id: parent_base_vehicle_id },
    });

    if (!existingFare) {
      return { error: "No Record Found", status: "failed" };
    }

    // Create a new distance hour fare record
    const newFare = await DistanceHourFare.create({
      base_vehicle_id,
      minimum_charge: existingFare.minimum_charge,
      minimum_distance: existingFare.minimum_distance,
      minimum_hrs: existingFare.minimum_hrs,
      per_km_charge: existingFare.per_km_charge,
      per_hr_charge: existingFare.per_hr_charge,
      date_from: existingFare.date_from,
      date_to: existingFare.date_to,
      currency: existingFare.currency,
      rate: existingFare.rate,
      rate_type: existingFare.rate_type,
      rate_value: existingFare.rate_value,
      week_days: existingFare.week_days,
      created_date,
      created_by,
      ip,
    });

    return newFare;
  } catch (error) {
    console.error("Error in copyDistanceHourFareData:", error);
    throw error;
  }
};

export const updateFareAcceptedStatus = async (req) => {
  try {
    console.log(req.user.id,"req.user");
    // return
    // const { id:user_id } = req.user;

    const affectedRows = await User.update(
      { accept_fare: 1 },
      { where: { id: req.user.id } }
    );

    if (affectedRows === 0) {
      throw new Error("User not found or already updated");
    }

    return { message: "Fare acceptance status updated successfully", affectedRows };
  } catch (error) {
    console.error("Error updating fare acceptance status:", error);
    throw error;
  }
};
