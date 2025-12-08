import express from "express";
import {
  createNewsletterUser,
  deleteNewsletterUser,
  getAllNewsletterUsers,
  updateNewsletterUser,
  updateNewsletterUserStatus,
  unsubscribeNewsletterUserMobile,
  subscribeNewsletterUserMobile,
  unsubscribeNewsletterUserEmail,
  subscribeNewsletterUserEmail,
  subscribeNewsletterUserEmailForMail,
} from "../controllers/newsletterUserController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/create", authenticate, createNewsletterUser);
newsletterRouter.post("/all-users", authenticate, getAllNewsletterUsers);
newsletterRouter.put("/update", authenticate, updateNewsletterUser);
newsletterRouter.put(
  "/update-status",
  authenticate,
  updateNewsletterUserStatus
);
newsletterRouter.put("/delete-user", authenticate, deleteNewsletterUser);

// Subscribe and Unsubscribe Routes
newsletterRouter.put(
  "/subscribe-mobile",
  authenticate,
  subscribeNewsletterUserMobile
);
newsletterRouter.put(
  "/unsubscribe-mobile",
  authenticate,
  unsubscribeNewsletterUserMobile
);
// Subscribe and Unsubscribe Routes
newsletterRouter.put(
  "/subscribe-email",
  authenticate,
  subscribeNewsletterUserEmail
);
newsletterRouter.put(
  "/unsubscribe-email",
  authenticate,
  unsubscribeNewsletterUserEmail
);

newsletterRouter.get(
  "/subscribe-email-for-mail",
  // authenticate,
  subscribeNewsletterUserEmailForMail
);
newsletterRouter.get(
  "/unsubscribe-email-for-mail",
  // authenticate,
  subscribeNewsletterUserEmailForMail
);

export default newsletterRouter;
