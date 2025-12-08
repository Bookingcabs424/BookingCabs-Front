import UserVehicleUploadDocument from "../models/userVehicleUploadDocumentModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { MESSAGES, STATUS, STATUS_CODE } from "../constants/const.js";
import MasterDocumentType from "../models/masterDocumentModel.js";
// export const uploadUserVehicleDocument = async (req, res) => {
//   const data = req.body;
//   const {user_id} = data;
//   const {vehicle_id} = data
  
//   const created_by = user_id;

//   if(!user_id){
//     return errorResponse(res, "user_id is required");
//   }

//   try {
//     const createdData = await UserVehicleUploadDocument.create({
//       ...data,
//       user_id,
//       vehicle_id,
      
//       created_by,
//       doc_file_upload: req.file?.path || null,
//     });
//     return successResponse(res, MESSAGES.DOCUMENT.UPLOADED, {createdData});
//   } catch (error) {
//     return errorResponse(
//       res,
//       MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
//       error.message
//     );
//   }
// };


export const uploadUserVehicleDocument = async (req, res) => {
  const data = req.body;
  const {user_id, document_type_id, vehicle_id} = data;
  
  const created_by = user_id;

  if(!user_id){
    return errorResponse(res, "user_id is required");
  }

  if(!document_type_id){
    return errorResponse(res, "document_type_id is required");
  }

  try {
    // Check if document already exists
    const existingDoc = await UserVehicleUploadDocument.findOne({
      where: {
        user_id,
        vehicle_id,
        document_type_id
      }
    });

    let createdData;
    
    if(existingDoc) {
      // Update existing document
      createdData = await UserVehicleUploadDocument.update({
        ...data,
        doc_file_upload: req.file?.path || existingDoc.doc_file_upload,
        updated_by: created_by,
        updated_at: new Date()
      }, {
        where: {
          upload_doc_id: existingDoc.upload_doc_id
        },
        returning: true
      });

      // Get updated record
      createdData = await UserVehicleUploadDocument.findByPk(existingDoc.upload_doc_id);
    } else {
      // Create new document if doesn't exist
      createdData = await UserVehicleUploadDocument.create({
        ...data,
        user_id,
        vehicle_id,
        created_by,
        doc_file_upload: req.file?.path || null,
      });
    }

    return successResponse(res, MESSAGES.DOCUMENT.UPLOADED, {createdData});
  } catch (error) {
    return errorResponse(
      res, 
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};


export const getUserVehicleDocuments = async (req, res) => {
  try {
    const vehicle_id = req.query.vehicle_id || req.body.vehicle_id
    if(!vehicle_id){
      return errorResponse(res, "vehicle_id is required");
    }
   
    const docs = await UserVehicleUploadDocument.findAll({ where: { vehicle_id  }, include: [
        {
          model: MasterDocumentType,
          as: "documentType",
          attributes: ["document_name"], // only include the name
        },
      ], });
    return successResponse(res, MESSAGES.DOCUMENT.FETCHED, {docs});
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
    const pendingDocs = await UserVehicleUploadDocument.findAll({
      where: {
        user_id,
        doc_approval_status: false,
      },
    });
    return successResponse(res, MESSAGES.DOCUMENT.FECTHED, {pendingDocs});
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};

export const updateUserVehicleDocument = async (req, res) => {
  try {
    const { upload_doc_id } = req.params;
    const [updated] = await UserVehicleUploadDocument.update(req.body, {
      where: { upload_doc_id },
    });

    if (updated) {
      const updatedDoc = await UserVehicleUploadDocument.findByPk(upload_doc_id);
      return successResponse(res, MESSAGES.DOCUMENT.UPDATED, {updatedDoc});
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

export const getAllUserVehicleDocuments = async (req, res) => {
  try {
    const docs = await UserVehicleUploadDocument.findAll();
    return successResponse(res, MESSAGES.DOCUMENT.FECTHED, {docs});
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
    const pendingDocs = await UserVehicleUploadDocument.findAll({
      where: {
        doc_approval_status: false,
      },
    });
    return successResponse(res, MESSAGES.DOCUMENT.FECTHED, {pendingDocs});
  } catch (error) {
    return errorResponse(
      res,
      MESSAGES.GENERAL.SOMETHING_WENT_WRONG,
      error.message
    );
  }
};
