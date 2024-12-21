import express from "express"
const router = express.Router()

import uploader from "../utils/multer.js"

import {
  addBlog,
  deleteBlog,
  editBlogVisibility,
  getAllBlogs,
  getSingleBlog,
} from "../controllers/blogs/index.js"

interface MulterRequest extends express.Request {
  file: Express.Multer.File
}

//routes
router.post("/add-blog", uploader.single("image"), async (req, res, next) => {
  try {
    await addBlog(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

router.get("/all-blogs", async (req, res, next) => {
  try {
    await getAllBlogs(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

router.get("/get-blog-by-slug/:slug", async (req, res, next) => {
  try {
    await getSingleBlog(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

router.delete("/delete-blog/:id", async (req, res, next) => {
  try {
    await deleteBlog(req as MulterRequest, res)
  } catch (error) {
    next(error)
  }
})

router.patch("/edit-blog-visibility/:blogId", editBlogVisibility)

export default router
