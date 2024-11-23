import { Request, Response } from "express"
import Wellness from "../../../models/wellness.model.js"
import { StatusCodes } from "http-status-codes"

// Update  visibility

const editWellnessVisibility = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { wellnessId } = req.params
    // const { isNewItem } = req.body

    if (!wellnessId || !req.body) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Data is Invalid",
        error: "Invalid data",
      })
    }

    const tour = await Wellness.findByIdAndUpdate(wellnessId, req.body, {
      new: true,
    })
    if (!tour) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Tour not found",
        error: `Tour not found with id: ${wellnessId}`,
      })
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Tour visibility updated" })
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}

export default editWellnessVisibility
