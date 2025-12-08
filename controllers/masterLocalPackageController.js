import LocalPackage from "../models/localPackageModel.js";
import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from "sequelize";
import dateFormat from "dateformat";



class LocalPackageController {

    // Get all local packages with joins and filtering
    static async getLocalPackages(req, res) {
        try {
            const { 
                booking_type, 
                booking_mode, 
                status, 
                auto_id,
                name 
            } = req.body;

            let sql = `
                SELECT 
                    lp.id as local_package_id,
                    lp.booking_type,
                    lp.booking_mode,
                    mpm.package_mode as booking_mode_name,
                    mp.name as booking_type_name,
                    lp.name as package_name,
                    lp.hrs,
                    lp.km,
                    lp.status,
                    lp.display_order,
                    u.username as modified_by_name
                FROM local_package as lp
                LEFT JOIN master_package_mode as mpm ON lp.booking_mode = mpm.id
                LEFT JOIN master_package as mp ON lp.booking_type = mp.id
                LEFT JOIN user as u ON lp.modified_by = u.id
                WHERE lp.status != 2
            `;

            const replacements = {};

            if (booking_type && booking_type !== '') {
                const bookingTypes = booking_type.split(',').map(item => item.trim());
                sql += ' AND lp.booking_type IN (:bookingTypes)';
                replacements.bookingTypes = bookingTypes;
            }

            if (booking_mode && booking_mode !== '') {
                const bookingModes = booking_mode.split(',').map(item => item.trim());
                sql += ' AND lp.booking_mode IN (:bookingModes)';
                replacements.bookingModes = bookingModes;
            }

            if (status && status !== '') {
                sql += ' AND lp.status = :status';
                replacements.status = status;
            }

            if (auto_id && auto_id !== '') {
                sql += ' AND lp.id = :auto_id';
                replacements.auto_id = auto_id;
            }

            if (name && name !== '') {
                sql += ' AND lp.name LIKE :name';
                replacements.name = `%${name}%`;
            }

            sql += ' ORDER BY lp.display_order ASC, lp.id DESC';

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
                    message: 'No local packages found'
                });
            }
        } catch (error) {
            console.error('Error in getLocalPackages:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Add new local package
    static async addLocalPackage(req, res) {
        try {
            const {
                booking_type,
                booking_mode,
                name,
                hrs,
                km,
                modified_by,
                status,
                display_order
            } = req.body;

            if (!booking_type || !booking_mode || !hrs || !km || !modified_by) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'booking_type, booking_mode, hrs, km, and modified_by are required'
                });
            }

            const insertData = {
                booking_type,
                booking_mode,
                name: name || null,
                hrs,
                km,
                modified_by,
                status: status || 1,
                display_order: display_order || 1
            };

            const newLocalPackage = await LocalPackage.create(insertData);

            res.json({
                status: 'success',
                data: newLocalPackage.id,
                message: 'Local package added successfully'
            });

        } catch (error) {
            console.error('Error in addLocalPackage:', error);
            
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid foreign key reference (booking_type, booking_mode, or modified_by)'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Update local package
    static async updateLocalPackage(req, res) {
        try {
            const {
                auto_id,
                booking_type,
                booking_mode,
                name,
                hrs,
                km,
                modified_by,
                status,
                display_order
            } = req.body;

            if (!auto_id || !modified_by) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'auto_id and modified_by are required'
                });
            }

            const updateData = {
                modified_by
            };

            if (booking_type !== undefined) updateData.booking_type = booking_type;
            if (booking_mode !== undefined) updateData.booking_mode = booking_mode;
            if (name !== undefined) updateData.name = name;
            if (hrs !== undefined) updateData.hrs = hrs;
            if (km !== undefined) updateData.km = km;
            if (status !== undefined) updateData.status = status;
            if (display_order !== undefined) updateData.display_order = display_order;

            const [affectedRows] = await LocalPackage.update(updateData, {
                where: { id: auto_id }
            });

            if (affectedRows > 0) {
                res.json({
                    status: 'success',
                    message: 'Local package updated successfully'
                });
            } else {
                res.status(404).json({
                    status: 'failed',
                    message: 'Local package not found or no changes made'
                });
            }

        } catch (error) {
            console.error('Error in updateLocalPackage:', error);
            
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

    // Update local package status (multiple)
    static async updateMasterLocalPackageStatus(req, res) {
        try {
            const { id, user_id, status } = req.body;

            if (!id || !user_id || status === undefined) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id, user_id, and status are required'
                });
            }

            const idArray = id.split(',').map(item => item.trim());

            const [affectedRows] = await LocalPackage.update({
                status,
                modified_by: user_id
            }, {
                where: { id: idArray }
            });

            res.json({
                status: 'success',
                message: 'Local packages status updated successfully',
                affectedRows
            });

        } catch (error) {
            console.error('Error in updateLocalPackageStatus:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Delete local packages (multiple)
    static async deleteLocalPackages(req, res) {
        try {
            const { id, user_id } = req.body;

            if (!id || !user_id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id and user_id are required'
                });
            }

            const idArray = id.split(',').map(item => item.trim());

            const deletedCount = await LocalPackage.destroy({
                where: { id: idArray }
            });

            res.json({
                status: 'success',
                message: 'Local packages deleted successfully',
                deletedCount
            });

        } catch (error) {
            console.error('Error in deleteLocalPackages:', error);
            
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Cannot delete local package as it is being used by other records'
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Soft delete local packages (update status to 2)
    static async softDeleteLocalPackages(req, res) {
        try {
            const { id, user_id } = req.body;

            if (!id || !user_id) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'id and user_id are required'
                });
            }

            const idArray = id.split(',').map(item => item.trim());

            const [affectedRows] = await LocalPackage.update({
                status: 2,
                modified_by: user_id
            }, {
                where: { id: idArray }
            });

            res.json({
                status: 'success',
                message: 'Local packages soft deleted successfully',
                affectedRows
            });

        } catch (error) {
            console.error('Error in softDeleteLocalPackages:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Reorder local packages display order
    static async reorderLocalPackages(req, res) {
        try {
            const { order_data } = req.body;

            if (!order_data || !Array.isArray(order_data)) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'order_data array is required'
                });
            }

            const updatePromises = order_data.map(item => 
                LocalPackage.update(
                    { display_order: item.display_order },
                    { where: { id: item.id } }
                )
            );

            await Promise.all(updatePromises);

            res.json({
                status: 'success',
                message: 'Local packages reordered successfully'
            });

        } catch (error) {
            console.error('Error in reorderLocalPackages:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Get local packages by booking type and mode
    static async getPackagesByBookingTypeAndMode(req, res) {
        try {
            const { booking_type, booking_mode, status } = req.body;

            if (!booking_type || !booking_mode) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'booking_type and booking_mode are required'
                });
            }

            let sql = `
                SELECT 
                    lp.id as local_package_id,
                    lp.booking_type,
                    lp.booking_mode,
                    mpm.package_mode as booking_mode_name,
                    mp.name as booking_type_name,
                    lp.name as package_name,
                    lp.hrs,
                    lp.km,
                    lp.status,
                    lp.display_order
                FROM local_package as lp
                LEFT JOIN master_package_mode as mpm ON lp.booking_mode = mpm.id
                LEFT JOIN master_package as mp ON lp.booking_type = mp.id
                WHERE lp.status != 2 
                AND lp.booking_type = :booking_type 
                AND lp.booking_mode = :booking_mode
            `;

            const replacements = {
                booking_type,
                booking_mode
            };

            if (status && status !== '') {
                sql += ' AND lp.status = :status';
                replacements.status = status;
            }

            sql += ' ORDER BY lp.display_order ASC, lp.name ASC';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in getPackagesByBookingTypeAndMode:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Search local packages
    static async searchLocalPackages(req, res) {
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
                    lp.id as local_package_id,
                    lp.booking_type,
                    lp.booking_mode,
                    mpm.package_mode as booking_mode_name,
                    mp.name as booking_type_name,
                    lp.name as package_name,
                    lp.hrs,
                    lp.km,
                    lp.status,
                    lp.display_order
                FROM local_package as lp
                LEFT JOIN master_package_mode as mpm ON lp.booking_mode = mpm.id
                LEFT JOIN master_package as mp ON lp.booking_type = mp.id
                WHERE lp.status != 2 
                AND (lp.name LIKE :search_term OR mp.name LIKE :search_term OR mpm.package_mode LIKE :search_term)
            `;

            const replacements = {
                search_term: `%${search_term}%`
            };

            if (status && status !== '') {
                sql += ' AND lp.status = :status';
                replacements.status = status;
            }

            sql += ' ORDER BY lp.display_order ASC, lp.name ASC LIMIT 50';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in searchLocalPackages:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Get active local packages for dropdown
    static async getActiveLocalPackages(req, res) {
        try {
            const { booking_type, booking_mode } = req.body;

            let sql = `
                SELECT 
                    lp.id as local_package_id,
                    lp.name as package_name,
                    lp.hrs,
                    lp.km,
                    lp.booking_type,
                    lp.booking_mode,
                    mp.name as booking_type_name,
                    mpm.package_mode as booking_mode_name
                FROM local_package as lp
                LEFT JOIN master_package_mode as mpm ON lp.booking_mode = mpm.id
                LEFT JOIN master_package as mp ON lp.booking_type = mp.id
                WHERE lp.status = 1
            `;

            const replacements = {};

            if (booking_type && booking_type !== '') {
                sql += ' AND lp.booking_type = :booking_type';
                replacements.booking_type = booking_type;
            }

            if (booking_mode && booking_mode !== '') {
                sql += ' AND lp.booking_mode = :booking_mode';
                replacements.booking_mode = booking_mode;
            }

            sql += ' ORDER BY lp.display_order ASC, lp.name ASC';

            const results = await sequelize.query(sql, {
                type: QueryTypes.SELECT,
                replacements
            });

            res.json({
                status: 'success',
                data: results
            });

        } catch (error) {
            console.error('Error in getActiveLocalPackages:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Get booking types and modes for dropdowns
    static async getBookingTypesAndModes(req, res) {
        try {
            // Get distinct booking types from master_package
            const bookingTypesSql = `
                SELECT DISTINCT mp.id, mp.name 
                FROM master_package mp

                ORDER BY mp.name ASC
            `;

            // Get distinct booking modes from master_package_mode
            const bookingModesSql = `
                SELECT DISTINCT mpm.id, mpm.package_mode as name 
                FROM master_package_mode mpm
               
                ORDER BY mpm.package_mode ASC
            `;

            const [bookingTypes, bookingModes] = await Promise.all([
                sequelize.query(bookingTypesSql, { type: QueryTypes.SELECT }),
                sequelize.query(bookingModesSql, { type: QueryTypes.SELECT })
            ]);

            res.json({
                status: 'success',
                data: {
                    booking_types: bookingTypes,
                    booking_modes: bookingModes
                }
            });

        } catch (error) {
            console.error('Error in getBookingTypesAndModes:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}

export default LocalPackageController;
