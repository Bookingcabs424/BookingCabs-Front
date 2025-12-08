import PaymentType from "../models/paymentTypeModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS_CODE, STATUS } from "../constants/const.js";

export const getPaymentType = async (req, res) => {
  try {
    const paymentType = await PaymentType.findAll();
    if (!paymentType) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS.ERROR,
        STATUS_CODE.NOT_FOUND
      );
    }

    return successResponse(res, MESSAGES.SUCCESS,paymentType);
  } catch (error) {
    return errorResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updatePaymentType = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedPaymentType = await PaymentType.findByPk(id);

    if (!updatedPaymentType) {
      return errorResponse(
        res,
        MESSAGES.GENERAL.NOT_FOUND,
        MESSAGES.GENERAL.NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }
    await updatedPaymentType.update(updateData);
    return successResponse(res, MESSAGES.GENERAL.DATA_UPDATED);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.NOT_FOUND,
      error.message,
      STATUS_CODE.BAD_REQUEST
    );
  }
};

