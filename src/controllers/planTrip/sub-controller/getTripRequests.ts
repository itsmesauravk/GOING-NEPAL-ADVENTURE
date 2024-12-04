import PlanTrip from "../../../models/planTrip.model.js"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const getTripRequests = async (req: Request, res: Response) => {
  try {
    const tripRequests = await PlanTrip.find()
    res.status(StatusCodes.OK).json({
      success: true,
      data: tripRequests,
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    })
  }
}

export default getTripRequests
