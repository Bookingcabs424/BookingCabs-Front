import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";

class TourTypeController {
    static async GetAllTourBookingTypes(req, res){
        try {
            const sql = ` SELECT * FROM tour_type `
            const tourTypes = await sequelize.query(sql, { type: QueryTypes.SELECT });
            return res.status(200).json({ success: true, data: tourTypes });
        } catch (error) {
            console.log("error", error);
            return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
        }
    }
}

export default TourTypeController;