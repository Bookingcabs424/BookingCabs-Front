import UserCreditLimit from "../models/userCreditLimitModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS_CODE } from "../constants/const.js";
import User from "../models/userModel.js";
import UserTransaction from "../models/userTransactionModel.js";
import sequelize from "../config/clientDbManager.js";
import { Sequelize } from "sequelize";

export const getUserCreditLimit = async (req, res) => {
  const { user_id, company_id } = req.body;
  const sql = `SELECT * from user_credit_balance WHERE id=:user_id`;

  const allUserCreditLimit = await sequelize.query(sql, {
    replacements: { user_id },
    type: sequelize.QueryTypes.SELECT,
  });

  if (allUserCreditLimit) {
    return successResponse(res, MESSAGES.CREATED_LIMIT.CREATED_LIMIT, {
      allUserCreditLimit,
    });
  } else {
    return errorResponse(
      res,
      MESSAGES.CREATED_LIMIT.NOT_FOUND,
      MESSAGES.CREATED_LIMIT.NOT_FOUND,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const updateStatus = async (req, res) => {
  const { id, status } = req.body;
  const { id: modified_by } = req.user;

  try {
    let creditLimit;

    if (Array.isArray(id)) {
      await Promise.all(
        id.map(async (singleId) => {
          await UserCreditLimit.update(
            { status, modified_by },
            { where: { id: singleId } }
          );
        })
      );
      creditLimit = true;
    } else {
      creditLimit = await UserCreditLimit.update(
        { status, modified_by },
        { where: { id } }
      );
    }

    if (creditLimit) {
      return successResponse(
        res,
        MESSAGES.CREATED_LIMIT.LIMIT_STATUS_UPDATED,
        creditLimit
      );
    } else {
      return errorResponse(
        res,
        MESSAGES.CREATED_LIMIT.NOT_FOUND,
        MESSAGES.CREATED_LIMIT.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const addCreditLimit = async (req, res) => {
  const { user_id, credit_limit_amount, from_date, to_date, status } = req.body;
  const created_date = new Date();
  try {
    const creditLimit = await UserCreditLimit.create({
      user_id,
      credit_limit_amount,
      from_date,
      to_date,
      status,
      created_date,
      created_by: req?.user?.id || 0,
      ip: req.ip,
    });
    return successResponse(res, MESSAGES.CREATED_LIMIT.LIMIT_DETAIL, {
      creditLimit,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updateCreditLimit = async (req, res) => {
  const { id, user_id, credit_limit_amount, from_date, to_date, status } =
    req.body;
  const { id: modified_by } = req.user;
  try {
    const creditLimit = await UserCreditLimit.update(
      { user_id, credit_limit_amount, from_date, to_date, modified_by },
      { where: { id } }
    );
    if (creditLimit) {
      return successResponse(res, MESSAGES.CREATED_LIMIT.LIMIT_UPDATED, {
        creditLimit,
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.CREATED_LIMIT.NOT_FOUND,
        MESSAGES.CREATED_LIMIT.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const approveCreditLimit = async (req, res) => {
  const { id, approved_status } = req.body;
  const { id: approved_by } = req.user;
  const updateData = UserCreditLimit.update(
    { approved_status, approved_by },
    { where: { id } }
  );
  try {
    if (updateData) {
      return successResponse(res, MESSAGES.CREATED_LIMIT.LIMIT_UPDATED, {
        updateData,
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.CREATED_LIMIT.NOT_FOUND,
        MESSAGES.CREATED_LIMIT.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const getAllUserCreditLimit = async (req, res) => {
  // const { company_id } = req.body;
  const sql = `SELECT 
     ucl.user_id,
     ucl.approved_status,
     ucl.created_date,
     ucl.credit_limit_amount,
     ucl.from_date,
     ucl.to_date,
     ucl.status,
     CONCAT(u.first_name, ' ', u.last_name) AS name,
     CONCAT(ui.first_name, ' ', ui.last_name) AS approved_by,
     u.email,
     u.mobile
     FROM user_credit_limit ucl
     LEFT OUTER JOIN user u ON ucl.user_id = u.id
     LEFT OUTER JOIN user ui ON ucl.approved_by = ui.id
     WHERE ucl.status <> 2 `;

  const allUserCreditLimit = await sequelize.query(sql, {
    // replacements: { company_id },
    type: sequelize.QueryTypes.SELECT,
  });

  if (allUserCreditLimit) {
    return successResponse(res, MESSAGES.CREATED_LIMIT.CREATED_LIMIT, {
      allUserCreditLimit,
    });
  } else {
    return errorResponse(
      res,
      MESSAGES.CREATED_LIMIT.NOT_FOUND,
      MESSAGES.CREATED_LIMIT.NOT_FOUND,
      STATUS_CODE.NOT_FOUND
    );
  }
};

export const walletAmount = async (req, res, next) => {
  try {
    const userId = req.user?.id || 2; // fallback to 2 for dev/testing
    const result = await walletAmountService(userId);

    if (result) {
      return successResponse(res, MESSAGES.GENERAL.DATA_FETCHED, { result });
    } else {
      return errorResponse(
        res,
        MESSAGES.WALLET.WALLET_NOT_FOUND,
        MESSAGES.WALLET.WALLET_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

export const userwalletAmount = async function (req, res,socketCall=false) {
  try {
    const user = await User.findOne({
      where: { id:socketCall? req: req.body.user_id },
      attributes: [
        ["id", "user_id"],
        "wallet_amount",
        [
          Sequelize.literal(`(
                    SELECT 
                        SUM(CASE WHEN ut.action_type = 'Credit' THEN ut.amount ELSE 0 END)
                        - SUM(CASE WHEN ut.action_type = 'Debit' THEN ut.amount ELSE 0 END)
                    FROM user_transaction ut
                    WHERE ut.user_id = user.id
                )`),
          "credit_balance",
        ],
      ],
    });

    if (user) {
      if (socketCall) {
        return user; // Return user object for socket call
      }
      return successResponse(res, MESSAGES.CREATED_LIMIT.LIMIT_UPDATED, {
        user,
      });
    } else {
      return errorResponse(
        res,
        MESSAGES.WALLET.WALLET_NOT_FOUND,
        MESSAGES.WALLET.WALLET_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
  } catch (err) {
    console.error(err);
    const res = { status: "failed", error: err.message };
    cb(null, res);
  }
};
export const walletAmountService = async (userId) => {
  const results = await sequelize.query(
    `SELECT 
      COALESCE(SUM(CASE WHEN action_type = 'Credit' THEN amount ELSE 0 END), 0) - 
      COALESCE(SUM(CASE WHEN action_type = 'Debit' THEN amount ELSE 0 END), 0) AS credit_balance
    FROM user_transaction
    WHERE user_id = :userId`,
    {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return results;
};

