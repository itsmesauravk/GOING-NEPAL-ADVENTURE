import Blog from "../../../models/blog.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { uploadFile, deleteImage } from "../../../utils/cloudinary.js"
import slug from "slug"

interface MulterRequest extends Request {
  file?: Express.Multer.File
}

interface BlogTypes {
  title?: string
  slug?: string
  description?: string
  links?: any
  blogImage?: string
}

const editBlog = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { id, title, description, links } = req.body
    const image = req.file

    // Check if blog exists
    const existingBlog = await Blog.findById(id)
    if (!existingBlog) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Blog not found" })
      return
    }

    // Prepare update object
    const updateData: BlogTypes = {}

    // Update title and slug if provided
    if (title) {
      updateData.title = title
      updateData.slug = slug(title)
    }

    // Update description if provided
    if (description) {
      updateData.description = description
    }

    // Update links if provided
    if (links) {
      try {
        updateData.links = JSON.parse(links)
      } catch (error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "Invalid links format" })
        return
      }
    }

    // Handle image upload if new image is provided
    if (image) {
      // Upload new image
      const uploadImage = await uploadFile(image.path, "blogs")
      if (!uploadImage) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "Error Uploading Image" })
        return
      }

      // Delete previous image if it exists
      if (existingBlog.blogImage) {
        try {
          await deleteImage(existingBlog.blogImage)
        } catch (error) {
          console.error("Error deleting previous image:", error)
        }
      }

      updateData.blogImage = uploadImage.secure_url
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )

    if (!updatedBlog) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Error Updating Blog" })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Blog Updated Successfully",
    })
  } catch (error) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error })
  }
}

export default editBlog
