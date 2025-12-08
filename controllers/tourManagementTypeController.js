import MasterTourTheme from "../models/tourManagementTypeModel.js";
import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from 'sequelize';
import dateFormat from 'dateformat';

class MasterTourThemeController {

    // Get all tour themes with joins and filtering
    static async getTourThemes(req, res) {
        try {
            const { 
                tour_type, 
                status, 
                auto_id,
                theme_name 
            } = req.body;

            let sql = `
                SELECT 
                    mtt.*,
                    tt.tour_type as tour_type_name,
                    uc.username as created_by_name,
                    um.username as modified_by_name
                FROM master_tour_theme as mtt
                LEFT JOIN tour_type as tt ON mtt.tour_type = tt.id
                LEFT JOIN user as uc ON mtt.created_by = uc.id
                LEFT JOIN user as um ON mtt.modified_by = um.id
                WHERE 1=1
            `;

            const replacements = {};

            if (tour_type && tour_type !== '') {
                const tourTypes = tour_type.split(',').map(item => item.trim());
                sql += ' AND mtt.tour_type IN (:tourTypes)';
                replacements.tourTypes = tourTypes;
            }

            if (status && status !== '') {
                sql += ' AND mtt.status = :status';
                replacements.status = status;
            }

            if (auto_id && auto_id !== '') {
                sql += ' AND mtt.id = :auto_id';
                replacements.auto_id = auto_id;
            }

            if (theme_name && theme_name !== '') {
                sql += ' AND mtt.theme_name LIKE :theme_name';
                replacements.theme_name = `%${theme_name}%`;
            }

            sql += ' ORDER BY mtt.id DESC';

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
                    message: 'No tour themes found'
                });
            }
        } catch (error) {
            console.error('Error in getTourThemes:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Add new tour theme
    static async addTourTheme(req, res) {
        try {
            const {
                tour_type,
                theme_name,
                icon,
                meta_title,
                meta_description,
                meta_keywords,
                ip,
                status,
                created_by
            } = req.body;

            if (!tour_type || !theme_name || !created_by) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'tour_type, theme_name, and created_by are required'
                });
            }

            const insertData = {
                tour_type,
                theme_name,
                icon: icon || null,
                meta_title: meta_title || null,
                meta_description: meta_description || null,
                meta_keywords: meta_keywords || null,
                ip: ip || null,
                status: status || 1,
                created_by,
                created_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
                modified_by: created_by,
                modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            };

            const newTourTheme = await MasterTourTheme.create(insertData);

            res.json({
                status: 'success',
                data: newTourTheme.id,
                message: 'Tour theme added successfully'
            });

        } catch (error) {
            console.error('Error in addTourTheme:', error);
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Tour theme name already exists'
                });
            }

            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid foreign key reference (tour_type or created_by)'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Update tour theme
    static async updateTourTheme(req, res) {
        try {
            const {
                auto_id,
                tour_type,
                theme_name,
                icon,
                meta_title,
                meta_description,
                meta_keywords,
                ip,
                status,
                modified_by
            } = req.body;

            if (!auto_id || !modified_by) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'auto_id and modified_by are required'
                });
            }

            const updateData = {
                modified_by,
                modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            };

            if (tour_type !== undefined) updateData.tour_type = tour_type;
            if (theme_name !== undefined) updateData.theme_name = theme_name;
            if (icon !== undefined) updateData.icon = icon;
            if (meta_title !== undefined) updateData.meta_title = meta_title;
            if (meta_description !== undefined) updateData.meta_description = meta_description;
            if (meta_keywords !== undefined) updateData.meta_keywords = meta_keywords;
            if (ip !== undefined) updateData.ip = ip;
            if (status !== undefined) updateData.status = status;

            const [affectedRows] = await MasterTourTheme.update(updateData, {
                where: { id: auto_id }
            });

            if (affectedRows > 0) {
                res.json({
                    status: 'success',
                    message: 'Tour theme updated successfully'
                });
            } else {
                res.status(404).json({
                    status: 'failed',
                    message: 'Tour theme not found or no changes made'
                });
            }

        } catch (error) {
            console.error('Error in updateTourTheme:', error);
            
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Tour theme name already exists'
                });
            }

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

    // Update tour theme status (multiple)
    static async updateTourThemeStatus(req, res) {
        try {
            const { id, user_id, status } = req.body;

            if (!id || !user_id || status === undefined) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id, user_id, and status are required'
                });
            }

            const idArray = id.split(',').map(item => item.trim());

            const [affectedRows] = await MasterTourTheme.update({
                status,
                modified_by: user_id,
                modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            }, {
                where: { id: idArray }
            });

            res.json({
                status: 'success',
                message: 'Tour themes status updated successfully',
                affectedRows
            });

        } catch (error) {
            console.error('Error in updateTourThemeStatus:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Delete tour themes (multiple)
    static async deleteTourThemes(req, res) {
        try {
            const { id, user_id } = req.body;

            if (!id || !user_id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id and user_id are required'
                });
            }

            const idArray = id.split(',').map(item => item.trim());

            const deletedCount = await MasterTourTheme.destroy({
                where: { id: idArray }
            });

            res.json({
                status: 'success',
                message: 'Tour themes deleted successfully',
                deletedCount
            });

        } catch (error) {
            console.error('Error in deleteTourThemes:', error);
            
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot delete tour theme as it is being used by other records'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Soft delete tour themes (update status to 2)
    static async softDeleteTourThemes(req, res) {
        try {
            const { id, user_id } = req.body;

            if (!id || !user_id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id and user_id are required'
                });
            }

            const idArray = id.split(',').map(item => item.trim());

            const [affectedRows] = await MasterTourTheme.update({
                status: 2,
                modified_by: user_id,
                modified_date: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            }, {
                where: { id: idArray }
            });

            res.json({
                status: 'success',
                message: 'Tour themes soft deleted successfully',
                affectedRows
            });

        } catch (error) {
            console.error('Error in softDeleteTourThemes:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Get tour themes by tour type
    static async getTourThemesByTourType(req, res) {
        try {
            const { tour_type, status } = req.body;

            if (!tour_type) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'tour_type is required'
                });
            }

            let sql = `
                SELECT 
                    mtt.*,
                    tt.tour_type as tour_type_name
                FROM master_tour_theme as mtt
                LEFT JOIN tour_type as tt ON mtt.tour_type = tt.id
                WHERE mtt.tour_type = :tour_type
            `;

            const replacements = { tour_type };

            if (status && status !== '') {
                sql += ' AND mtt.status = :status';
                replacements.status = status;
            }

            sql += ' ORDER BY mtt.theme_name ASC';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in getTourThemesByTourType:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Search tour themes
    static async searchTourThemes(req, res) {
        try {
            const { search_term, status } = req.body;

            if (!search_term) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'search_term is required'
                });
            }

            let sql = `
                SELECT 
                    mtt.*,
                    tt.tour_type as tour_type_name
                FROM master_tour_theme as mtt
                LEFT JOIN tour_type as tt ON mtt.tour_type = tt.id
                WHERE (mtt.theme_name LIKE :search_term OR mtt.meta_title LIKE :search_term OR mtt.meta_keywords LIKE :search_term)
            `;

            const replacements = {
                search_term: `%${search_term}%`
            };

            if (status && status !== '') {
                sql += ' AND mtt.status = :status';
                replacements.status = status;
            }

            sql += ' ORDER BY mtt.theme_name ASC LIMIT 50';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in searchTourThemes:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Get active tour themes for dropdown
    static async getActiveTourThemes(req, res) {
        try {
            const { tour_type } = req.body;

            let sql = `
                SELECT 
                    mtt.id,
                    mtt.theme_name,
                    mtt.icon,
                    mtt.tour_type,
                    tt.tour_type as tour_type_name
                FROM master_tour_theme as mtt
                LEFT JOIN tour_type as tt ON mtt.tour_type = tt.id
                WHERE mtt.status = 1
            `;

            const replacements = {};

            if (tour_type && tour_type !== '') {
                sql += ' AND mtt.tour_type = :tour_type';
                replacements.tour_type = tour_type;
            }

            sql += ' ORDER BY mtt.theme_name ASC';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in getActiveTourThemes:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Check if tour theme name exists
    static async checkThemeNameExists(req, res) {
        try {
            const { theme_name, tour_type, exclude_id } = req.body;

            if (!theme_name || !tour_type) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'theme_name and tour_type are required'
                });
            }

            const whereClause = { theme_name, tour_type };
            if (exclude_id) {
                whereClause.id = { [sequelize.Op.ne]: exclude_id };
            }

            const existingTheme = await MasterTourTheme.findOne({
                where: whereClause
            });

            res.json({
                status: 'success',
                exists: !!existingTheme,
                data: existingTheme ? {
                    id: existingTheme.id,
                    theme_name: existingTheme.theme_name,
                    tour_type: existingTheme.tour_type
                } : null
            });

        } catch (error) {
            console.error('Error in checkThemeNameExists:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Get tour types for dropdown
    static async getTourTypes(req, res) {
        try {
            const tourTypesSql = `
                SELECT id, tour_type as name 
                FROM tour_type 
                WHERE status = 1 
                ORDER BY tour_type ASC
            `;

            const tourTypes = await sequelize.query(tourTypesSql, { 
                type: QueryTypes.SELECT 
            });

            res.json({
                status: 'success',
                data: tourTypes
            });

        } catch (error) {
            console.error('Error in getTourTypes:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}

export default MasterTourThemeController;