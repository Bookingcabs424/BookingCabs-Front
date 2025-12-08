import UserUploadDocument from "../models/userUploadDocumentModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";

export const uploadUserDocument = async (req, res) => {
  const data = req.body;
  const { id: user_id } = req.user;
  const created_by = user_id;

  try {
    const createdData = await UserUploadDocument.create({
      ...data,
      user_id,
      created_by,
      doc_file_upload: req.file?.path || null,
    });
    return successResponse(res, MESSAGES.DOCUMENT.UPLOADED, { createdData });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getUserDocuments = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const docs = await UserUploadDocument.findAll({ where: { user_id } });
    return successResponse(res, MESSAGES.DOCUMENT.FECTHED, { docs });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getUserPendingDocuments = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const pendingDocs = await UserUploadDocument.findAll({
      where: {
        user_id,
        doc_approval_status: false,
      },
    });
    return successResponse(res, MESSAGES.DOCUMENT.FECTHED, { pendingDocs });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updateUserDocument = async (req, res) => {
  try {
    const { upload_doc_id, status } = req.body;

    if (!upload_doc_id || typeof status === "undefined") {
      return errorResponse(res, "Missing parameters.");
    }

    const [updated] = await UserUploadDocument.update(
      { status,doc_approval_status: 1 },
      { where: { upload_doc_id } }
    );

    if (updated) {
      const updatedDoc = await UserUploadDocument.findByPk(upload_doc_id);
      return successResponse(res, MESSAGES.DOCUMENT.UPDATED, { updatedDoc });
    } else {
      return errorResponse(res, MESSAGES.GENERAL.SOMETHING_WENT_WRONG);
    }
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getAllUserDocuments = async (req, res) => {
  try {
    const docs = await UserUploadDocument.findAll();
    return successResponse(res, MESSAGES.DOCUMENT.FECTHED, { docs });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const getAllUserPendingDocuments = async (req, res) => {
  try {
    const pendingDocs = await UserUploadDocument.findAll({
      where: {
        doc_approval_status: false,
      },
    });
    return successResponse(res, MESSAGES.DOCUMENT.FECTHED, { pendingDocs });
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};
