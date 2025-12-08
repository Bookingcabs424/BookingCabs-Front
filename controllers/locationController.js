import { Op } from "sequelize";
import MasterLocation from "../models/masterlocationModel.js";

// GET /location?area=somearea
export const get_location = async (req, res) => {
    try {
        let area = req.query.area || req.body.area;
        let cityId= req.query?.cityId|| req.body?.cityId
        let whereClause = {};
        if (!area || area === '') {
            return res.status(400).json({ status: 'failed', message: 'Area is required' });
        }

        whereClause.area = { [Op.like]: `%${area}%` };
  if (cityId) {
            whereClause.city_id = Number(cityId);
        }
        console.log({whereClause})
        const data = await MasterLocation.findAll({
            where: whereClause,
            limit: 10
        });

        if (data.length > 0) {
            res.json({ status: 'success', message: 'Get Location Successfully', data });
        } else {
            res.json({ status: 'failed', message: 'No Location Found!' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};


