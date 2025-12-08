import MasterBookingType from "../models/masterBookingTypeModel.js";


export const getAllBookingTypes = async (req, res) => {
    try {
        const bookingTypes = await MasterBookingType.findAll();
        res.status(200).json({
            status: 'success',
            data: bookingTypes
        });
    } catch (error) {
        console.error('Error fetching booking types:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}