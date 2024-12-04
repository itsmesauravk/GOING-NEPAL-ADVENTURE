import PlanTrip from "../../../models/planTrip.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const getPendingTripRequestsCount = async (req: Request, res: Response) => {
  try {
    const count = await PlanTrip.countDocuments({ status: "pending" })

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Pending trip requests count fetched successfully",
      data: count,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export default getPendingTripRequestsCount
