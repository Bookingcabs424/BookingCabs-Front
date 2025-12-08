import BankAccount from "../models/userBankDetailModel.js";
import BankAccountLog from "../models/bankAccountLogModel.js";
import { MESSAGES, STATUS_CODE } from "../constants/const.js";
import { successResponse, errorResponse } from "../utils/response.js";
import CompanyDetail from "../models/companyDetailModel.js";
import company from "../routes/companyRotue.js";
import UserUploadDocument from "../models/userUploadDocumentModel.js";

export const addBankAccount = async (req, res) => {
  try {
    const data = req.body;
    const { id: user_id } = req.user;
    console.log(req.body);
    const companyData = await CompanyDetail.findOne({
      where: { user_id },
    });
    const bankAccount = await BankAccount.create({
      ...data,
      user_id,
      created_by: user_id,
      company_id: companyData?.id ?? 0,
      created_date: Date.now(),
    });

    return successResponse(res, MESSAGES.BANK.BANK_DETAIL, { bankAccount });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const updateBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { id: user_id } = req.user;

    const existing = await BankAccount.findOne({
      where: {
        bank_id: id,
        user_id,
        status: 1,
      },
    });

    if (!existing) {
      return errorResponse(
        res,
        MESSAGES.BANK.BANK_NOT_FOUND,
        MESSAGES.BANK.BANK_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    const oldData = existing.toJSON();
    const bankAccount = await existing.update({
      ...updateData,
      modified_by: user_id,
    });

    // Create log entry
    await BankAccountLog.create({
      bank_id: id,
      updated_by: user_id,
      previous_data: oldData,
      updated_data: updateData,
      ip: req.ip,
    });


    // === Handle UPI Image Upload ===
    if (updateData.upi_image) {
      const UPI_DOC_TYPE_ID = 29;

      // Find existing active UPI QR doc
      const existingUPI = await UserUploadDocument.findOne({
        where: {
          user_id: req.user.id,
          document_type_id: UPI_DOC_TYPE_ID,
          status: 1,
        },
      });

      if (existingUPI) {
        await existingUPI.update({ status: 0 });
      }

      await UserUploadDocument.create({
        user_id: req.user.id,
        document_type_id: UPI_DOC_TYPE_ID,
        doc_file_upload: updateData.upi_image, 
        status: 1,
        created_by: req.user.id,
      });
    }

    return successResponse(res, MESSAGES.BANK.BANK_UPDATED, { bankAccount });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getAllBankAccounts = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    console.log(user_id);

    const bankAccount = await BankAccount.findAll({
      where: {
        user_id,
      },
    });

    return successResponse(res, MESSAGES.BANK.USER_UPDATED, { bankAccount });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const softDeleteBankAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const { id: user_id } = req.user;

    const bankAccount = await BankAccount.findOne({
      where: {
        bank_id: id,
        user_id,
        // isDeleted: false,
      },
    });

    if (!bankAccount) {
      return errorResponse(
        res,
        MESSAGES.BANK.BANK_NOT_FOUND,
        MESSAGES.BANK.BANK_NOT_FOUND,
        STATUS_CODE.NOT_FOUND
      );
    }

    await bankAccount.update({ status: 0 });

    return successResponse(res, MESSAGES.BANK.BANK_DELETED);
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};

export const getBankDetailsById = async (req, res) => {
  const { bankId } = req.body;
  console.log(bankId);
  try {
    const bankDetails = await BankAccount.findOne({
      where: { user_id: req.user.id, bank_id: bankId },
    });
    const UPIQr = await UserUploadDocument.findOne({
      where: { user_id: req.user.id, status: 1, document_type_id: 29 },
    });
    return successResponse(res, MESSAGES.BANK.BANK_DETAIL, {
      ...bankDetails?.dataValues,
      upi_qr: UPIQr?.doc_file_upload,
    });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message,
      STATUS_CODE.SERVER_ERROR
    );
  }
};
