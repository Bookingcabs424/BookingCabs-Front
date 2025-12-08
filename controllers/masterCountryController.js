import { Op } from 'sequelize';
import MasterCountry from '../models/masterCountryModel.js';
import { errorResponse, successResponse } from '../utils/response.js';

// Controller function to get countries
export const getCountry = async (req, res) => {
    try {
        const { country_name } = req.query;

        const where = {};
        if (country_name) {
            where.name = { [Op.like]: `${country_name}%` };
        }

        const countries = await MasterCountry.findAll({ where });

        return successResponse(res,"Sucesss",countries,200)
    } catch (err) {
        console.error(err);
        return errorResponse(res,"GENERAL ERROR",err,500)
    }
};



export const getAllCountries = async (req, res)=>{
    try {
        const countries = await MasterCountry.findAll();
        if(countries.length > 0){
            return res.json({
                status: 'success',
                data: countries
            });
        }
        else{
            return res.status(404).json({
                status: "failed",
                message: "no record found"
            });
        }
    } catch (error) {
        console.error('Error in getAllCountries:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}