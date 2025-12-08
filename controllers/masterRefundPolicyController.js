import sequelize from "../config/clientDbManager.js";
import { QueryTypes } from 'sequelize';
import dateFormat from 'dateformat';

class MasterRefundPolicyController {

  static async getRefundPolicyDetails(req, res) {
    try {
      const { booking_type, country_id, status, auto_id } = req.body;

      let sql = `
        SELECT 
          mrp.*,
          mc.name AS country_name,
          tt.tour_type as package_name 
        FROM master_refund_policy as mrp 
        LEFT JOIN tour_type as tt ON mrp.booking_type = tt.id 
        LEFT JOIN master_country as mc ON mrp.country_id = mc.id 
        WHERE 1=1
      `;

      const replacements = {};

      if (booking_type && booking_type !== '') {
        const bookingTypes = booking_type.split(',').map(item => item.trim());
        sql += ' AND mrp.booking_type IN (:bookingTypes)';
        replacements.bookingTypes = bookingTypes;
      }

      if (country_id && country_id !== '') {
        const countryIds = country_id.split(',').map(item => item.trim());
        sql += ' AND mrp.country_id IN (:countryIds)';
        replacements.countryIds = countryIds;
      }

      if (status && status !== '') {
        sql += ' AND mrp.status = :status';
        replacements.status = status;
      }

      if (auto_id && auto_id !== '') {
        sql += ' AND mrp.id = :autoId';
        replacements.autoId = auto_id;
      }

      sql += ' ORDER BY mrp.id DESC';

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
      console.error('Error in getRefundPolicyDetails:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  static async addRefundPolicyDetails(req, res) {
    try {
      const {
        country_id,
        booking_type,
        title,
        description,
        ip,
        status,
        created_by
      } = req.body;

      const insertValue = {
        country_id,
        booking_type,
        title,
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
      const sql = `INSERT INTO master_refund_policy (${columns.join(', ')}) VALUES (${placeholders})`;

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
      console.error('Error in addRefundPolicyDetails:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }


  static async updateRefundPolicyDetails(req, res) {
    try {
      const {
        auto_id,
        country_id,
        booking_type,
        title,
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
        country_id,
        booking_type,
        title,
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

      const sql = `UPDATE master_refund_policy SET ${setClause} WHERE id = :autoId`;
      
      await sequelize.query(sql, {
        replacements: {
          ...updateValue,
          autoId: auto_id
        },
        type: QueryTypes.UPDATE
      });

      res.json({
        status: 'success',
        message: 'Data updated successfully'
      });

    } catch (error) {
      console.error('Error in updateRefundPolicyDetails:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

 
  static async refundPolicyStatus(req, res) {
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

      const sql = 'UPDATE master_refund_policy SET status = :status, modified_by = :userId, modified_date = :modifiedDate WHERE id IN (:idArray)';

      await sequelize.query(sql, {
        replacements: {
          status,
          userId: user_id,
          idArray,
          modifiedDate: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
        },
        type: QueryTypes.UPDATE
      });

      res.json({
        status: 'success',
        message: 'Records updated successfully'
      });

    } catch (error) {
      console.error('Error in refundPolicyStatus:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }
}

export default MasterRefundPolicyController;