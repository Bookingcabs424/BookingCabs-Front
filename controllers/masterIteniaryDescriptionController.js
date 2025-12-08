import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from 'sequelize';
import dateFormat from 'dateformat';

class MasterItineraryDescriptionController {

    static async getItineraryDescriptionDetails(req, res) {
        try {
            const { user_id, booking_type, country_id, start_city, destination_city, status, auto_id } = req.body;

            let sql = `
                SELECT mid.*, mcs.name AS start_city_name, mcd.name AS destination_city_name 
                FROM master_itinerary_description as mid 
                LEFT JOIN master_city as mcs ON mid.start_city = mcs.id 
                LEFT JOIN master_city as mcd ON mid.destination_city = mcd.id 
                WHERE 1=1
            `;

            const replacements = {};

            if (start_city && start_city !== '') {
                sql += ' AND mid.start_city = :start_city';
                replacements.start_city = start_city;
            }

            if (destination_city && destination_city !== '') {
                sql += ' AND mid.destination_city = :destination_city';
                replacements.destination_city = destination_city;
            }

            if (status && status !== '') {
                sql += ' AND mid.status = :status';
                replacements.status = status;
            }

            if (user_id && user_id !== '') {
                const userIds = user_id.split(',').map(item => item.trim());
                sql += ' AND mid.user_id IN (:userIds)';
                replacements.userIds = userIds;
            }

            if (auto_id && auto_id !== '') {
                sql += ' AND mid.id = :auto_id';
                replacements.auto_id = auto_id;
            }

            sql += ' ORDER BY mid.id DESC';

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
                    message: 'No record found'
                });
            }
        } catch (error) {
            console.error('Error in getItineraryDescriptionDetails:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    static async addItineraryDescriptionDetails(req, res) {
        try {
            const {
                user_id,
                start_city,
                destination_city,
                title,
                image_path,
                description,
                ip,
                status,
                created_by
            } = req.body;

            const insertValue = {
                user_id,
                start_city,
                destination_city,
                title,
                image_path,
                description,
                created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
                ip,
                status,
                created_by
            };

            // Remove undefined or empty values
            Object.keys(insertValue).forEach(key => {
                if (insertValue[key] === undefined || insertValue[key] === '') {
                    delete insertValue[key];
                }
            });

            // Create parameterized query
            const columns = Object.keys(insertValue);
            const placeholders = columns.map(col => `:${col}`).join(', ');
            const sql = `INSERT INTO master_itinerary_description (${columns.join(', ')}) VALUES (${placeholders})`;

            const [result] = await sequelize.query(sql, {
                replacements: insertValue,
                type: QueryTypes.INSERT
            });

            if (result) {
                res.json({
                    status: 'success',
                    data: result
                });
            } else {
                res.status(400).json({
                    status: 'failed',
                    message: 'Something went wrong'
                });
            }
        } catch (error) {
            console.error('Error in addItineraryDescriptionDetails:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    static async updateItineraryDescriptionDetails(req, res) {
        try {
            const {
                auto_id,
                user_id,
                start_city,
                destination_city,
                title,
                image_path,
                description,
                ip,
                status,
                modified_by
            } = req.body;

            if (!auto_id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'auto_id is required'
                });
            }

            const updateValue = {
                user_id,
                start_city,
                destination_city,
                title,
                image_path,
                description,
                ip,
                status,
                modified_by,
                modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            };

            // Remove undefined or empty values
            Object.keys(updateValue).forEach(key => {
                if (updateValue[key] === undefined || updateValue[key] === '') {
                    delete updateValue[key];
                }
            });

            if (Object.keys(updateValue).length === 0) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'No valid fields to update'
                });
            }

            const setClause = Object.keys(updateValue)
                .map(key => `${key} = :${key}`)
                .join(', ');

            const sql = `UPDATE master_itinerary_description SET ${setClause} WHERE id = :auto_id`;
            
            await sequelize.query(sql, {
                replacements: {
                    ...updateValue,
                    auto_id
                },
                type: QueryTypes.UPDATE
            });

            res.json({
                status: 'success',
                message: 'Data updated successfully'
            });

        } catch (error) {
            console.error('Error in updateItineraryDescriptionDetails:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    static async itineraryDescriptionStatus(req, res) {
        try {
            const { id, user_id, status } = req.body;

            if (!id || !user_id || status === undefined) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id, user_id, and status are required'
                });
            }

            // Convert id string to array for IN clause
            const idArray = id.split(',').map(item => item.trim());

            const sql = 'UPDATE master_itinerary_description SET status = :status, modified_by = :user_id, modified_date = :modified_date WHERE id IN (:idArray)';

            await sequelize.query(sql, {
                replacements: {
                    status,
                    user_id,
                    idArray,
                    modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
                },
                type: QueryTypes.UPDATE
            });

            res.json({
                status: 'success',
                message: 'Records updated successfully'
            });

        } catch (error) {
            console.error('Error in itineraryDescriptionStatus:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}

export default MasterItineraryDescriptionController;