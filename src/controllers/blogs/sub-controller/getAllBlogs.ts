import Blog from "../../../models/blog.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

import { BlogQueryObjectType } from "../../../utils/types.js"

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { sort, search, visibility } = req.query

    const queryObject: BlogQueryObjectType = {}

    if (search) {
      queryObject.title = { $regex: search, $options: "i" } as any
    }

    if (visibility && typeof visibility === "string") {
      queryObject[visibility] = "true" as string
    }

    let blog = Blog.find(queryObject)

    // sorting = -price,createdAt

    let sorting = ""

    if (sort && typeof sort === "string") {
      sorting = sort.split(",").join(" ")
      if (sorting) {
        blog = blog.sort(sorting)
      }
    }

    let page = Number(req.query.page) || 1
    let limit = Number(req.query.limit) || 10
    let skip = (page - 1) * limit

    const blogs = await blog.skip(skip).limit(limit)

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
