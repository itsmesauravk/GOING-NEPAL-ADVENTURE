import { Request, Response } from "express"
import Blog from "../../../models/blog.model.js"
import { StatusCodes } from "http-status-codes"

// Update  visibility

const editBlogVisibility = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { blogId } = req.params
    // const { isNewItem } = req.body

    if (!blogId || !req.body) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Data is Invalid",
        error: "Invalid data",
      })
      return
    }

    const blog = await Blog.findByIdAndUpdate(blogId, req.body, {
      new: true,
    })
    if (!blog) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Blog not found",
        error: `Blog not found with id: ${blogId}`,
      })
      return
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Blog visibility updated" })
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: errorMessage,
    })
  }
}

export default editBlogVisibility
