import express from "express";
const router = express.Router();
import { addNewClientDetails, deleteUserDetails, getUserDetails, } from "../controllers/userInfo/userInfo.controller.js";
router.get("/get", async (req, res) => {
    await getUserDetails(req, res);
});
router.post("/add", addNewClientDetails);
router.delete("/delete/:id", deleteUserDetails);
export default router;
