import CityPages from "../models/cityPagesModel.js";

// ===============================
// Get City Pages with Filters
// ===============================
export const getCityPages = async (req, res) => {
  try {
    const {
      id,
      city_id,
      company_setup_id,
      master_package_id,
      status,
      page = 1,
      limit = 20
    } = req.query;

    const whereClause = {};

    if (id) whereClause.id = id;
    if (city_id) whereClause.city_id = city_id;
    if (company_setup_id) whereClause.company_setup_id = company_setup_id;
    if (master_package_id) whereClause.master_package_id = master_package_id;
    if (status !== undefined) whereClause.status = status;

    const offset = (page - 1) * limit;

    const { count, rows } = await CityPages.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']]
    });

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No city pages found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      },
      filters: whereClause
    });

  } catch (error) {
    console.error("Error fetching city pages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


// ===============================
// Get Single City Page
// ===============================
export const getCityPageById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await CityPages.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "City page not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });

  } catch (error) {
    console.error("Error fetching city page:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


// ===============================
// Create or Update (Upsert)
// ===============================
export const createCityPage = async (req, res) => {
  try {
    const {
      id,
      city_id,
      company_setup_id,
      image_path,
      master_package_id,
      meta_desc,
      meta_keywords,
      meta_title,
      no_of_hotels,
      no_of_offers,
      no_of_sightseeing,
      page_desc,
      page_title,
      status = 1,
      ip
    } = req.body;

    const userId = req.user?.id;
    const now = new Date();

    if (!city_id || !company_setup_id || !master_package_id) {
      return res.status(400).json({
        success: false,
        message: "city_id, company_setup_id and master_package_id are required"
      });
    }

    let record;
    let created;

    if (id) {
      // UPDATE
      record = await CityPages.findByPk(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "City page not found",
        });
      }

      await record.update({
        city_id,
        company_setup_id,
        image_path,
        master_package_id,
        meta_desc,
        meta_keywords,
        meta_title,
        no_of_hotels,
        no_of_offers,
        no_of_sightseeing,
        page_desc,
        page_title,
        status,
        ip,
        modified_by: userId,
        modified_date: now,
      });

      created = false;

    } else {
      // CREATE
      record = await CityPages.create({
        city_id,
        company_setup_id,
        image_path,
        master_package_id,
        meta_desc,
        meta_keywords,
        meta_title,
        no_of_hotels,
        no_of_offers,
        no_of_sightseeing,
        page_desc,
        page_title,
        status,
        ip,
        created_by: userId,
        created_date: now,
        modified_by: userId,
        modified_date: now,
      });

      created = true;
    }

    return res.status(200).json({
      success: true,
      message: created ? "City page created successfully" : "City page updated successfully",
      data: record
    });

  } catch (error) {
    console.error("City page upsert error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


// ===============================
// Delete (Soft Delete or Hard Delete)
// ===============================
export const deleteCityPage = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await CityPages.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "City page not found",
      });
    }

    // Soft delete: status = 0
    await record.update({
      status: 0,
      modified_date: new Date()
    });

    return res.status(200).json({
      success: true,
      message: "City page deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting city page:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
