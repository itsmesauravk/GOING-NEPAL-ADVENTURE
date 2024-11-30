import Blog from "../../../models/blog.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export const getSingleBlog = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug
    if (!slug)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid Requres" })

    const blog = await Blog.findOne({ slug: slug })
    if (!blog)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Blog Not Found" })

    blog.blogViews = blog.blogViews + 1

    await blog.save()

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, message: "Blog Found Successfully", data: blog })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}
