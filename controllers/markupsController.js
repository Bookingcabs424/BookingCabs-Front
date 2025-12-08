import sequelize from "../config/clientDbManager.js";
import { getUserHierarchy } from "./userController.js";
import { Op, QueryTypes } from "sequelize";

export const getMarkup = async (req, res) => {
  try {
    const {
      user_id,
      master_package_id,
      master_booking_type,
      markup_category,
      created_by,
      vehicle_type_id,
    } = req.body;
    const markupData = await Farewrapper.getmarkup({
      user_id,
      master_package_id,
      master_booking_type,
      markup_category,
    });
    if (markupData) {
      return res.status(200).json({ status: "success", data: markupData });
    } else {
      return res
        .status(404)
        .json({ status: "failed", message: "Markup not found" });
    }
  } catch (error) {
    throw new Error("Error in getMarkup: " + error);
  }
};

export const getAllAdminMarkup = async (req) => {
  try {
    const {
      city_id,
      user_id,
      master_package_id,
      master_booking_type,
      state_id,
      country_id,
      created_by,
      vehicle_type_id,
    } = req;
    // Get user hierarchy (parents)
    const userHierarchy = await getUserHierarchy(user_id, null, true);
    console.log({ userHierarchy });
    let finalMarkupData = [];
    let user_grade = "";
    if (userHierarchy && userHierarchy.length > 0) {
      // Loop from last parent to first
      for (let i = userHierarchy.length - 1; i >= 0; i--) {
        const datauser = userHierarchy[i];
        const id = datauser.id;
        user_grade = datauser.user_grade;
        if (id) {
          // You can call your getmarkup here if needed for each parent
          // let paramdata = { user_id: id, user_grade: user_grade };
          // finalMarkupData.push(await getmarkup(paramdata));
        }
      }
    }

    // Prepare params for each markup category
    const userParamData = {
      created_by,
      user_id,
      user_grade,
      master_package_id,
      master_booking_type,
      markup_category: 1,
      vehicle_type_id,
      company_id: process.env.COMPANY_SETUP_ID, //Company Upgrade
    };
    const cityParamData = {
      created_by,
      city_id,
      user_grade,
      master_package_id,
      master_booking_type,
      markup_category: 4,
      vehicle_type_id,
      company_id: process.env.COMPANY_SETUP_ID, //Company Upgrade
    };
    const stateParamData = {
      created_by,
      state_id,
      user_grade,
      master_package_id,
      master_booking_type,
      markup_category: 5,
      vehicle_type_id,
      company_id: process.env.COMPANY_SETUP_ID, //Company Upgrade
    };
    const countryParamData = {
      created_by,
      country_id,
      user_grade,
      master_package_id,
      master_booking_type,
      markup_category: 3,
      vehicle_type_id,
      company_id: process.env.COMPANY_SETUP_ID, //Company Upgrade
    };
    const userGradeData = {
      created_by,
      user_grade,
      master_package_id,
      master_booking_type,
      markup_category: 1,
      vehicle_type_id,
      company_id: process.env.COMPANY_SETUP_ID, //Company Upgrade
    };
    const bookingTypeParamData = {
      created_by,
      user_grade,
      master_package_id,
      master_booking_type,
      markup_category: 2,
      vehicle_type_id,
      company_id: process.env.COMPANY_SETUP_ID, //Company Upgrade
    };

    // Try user markup
    const userMarkupData = await getCompanyFareMarkupData(userParamData);
    if (userMarkupData && userMarkupData.user_id) {
      finalMarkupData.push(userMarkupData);
      return finalMarkupData;
    }

    // Try city markup
    const cityMarkupData = await getCompanyFareMarkupData(cityParamData);
    if (cityMarkupData && cityMarkupData.city_id) {
      finalMarkupData.push(cityMarkupData);
      return finalMarkupData;
    }

    // Try state markup
    const stateMarkupData = await getCompanyFareMarkupData(stateParamData);
    if (stateMarkupData && stateMarkupData.state_id) {
      finalMarkupData.push(stateMarkupData);
      return finalMarkupData;
    }

    // Try country markup
    const countryMarkupData = await getCompanyFareMarkupData(countryParamData);
    if (countryMarkupData && countryMarkupData.country_id) {
      finalMarkupData.push(countryMarkupData);
      return finalMarkupData;
    }

    // Try booking type markup
    const bookingTypeMarkupData = await getCompanyFareMarkupData(
      bookingTypeParamData
    );
    if (bookingTypeMarkupData && bookingTypeMarkupData.master_package_id) {
      finalMarkupData.push(bookingTypeMarkupData);
      return finalMarkupData;
    }

    // Fallback to user grade markup
    const userGradeMarkupData = await getCompanyFareMarkupData(userGradeData);
    if (userGradeMarkupData) {
      finalMarkupData.push(userGradeMarkupData);
      return finalMarkupData;
    }

    // If nothing found
    return [];
  } catch (error) {
    throw new Error("Error in getAllAdminMarkup: " + error);
  }
};

export const getCompanyFareMarkupData = async ({
  company_id,
  country_id,
  city_id,
  markp_type,
  master_package_id,
  user_id,
  user_grade,
  markup_id,
  created_by,
  master_booking_type_id,
  state_id,
  markup_category,
  vehicle_type_id,
}) => {
  try {
    let sql = `
            SELECT company_markup.*, company_setup.com_name, company_setup.comp_address,
                master_city.name as city_name, master_country.name as country_name,
                master_state.name as state_name, master_package.name as package_name,
                user.first_name, company_markup.user_grade, user_grade.grade_name
            FROM company_markup
            LEFT JOIN company_setup ON company_markup.company_id = company_setup.id
            LEFT JOIN master_city ON company_markup.city_id = master_city.id
            LEFT JOIN master_package ON company_markup.master_package_id = master_package.id
            LEFT JOIN master_country ON company_markup.country_id = master_country.id
            LEFT JOIN master_state ON company_markup.state_id = master_state.id
            LEFT JOIN user ON company_markup.user_id = user.id
            LEFT JOIN user_grade ON company_markup.user_grade = user_grade.id
            WHERE company_markup.status = 1
        `;

    const params = [];

    if (company_id) {
      sql += " AND company_markup.company_id = ?";
      params.push(company_id);
    }
    if (country_id) {
      sql += " AND company_markup.country_id = ?";
      params.push(country_id);
    }
    if (city_id) {
      sql += " AND company_markup.city_id = ?";
      params.push(city_id);
    }
    if (state_id) {
      sql += " AND company_markup.state_id = ?";
      params.push(state_id);
    }
    if (markp_type) {
      sql += " AND company_markup.markup_category = ?";
      params.push(markp_type);
    }
    if (master_package_id) {
      sql += " AND company_markup.master_package_id = ?";
      params.push(master_package_id);
    }
    if (markup_id) {
      sql += " AND company_markup.comp_markup_id = ?";
      params.push(markup_id);
    }
    if (user_id) {
      sql += " AND company_markup.user_id = ?";
      params.push(user_id);
    }
    if (user_grade) {
      sql += " AND company_markup.user_grade = ?";
      params.push(user_grade);
    }
    if (created_by) {
      sql += " AND company_markup.created_by = ?";
      params.push(created_by);
    }
    if (master_booking_type_id) {
      sql += " AND company_markup.master_booking_type_id = ?";
      params.push(master_booking_type_id);
    }
    if (markup_category) {
      sql += " AND company_markup.markup_category = ?";
      params.push(markup_category);
    }
    if (vehicle_type_id) {
      sql += " AND company_markup.vehicle_type_id = ?";
      params.push(vehicle_type_id);
    }

    sql += " ORDER BY company_markup.comp_markup_id DESC";

    const result = await sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
    });
    // console.log({result})
    var arrobj = {};
    if (result && result.length > 0) {
      let markupresult = result[0];

      let markupval = {
        markup_id: markupresult.comp_markup_id,
        user_id: markupresult.user_id,
        user_grade: markupresult.user_grade,
        city_id: markupresult.city_id,
        state_id: markupresult.state_id,
        country_id: markupresult.country_id,
        master_package_id: markupresult.master_package_id,
        markup_amt_base: markupresult.markup_amt_base,
        mark_amt_type: markupresult.mark_amt_type,
        basic_amt: markupresult.basic_amt,
        extra_km_markup: markupresult.extra_km_markup,
        extra_hr_markup: markupresult.extra_hr_markup,
        created_by: markupresult.created_by,
      };
      arrobj = markupval;
      return arrobj;
    } else {
      return (arrobj[user_id] = []);
    }
  } catch (err) {
    console.error("Error in getCompanyFareMarkupData:", err);
    return { status: "failed", error: err.message };
  }
};
