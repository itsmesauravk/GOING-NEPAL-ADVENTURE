import { Request, Response } from "express"
import Wellness from "../../../models/wellness.model.js"
import { StatusCodes } from "http-status-codes"
import { deleteImage } from "../../../utils/cloudinary.js"

// Deleting single trek
const deleteWellness = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.trekId
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid Request",
      })
    }

    const wellness = await Wellness.findById(id)

    if (wellness?.thumbnail) {
      await deleteImage(wellness.thumbnail)
    }

    if (wellness && wellness.images && wellness.images.length > 0) {
      wellness.images.map(async (image) => {
        await deleteImage(image)
      })
    }

    const wellnessDelete = await Wellness.findByIdAndDelete(id)

    if (!wellnessDelete) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No Wellness found",
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Wellness deleted Successfully",
    })
  } catch (error: any) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}

export default deleteWellness
