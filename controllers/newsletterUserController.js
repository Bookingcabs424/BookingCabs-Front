import { Op } from "sequelize";
import NewsletterUser from "../models/newsletteruserModel.js"; // Assuming the Sequelize model is created
import { errorResponse, successResponse } from "../utils/response.js";

// Controller function to create a new newsletter user
export const createNewsletterUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      mobile,
      city_id,
      city_name,
      address,
      pin_code,
      user_type_id,
      email_subscription,
      mobile_subscription,
      created_by = req.user.id,
      unsubscribe_reason,
      source,
    } = req.body;

    console.log(req.body);

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !email ||
      !mobile
      // !city_id ||
      // !address ||
      // !pin_code ||
      // !created_by
    ) {
      return errorResponse(res, "Missing required fields", null, 400);
    }

    // Additional validation (optional)
    if (!/^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return errorResponse(res, "Invalid email format", null, 400);
    }

    if (!/^\d{10}$/.test(mobile)) {
      return errorResponse(
        res,
        "Invalid mobile number. It should be 10 digits",
        null,
        400
      );
    }

    // Check if the email already exists
    const existingUser = await NewsletterUser.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "Email is already registered", null, 409);
    }

    const userIp = req.ip || req.connection.remoteAddress || "0.0.0.0";
    

    // Create the new user in the database
    const newUser = await NewsletterUser.create({
      first_name,
      last_name,
      email,
      mobile,
      city_id,
      city_name,
      address,
      pin_code,
      email_subscription,
      user_type_id,
      mobile_subscription,
      created_by: created_by || null,
      status: "Pending",
      created_date: new Date(),
      ip: userIp,
      unsubscribe_reason,
      source,
      user_id: req.user.id,
    });

    // Return success response
    return successResponse(res, "User created successfully", newUser, 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error creating user", err, 500);
  }
};

// Controller function to get all newsletter users with optional filtering
export const getAllNewsletterUsers = async (req, res) => {
  try {
    const {
      email_subscription,
      mobile_subscription,
      first_name,
      last_name,
      email,
      mobile,
      city_name,
    } = req.body;

    console.log(req.body);

    const where = {};
    if (email_subscription) {
      where.email_subscription = email_subscription;
    }
    if (mobile_subscription) {
      where.mobile_subscription = mobile_subscription;
    }
    if (first_name) {
      where.first_name = first_name;
    }
    if (last_name) {
      where.last_name = last_name;
    }
    if (email) {
      where.email = email;
    }
    if (mobile) {
      where.mobile = { [Op.like]: `%${mobile}%` };
    }
    if (city_name) {
      where.city_name = city_name;
    }

    const users = await NewsletterUser.findAll({ where });

    return successResponse(res, "Users retrieved successfully", users, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error retrieving users", err, 500);
  }
};

// Controller function to update a newsletter user's details
export const updateNewsletterUser = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    console.log(req.body, id);

    const user = await NewsletterUser.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    await user.update(updateData);
    return successResponse(res, "User updated successfully", user, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error updating user", err, 500);
  }
};

// Controller function to delete a newsletter user
export const deleteNewsletterUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await NewsletterUser.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    await user.destroy();
    return successResponse(res, "User deleted successfully", null, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error deleting user", err, 500);
  }
};

// Controller function to update a newsletter user's subscription status
export const updateNewsletterUserStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    console.log(req.body);

    const user = await NewsletterUser.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    user.status = status;
    await user.save();

    return successResponse(res, "User status updated successfully", user, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error updating user status", err, 500);
  }
};

// Controller function to subscribe a user email
export const subscribeNewsletterUserEmail = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await NewsletterUser.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    user.email_subscription = "Active";
    await user.save();

    return successResponse(res, "User subscribed successfully", user, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error subscribing user", err, 500);
  }
};

// Controller function to unsubscribe a user email
export const unsubscribeNewsletterUserEmail = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await NewsletterUser.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    user.email_subscription = "In-Active";
    await user.save();

    return successResponse(res, "User unsubscribed successfully", user, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error unsubscribing user", err, 500);
  }
};

// Controller function to subscribe a user mobile
export const subscribeNewsletterUserMobile = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await NewsletterUser.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    user.mobile_subscription = "Active";
    await user.save();

    return successResponse(res, "User subscribed successfully", user, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error subscribing user", err, 500);
  }
};

// Controller function to unsubscribe a user mobile
export const unsubscribeNewsletterUserMobile = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await NewsletterUser.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    user.mobile_subscription = "In-Active";
    await user.save();

    return successResponse(res, "User unsubscribed successfully", user, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error unsubscribing user", err, 500);
  }
};

// Controller function to subscribe a user email
export const subscribeNewsletterUserEmailForMail = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.query;
    console.log(req.query);

    // const user = await NewsletterUser.findByPk(id);
    const user = await NewsletterUser.findOne({
      where: { email: email },
    });

    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    user.email_subscription = "Active";
    await user.save();

    return successResponse(res, "User subscribed successfully", user, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error subscribing user", err, 500);
  }
};

// Controller function to unsubscribe a user email
export const unsubscribeNewsletterUserEmailForMail = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.query;
    console.log(req.query);

    // const user = await NewsletterUser.findByPk(id);
    const user = await NewsletterUser.findOne({
      where: { email: email },
    });

    if (!user) {
      return errorResponse(res, "User not found", null, 404);
    }

    user.email_subscription = "In-Active";
    await user.save();

    return successResponse(res, "User Unsubscribed successfully", user, 200);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error unsubscribing user", err, 500);
  }
};
