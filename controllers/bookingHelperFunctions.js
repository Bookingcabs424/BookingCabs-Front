import BankDetails from "../models/bankDetailsModel.js";
import BookingCharges from "../models/bookingChargesModel.js";
import BookingEstimation from "../models/bookingEstimationModel.js";
import Booking from "../models/bookingModel.js";
import BookingPickDropDetails from "../models/bookingPickDropDetailsModel.js";
import Company from "../models/companyModel.js";
import CompanySetup from "../models/companySetupModel.js";
import LocalPackage from "../models/localPackageModel.js";
import MasterCity from "../models/masterCityModel.js";
import MasterCountry from "../models/masterCountryModel.js";
import MasterCurrency from "../models/masterCurrencyModel.js";
import MasterPackage from "../models/masterPackageModel.js";
import MasterVehicleType from "../models/masterVehicleTypeModel.js";
import PaymentTransactionResponse from "../models/paymentTransactionModel.js";
import PaymentType from "../models/paymentTypeModel.js";
import SmsTemplate from "../models/smsTemplateModel.js";
import UserInfo from "../models/userInfoModel.js";
import User from "../models/userModel.js";
import UserRole from "../models/userRoleModel.js";
import UserTransaction from "../models/userTransactionModel.js";
import VehicleMaster from "../models/vehicleMasterModel.js";
import { generatePdf, NumInWords, transactionMail } from "../utils/helpers.js";
import sendSMS from "../utils/sendSMS.js";
import Driver from "../models/driverModel.js";
import UserVehicleMapping from "../models/userVehicleMappingModel.js";
import sequelize from "../config/clientDbManager.js";
import dateFormat from "dateformat";
import BookingLogs from "../models/bookingLogsModel.js";
import BookingTravellerDetails from "../models/bookingTravellerDetailsModel.js";
import TravellerDetails from "../models/travellerDetailsModel.js";

// export const bookingListSearch = async function (req) {
//     try {
//         const whereConditions = {};

//         if (req.id) {
//             whereConditions.booking_id = req.id;
//         }
//         if (req.booking_id) {
//             whereConditions.reference_number = req.booking_id;
//         }
//         if (req.agent_reference) {
//             whereConditions.agent_reference = req.agent_reference;
//         }
//         if (req.booking_type) {
//             whereConditions.master_package_id = req.booking_type;
//         }
//         if (req.driver_name) {
//             whereConditions['$driver.first_name$'] = req.driver_name;
//         }
//         if (req.from_date && req.to_date) {
//             whereConditions['$BookingPickDropDetails.pickup_date$'] = {
//                 [Op.between]: [req.from_date, req.to_date]
//             };
//         }
//         if (req.client_first_name) {
//             whereConditions['$client.first_name$'] = { [Op.like]: `%${req.client_first_name}%` };
//         }
//         if (req.client_last_name) {
//             whereConditions['$client.last_name$'] = { [Op.like]: `%${req.client_last_name}%` };
//         }
//         if (req.client_id) {
//             whereConditions['$client.id$'] = req.client_id;
//         }
//         if (req.client_email) {
//             whereConditions['$client.email$'] = req.client_email;
//         }
//         if (req.client_mobile_no) {
//             whereConditions['$client.mobile$'] = req.client_mobile_no;
//         }
//         if (req.driver_first_name) {
//             whereConditions['$driver.first_name$'] = req.driver_first_name;
//         }
//         if (req.driver_last_name) {
//             whereConditions['$driver.last_name$'] = req.driver_last_name;
//         }
//         if (req.driver_id) {
//             whereConditions.driver_id = req.driver_id;
//         }
//         if (req.referral_key) {
//             whereConditions['$driver.referral_key$'] = req.referral_key;
//         }
//         if (req.driver_mobile_no) {
//             whereConditions['$driver.mobile$'] = req.driver_mobile_no;
//         }
//         if (req.driver_email) {
//             whereConditions['$driver.email$'] = req.driver_email;
//         }
//         if (req.vehicle_type) {
//             whereConditions.master_vehicle_type_id = req.vehicle_type;
//         }
//         if (req.state_name) {
//             whereConditions['$BookingPickDropDetails.pickup_state$'] = req.state_name;
//         }
//         if (req.city_name) {
//             whereConditions['$BookingPickDropDetails.pickup_city$'] = req.city_name;
//         }
//         if (req.pickup_address) {
//             whereConditions['$BookingPickDropDetails.pickup_address$'] = req.pickup_address;
//         }
//         if (req.drop_address) {
//             whereConditions['$BookingPickDropDetails.drop_address$'] = req.drop_address;
//         }
//         if (req.booking_status) {
//             whereConditions.status = req.booking_status;
//         }
//         if (req.pickup_date) {
//             whereConditions['$BookingPickDropDetails.pickup_date$'] = { [Op.gte]: req.pickup_date };
//         }
//         if (req.payment_type) {
//             whereConditions.charge_type = req.payment_type;
//         }
//         if (req.pickup_time) {
//             whereConditions['$BookingPickDropDetails.pickup_time$'] = { [Op.eq]: req.pickup_time };
//         }
//         if (req.unassigned_booking === 1) {
//             whereConditions.driver_id = 0;
//         }
//         if (req.user_id) {
//             whereConditions.user_id = req.user_id;
//         }
//         if (req.user_mobile) {
//             whereConditions['$user.mobile$'] = req.user_mobile;
//         }
//         if (req.vehicle_no) {
//             whereConditions['$VehicleMaster.vehicle_no$'] = req.vehicle_no;
//         }
//         if (req.status) {
//             whereConditions.status = req.status;
//         }
//         if (req.multi_status) {
//             whereConditions.status = { [Op.in]: req.multi_status.split(',') };
//         }
//         if (req.multi_booking_type) {
//             whereConditions.master_package_id = { [Op.in]: req.multi_booking_type.split(',') };
//         }
//         if (req.multi_vehicle_type) {
//             whereConditions.master_vehicle_type_id = { [Op.in]: req.multi_vehicle_type.split(',') };
//         }
//         if (req.multi_city_name) {
//             whereConditions['$BookingPickDropDetails.pickup_city$'] = { [Op.in]: req.multi_city_name.split(',') };
//         }
//         if (req.partner_name) {
//             whereConditions['$CompanySetup.com_name$'] = req.partner_name;
//         }
//         if (req.pickupaddress) {
//             whereConditions['$BookingPickDropDetails.pickup_address$'] = { [Op.like]: `%${req.pickupaddress}%` };
//         }
//         if (req.drop_area) {
//             whereConditions['$BookingPickDropDetails.drop_area$'] = { [Op.like]: `%${req.drop_area}%` };
//         }
//         if (req.from_time && req.to_time) {
//             whereConditions['$BookingPickDropDetails.pickup_time$'] = {
//                 [Op.between]: [req.from_time, req.to_time]
//             };
//         }
//         if (req.preferred_booking) {
//             whereConditions.preferred_booking = req.preferred_booking;
//         }
//         if (req.ignition_type_id) {
//             whereConditions.ignition_type_id = req.ignition_type_id;
//         }
//         if (req.vehicle_type_id) {
//             whereConditions.master_vehicle_type_id = { [Op.lte]: req.vehicle_type_id };
//         }
//         if (req.pref_city) {
//             whereConditions['$BookingPickDropDetails.pickup_city$'] = { [Op.in]: req.pref_city.split(',') };
//         }

//         const bookings = await Booking.findAll({
//             where: whereConditions,
//             include: [
//                 { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'mobile'] },
//                 { model: User, as: 'client', attributes: ['first_name', 'last_name', 'email', 'mobile'] },
//                 { model: VehicleMaster, attributes: ['vehicle_no'] },
//                 { model: MasterVehicleType, attributes: ['vehicle_type'] },
//                 { model: MasterPackage, attributes: ['name'] },
//                 { model: BookingEstimation },
//                 { model: BookingPickDropDetails },
//                 { model: PaymentTransactionResponse },
//                 { model: BankDetails },
//                 { model: Company },
//                 { model: CompanySetup },
//                 { model: UserInfo },
//                 { model: UserTransaction },
//                 { model: MasterCurrency },
//                 { model: PaymentType },
//                 { model: MasterCity },
//                 { model: BookingCharges },
//                 { model: LocalPackage },
//                 { model: MasterCountry },
//                 { model: UserRole }
//             ],
//             order: [['booking_id', 'DESC']]
//         });

//         const response = bookings.map(booking => {
//             const isDocumentPending = [
//                 booking.client_signature,
//                 booking.starting_meter_image,
//                 booking.closing_meter_image,
//                 booking.client_image,
//                 booking.parking_image,
//                 booking.toll_image,
//                 booking.extra_image
//             ].some(doc => doc === null) ? 'YES' : 'NO';

//             return {
//                 ...booking.toJSON(),
//                 is_document_pending: isDocumentPending
//             };
//         });

//         return response;
//     } catch (err) {
//         console.error(err);
//         throw new Error('Error fetching booking list',err);
//     }
// };

export const bookingConfirmationEmail = async function (req,res) {
  try {
    const bookingId = req.booking_id||req?.body?.booking_id;
    const params = { id: bookingId };
    console.log({ params });
    const bookingList = await bookingListSearch(params);
    if (!bookingList || bookingList.length === 0) {
      throw new Error("Booking not found");
    }
    const bookingData = bookingList[0];
    const userId = bookingData.user_id;
    const clientId = bookingData.client_id;
    const userRegsql = `
    SELECT 
      user.id as user_id,
      user.user_type_id,
      user.first_name,
      user.last_name,
      user.username,
      user.email,
      user.mobile,
      user.is_active,
      
      company_setup.com_name,
      company_setup.site_url,
      company_setup.email as comp_email,
      company_setup.mobile as comp_mobile,
      company_setup.phone as comp_phone,
      company_setup.global_email,
      company_setup.gst_no AS companysetup_gst_no,
      company_setup.pan_no AS companysetup_pan_no,
      company_setup.first_name AS company_first_name,
      company_setup.last_name AS company_last_name,
      company_setup.comp_address AS company_address,
      company_setup.bank_name AS company_bank_name,
      company_setup.ac_holder_name AS company_ac_holder_name,
      company_setup.branch AS company_account_branch,
      company_setup.ifsc_code AS company_ifsc_code,
      company_setup.account_no AS company_account_no,

      com.company_name as user_company_name,
      com.contact_person_name,
      com.website_url,
      com.company_address as user_company_address,
      com.pincode as user_company_pincode,
      com.email as user_company_email,
      com.alt_email as user_company_alt_email,
      com.country_prefix_mob as user_company_prefix_mobile,
      com.mobile_no as user_company_mobile_no,
      com.country_prefix_land as user_company_landline_prefix,
      com.landline_no as user_company_landline_no,
      com.service_tax_gst AS user_gst_no,
      com.pancard_no as company_pancard_no,
      
      udoc.doc_file_upload as company_logo
      
    FROM user 
    LEFT JOIN company_setup ON user.company_id = company_setup.id 
    LEFT JOIN user_upload_document as udoc 
      ON user.id = udoc.user_id 
      AND udoc.document_type_id = 22 
      AND udoc.doc_default_status = 1 
    LEFT JOIN company as com ON user.id = com.user_id 
    
    WHERE user.id IN (:user_id, :client_id) 
    ORDER BY udoc.upload_doc_id DESC
  `;
    const users = await sequelize.query(userRegsql, {
      replacements: { user_id: userId, client_id: clientId },
      type: sequelize.QueryTypes.SELECT,
    });

    // const users = await User.findAll({
    //     where: { id: [userId, clientId] },
    //     include: [
    //         {
    //             model: CompanySetup,
    //             attributes: [
    //                 'com_name', 'site_url', 'email', 'mobile', 'phone', 'global_email', 'gst_no', 'pan_no',
    //                 'first_name', 'last_name', 'comp_address', 'bank_name', 'ac_holder_name', 'branch',
    //                 'ifsc_code', 'account_no'
    //             ]
    //         },
    //         {
    //             model: Company,
    //             attributes: [
    //                 'company_name', 'contact_person_name', 'website_url', 'company_address', 'pincode',
    //                 'email', 'alt_email', 'country_prefix_mob', 'mobile_no', 'country_prefix_land',
    //                 'landline_no', 'service_tax_gst', 'pancard_no'
    //             ]
    //         }
    //     ]
    // });

    if (!users || users.length === 0) {
      throw new Error("User data not found");
    }

    for (const user of users) {
      console.log({ users55: users?.length });

      const userData = user;
      const companySetup = userData.CompanySetup || {};
      const company = userData.Company || {};

      const companyLogo =
        userData.user_type_id === 7 && userData.company_logo
          ? `${process.env.B2B_UPLOAD_URL}${userId}/${userData.company_logo}`
          : `${process.env.B2B_URL}images/logo-emailer-bookingcabs.png`;
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
        pickup_time: dateFormat(bookingData.ordertime, "yyyy-mm-dd"),
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
        amount_in_world: NumInWords(Number(bookingData.estimated_final_price)),
        remark: bookingData.remark,
        company_logo: companyLogo,
        company_gst_no: companySetup.gst_no || company.service_tax_gst,

        user_bank_name: bookingData.user_bank_name,
        user_ac_no: bookingData.user_ac_no,
        user_ifsc_code: bookingData.user_ifsc_code,
        user_ac_holder: bookingData.user_beneficiary_name,
        user_bank_branch: bookingData.user_bank_branch,

        user_com_name: companySetup.com_name || company.company_name,
        user_com_address: companySetup.comp_address || company.company_address,
        user_comp_phone: companySetup.phone || company.landline_no,
        user_comp_mobile: companySetup.mobile || company.mobile_no,
        user_contact_person_name: `${companySetup.first_name || ""} ${
          companySetup.last_name || ""
        }`.trim(),
        user_pan_no: companySetup.pan_no || company.pancard_no,
        user_email: companySetup.email || company.email,
        user_website_url: companySetup.site_url || company.website_url,
        user_gst_no: companySetup.gst_no || company.service_tax_gst,

        booking_status: bookingData.status,
        itinerary_no: bookingData.itinerary_id,
        cancellation_rule: JSON.parse(bookingData.booking_cancellation_rule),
        // Invoice Generated //
        invoice_no: "",

        company_bank_name: userData.bank_name,
        company_ac_holder_name: userData.ac_holder_name,
        company_account_branch: userData.branch,
        company_ifsc_code: userData.ifsc_code,
        company_account_no: userData.account_no,

        flight_number: bookingData.flight_number,
        flight_time: bookingData.flight_time,
        service_charge: bookingData.service_charge.split(","),
        sac_code: bookingData.sac_code,
        sac_description: bookingData.sac_description,
        service_charge_cgst_amount: bookingData.service_charge_cgst_amount,
        service_charge_igst_amount: bookingData.service_charge_igst_amount,
        service_charge_sgst_amount: bookingData.service_charge_sgst_amount,
        service_charge_cgst: bookingData.service_charge_cgst,
        service_charge_igst: bookingData.service_charge_igst,
        service_charge_sgst: bookingData.service_charge_sgst,
        service_charge_sac_code: bookingData.service_charge_sac_code,
        service_charge_sac_code_description:
          bookingData.service_charge_sac_code_description,
      };

      const invoiceParams = {
        template_name: "invoice",
        template_param: bookingHoldParams1,
        file_name: `invoice_${bookingData.ref}`,
      };
      await generatePdf(invoiceParams);

      const voucherParams = {
        template_name: "voucher",
        template_param: bookingHoldParams1,
        file_name: `voucher_${bookingData.ref}`,
      };
      let pickupdatetime = dateFormat(
        bookingData.ordertime,
        "dd-mm-yyyy HH:MM:ss"
      );
      await generatePdf(voucherParams);
      if ((bookingData.master_package_id = 1)) {
        var booking_type =
          bookingData.booking_type + " - " + bookingData.local_pkg_name;
      } else {
        var booking_type = bookingData.booking_type;
      }
      var mailParams = {
        username: user.first_name,
        booking_ref_no: bookingData.ref,
        pickup_time: pickupdatetime,
        estimated_price: bookingData.estimated_final_price,
        date: bookingData.booking_date,
        company_logo: user?.company_logo,
        client_name: bookingData.clientname,
        booking_type: booking_type,
        booking_date_time: bookingData.booking_date_time,
        booked_by: bookingData.user_name,
        pickup_address: bookingData.departure,
      };
      console.log({ bookingData });
      const sendMailObj = {
        template_name: "booking_confirm",
        sender_email: userData.email,
        template_param: mailParams,
      };
      console.log({ sendMailObj });
      await transactionMail(sendMailObj);

      var smsTemplate = await SmsTemplate.findOne({
        where: { msg_sku: "booking", is_active: 1 },
      });
      if (bookingData.status_id == 22) {
        smsTemplate = await SmsTemplate.findOne({
          where: { msg_sku: "hold", is_active: 1 },
        });
      }
      console.log({ bookingData });
      let booking_release_date = dateFormat(
        bookingData.booking_date,
        "dd-mm-yyyy HH:MM:ss"
      );

      console.log({ statusId: bookingData.status_id });
      if (smsTemplate) {
        let smsMessage = smsTemplate.message
          .replace("{#username#}", bookingData.first_name)
          .replace("{#booking_ref#}", bookingData.ref)
          .replace("{#booking_date#}", booking_release_date)
          .replace("{#pickup_time#}", pickupdatetime)
          .replace("{#mobile#}", users.comp_mobile);

        if (bookingData.status_id == 22) {
          smsMessage = smsTemplate.message
            .replace("{#username#}", bookingData.first_name)
            .replace("{#booking_type#}", bookingData?.booking_type)
            .replace("{#booking_ref#}", bookingData.ref)
            .replace("{#last_date#}", booking_release_date)
            // .replace('{#booking_date#}', booking_release_date)
            .replace("{#web_link#}", "bookingcabs.com")
            .replace("{#mobile#}", users.comp_mobile);
        }

        const smsParams = {
          username: bookingData.client_name,
          booking_ref: bookingData.ref,
          pickup_time: bookingData.pickup_time,
          estimated_price: bookingData.estimated_final_price,
          date: bookingData.booking_date,
          company_name: companySetup.com_name || company.company_name,
        };
        console.log({ mobile: userData.mobile });
        const sendSmsObj = {
          sms_template_name: "booking",
          mobile: "9958733086",
          sms_template_param: smsParams,
          sms_body: smsMessage,
        };
        await sendSMS(sendSmsObj, smsMessage);
      }
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error in booking confirmation email");
  }
};

export const SendbookingEmail= async function (req,res) {
      const bookingId = req.booking_id||req?.body?.booking_id;
      const email = req.email||req?.body?.email;
    const params = { id: bookingId };
    let companyDetails = await Company.findOne({ where: { user_id: req.user.id } });

    const bookingList = await bookingListSearch(params);

    const bookingData = bookingList[0];
     let pickupdatetime = dateFormat(
        bookingData.pickup_time,
        "dd-mm-yyyy HH:MM:ss"
      );
 var mailParams = {
        username: bookingData.first_name,
        booking_ref_no: bookingData.ref,
        pickup_time: pickupdatetime,
        estimated_price: bookingData.estimated_final_price,
        date: bookingData.created_date,
        company_logo: "https://bookingcabs.in/images/logo.png",
        client_name: bookingData.clientname,
        booking_type: bookingData?.booking_type,
        booking_date_time: bookingData.booking_date,
        booked_by: bookingData.user_name,
        pickup_address: bookingData.departure,
      };
      console.log({ bookingData });
      const sendMailObj = {
        template_name: "booking_confirm",
        sender_email: email,
        template_param: mailParams,
      };
      console.log({ sendMailObj });
      await transactionMail(sendMailObj);
      return res.status(200).json( { status: "success", message: "Email sent successfully" });
}
export const getBookingInfo = async function (req) {
  try {
    const bookingId = req;
    const result = await Booking.sequelize.query(
      "CALL `wp_booking_info`(:bookingId)",
      {
        replacements: { bookingId },
        type: Booking.sequelize.QueryTypes.RAW,
      }
    );
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching booking info");
  }
};

export const getBookingPendingImages = async function (req) {
  try {
    const bookingId = req;
    const result = await BookingCharges.findAll({
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
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching booking pending images");
  }
};

export const getStatementOfAccountCount = async function (req, sql, joins) {
  try {
    // const newSql = `
    //         SELECT COUNT(DISTINCT bk.itinerary_id) as total_count, bk.itinerary_id
    //         ${joins}
    //         ${sql}
    //     `;

    const newSql = `
            SELECT COUNT(DISTINCT bk.itinerary_id) as total_count
            ${joins}
            ${sql}
        `;
    const result = await Booking.sequelize.query(newSql, {
      type: Booking.sequelize.QueryTypes.SELECT,
    });

    if (result?.length && result[0]?.total_count !== undefined) {
      return result[0].total_count;
    } else {
      return { message: "No Record Found", status: "failed" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching statement of account count");
    return { message: `Error: ${err.message}`, status: "failed" };
  }
};
export const getStatementOfAccountFilterCount = async function (
  req,
  sql,
  joins
) {
  try {
    const newSql = `
            SELECT COUNT(DISTINCT bk.itinerary_id) as filter_count, bk.itinerary_id
            ${joins}
            ${sql}
        `;

    const result = await Booking.sequelize.query(newSql, {
      type: Booking.sequelize.QueryTypes.SELECT,
    });

    if (result?.length && result[0]?.filter_count !== undefined) {
      return { status: "success", data: result[0].filter_count };
    } else {
      return { message: "No Record Found", status: "failed" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching statement of account filter count");
  }
};

export const getStatementOfAccountList = async function (
  req,
  sql,
  joins,
  wheres
) {
  try {
    const newSql = `SELECT ${wheres} ${joins} ${sql}`;
    const result = await Booking.sequelize.query(newSql, {
      type: Booking.sequelize.QueryTypes.SELECT,
    });

    if (result?.length && result.length > 0) {
      return { status: "success", data: result };
    } else {
      return { error: "No Record Found", status: "failed" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching statement of account list");
  }
};

export const getUserData = async function (req) {
  try {
    if (!req.driver_id) {
      return { status: "failed", error: "No Record Found" };
    }

    const sqlQuery = `
            SELECT 
                u.id as user_id, u.user_grade as user_grade, u.accept_fare as accept_fare, u.user_type_id, 
                u.username as username, u.duty_status, usertype.RoleName AS user_type_name, u.company_id, 
                u.login_timezone as user_timezone, company_setup.com_name AS company_name, 
                company_setup.comp_address AS company_address, company_setup.phone AS company_mobile, 
                company_setup.gst_no AS companysetup_gst_no, com.company_name as user_company_name, 
                com.contact_person_name, com.website_url, com.company_address as user_company_address, 
                com.pincode as user_company_pincode, com.email as user_company_email, 
                com.alt_email as user_company_alt_email, com.country_prefix_mob as user_company_prefix_mobile, 
                com.mobile_no as user_company_mobile_no, com.country_prefix_land as user_company_landline_prefix, 
                com.landline_no as user_company_landline_no, com.service_tax_gst AS user_gst_no, 
                com.pancard_no as company_pancard_no, mct.currency_name as name, mct.currency_symbol as symbol, 
                u.parent_id, u.first_name, u.last_name, u.email, u.mobile_prefix, u.mobile, u.gender, 
                user_role.role_id, role.role_name, master_department.department_name, u.wallet_amount, 
                u.gcm_id, u.login_status, DATE_FORMAT(u.login_time, "%Y-%m-%d %h:%i:%s") as login_time, 
                u.logout_time, u.email_verified, u.phone_verified, u.referral_key, u.refer_by, u.is_active, 
                u.login_otp_status, u.newsletter_subscription, u.mobile_promotion, ui.alternate_mobile, 
                ui.alternate_email, DATE_FORMAT(ui.dob, "%Y-%m-%d") as dob, ui.father_name, ui.address, 
                ui.address2, ui.pincode, ui.country_id, ui.state_id, ui.city_id, ui.kyc_type, ui.kyc, 
                ui.landline_number, driver.preferred_booking, driver.preferred_partner, 
                mct.country_name as country_name, mct.state_name as state_name, mct.name as city_name, 
                vm.model as vehicle_model, vm.ignition_type_id, fuel.fuel_type as ignition_type, 
                vm.vehicle_no, mvm.name as vehicle_name, mvt.vehicle_type, mvt.id as vehicle_type_id, 
                doc3.doc_file_upload as vehicle_image, doc.doc_file_upload as profile_img, 
                doc1.doc_file_upload as image, doc2.doc_file_upload as company_logo, 
                urm.staff_id as relation_manager_id, concat(staff.first_name, " ", staff.last_name) as staff_name, 
                staff.email as staff_email, staff.mobile as staff_mobile, 
                SUM(COALESCE(CASE WHEN user_transaction.action_type = "Credit" THEN user_transaction.amount END, 0)) - 
                SUM(COALESCE(CASE WHEN user_transaction.action_type = "Debit" THEN user_transaction.amount END, 0)) 
                credit_balance 
            FROM user as u 
            JOIN user_info as ui ON u.id = ui.user_id 
            LEFT JOIN driver as driver ON u.id = driver.user_id 
            LEFT JOIN company_setup ON u.company_id = company_setup.id 
            LEFT JOIN user_role AS usertype ON u.user_type_id = usertype.Role_ID 
            LEFT JOIN master_city as mct ON mct.id = ui.city_id 
            LEFT JOIN user_assign_role AS user_role ON u.id = user_role.user_id 
            LEFT JOIN role ON user_role.role_id = role.role_id 
            LEFT JOIN master_department ON user_role.department_id = master_department.id 
            LEFT JOIN user_vehicle_mapping as uvm ON u.id = uvm.user_id 
            LEFT JOIN vehicle_master as vm ON uvm.vehicle_master_id = vm.vehicle_master_id 
            LEFT JOIN master_fuel_type as fuel ON vm.ignition_type_id = fuel.id 
            LEFT JOIN master_vehicle_model AS mvm ON vm.id = mvm.id 
            LEFT JOIN master_vehicle_type AS mvt ON mvm.vehicle_type_id = mvt.id 
            LEFT JOIN user_upload_document as doc ON u.id = doc.user_id AND doc.document_type_id = 12 AND doc.doc_default_status = 1 
            LEFT JOIN user_upload_document as doc1 ON u.id = doc1.user_id AND doc1.document_type_id = 12 AND doc1.doc_default_status = 1 
            LEFT JOIN user_upload_document as doc2 ON u.id = doc2.user_id AND doc2.document_type_id = 22 AND doc2.doc_default_status = 1 
            LEFT JOIN user_upload_document as doc3 ON u.id = doc3.parent_id AND doc3.document_type_id = 23 AND doc2.doc_default_status = 1 
            LEFT JOIN user_relation_manager as urm ON u.id = urm.user_id 
            LEFT JOIN user as staff ON urm.staff_id = staff.id 
            LEFT JOIN company as com ON u.id = com.user_id 
            LEFT JOIN user_transaction ON user_transaction.user_id = u.id 
            WHERE u.id = :driverId
        `;

    const result = await Booking.sequelize.query(sqlQuery, {
      replacements: { driverId: req.driver_id },
      type: Booking.sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return { status: "success", data: result };
    } else {
      return { status: "failed", error: "No Record Found" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching user data");
  }
};

export const prefDriveCityList = async function (req) {
  try {
    if (!req.driver_id) {
      return { status: "failed", error: "No Record Found" };
    }

    const result = await Booking.sequelize.query(
      `
            SELECT 
                dc.city_id, 
                CONCAT(mc.name, " ,(", mcoun.name, ")") as name 
            FROM 
                user_pref_drive_city as dc 
            LEFT JOIN 
                master_city as mc ON dc.city_id = mc.id 
            LEFT JOIN 
                master_state as ms ON mc.state_id = ms.id 
            LEFT JOIN 
                master_country as mcoun ON ms.country_id = mcoun.id 
            WHERE 
                dc.user_id = :driverId AND dc.status = 1
            `,
      {
        replacements: { driverId: req.driver_id },
        type: Booking.sequelize.QueryTypes.SELECT,
      }
    );

    if (result.length > 0) {
      return { status: "success", data: result };
    } else {
      return { status: "failed", error: "No Record Found" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching preferred drive city list");
  }
};

export const bookingUnassignedData = async function (req) {
  try {
    const whereConditions = {
      [Op.or]: [{ status: { [Op.eq]: 22 } }, { status: { [Op.lte]: 8 } }],
      "$BookingPickDropDetails.pickup_date$": { [Op.gte]: new Date() },
    };

    if (req.unassigned_booking === "1") {
      whereConditions.driver_id = 0;
    }

    if (req.preferred_booking) {
      whereConditions.preferred_booking = req.preferred_booking;
    }

    if (req.ignition_type_id) {
      whereConditions.ignition_type_id = req.ignition_type_id;
    }

    if (req.vehicle_type_id) {
      whereConditions.master_vehicle_type_id = {
        [Op.lte]: req.vehicle_type_id,
      };
    }

    if (req.pref_city) {
      whereConditions["$BookingPickDropDetails.pickup_city$"] = {
        [Op.in]: req.pref_city.split(","),
      };
    }

    if (req.multi_booking_type) {
      whereConditions.master_package_id = {
        [Op.in]: req.multi_booking_type.split(","),
      };
    }

    const bookings = await Booking.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["first_name", "last_name", "mobile", "email"],
        },
        {
          model: User,
          as: "client",
          attributes: ["first_name", "last_name", "mobile", "email"],
        },
        {
          model: User,
          as: "driver",
          attributes: ["first_name", "last_name", "gcm_id"],
        },
        { model: VehicleMaster, attributes: ["vehicle_no"] },
        {
          model: MasterVehicleType,
          attributes: ["vehicle_type", "id", "category_id"],
        },
        { model: MasterPackage, attributes: ["name", "image", "icon"] },
        { model: BookingEstimation },
        { model: BookingPickDropDetails },
        { model: PaymentTransactionResponse },
        { model: CompanySetup, attributes: ["com_name", "driver_min_balance"] },
        { model: MasterCity, as: "pickupCity", attributes: ["name"] },
        {
          model: BookingCharges,
          attributes: [
            "driver_share_amt",
            "comp_share_amt",
            "partner_share_amt",
          ],
        },
      ],
      order: [["booking_id", "DESC"]],
    });

    if (bookings.length > 0) {
      return { status: "success", data: bookings };
    } else {
      return { status: "failed", error: "No Record Found" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching unassigned booking data");
  }
};

export const dutyTypeList = async function (req) {
  try {
    if (!req.driver_id) {
      return { status: "failed", error: "No Record Found" };
    }

    const sqlQuery = `
            SELECT user_duty_id, package_id 
            FROM user_duty_pref 
            WHERE user_id = :driverId AND status = 1
        `;

    const result = await Booking.sequelize.query(sqlQuery, {
      replacements: { driverId: req.driver_id },
      type: Booking.sequelize.QueryTypes.SELECT,
    });

    if (result.length > 0) {
      return { status: "success", data: result };
    } else {
      return { status: "failed", error: "No Record Found" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching duty type list");
  }
};

export const bookingListSearch = async function (req, res) {
  try {
    const replacements = {};
    const conditions = [];

    if (req.id) {
      console.log(req.id, "req.id req.id");
      conditions.push("bk.booking_id = :id");
      replacements.id = req.id;
    }

    if (req.pickup_date) {
      conditions.push("bpd.pickup_date = :pickup_date");
      replacements.pickup_date = req.pickup_date;
    }

    if (req.ref_no) {
      conditions.push("bk.reference_number = :ref_no");
      replacements.ref_no = req.ref_no;
    }

    if (req.user_id) {
      conditions.push("bk.user_id = :user_id");
      replacements.user_id = req.user_id;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "WHERE 1=1";

    const sql = `
      SELECT 
        bk.booking_id AS id,
        bk.itinerary_id,
        bk.company_id,
        compset.com_name AS domain_name,
        compset.currency_id,
        mc.name AS currency,
        mc.symbol AS currency_symbol,
        bk.driver_id,
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
        mcn.nationality AS client_nationality,
        us3.alternate_mobile AS client_alt_mobile,
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
        mpm.package_mode,
        bk.master_package_id AS booking_type_id,
        mp.name AS booking_type,
        mp.image AS booking_type_image,
        mp.icon AS booking_type_icon,
        payty.pay_type_mode AS charge_type,
        mvt.vehicle_type AS vehicle,
        bk.no_of_vehicles,
        mcoup.name AS coupon_name,
        DATE_FORMAT(bk.booking_date, '%Y-%m-%d %H:%i:%s') AS booking_date,
        TIME(bk.booking_date) AS booking_time,
        bk.device_type,
        DATE_FORMAT(bk.booking_release_date, '%Y-%m-%d %H:%i:%s') AS booking_release_date,
        bk.placcard_name,
        bk.pickup_point,
        bk.inclusions_data,
        bk.exclusions_data,
        bk.fare_rule_data,
        cs.status,
        bkest.booking_estimation_id,
        bkest.booking_id,
        bkest.estimated_time,
        bkest.estimated_distance,
        bkest.estimateprice_before_discount,
        bkest.discount_price,
        bkest.estimated_final_price,
        bkest.booking_amt_percentage,
        bkest.estimated_price_before_markup,
        bkest.total_tax_price,
        bkest.approx_distance_charge,
        bkest.approx_after_km,
        bkest.approx_after_hour,
        bkest.approx_hour_charge,
        bkest.approx_waiting_charge,
        bkest.approx_waiting_minute,
        bkest.minimum_charge,
        bkest.night_rate_type,
        bkest.night_rate_value,
        bkest.night_rate_begins,
        bkest.night_rate_ends,
        bkest.night_charge_price,
        bkest.premiums_type,
        bkest.premiums_value,
        bkest.premiums_price,
        bkest.extras,
        bkest.extra_price,
        bkest.peak_time_value,
        bkest.peak_time_price,
        bkest.cgst_tax,
        bkest.igst_tax,
        bkest.sgst_tax,
        bkest.rounding,
        bkest.level,
        bkest.direction,
        bkest.created_date,
        bkest.updated_date,
        bkest.estimated_final_price AS amount,
        bkest.service_charge,
        bkest.booking_cancellation_rule,
        CONCAT(bpd.pickup_date, ' ', bpd.pickup_time) AS ordertime,
        bpd.pickup_area,
        bpd.pickup_address AS departure,
        bpd.drop_area,
        bpd.drop_address,
        bpd.adults,
        bpd.childs,
        bpd.luggages,
        bpd.pickup_country,
        bpd.pickup_state,
        bpd.pickup_city,
        bpd.pickup_latitude,
        bpd.pickup_longitude,
        bpd.pickup_zone,
        bpd.drop_date,
        bpd.drop_time,
        bpd.drop_country,
        bpd.drop_state,
        bpd.drop_city,
        bpd.drop_latitude,
        bpd.drop_longitude,
        bpd.drop_zone,
        ut.created_date AS created_at,
        ut.payment_status AS is_paid,
        ut.time AS paid_at,
        ut.booking_transaction_no,
        ut.payment_type_id,
        SUM(ut.amount) AS booking_amt_paid,
        (bkest.estimated_final_price - SUM(ut.amount)) AS booking_amt_balance,
        pt.pay_type_mode AS payment_type,
        mcity.name AS city_name,
        booking_charges.driver_share_amt,
        booking_charges.comp_share_amt,
        booking_charges.partner_share_amt,
        local_package.name AS local_pkg_name
      FROM booking AS bk
      LEFT JOIN user AS us ON bk.user_id = us.id
      LEFT JOIN user AS us2 ON bk.client_id = us2.id
      LEFT JOIN user AS driver ON bk.driver_id = driver.id
      LEFT JOIN user_vehicle_mapping AS vehm ON bk.driver_id = vehm.user_id
      LEFT JOIN vehicle_master AS vm ON vehm.vehicle_master_id = vm.vehicle_master_id
      LEFT JOIN master_vehicle_model AS vmodel ON vm.id = vmodel.id
      LEFT JOIN master_vehicle_type AS dmvt ON vmodel.id = dmvt.id
      LEFT JOIN master_package_mode AS mpm ON bk.master_package_mode_id = mpm.id
      LEFT JOIN master_package AS mp ON bk.master_package_id = mp.id
      LEFT JOIN master_vehicle_type AS mvt ON bk.master_vehicle_type_id = mvt.id
      LEFT JOIN master_coupon AS mcoup ON bk.coupon_id = mcoup.id
      LEFT JOIN cab_status AS cs ON bk.status = cs.status_id AND cs.type = 'cab'
      LEFT JOIN company_setup AS compset ON bk.company_id = compset.id
      LEFT JOIN master_currency AS mc ON compset.currency_id = mc.id
      LEFT JOIN user_info AS us3 ON bk.client_id = us3.user_id
      LEFT JOIN user_info AS user_info ON bk.user_id = user_info.user_id
      LEFT JOIN master_country ON us.nationality = master_country.id
      LEFT JOIN master_country AS mcn ON us2.nationality = mcn.id
      LEFT JOIN user_transaction AS ut ON bk.booking_id = ut.booking_id
      LEFT JOIN payment_type AS pt ON ut.payment_type_id = pt.payment_type_id
      LEFT JOIN payment_type AS payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN bank_details ON driver.id = bank_details.user_id
      LEFT JOIN bank_details AS user_bank_detail ON bk.user_id = user_bank_detail.user_id
      LEFT JOIN cab_status ON us.is_active = cab_status.status_id AND cab_status.type = 'driverS'
      LEFT JOIN company AS ucompany ON driver.id = ucompany.user_id
      LEFT JOIN company AS user_company ON us.id = user_company.user_id
      LEFT JOIN booking_estimation AS bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details AS bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN master_city AS mcity ON bpd.pickup_city = mcity.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      LEFT JOIN local_package ON bk.package_id = local_package.id      
      ${whereClause}
      GROUP BY bk.booking_id
      ORDER BY bk.booking_id DESC
    `;

    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return result;
    } else {
      return { status: "failed", error: "No Record Found" };
    }
  } catch (err) {
    console.error(err);
    // return res.status(500).json({ status: 'failed', error: err.message });
  }
};
export const addBookingLogsData = async function (req) {
  try {
    let message;
    let booking_status = req.body.booking_status;
    if (booking_status == 22) {
      message = "Hold Booking";
    } else if (booking_status == 27) {
      message = "Quotation Booking";
    } else {
      booking_status = 1;
      message = "Requesting car";
    }

    const AddBookRegisterVal = {
      bookingid: req.body.insertId,
      status: booking_status,
      message: message,
      time: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    };

    // Remove undefined or empty values
    Object.keys(AddBookRegisterVal).forEach((key) => {
      if (
        AddBookRegisterVal[key] === undefined ||
        AddBookRegisterVal[key] === ""
      ) {
        delete AddBookRegisterVal[key];
      }
    });

    // Assuming you have a BookingLogs model
    await BookingLog.create(AddBookRegisterVal);

    return { status: "success" };
  } catch (err) {
    console.error(err);
    throw new Error("Error adding booking logs data");
  }
};

export const addMultiBookingTravellerDetail = async function (req) {
  try {
    const travellerDetails = req?.body?.travellerDetails;
    if (!Array.isArray(travellerDetails) || travellerDetails.length === 0) {
      return { status: "failed", error: "No traveller details provided" };
    }
console.log({travellerDetails})
    const insertId = req.body.insertId;
    const agent_reference = req.agent_reference;
    const placcard_name = req.placcard_name;

    const records = travellerDetails.map((traveller) => {
      return {
        booking_id: insertId,
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
        agent_reference: agent_reference,
        placcard_name: placcard_name,
        id_proof: traveller.id_proof,
        created_by: traveller.created_by,
        created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        ip: traveller.ip,
      };
    });

    await BookingTravellerDetails.bulkCreate(records);
    return { status: "success" };
  } catch (err) {
    console.error(err);
    throw new Error("Error adding booking traveller details");
  }
};

export const addBookingTravellerDetails = async function (req) {
  try {
    const {
      insertId,
      first_name = "",
      last_name = "",
      gender = "",
      date_of_birth = "",
      age = "",
      email = "",
      mobile = "",
      alt_mobile_number = "",
      gst_no = "",
      gst_name = "",
      nationality = "",
      id_proof = "",
      agent_reference = "",
      placcard_name = "",
      created_by,
      ip,
    } = req;

    const travellerData = {
      booking_id: insertId,
      first_name,
      last_name,
      gender,
      date_of_birth,
      age,
      email,
      mobile,
      alt_mobile_number,
      gst_no,
      gst_company_name: gst_name,
      nationality,
      agent_reference,
      placcard_name,
      id_proof,
      created_by,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      ip,
    };

    await BookingTravellerDetails.create(travellerData);
    return { status: "success" };
  } catch (err) {
    console.error(err);
    throw new Error("Error adding booking traveller details");
  }
};

export const addSightSeeingTravellerDetail = async function (req) {
  try {
    const { sightseeing_traveller_details, insertId, created_date, ip } = req;
    if (
      !sightseeing_traveller_details ||
      !sightseeing_traveller_details.name ||
      !Array.isArray(sightseeing_traveller_details.name) ||
      sightseeing_traveller_details.name.length === 0
    ) {
      return {
        status: "failed",
        error: "No sightseeing traveller details provided",
      };
    }

    const records = sightseeing_traveller_details.name.map((name, idx) => ({
      booking_id: insertId,
      name,
      age: sightseeing_traveller_details.age?.[idx] || null,
      dob: sightseeing_traveller_details.dob?.[idx] || null,
      created_date:
        created_date || dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      ip: ip || null,
    }));

    // Assuming you have a TravellerDetails model
    await TravellerDetails.bulkCreate(records);

    return { status: "success" };
  } catch (err) {
    console.error(err);
    throw new Error("Error adding sightseeing traveller details");
  }
};

export const fetchBookingData = async function (req) {
  try {
    const { booking_id, itinerary_id, user_mobile } = req;
    const replacements = {};
    const conditions = [];
    console.log(
      booking_id,
      itinerary_id,
      user_mobile,
      "THisssssssssssssssssss"
    );
    if (booking_id !== undefined) {
      conditions.push("bk.reference_number = :booking_id");
      replacements.booking_id = booking_id;
    }
    if (itinerary_id !== undefined && itinerary_id !== "") {
      conditions.push("bk.itinerary_id = :itinerary_id");
      replacements.itinerary_id = itinerary_id;
    }
    if (user_mobile !== undefined) {
      conditions.push("us.mobile = :user_mobile");
      replacements.user_mobile = user_mobile;
    }

    const whereClause = conditions.length
      ? `WHERE 1=1 AND ${conditions.join(" AND ")}`
      : "WHERE 1=1";
console.log({whereClause})

    const sql = `
      SELECT 
        bk.booking_id AS id,
        bk.itinerary_id AS itinerary_id,
        bk.reference_number AS reference_number,
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
        CONCAT(us.first_name,' ',us.last_name) AS user_name,
        us.email,
        us.mobile as user_mobile,
        master_country.name as user_nationality,
        user_info.alternate_mobile AS user_alt_mobile,
        user_info.gst_registration_number,
       cs2.status as driver_status,
        bk.client_id,
        CONCAT(us2.first_name,' ',us2.last_name) AS clientname,
        us2.mobile as client_mobile,
        us2.email as client_email,
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
        bkest.booking_cancellation_rule,
        CONCAT(bpd.pickup_date,' ',bpd.pickup_time) AS ordertime,
        bpd.pickup_area AS pickup_area,
        bpd.pickup_address AS pickup_address,
        bpd.drop_address AS drop_address,
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
        bpd.pickup_date AS pickup_date,
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
      FROM booking bk
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
      LEFT JOIN payment_type payty ON bk.charge_type = payty.payment_type_id
      LEFT JOIN booking_estimation bkest ON bk.booking_id = bkest.booking_id
      LEFT JOIN booking_pickdrop_details bpd ON bk.booking_id = bpd.booking_id
      LEFT JOIN payment_transaction_response ptr ON bk.reference_number = ptr.mer_txn
      LEFT JOIN bank_details ON driver.id = bank_details.user_id
      LEFT JOIN bank_details user_bank_detail ON bk.user_id = user_bank_detail.user_id
      LEFT JOIN cab_status cs2 ON us.is_active = cs2.status_id AND cs2.type='driverS'
      LEFT JOIN company ucompany ON driver.id = ucompany.user_id
      LEFT JOIN company user_company ON us.id = user_company.user_id
      LEFT JOIN company_setup compset ON bk.company_id = compset.id
      LEFT JOIN user_info us3 ON bk.client_id = us3.user_id
      LEFT JOIN user_info ON bk.user_id = user_info.user_id
      LEFT JOIN user_transaction ut ON bk.booking_id = ut.booking_id
      LEFT JOIN master_currency mc ON compset.currency_id = mc.id
      LEFT JOIN payment_type pt ON ut.payment_type_id = pt.payment_type_id
      LEFT JOIN master_city mcity ON bpd.pickup_city = mcity.id
      LEFT JOIN booking_charges ON bk.booking_id = booking_charges.BookingID
      LEFT JOIN local_package ON bk.package_id = local_package.id
      LEFT JOIN master_country ON us.nationality = master_country.id
      ${whereClause}
      ORDER BY bk.booking_id DESC
      `;
      // GROUP BY ut.booking_id
    console.log("SQL:", sql);
    console.log("Replacements:", replacements);
    const result = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });
console.log(result,"sssss")
    if (result && result.length > 0) {
      return { status: "success", data: result };
    } else {
      return { status: "failed", message: "No record found" };
    }
  } catch (err) {
    console.error(err);
    return { status: "failed", message: err.message };
  }
};

export const getOutstationBookingDetails = async function (bookingId) {
  try {
    const sql = `
      SELECT 
        city1.name AS pick_city_name,
        city2.name AS drop_city_name,
        obd.distance,
        obd.days,
        obd.pickup_date,
        obd.pickup_time
      FROM itinerary_details AS obd
      INNER JOIN master_city AS city1 ON obd.pickcity_id = city1.id
      INNER JOIN master_city AS city2 ON obd.dropcity_id = city2.id
      WHERE obd.booking_id = :bookingId
      ORDER BY obd.id ASC
    `;

    const result = await Booking.sequelize.query(sql, {
      replacements: { bookingId },
      type: Booking.sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return { status: "success", data: result };
    } else {
      return { status: "failed", message: "No record found" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching outstation booking details");
  }
};

export const getTravellerBookingDetails = async function (bookingId) {
  try {
    console.log({bookingId})
    const result = await BookingTravellerDetails.findAll({
      where: { booking_id: bookingId },
      order: [["id", "ASC"]],
      raw:true
    });
console.log({result:result})
    if (result && result.length > 0) {
      return { status: "success", data: result };
    } else {
      return { status: "failed", message: "No record found" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching traveller booking details");
  }
};
export const getSightseeingBookingDetails = async function (bookingId) {
  try {
    const sql = `
      SELECT * 
      FROM sightseeing_booking_details 
      WHERE booking_id = :bookingId 
      ORDER BY id ASC
    `;
    const result = await Booking.sequelize.query(sql, {
      replacements: { bookingId },
      type: Booking.sequelize.QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return { status: "success", data: result };
    } else {
      return { status: "failed", message: "No record found" };
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching sightseeing booking details");
  }
};

export const copyBookingData = async function (reqData) {
  try {
    // Fetch quotation data by booking_id
    const [quotation] = await Booking.sequelize.query(
      'SELECT * FROM quotation WHERE booking_id = :id',
      {
        replacements: { id: reqData.id },
        type: Booking.sequelize.QueryTypes.SELECT,
      }
    );

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    // Override booking_status if provided
    if (typeof reqData.booking_status !== 'undefined' && reqData.booking_status !== '') {
      quotation.booking_status = reqData.booking_status;
    }

    // Prepare booking data
    const bookingVariable = {
      company_id: quotation.company_id,
      itinerary_id: quotation.itinerary_id,
      agent_reference: quotation.agent_reference,
      status: quotation.booking_status,
      user_id: quotation.user_id,
      client_id: quotation.client_id,
      package_id: quotation.package_id,
      master_package_mode_id: quotation.master_package_mode_id,
      driver_id: quotation.driver_id,
      coupon_id: quotation.coupon_code_id,
      route_id: quotation.route_id,
      csr_id: quotation.csr_id,
      no_of_vehicles: quotation.no_of_vehicles,
      flight_number: quotation.flight_number,
      flight_time: quotation.flight_time,
      airport: quotation.airport,
      master_package_id: quotation.master_package_id,
      outstation_module_type: quotation.outstation_module_type,
      master_vehicle_type_id: quotation.master_vehicle_type_id,
      base_vehicle_id: quotation.base_vehicle_id,
      device_type: quotation.device_type,
      reschedule_date: quotation.reschedule_date,
      booking_release_date: quotation.booking_auto_relasedate,
      sac_code_id: quotation.sac_code_id,
      sac_code: quotation.sac_code,
      sac_description: quotation.sac_description,
      remark: quotation.remark,
      booking_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      charge_type: quotation.charge_type,
      filter_data: quotation.filter_data,
      preferred_booking: quotation.preferred_booking,
      placcard_name: quotation.placcard_name,
      pickup_point: quotation.pickup_point,
      pickup_type: quotation.pickup_type,
      inclusions_data: quotation.inclusions_data,
      exclusions_data: quotation.exclusions_data,
      fare_rule_data: quotation.fare_rule_data,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      created_by: quotation.created_by
    };

    // Remove undefined or empty values
    Object.keys(bookingVariable).forEach(key => {
      if (bookingVariable[key] === undefined || bookingVariable[key] === '') {
        delete bookingVariable[key];
      }
    });

    // Insert into booking table
    const booking = await Booking.create(bookingVariable);

    return booking;
  } catch (err) {
    console.error(err);
    throw new Error('Error copying booking data');
  }
};
export const copyBookingEstimationData = async function (reqData) {
  try {
    // Fetch estimation data from quotation_estimation by booking_id
    const [estimation] = await Booking.sequelize.query(
      'SELECT * FROM quotation_estimation WHERE booking_id = :id',
      {
        replacements: { id: reqData.id },
        type: Booking.sequelize.QueryTypes.SELECT,
      }
    );

    if (!estimation) {
      throw new Error('Quotation estimation not found');
    }

    // Prepare booking estimation data
    const bookingEstVariable = {
      booking_id: reqData.insertId,
      estimated_time: estimation.estimated_time,
      estimated_distance: estimation.estimated_distance,
      estimateprice_before_discount: estimation.estimateprice_before_discount,
      discount_price: estimation.discount_price,
      service_charge: estimation.service_charge,
      state_tax: estimation.state_tax,
      toll_tax: estimation.toll_tax,
      user_markup: estimation.user_markup,
      booking_amt_percentage: estimation.booking_amt_percentage,
      estimated_final_price: estimation.estimated_final_price,
      estimated_price_before_markup: estimation.estimated_price_before_markup,
      approx_distance_charge: estimation.approx_distance_charge,
      minimum_charge: estimation.minimum_charge,
      min_per_km_charge: estimation.min_per_km_charge,
      min_per_hr_charge: estimation.min_per_hr_charge,
      min_minimum_charge: estimation.min_minimum_charge,
      approx_after_km: estimation.approx_after_km,
      approx_after_hour: estimation.approx_after_hour,
      approx_hour_charge: estimation.approx_hour_charge,
      approx_waiting_charge: estimation.approx_waiting_charge,
      approx_waiting_minute: estimation.approx_waiting_minute,
      night_rate_type: estimation.night_rate_type,
      night_rate_value: estimation.night_rate_value,
      night_rate_begins: estimation.night_rate_begins,
      night_rate_ends: estimation.night_rate_ends,
      night_charge_price: estimation.night_charge_price,
      premiums_type: estimation.premiums_type,
      premiums_value: estimation.premiums_value,
      premiums_price: estimation.premiums_price,
      extras: estimation.extras,
      extra_price: estimation.extra_price,
      peak_time_value: estimation.peak_time_value,
      peak_time_price: estimation.peak_time_price,
      booking_cancellation_rule: estimation.booking_cancellation_rule,
      cgst_tax: estimation.cgst_tax,
      igst_tax: estimation.igst_tax,
      sgst_tax: estimation.sgst_tax,
      total_tax_price: estimation.total_tax_price,
      currency_id: estimation.currency_id,
      coupon_type: estimation.coupon_type,
      service_charge_cgst_amount: estimation.service_charge_cgst_amount,
      service_charge_igst_amount: estimation.service_charge_igst_amount,
      service_charge_sgst_amount: estimation.service_charge_sgst_amount,
      service_charge_cgst: estimation.service_cgst_tax,
      service_charge_igst: estimation.service_igst_tax,
      service_charge_sgst: estimation.service_sgst_tax,
      service_tax_percentage: estimation.service_tax_percentage,
      service_tax_price: estimation.service_tax_price,
      service_charge_sac_code_id: estimation.sac_code_id_service,
      service_charge_sac_code: estimation.sac_code_service,
      service_charge_sac_code_description: estimation.sac_description_service,
      company_share_type: estimation.company_share_type,
      company_share_value: estimation.company_share_value,
      partner_share_type: estimation.partner_share_type,
      partner_share_value: estimation.partner_share_value,
      driver_share_type: estimation.driver_share_type,
      driver_share_value: estimation.driver_share_value,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    };

    // Remove undefined or empty values
    Object.keys(bookingEstVariable).forEach(key => {
      if (
        bookingEstVariable[key] === undefined ||
        bookingEstVariable[key] === ''
      ) {
        delete bookingEstVariable[key];
      }
    });

    // Insert into booking_estimation table
    const result = await BookingEstimation.create(bookingEstVariable);

    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error copying booking estimation data');
  }
};
export const copybookingPickDropData = async function (reqData) {
  try {
    // Fetch quotation_pickdrop_details by booking_id
    const [quotationPickDrop] = await Booking.sequelize.query(
      'SELECT * FROM quotation_pickdrop_details WHERE booking_id = :id',
      {
        replacements: { id: reqData.id },
        type: Booking.sequelize.QueryTypes.SELECT,
      }
    );

    if (!quotationPickDrop) {
      throw new Error('Quotation pick/drop details not found');
    }

    // Prepare insert values
    const insertValues = {
      booking_id: reqData.insertId,
      adults: quotationPickDrop.adults,
      childs: quotationPickDrop.childs,
      luggages: quotationPickDrop.luggages,
      smallluggage: quotationPickDrop.smallluggage || 0,
      infants: quotationPickDrop.infant,
      sr_citizens: quotationPickDrop.sr_citizen,
      pickup_date: quotationPickDrop.pickup_date,
      pickup_time: quotationPickDrop.pickup_time,
      pickup_area: quotationPickDrop.pickup_area,
      pickup_address: quotationPickDrop.pickup_address,
      pickup_country: quotationPickDrop.pickup_country,
      pickup_state: quotationPickDrop.pickup_state,
      pickup_city: quotationPickDrop.pickup_city,
      pickup_landmark: quotationPickDrop.pickup_landmark,
      pickup_latitude: quotationPickDrop.pickup_latitude,
      pickup_longitude: quotationPickDrop.pickup_longitude,
      pickup_zone: quotationPickDrop.pickup_zone,
      drop_date: quotationPickDrop.drop_date,
      drop_time: quotationPickDrop.drop_time,
      drop_area: quotationPickDrop.drop_area,
      drop_address: quotationPickDrop.drop_address,
      drop_country: quotationPickDrop.drop_country,
      drop_state: quotationPickDrop.drop_state,
      drop_city: quotationPickDrop.drop_city,
      drop_landmark: quotationPickDrop.drop_landmark,
      drop_latitude: quotationPickDrop.drop_latitude,
      drop_longitude: quotationPickDrop.drop_longitude,
      drop_zone: quotationPickDrop.drop_zone,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    };

    // Remove undefined or empty values
    Object.keys(insertValues).forEach(key => {
      if (insertValues[key] === undefined || insertValues[key] === '') {
        delete insertValues[key];
      }
    });

    // Insert into booking_pickdrop_details table
    const result = await BookingPickDropDetails.create(insertValues);

    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error copying booking pick/drop data');
  }
};

export const copyItineraryData = async function (reqData) {
  try {
    // Fetch quotation_itinerary_details by booking_id
    const [quotationItinerary] = await Booking.sequelize.query(
      'SELECT * FROM quotation_itinerary_details WHERE booking_id = :id',
      {
        replacements: { id: reqData.id },
        type: Booking.sequelize.QueryTypes.SELECT,
      }
    );

    if (!quotationItinerary) {
      throw new Error('Quotation itinerary details not found');
    }

    // Prepare insert values
    const insertValues = {
      booking_id: reqData.insertId,
      itinerary_id: reqData.itinerary_id,
      pickup_date: quotationItinerary.pickup_date,
      pickup_time: quotationItinerary.pickup_time,
      drop_date: quotationItinerary.drop_date,
      drop_time: quotationItinerary.drop_time,
      pickcity_id: quotationItinerary.pickcity_id,
      dropcity_id: quotationItinerary.dropcity_id,
      duration: quotationItinerary.duration,
      distance: quotationItinerary.distance,
      days: quotationItinerary.days,
      pickup_address: quotationItinerary.pickup_address,
      pickup_latitude: quotationItinerary.pickup_latitude,
      pickup_longitude: quotationItinerary.pickup_longitude,
      drop_address: quotationItinerary.drop_address,
      drop_latitude: quotationItinerary.drop_latitude,
      drop_longitude: quotationItinerary.drop_longitude,
      created_by: quotationItinerary.created_by,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
      ip: reqData.ip,
    };

    // Remove undefined or empty values
    Object.keys(insertValues).forEach(key => {
      if (insertValues[key] === undefined || insertValues[key] === '') {
        delete insertValues[key];
      }
    });

    // Insert into itinerary_details table
    const [result] = await Booking.sequelize.query(
      `INSERT INTO itinerary_details (${Object.keys(insertValues).join(',')}) VALUES (${Object.keys(insertValues).map(() => '?').join(',')})`,
      {
        replacements: Object.values(insertValues),
        type: Booking.sequelize.QueryTypes.INSERT,
      }
    );

    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error copying itinerary data');
  }
};
export const copybookingMarkupData = async function (reqData) {
  try {
    // Fetch markup data from quotation_markup by booking_id
    const [markup] = await Booking.sequelize.query(
      'SELECT * FROM quotation_markup WHERE booking_id = :id',
      {
        replacements: { id: reqData.id },
        type: Booking.sequelize.QueryTypes.SELECT,
      }
    );

    if (!markup) {
      throw new Error('Quotation markup not found');
    }

    // Prepare insert values
    const insertValues = {
      booking_id: reqData.insertId,
      user_id: markup.user_id,
      markup_amt_base: markup.markup_amt_base,
      mark_amt_type: markup.mark_amt_type,
      basic_amt: markup.basic_amt,
      extra_km_markup: markup.extra_km_markup,
      extra_hr_markup: markup.extra_hr_markup,
      markup_amount: markup.markup_amount,
      created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
    };

    // Remove undefined or empty values
    Object.keys(insertValues).forEach(key => {
      if (insertValues[key] === undefined || insertValues[key] === '') {
        delete insertValues[key];
      }
    });

    // Insert into user_markup table
    const [result] = await Booking.sequelize.query(
      `INSERT INTO user_markup (${Object.keys(insertValues).join(',')}) VALUES (${Object.keys(insertValues).map(() => '?').join(',')})`,
      {
        replacements: Object.values(insertValues),
        type: Booking.sequelize.QueryTypes.INSERT,
      }
    );

    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Error copying booking markup data');
  }
};