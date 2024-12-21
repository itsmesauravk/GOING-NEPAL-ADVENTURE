import { Request, Response } from "express"
import Tour from "../../../models/tour.model.js"
import { StatusCodes } from "http-status-codes"

// Update  visibility

const editTourVisibility = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { tourId } = req.params
    // const { isNewItem } = req.body

    if (!tourId || !req.body) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Data is Invalid",
        error: "Invalid data",
      })
    }

    const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
      new: true,
    })
    if (!tour) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Tour not found",
        error: `Tour not found with id: ${tourId}`,
      })
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Tour visibility updated" })
  } catch (error: any) {
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: errorMessage,
    })
  }
}

export default editTourVisibility
