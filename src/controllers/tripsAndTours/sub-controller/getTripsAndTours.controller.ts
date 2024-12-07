import TripsAndTours from "../../../models/tripsAndTours.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export const getTripsAndTours = async (req: Request, res: Response) => {
  try {
    const { select } = req.query

    let selectData = ""
    if (select && typeof select === "string") {
      selectData = select.split(",").join(" ")
    }

    const tripsAndTours = await TripsAndTours.find().select(selectData)
    if (!tripsAndTours || tripsAndTours.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Trips and tours not found" })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Trips and tours found",
      data: tripsAndTours,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}

export default getTripsAndTours
