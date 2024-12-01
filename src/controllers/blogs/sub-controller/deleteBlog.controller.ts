import Blog from "../../../models/blog.model.js"
import { deleteImage } from "../../../utils/cloudinary.js"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const blog = await Blog.findById(id)

    if (!blog) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Blog not found" })
    }

    if (blog.blogImage) {
      await deleteImage(blog.blogImage)
    }

    const deletedBlog = await Blog.findByIdAndDelete(id)

    if (!deletedBlog) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Error deleting Blog" })
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Blog deleted successfully" })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}
