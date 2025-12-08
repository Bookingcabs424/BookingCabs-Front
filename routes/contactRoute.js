import express from "express";
import { deleteContact, getContactById, getContacts, upsertContact } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/add", upsertContact);
contactRouter.get("/all", getContacts);
contactRouter.get("/detail", getContactById);
contactRouter.post("/update", upsertContact);
contactRouter.delete("/delete", deleteContact);

export default contactRouter;
