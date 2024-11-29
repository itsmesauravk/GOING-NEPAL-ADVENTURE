import Blog from "../../../models/blog.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { uploadFile } from "../../../utils/cloudinary.js"
import slug from "slug"

interface MulterRequest extends Request {
  file: Express.Multer.File
}

const addBlog = async (req: MulterRequest, res: Response) => {
  try {
    const { title, description } = req.body
    const image = req.file

    if (!title || !description || !image) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "All Fields Are Required" })
    }

    const uploadImage = await uploadFile(image.path, "blogs")

    if (!uploadImage) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Error Uploading Image" })
    }

    const blogSlug = slug(title)

    const newBlog = await Blog.create({
      title,
      slug: blogSlug,
      description,
      blogImage: uploadImage.secure_url,
    })

    if (!newBlog) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Error Creating Blog" })
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Blog Created Successfully" })
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export default addBlog
