import express from "express";
const router = express.Router();
import uploader from "../utils/multer.js";
import { addBlog, deleteBlog, editBlog, editBlogVisibility, getAllBlogs, getSingleBlog, } from "../controllers/blogs/index.js";
//routes
router.post("/add-blog", uploader.single("image"), async (req, res, next) => {
    try {
        await addBlog(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get("/all-blogs", async (req, res, next) => {
    try {
        await getAllBlogs(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get("/get-blog-by-slug/:slug", async (req, res, next) => {
    try {
        await getSingleBlog(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete("/delete-blog/:id", async (req, res, next) => {
    try {
        await deleteBlog(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.patch("/edit-blog-visibility/:blogId", editBlogVisibility);
//edit blogs
router.put("/edit-blog", uploader.single("image"), editBlog);
export default router;
