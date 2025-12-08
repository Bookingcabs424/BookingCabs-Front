import Contact from "../models/contactModel.js";
import { upsertRecord } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";

// CREATE OR UPDATE (UPSERT)
export const upsertContact = async (req, res) => {
  try {
    const userId = req.user?.id || 0;
    req.body.ip = req.ip || "0.0.0.0";

    const result = await upsertRecord(Contact, req.body, userId);

    return successResponse(res, "Contact upsert successful", { result });
  } catch (error) {
    return errorResponse(res, "Error upserting contact", error.message);
  }
};

// GET ALL CONTACTS (OPTIONAL FILTERS)
export const getContacts = async (req, res) => {
  try {
    const {
      id,
      name,
      email,
      mobile,
      company,
      subject,
      status,
      ip,
      created_date,
    } = req.query;

    const where = {};

    if (id) where.id = id;
    if (name) where.name = name;
    if (email) where.email = email;
    if (mobile) where.mobile = mobile;
    if (company) where.company = company;
    if (subject) where.subject = subject;
    if (status) where.status = status;
    if (ip) where.ip = ip;
    if (created_date) where.created_date = created_date;

    const contacts = await Contact.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return successResponse(res, "Contacts retrieved successfully", contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);

    return errorResponse(res, "Failed to fetch contacts", error.message);
  }
};

// GET SINGLE CONTACT
export const getContactById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return errorResponse(res, "Contact ID is required");
    }

    const contact = await Contact.findOne({ where: { id } });

    if (!contact) {
      return errorResponse(res, "Contact not found");
    }

    return successResponse(res, "Contact retrieved successfully", contact);
  } catch (error) {
    return errorResponse(res, "Error fetching contact", error.message);
  }
};

// DELETE CONTACT (SOFT DELETE USING STATUS = 2)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return errorResponse(res, "Contact ID is required");
    }

    const contact = await Contact.findOne({ where: { id } });

    if (!contact) {
      return errorResponse(res, "Contact not found");
    }

    await Contact.update(
      { status: "2" }, // Soft delete
      { where: { id } }
    );

    return successResponse(res, "Contact deleted successfully");
  } catch (error) {
    return errorResponse(res, "Error deleting contact", error.message);
  }
};
