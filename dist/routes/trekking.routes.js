import express from "express";
import { addTrek, getSingleTrek, getTrek, deleteTrek, getTrekBySlug, editTrekVisibility, getTrekLocation, editTrek, } from "../controllers/trekkings/index.js";
import uploader from "../utils/multer.js";
const router = express.Router();
const uploadFields = [
    { name: "thumbnail", maxCount: 1 },
    { name: "routemapimage", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "trekPdf", maxCount: 1 },
];
//
router.post("/add-trek", uploader.fields(uploadFields), async (req, res, next) => {
    try {
        await addTrek(req, res);
    }
    catch (error) {
        next(error);
    }
});
// get all trek + filter + pagination + sorting
router.get("/treks", async (req, res, next) => {
    try {
        await getTrek(req, res);
    }
    catch (error) {
        next(error);
    }
});
// get single trek
router.get("/trek/:id", async (req, res, next) => {
    try {
        await getSingleTrek(req, res);
    }
    catch (error) {
        next(error);
    }
});
//get trek by slug
router.get("/get-trek/:slug", async (req, res, next) => {
    try {
        await getTrekBySlug(req, res);
    }
    catch (error) {
        next(error);
    }
});
// delete trek
router.delete("/delete-trek/:trekId", async (req, res, next) => {
    try {
        await deleteTrek(req, res);
    }
    catch (error) {
        next(error);
    }
});
// edit trek visibility
router.patch("/edit-trek-visibility/:trekId", async (req, res, next) => {
    try {
        await editTrekVisibility(req, res);
    }
    catch (error) {
        next(error);
    }
});
//get trek locations
router.get("/get-trek-location", async (req, res, next) => {
    try {
        await getTrekLocation(req, res);
    }
    catch (error) {
        next(error);
    }
});
// Secure - Routes
//edit trek
router.put("/edit-trek", uploader.fields(uploadFields), async (req, res, next) => {
    try {
        await editTrek(req, res);
    }
    catch (error) {
        next(error);
    }
});
// Export the router
export default router;
