import Trekking from "../../../models/trekking.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const getTrekLocation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const treks = await Trekking.find({}).distinct("location")

    if (!treks || treks.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "No Locations Found" })
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Locations Found Success", data: treks })
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}

export default getTrekLocation
