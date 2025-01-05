import { Request, Response } from "express"
import Wellness from "../../../models/wellness.model.js"
import { uploadFile } from "../../../utils/cloudinary.js"
import { StatusCodes } from "http-status-codes"

// Getting single wellness by slug

const getWellnessBySLug = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const slug = req.params.slug

    const wellness = await Wellness.findOne({ slug })

    if (!wellness) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No Wellness found",
      })
    }

    if (wellness) {
      wellness.viewsCount += 1
      await wellness.save()
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Tour found",
      data: wellness,
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}

export default getWellnessBySLug
