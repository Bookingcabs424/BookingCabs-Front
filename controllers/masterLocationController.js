import MasterLocation from "../models/masterlocationModel.js";
import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from 'sequelize';
import dateFormat from 'dateformat';
import { getLatLon } from "../index.js"; // Import your existing function

class MasterLocationController {

    // Get all locations with joins and filtering
    static async getLocations(req, res) {
        try {
            const { 
                country_id, 
                state_id, 
                city_id, 
                auto_id,
                area,
                zone
            } = req.body;

            let sql = `
                SELECT 
                    ml.*,
                    mc.name as country_name,
                    ms.name as state_name,
                    mct.name as city_name
                FROM master_location as ml
                LEFT JOIN master_country as mc ON ml.country_id = mc.id
                LEFT JOIN master_state as ms ON ml.state_id = ms.id
                LEFT JOIN master_city as mct ON ml.city_id = mct.id
                WHERE 1=1
            `;

            const replacements = {};

            if (country_id && country_id !== '') {
                const countryIds = country_id.split(',').map(item => item.trim());
                sql += ' AND ml.country_id IN (:countryIds)';
                replacements.countryIds = countryIds;
            }

            if (state_id && state_id !== '') {
                const stateIds = state_id.split(',').map(item => item.trim());
                sql += ' AND ml.state_id IN (:stateIds)';
                replacements.stateIds = stateIds;
            }

            if (city_id && city_id !== '') {
                const cityIds = city_id.split(',').map(item => item.trim());
                sql += ' AND ml.city_id IN (:cityIds)';
                replacements.cityIds = cityIds;
            }

            if (area && area !== '') {
                sql += ' AND ml.area LIKE :area';
                replacements.area = `%${area}%`;
            }

            if (zone && zone !== '') {
                sql += ' AND ml.zone LIKE :zone';
                replacements.zone = `%${zone}%`;
            }

            if (auto_id && auto_id !== '') {
                sql += ' AND ml.id = :auto_id';
                replacements.auto_id = auto_id;
            }

            sql += ' ORDER BY ml.id DESC';

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
                    message: 'No locations found'
                });
            }
        } catch (error) {
            console.error('Error in getLocations:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Add new location with automatic geocoding
    static async addLocation(req, res) {
        try {
            const {
                country_id,
                state_id,
                city_id,
                area,
                zone,
                latitude,
                longitude
            } = req.body;

            if (!country_id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'country_id is required'
                });
            }

            let finalLatitude = latitude || '0.0';
            let finalLongitude = longitude || '0.0';

            // If city_id is provided but no coordinates, try to fetch them automatically
            if (city_id && (!latitude || !longitude || latitude === '0.0' || longitude === '0.0')) {
                try {
                    // Get city details to fetch coordinates
                    const [cityResult] = await sequelize.query(
                        `SELECT name FROM master_city WHERE id = :city_id`,
                        {
                            replacements: { city_id },
                            type: QueryTypes.SELECT,
                        }
                    );

                    if (cityResult) {
                        const cityName = cityResult.name;
                        const { lat, lon } = await getLatLon(cityName);

                        if (lat && lon) {
                            finalLatitude = lat.toString();
                            finalLongitude = lon.toString();
                            console.log(`Auto-fetched coordinates for city: ${cityName} -> lat: ${finalLatitude}, lon: ${finalLongitude}`);
                        } else {
                            console.warn(`Could not fetch coordinates for city: ${cityName}`);
                        }
                    }
                } catch (geoError) {
                    console.error('Error in fetching city coordinates:', geoError.message);
                    // Continue with default coordinates even if geocoding fails
                }
            }

            // If area is provided but no coordinates, try to geocode the area
            if (area && area !== 'Not Available' && (!finalLatitude || !finalLongitude || finalLatitude === '0.0' || finalLongitude === '0.0')) {
                try {
                    const { lat, lon } = await getLatLon(area);
                    if (lat && lon) {
                        finalLatitude = lat.toString();
                        finalLongitude = lon.toString();
                        console.log(`Auto-fetched coordinates for area: ${area} -> lat: ${finalLatitude}, lon: ${finalLongitude}`);
                    }
                } catch (geoError) {
                    console.error('Error in fetching area coordinates:', geoError.message);
                }
            }

            const insertData = {
                country_id,
                state_id: state_id || null,
                city_id: city_id || null,
                latitude: finalLatitude,
                longitude: finalLongitude,
                area: area || 'Not Available',
                zone: zone || 'Not Available'
            };

            const newLocation = await MasterLocation.create(insertData);

            res.json({
                status: 'success',
                data: newLocation.id,
                message: 'Location added successfully'
            });

        } catch (error) {
            console.error('Error in addLocation:', error);
            
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid foreign key reference (country_id, state_id, or city_id)'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Update location
    static async updateLocation(req, res) {
        try {
            const {
                auto_id,
                country_id,
                state_id,
                city_id,
                area,
                zone,
                latitude,
                longitude
            } = req.body;

            if (!auto_id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'auto_id is required'
                });
            }

            const updateData = {};

            if (country_id !== undefined) updateData.country_id = country_id;
            if (state_id !== undefined) updateData.state_id = state_id;
            if (city_id !== undefined) updateData.city_id = city_id;
            if (area !== undefined) updateData.area = area;
            if (zone !== undefined) updateData.zone = zone;
            if (latitude !== undefined) updateData.latitude = latitude;
            if (longitude !== undefined) updateData.longitude = longitude;

            // If city_id changed and no coordinates provided, try to fetch new coordinates
            if (city_id && (!latitude || !longitude || latitude === '0.0' || longitude === '0.0')) {
                try {
                    const [cityResult] = await sequelize.query(
                        `SELECT name FROM master_city WHERE id = :city_id`,
                        {
                            replacements: { city_id },
                            type: QueryTypes.SELECT,
                        }
                    );

                    if (cityResult) {
                        const cityName = cityResult.name;
                        const { lat, lon } = await getLatLon(cityName);

                        if (lat && lon) {
                            updateData.latitude = lat.toString();
                            updateData.longitude = lon.toString();
                            console.log(`Auto-updated coordinates for city: ${cityName}`);
                        }
                    }
                } catch (geoError) {
                    console.error('Error in updating city coordinates:', geoError.message);
                }
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'No valid fields to update'
                });
            }

            const [affectedRows] = await MasterLocation.update(updateData, {
                where: { id: auto_id }
            });

            if (affectedRows > 0) {
                res.json({
                    status: 'success',
                    message: 'Location updated successfully'
                });
            } else {
                res.status(404).json({
                    status: 'failed',
                    message: 'Location not found or no changes made'
                });
            }

        } catch (error) {
            console.error('Error in updateLocation:', error);
            
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid foreign key reference'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Delete locations (multiple)
    static async deleteLocations(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id is required'
                });
            }

            const idArray = id.split(',').map(item => item.trim());

            const deletedCount = await MasterLocation.destroy({
                where: { id: idArray }
            });

            res.json({
                status: 'success',
                message: 'Locations deleted successfully',
                deletedCount
            });

        } catch (error) {
            console.error('Error in deleteLocations:', error);
            
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot delete location as it is being used by other records'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Search locations
    static async searchLocations(req, res) {
        try {
            const { search_term, country_id, state_id, city_id } = req.body;

            if (!search_term) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'search_term is required'
                });
            }

            let sql = `
                SELECT 
                    ml.*,
                    mc.name as country_name,
                    ms.name as state_name,
                    mct.name as city_name
                FROM master_location as ml
                LEFT JOIN master_country as mc ON ml.country_id = mc.id
                LEFT JOIN master_state as ms ON ml.state_id = ms.id
                LEFT JOIN master_city as mct ON ml.city_id = mct.id
                WHERE (ml.area LIKE :search_term OR ml.zone LIKE :search_term OR mct.name LIKE :search_term OR ms.name LIKE :search_term OR mc.name LIKE :search_term)
            `;

            const replacements = {
                search_term: `%${search_term}%`
            };

            if (country_id && country_id !== '') {
                sql += ' AND ml.country_id = :country_id';
                replacements.country_id = country_id;
            }

            if (state_id && state_id !== '') {
                sql += ' AND ml.state_id = :state_id';
                replacements.state_id = state_id;
            }

            if (city_id && city_id !== '') {
                sql += ' AND ml.city_id = :city_id';
                replacements.city_id = city_id;
            }

            sql += ' ORDER BY ml.area ASC LIMIT 50';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in searchLocations:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Get locations by coordinates (nearby locations)
    static async getLocationsByCoordinates(req, res) {
        try {
            const { latitude, longitude, radius_km = 10 } = req.body;

            if (!latitude || !longitude) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'latitude and longitude are required'
                });
            }

            const sql = `
                SELECT 
                    ml.*,
                    mc.name as country_name,
                    ms.name as state_name,
                    mct.name as city_name,
                    (6371 * acos(cos(radians(:latitude)) * cos(radians(CAST(ml.latitude AS DECIMAL(10,6)))) * cos(radians(CAST(ml.longitude AS DECIMAL(10,6))) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(CAST(ml.latitude AS DECIMAL(10,6)))))) AS distance
                FROM master_location as ml
                LEFT JOIN master_country as mc ON ml.country_id = mc.id
                LEFT JOIN master_state as ms ON ml.state_id = ms.id
                LEFT JOIN master_city as mct ON ml.city_id = mct.id
                WHERE ml.latitude != '0.0' AND ml.longitude != '0.0'
                HAVING distance < :radius_km
                ORDER BY distance ASC
                LIMIT 20
            `;

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    radius_km: parseFloat(radius_km)
                }
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in getLocationsByCoordinates:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}

export default MasterLocationController;