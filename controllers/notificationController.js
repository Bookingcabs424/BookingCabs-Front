import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from 'sequelize';


import { errorResponse } from "../utils/response.js";
import { sendEmailWithAttachment } from "../utils/emailSender.js";
import sendSMS from "../utils/sendSMS.js";
import SmsTemplate from "../models/smsTemplateModel.js";
import { safeRender } from "./quotationHelper.js";


class NotificationController {

    // Send claim booking SMS - Updated using your existing patterns
    static async sendClaimBookingSms(req, res) {
        const { booking_id } = req.body;

        if (typeof booking_id === "undefined" || booking_id === "") {
            return errorResponse(res, "Booking ID is required", {}, 400);
        }

        try {
            // Get booking details with driver information 
            const bookingSql = `
                SELECT 
                    b.*,
                    CONCAT(u.first_name, ' ', u.last_name) as clientname,
                    u.mobile as client_mobile,
                    u.email as client_email,
                    CONCAT(d.first_name, ' ', d.last_name) as   ,
                    d.mobile as driver_mobile,
                    vm.vehicle_no,
                    b.reference_number as ref,
                    b.ordertime,
                    b.booking_date
                FROM booking b
                JOIN user u ON u.id = b.user_id
                LEFT JOIN driver d ON d.id = b.driver_id
                LEFT JOIN vehicle_master vm ON vm.id = d.vehicle_id
                WHERE b.booking_id = :booking_id
`;

            const bookingData = await sequelize.query(bookingSql, {
                type: QueryTypes.SELECT,
                replacements: { booking_id }
            });

            if (!bookingData || bookingData.length === 0) {
                return errorResponse(res, "Booking not found", {}, 404);
            }

            const booking = bookingData[0];

            // Check if booking has a driver assigned
            if (booking.driver_id === 0 || !booking.driver_id) {
                return errorResponse(res, "No driver assigned to this booking", {}, 400);
            }

            // Get SMS template for booking acceptance - using your pattern
            const smsTemplate = await SmsTemplate.findOne({
                where: { msg_type: 'accept' } // Changed to match your template query pattern
            });

            if (!smsTemplate) {
                return errorResponse(res, "SMS template not found", {}, 404);
            }

            // Prepare template data - similar to your quotation pattern
            const templateData = {
                username: booking.clientname || 'Customer',
                driver_name: booking.driver_name || 'Driver',
                driver_mobile: booking.driver_mobile || 'N/A',
                vehicle_no: booking.vehicle_no || 'N/A',
                booking_ref_no: booking.ref || 'N/A',
                pickup_time: booking.ordertime || 'N/A',
                mobile_no: booking.client_mobile || 'N/A',
                booking_ref: booking.ref || 'N/A', // Your pattern uses this
                booking_type: booking.booking_type || 'N/A', // Your pattern uses this
                last_date: booking.booking_date || 'N/A' // Your pattern uses this
            };

            // Replace placeholders in SMS template - using your exact pattern
            let smsMessage = smsTemplate.message
                .replace(/{#username#}/g, templateData.username)
                .replace(/{#driver_name#}/g, templateData.driver_name)
                .replace(/{#driver_mobile#}/g, templateData.driver_mobile)
                .replace(/{#vehicle_no#}/g, templateData.vehicle_no)
                .replace(/{#booking_ref_no#}/g, templateData.booking_ref_no)
                .replace(/{#pickup_time#}/g, templateData.pickup_time)
                .replace(/{#mobile_no#}/g, templateData.mobile_no)
                .replace(/{#booking_ref#}/g, templateData.booking_ref)
                .replace(/{#booking_type#}/g, templateData.booking_type)
                .replace(/{#last_date#}/g, templateData.last_date);

            console.log('SMS Message:', smsMessage);

            // Send SMS using your existing sendSMS function
            let smsResult = await sendSMS(booking.client_mobile, smsMessage);

            // Prepare and send email (optional) - using your email pattern
            let emailResult = null;
            if (booking.client_email) {
                // Get email template - similar to your pattern
                const emailTemplate = await EmailTemplate.findOne({ 
                    where: { name: 'driver_info' } 
                });

                if (emailTemplate) {
                    const emailData = {
                        username: booking.clientname,
                        booking_ref_no: booking.ref,
                        pickup_time: booking.ordertime,
                        driver_name: booking.driver_name,
                        driver_contact_no: booking.driver_mobile,
                        vehicle_no: booking.vehicle_no,
                        date: booking.ordertime,
                        company_logo: '',
                        booking_ref: booking.ref, // Your pattern uses this
                        user_name: booking.clientname, // Your pattern uses this
                        user_mobile: booking.client_mobile // Your pattern uses this
                    };

                    const compiledHtml = await safeRender(emailTemplate.description, emailData);
                    
                    emailResult = await sendEmailWithAttachment(
                        booking.client_email,
                        'Booking Confirmation - Driver Details',
                        compiledHtml,
                        null, // No attachment for now
                        null // No filename for now
                    );
                }
            }

            return res.json({
                status: "success",
                message: "Booking confirmation SMS sent successfully",
                data: {
                    booking_id: booking_id,
                    client_mobile: booking.client_mobile,
                    client_email: booking.client_email,
                    driver_name: booking.driver_name,
                    vehicle_no: booking.vehicle_no,
                    reference_number: booking.ref
                },
                sms: smsResult,
                email: emailResult
            });

        } catch (err) {
            console.log('Error in sendClaimBookingSms:', err);
            return errorResponse(res, "Internal server error", err.message, 500);
        }
    }

    // Additional helper method to get SMS configuration (for debugging)
    // static async getSmsConfig(res) {
    //     try {
    //         // If you have an SmsConfig model, use it like your other models
    //         const smsConfig = await SmsConfig.findOne({ where: { id: 1 } });
            
    //         return res.json({
    //             status: "success",
    //             data: smsConfig
    //         });
    //     } catch (err) {
    //         console.log('Error getting SMS config:', err);
    //         return errorResponse(res, "Internal server error", err.message, 500);
    //     }
    // }
}

export default NotificationController;