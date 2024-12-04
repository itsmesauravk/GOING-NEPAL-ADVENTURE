import PlanTrip from "../../../models/planTrip.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const getSingleTripRequest = async (req: Request, res: Response) => {
  try {
    const tripRequest = await PlanTrip.findById(req.params.requestId)

    if (!tripRequest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Plan Trip request not found",
      })
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Request found",
      data: tripRequest,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

export default getSingleTripRequest
