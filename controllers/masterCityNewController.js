import MasterCity from "../models/MasterCity.js";
import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from 'sequelize';
import dateFormat from 'dateformat';

class MasterCityNewController {

    // Get all cities with filtering
    static async getCities(req, res) {
        try {
            const { 
                country_id, 
                state_id, 
                status, 
                auto_id,
                name,
                country_name,
                state_name
            } = req.body;

            let sql = `
                SELECT 
                    mc.*,
                    ms.name as state_name,
                    mc.country_name
                FROM master_city as mc
                LEFT JOIN master_state as ms ON mc.state_id = ms.id
                WHERE 1=1
            `;

            const replacements = {};

            if (country_id && country_id !== '') {
                const countryIds = country_id.split(',').map(item => item.trim());
                sql += ' AND mc.country_id IN (:countryIds)';
                replacements.countryIds = countryIds;
            }

            if (state_id && state_id !== '') {
                const stateIds = state_id.split(',').map(item => item.trim());
                sql += ' AND mc.state_id IN (:stateIds)';
                replacements.stateIds = stateIds;
            }

            if (status && status !== '') {
                sql += ' AND mc.status = :status';
                replacements.status = status;
            }

            if (auto_id && auto_id !== '') {
                sql += ' AND mc.id = :auto_id';
                replacements.auto_id = auto_id;
            }

            if (name && name !== '') {
                sql += ' AND mc.name LIKE :name';
                replacements.name = `%${name}%`;
            }

            if (country_name && country_name !== '') {
                sql += ' AND mc.country_name LIKE :country_name';
                replacements.country_name = `%${country_name}%`;
            }

            if (state_name && state_name !== '') {
                sql += ' AND ms.name LIKE :state_name';
                replacements.state_name = `%${state_name}%`;
            }

            sql += ' ORDER BY mc.country_name ASC, mc.name ASC';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            if (results.length > 0) {
                res.json({
                    status: 'success',
                    data: results
                });
            } else {
                res.status(404).json({
                    status: 'failed',
                    message: 'No cities found'
                });
            }
        } catch (error) {
            console.error('Error in getCities:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Add new city
    static async addCity(req, res) {
        try {
            const {
                name,
                state_id,
                state_code,
                state_name,
                country_id,
                country_name,
                country_code,
                nationality,
                local_hire,
                point_to_point,
                airport_transfer,
                one_way,
                outstation,
                activity,
                transport_package,
                country_latitude,
                country_longitude,
                phone_code,
                latitude,
                longitude,
                north_east_latitude,
                north_east_longitude,
                south_west_latitude,
                south_west_longitude,
                radius,
                currency_id,
                currency,
                currency_name,
                currency_symbol,
                timezones,
                flag_icon,
                status
            } = req.body;

            if (!name || !state_id || !country_id || !country_name) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'name, state_id, country_id, and country_name are required'
                });
            }

            const insertData = {
                name,
                state_id,
                state_code: state_code || '',
                state_name: state_name || '',
                country_id,
                country_name,
                country_code: country_code || '',
                nationality: nationality || '',
                local_hire: local_hire || 0,
                point_to_point: point_to_point || 0,
                airport_transfer: airport_transfer || 0,
                one_way: one_way || 0,
                outstation: outstation || 0,
                activity: activity || 0,
                transport_package: transport_package || 0,
                country_latitude: country_latitude || '',
                country_longitude: country_longitude || '',
                phone_code: phone_code || '',
                latitude: latitude || '',
                longitude: longitude || '',
                north_east_latitude: north_east_latitude || '',
                north_east_longitude: north_east_longitude || '',
                south_west_latitude: south_west_latitude || '',
                south_west_longitude: south_west_longitude || '',
                radius: radius || '',
                currency_id: currency_id || 0,
                currency: currency || '',
                currency_name: currency_name || '',
                currency_symbol: currency_symbol || '',
                timezones: timezones || '',
                flag_icon: flag_icon || '',
                status: status || 1
            };

            const newCity = await MasterCity.create(insertData);

            res.json({
                status: 'success',
                data: newCity.id,
                message: 'City added successfully'
            });

        } catch (error) {
            console.error('Error in addCity:', error);
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'City name already exists'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Update city
    static async updateCity(req, res) {
        try {
            const {
                auto_id,
                name,
                state_id,
                state_code,
                state_name,
                country_id,
                country_name,
                country_code,
                nationality,
                local_hire,
                point_to_point,
                airport_transfer,
                one_way,
                outstation,
                activity,
                transport_package,
                country_latitude,
                country_longitude,
                phone_code,
                latitude,
                longitude,
                north_east_latitude,
                north_east_longitude,
                south_west_latitude,
                south_west_longitude,
                radius,
                currency_id,
                currency,
                currency_name,
                currency_symbol,
                timezones,
                flag_icon,
                status
            } = req.body;

            if (!auto_id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'auto_id is required'
                });
            }

            const updateData = {};

            if (name !== undefined) updateData.name = name;
            if (state_id !== undefined) updateData.state_id = state_id;
            if (state_code !== undefined) updateData.state_code = state_code;
            if (state_name !== undefined) updateData.state_name = state_name;
            if (country_id !== undefined) updateData.country_id = country_id;
            if (country_name !== undefined) updateData.country_name = country_name;
            if (country_code !== undefined) updateData.country_code = country_code;
            if (nationality !== undefined) updateData.nationality = nationality;
            if (local_hire !== undefined) updateData.local_hire = local_hire;
            if (point_to_point !== undefined) updateData.point_to_point = point_to_point;
            if (airport_transfer !== undefined) updateData.airport_transfer = airport_transfer;
            if (one_way !== undefined) updateData.one_way = one_way;
            if (outstation !== undefined) updateData.outstation = outstation;
            if (activity !== undefined) updateData.activity = activity;
            if (transport_package !== undefined) updateData.transport_package = transport_package;
            if (country_latitude !== undefined) updateData.country_latitude = country_latitude;
            if (country_longitude !== undefined) updateData.country_longitude = country_longitude;
            if (phone_code !== undefined) updateData.phone_code = phone_code;
            if (latitude !== undefined) updateData.latitude = latitude;
            if (longitude !== undefined) updateData.longitude = longitude;
            if (north_east_latitude !== undefined) updateData.north_east_latitude = north_east_latitude;
            if (north_east_longitude !== undefined) updateData.north_east_longitude = north_east_longitude;
            if (south_west_latitude !== undefined) updateData.south_west_latitude = south_west_latitude;
            if (south_west_longitude !== undefined) updateData.south_west_longitude = south_west_longitude;
            if (radius !== undefined) updateData.radius = radius;
            if (currency_id !== undefined) updateData.currency_id = currency_id;
            if (currency !== undefined) updateData.currency = currency;
            if (currency_name !== undefined) updateData.currency_name = currency_name;
            if (currency_symbol !== undefined) updateData.currency_symbol = currency_symbol;
            if (timezones !== undefined) updateData.timezones = timezones;
            if (flag_icon !== undefined) updateData.flag_icon = flag_icon;
            if (status !== undefined) updateData.status = status;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'No valid fields to update'
                });
            }

            const [affectedRows] = await MasterCity.update(updateData, {
                where: { id: auto_id }
            });

            if (affectedRows > 0) {
                res.json({
                    status: 'success',
                    message: 'City updated successfully'
                });
            } else {
                res.status(404).json({
                    status: 'failed',
                    message: 'City not found or no changes made'
                });
            }

        } catch (error) {
            console.error('Error in updateCity:', error);
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'City name already exists'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Update city status (multiple)
    static async updateCityStatus(req, res) {
        try {
            const { id, status } = req.body;

            if (!id || status === undefined) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id and status are required'
                });
            }

            const idArray = id.split(',').map(item => item.trim());

            const [affectedRows] = await MasterCity.update({
                status
            }, {
                where: { id: idArray }
            });

            res.json({
                status: 'success',
                message: 'Cities status updated successfully',
                affectedRows
            });

        } catch (error) {
            console.error('Error in updateCityStatus:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Delete cities (multiple)
    static async deleteCities(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id is required'
                });
            }

            const idArray = id.split(',').map(item => item.trim());

            const deletedCount = await MasterCity.destroy({
                where: { id: idArray }
            });

            res.json({
                status: 'success',
                message: 'Cities deleted successfully',
                deletedCount
            });

        } catch (error) {
            console.error('Error in deleteCities:', error);
            
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot delete city as it is being used by other records'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Search cities
    static async searchCities(req, res) {
        try {
            const { search_term, status, country_id } = req.body;

            if (!search_term) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'search_term is required'
                });
            }

            let sql = `
                SELECT 
                    mc.*,
                    ms.name as state_name
                FROM master_city as mc
                LEFT JOIN master_state as ms ON mc.state_id = ms.id
                WHERE (mc.name LIKE :search_term OR mc.country_name LIKE :search_term OR ms.name LIKE :search_term)
            `;

            const replacements = {
                search_term: `%${search_term}%`
            };

            if (status && status !== '') {
                sql += ' AND mc.status = :status';
                replacements.status = status;
            }

            if (country_id && country_id !== '') {
                sql += ' AND mc.country_id = :country_id';
                replacements.country_id = country_id;
            }

            sql += ' ORDER BY mc.country_name ASC, mc.name ASC LIMIT 50';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in searchCities:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Get active cities for dropdown
    static async getActiveCities(req, res) {
        try {
            const { country_id, state_id } = req.body;

            let sql = `
                SELECT 
                    mc.id,
                    mc.name,
                    mc.state_id,
                    mc.country_id,
                    mc.country_name,
                    ms.name as state_name
                FROM master_city as mc
                LEFT JOIN master_state as ms ON mc.state_id = ms.id
                WHERE mc.status = 1
            `;

            const replacements = {};

            if (country_id && country_id !== '') {
                sql += ' AND mc.country_id = :country_id';
                replacements.country_id = country_id;
            }

            if (state_id && state_id !== '') {
                sql += ' AND mc.state_id = :state_id';
                replacements.state_id = state_id;
            }

            sql += ' ORDER BY mc.country_name ASC, mc.name ASC';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in getActiveCities:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Get cities by service type
    static async getCitiesByServiceType(req, res) {
        try {
            const { service_type, status, country_id } = req.body;

            if (!service_type) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'service_type is required'
                });
            }

            const serviceTypes = {
                'local_hire': 'local_hire',
                'point_to_point': 'point_to_point',
                'airport_transfer': 'airport_transfer',
                'one_way': 'one_way',
                'outstation': 'outstation',
                'activity': 'activity',
                'transport_package': 'transport_package'
            };

            const serviceColumn = serviceTypes[service_type];
            if (!serviceColumn) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid service type'
                });
            }

            let sql = `
                SELECT 
                    mc.*,
                    ms.name as state_name
                FROM master_city as mc
                LEFT JOIN master_state as ms ON mc.state_id = ms.id
                WHERE mc.${serviceColumn} = 1
            `;

            const replacements = {};

            if (status && status !== '') {
                sql += ' AND mc.status = :status';
                replacements.status = status;
            }

            if (country_id && country_id !== '') {
                sql += ' AND mc.country_id = :country_id';
                replacements.country_id = country_id;
            }

            sql += ' ORDER BY mc.country_name ASC, mc.name ASC';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in getCitiesByServiceType:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}

export default MasterCityNewController;