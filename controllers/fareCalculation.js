export const  getfareCalculation=async(param, fareData)=> {
        var commonObj = Farewrapper.app.models.common;
        //console.log(param);
        //console.log(fareData); //return true;

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
            var minimumCharge = param.minimumCharge;
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

            } else if (packagemodeid == 3) {       // Distance + hour Mode        
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
                    //console.log(ExtraKM)
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
            //console.log(EstimatedPrice);
            datam1.totalbill = EstimatedPrice;
            datam1.min_pkg_hrs = ignore_hrs;
            datam1.min_pkg_km = ignore_km;
            datam1.markup_price = markupPrice;
            datam1.extraKm = ExtraKM;

            //console.log(datam1); return true;
            resolve(datam1);
        });
    }


    export const convertToMinutes = (timeString) => {
        // Regular expression to match both "hours" and "minutes" (handles optional spaces)
        const regex = /(\d+)\s*(hour[s]?)?\s*(\d+)\s*(min[s]?)/i;
        let totalMinutes = 0;
    
        // Check if the string contains both hours and minutes (e.g., "1 hour 10 mins")
        const match = timeString.match(regex);
    
        if (match[2]!=undefined) {
            const hours = match[1] && match[1] !== undefined ? parseInt(match[1], 10) : 0;
            const minutes = match[3] && match[3] !== undefined ? parseInt(match[3], 10) : 0;
    
            // Convert hours to minutes and add minutes
            totalMinutes = (hours * 60) + minutes;
        } else {
            // If only "minutes" are provided (e.g., "30 mins")
            const singleTimeRegex = /(\d+)\s*(min[s]?)/i;
            const singleMatch = timeString.match(singleTimeRegex);
            if (singleMatch) {
                totalMinutes = parseInt(singleMatch[1], 10);
            } else {
                //return "Invalid time format"; // If the string does not match either pattern
                totalMinutes = 0;
            }
        }    
        return totalMinutes;
    }


     export const companyShareCalculation = (datavalueArr,amount)=>{

        var companyshareArr = datavalueArr;
        var amount          = amount;

        var company_share = 0;
        var partner_share = 0;
        var driver_share  = 0;
        var company_share_type = '';
        var partner_share_type = '';
        var driver_share_type = '';
          return new Promise((resolve, reject) => {
        if (companyshareArr.length > 0) {
            for (var i = 0; i < companyshareArr.length; i++) {
                var share_type = companyshareArr[i].share_type_id;
                var share_value_type = companyshareArr[i].share_value_type;
                var share_value = companyshareArr[i].share_value;

                if (share_type == 1) {
                    if (share_value_type == 2) {
                        company_share_type = "Rs";
                        company_share = share_value;

                    } else {
                        company_share_type = "%";
                        company_share = Math.round((amount * share_value) / 100);

                    }
                }
                if (share_type == 2) {
                    if (share_value_type == 2) {
                        partner_share_type = "Rs";
                        partner_share = share_value;
                    } else {
                        partner_share_type = "%";
                        partner_share = Math.round((amount * share_value) / 100);
                    }
                }
                if (share_type == 3) {
                    if (share_value_type == 2) {
                        driver_share_type = "Rs";
                        driver_share = share_value;
                    } else {
                        driver_share_type = "%";
                        driver_share = Math.round((amount * share_value) / 100);
                    }
                }
            }

            var resp = {'company_share_type': company_share_type,'comp_share': company_share, 'partner_share_type':partner_share_type,'partner_share': partner_share, 'driver_share_type':driver_share_type,'driver_share': driver_share};
            var message = {"status": 'success', data: resp};
        } else {
             var resp = {'company_share_type': company_share_type,'comp_share': company_share, 'partner_share_type':partner_share_type,'partner_share': partner_share, 'driver_share_type':driver_share_type,'driver_share': driver_share};
            var message = {"status": 'failed', data: resp};
        }

            resolve(message);

        });

    }