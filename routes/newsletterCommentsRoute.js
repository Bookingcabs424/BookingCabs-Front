import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createNewsletterComment,
  getCommentsByNewsletterId,
  getNewsletterCommentById,
  updateNewsletterComment,
  deleteNewsletterComment,
} from "../controllers/newsletterCommentsController.js";

const router = express.Router();

router.route("/").post(authenticate, createNewsletterComment);

router.route("/:newsletter_id").get(authenticate, getCommentsByNewsletterId);

router.route("/comments/:id").get(authenticate, getNewsletterCommentById);

router.route("/").put(authenticate, updateNewsletterComment);

router.route("/").delete(authenticate, deleteNewsletterComment);

export default router;
