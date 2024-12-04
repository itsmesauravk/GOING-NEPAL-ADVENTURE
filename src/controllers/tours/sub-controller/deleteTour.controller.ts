import Tour from "../../../models/tour.model.js"
import { deleteImage } from "../../../utils/cloudinary.js"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"

export const deleteTour = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params

    const tour = await Tour.findById(tourId)

    if (!tour) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Tour not found" })
    }

    if (tour.thumbnail) {
      await deleteImage(tour.thumbnail)
    }

    if (tour.images.length > 0) {
      tour.images.map(async (image) => {
        await deleteImage(image)
      })
    }

    const deletedBlog = await Tour.findByIdAndDelete(tourId)

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
