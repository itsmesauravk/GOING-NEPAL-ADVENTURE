import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import Tour from "../../../models/tour.model.js"

const getTourRegions = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const tours = await Tour.find({}).distinct("location")

    if (!tours || tours.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "No Location Found" })
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Locations Found Success", data: tours })
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export default getTourRegions
