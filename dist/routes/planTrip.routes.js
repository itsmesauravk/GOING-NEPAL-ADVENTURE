import express from "express";
import { createRequest, deleteRequest, getPendingTripRequestsCount, getSingleTripRequest, getTripRequests, sendMail, } from "../controllers/planTrip/index.js";
const router = express.Router();
import uploader from "../utils/multer.js";
const uploadFields = [{ name: "attachments", maxCount: 5 }];
//routes
router.post("/create-request", (req, res) => {
    createRequest(req, res);
});
router.get("/get-trip-requests", (req, res) => {
    getTripRequests(req, res);
});
router.get("/get-single-trip-request/:requestId", (req, res) => {
    getSingleTripRequest(req, res);
});
router.get("/total-pending-trip-requests", (req, res) => {
    getPendingTripRequestsCount(req, res);
});
router.post("/send-mail/:id", uploader.fields(uploadFields), (req, res) => {
    sendMail(req, res);
});
router.delete("/delete-request/:id", deleteRequest);
export default router;
