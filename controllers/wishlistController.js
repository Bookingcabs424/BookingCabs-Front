import Wishlist from "../models/wishlistModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS_CODE } from "../constants/const.js";
import sequelize from "../config/clientDbManager.js";

export const getWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;

    const wishlist = await sequelize.query(
      `
      SELECT w.*, c.name
      FROM wishlist w
      LEFT JOIN master_city c ON w.pref_city = c.id
      WHERE w.user_id = :user_id
      AND w.is_deleted = 0
      ORDER BY w.id DESC
      `,
      {
        replacements: { user_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { wishlist });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

// export const addOrUpdateWishlist = async (req, res) => {
//   try {
//     const { package_id, pref_city, user_id } = req.body;
//     const packageIds = package_id.split(",").map((id) => id.trim());
//     const prefCities = pref_city.split(",").map((city) => city.trim());

//     const results = [];

//     for (const pkgId of packageIds) {
//       for (const city of prefCities) {
//         await Wishlist.update(
//           { is_deleted: 1 },
//           {
//             where: {
//               package_id: pkgId,
//               pref_city: city,
//               user_id,
//               is_deleted: 0,
//             },
//           }
//         );
//         const newEntry = await Wishlist.create({
//           package_id: pkgId,
//           pref_city: city,
//           user_id,
//           is_deleted: 0,
//         });

//         results.push(newEntry);
//       }
//     }

//     return successResponse(res, MESSAGES.GENERAL.DATA_ADDED, { results });
//   } catch (error) {
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error.message,
//       STATUS_CODE.NOT_FOUND
//     );
//   }
// };

export const addOrUpdateWishlist = async (req, res) => {
  try {
    const { package_id, pref_city, user_id, entry_group } = req.body;

    if (!package_id || !pref_city || !user_id) {
      return errorResponse(
        res,
        "Missing required fields: package_id, pref_city, or user_id",
        null,
        STATUS_CODE.BAD_REQUEST
      );
    }
    const group = entry_group || 1;
    const packageIds = package_id
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    const cityIds = pref_city
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    await Wishlist.update(
      { is_deleted: 1 },
      { where: { user_id, entry_group: group, is_deleted: 0 } }
    );

    const results = [];

    for (const pkgId of packageIds) {
      for (const cityId of cityIds) {
        const newEntry = await Wishlist.create({
          package_id: pkgId,
          pref_city: cityId,
          user_id,
          entry_group,
          is_deleted: 0,
        });
        results.push(newEntry);
      }
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_ADDED, { results });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const [affectedRows] = await Wishlist.update(req.body, {
      where: { id, is_deleted: 0 },
    });

    if (!affectedRows) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        "Wishlist item not found",
        STATUS_CODE.NOT_FOUND
      );
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED, {
      updated: affectedRows,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const deleteWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const [affectedRows] = await Wishlist.update(
      { is_deleted: 1 },
      { where: { id } }
    );

    if (!affectedRows) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        "Wishlist item not found",
        STATUS_CODE.NOT_FOUND
      );
    }

    return successResponse(res, MESSAGES.GENERAL.DATA_DELETED, { id });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};
