import express from "express";
import {
  createFriendFamily,
  getFriendFamilyList,
  updateFriendFamily,
  deleteFriendFamily,
} from "../controllers/friendFamilyController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const familyDetail = express.Router();
familyDetail.route("/add").post(authenticate, createFriendFamily);
familyDetail.route("/update/:id").put(authenticate, updateFriendFamily);
familyDetail.route("/list").get(authenticate, getFriendFamilyList);
familyDetail.route("/delete/:id").delete(authenticate, deleteFriendFamily);

export default familyDetail;
