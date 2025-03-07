import express from "express";
import { addWellness, getAllWellness, getWellnessBySLug, editWellnessVisibility, deleteWellness, editWellness, } from "../controllers/wellness/index.js";
import uploader from "../utils/multer.js";
const router = express.Router();
const uploadFields = [
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
];
//
router.post("/add-wellness", uploader.fields(uploadFields), async (req, res, next) => {
    try {
        await addWellness(req, res);
    }
    catch (error) {
        next(error);
    }
});
// // get all wellness + filter + pagination + sorting
router.get("/all-wellness", async (req, res, next) => {
    try {
        await getAllWellness(req, res);
    }
    catch (error) {
        next(error);
    }
});
// // get single trek
// router.get("/trek/:id", async (req, res, next) => {
//   try {
//     await getSingleTrek(req as MulterRequest, res)
//   } catch (error) {
//     next(error)
//   }
// })
//get wellness by slug
router.get("/get-wellness/:slug", async (req, res, next) => {
    try {
        await getWellnessBySLug(req, res);
    }
    catch (error) {
        next(error);
    }
});
// Update wellness visibility
router.patch("/edit-wellness-visibility/:wellnessId", async (req, res, next) => {
    try {
        await editWellnessVisibility(req, res);
    }
    catch (error) {
        next(error);
    }
});
// delete
router.delete("/delete-wellness/:wellnessId", async (req, res, next) => {
    try {
        await deleteWellness(req, res);
    }
    catch (error) {
        next(error);
    }
});
// secure -Routes
//edit
router.put("/edit-wellness", uploader.fields(uploadFields), async (req, res, next) => {
    try {
        await editWellness(req, res);
    }
    catch (error) {
        next(error);
    }
});
// Export the router
export default router;
