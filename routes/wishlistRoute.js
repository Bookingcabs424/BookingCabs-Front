import express from "express";
import {
  getWishlist,
  addOrUpdateWishlist,
  updateWishlist,
  deleteWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/:user_id", getWishlist);
router.post("/", addOrUpdateWishlist);
router.put("/:id", updateWishlist);
router.delete("/:id", deleteWishlist);

export default router;
