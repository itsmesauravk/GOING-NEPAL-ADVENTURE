import Blog from "../../../models/blog.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 })
    if (!blogs || blogs.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "No Blogs Found" })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Blogs Fetched Successfully",
      data: blogs,
    })
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export default getAllBlogs
