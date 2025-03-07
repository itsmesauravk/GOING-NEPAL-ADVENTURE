import express from "express";
import { createTripsAndTours, deleteTripsAndTours, getTripsAndTours, } from "../controllers/tripsAndTours/index.js";
import uploader from "../utils/multer.js";
const router = express.Router();
router.post("/create", uploader.single("image"), (req, res) => {
    createTripsAndTours(req, res);
});
router.get("/get", (req, res) => {
    getTripsAndTours(req, res);
});
router.delete("/delete/:id", (req, res) => {
    deleteTripsAndTours(req, res);
});
export default router;
