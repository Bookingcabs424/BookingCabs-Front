import sequelize from "../config/clientDbManager.js";
import MasterModuleManager from "../models/masterModuleManager.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* ============================================================
   CREATE OR UPDATE SINGLE PERMISSION
============================================================ */
export const savePermission = async (req, res) => {
  try {
    const {
      usertype_id,
      module_id,
      is_read = 0,
      is_write = 0,
      is_delete = 0,
      order_menu = 0,
      status = 1,
      created_by = 0,
      modified_by = 0,
    } = req.body;

    if (!usertype_id || !module_id) {
      return errorResponse(res, "usertype_id and module_id are required");
    }

    const [existing] = await sequelize.query(
      `
      SELECT rule_id FROM usertype_module
      WHERE usertype_id = :usertype_id AND module_id = :module_id
      `,
      { replacements: { usertype_id, module_id } }
    );

    // UPDATE
    if (existing.length > 0) {
      await sequelize.query(
        `
        UPDATE usertype_module
        SET 
          is_read = :is_read,
          is_write = :is_write,
          is_delete = :is_delete,
          order_menu = :order_menu,
          status = :status,
          modified_by = :modified_by,
          modified_date = NOW()
        WHERE rule_id = :rule_id
        `,
        {
          replacements: {
            rule_id: existing[0].rule_id,
            is_read,
            is_write,
            is_delete,
            order_menu,
            status,
            modified_by,
          },
        }
      );

      return successResponse(res, "Permission updated successfully");
    }

    // INSERT
    await sequelize.query(
      `
      INSERT INTO usertype_module
      (usertype_id, module_id, is_read, is_write, is_delete, order_menu,
       created_by, created_date, modified_by, modified_date, status)
      VALUES
      (:usertype_id, :module_id, :is_read, :is_write, :is_delete, :order_menu,
       :created_by, CURDATE(), :modified_by, NOW(), :status)
      `,
      {
        replacements: {
          usertype_id,
          module_id,
          is_read,
          is_write,
          is_delete,
          order_menu,
          created_by,
          modified_by,
          status,
        },
      }
    );

    return successResponse(res, "Permission created successfully");
  } catch (err) {
    return errorResponse(res, "Failed to save permission", err.message);
  }
};

/* ============================================================
   BULK SAVE PERMISSIONS
============================================================ */
export const saveBulkPermissions = async (req, res) => {
  try {
    const { usertype_id, permissions } = req.body;

    if (!usertype_id || !permissions) {
      return errorResponse(res, "usertype_id and permissions array is required");
    }

    // DELETE OLD RECORDS
    await sequelize.query(
      `DELETE FROM usertype_module WHERE usertype_id = :usertype_id`,
      { replacements: { usertype_id } }
    );

    // INSERT NEW
    for (const p of permissions) {
      await sequelize.query(
        `
        INSERT INTO usertype_module (
          usertype_id, module_id, is_read, is_write, is_delete, order_menu,
          created_by, created_date, modified_by, modified_date, status
        )
        VALUES (
          :usertype_id, :module_id, :is_read, :is_write, :is_delete, :order_menu,
          :created_by, CURDATE(), :modified_by, NOW(), :status
        )
        `,
        {
          replacements: {
            usertype_id,
            module_id: p.module_id,
            is_read: p.read ?? 0,
            is_write: p.write ?? 0,
            is_delete: p.delete ?? 0,
            order_menu: p.order_menu ?? 0,
            created_by: p.created_by ?? 0,
            modified_by: p.modified_by ?? 0,
            status: p.status ?? 1,
          },
        }
      );
    }

    return successResponse(res, "Permissions saved successfully");
  } catch (err) {
    return errorResponse(res, "Bulk permission save failed", err.message);
  }
};

/* ============================================================
   GET PERMISSIONS (FLAT LIST)
============================================================ */
export const getPermissionsByUsertype = async (req, res) => {
  try {
    const { usertype_id } = req.params;

    const [rows] = await sequelize.query(
      `
      SELECT 
        m.module_id,
        m.module_name,
        m.parent_id,
        m.menu_order,

        utm.rule_id,
        utm.is_read,
        utm.is_write,
        utm.is_delete,
        utm.order_menu,
        utm.status AS permission_status
      FROM master_module_manager m
      LEFT JOIN usertype_module utm 
        ON utm.module_id = m.module_id AND utm.usertype_id = :usertype_id
      ORDER BY m.parent_id, m.menu_order, m.module_id ASC
      `,
      { replacements: { usertype_id } }
    );

    return successResponse(res, "Permissions loaded", rows);
  } catch (err) {
    return errorResponse(res, "Unable to fetch permissions", err.message);
  }
};

/* ============================================================
   GET NESTED MODULE LIST (with permissions)
============================================================ */
export const getModuleListNested = async (req, res) => {
  try {
    const { usertype_id } = req.query;

    const [rows] = await sequelize.query(
      `
      SELECT 
        m.module_id,
        m.module_name,
        m.parent_id,
        m.controller,
        m.action,
        m.namespace,
        m.url,
        m.icon_class,
        m.menu_order,
        m.status,

        utm.rule_id,
        utm.is_read,
        utm.is_write,
        utm.is_delete,
        utm.order_menu,
        utm.status AS permission_status
      FROM master_module_manager m
      LEFT JOIN usertype_module utm 
      ON utm.module_id = m.module_id AND utm.usertype_id = :usertype_id
      ORDER BY 
        m.parent_id ASC,
        (m.menu_order IS NULL) ASC,
        m.menu_order ASC,
        m.module_id ASC
      `,
      { replacements: { usertype_id: usertype_id || 0 } }
    );

    const map = {};
    const tree = [];

    rows.forEach((row) => {
      map[row.module_id] = {
        module_id: row.module_id,
        module_name: row.module_name,
        parent_id: row.parent_id,
        controller: row.controller,
        action: row.action,
        namespace: row.namespace,
        url: row.url,
        icon_class: row.icon_class,
        menu_order: row.menu_order,
        status: row.status,

        rule_id: row.rule_id ?? null,
        order_menu: row.order_menu ?? 0,
        permission_status: row.permission_status ?? 1,

        permissions: {
          read: row.is_read ?? 0,
          write: row.is_write ?? 0,
          delete: row.is_delete ?? 0,
        },

        children: [],
      };
    });

    rows.forEach((row) => {
      const node = map[row.module_id];

      if (row.parent_id === 0) {
        tree.push(node);
      } else if (map[row.parent_id]) {
        map[row.parent_id].children.push(node);
      }
    });

    return successResponse(res, "Module list loaded", tree);
  } catch (err) {
    return errorResponse(res, "Unable to fetch module list", err.message);
  }
};

/* ============================================================
   MODULE CRUD
============================================================ */
export const createModule = async (req, res) => {
  try {
    const {
      module_name,
      controller,
      namespace,
      action,
      parent_id = 0,
      menu_order = 0,
      icon_class = "",
      url = "/",
      status = 1,
      created_by = 1,
    } = req.body;

    const newModule = await MasterModuleManager.create({
      module_name,
      controller,
      namespace,
      action,
      parent_id,
      menu_order,
      icon_class,
      url,
      status,
      created_by,
      created_date: new Date(),
      modified_by: created_by,
      modified_date: new Date(),
    });

    return successResponse(res, "Module created successfully", newModule);
  } catch (err) {
    return errorResponse(res, "Failed to create module", err.message);
  }
};

export const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await MasterModuleManager.findOne({
      where: { module_id: id },
    });

    if (!module) {
      return errorResponse(res, "Module not found");
    }

    return successResponse(res, "Module loaded", module);
  } catch (err) {
    return errorResponse(res, "Unable to fetch module", err.message);
  }
};

export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      module_name,
      controller,
      namespace,
      action,
      parent_id,
      menu_order,
      icon_class,
      url,
      status,
      modified_by = 1,
    } = req.body;

    await MasterModuleManager.update(
      {
        module_name,
        controller,
        namespace,
        action,
        parent_id,
        menu_order,
        icon_class,
        url,
        status,
        modified_by,
        modified_date: new Date(),
      },
      { where: { module_id: id } }
    );

    return successResponse(res, "Module updated successfully");
  } catch (err) {
    return errorResponse(res, "Failed to update module", err.message);
  }
};

export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    await MasterModuleManager.destroy({
      where: { module_id: id },
    });

    return successResponse(res, "Module deleted successfully");
  } catch (err) {
    return errorResponse(res, "Failed to delete module", err.message);
  }
};

export const getAllModules = async (req, res) => {
  try {
    const modules = await MasterModuleManager.findAll({
      order: [["module_id", "ASC"]],
    });

    return successResponse(res, "Modules loaded", modules);
  } catch (err) {
    return errorResponse(res, "Unable to fetch modules", err.message);
  }
};
